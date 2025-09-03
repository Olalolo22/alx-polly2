import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { DeletePollButton } from "@/components/polls/delete-poll-button";

export default async function PollsPage({ searchParams }: { searchParams?: { created?: string; updated?: string; deleted?: string } }) {
  const showCreated = searchParams?.created === "1";
  const showUpdated = searchParams?.updated === "1";
  const showDeleted = searchParams?.deleted === "1";

  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: polls } = await supabase
    .from("polls")
    .select("id, title, description, creator_id, created_at")
    .order("created_at", { ascending: false });

  const pollIds = (polls || []).map((p: any) => p.id);
  let totalVotesByPoll = new Map<string, number>();
  if (pollIds.length > 0) {
    const { data: counts } = await supabase
      .from("poll_option_results")
      .select("poll_id, votes_count")
      .in("poll_id", pollIds);
    totalVotesByPoll = new Map<string, number>();
    (counts || []).forEach((row: any) => {
      const current = totalVotesByPoll.get(row.poll_id) || 0;
      totalVotesByPoll.set(row.poll_id, current + Number(row.votes_count));
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {showCreated && (
        <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          Poll created successfully.
        </div>
      )}
      {showUpdated && (
        <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
          Poll updated successfully.
        </div>
      )}
      {showDeleted && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          Poll deleted successfully.
        </div>
      )}
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
        {(polls || []).map((poll: any) => {
          const totalVotes = totalVotesByPoll.get(poll.id) || 0;
          const isOwner = user?.id === poll.creator_id;
          return (
            <Card key={poll.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{poll.title}</CardTitle>
                {poll.description && <CardDescription>{poll.description}</CardDescription>}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Total votes: {totalVotes}</span>
                    <span className="text-xs">{new Date(poll.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/polls/${poll.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">View</Button>
                    </Link>
                    {isOwner && (
                      <>
                        <Link href={`/polls/${poll.id}/edit`} className="flex-1">
                          <Button variant="secondary" className="w-full">Edit</Button>
                        </Link>
                        <DeletePollButton pollId={poll.id} />
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
