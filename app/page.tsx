import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Scan, Users, ShoppingCart, Search, PlusCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center mb-12">
        <div className="relative w-full h-64 md:h-80 mb-6">
          <Image
            src="/hero-illustration.svg"
            alt="Pokémon Card Collection App"
            width={800}
            height={400}
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">PokéCollect</h1>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
          Scan, collect, and trade your Pokémon cards with friends. Get real-time valuations and
          even predict PSA grades!
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="bg-rose-500 hover:bg-rose-600">
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <FeatureCard
          icon={<Camera className="w-10 h-10 text-teal-500" />}
          title="Scan Your Cards"
          description="Use your phone camera to instantly scan and add cards to your collection."
          color="bg-teal-50"
        />
        <FeatureCard
          icon={<Scan className="w-10 h-10 text-violet-500" />}
          title="PSA Grade Prediction"
          description="Get an estimated PSA grade based on card condition analysis."
          color="bg-violet-50"
        />
        <FeatureCard
          icon={<Users className="w-10 h-10 text-amber-500" />}
          title="Connect With Friends"
          description="Share your collection and interact with other collectors."
          color="bg-amber-50"
        />
        <FeatureCard
          icon={<ShoppingCart className="w-10 h-10 text-emerald-500" />}
          title="Trade & Marketplace"
          description="Buy, sell, and trade cards with other collectors."
          color="bg-emerald-50"
        />
        <FeatureCard
          icon={<Search className="w-10 h-10 text-blue-500" />}
          title="Real-time Valuation"
          description="Get up-to-date market values for your entire collection."
          color="bg-blue-50"
        />
        <FeatureCard
          icon={<PlusCircle className="w-10 h-10 text-pink-500" />}
          title="Manual Card Input"
          description="Can't scan? Manually add cards with our easy form."
          color="bg-pink-50"
        />
      </div>

      {/* App Preview */}
      <div className="relative w-full h-[500px] mb-12">
        <Image
          src="/app-preview.svg"
          alt="App Preview"
          width={800}
          height={500}
          className="object-contain"
        />
      </div>

      {/* CTA Section */}
      <div className="text-center py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to organize your collection?</h2>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
          Join thousands of Pokémon card collectors who are digitizing their collections.
        </p>
        <Button size="lg" className="bg-rose-500 hover:bg-rose-600">
          <Link href="/signup">Start Collecting Now</Link>
        </Button>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  return (
    <Card className={`border-none ${color}`}>
      <CardContent className="pt-6">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
