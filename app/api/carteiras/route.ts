import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { gerarCarteira } from '@/lib/carteira/generator'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  // Rate limit: 3 carteiras per minute
  const rl = rateLimit(`carteira:${user.id}`, 3, 60_000)
  if (!rl.ok) {
    return NextResponse.json({ error: 'Muitas tentativas. Aguarde.' }, { status: 429 })
  }

  try {
    const carteiraId = await gerarCarteira(user.id)
    return NextResponse.json({ carteira_id: carteiraId })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao gerar carteira'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
