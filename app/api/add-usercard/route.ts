import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { cardId, quality, forSale, price, notes } = await request.json();

    // const userCard = await prisma.userCard.upsert({
    //   where: {
    //     id: cardId,
    //   },
    //   create: {
    //     cardId,
    //     quality,
    //     forSale,
    //     price,
    //     notes,
    //   },
    //   update: {
    //     cardId,
    //     quality,
    //     forSale,
    //     price,
    //     notes,
    //   },
    // });

    return NextResponse.json({
      cardId,
      quality,
      forSale,
      price,
      notes,
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
