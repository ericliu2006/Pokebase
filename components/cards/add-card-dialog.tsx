'use client';

import { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card as CardType } from '@prisma/client';
import Image from 'next/image';

interface AddCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCard: (card: CardType) => void;
}

export function AddCardDialog({ open, onOpenChange, onAddCard }: AddCardDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CardType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  // Mock search function - replace with actual API call
  const searchCards = async (query: string) => {
    if (!query.trim()) return [];

    setIsLoading(true);
    try {
      const results = await fetch(`/api/search?query=${query}`);
      const cards: CardType[] = await results.json();

      setSearchResults(cards);
    } catch (error) {
      console.error('Error searching cards:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        searchCards(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleAddCard = (card: CardType) => {
    onAddCard(card);
    setSelectedCard(card);
    // Reset after a short delay
    setTimeout(() => {
      setSelectedCard(null);
      onOpenChange(false);
      setSearchQuery('');
      setSearchResults([]);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Card to Collection</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for a Pokémon card..."
            className="pl-10"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto mt-4">
          {searchResults.length > 0 ? (
            <>
              {searchResults.length >= 20 && (
                <p className="text-xs text-muted-foreground p-1">
                  Too many results. Please refine your search for more specific results.
                </p>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 p-1">
                {searchResults.slice(0, 10).map(card => (
                  <div
                    key={card.id}
                    className="border rounded-md overflow-hidden hover:shadow-md transition-shadow cursor-pointer bg-white flex flex-col items-center p-1 text-xs"
                    onClick={() => handleAddCard(card)}
                  >
                    <div className="relative w-[160px] h-[224px] bg-muted">
                      <Image
                        src={card.image || '/placeholder-card.png'}
                        alt={card.name}
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                    </div>
                    <div className="p-1 w-full">
                      <h3 className="font-medium truncate w-full">{card.name}</h3>
                      <p className="text-[10px] text-muted-foreground truncate w-full">
                        {card.rarity} • {card.setName ? card.setName : 'Unknown Set'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : searchQuery && (searchQuery.length > 3) ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <p>No cards found for &quot;{searchQuery}&quot;</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <Search className="h-8 w-8 mb-2" />
              <p>Search for Pokémon cards to add to your collection</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
