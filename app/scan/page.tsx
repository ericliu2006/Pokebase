import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Scan, ArrowRight } from "lucide-react"

export default function ScanPage() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Card Scanner</h1>
        <p className="text-muted-foreground mb-6">
          Scan your Pokémon cards to add them to your collection or check their value
        </p>

        <Tabs defaultValue="collection" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="collection">
              <Camera className="mr-2 h-4 w-4" />
              Add to Collection
            </TabsTrigger>
            <TabsTrigger value="grade">
              <Scan className="mr-2 h-4 w-4" />
              PSA Grade Prediction
            </TabsTrigger>
          </TabsList>
          <TabsContent value="collection" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Scan Card</CardTitle>
                <CardDescription>Position your card within the frame and make sure it's well-lit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted aspect-[4/3] rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 border-4 border-dashed border-muted-foreground/20 rounded-lg m-4"></div>
                  <div className="text-center p-4">
                    <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Camera preview will appear here</p>
                    <p className="text-xs text-muted-foreground mt-2">Make sure the entire card is visible</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button size="lg" className="bg-rose-500 hover:bg-rose-600">
                    <Camera className="mr-2 h-5 w-5" />
                    Capture Card
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col text-center text-sm text-muted-foreground">
                <p>
                  Can't scan properly?{" "}
                  <Button variant="link" className="p-0 h-auto text-rose-500">
                    Add card manually
                  </Button>
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="grade" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>PSA Grade Prediction</CardTitle>
                <CardDescription>Our AI will analyze your card and estimate its PSA grade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted aspect-[4/3] rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 border-4 border-dashed border-muted-foreground/20 rounded-lg m-4"></div>
                  <div className="text-center p-4">
                    <Scan className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Camera preview will appear here</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Position card on a dark, non-reflective surface
                    </p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button size="lg" className="bg-violet-500 hover:bg-violet-600">
                    <Scan className="mr-2 h-5 w-5" />
                    Analyze Card
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col text-center text-sm text-muted-foreground">
                <p>Our PSA prediction uses AI to analyze centering, edges, corners, and surface</p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Recently Scanned</CardTitle>
            <CardDescription>Cards you've recently scanned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ScannedCardItem
                name="Charizard VMAX"
                set="Darkness Ablaze"
                value="$89.99"
                time="2 hours ago"
                grade="PSA 7-8"
              />
              <ScannedCardItem name="Pikachu V" set="Vivid Voltage" value="$24.99" time="Yesterday" grade="PSA 9" />
              <ScannedCardItem name="Mewtwo GX" set="Shining Legends" value="$45.50" time="3 days ago" grade="PSA 8" />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Scanned Cards
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function ScannedCardItem({ name, set, value, time, grade }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-14 bg-background rounded border flex items-center justify-center text-xs font-medium">
          Card
        </div>
        <div>
          <h4 className="font-medium text-sm">{name}</h4>
          <p className="text-xs text-muted-foreground">
            {set} • {time}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium text-sm">{value}</p>
        <p className="text-xs text-muted-foreground">{grade}</p>
      </div>
    </div>
  )
}
