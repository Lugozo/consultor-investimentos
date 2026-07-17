import { createServerSupabase } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function CarteirasPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: carteiras } = await supabase
    .from('carteiras')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Fetch alocacao for each carteira
  const carteirasComAlocacao = await Promise.all(
    (carteiras ?? []).map(async (c) => {
      const result = await supabase
        .from('carteiras_alocacao')
        .select('classe_ativo, pct_alvo')
        .eq('carteira_id', c.id)
      const alocacoes = result.data as { classe_ativo: string; pct_alvo: number }[] | null
      return { ...c, alocacoes }
    })
  )

  const classeLabels: Record<string, string> = {
    rf: 'Renda Fixa',
    acoes: 'Ações',
    fiis: 'FIIs',
    cripto: 'Cripto',
    internacional: 'Internacional',
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Carteiras</h1>
        <Link href="/questionario">
          <Button variant="outline">+ Nova Carteira</Button>
        </Link>
      </div>

      {carteirasComAlocacao.length === 0 ? (
        <EmptyState
          title="Nenhuma carteira encontrada"
          description="Responda o questionário para gerar sua primeira carteira personalizada."
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
          }
          action={
            <Link href="/questionario">
              <Button>Responder Questionário</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {carteirasComAlocacao.map(c => (
            <Link key={c.id} href={`/carteira/${c.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg">{c.nome}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    c.status === 'ativa' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {c.status === 'ativa' ? 'Ativa' : 'Histórica'}
                  </span>
                </div>
                {c.alocacoes && c.alocacoes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {c.alocacoes.map((a: { classe_ativo: string; pct_alvo: number }) => (
                      <span key={a.classe_ativo} className="text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded border border-slate-100">
                        {classeLabels[a.classe_ativo] ?? a.classe_ativo}: {a.pct_alvo}%
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-slate-400 mt-3">
                  Criada em {new Date(c.created_at).toLocaleDateString('pt-BR')}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
