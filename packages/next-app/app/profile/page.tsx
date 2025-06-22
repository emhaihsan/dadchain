"use client";

import { useAccount } from "wagmi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, DollarSign } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const userProfile = {
  dadScore: 2847,
  joinDate: "March 2024",
  totalJokes: 156,
  totalLikes: 3421,
  totalTips: 892.5,
  nftBadges: [
    {
      name: "Dad Legend",
      description: "Posted 100+ jokes",
      rarity: "Legendary",
      image: "",
    },
    {
      name: "Joke Master",
      description: "Received 1000+ likes",
      rarity: "Epic",
      image: "",
    },
    {
      name: "Tip King",
      description: "Received $500+ in tips",
      rarity: "Rare",
      image: "",
    },
    {
      name: "Early Adopter",
      description: "Joined in first month",
      rarity: "Common",
      image: "",
    },
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
};

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    // If the user disconnects while on this page, redirect them to the homepage.
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  // While redirecting or for the initial non-connected state, render a loading/empty state.
  // This prevents a flash of the profile content or the connect message before redirecting.
  if (!isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-20 w-20 border">
                <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                <AvatarFallback>DJ</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">Dad Joke Enthusiast</CardTitle>
                <CardDescription className="break-all">
                  {address}
                </CardDescription>
                <div className="mt-2 flex gap-2">
                  <Badge variant="secondary">Tier: Groaner</Badge>
                  <Badge variant="destructive">
                    Dad Score: {userProfile.dadScore.toLocaleString()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Lover of puns and master of the perfectly-timed, cringe-worthy
                joke. Here to share the best of the worst.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Joke Stats</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{userProfile.totalJokes}</p>
                <p className="text-sm text-muted-foreground">Jokes Submitted</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">
                  {userProfile.totalLikes.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total Likes Received
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">#24</p>
                <p className="text-sm text-muted-foreground">
                  Leaderboard Rank
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Recent Jokes</CardTitle>
            </CardHeader>
            <CardContent>
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
                              <h3 className="font-semibold text-gray-900">
                                {badge.name}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                {badge.description}
                              </p>
                              <Badge
                                variant="secondary"
                                className={`
                                  ${
                                    badge.rarity === "Legendary"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : ""
                                  }
                                  ${
                                    badge.rarity === "Epic"
                                      ? "bg-purple-100 text-purple-700"
                                      : ""
                                  }
                                  ${
                                    badge.rarity === "Rare"
                                      ? "bg-blue-100 text-blue-700"
                                      : ""
                                  }
                                  ${
                                    badge.rarity === "Common"
                                      ? "bg-gray-100 text-gray-700"
                                      : ""
                                  }
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
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
