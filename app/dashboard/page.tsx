'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Camera, Plus, Heart, DollarSign, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { AddCardDialog } from '@/components/cards/add-card-dialog';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('You must be signed in to view this page');
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (!session) {
    return null; // or a loading state
  }
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
            onAddCard={card => {
              toast.success(`${card.name} added to your collection!`);
              // Here you would typically call your API to add the card to the user's collection
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Cards"
          value="127"
          description="Cards in your collection"
          color="bg-teal-50"
          textColor="text-teal-600"
        />
        <StatsCard
          title="Collection Value"
          value="$3,245.78"
          description="Estimated market value"
          color="bg-violet-50"
          textColor="text-violet-600"
        />
        <StatsCard
          title="Rarest Card"
          value="Charizard GX"
          description="PSA 9 • $350.00"
          color="bg-amber-50"
          textColor="text-amber-600"
        />
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Cards</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="forSale">For Sale</TabsTrigger>
          <TabsTrigger value="recent">Recently Added</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
              <PokemonCard key={i} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="favorites" className="mt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3].map(i => (
              <PokemonCard key={i} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="forSale" className="mt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2].map(i => (
              <PokemonCard key={i} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="recent" className="mt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4].map(i => (
              <PokemonCard key={i} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button variant="outline">Load More</Button>
      </div>
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

function PokemonCard() {
  return (
    <Link href="/card/1">
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="relative">
          <Image
            src="/placeholder.svg?height=300&width=215"
            alt="Pokémon Card"
            width={215}
            height={300}
            className="w-full object-cover"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 text-rose-500 hover:bg-white hover:text-rose-600"
          >
            <Heart className="h-4 w-4" />
            <span className="sr-only">Add to favorites</span>
          </Button>
        </div>
        <CardContent className="p-3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-medium text-sm truncate">Pikachu V</h3>
            <Badge variant="outline" className="text-xs">
              Rare
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-emerald-500" />
              <span className="text-xs font-medium">$24.99</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span className="text-xs">PSA 8</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
