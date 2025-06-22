import { Header } from "@/components/header";
import { TimelineFeed } from "@/components/timeline-feed";
import { StatsOverview } from "@/components/stats-overview";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 py-10 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <TimelineFeed />
        </div>
        <aside className="space-y-8">
          <StatsOverview />
        </aside>
      </main>
    </div>
  );
}
