import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { data } = await supabase
    .from('watchlist')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { ticker, nome, classe } = await req.json()
  if (!ticker || typeof ticker !== 'string' || ticker.length > 20) {
    return NextResponse.json({ error: 'ticker inválido' }, { status: 400 })
  }
  if (typeof nome !== 'string' || nome.length > 200) {
    return NextResponse.json({ error: 'nome inválido' }, { status: 400 })
  }
  if (typeof classe !== 'string' || classe.length > 30) {
    return NextResponse.json({ error: 'classe inválida' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('watchlist')
    .upsert({ user_id: user.id, ticker, nome, classe }, { onConflict: 'user_id, ticker' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { ticker } = await req.json()
  if (!ticker) return NextResponse.json({ error: 'ticker obrigatório' }, { status: 400 })

  await supabase
    .from('watchlist')
    .delete()
    .eq('user_id', user.id)
    .eq('ticker', ticker)

  return NextResponse.json({ ok: true })
}
