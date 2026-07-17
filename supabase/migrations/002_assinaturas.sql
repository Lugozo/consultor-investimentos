create table public.assinaturas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'free' check (status in ('free', 'active', 'canceled', 'past_due')),
  preco_atual text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

alter table public.assinaturas enable row level security;

create policy "Users own assinaturas" on public.assinaturas
  for all using (auth.uid() = user_id);
