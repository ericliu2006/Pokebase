import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const query = decodeURIComponent(request.url.split('search?query=')[1]);
    if (query.length < 3) return NextResponse.json([]);
    const terms = query.split(/\s+/).filter(Boolean);

    const cards = await prisma.card.findMany({
      where: {
        AND: terms.map(term => ({
          OR: [
            { name: { contains: term, mode: 'insensitive' } },
            { number: { contains: term, mode: 'insensitive' } },
            { setName: { contains: term, mode: 'insensitive' } },
          ],
        })),
      },
    });

    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
  }
}
