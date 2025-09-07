import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { DeletePollButton } from "@/components/polls/delete-poll-button";
import { PollFromDB, PollWithVotes } from "@/types/poll";

// Success banner component
function SuccessBanner({ 
  type, 
  message 
}: { 
  type: 'created' | 'updated' | 'deleted'; 
  message: string; 
}) {
  const styles = {
    created: "border-green-200 bg-green-50 text-green-800",
    updated: "border-blue-200 bg-blue-50 text-blue-800", 
    deleted: "border-red-200 bg-red-50 text-red-800"
  };

  return (
    <div className={`mb-4 rounded-md border p-3 text-sm ${styles[type]}`}>
      {message}
    </div>
  );
}

// Individual poll card component
function PollCard({ 
  poll, 
  totalVotes, 
  isOwner 
}: { 
  poll: PollFromDB; 
  totalVotes: number; 
  isOwner: boolean; 
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
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
}

// Utility function to get polls with vote counts
async function getPollsWithVoteCounts(supabase: any, userId?: string): Promise<PollWithVotes[]> {
  const { data: polls, error: pollsError } = await supabase
    .from("polls")
    .select("id, title, description, creator_id, created_at")
    .order("created_at", { ascending: false });

  if (pollsError) {
    console.error('Error fetching polls:', pollsError);
    return [];
  }

  if (!polls || polls.length === 0) {
    return [];
  }

  const pollIds = polls.map((p: PollFromDB) => p.id);
  
  // Get vote counts for all polls
  const { data: counts, error: countsError } = await supabase
    .from("poll_option_results")
    .select("poll_id, votes_count")
    .in("poll_id", pollIds);

  if (countsError) {
    console.error('Error fetching vote counts:', countsError);
    return polls.map((poll: PollFromDB) => ({
      ...poll,
      totalVotes: 0,
      isOwner: userId === poll.creator_id
    }));
  }

  // Aggregate vote counts by poll
  const totalVotesByPoll = new Map<string, number>();
  (counts || []).forEach((row: { poll_id: string; votes_count: number }) => {
    const current = totalVotesByPoll.get(row.poll_id) || 0;
    totalVotesByPoll.set(row.poll_id, current + Number(row.votes_count));
  });

  // Combine polls with vote counts and ownership info
  return polls.map((poll: PollFromDB) => ({
    ...poll,
    totalVotes: totalVotesByPoll.get(poll.id) || 0,
    isOwner: userId === poll.creator_id
  }));
}

// Main page component
export default async function PollsPage({ 
  searchParams 
}: { 
  searchParams?: { 
    created?: string; 
    updated?: string; 
    deleted?: string; 
  } 
}) {
  const supabase = createServerSupabaseClient();
  
  // Get current user
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError) {
    console.error('Error fetching user:', userError);
  }

  // Get polls with vote counts
  const pollsWithVotes = await getPollsWithVoteCounts(supabase, user?.id);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Messages */}
      {searchParams?.created === "1" && (
        <SuccessBanner 
          type="created" 
          message="Poll created successfully." 
        />
      )}
      {searchParams?.updated === "1" && (
        <SuccessBanner 
          type="updated" 
          message="Poll updated successfully." 
        />
      )}
      {searchParams?.deleted === "1" && (
        <SuccessBanner 
          type="deleted" 
          message="Poll deleted successfully." 
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">All Polls</h1>
          <p className="text-gray-600">Discover and vote on interesting polls</p>
        </div>
        <Link href="/polls/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>

      {/* Polls Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pollsWithVotes.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No polls found. Be the first to create one!</p>
            <Link href="/polls/create" className="mt-4 inline-block">
              <Button>Create Your First Poll</Button>
            </Link>
          </div>
        ) : (
          pollsWithVotes.map((poll) => (
            <PollCard
              key={poll.id}
              poll={poll}
              totalVotes={poll.totalVotes}
              isOwner={poll.isOwner}
            />
          ))
        )}
      </div>
    </div>
  );
}
