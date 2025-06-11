import { NextResponse } from 'next/server';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cards = await PokemonTCG.getAllCards();
    // const params = { q: 'name:Alakazam' };
    // const cards = await PokemonTCG.findCardsByQueries(params);

    if (!cards.length) {
      return NextResponse.json({
        success: true,
        message: 'No cards found to update',
        updatedCount: 0,
      });
    }

    const getVariantName = (baseName: string, key: string): string => {
      switch (key) {
        case 'reverseHolofoil':
          return `${baseName} (Reverse Holo)`;
        case 'holofoil':
          return `${baseName} (Holo)`;
        case '1stEditionHolofoil':
          return `${baseName} (1st Edition Holo)`;
        case '1stEdition':
          return `${baseName} (1st Edition)`;
        case 'unlimitedHolofoil':
          return `${baseName} (Unlimited Holo)`;
        case 'unlimited':
          return `${baseName} (Unlimited)`;
        case 'normal':
          return baseName;
        default:
          return `${baseName} (${key})`;
      }
    };

    const results = await Promise.all(
      cards.map(card => {
        const prices = (card.tcgplayer?.prices || {}) as {
          [key: string]: PokemonTCG.Price | undefined;
        };

        const keys = Object.keys(prices);
        const nonNullCount = keys.length;

        if (nonNullCount > 1) {
          const upsertOperations = keys.map(key => {
            const data = {
              id: `${card.id}_${key}`,
              name: getVariantName(card.name, key),
              marketValue: prices[key]?.market,
            };
            return prisma.card.upsert({
              where: {
                id: data.id,
              },
              update: {
                value: data.marketValue,
                name: data.name,
                updatedAt: new Date(),
              },
              create: {
                id: data.id,
                name: data.name,
                supertype: card.supertype || '',
                subtype: card.subtypes?.[0] || '',
                hp: card.hp || '',
                types: card.types || [],
                evolvesFrom: card.evolvesFrom || null,
                evolvesTo: card.evolvesTo
                  ? JSON.stringify(
                      Array.isArray(card.evolvesTo) ? card.evolvesTo : [card.evolvesTo]
                    )
                  : null,
                setId: card.set.id,
                setName: card.set.name,
                number: card.number,
                artist: card.artist || '',
                rarity: card.rarity || '',
                image: card.images?.large || card.images?.small || '',
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            });
          });
          return prisma.$transaction(upsertOperations);
        } else {
          const marketVal = prices[keys[0]]?.market ?? null;
          return prisma.card.upsert({
            where: { id: card.id },
            update: {
              // normalLowPrice: prices.normal?.low ?? null,
              // normalMidPrice: prices.normal?.mid ?? null,
              // normalHighPrice: prices.normal?.high ?? null,
              // normalMarketVal: prices.normal?.market ?? null,
              // holofoilLowPrice: prices.holofoil?.low ?? null,
              // holofoilMidPrice: prices.holofoil?.mid ?? null,
              // holofoilHighPrice: prices.holofoil?.high ?? null,
              // holofoilMarketVal: prices.holofoil?.market ?? null,
              // reverseHolofoilLowPrice: prices.reverseHolofoil?.low ?? null,
              // reverseHolofoilMidPrice: prices.reverseHolofoil?.mid ?? null,
              // reverseHolofoilHighPrice: prices.reverseHolofoil?.high ?? null,
              // reverseHolofoilMarketVal: prices.reverseHolofoil?.market ?? null,
              value: marketVal,
              updatedAt: new Date(),
            },
            create: {
              id: card.id,
              name: card.name,
              supertype: card.supertype || '',
              subtype: card.subtypes?.[0] || '',
              hp: card.hp || '',
              types: card.types || [],
              evolvesFrom: card.evolvesFrom || null,
              evolvesTo: card.evolvesTo
                ? JSON.stringify(Array.isArray(card.evolvesTo) ? card.evolvesTo : [card.evolvesTo])
                : null,
              setId: card.set.id,
              setName: card.set.name,
              number: card.number,
              artist: card.artist || '',
              rarity: card.rarity || '',
              image: card.images?.large || card.images?.small || '',
              createdAt: new Date(),
              updatedAt: new Date(),
              value: marketVal,
            },
          });
        }
      })
    );

    const successfulUpdates = results.filter(Boolean);

    return NextResponse.json({
      success: true,
      message: 'Cards updated successfully',
      updatedCount: successfulUpdates.length,
    });
  } catch (error) {
    console.error('Error updating cards:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update cards',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
