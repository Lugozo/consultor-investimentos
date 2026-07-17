# Investo — Consultor de Investimentos

Sua carteira de investimentos sob medida. Descubra seu perfil de investidor, monte carteiras personalizadas e invista com confiança. Tudo baseado em dados reais do mercado.

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript 5
- **Tailwind CSS 4** + Recharts
- **Supabase** (auth OAuth + banco PostgreSQL + RLS)
- **yahoo-finance2** (cotações B3 via Yahoo Finance)
- **CoinGecko API** (cotações cripto, sem key)
- **Vitest** (testes)

## Pré-requisitos

- Node.js 20+ e npm 10+
- Conta gratuita no [Supabase](https://supabase.com)

---

## Passo a passo — pontapé inicial

### 1. Criar projeto no Supabase (grátis)

1. Acesse [supabase.com](https://supabase.com) e crie conta (login com GitHub funciona)
2. Clique **"New project"**
3. Preencha:
   - **Name:** `investo` (ou qualquer nome)
   - **Database Password:** gere uma senha forte (anote!)
   - **Region:** South America (São Paulo) — se disponível, senão US East
   - **Pricing Plan:** Free
4. Clique **"Create project"** — aguarde ~2 min o banco subir

### 2. Pegar as credenciais do Supabase

1. No dashboard do Supabase, vá em **Settings > API** (menu lateral)
2. Copie:
   - **Project URL** → é o `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → é o `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Configurar .env.local

Crie o arquivo `.env.local` na raiz do projeto:

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais reais:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...
```

### 4. Rodar a migration do banco

1. No dashboard do Supabase, vá em **SQL Editor** (menu lateral)
2. Clique **"New query"**
3. Cole TODO o conteúdo do arquivo `supabase/migrations/001_schema.sql`
4. Clique **"Run"** (Ctrl+Enter)

Isso cria todas as tabelas, políticas RLS e dados iniciais de corretoras.

### 5. Configurar autenticação OAuth

1. No dashboard do Supabase, vá em **Authentication > Providers**
2. Habilite **Email** (login/senha):
   - Clique em **Email**
   - Ative a toggle
   - Deixe **"Confirm email"** desmarcado (dev local)
   - Clique **Save**

### 6. Instalar dependências

```bash
cd consultor-investimentos
npm install
```

### 7. Rodar o projeto

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### 8. Testar o fluxo completo

1. Clique **"Começar Gratuitamente"** → página de cadastro
2. Crie conta com email e senha
3. Responda o questionário de 10 perguntas
4. Veja seu perfil de investidor e alocação sugerida
5. Explore: Dashboard, Ativos, Carteira, Metas

---

## Comandos

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Sobe servidor dev em localhost:3000 |
| `npm run build` | Build de produção |
| `npm run start` | Roda build de produção |
| `npm test` | Roda testes (Vitest) |
| `npm run lint` | Verifica linting |

## Estrutura do projeto

```
app/
  (app)/                     # Rotas protegidas (auth)
    dashboard/               # Visão geral da carteira
    ativos/                  # Busca e detalhes de ativos
    carteira/                # Carteira do usuário
    metas/                   # Metas financeiras
    config/                  # Configurações do usuário
    questionario/            # Questionário de perfil
  api/                       # API routes
    ativos/busca/            # Busca de ativos (Yahoo Finance)
    ativos/[ticker]/         # Detalhes do ativo
    corretoras/              # Links de corretoras
    noticias/                # Notícias do mercado
  auth/callback/             # Callback OAuth Supabase
lib/
  algorithms/                # Score de risco, alocação, seleção
  api/                       # Yahoo Finance, CoinGecko, corretoras
  supabase/                  # Client, server, middleware
  utils/                     # Format pt-BR, constantes
supabase/
  migrations/                # Schema SQL do banco
```

## Serviços (todos gratuitos)

| Serviço | Limite grátis |
|---------|---------------|
| Supabase | 500MB DB, 50K MAU, 5GB bandwidth |
| Yahoo Finance (via yahoo-finance2) | ~100 req/h, sem API key |
| CoinGecko API | 10-30 req/min, sem API key |
| Vercel (hospedagem) | Hobby plan, deploy automático |
