import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

// Mock poll data
const mockPoll = {
  id: "1",
  title: "What's your favorite programming language?",
  description: "Vote for your preferred programming language for web development",
  options: [
    { id: "1", text: "JavaScript", votes: 45, percentage: 28.8 },
    { id: "2", text: "Python", votes: 38, percentage: 24.4 },
    { id: "3", text: "TypeScript", votes: 32, percentage: 20.5 },
    { id: "4", text: "Java", votes: 25, percentage: 16.0 },
    { id: "5", text: "C#", votes: 16, percentage: 10.3 }
  ],
  totalVotes: 156,
  createdAt: "2024-01-15",
  author: "John Doe",
  isActive: true
}

export default function PollDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/polls">
            <Button variant="ghost" className="mb-4">
              ← Back to Polls
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{mockPoll.title}</CardTitle>
            <CardDescription>{mockPoll.description}</CardDescription>
            <div className="flex justify-between text-sm text-gray-600">
              <span>By {mockPoll.author}</span>
              <span>Created: {mockPoll.createdAt}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-blue-600">{mockPoll.totalVotes}</div>
                <div className="text-sm text-gray-600">Total Votes</div>
              </div>

              <div className="space-y-3">
                {mockPoll.options.map((option) => (
                  <div key={option.id} className="relative">
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <span className="font-medium">{option.text}</span>
                      <div className="text-right">
                        <div className="font-semibold">{option.votes} votes</div>
                        <div className="text-sm text-gray-600">{option.percentage}%</div>
                      </div>
                    </div>
                    <div 
                      className="absolute top-0 left-0 h-full bg-blue-100 rounded-lg transition-all duration-300"
                      style={{ width: `${option.percentage}%` }}
                    />
                  </div>
                ))}
              </div>

              {mockPoll.isActive && (
                <div className="pt-4">
                  <Button className="w-full" size="lg">
                    Vote Now
                  </Button>
                </div>
              )}

              {!mockPoll.isActive && (
                <div className="pt-4 text-center">
                  <p className="text-gray-600">This poll is no longer active</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
