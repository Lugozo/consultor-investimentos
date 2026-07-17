import { createServerSupabase } from '@/lib/supabase/server'
import { ComparadorAtivos } from '@/components/ativos/comparador-ativos'
import { isPremium } from '@/lib/stripe/queries'
import { UpgradeBanner } from '@/components/upgrade/upgrade-banner'
import { redirect } from 'next/navigation'

export default async function CompararPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const premium = await isPremium(user.id)

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Comparar Ativos</h1>
      {!premium ? (
        <UpgradeBanner featureName="Comparador de Ativos" />
      ) : (
        <ComparadorAtivos />
      )}
    </div>
  )
}
