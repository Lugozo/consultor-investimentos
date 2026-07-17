import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { gerarCarteira } from '@/lib/carteira/generator'

export async function POST() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const carteiraId = await gerarCarteira(user.id)
    return NextResponse.json({ carteira_id: carteiraId })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao gerar carteira'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
