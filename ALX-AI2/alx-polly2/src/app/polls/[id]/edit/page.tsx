import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { updatePoll } from "@/lib/actions";

export default async function EditPollPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const pollId = params.id;

  const { data: poll, error } = await supabase
    .from("polls")
    .select("id, title, description, creator_id")
    .eq("id", pollId)
    .single();

  if (error || !poll) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-sm text-red-600">Poll not found.</p>
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== poll.creator_id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-sm text-red-600">You are not allowed to edit this poll.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/polls">
            <Button variant="ghost" className="mb-4">← Back to Polls</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Poll</CardTitle>
            <CardDescription>Update the title or description</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updatePoll} className="space-y-6">
              <input type="hidden" name="poll_id" value={poll.id} />
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <Input id="title" name="title" defaultValue={poll.title} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  rows={3}
                  defaultValue={poll.description ?? ""}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Save</Button>
                <Link href={`/polls/${poll.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">Cancel</Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


