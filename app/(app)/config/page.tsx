import { createServerSupabase } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatarDataCompleta } from '@/lib/utils/format'

export default async function ConfigPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>

      <Card className="mb-6">
        <CardHeader><CardTitle>Conta</CardTitle></CardHeader>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Email</span>
            <span>{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Nome</span>
            <span>{user?.user_metadata?.nome ?? '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Conta criada em</span>
            <span>{user?.created_at ? formatarDataCompleta(user.created_at) : '—'}</span>
          </div>
        </div>
      </Card>

      <Card className="mb-6">
        <CardHeader><CardTitle>Perfil de Investidor</CardTitle></CardHeader>
        <p className="text-sm text-slate-500 mb-4">
          Refazer o questionário para atualizar seu perfil.
        </p>
        <Link href="/questionario">
          <Button variant="outline">Refazer Questionário</Button>
        </Link>
      </Card>

      <Card>
        <CardHeader><CardTitle>Sobre</CardTitle></CardHeader>
        <p className="text-sm text-slate-500">
          Consultor de Investimentos v1.0. Dados de mercado via Yahoo Finance e CoinGecko.
          Links de corretora com possibilidade de afiliado.
        </p>
      </Card>
    </div>
  )
}
