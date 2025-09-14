import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { submitVote } from "@/lib/actions";

type PageProps = { params: { id: string }, searchParams?: { voted?: string } };

export default async function PollDetailPage({ params, searchParams }: PageProps) {
  const supabase = createServerSupabaseClient();
  const pollId = params.id;

  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .select("id, title, description, created_at, expiration_date")
    .eq("id", pollId)
    .single();

  if (pollError || !poll) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm text-red-600">Poll not found.</p>
          <div className="mt-4">
            <Link href="/polls">
              <Button variant="outline">Back to Polls</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get options with vote counts
  const { data: options, error: optionsError } = await supabase
    .from("poll_options")
    .select("id, option_text, position")
    .eq("poll_id", poll.id)
    .order("position", { ascending: true });

  if (optionsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm text-red-600">Failed to load poll options.</p>
        </div>
      </div>
    );
  }

  const { data: counts } = await supabase
    .from("poll_option_results")
    .select("option_id, votes_count")
    .eq("poll_id", poll.id);

  const optionIdToCount = new Map<string, number>(
    (counts || []).map((row: any) => [row.option_id as string, Number(row.votes_count)])
  );

  const optionsWithCounts = (options || []).map((opt: any) => ({
    id: opt.id as string,
    text: opt.option_text as string,
    votes: optionIdToCount.get(opt.id) ?? 0,
  }));

  const totalVotes = optionsWithCounts.reduce((sum, o) => sum + o.votes, 0);
  const hasVoted = searchParams?.voted === "1";
  const isExpired = poll.expiration_date && new Date(poll.expiration_date) < new Date();

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
            <CardTitle className="text-2xl">{poll.title}</CardTitle>
            {poll.description && (
              <CardDescription>{poll.description}</CardDescription>
            )}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Poll ID: {poll.id}</span>
              <span>Created: {new Date(poll.created_at).toLocaleString()}</span>
            </div>
            {poll.expiration_date && (
              <div className="text-sm text-gray-600 mt-2">
                {isExpired ? (
                  <span className="text-red-600 font-medium">Expired: {new Date(poll.expiration_date).toLocaleString()}</span>
                ) : (
                  <span>Expires: {new Date(poll.expiration_date).toLocaleString()}</span>
                )}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-blue-600">{totalVotes}</div>
                <div className="text-sm text-gray-600">Total Votes</div>
              </div>

              {!hasVoted && !isExpired && (
                <form action={submitVote} className="space-y-4">
                  <input type="hidden" name="poll_id" value={poll.id} />
                  <div className="space-y-2">
                    {optionsWithCounts.map((option) => (
                      <label key={option.id} className="flex items-center gap-3 p-3 border rounded-md cursor-pointer">
                        <input type="radio" name="option_id" value={option.id} required className="h-4 w-4" />
                        <span className="flex-1">{option.text}</span>
                      </label>
                    ))}
                  </div>
                  <Button type="submit" className="w-full">Submit Vote</Button>
                </form>
              )}

              {isExpired && !hasVoted && (
                <div className="rounded-md border border-red-200 bg-red-50 p-4 text-center">
                  <p className="text-red-800 font-medium">This poll has expired</p>
                  <p className="text-red-600 text-sm mt-1">Voting is no longer available</p>
                </div>
              )}

              {hasVoted && (
                <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                  Thank you for voting! Here are the current results.
                </div>
              )}

              <div className="space-y-3 pt-2">
                {optionsWithCounts.map((option) => {
                  const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 1000) / 10 : 0;
                  return (
                    <div key={option.id} className="relative">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{option.text}</span>
                        <div className="text-right">
                          <div className="font-semibold">{option.votes} votes</div>
                          <div className="text-sm text-gray-600">{percentage}%</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
