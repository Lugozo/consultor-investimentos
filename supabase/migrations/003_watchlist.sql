create table public.watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ticker text not null,
  nome text not null,
  classe text not null,
  created_at timestamptz not null default now(),
  unique(user_id, ticker)
);

alter table public.watchlist enable row level security;

create policy "Users own watchlist" on public.watchlist
  for all using (auth.uid() = user_id);
