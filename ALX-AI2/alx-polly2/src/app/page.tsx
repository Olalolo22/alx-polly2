import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Create and Vote on
          <span className="text-blue-600"> Polls</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A modern polling platform where you can create engaging polls, 
          share them with others, and see real-time results.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/polls">
            <Button size="lg" className="text-lg px-8 py-3">
              Browse Polls
            </Button>
          </Link>
          <Link href="/polls/create">
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Create Poll
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardHeader>
            <CardTitle>Easy to Create</CardTitle>
            <CardDescription>
              Create polls in seconds with our intuitive interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Simply enter your question, add options, and share with your audience. 
              No complex setup required.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Real-time Results</CardTitle>
            <CardDescription>
              See votes and results as they happen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Watch your poll results update in real-time as people vote. 
              Get instant insights into what your audience thinks.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Share Anywhere</CardTitle>
            <CardDescription>
              Share your polls on any platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Generate shareable links for your polls and distribute them 
              across social media, email, or any other platform.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Polls Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Polls</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">What's your favorite programming language?</CardTitle>
              <CardDescription>156 votes • 2 hours ago</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/polls/1">
                <Button variant="outline" className="w-full">
                  View Poll
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Best framework for web development?</CardTitle>
              <CardDescription>89 votes • 5 hours ago</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/polls/2">
                <Button variant="outline" className="w-full">
                  View Poll
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Preferred database system</CardTitle>
              <CardDescription>234 votes • 1 day ago</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/polls/3">
                <Button variant="outline" className="w-full">
                  View Poll
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Link href="/polls">
          <Button variant="outline" size="lg">
            View All Polls
          </Button>
        </Link>
      </div>
    </div>
  )
}
