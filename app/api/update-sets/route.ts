import { NextResponse } from 'next/server';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const setData = await PokemonTCG.getAllSets();

  const results = await Promise.allSettled(
    setData.map(async set => {
      const setReleaseDate = set.releaseDate ? new Date(set.releaseDate) : new Date();
      return prisma.set.upsert({
        where: { id: set.id },
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
    })
  );

  results.forEach((result, i) => {
    if (result.status === 'rejected') {
      const set = setData[i];
      console.error(`Failed to upsert set: ${set.id} (${set.name})`, result.reason);
    }
  });

  const failedCount = results.filter(r => r.status === 'rejected').length;
  const successCount = results.length - failedCount;

  return NextResponse.json({
    success: failedCount === 0,
    message:
      failedCount === 0 ? 'Sets updated successfully' : `${failedCount} sets failed to update`,
    updatedCount: successCount,
    failedCount,
  });
}

// export async function GET() {
//   try {
//     const setData = await PokemonTCG.getAllSets();
//     const promises = setData.map(set => {
//       const setReleaseDate = set.releaseDate ? new Date(set.releaseDate) : new Date();

//       return prisma.set.upsert({
//         where: {
//           id: set.id,
//         },
//         update: {
//           name: set.name,
//           series: set.series,
//           releaseDate: setReleaseDate,
//           total: set.total,
//           symbolImage: set.images.symbol,
//           logoImage: set.images.logo,
//         },
//         create: {
//           id: set.id,
//           name: set.name,
//           series: set.series,
//           releaseDate: setReleaseDate,
//           total: set.total,
//           symbolImage: set.images.symbol,
//           logoImage: set.images.logo,
//         },
//       });
//     });
//     await Promise.all(promises);
//     return NextResponse.json({
//       success: true,
//       message: 'Sets updated successfully',
//       updatedCount: setData.length,
//     });
//   } catch (error) {
//     console.error('Error updating sets:', error);
//     const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//     const errorStack =
//       error instanceof Error && process.env.NODE_ENV === 'development' ? error.stack : undefined;

//     return NextResponse.json(
//       {
//         success: false,
//         error: errorMessage,
//         stack: errorStack,
//       },
//       { status: 500 }
//     );
//   }
// }
