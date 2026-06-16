import { createServerSupabase } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { formatarMoeda } from '@/lib/utils/format'
import { notFound } from 'next/navigation'

export default async function MetaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createServerSupabase()
  const { id } = await params

  const { data: meta } = await supabase
    .from('metas')
    .select('*')
    .eq('id', id)
    .single()

  if (!meta) notFound()

  const hoje = new Date()
  const dataAlvo = new Date(meta.data_alvo + 'T00:00:00')
  const mesesRestantes = Math.max(1, Math.ceil((dataAlvo.getTime() - hoje.getTime()) / (30 * 86400000)))
  const aporteNecessario = meta.valor_alvo / mesesRestantes

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{meta.nome}</h1>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <p className="text-sm text-slate-500">Valor Alvo</p>
          <p className="text-2xl font-bold">{formatarMoeda(meta.valor_alvo)}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Aporte Ideal / Mês</p>
          <p className="text-2xl font-bold">{formatarMoeda(aporteNecessario)}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Meses Restantes</p>
          <p className="text-2xl font-bold">{mesesRestantes}</p>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Detalhes</CardTitle></CardHeader>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Aporte mensal planejado</span>
            <span>{formatarMoeda(meta.aporte_mensal_planejado)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Data alvo</span>
            <span>{new Date(meta.data_alvo + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Criada em</span>
            <span>{new Date(meta.created_at).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
