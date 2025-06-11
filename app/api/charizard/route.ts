import { NextResponse } from 'next/server';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';

export async function GET() {
  try {
    const params = { q: 'name:Alakazam' };
    const results = await PokemonTCG.findCardsByQueries(params);
    // const results = await PokemonTCG.getAllCards();

    // PokemonTCG.findCardByID('base1-4').then((card: PokemonTCG.Card) => {
    //     if (card.tcgplayer) {
    //         console.log(card.tcgplayer.prices);
    //     }
    // });

    console.log(results.length);

    return NextResponse.json({
      success: true,
      message: 'Successful',
      results: results,
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
