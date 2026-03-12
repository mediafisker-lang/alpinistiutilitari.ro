alter table public.residents
add column if not exists building text;

update public.residents
set building = 'A1'
where building is null;

alter table public.residents
alter column building set not null;
