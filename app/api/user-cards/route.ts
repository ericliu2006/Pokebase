import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userCards = await prisma.userCard.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        card: {
          include: {
            set: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(userCards);
  } catch (error) {
    console.error('Error fetching user cards:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
