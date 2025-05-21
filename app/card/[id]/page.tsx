import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Share2, DollarSign, ArrowUpDown, MessageCircle, Users, ShoppingCart } from "lucide-react"

export default function CardDetailPage() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Card Image Section */}
        <div className="flex flex-col gap-6">
          <div className="bg-muted/30 rounded-lg p-6 flex items-center justify-center">
            <div className="relative w-[215px] h-[300px]">
              <Image src="/placeholder.svg?height=300&width=215" alt="Pikachu V" fill className="object-contain" />
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-[3/4] bg-muted/30 rounded-md overflow-hidden">
                <Image
                  src="/placeholder.svg?height=100&width=75"
                  alt={`Pikachu V view ${i}`}
                  width={75}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              <Heart className="mr-2 h-4 w-4" />
              Add to Favorites
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="mr-2 h-4 w-4" />
              Share Card
            </Button>
          </div>
        </div>

        {/* Card Details Section */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-amber-500">Rare</Badge>
              <Badge variant="outline">Holo</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-1">Pikachu V</h1>
            <p className="text-muted-foreground">Vivid Voltage • 043/185 • 2020</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-emerald-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Market Value</p>
                  <p className="text-xl font-bold">$24.99</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <ArrowUpDown className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">30-Day Trend</p>
                  <p className="text-xl font-bold text-emerald-500">+12.5%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Condition</h3>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                  Near Mint
                </Badge>
                <Badge variant="outline">Excellent</Badge>
                <Badge variant="outline">Good</Badge>
                <Badge variant="outline">Poor</Badge>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-1">PSA Grade Prediction</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center text-lg font-bold">
                  8
                </div>
                <p className="text-sm text-muted-foreground">
                  Our AI predicts this card would receive a PSA 8 grade based on centering, edges, corners, and surface
                  analysis.
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="comments">
                <MessageCircle className="mr-1 h-4 w-4" />
                Comments
              </TabsTrigger>
              <TabsTrigger value="trades">
                <ShoppingCart className="mr-1 h-4 w-4" />
                Trades
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">Electric</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">HP:</span>
                  <span className="font-medium">190</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Artist:</span>
                  <span className="font-medium">Ryuta Fuse</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rarity:</span>
                  <span className="font-medium">Ultra Rare</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Set:</span>
                  <span className="font-medium">Vivid Voltage</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Number:</span>
                  <span className="font-medium">043/185</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-1">Description</h4>
                <p className="text-sm text-muted-foreground">
                  This Pikachu V card features the iconic Electric-type Pokémon in its V form, with enhanced attacks and
                  HP. The illustration by Ryuta Fuse showcases Pikachu in a dynamic pose with electric energy
                  surrounding it.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="comments" className="pt-4">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-xs font-bold">
                    JD
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">John Doe</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                    <p className="text-sm">
                      Amazing card! I've been looking for this one to complete my Pikachu collection.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold">
                    AS
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">Alice Smith</p>
                      <p className="text-xs text-muted-foreground">1 week ago</p>
                    </div>
                    <p className="text-sm">
                      The centering looks really good on this one. Definitely worth the PSA grade!
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Add Comment
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="trades" className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold">
                      MB
                    </div>
                    <div>
                      <p className="text-sm font-medium">Mike Brown</p>
                      <p className="text-xs text-muted-foreground">Wants to trade</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                    View Offer
                  </Button>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <Button className="flex-1 bg-rose-500 hover:bg-rose-600">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Sell Card
                </Button>
                <Button variant="outline" className="flex-1">
                  <Users className="mr-2 h-4 w-4" />
                  Open to Trades
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
