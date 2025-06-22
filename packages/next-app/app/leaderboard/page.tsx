"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Identicon } from "@/components/identicon";
import { Trophy, Medal, Award } from "lucide-react";

// Mock data for different time ranges
const allTimeData = [
  {
    rank: 1,
    address: "0x742d35Cc6634C0532925a3b8D404d3aABb8c4532",
    dadScore: 2847,
    jokes: 156,
    tips: 892.5,
  },
  {
    rank: 2,
    address: "0x8ba1f109551bD432803012645Hac136c30C6213",
    dadScore: 2156,
    jokes: 98,
    tips: 567.2,
  },
  {
    rank: 3,
    address: "0x1234567890abcdef1234567890abcdef12345678",
    dadScore: 1923,
    jokes: 87,
    tips: 445.8,
  },
  {
    rank: 4,
    address: "0x4567890123456789012345678901234567890123",
    dadScore: 1850,
    jokes: 80,
    tips: 410.1,
  },
  {
    rank: 5,
    address: "0xabcdeffedcba9876543210fedcba9876543210fe",
    dadScore: 1790,
    jokes: 75,
    tips: 390.7,
  },
];

const monthlyData = [
  {
    rank: 1,
    address: "0x8ba1f109551bD432803012645Hac136c30C6213",
    dadScore: 980,
    jokes: 40,
    tips: 250.0,
  },
  {
    rank: 2,
    address: "0x742d35Cc6634C0532925a3b8D404d3aABb8c4532",
    dadScore: 850,
    jokes: 35,
    tips: 210.5,
  },
  {
    rank: 3,
    address: "0x4567890123456789012345678901234567890123",
    dadScore: 760,
    jokes: 30,
    tips: 180.3,
  },
];

const weeklyData = [
  {
    rank: 1,
    address: "0x1234567890abcdef1234567890abcdef12345678",
    dadScore: 310,
    jokes: 12,
    tips: 95.0,
  },
  {
    rank: 2,
    address: "0x742d35Cc6634C0532925a3b8D404d3aABb8c4532",
    dadScore: 290,
    jokes: 10,
    tips: 80.0,
  },
];

const leaderboardTabs = [
  { value: "allTime", label: "All-Time", data: allTimeData },
  { value: "monthly", label: "Monthly", data: monthlyData },
  { value: "weekly", label: "Weekly", data: weeklyData },
];

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

function LeaderboardTable({
  data,
  currentUserAddress,
}: {
  data: typeof allTimeData;
  currentUserAddress?: string;
}) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center">Rank</TableHead>
            <TableHead>User</TableHead>
            <TableHead className="text-right">Jokes</TableHead>
            <TableHead className="text-right">Tips (USDC)</TableHead>
            <TableHead className="text-right">Dad Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((user) => (
            <TableRow
              key={user.address}
              className={
                user.address.toLowerCase() === currentUserAddress?.toLowerCase()
                  ? "bg-orange-50"
                  : ""
              }
            >
              <TableCell className="font-medium text-center">
                {getRankIcon(user.rank)}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Identicon address={user.address} size={40} />
                  <div>
                    <div className="font-medium text-gray-800">
                      {user.address.slice(0, 6)}...{user.address.slice(-4)}
                    </div>
                    <div className="text-sm text-gray-500">Verified Dad</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-mono">
                {user.jokes}
              </TableCell>
              <TableCell className="text-right font-mono">
                ${user.tips.toFixed(2)}
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

export default function LeaderboardPage() {
  const { address } = useAccount();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto max-w-5xl px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Hall of Dads
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            The official ranking of the most legendary dads on the chain.
          </p>
        </div>

        <Tabs defaultValue="allTime" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-orange-100/50 mb-6">
            {leaderboardTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {leaderboardTabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <LeaderboardTable data={tab.data} currentUserAddress={address} />
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}
