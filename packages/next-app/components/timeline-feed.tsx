"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageSquare,
  DollarSign,
  ExternalLink,
  Copy,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Identicon } from "./identicon";

// Updated mock data with real Date objects
const mockJokes = [
  {
    id: "1",
    text: "Why don't scientists trust atoms? Because they make up everything!",
    creator: "0x742d35Cc6634C0532925a3b8D404d3aABb8c4532",
    likes: 42,
    tips: 15.5,
    comments: 7,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    txHash: "0xabc123...",
    image: null,
  },
  {
    id: "2",
    text: "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    creator: "0x8ba1f109551bD432803012645Hac136c30C6213",
    likes: 38,
    tips: 8.2,
    comments: 4,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    txHash: "0xdef456...",
    image: null,
  },
  {
    id: "3",
    text: "What do you call a fake noodle? An impasta!",
    creator: "0x1234567890abcdef1234567890abcdef12345678",
    likes: 67,
    tips: 23.1,
    comments: 12,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    txHash: "0x789ghi...",
    image: null,
  },
];

export function TimelineFeed() {
  const [likedJokes, setLikedJokes] = useState<Set<string>>(new Set());

  const handleLike = async (jokeId: string) => {
    setLikedJokes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jokeId)) {
        newSet.delete(jokeId);
      } else {
        newSet.add(jokeId);
      }
      return newSet;
    });
  };

  const handleTip = (creator: string) => {
    alert(`Tipping ${creator} with USDC via MetaMask Card! 💳`);
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    alert("Address copied!");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 px-2">
        Fresh Jokes from the Chain
      </h2>

      {mockJokes.map((joke) => (
        <Card
          key={joke.id}
          className="border-orange-100 shadow-sm transition-shadow hover:shadow-md"
        >
          <CardHeader className="flex flex-row items-start space-x-4 p-4">
            <Identicon address={joke.creator} size={48} />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900">
                    {joke.creator.slice(0, 6)}...{joke.creator.slice(-4)}
                  </span>
                  <button
                    onClick={() => copyAddress(joke.creator)}
                    title="Copy address"
                  >
                    <Copy className="w-3.5 h-3.5 text-gray-400 hover:text-orange-600 transition-colors" />
                  </button>
                </div>
                <a
                  href={`https://etherscan.io/tx/${joke.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline flex items-center space-x-1"
                  title="View on Etherscan"
                >
                  <span>
                    {formatDistanceToNow(joke.timestamp, { addSuffix: true })}
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-sm text-gray-500">Verified Dad</p>
            </div>
          </CardHeader>

          <CardContent className="px-4 pb-2">
            <p className="text-gray-800 text-base mb-3 leading-relaxed">
              {joke.text}
            </p>
            {joke.image && (
              <div className="relative mb-3 aspect-video max-h-80 w-full overflow-hidden rounded-lg border">
                <Image
                  src={joke.image}
                  alt="Joke meme"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between items-center p-4 pt-0">
            <div className="flex items-center space-x-5 text-gray-500">
              <button
                onClick={() => handleLike(joke.id)}
                className={`flex items-center space-x-1.5 hover:text-red-500 transition-colors ${
                  likedJokes.has(joke.id) ? "text-red-500" : ""
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${
                    likedJokes.has(joke.id) ? "fill-current" : ""
                  }`}
                />
                <span className="text-sm font-medium">
                  {joke.likes + (likedJokes.has(joke.id) ? 1 : 0)}
                </span>
              </button>
              <button className="flex items-center space-x-1.5 hover:text-blue-500 transition-colors">
                <MessageSquare className="w-5 h-5" />
                <span className="text-sm font-medium">{joke.comments}</span>
              </button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTip(joke.creator)}
              className="border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800 transition-colors"
            >
              <DollarSign className="w-4 h-4 mr-1.5" />
              Tip USDC
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
