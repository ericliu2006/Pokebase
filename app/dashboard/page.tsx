'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Camera, Plus, Heart, DollarSign, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { AddCardDialog } from '@/components/cards/add-card-dialog';
import { Card as CardType } from '@prisma/client';

interface UserCard {
  id: string;
  card: CardType;
  quality: string;
  forSale: boolean;
  price: number | null;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const [userCards, setUserCards] = useState<UserCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('You must be signed in to view this page');
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchUserCards();
    }
  }, [status, router]);

  const fetchUserCards = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user-cards', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cards');
      }

      const data = await response.json();
      setUserCards(data);
    } catch (error) {
      console.error('Error fetching cards:', error);
      toast.error('Failed to load your collection');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCard = async (card: CardType) => {
    try {
      setIsAdding(true);
      const response = await fetch('/api/add-usercard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: card.id,
          quality: 'MINT',
          forSale: false,
          price: card.value ?? null,
          notes: '',
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to add card to collection');
      }

      // Refresh the cards list
      await fetchUserCards();
      toast.success(`${card.name} added to your collection!`);
      return true;
    } catch (error) {
      console.error('Error adding card:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add card to collection');
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Filter cards by category
  const allCards = userCards;
  const favoriteCards = userCards.filter(card => false); // Add favorite logic if needed
  const forSaleCards = userCards.filter(card => card.forSale);
  const recentCards = [...userCards]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {session.user?.name || 'Trainer'}!
          </h1>
          <p className="text-muted-foreground">Manage and view your Pokémon card collection</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-rose-500 hover:bg-rose-600">
            <Camera className="mr-2 h-4 w-4" />
            Scan Card
          </Button>
          <Button variant="outline" onClick={() => setIsAddCardDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Manually
          </Button>

          <AddCardDialog
            open={isAddCardDialogOpen}
            onOpenChange={setIsAddCardDialogOpen}
            onAddCard={handleAddCard}
            isAdding={isAdding}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Cards"
          value={userCards.length.toString()}
          description="Cards in your collection"
          color="bg-teal-50"
          textColor="text-teal-600"
        />
        <StatsCard
          title="For Sale"
          value={forSaleCards.length.toString()}
          description="Cards listed for sale"
          color="bg-violet-50"
          textColor="text-violet-600"
        />
        <StatsCard
          title="Total Value"
          value={`$${userCards.reduce((sum, card) => sum + (card.price || 0), 0).toFixed(2)}`}
          description="Estimated collection value"
          color="bg-amber-50"
          textColor="text-amber-600"
        />
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Cards ({allCards.length})</TabsTrigger>
          <TabsTrigger value="favorites">Favorites ({favoriteCards.length})</TabsTrigger>
          <TabsTrigger value="forSale">For Sale ({forSaleCards.length})</TabsTrigger>
          <TabsTrigger value="recent">Recently Added</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {allCards.map(card => (
              <UserPokemonCard key={card.id} userCard={card} />
            ))}
            {allCards.length === 0 && !isLoading && (
              <div className="col-span-full text-center py-10 text-muted-foreground">
                <p>No cards in your collection yet.</p>
                <p className="text-sm mt-2">Add your first card to get started!</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="mt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {favoriteCards.length > 0 ? (
              favoriteCards.map(card => <UserPokemonCard key={card.id} userCard={card} />)
            ) : (
              <div className="col-span-full text-center py-10 text-muted-foreground">
                <p>No favorite cards yet.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="forSale" className="mt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {forSaleCards.length > 0 ? (
              forSaleCards.map(card => <UserPokemonCard key={card.id} userCard={card} />)
            ) : (
              <div className="col-span-full text-center py-10 text-muted-foreground">
                <p>No cards for sale.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recentCards.length > 0 ? (
              recentCards.map(card => <UserPokemonCard key={card.id} userCard={card} />)
            ) : (
              <div className="col-span-full text-center py-10 text-muted-foreground">
                <p>No recent cards.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  color: string;
  textColor: string;
}

function StatsCard({ title, value, description, color, textColor }: StatsCardProps) {
  return (
    <Card className={`border-none ${color}`}>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function getRarityAbbreviation(rarity: string): string {
  if (!rarity.trim()) return '○';
  const rarityMap: Record<string, string> = {
    'Special Illustration Rare': 'SIR',
    'Illustration Rare': 'IR',
    'Ultra Rare': 'UR',
    'Hyper Rare': 'HR',
    'Rainbow Rare': 'RR',
    'Amazing Rare': 'AR',
    'Rare Holo V': 'V',
    'Rare Holo VMAX': 'VMAX',
    'Rare Holo VSTAR': 'VSTAR',
    'Rare Holo EX': 'EX',
    'Rare Holo GX': 'GX',
    'Rare Holo LV.X': 'LV.X',
    'Rare Holo Star': '★',
    'Rare Holo': '★',
    Rare: 'R',
    Uncommon: 'U',
    Common: 'C',
    Promo: 'P',
  };

  return (
    rarityMap[rarity] ||
    rarity
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
  );
}

function UserPokemonCard({ userCard }: { userCard: UserCard }) {
  const card = userCard.card;
  const rarityAbbreviation = getRarityAbbreviation(card.rarity);

  return (
    <div className="group border rounded-md overflow-hidden hover:shadow-md transition-all bg-white hover:shadow-lg hover:-translate-y-0.5">
      <div className="relative w-full aspect-[2/3] bg-muted flex items-center justify-center">
        {card.image ? (
          <Image
            src={card.image}
            alt={card.name}
            width={245}
            height={342}
            className="w-full h-full object-contain p-2 transition-transform group-hover:scale-105"
            priority={false}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
            <span>No Image</span>
          </div>
        )}
        <button
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white text-rose-500 shadow-sm hover:shadow transition-all"
          aria-label="Add to favorites"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>
      <div className="p-3 border-t">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-medium text-sm leading-tight flex-1 min-w-0 break-words">
            {card.name}
          </h3>
          <Badge
            variant="outline"
            className="text-[10px] h-5 px-1.5 flex-shrink-0"
            title={card.rarity}
          >
            {rarityAbbreviation}
          </Badge>
        </div>
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span className="truncate">{card.setName || 'Unknown Set'}</span>
          <div className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>{userCard.quality}</span>
          </div>
        </div>
        {userCard.forSale && userCard.price && (
          <div className="mt-2 pt-2 border-t flex items-center justify-between">
            <span className="text-sm font-medium">${userCard.price.toFixed(2)}</span>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              Buy Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
