import { createServerSupabase } from '@/lib/supabase/server'
import { MetaCard } from '@/components/metas/meta-card'
import { EmptyState } from '@/components/ui/empty-state'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function MetasPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: metas } = await supabase
    .from('metas')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Metas Financeiras</h1>
        <Link href="/metas/nova">
          <Button variant="outline">+ Nova Meta</Button>
        </Link>
      </div>

      {metas && metas.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {metas.map(m => (
            <Link key={m.id} href={`/metas/${m.id}`}>
              <MetaCard meta={m} />
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhuma meta cadastrada"
          description="Crie metas financeiras para acompanhar seu progresso."
          action={
            <Link href="/metas/nova">
              <Button variant="outline">+ Nova Meta</Button>
            </Link>
          }
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9V1"/><path d="m15 4-3-3-3 3"/></svg>
          }
        />
      )}
    </div>
  )
}
