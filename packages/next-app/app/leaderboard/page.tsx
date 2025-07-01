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
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
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
                  ? "bg-orange-50"
                  : ""
              }
            >
              <TableCell className="font-medium text-center">
                {getRankIcon(index + 1)}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Identicon address={user.address} size={40} />
                  <div>
                    <div className="font-medium text-gray-800">
                      {user.address.slice(0, 6)}...{user.address.slice(-4)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Dad Extraordinaire
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
              <TableCell className="text-right font-bold text-orange-600">
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
    <div className="min-h-screen bg-gray-50">
      <motion.main
        className="container mx-auto max-w-5xl px-4 py-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <StatsOverview
            totalJokes={totalJokes}
            totalLikes={globalStats.totalLikes}
            totalTips={totalTips}
            totalUsers={totalUsers}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold tracking-tight">
                All-Time Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
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
    </div>
  );
}

export default LeaderboardPage;
