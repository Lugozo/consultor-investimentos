import { NextResponse } from 'next/server'
import { buscarMultiplosAtivos } from '@/lib/api/yahoo-finance'
import { buscarCripto } from '@/lib/api/coingecko'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')
  if (!q) return NextResponse.json({ error: 'Query required' }, { status: 400 })

  const isCripto = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'ADA', 'XRP', 'DOT', 'DOGE'].includes(q.toUpperCase())

  if (isCripto) {
    const cripto = await buscarCripto(q)
    return NextResponse.json(cripto ? [cripto] : [])
  }

  const tickers = [q.toUpperCase()]
  const ativos = await buscarMultiplosAtivos(tickers)
  return NextResponse.json(ativos)
}
