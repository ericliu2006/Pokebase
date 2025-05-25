import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOTP, sendVerificationEmail } from '@/lib/email';

// Send verification email
// POST /api/auth/verify-email
// Body: { email: string }
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: 'No user found with this email' }, { status: 404 });
    }

    // Check if user is already verified
    if (user.emailVerified) {
      return NextResponse.json({ error: 'Email is already verified' }, { status: 400 });
    }

    // Generate OTP (6 digits)
    const otp = generateOTP(6);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

    // Check if a token already exists for this email
    const existingToken = await prisma.emailVerificationToken.findFirst({
      where: { email: email.toLowerCase() },
    });

    if (existingToken) {
      // Update existing token
      await prisma.emailVerificationToken.update({
        where: { id: existingToken.id },
        data: {
          token: otp,
          expires: expiresAt,
        },
      });
    } else {
      // Create new token
      await prisma.emailVerificationToken.create({
        data: {
          email: email.toLowerCase(),
          token: otp,
          expires: expiresAt,
          userId: user.id,
        },
      });
    }

    // Send verification email
    await sendVerificationEmail(email, otp);

    return NextResponse.json({
      message: 'Verification email sent successfully',
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 });
  }
}
