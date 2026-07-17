import { createServerSupabase } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { AlocacaoChart } from '@/components/carteira/alocacao-chart'
import { AtivoCard } from '@/components/carteira/ativo-card'
import { verificarRebalanceamento } from '@/lib/carteira/rebalanceamento'
import type { Desvio } from '@/lib/carteira/rebalanceamento'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function CarteiraPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createServerSupabase()
  const { id } = await params

  const { data: carteira } = await supabase
    .from('carteiras')
    .select('*')
    .eq('id', id)
    .single()

  if (!carteira) notFound()

  const { data: alocacoes } = await supabase
    .from('carteiras_alocacao')
    .select('*')
    .eq('carteira_id', id)

  const { data: ativos } = await supabase
    .from('carteiras_ativos')
    .select('*')
    .eq('carteira_id', id)

  const desvios: Desvio[] = (alocacoes && ativos)
    ? verificarRebalanceamento(alocacoes, ativos)
    : []

  const classeLabels: Record<string, string> = {
    rf: 'Renda Fixa', acoes: 'Ações', fiis: 'Fundos Imobiliários',
    cripto: 'Criptomoedas', internacional: 'Internacional',
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{carteira.nome}</h1>
        <Link href={`/carteira/${id}/simular`}>
          <span className="text-teal-700 hover:underline text-sm font-medium">
            Simular &quot;E se?&quot; →
          </span>
        </Link>
      </div>

      {desvios.length > 0 && (
        <Card className="mb-6 border-amber-300 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800">⚠️ Atenção: Desvios Detectados</CardTitle>
          </CardHeader>
          <p className="text-sm text-amber-700">
            Sua alocação atual difere do alvo em mais de 5%. Considere rebalancear.
          </p>
        </Card>
      )}

      {alocacoes && alocacoes.length > 0 && (
        <Card className="mb-6">
          <CardHeader><CardTitle>Alocação</CardTitle></CardHeader>
          <AlocacaoChart alocacoes={alocacoes} />
          <div className="mt-4 border-t pt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 border-b">
                  <th className="text-left py-1">Classe</th>
                  <th className="text-right py-1">Alvo</th>
                  <th className="text-right py-1">Atual</th>
                  <th className="text-right py-1">Desvio</th>
                </tr>
              </thead>
              <tbody>
                {alocacoes.map(a => {
                  const desvio = desvios.find(d => d.classe === a.classe_ativo)
                  const pctAtual = desvio?.pct_atual ?? 0
                  const diff = desvio?.diferenca ?? Math.abs(a.pct_alvo - pctAtual)
                  const alerta = diff > 5
                  return (
                    <tr key={a.id} className="border-b last:border-0">
                      <td className="py-2">{classeLabels[a.classe_ativo] ?? a.classe_ativo}</td>
                      <td className="text-right py-2">{a.pct_alvo}%</td>
                      <td className={`text-right py-2 ${alerta ? 'text-amber-600 font-medium' : ''}`}>
                        {pctAtual}%
                      </td>
                      <td className={`text-right py-2 ${alerta ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                        {diff}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {ativos && ativos.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Ativos</h2>
          <div className="space-y-3">
            {ativos.map(a => (
              <AtivoCard key={a.id} ativo={a} />
            ))}
          </div>
        </div>
      )}

      {(!ativos || ativos.length === 0) && (
        <Card>
          <p className="text-slate-500">Nenhum ativo nesta carteira ainda.</p>
        </Card>
      )}
    </div>
  )
}
