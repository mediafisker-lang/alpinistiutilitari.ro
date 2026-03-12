import { fallbackCommunityLinks, fallbackProgress, fallbackUpdates } from "@/lib/content";
import {
  createAdminSupabaseClient,
  createPublicSupabaseClient,
  hasAdminSupabaseEnv,
  hasPublicSupabaseEnv,
} from "@/lib/supabase";
import type {
  AssociationProgress,
  CommunityLink,
  Issue,
  PublicIssue,
  Resident,
  UpdateItem,
  VoteProposalWithStats,
} from "@/types/database";

type VoteRow = {
  id: string;
  proposal_id: string;
  vote_choice: "yes" | "no";
  reason: string | null;
  residents: { full_name: string } | { full_name: string }[] | null;
};

export async function getPublicProgress(): Promise<AssociationProgress[]> {
  if (!hasPublicSupabaseEnv()) {
    return fallbackProgress;
  }

  const supabase = createPublicSupabaseClient();
  if (!supabase) {
    return fallbackProgress;
  }

  const { data, error } = await supabase
    .from("association_progress")
    .select("*")
    .order("step_order", { ascending: true });

  if (error || !data?.length) {
    return fallbackProgress;
  }

  return data;
}

export async function getCommunityLinks(): Promise<CommunityLink[]> {
  if (!hasPublicSupabaseEnv()) {
    return fallbackCommunityLinks;
  }

  const supabase = createPublicSupabaseClient();
  if (!supabase) {
    return fallbackCommunityLinks;
  }

  const { data, error } = await supabase
    .from("community_links")
    .select("*")
    .order("label", { ascending: true });

  if (error || !data?.length) {
    return fallbackCommunityLinks;
  }

  return data;
}

export async function getPublicUpdates(): Promise<UpdateItem[]> {
  if (!hasPublicSupabaseEnv()) {
    return fallbackUpdates;
  }

  const supabase = createPublicSupabaseClient();
  if (!supabase) {
    return fallbackUpdates;
  }

  const { data, error } = await supabase
    .from("updates")
    .select("*")
    .eq("visibility", "public")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error || !data?.length) {
    return fallbackUpdates;
  }

  return data;
}

export async function getPublicIssues(): Promise<PublicIssue[]> {
  if (!hasAdminSupabaseEnv()) {
    return [];
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("issues")
    .select("id, category, title, description, attachment_urls, status, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  return data ?? [];
}

export async function getAdminResidents(building?: string): Promise<Resident[]> {
  if (!hasAdminSupabaseEnv()) {
    return [];
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return [];
  }

  let query = supabase
    .from("residents")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (building) {
    query = query.eq("building", building);
  }

  const { data } = await query;

  return data ?? [];
}

export async function getAdminIssues(): Promise<Issue[]> {
  if (!hasAdminSupabaseEnv()) {
    return [];
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("issues")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return data ?? [];
}

export async function getAdminVoteProposals(): Promise<VoteProposalWithStats[]> {
  if (!hasAdminSupabaseEnv()) {
    return [];
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data: proposals } = await supabase
    .from("vote_proposals")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (!proposals?.length) {
    return [];
  }

  const proposalIds = proposals.map((proposal) => proposal.id);
  const { data: votes } = await supabase
    .from("proposal_votes")
    .select("id, proposal_id, vote_choice, reason, residents(full_name)")
    .in("proposal_id", proposalIds)
    .order("created_at", { ascending: false });

  return proposals.map((proposal) => {
    const proposalVotes = ((votes ?? []) as VoteRow[]).filter(
      (vote) => vote.proposal_id === proposal.id,
    );

    return {
      ...proposal,
      yes_votes: proposalVotes.filter((vote) => vote.vote_choice === "yes").length,
      no_votes: proposalVotes.filter((vote) => vote.vote_choice === "no").length,
      comments: proposalVotes.map((vote) => ({
        id: vote.id,
        resident_name: Array.isArray(vote.residents)
          ? vote.residents[0]?.full_name ?? "Rezident"
          : vote.residents?.full_name ?? "Rezident",
        vote_choice: vote.vote_choice,
        reason: vote.reason,
      })),
    };
  });
}
