import { createServerSupabase } from '@/lib/supabase/server'
import { SimuladorPanel } from '@/components/simulador/simulador-panel'
import { notFound } from 'next/navigation'

export default async function SimularPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createServerSupabase()
  const { id } = await params

  const { data: alocacoes } = await supabase
    .from('carteiras_alocacao')
    .select('*')
    .eq('carteira_id', id)

  if (!alocacoes) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Simulador &quot;E se?&quot;</h1>
      <SimuladorPanel alocacoes={alocacoes} carteiraId={id} />
    </div>
  )
}
