import { Header } from "@/components/header"
import { JokeSubmissionForm } from "@/components/joke-submission-form"
import { TimelineFeed } from "@/components/timeline-feed"
import { StatsOverview } from "@/components/stats-overview"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to DadChain 👨‍👧‍👦</h1>
          <p className="text-lg text-gray-600">The world's first fully decentralized dad joke platform</p>
        </div>

        <StatsOverview />
        <JokeSubmissionForm />
        <TimelineFeed />
      </main>
    </div>
  )
}
