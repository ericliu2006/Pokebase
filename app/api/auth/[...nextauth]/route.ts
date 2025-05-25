import NextAuth, {
  type NextAuthOptions,
  type DefaultSession,
  type User as NextAuthUser,
  type Profile,
  type Account,
  type Session,
  type TokenSet,
} from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          throw new Error('Email is required');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user) {
          throw new Error('No user found with this email');
        }

        // If password is provided, verify it
        if (credentials.password) {
          if (!user.password) {
            throw new Error('No password set for this account');
          }
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error('Invalid email or password');
          }
        } else if (!user.emailVerified) {
          throw new Error('Please verify your email first');
        }

        // If we got here, the user is either:
        // 1. Logging in with correct password, or
        // 2. Completing email verification (no password check needed)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  callbacks: {
    // Session callback is defined in the JWT callback below
    async signIn(params: any) {
      const { user, account, profile } = params;

      // Skip if this is an email verification request
      if (params?.email?.verificationRequest) return true;

      // Type assertion for profile to access its properties
      const profileData = profile as any;
      // For OAuth providers, automatically verify their email
      if (account?.provider !== 'credentials' && user?.email) {
        try {
          // First, check if a user with this email already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (existingUser) {
            // If user exists, ensure they have an account with this provider
            const existingAccount = await prisma.account.findFirst({
              where: {
                userId: existingUser.id,
                provider: account?.provider,
                providerAccountId: account?.providerAccountId,
              },
            });

            if (!existingAccount) {
              // Link the account if it doesn't exist
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: 'oauth',
                  provider: account?.provider || '',
                  providerAccountId: account?.providerAccountId || '',
                  refresh_token: account?.refresh_token,
                  access_token: account?.access_token,
                  expires_at: account?.expires_at,
                  token_type: account?.token_type,
                  scope: account?.scope,
                  id_token: account?.id_token,
                },
              });
            }

            // Update user info if needed
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                emailVerified: new Date(),
                ...(!existingUser.name && profileData?.name && { name: String(profileData.name) }),
                ...(!existingUser.image &&
                  profileData?.image && { image: String(profileData.image) }),
              },
            });

            // Update the user object with the existing user's ID
            user.id = existingUser.id;
          } else {
            // Create new user with OAuth account
            const newUser = await prisma.user.create({
              data: {
                email: user.email,
                emailVerified: new Date(),
                name: profileData?.name || user.name || user.email?.split('@')[0] || 'User',
                image: profileData?.image || user.image || null,
                password: '', // This will be hashed by the adapter
                accounts: {
                  create: {
                    type: 'oauth',
                    provider: account?.provider || '',
                    providerAccountId: account?.providerAccountId || '',
                    refresh_token: account?.refresh_token,
                    access_token: account?.access_token,
                    expires_at: account?.expires_at,
                    token_type: account?.token_type,
                    scope: account?.scope,
                    id_token: account?.id_token,
                  },
                },
              },
            });
            user.id = newUser.id;
          }
        } catch (error) {
          console.error('Error in OAuth sign-in:', error);
          return false;
        }
      }
      return true;

      // For credentials login, check if email is verified
      if (account?.provider === 'credentials' && user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { emailVerified: true },
        });

        if (!dbUser?.emailVerified) {
          // User exists but email is not verified
          throw new Error('Please verify your email before signing in');
        }
      }

      return true;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.emailVerified = token.emailVerified;
      }
      return session;
    },
    async jwt({ token, user, account }: { token: any; user?: any; account?: any }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email,
          picture: user.image,
          emailVerified: user.emailVerified,
        };
      }

      // For subsequent requests, return the token as is
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
