-- Add expiration_date column to polls table
alter table public.polls 
add column expiration_date timestamptz;

-- Add index for expiration_date for better query performance
create index if not exists idx_polls_expiration_date on public.polls(expiration_date);

-- Add a helpful comment
comment on column public.polls.expiration_date is 'Optional expiration date for the poll. When set, voting will be disabled after this date.';
