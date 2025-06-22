import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award } from "lucide-react"

const leaderboardData = [
  {
    rank: 1,
    address: "0x742d35Cc6634C0532925a3b8D404d3aABb8c4532",
    dadScore: 2847,
    jokes: 156,
    likes: 3421,
    tips: 892.5,
    badges: ["Dad Legend", "Joke Master", "Tip King"],
  },
  {
    rank: 2,
    address: "0x8ba1f109551bD432803012645Hac136c30C6213",
    dadScore: 2156,
    jokes: 98,
    likes: 2103,
    tips: 567.2,
    badges: ["Rising Star", "Crowd Pleaser"],
  },
  {
    rank: 3,
    address: "0x1234567890abcdef1234567890abcdef12345678",
    dadScore: 1923,
    jokes: 87,
    likes: 1876,
    tips: 445.8,
    badges: ["Consistent Creator", "Community Favorite"],
  },
]

export default function LeaderboardPage() {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-orange-600" />
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">{rank}</div>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dad Score Leaderboard 🏆</h1>
          <p className="text-lg text-gray-600">Top performers in the DadChain ecosystem</p>
        </div>

        <div className="space-y-4">
          {leaderboardData.map((user) => (
            <Card key={user.address} className="border-orange-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">{getRankIcon(user.rank)}</div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-mono text-sm text-gray-600">
                        {user.address.slice(0, 10)}...{user.address.slice(-8)}
                      </div>
                      <div className="text-2xl font-bold text-orange-600">{user.dadScore.toLocaleString()} pts</div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{user.jokes}</div>
                        <div className="text-xs text-gray-500">Jokes</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{user.likes.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Likes</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">${user.tips}</div>
                        <div className="text-xs text-gray-500">Tips</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {user.badges.map((badge) => (
                        <Badge key={badge} variant="secondary" className="bg-orange-100 text-orange-700">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
