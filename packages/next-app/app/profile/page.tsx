"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Identicon } from "@/components/identicon";

import {
  Heart,
  MessageSquare,
  DollarSign,
  Copy,
  Award,
  Trophy,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

// Mock data - in a real app, this would be fetched based on the user's address
const userProfile = {
  totalJokes: 156,
  totalLikes: 3421,
  totalTips: 892.5,
  nftBadges: [
    {
      name: "Dad Legend",
      description: "Posted 100+ jokes",
      rarity: "Legendary",
      icon: Trophy,
    },
    {
      name: "Joke Master",
      description: "Received 1000+ likes",
      rarity: "Epic",
      icon: Star,
    },
    {
      name: "Tip King",
      description: "Received $500+ in tips",
      rarity: "Rare",
      icon: Award,
    },
    {
      name: "Early Adopter",
      description: "Joined in the first month",
      rarity: "Common",
      icon: Heart,
    },
  ],
  jokes: [
    {
      id: "1",
      text: "Why don't scientists trust atoms? Because they make up everything!",
      likes: 42,
      tips: 15.5,
      comments: 7,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "2",
      text: "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      likes: 38,
      tips: 8.2,
      comments: 4,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ],
};

const rarityStyles: { [key: string]: string } = {
  Legendary: "border-yellow-400 bg-yellow-50 text-yellow-700",
  Epic: "border-purple-400 bg-purple-50 text-purple-700",
  Rare: "border-blue-400 bg-blue-50 text-blue-700",
  Common: "border-gray-300 bg-gray-50 text-gray-700",
};

export default function ProfilePage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address as string);
      alert("Address copied!");
    }
  };

  // Redirect jika tidak terhubung
  if (!isConnected || !address) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gray-50" suppressHydrationWarning>
      <motion.main
        className="container mx-auto max-w-5xl px-4 py-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Header Card */}
        <motion.div variants={itemVariants}>
          <Card className="mb-8 overflow-hidden border-orange-100">
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 h-24" />
            <div className="p-6 pt-0">
              <div className="flex items-end -mt-12">
                <div className="p-1 bg-gray-50 rounded-full">
                  <Identicon address={address} size={96} />
                </div>
                <div className="ml-4 flex-grow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold text-gray-800">
                        {address.slice(0, 6)}...{address.slice(-4)}
                      </h1>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={copyAddress}
                        title="Copy address"
                      >
                        <Copy className="h-4 w-4 text-gray-500 hover:text-orange-600" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Verified Dad</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">
                    {userProfile.totalJokes}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Jokes Submitted
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">
                    {userProfile.totalLikes.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Likes</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    ${userProfile.totalTips.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Tips Earned</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tabs for Jokes and Badges */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="jokes" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-orange-100/50">
              <TabsTrigger value="jokes">My Jokes</TabsTrigger>
              <TabsTrigger value="badges">NFT Badges</TabsTrigger>
            </TabsList>

            <TabsContent value="jokes" className="mt-6 space-y-4">
              {userProfile.jokes.map((joke) => (
                <Card key={joke.id} className="border-orange-100 shadow-sm">
                  <CardContent className="p-4 flex justify-between items-center">
                    <p className="text-gray-800 flex-grow pr-4">{joke.text}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 flex-shrink-0">
                      <span className="flex items-center">
                        <Heart className="w-4 h-4 mr-1 text-red-400" />{" "}
                        {joke.likes}
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1 text-blue-400" />{" "}
                        {joke.comments}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1 text-green-400" /> $
                        {joke.tips}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="badges" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {userProfile.nftBadges.map((badge) => (
                  <Card
                    key={badge.name}
                    className={`border-2 ${
                      rarityStyles[badge.rarity]
                    } transition-transform hover:-translate-y-1`}
                  >
                    <CardContent className="p-4 text-center">
                      <div
                        className={`mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-white mb-3`}
                      >
                        <badge.icon
                          className={`h-8 w-8 ${
                            rarityStyles[badge.rarity].split(" ")[2]
                          }`}
                        />
                      </div>
                      <h3 className="font-bold text-lg mb-1">{badge.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {badge.description}
                      </p>
                      <Badge
                        variant="outline"
                        className={rarityStyles[badge.rarity]}
                      >
                        {badge.rarity}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.main>
    </div>
  );
}
