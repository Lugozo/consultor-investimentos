import { NextResponse } from 'next/server'
import { buscarAtivo } from '@/lib/api/yahoo-finance'
import { buscarCripto } from '@/lib/api/coingecko'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { ticker } = await params
  const tickerUpper = ticker.toUpperCase()

  const isCripto = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'ADA', 'XRP', 'DOT', 'DOGE'].includes(tickerUpper)
  const ativo = isCripto ? await buscarCripto(tickerUpper) : await buscarAtivo(tickerUpper)

  if (!ativo) {
    return NextResponse.json({ error: 'Ativo não encontrado' }, { status: 404 })
  }

  return NextResponse.json(ativo)
}
