create extension if not exists pgcrypto;

alter table public.residents
add column if not exists password_hash text;

create table if not exists public.vote_proposals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.proposal_votes (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.vote_proposals(id) on delete cascade,
  resident_id uuid not null references public.residents(id) on delete cascade,
  vote_choice text not null check (vote_choice in ('yes', 'no')),
  reason text,
  created_at timestamptz not null default now()
);

create unique index if not exists proposal_votes_unique_resident_vote
on public.proposal_votes (proposal_id, resident_id);

alter table public.vote_proposals enable row level security;
alter table public.proposal_votes enable row level security;
