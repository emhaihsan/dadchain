import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, DollarSign, Heart } from "lucide-react";

interface StatsOverviewProps {
  totalJokes: number;
  totalTips: number;
  totalUsers: number;
  totalLikes: number;
}

export function StatsOverview({
  totalJokes,
  totalTips,
  totalUsers,
  totalLikes,
}: StatsOverviewProps) {
  const stats = [
    {
      title: "Total Jokes",
      value: totalJokes.toLocaleString(),
      icon: MessageSquare,
      color: "text-orange-600",
      description: "All jokes submitted on-chain.",
    },
    {
      title: "Total Likes",
      value: totalLikes.toLocaleString(),
      icon: Heart,
      color: "text-red-600",
      description: "Total likes across all jokes.",
    },
    {
      title: "USDC Tips",
      value: `$${totalTips.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      color: "text-green-600",
      description: "Total USDC tipped to creators.",
    },
    {
      title: "Active Dads",
      value: totalUsers.toLocaleString(),
      icon: Users,
      color: "text-purple-600",
      description: "Total unique participating users.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="border-orange-100 hover:shadow-lg hover:-translate-y-1 transition-transform duration-300"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
