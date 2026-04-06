alter table public.issues
add column if not exists attachment_urls text[] not null default '{}';

insert into storage.buckets (id, name, public)
values ('issue-images', 'issue-images', true)
on conflict (id) do nothing;
