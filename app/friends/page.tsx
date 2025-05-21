import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, Check, X, MessageSquare } from "lucide-react"

export default function FriendsPage() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Friends</h1>
          <p className="text-muted-foreground">Connect with other collectors and view their collections</p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search friends..." className="pl-9 w-full md:w-[300px]" />
        </div>
      </div>

      <Tabs defaultValue="friends" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="friends">My Friends</TabsTrigger>
          <TabsTrigger value="requests">Friend Requests</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
        </TabsList>
        <TabsContent value="friends" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FriendCard
              name="Alex Johnson"
              username="alexj"
              cards={127}
              rarest="Charizard VMAX"
              avatar="/placeholder.svg?height=100&width=100"
            />
            <FriendCard
              name="Sarah Williams"
              username="sarahw"
              cards={89}
              rarest="Mewtwo GX"
              avatar="/placeholder.svg?height=100&width=100"
            />
            <FriendCard
              name="Mike Thompson"
              username="miket"
              cards={215}
              rarest="Lugia V"
              avatar="/placeholder.svg?height=100&width=100"
            />
            <FriendCard
              name="Emily Davis"
              username="emilyd"
              cards={64}
              rarest="Pikachu VMAX"
              avatar="/placeholder.svg?height=100&width=100"
            />
          </div>
        </TabsContent>
        <TabsContent value="requests" className="mt-0">
          <div className="space-y-4">
            <FriendRequestCard
              name="Chris Wilson"
              username="chrisw"
              mutualFriends={3}
              avatar="/placeholder.svg?height=100&width=100"
            />
            <FriendRequestCard
              name="Jessica Brown"
              username="jessb"
              mutualFriends={1}
              avatar="/placeholder.svg?height=100&width=100"
            />
          </div>
        </TabsContent>
        <TabsContent value="discover" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <DiscoverCard
              name="David Miller"
              username="davidm"
              cards={156}
              mutualFriends={2}
              avatar="/placeholder.svg?height=100&width=100"
            />
            <DiscoverCard
              name="Lisa Garcia"
              username="lisag"
              cards={92}
              mutualFriends={0}
              avatar="/placeholder.svg?height=100&width=100"
            />
            <DiscoverCard
              name="Ryan Taylor"
              username="ryant"
              cards={203}
              mutualFriends={4}
              avatar="/placeholder.svg?height=100&width=100"
            />
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Friend Activity</CardTitle>
          <CardDescription>Recent activity from your friends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ActivityItem
              name="Alex Johnson"
              action="added a new card"
              card="Pikachu VMAX"
              time="2 hours ago"
              avatar="/placeholder.svg?height=100&width=100"
            />
            <ActivityItem
              name="Sarah Williams"
              action="commented on your"
              card="Charizard V"
              time="Yesterday"
              avatar="/placeholder.svg?height=100&width=100"
            />
            <ActivityItem
              name="Mike Thompson"
              action="wants to trade for your"
              card="Mewtwo GX"
              time="2 days ago"
              avatar="/placeholder.svg?height=100&width=100"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            View All Activity
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function FriendCard({ name, username, cards, rarest, avatar }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            <Image src={avatar || "/placeholder.svg"} alt={name} fill className="object-cover" />
          </div>
          <div>
            <h3 className="font-medium">{name}</h3>
            <p className="text-sm text-muted-foreground">@{username}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div className="bg-muted/50 p-2 rounded-md">
            <p className="text-muted-foreground">Cards</p>
            <p className="font-medium">{cards}</p>
          </div>
          <div className="bg-muted/50 p-2 rounded-md">
            <p className="text-muted-foreground">Rarest</p>
            <p className="font-medium truncate">{rarest}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            <MessageSquare className="mr-2 h-4 w-4" />
            Message
          </Button>
          <Button className="flex-1 bg-rose-500 hover:bg-rose-600">View Collection</Button>
        </div>
      </CardContent>
    </Card>
  )
}

function FriendRequestCard({ name, username, mutualFriends, avatar }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            <Image src={avatar || "/placeholder.svg"} alt={name} fill className="object-cover" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{name}</h3>
            <p className="text-sm text-muted-foreground">
              @{username} • {mutualFriends} mutual friends
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-9 w-9 p-0">
              <X className="h-4 w-4" />
              <span className="sr-only">Decline</span>
            </Button>
            <Button size="sm" className="h-9 w-9 p-0 bg-rose-500 hover:bg-rose-600">
              <Check className="h-4 w-4" />
              <span className="sr-only">Accept</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DiscoverCard({ name, username, cards, mutualFriends, avatar }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            <Image src={avatar || "/placeholder.svg"} alt={name} fill className="object-cover" />
          </div>
          <div>
            <h3 className="font-medium">{name}</h3>
            <p className="text-sm text-muted-foreground">@{username}</p>
          </div>
        </div>
        <div className="flex justify-between mb-4 text-sm">
          <div>
            <p className="text-muted-foreground">Cards</p>
            <p className="font-medium">{cards}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Mutual Friends</p>
            <p className="font-medium">{mutualFriends}</p>
          </div>
        </div>
        <Button className="w-full bg-rose-500 hover:bg-rose-600">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Friend
        </Button>
      </CardContent>
    </Card>
  )
}

function ActivityItem({ name, action, card, time, avatar }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10 rounded-full overflow-hidden">
        <Image src={avatar || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-medium">{name}</span> {action} <Badge variant="outline">{card}</Badge>
        </p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  )
}
