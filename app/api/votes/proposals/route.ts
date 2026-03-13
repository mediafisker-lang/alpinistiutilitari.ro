import { NextResponse } from "next/server";

import { createAdminSupabaseClient, hasAdminSupabaseEnv } from "@/lib/supabase";

type VoteRow = {
  id: string;
  proposal_id: string;
  vote_choice: "yes" | "no";
  reason: string | null;
  residents: { full_name: string } | { full_name: string }[] | null;
};

export async function GET() {
  if (!hasAdminSupabaseEnv()) {
    return NextResponse.json({ proposals: [] });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ proposals: [] });
  }

  const { data: proposals } = await supabase
    .from("vote_proposals")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (!proposals?.length) {
    return NextResponse.json({ proposals: [] });
  }

  const proposalIds = proposals.map((proposal) => proposal.id);
  const { data: votes } = await supabase
    .from("proposal_votes")
    .select("id, proposal_id, vote_choice, reason, residents(full_name)")
    .in("proposal_id", proposalIds)
    .order("created_at", { ascending: false });

  const mapped = proposals.map((proposal) => {
    const proposalVotes = ((votes ?? []) as VoteRow[]).filter(
      (vote) => vote.proposal_id === proposal.id,
    );
    const commentVotes = proposalVotes.filter((vote) => Boolean(vote.reason?.trim()));

    return {
      ...proposal,
      yes_votes: proposalVotes.filter((vote) => vote.vote_choice === "yes").length,
      no_votes: proposalVotes.filter((vote) => vote.vote_choice === "no").length,
      comments: commentVotes.map((vote) => ({
        id: vote.id,
        resident_name: Array.isArray(vote.residents)
          ? vote.residents[0]?.full_name ?? "Rezident"
          : vote.residents?.full_name ?? "Rezident",
        vote_choice: vote.vote_choice,
        reason: vote.reason,
      })),
    };
  });

  return NextResponse.json({ proposals: mapped });
}
