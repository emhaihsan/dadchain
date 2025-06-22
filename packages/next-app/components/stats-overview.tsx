import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, DollarSign, Award } from "lucide-react";

export function StatsOverview() {
  const stats = [
    {
      title: "Total Jokes",
      value: "1,247",
      icon: MessageSquare,
      color: "text-orange-600",
    },
    {
      title: "USDC Tips",
      value: "$2,341",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Active Dads",
      value: "892",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "NFT Badges",
      value: "156",
      icon: Award,
      color: "text-blue-600",
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
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
