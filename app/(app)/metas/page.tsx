import { createServerSupabase } from '@/lib/supabase/server'
import { MetaCard } from '@/components/metas/meta-card'
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
        <Button variant="outline">+ Nova Meta</Button>
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
        <p className="text-slate-500">Nenhuma meta cadastrada ainda.</p>
      )}
    </div>
  )
}
