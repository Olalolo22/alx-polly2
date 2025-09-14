import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useState } from "react"
import { createPoll } from "@/lib/actions"

export default function CreatePollPage() {
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
            <CardTitle>Create New Poll</CardTitle>
            <CardDescription>
              Create a new poll and share it with others
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" action={createPoll}>
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Poll Title
                </label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter your poll question"
                  required
                  name="title"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Add more details about your poll"
                  rows={3}
                  name="description"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">Poll Options</label>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Option ${index}`}
                        required={index <= 2}
                        name="options"
                      />
                      {index > 2 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="px-3"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" size="sm">
                  + Add Option
                </Button>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">Poll Settings</label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="multiple-votes"
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="multiple-votes" className="text-sm">
                      Allow multiple votes
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="show-results"
                      className="rounded border-gray-300"
                      defaultChecked
                    />
                    <label htmlFor="show-results" className="text-sm">
                      Show results immediately after voting
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="expiration-date" className="text-sm font-medium">
                  Expiration Date (Optional)
                </label>
                <Input
                  id="expiration-date"
                  type="datetime-local"
                  name="expirationDate"
                  min={new Date().toISOString().slice(0, 16)}
                />
                <p className="text-xs text-gray-500">
                  Leave empty for no expiration. Poll will automatically close after this date.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Create Poll
                </Button>
                <Link href="/polls">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
