"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function createPoll(formData: FormData) {
  const supabase = createServerSupabaseClient();

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const isPublic = String(formData.get("is_public") || "on").toLowerCase() !== "off";

  const rawOptions = formData.getAll("options").map((v) => String(v).trim());
  const options = rawOptions.filter((v) => v.length > 0);

  if (!title) {
    throw new Error("Title is required");
  }
  if (options.length < 2) {
    throw new Error("At least two options are required");
  }

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (!user) throw new Error("You must be signed in to create a poll");

  const { data: poll, error: pollErr } = await supabase
    .from("polls")
    .insert({ title, description, is_public: isPublic, creator_id: user.id })
    .select("id")
    .single();
  if (pollErr) throw pollErr;

  const optionRows = options.map((optionText: string, index: number) => ({
    poll_id: poll.id,
    option_text: optionText,
    position: index,
  }));

  const { error: optionsErr } = await supabase
    .from("poll_options")
    .insert(optionRows);
  if (optionsErr) throw optionsErr;

  revalidatePath("/polls");
  redirect(`/polls?created=1`);
}

export async function deletePoll(formData: FormData) {
  const supabase = createServerSupabaseClient();
  const pollId = String(formData.get("poll_id") || "").trim();
  if (!pollId) throw new Error("poll_id is required");

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (!user) throw new Error("Not authenticated");

  // Ensure ownership
  const { data: poll, error: pollErr } = await supabase
    .from("polls")
    .select("id, creator_id")
    .eq("id", pollId)
    .single();
  if (pollErr) throw pollErr;
  if (!poll || poll.creator_id !== user.id) throw new Error("Forbidden");

  const { error: delErr } = await supabase.from("polls").delete().eq("id", pollId);
  if (delErr) throw delErr;

  revalidatePath("/polls");
  redirect("/polls?deleted=1");
}

export async function updatePoll(formData: FormData) {
  const supabase = createServerSupabaseClient();
  const pollId = String(formData.get("poll_id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();

  if (!pollId) throw new Error("poll_id is required");
  if (!title) throw new Error("Title is required");

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (!user) throw new Error("Not authenticated");

  const { data: poll, error: pollErr } = await supabase
    .from("polls")
    .select("id, creator_id")
    .eq("id", pollId)
    .single();
  if (pollErr) throw pollErr;
  if (!poll || poll.creator_id !== user.id) throw new Error("Forbidden");

  const { error: updErr } = await supabase
    .from("polls")
    .update({ title, description })
    .eq("id", pollId);
  if (updErr) throw updErr;

  revalidatePath("/polls");
  redirect("/polls?updated=1");
}

export async function submitVote(formData: FormData) {
  const supabase = createServerSupabaseClient();
  const pollId = String(formData.get("poll_id") || "").trim();
  const optionId = String(formData.get("option_id") || "").trim();

  if (!pollId || !optionId) throw new Error("poll_id and option_id are required");

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (!user) {
    redirect(`/auth/login?next=/polls/${pollId}`);
  }

  // Insert vote; RLS ensures poll is public and user can vote
  const { error: insertErr } = await supabase
    .from("votes")
    .insert({ poll_id: pollId, option_id: optionId, voter_id: user!.id });
  if (insertErr) throw insertErr;

  revalidatePath(`/polls/${pollId}`);
  redirect(`/polls/${pollId}?voted=1&votedOption=${encodeURIComponent(optionId)}`);
}


