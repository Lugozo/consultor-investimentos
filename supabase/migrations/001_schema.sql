-- Users table (extends Supabase auth.users)
create table public.perfis_investidor (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  idade int not null,
  renda_mensal text not null,
  patrimonio text not null,
  objetivo text not null,
  horizonte text not null,
  experiencia_nivel int not null check (experiencia_nivel between 1 and 5),
  tolerancia_risco text not null,
  pct_investimento int not null check (pct_investimento between 0 and 100),
  tem_reserva boolean not null,
  pref_simplicidade int not null check (pref_simplicidade between 1 and 5),
  score_risco int not null check (score_risco between 0 and 100),
  perfil_final text not null,
  created_at timestamptz not null default now(),
  unique(user_id)
);

create table public.metas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  valor_alvo numeric not null,
  data_alvo date not null,
  aporte_mensal_planejado numeric default 0,
  created_at timestamptz not null default now()
);

create table public.carteiras (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  perfil_id uuid references public.perfis_investidor(id),
  meta_id uuid references public.metas(id),
  status text not null default 'ativa' check (status in ('ativa', 'historica')),
  created_at timestamptz not null default now()
);

create table public.carteiras_alocacao (
  id uuid primary key default gen_random_uuid(),
  carteira_id uuid not null references public.carteiras(id) on delete cascade,
  classe_ativo text not null,
  pct_alvo numeric not null check (pct_alvo >= 0 and pct_alvo <= 100),
  pct_atual numeric default 0 check (pct_atual >= 0 and pct_atual <= 100)
);

create table public.carteiras_ativos (
  id uuid primary key default gen_random_uuid(),
  carteira_id uuid not null references public.carteiras(id) on delete cascade,
  ticker text not null,
  nome text not null,
  classe text not null,
  quantidade numeric default 0,
  preco_medio numeric default 0,
  preco_atual numeric default 0,
  data_atualizacao timestamptz default now()
);

create table public.simulacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  carteira_id uuid not null references public.carteiras(id) on delete cascade,
  parametros jsonb not null default '{}',
  resultado jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.corretora_links (
  id uuid primary key default gen_random_uuid(),
  corretora text not null,
  url_base text not null,
  afiliado_id text,
  ativo boolean not null default true,
  classes text[] not null default '{}'
);

-- Insert default broker links
insert into public.corretora_links (corretora, url_base, classes) values
  ('XP', 'https://portal.xpi.com.br/renda-variavel/{TICKER}', '{acoes,fiis,etfs,bdrs}'),
  ('Rico', 'https://riconnect.rico.com.vc/bolsa/{TICKER}', '{acoes,fiis,etfs,bdrs}'),
  ('Clear', 'https://www.clear.com.br/pit/{TICKER}', '{acoes,fiis,etfs,bdrs}'),
  ('BTG', 'https://invest.btgpactual.com/{TICKER}', '{acoes,fiis,etfs,bdrs}'),
  ('Binance', 'https://www.binance.com/pt/trade/{TICKER}_BRL', '{cripto}'),
  ('Mercado Bitcoin', 'https://www.mercadobitcoin.com.br/trade/{TICKER}BRL', '{cripto}');

-- Row Level Security
alter table public.perfis_investidor enable row level security;
alter table public.carteiras enable row level security;
alter table public.carteiras_alocacao enable row level security;
alter table public.carteiras_ativos enable row level security;
alter table public.metas enable row level security;
alter table public.simulacoes enable row level security;
alter table public.corretora_links enable row level security;

-- RLS Policies: user only sees own data
create policy "Users own perfis" on public.perfis_investidor
  for all using (auth.uid() = user_id);

create policy "Users own carteiras" on public.carteiras
  for all using (auth.uid() = user_id);

create policy "Users own alocacoes" on public.carteiras_alocacao
  for all using (
    exists (select 1 from public.carteiras c where c.id = carteira_id and c.user_id = auth.uid())
  );

create policy "Users own ativos" on public.carteiras_ativos
  for all using (
    exists (select 1 from public.carteiras c where c.id = carteira_id and c.user_id = auth.uid())
  );

create policy "Users own metas" on public.metas
  for all using (auth.uid() = user_id);

create policy "Users own simulacoes" on public.simulacoes
  for all using (auth.uid() = user_id);

-- corretora_links is public read-only for authenticated users
create policy "Auth users read corretoras" on public.corretora_links
  for select using (auth.role() = 'authenticated');
