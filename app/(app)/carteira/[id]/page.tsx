import { createServerSupabase } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { AlocacaoChart } from '@/components/carteira/alocacao-chart'
import { AtivoCard } from '@/components/carteira/ativo-card'
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

      {alocacoes && alocacoes.length > 0 && (
        <Card className="mb-6">
          <CardHeader><CardTitle>Alocação</CardTitle></CardHeader>
          <AlocacaoChart alocacoes={alocacoes} />
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
