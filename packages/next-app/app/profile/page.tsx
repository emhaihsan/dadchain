import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, DollarSign } from "lucide-react"

const userProfile = {
  address: "0x742d35Cc6634C0532925a3b8D404d3aABb8c4532",
  dadScore: 2847,
  joinDate: "March 2024",
  totalJokes: 156,
  totalLikes: 3421,
  totalTips: 892.5,
  nftBadges: [
    { name: "Dad Legend", description: "Posted 100+ jokes", rarity: "Legendary", image: "🏆" },
    { name: "Joke Master", description: "Received 1000+ likes", rarity: "Epic", image: "🎭" },
    { name: "Tip King", description: "Received $500+ in tips", rarity: "Rare", image: "👑" },
    { name: "Early Adopter", description: "Joined in first month", rarity: "Common", image: "🚀" },
  ],
  recentJokes: [
    {
      id: "1",
      text: "Why don't scientists trust atoms? Because they make up everything!",
      likes: 42,
      tips: 15.5,
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      text: "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      likes: 38,
      tips: 8.2,
      timestamp: "1 day ago",
    },
  ],
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Card className="border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-4xl">
                  👨‍👧‍👦
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {userProfile.address.slice(0, 10)}...{userProfile.address.slice(-8)}
                  </h1>
                  <p className="text-gray-600">Dad Score: {userProfile.dadScore.toLocaleString()} pts</p>
                  <p className="text-sm text-gray-500">Member since {userProfile.joinDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{userProfile.totalJokes}</div>
                  <div className="text-sm text-gray-500">Jokes Posted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{userProfile.totalLikes.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Total Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">${userProfile.totalTips}</div>
                  <div className="text-sm text-gray-500">Tips Received</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="jokes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="jokes">My Jokes</TabsTrigger>
            <TabsTrigger value="badges">NFT Badges</TabsTrigger>
          </TabsList>

          <TabsContent value="jokes" className="space-y-4">
            {userProfile.recentJokes.map((joke) => (
              <Card key={joke.id} className="border-orange-200">
                <CardContent className="p-4">
                  <p className="text-gray-900 mb-3">{joke.text}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{joke.timestamp}</span>
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{joke.likes}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>${joke.tips}</span>
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="badges" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userProfile.nftBadges.map((badge) => (
                <Card key={badge.name} className="border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{badge.image}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{badge.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                        <Badge
                          variant="secondary"
                          className={`
                            ${badge.rarity === "Legendary" ? "bg-yellow-100 text-yellow-700" : ""}
                            ${badge.rarity === "Epic" ? "bg-purple-100 text-purple-700" : ""}
                            ${badge.rarity === "Rare" ? "bg-blue-100 text-blue-700" : ""}
                            ${badge.rarity === "Common" ? "bg-gray-100 text-gray-700" : ""}
                          `}
                        >
                          {badge.rarity}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
