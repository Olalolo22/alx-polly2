"use client";

import { Button } from "@/components/ui/button";
import { deletePoll } from "@/lib/actions";

export function DeletePollButton({ pollId }: { pollId: string }) {
  return (
    <form
      action={deletePoll}
      className="flex-1"
      onSubmit={(e) => {
        const ok = window.confirm("Are you sure you want to delete this poll? This cannot be undone.");
        if (!ok) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="poll_id" value={pollId} />
      <Button variant="destructive" className="w-full">Delete</Button>
    </form>
  );
}


