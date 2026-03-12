create extension if not exists pgcrypto;

create table if not exists public.residents (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  building text not null,
  phone text not null,
  email text not null,
  password_hash text,
  resident_type text not null check (resident_type in ('proprietar', 'chirias')),
  consent boolean not null default false,
  created_at timestamptz not null default now(),
  status text not null default 'nou' check (status in ('nou', 'contactat', 'validat'))
);

create table if not exists public.issues (
  id uuid primary key default gen_random_uuid(),
  contact_name text not null,
  contact_email text,
  contact_phone text,
  category text not null,
  title text not null,
  description text not null,
  attachment_urls text[] not null default '{}',
  status text not null default 'noua' check (status in ('noua', 'in_analiza', 'rezolvata')),
  created_at timestamptz not null default now()
);

create table if not exists public.community_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  type text not null unique check (type in ('whatsapp', 'facebook_page', 'facebook_group'))
);

create table if not exists public.association_progress (
  id uuid primary key default gen_random_uuid(),
  step_title text not null,
  description text not null,
  step_order integer not null unique,
  completed boolean not null default false
);

create table if not exists public.updates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  visibility text not null default 'public' check (visibility in ('public', 'admin'))
);

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
  created_at timestamptz not null default now(),
  unique (proposal_id, resident_id)
);

alter table public.residents enable row level security;
alter table public.issues enable row level security;
alter table public.community_links enable row level security;
alter table public.association_progress enable row level security;
alter table public.updates enable row level security;
alter table public.vote_proposals enable row level security;
alter table public.proposal_votes enable row level security;

drop policy if exists "public_insert_residents" on public.residents;
drop policy if exists "public_insert_issues" on public.issues;
drop policy if exists "public_read_links" on public.community_links;
drop policy if exists "public_read_progress" on public.association_progress;
drop policy if exists "public_read_updates" on public.updates;

create policy "public_insert_residents"
on public.residents
for insert
to anon, authenticated
with check (consent = true);

create policy "public_insert_issues"
on public.issues
for insert
to anon, authenticated
with check (true);

create policy "public_read_links"
on public.community_links
for select
to anon, authenticated
using (true);

create policy "public_read_progress"
on public.association_progress
for select
to anon, authenticated
using (true);

create policy "public_read_updates"
on public.updates
for select
to anon, authenticated
using (visibility = 'public');
