import { createServerSupabase } from '@/lib/supabase/server'
import { SimuladorPanel } from '@/components/simulador/simulador-panel'
import { isPremium } from '@/lib/stripe/queries'
import { UpgradeBanner } from '@/components/upgrade/upgrade-banner'
import { notFound, redirect } from 'next/navigation'

export default async function SimularPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const premium = await isPremium(user.id)
  if (!premium) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Simulador &quot;E se?&quot;</h1>
        <UpgradeBanner featureName="Simulador 'E se?'" />
      </div>
    )
  }

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
