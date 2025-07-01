"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { motion } from "framer-motion";

import { dadChainCoreContract } from "@/lib/contracts";
import { BadgeCard } from "@/components/badge-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Identicon } from "@/components/identicon";
import { Button } from "@/components/ui/button";
import { Copy, Heart, MessageSquare, DollarSign, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Definisi badge statis
const badges = [
  {
    id: 1,
    name: "Bronze Badge",
    description: "Submit your first joke to earn this badge",
    image: "/badges/bronze-badge.svg",
    requiredJokeCount: 1,
  },
  {
    id: 2,
    name: "Silver Badge",
    description: "Submit at least 5 jokes to earn this badge",
    image: "/badges/silver-badge.svg",
    requiredJokeCount: 5,
  },
  {
    id: 3,
    name: "Gold Badge",
    description: "Submit 10 jokes and become a true comedy legend",
    image: "/badges/gold-badge.svg",
    requiredJokeCount: 10,
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  // State untuk memaksa refresh data setelah klaim badge
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 1. Fetch user profile stats from the smart contract
  const { data: userProfile, isLoading: isLoadingProfile } = useReadContract({
    ...dadChainCoreContract,
    functionName: "getUserProfile",
    args: [address!],
    query: { enabled: !!address }, // Only run query if address is available
  });

  // Safely destructure the returned data
  const [jokesCount, likesCount, tipsReceived] = Array.isArray(userProfile)
    ? userProfile
    : [BigInt(0), BigInt(0), BigInt(0)];

  // Redirect if wallet is not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success("Address copied to clipboard!");
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isConnected || !address) {
    return null; // or a login prompt
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden border-orange-100">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 h-24" />
          <CardContent className="p-6">
            <div className="flex items-start -mt-16">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-md flex-shrink-0">
                <Identicon address={address} size={88} />
              </div>
              <div className="ml-4 mt-16 flex-grow">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-gray-800">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </h1>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyAddress}
                    title="Copy address"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">DadChain User</p>
              </div>
            </div>
            {/* User Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <MessageSquare className="mx-auto h-6 w-6 text-blue-500 mb-2" />
                <p className="text-2xl font-bold text-blue-600">
                  {jokesCount.toString()}
                </p>
                <p className="text-sm text-muted-foreground">Jokes Submitted</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <Heart className="mx-auto h-6 w-6 text-red-500 mb-2" />
                <p className="text-2xl font-bold text-red-600">
                  {likesCount.toString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Likes</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <DollarSign className="mx-auto h-6 w-6 text-green-500 mb-2" />
                <p className="text-2xl font-bold text-green-600">
                  {formatUnits(tipsReceived, 6)}{" "}
                  <span className="text-base font-normal">USDC</span>
                </p>
                <p className="text-sm text-muted-foreground">Tips Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Jokes and Badges */}
        <Tabs defaultValue="badges" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="jokes">My Jokes</TabsTrigger>
            <TabsTrigger value="badges">My Badges</TabsTrigger>
          </TabsList>
          <TabsContent value="jokes" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>My Jokes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This section is under construction. Your awesome jokes will
                  appear here soon!
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="badges" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <BadgeCard
                  key={badge.id}
                  id={badge.id}
                  name={badge.name}
                  description={badge.description}
                  image={badge.image}
                  requiredJokeCount={badge.requiredJokeCount}
                  userJokeCount={Number(jokesCount)}
                  onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
