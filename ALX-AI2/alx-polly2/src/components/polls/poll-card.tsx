import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Poll } from "@/types/poll"

interface PollCardProps {
  poll: Poll
}

export default function PollCard({ poll }: PollCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">{poll.title}</CardTitle>
        <CardDescription className="line-clamp-2">{poll.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{poll.totalVotes} votes</span>
            <span>By {poll.author}</span>
          </div>
          <div className="text-xs text-gray-500">
            Created: {new Date(poll.createdAt).toLocaleDateString()}
          </div>
          <Link href={`/polls/${poll.id}`}>
            <Button variant="outline" className="w-full">
              {poll.isActive ? "Vote Now" : "View Results"}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
