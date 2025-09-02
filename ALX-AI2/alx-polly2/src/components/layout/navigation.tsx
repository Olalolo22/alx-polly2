import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-blue-600">
              PollApp
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/polls" className="text-gray-700 hover:text-blue-600">
                Browse Polls
              </Link>
              <Link href="/polls/create" className="text-gray-700 hover:text-blue-600">
                Create Poll
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
