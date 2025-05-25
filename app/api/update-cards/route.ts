import { NextResponse } from 'next/server';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cards = await PokemonTCG.getAllCards();

    if (!cards.length) {
      return NextResponse.json({
        success: true,
        message: 'No cards found to update',
        updatedCount: 0
      });
    }

    const results = await Promise.all(
      cards.map(card => {
        console.log(card.name)
        const prices = card.tcgplayer?.prices || {};

        return prisma.card.upsert({
          where: { id: card.id },
          update: {
            normalLowPrice: prices.normal?.low ?? null,
            normalMidPrice: prices.normal?.mid ?? null,
            normalHighPrice: prices.normal?.high ?? null,
            normalMarketVal: prices.normal?.market ?? null,
            holofoilLowPrice: prices.holofoil?.low ?? null,
            holofoilMidPrice: prices.holofoil?.mid ?? null,
            holofoilHighPrice: prices.holofoil?.high ?? null,
            holofoilMarketVal: prices.holofoil?.market ?? null,
            reverseHolofoilLowPrice: prices.reverseHolofoil?.low ?? null,
            reverseHolofoilMidPrice: prices.reverseHolofoil?.mid ?? null,
            reverseHolofoilHighPrice: prices.reverseHolofoil?.high ?? null,
            reverseHolofoilMarketVal: prices.reverseHolofoil?.market ?? null,
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
            number: card.number,
            artist: card.artist || '',
            rarity: card.rarity || '',
            image: card.images?.large || card.images?.small || '',
            normalLowPrice: prices.normal?.low ?? null,
            normalMidPrice: prices.normal?.mid ?? null,
            normalHighPrice: prices.normal?.high ?? null,
            normalMarketVal: prices.normal?.market ?? null,
            holofoilLowPrice: prices.holofoil?.low ?? null,
            holofoilMidPrice: prices.holofoil?.mid ?? null,
            holofoilHighPrice: prices.holofoil?.high ?? null,
            holofoilMarketVal: prices.holofoil?.market ?? null,
            reverseHolofoilLowPrice: prices.reverseHolofoil?.low ?? null,
            reverseHolofoilMidPrice: prices.reverseHolofoil?.mid ?? null,
            reverseHolofoilHighPrice: prices.reverseHolofoil?.high ?? null,
            reverseHolofoilMarketVal: prices.reverseHolofoil?.market ?? null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      })
    );

    const successfulUpdates = results.filter(Boolean);

    return NextResponse.json({
      success: true,
      message: 'Cards updated successfully',
      updatedCount: successfulUpdates.length
    });
    
  } catch (error) {
    console.error('Error updating cards:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update cards',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}