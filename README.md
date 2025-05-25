# PokeBase

A modern web application for Pokémon enthusiasts to track their collections, connect with friends, and trade Pokémon.

## Features

- **User Authentication**

  - Email/Password sign up and login
  - Google OAuth integration
  - Email verification for new accounts
  - Protected routes for authenticated users

- **Email Verification**

  - Secure OTP (One-Time Password) verification
  - Resend verification email
  - Protected routes for verified users only

- **User Interface**
  - Responsive design for all devices
  - Modern and intuitive interface
  - Toast notifications for user feedback

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **Email Service**: Mailgun
- **Deployment**: Vercel

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/pokebase"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email Service
MAILGUN_API_KEY="your-mailgun-api-key"
MAILGUN_DOMAIN="your-mailgun-domain"
```

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/pokebase.git
   cd pokebase
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. Set up the database:

   ```bash
   npx prisma migrate dev --name init
   ```

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Email Verification Flow

1. User signs up with email and password
2. System sends a verification email with a 6-digit OTP
3. User enters the OTP on the verification page
4. Upon successful verification, user is redirected to the dashboard
5. If email is not verified, user sees a notice in the navigation bar

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
