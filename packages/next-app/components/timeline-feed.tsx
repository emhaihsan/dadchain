"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, DollarSign, ExternalLink, Copy } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const mockJokes = [
  {
    id: "1",
    text: "Why don't scientists trust atoms? Because they make up everything!",
    creator: "0x742d35Cc6634C0532925a3b8D404d3aABb8c4532",
    likes: 42,
    tips: 15.5,
    timestamp: "2 hours ago",
    txHash: "0xabc123...",
    image: null,
  },
  {
    id: "2",
    text: "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    creator: "0x8ba1f109551bD432803012645Hac136c30C6213",
    likes: 38,
    tips: 8.2,
    timestamp: "4 hours ago",
    txHash: "0xdef456...",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    text: "What do you call a fake noodle? An impasta!",
    creator: "0x1234567890abcdef1234567890abcdef12345678",
    likes: 67,
    tips: 23.1,
    timestamp: "6 hours ago",
    txHash: "0x789ghi...",
    image: null,
  },
]

export function TimelineFeed() {
  const [likedJokes, setLikedJokes] = useState<Set<string>>(new Set())

  const handleLike = async (jokeId: string) => {
    // Mock like transaction
    setLikedJokes((prev) => new Set([...prev, jokeId]))
    // In real app, would submit transaction to blockchain
  }

  const handleTip = async (creator: string) => {
    // Mock USDC tip via MetaMask Card
    alert(`Tipping ${creator} with USDC via MetaMask Card! 💳`)
  }

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    alert("Address copied!")
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest Dad Jokes 🤣</h2>

      {mockJokes.map((joke) => (
        <Card key={joke.id} className="border-orange-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-orange-100 text-orange-700">👨</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <button
                    onClick={() => copyAddress(joke.creator)}
                    className="text-sm text-gray-600 hover:text-orange-600 flex items-center space-x-1"
                  >
                    <span>
                      {joke.creator.slice(0, 6)}...{joke.creator.slice(-4)}
                    </span>
                    <Copy className="w-3 h-3" />
                  </button>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-500">{joke.timestamp}</span>
                  <a
                    href={`https://etherscan.io/tx/${joke.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <p className="text-gray-900 text-lg mb-4 leading-relaxed">{joke.text}</p>

                {joke.image && (
                  <img src={joke.image || "/placeholder.svg"} alt="Joke image" className="rounded-lg mb-4 max-w-sm" />
                )}

                <div className="flex items-center space-x-4">
                  <Button
                    variant={likedJokes.has(joke.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleLike(joke.id)}
                    className={likedJokes.has(joke.id) ? "bg-red-500 hover:bg-red-600" : ""}
                  >
                    <Heart className={`w-4 h-4 mr-1 ${likedJokes.has(joke.id) ? "fill-current" : ""}`} />
                    {joke.likes + (likedJokes.has(joke.id) ? 1 : 0)}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTip(joke.creator)}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <DollarSign className="w-4 h-4 mr-1" />
                    Tip ${joke.tips}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
