import { createServerSupabase } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { EvolucaoChart } from '@/components/dashboard/evolucao-chart'
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow'
import { verificarRebalanceamento } from '@/lib/carteira/rebalanceamento'
import { isPremium } from '@/lib/stripe/queries'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const premium = await isPremium(user.id)

  const { data: perfil } = await supabase
    .from('perfis_investidor')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const { data: carteiras } = await supabase
    .from('carteiras')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'ativa')
    .order('created_at', { ascending: false })

  const { data: metas } = await supabase
    .from('metas')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Dados da primeira carteira ativa
  let alocacoesCarteira: { classe_ativo: string; pct_alvo: number }[] | null = null
  let desvios: Awaited<ReturnType<typeof verificarRebalanceamento>> = []
  if (premium && carteiras && carteiras.length > 0) {
    const primeiraCarteira = carteiras[0]
    const [alocacoesRes, ativosRes] = await Promise.all([
      supabase.from('carteiras_alocacao').select('classe_ativo, pct_alvo').eq('carteira_id', primeiraCarteira.id),
      supabase.from('carteiras_ativos').select('*').eq('carteira_id', primeiraCarteira.id),
    ])
    const alocacoes = alocacoesRes.data
    const ativos = ativosRes.data
    if (alocacoes) alocacoesCarteira = alocacoes
    if (alocacoes && ativos) {
      desvios = verificarRebalanceamento(alocacoes as any[], ativos as any[])
    }
  }

  const perfilLabels: Record<string, string> = {
    conservador: 'Conservador',
    moderado: 'Moderado',
    agressivo: 'Agressivo',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-1">
        Olá{user?.user_metadata?.nome ? `, ${user.user_metadata.nome}` : ''}
      </h1>
      <p className="text-slate-500 mb-8">Bem-vindo ao seu painel de investimentos</p>

      {!perfil && (
        <Card className="mb-6 border-teal-200 bg-teal-50">
          <p className="text-teal-800">
            Você ainda não definiu seu perfil de investidor.{' '}
            <Link href="/questionario" className="font-semibold underline">
              Fazer questionário →
            </Link>
          </p>
        </Card>
      )}

      {perfil && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <p className="text-sm text-slate-500">Perfil</p>
            <p className="text-2xl font-bold text-teal-700">{perfilLabels[perfil.perfil_final]}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Score de Risco</p>
            <p className="text-2xl font-bold">{perfil.score_risco}/100</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Carteiras</p>
            <p className="text-2xl font-bold">{carteiras?.length ?? 0}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Metas</p>
            <p className="text-2xl font-bold">{metas?.length ?? 0}</p>
          </Card>
        </div>
      )}

      {premium && alocacoesCarteira && (
        <Card className="mb-8">
          <CardHeader><CardTitle>Evolução do Patrimônio (simulação)</CardTitle></CardHeader>
          <EvolucaoChart alocacao={Object.fromEntries(alocacoesCarteira.map(a => [a.classe_ativo, a.pct_alvo]))} />
        </Card>
      )}

      {desvios.length > 0 && (
        <Card className="mb-8 border-amber-300 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800">⚠️ Rebalanceamento Necessário</CardTitle>
          </CardHeader>
          <p className="text-sm text-amber-700 mb-3">
            A alocação da sua carteira desviou mais de 5% do planejado nas seguintes classes:
          </p>
          <ul className="space-y-2">
            {desvios.map(d => (
              <li key={d.classe} className="text-sm">
                <span className="font-medium">{d.label}</span>
                : alvo <span className="font-medium">{d.pct_alvo}%</span>
                , atual <span className="font-medium">{d.pct_atual}%</span>
                {' '}(desvio de {d.diferenca}%)
              </li>
            ))}
          </ul>
        </Card>
      )}

      {carteiras && carteiras.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Suas Carteiras</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {carteiras.map(c => (
              <Link key={c.id} href={`/carteira/${c.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{c.nome}</h3>
                    <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                      {c.status === 'ativa' ? 'Ativa' : 'Histórica'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Criada em {new Date(c.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {(!carteiras || carteiras.length === 0) && perfil && (
        <EmptyState
          title="Nenhuma carteira gerada"
          description="Gere sua primeira carteira com ativos reais baseada no seu perfil de investidor."
          action={
            <Link href="/questionario/resultado">
              <Button>Gerar Minha Carteira</Button>
            </Link>
          }
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
          }
        />
      )}

      {metas && metas.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Suas Metas</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {metas.map(m => (
              <Link key={m.id} href={`/metas/${m.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <h3 className="font-semibold">{m.nome}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Alvo: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(m.valor_alvo)}
                  </p>
                  {m.data_alvo && (
                    <p className="text-xs text-slate-400 mt-1">
                      Até {new Date(m.data_alvo + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-slate-400 dark:text-slate-500 mt-12 pt-6 border-t border-slate-100 dark:border-slate-700 text-center">
        Esta ferramenta tem fins educacionais. Não constitui recomendação de investimento.
        {' '}
        <Link href="/termos" className="underline hover:text-slate-600 dark:hover:text-slate-300">Termos de Uso</Link>
        {' · '}
        <Link href="/privacidade" className="underline hover:text-slate-600 dark:hover:text-slate-300">Privacidade</Link>
      </p>

      <OnboardingFlow />
    </div>
  )
}
