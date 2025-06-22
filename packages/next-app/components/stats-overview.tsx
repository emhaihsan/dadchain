import { Card, CardContent } from "@/components/ui/card"

export function StatsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card className="border-orange-200">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">1,247</div>
          <div className="text-sm text-gray-600">Total Jokes</div>
        </CardContent>
      </Card>

      <Card className="border-orange-200">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">$2,341</div>
          <div className="text-sm text-gray-600">USDC Tips</div>
        </CardContent>
      </Card>

      <Card className="border-orange-200">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">892</div>
          <div className="text-sm text-gray-600">Active Dads</div>
        </CardContent>
      </Card>

      <Card className="border-orange-200">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">156</div>
          <div className="text-sm text-gray-600">NFT Badges</div>
        </CardContent>
      </Card>
    </div>
  )
}
