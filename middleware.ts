import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// List of public paths that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/signup',
  '/verify-email',
  '/verification-success',
  '/_next',
  '/favicon.ico',
  '/api/auth',
  '/images',
  '/_vercel',
  '/site.webmanifest',
  '/sitemap.xml',
  '/robots.txt'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public paths
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Skip middleware for API routes and static files
  if (
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname.startsWith('/_next/')
  ) {
    return NextResponse.next();
  }

  // Get the token from the request
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });

  // Redirect to login if not authenticated
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check if email is verified for authenticated users
  if (token.email && !token.emailVerified && !pathname.startsWith('/verify-email')) {
    const verifyEmailUrl = new URL('/verify-email', request.url);
    verifyEmailUrl.searchParams.set('email', token.email);
    verifyEmailUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(verifyEmailUrl);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\..*).*)',
  ],
};
