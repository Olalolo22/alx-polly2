import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

// Mock data for demonstration
const mockPolls = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    description: "Vote for your preferred programming language",
    totalVotes: 156,
    createdAt: "2024-01-15",
    author: "John Doe"
  },
  {
    id: "2",
    title: "Best framework for web development?",
    description: "Choose the best web development framework",
    totalVotes: 89,
    createdAt: "2024-01-14",
    author: "Jane Smith"
  },
  {
    id: "3",
    title: "Preferred database system",
    description: "Which database system do you prefer?",
    totalVotes: 234,
    createdAt: "2024-01-13",
    author: "Mike Johnson"
  }
]

export default function PollsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">All Polls</h1>
          <p className="text-gray-600">Discover and vote on interesting polls</p>
        </div>
        <Link href="/polls/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockPolls.map((poll) => (
          <Card key={poll.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{poll.title}</CardTitle>
              <CardDescription>{poll.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total votes: {poll.totalVotes}</span>
                  <span>By {poll.author}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Created: {poll.createdAt}
                </div>
                <Link href={`/polls/${poll.id}`}>
                  <Button variant="outline" className="w-full">
                    View Poll
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
