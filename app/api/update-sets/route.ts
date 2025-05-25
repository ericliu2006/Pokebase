import { NextResponse } from 'next/server';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const setData = await PokemonTCG.getAllSets();
    const promises = setData.map(set => {
      const setReleaseDate = set.releaseDate ? new Date(set.releaseDate) : new Date();

      return prisma.set.upsert({
        where: {
          id: set.id,
        },
        update: {
          name: set.name,
          series: set.series,
          releaseDate: setReleaseDate,
          total: set.total,
          symbolImage: set.images.symbol,
          logoImage: set.images.logo,
        },
        create: {
          id: set.id,
          name: set.name,
          series: set.series,
          releaseDate: setReleaseDate,
          total: set.total,
          symbolImage: set.images.symbol,
          logoImage: set.images.logo,
        },
      });
    });
    await Promise.all(promises);
    return NextResponse.json({
      success: true,
      message: 'Sets updated successfully',
      updatedCount: setData.length,
    });
  } catch (error) {
    console.error('Error updating sets:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const errorStack =
      error instanceof Error && process.env.NODE_ENV === 'development' ? error.stack : undefined;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        stack: errorStack,
      },
      { status: 500 }
    );
  }
}
