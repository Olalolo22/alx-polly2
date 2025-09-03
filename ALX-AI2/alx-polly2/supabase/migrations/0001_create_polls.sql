-- Enable required extensions
create extension if not exists pgcrypto;

-- Tables
create table if not exists public.polls (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  is_public boolean not null default true,
  creator_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  option_text text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

-- Ensure (id, poll_id) is unique to support composite foreign keys
do $$ begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'poll_options_id_poll_id_key'
  ) then
    alter table public.poll_options
      add constraint poll_options_id_poll_id_key unique (id, poll_id);
  end if;
end $$;

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  option_id uuid not null references public.poll_options(id) on delete cascade,
  voter_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint one_vote_per_user_per_poll unique (poll_id, voter_id)
);

-- Enforce that the chosen option belongs to the given poll via composite FK
do $$ begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'votes_option_poll_fk'
  ) then
    alter table public.votes
      add constraint votes_option_poll_fk
      foreign key (option_id, poll_id)
      references public.poll_options(id, poll_id)
      on delete cascade;
  end if;
end $$;

-- Helpful indexes
create index if not exists idx_poll_options_poll_id on public.poll_options(poll_id);
create index if not exists idx_votes_poll_id on public.votes(poll_id);
create index if not exists idx_votes_option_id on public.votes(option_id);
create index if not exists idx_polls_creator_id on public.polls(creator_id);

-- Updated at trigger for polls
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_set_updated_at on public.polls;
create trigger trg_set_updated_at
before update on public.polls
for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.polls enable row level security;
alter table public.poll_options enable row level security;
alter table public.votes enable row level security;

-- Policies for polls
drop policy if exists "Polls are viewable by everyone if public, else by owner" on public.polls;
create policy "Polls are viewable by everyone if public, else by owner" on public.polls
for select
using (
  is_public or auth.uid() = creator_id
);

drop policy if exists "Users can insert their own polls" on public.polls;
create policy "Users can insert their own polls" on public.polls
for insert
with check (auth.uid() = creator_id);

drop policy if exists "Owners can update their polls" on public.polls;
create policy "Owners can update their polls" on public.polls
for update
using (auth.uid() = creator_id)
with check (auth.uid() = creator_id);

drop policy if exists "Owners can delete their polls" on public.polls;
create policy "Owners can delete their polls" on public.polls
for delete
using (auth.uid() = creator_id);

-- Policies for poll_options
drop policy if exists "Options selectable if parent poll is public or owned" on public.poll_options;
create policy "Options selectable if parent poll is public or owned" on public.poll_options
for select
using (
  exists (
    select 1 from public.polls p
    where p.id = poll_id and (p.is_public or p.creator_id = auth.uid())
  )
);

drop policy if exists "Only poll owner can modify options" on public.poll_options;
create policy "Only poll owner can modify options" on public.poll_options
for all
using (
  exists (
    select 1 from public.polls p
    where p.id = poll_id and p.creator_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.polls p
    where p.id = poll_id and p.creator_id = auth.uid()
  )
);

-- Policies for votes
drop policy if exists "Only owners can view raw votes" on public.votes;
create policy "Only owners can view raw votes" on public.votes
for select
using (
  exists (
    select 1 from public.polls p
    where p.id = poll_id and p.creator_id = auth.uid()
  )
);

drop policy if exists "Authenticated users can vote on public polls" on public.votes;
create policy "Authenticated users can vote on public polls" on public.votes
for insert
with check (
  auth.uid() is not null and
  exists (
    select 1 from public.polls p
    join public.poll_options po on po.poll_id = p.id
    where po.id = option_id and p.id = poll_id and p.is_public = true
  )
);

drop policy if exists "Voters can delete their vote while poll is public" on public.votes;
create policy "Voters can delete their vote while poll is public" on public.votes
for delete
using (
  auth.uid() = voter_id and
  exists (
    select 1 from public.polls p where p.id = poll_id and p.is_public = true
  )
);

-- View for aggregated results
create or replace view public.poll_option_results as
select
  po.id as option_id,
  po.poll_id,
  po.option_text,
  coalesce(count(v.id), 0) as votes_count
from public.poll_options po
left join public.votes v on v.option_id = po.id
group by po.id, po.poll_id, po.option_text;

-- Grant minimal privileges to anon/auth roles for RLS policies to apply
grant usage on schema public to anon, authenticated;
grant select on public.polls to anon, authenticated;
grant select on public.poll_options to anon, authenticated;
grant select on public.poll_option_results to anon, authenticated;
grant insert on public.polls to authenticated;
grant insert on public.poll_options to authenticated;
grant insert, delete on public.votes to authenticated;

