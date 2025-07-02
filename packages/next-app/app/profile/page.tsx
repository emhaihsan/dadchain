"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { motion } from "framer-motion";

import { dadChainCoreContract } from "@/lib/contracts";
import { BadgeCard } from "@/components/badge-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!isConnected || !address) {
    return null; // or a login prompt
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden border-white/20 backdrop-blur-lg bg-white/70 shadow-lg rounded-xl">
          <div className="bg-gradient-to-r from-orange-400/20 via-purple-400/20 to-blue-400/20 h-24 relative overflow-hidden">
            {/* Menghapus referensi ke file yang tidak ada */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
              <div className="absolute top-4 right-8 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="flex items-start -mt-16">
              <div className="w-24 h-24 rounded-full bg-white/80 backdrop-blur-sm border-4 border-white shadow-md flex-shrink-0 overflow-hidden">
                <Identicon address={address} size={88} />
              </div>
              <div className="ml-4 mt-16 flex-grow">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-purple-600">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </h1>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyAddress}
                    title="Copy address"
                    className="hover:bg-white/20 hover:scale-110 transition-all"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">DadChain User</p>
              </div>
            </div>
            {/* User Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 backdrop-blur-md bg-blue-50/70 rounded-lg border border-blue-100/50 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
                <MessageSquare className="mx-auto h-6 w-6 text-blue-500 mb-2" />
                <p className="text-2xl font-bold text-blue-600">
                  {jokesCount.toString()}
                </p>
                <p className="text-sm text-muted-foreground">Jokes Submitted</p>
              </div>
              <div className="p-4 backdrop-blur-md bg-red-50/70 rounded-lg border border-red-100/50 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
                <Heart className="mx-auto h-6 w-6 text-red-500 mb-2" />
                <p className="text-2xl font-bold text-red-600">
                  {likesCount.toString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Likes</p>
              </div>
              <div className="p-4 backdrop-blur-md bg-green-50/70 rounded-lg border border-green-100/50 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
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

        {/* Badges Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-purple-600">
            My Badges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: badge.id * 0.1 }}
              >
                <BadgeCard
                  id={badge.id}
                  name={badge.name}
                  description={badge.description}
                  image={badge.image}
                  requiredJokeCount={badge.requiredJokeCount}
                  userJokeCount={Number(jokesCount)}
                  onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
