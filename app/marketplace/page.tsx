import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, DollarSign, MessageSquare } from "lucide-react"

export default function MarketplacePage() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
          <p className="text-muted-foreground">Buy, sell, and trade Pokémon cards with other collectors</p>
        </div>
        <Button className="bg-rose-500 hover:bg-rose-600">
          <DollarSign className="mr-2 h-4 w-4" />
          Sell a Card
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search cards..." className="pl-9" />
        </div>
        <div className="flex gap-4">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Card Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="holo">Holo</SelectItem>
              <SelectItem value="reverse">Reverse Holo</SelectItem>
              <SelectItem value="full-art">Full Art</SelectItem>
              <SelectItem value="rainbow">Rainbow Rare</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="buy" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="buy">Buy</TabsTrigger>
          <TabsTrigger value="trade">Trade</TabsTrigger>
          <TabsTrigger value="my-listings">My Listings</TabsTrigger>
        </TabsList>
        <TabsContent value="buy" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <MarketplaceCard
                key={i}
                cardName={`Pikachu ${i % 2 === 0 ? "VMAX" : "V"}`}
                price={i % 2 === 0 ? 89.99 : 24.99}
                condition={i % 3 === 0 ? "Near Mint" : i % 3 === 1 ? "Excellent" : "Good"}
                seller={`User${i}`}
                rating={4.8}
                image="/placeholder.svg?height=300&width=215"
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="trade" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <TradeCard
                key={i}
                cardName={`Charizard ${i % 2 === 0 ? "VMAX" : "V"}`}
                lookingFor={i % 2 === 0 ? "Mewtwo GX, Pikachu VMAX" : "Any Eevee evolution cards"}
                condition={i % 3 === 0 ? "Near Mint" : i % 3 === 1 ? "Excellent" : "Good"}
                trader={`Trader${i}`}
                rating={4.9}
                image="/placeholder.svg?height=300&width=215"
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="my-listings" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2].map((i) => (
              <MyListingCard
                key={i}
                cardName={`Mewtwo ${i % 2 === 0 ? "GX" : "V"}`}
                price={i % 2 === 0 ? 45.5 : 32.99}
                condition={i % 2 === 0 ? "Near Mint" : "Excellent"}
                views={i % 2 === 0 ? 24 : 18}
                interested={i % 2 === 0 ? 3 : 1}
                image="/placeholder.svg?height=300&width=215"
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button variant="outline">Load More</Button>
      </div>
    </div>
  )
}

function MarketplaceCard({ cardName, price, condition, seller, rating, image }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <Link href="/card/1">
          <Image
            src={image || "/placeholder.svg"}
            alt={cardName}
            width={215}
            height={300}
            className="w-full object-cover"
          />
        </Link>
        <Badge className="absolute top-2 right-2 bg-emerald-500">${price}</Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium mb-1">{cardName}</h3>
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline">{condition}</Badge>
          <p className="text-xs text-muted-foreground">
            Seller: {seller} ({rating}★)
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button className="flex-1 bg-rose-500 hover:bg-rose-600">Buy Now</Button>
        <Button variant="outline" size="icon">
          <MessageSquare className="h-4 w-4" />
          <span className="sr-only">Message</span>
        </Button>
      </CardFooter>
    </Card>
  )
}

function TradeCard({ cardName, lookingFor, condition, trader, rating, image }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <Link href="/card/1">
          <Image
            src={image || "/placeholder.svg"}
            alt={cardName}
            width={215}
            height={300}
            className="w-full object-cover"
          />
        </Link>
        <Badge className="absolute top-2 right-2 bg-blue-500">Trade</Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium mb-1">{cardName}</h3>
        <div className="mb-2">
          <Badge variant="outline">{condition}</Badge>
        </div>
        <div className="text-xs">
          <p className="text-muted-foreground mb-1">Looking for:</p>
          <p className="font-medium">{lookingFor}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button className="flex-1 bg-blue-500 hover:bg-blue-600">Offer Trade</Button>
        <Button variant="outline" size="icon">
          <MessageSquare className="h-4 w-4" />
          <span className="sr-only">Message</span>
        </Button>
      </CardFooter>
    </Card>
  )
}

function MyListingCard({ cardName, price, condition, views, interested, image }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <Link href="/card/1">
          <Image
            src={image || "/placeholder.svg"}
            alt={cardName}
            width={215}
            height={300}
            className="w-full object-cover"
          />
        </Link>
        <Badge className="absolute top-2 right-2 bg-emerald-500">${price}</Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium mb-1">{cardName}</h3>
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline">{condition}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-muted-foreground">Views</p>
            <p className="font-medium">{views}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Interested</p>
            <p className="font-medium">{interested}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" className="flex-1">
          Edit
        </Button>
        <Button variant="destructive" className="flex-1">
          Remove
        </Button>
      </CardFooter>
    </Card>
  )
}
