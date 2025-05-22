import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';

// Verify OTP
// POST /api/auth/verify-otp
// Body: { email: string, token: string }
export async function POST(req: Request) {
  try {
    const { email, token } = await req.json();

    if (!email || !token) {
      return NextResponse.json(
        { error: 'Email and token are required' },
        { status: 400 }
      );
    }

    // Find the verification token using the token value
    const verificationToken = await prisma.emailVerificationToken.findFirst({
      where: { 
        email: email.toLowerCase(),
        token: token,
      },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'No verification request found for this email' },
        { status: 404 }
      );
    }

    // Check if token is expired
    if (new Date() > verificationToken.expires) {
      return NextResponse.json(
        { error: 'Verification token has expired' },
        { status: 400 }
      );
    }

    // Check if token matches
    if (verificationToken.token !== token) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Update user as verified
    const updatedUser = await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationExpires: null,
      },
    });

    // Delete the used verification token
    await prisma.emailVerificationToken.delete({
      where: { id: verificationToken.id },
    });

    // Get the user's password for sign-in
    const userWithPassword = await prisma.user.findUnique({
      where: { id: updatedUser.id },
      select: { password: true }
    });

    if (!userWithPassword?.password) {
      throw new Error('User password not found');
    }

    // Return the user data and a flag to indicate successful verification
    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        emailVerified: updatedUser.emailVerified,
      },
      // Include the password for client-side sign-in
      password: userWithPassword.password,
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
