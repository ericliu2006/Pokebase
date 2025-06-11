import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { cardId, quality, forSale, price, notes } = await request.json();

    const userCard = await prisma.userCard.create({
      data: {
        userId: session.user.id,
        cardId,
        quality: quality ?? 'MINT',
        forSale: forSale ?? false,
        price: price ?? null,
        notes: notes ?? '',
      },
    });

    return NextResponse.json({
      message: 'Added card to your collection!',
    });
  } catch (error) {
    console.error('Error adding user card:', error);
    return NextResponse.json(
      {
        error: 'Failed to add user card',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
