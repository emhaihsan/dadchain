"use client";

import { useState, useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Identicon } from "@/components/identicon";
import { Trophy, Medal, Award, Loader2 } from "lucide-react";
import { StatsOverview } from "@/components/stats-overview";
import { motion } from "framer-motion";
import { useReadContract, useReadContracts } from "wagmi";
import { dadChainCoreContract } from "@/lib/contracts";
import { formatUnits } from "viem";

// Tipe data untuk leaderboard yang sudah diproses
type LeaderboardEntry = {
  address: string;
  jokes: number;
  likes: number;
  tips: number;
  dadScore: number;
};

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="w-6 h-6 text-yellow-500" />;
    case 2:
      return <Medal className="w-6 h-6 text-slate-400" />;
    case 3:
      return <Award className="w-6 h-6 text-amber-700" />;
    default:
      return <span className="font-semibold text-gray-500">{rank}</span>;
  }
};

function LeaderboardTable({ data }: { data: LeaderboardEntry[] }) {
  const { address: currentUserAddress } = useAccount();

  return (
    <Card className="backdrop-blur-lg bg-white/70 border border-white/20 shadow-lg rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-100/50 bg-white/50">
            <TableHead className="w-16 text-center">Rank</TableHead>
            <TableHead>User</TableHead>
            <TableHead className="text-right">Jokes</TableHead>
            <TableHead className="text-right">Likes</TableHead>
            <TableHead className="text-right">Tips (USDC)</TableHead>
            <TableHead className="text-right">Dad Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((user, index) => (
            <TableRow
              key={user.address}
              className={
                user.address.toLowerCase() === currentUserAddress?.toLowerCase()
                  ? "bg-gradient-to-r from-orange-50/50 to-purple-50/50"
                  : "hover:bg-white/40 transition-colors"
              }
            >
              <TableCell className="font-medium text-center">
                {getRankIcon(index + 1)}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Identicon address={user.address} size={40} />
                    {index < 3 && (
                      <div
                        className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          index === 0
                            ? "bg-yellow-400"
                            : index === 1
                            ? "bg-slate-300"
                            : "bg-amber-600"
                        }`}
                      ></div>
                    )}
                  </div>
                  <div>
                    <div
                      className={`font-medium ${
                        index < 3
                          ? "bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-purple-600"
                          : "text-gray-800"
                      }`}
                    >
                      {user.address.slice(0, 6)}...{user.address.slice(-4)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {index === 0
                        ? "Legendary Dad"
                        : index < 3
                        ? "Elite Dad"
                        : "Dad Extraordinaire"}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-mono">
                {user.jokes}
              </TableCell>
              <TableCell className="text-right font-mono">
                {user.likes}
              </TableCell>
              <TableCell className="text-right font-mono">
                {user.tips.toFixed(2)}
              </TableCell>
              <TableCell className="text-right font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-purple-600">
                {user.dadScore.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [globalStats, setGlobalStats] = useState({
    totalLikes: 0,
    totalTips: 0,
  });

  // 1. Get total number of jokes, users, and tips from the contract
  const { data: contractStats, isLoading: isLoadingStats } = useReadContracts({
    contracts: [
      {
        ...dadChainCoreContract,
        functionName: "totalJokes",
      },
      {
        ...dadChainCoreContract,
        functionName: "totalUsers",
      },
      {
        ...dadChainCoreContract,
        functionName: "totalTips",
      },
    ],
  });

  const [totalJokes, totalUsers, totalTips] = useMemo(() => {
    if (!contractStats) return [0, 0, 0];
    return [
      contractStats[0].result ? Number(contractStats[0].result) : 0,
      contractStats[1].result ? Number(contractStats[1].result) : 0,
      contractStats[2].result
        ? Number(formatUnits(contractStats[2].result as bigint, 6))
        : 0,
    ];
  }, [contractStats]);

  // 2. Get all jokes if totalJokes is available
  const { data: allJokes, isLoading: isLoadingAllJokes } = useReadContract({
    ...dadChainCoreContract,
    functionName: "getJokesPaginated",
    args: [0, totalJokes],
    query: {
      enabled: totalJokes > 0,
    },
  });

  useEffect(() => {
    if (allJokes && Array.isArray(allJokes)) {
      // 3. Process the jokes data to create the leaderboard
      const userStats: {
        [address: string]: Omit<LeaderboardEntry, "address">;
      } = {};
      let calculatedTotalLikes = 0;

      allJokes.forEach((joke) => {
        const creator = joke.creator;
        const likeCount = Number(joke.likeCount);
        calculatedTotalLikes += likeCount;

        if (!userStats[creator]) {
          userStats[creator] = { jokes: 0, likes: 0, tips: 0, dadScore: 0 };
        }
        userStats[creator].jokes += 1;
        userStats[creator].likes += likeCount;
        userStats[creator].tips += Number(formatUnits(joke.tipAmount, 6)); // Assuming USDC has 6 decimals
      });

      setGlobalStats((prev) => ({ ...prev, totalLikes: calculatedTotalLikes }));

      // 4. Calculate Dad Score and sort
      const calculatedLeaderboard = Object.entries(userStats)
        .map(([address, stats]) => {
          const dadScore = stats.likes * 5 + stats.jokes * 10; // Example scoring
          return { ...stats, address, dadScore };
        })
        .sort((a, b) => b.dadScore - a.dadScore);

      setLeaderboardData(calculatedLeaderboard);
    }
  }, [allJokes]);

  const isLoading = isLoadingStats || isLoadingAllJokes;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-blue-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <motion.main
        className="container mx-auto max-w-5xl px-4 py-10 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-purple-600 mb-4">
            DadChain Leaderboard
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            The ultimate ranking of dad joke masters. Who will be crowned the
            king of dad jokes?
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatsOverview
            totalJokes={totalJokes}
            totalLikes={globalStats.totalLikes}
            totalTips={totalTips}
            totalUsers={totalUsers}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8">
          <Card className="backdrop-blur-lg bg-white/70 border border-white/20 shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="border-b border-gray-100/50 bg-gradient-to-r from-orange-50/50 to-purple-50/50">
              <CardTitle className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-purple-600">
                All-Time Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                  <p className="ml-4 text-muted-foreground">
                    Loading on-chain data...
                  </p>
                </div>
              ) : leaderboardData.length > 0 ? (
                <LeaderboardTable data={leaderboardData} />
              ) : (
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground">
                    No data to display yet.
                  </p>
                  <p className="text-sm text-gray-500">
                    Submit the first joke to get on the board!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.main>

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

export default LeaderboardPage;
