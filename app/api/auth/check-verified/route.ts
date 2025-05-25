import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'No user found with this email' }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified !== null,
    });
  } catch (error) {
    console.error('Error checking email verification status:', error);
    return NextResponse.json(
      { error: 'Failed to check email verification status' },
      { status: 500 }
    );
  }
}
