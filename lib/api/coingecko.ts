import type { AtivoInfo } from '@/types'

const BASE_URL = 'https://api.coingecko.com/api/v3'

export async function buscarCripto(ticker: string): Promise<AtivoInfo | null> {
  try {
    const idMap: Record<string, string> = {
      BTC: 'bitcoin', ETH: 'ethereum', USDT: 'tether', BNB: 'binancecoin',
      SOL: 'solana', ADA: 'cardano', XRP: 'ripple', DOT: 'polkadot',
      DOGE: 'dogecoin', LINK: 'chainlink',
    }

    const id = idMap[ticker.toUpperCase()] ?? ticker.toLowerCase()
    const res = await fetch(`${BASE_URL}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`)
    if (!res.ok) return null
    const data = await res.json()

    const brl = data.market_data?.current_price?.brl ?? 0
    const brl24h = data.market_data?.price_change_percentage_24h ?? 0

    return {
      ticker: ticker.toUpperCase(),
      nome: data.name ?? ticker,
      classe: 'cripto',
      preco: brl,
      variacao_dia: brl24h,
      variacao_mes: 0,
      variacao_ano: 0,
      volume: data.market_data?.total_volume?.brl ?? 0,
      market_cap: data.market_data?.market_cap?.brl ?? 0,
    }
  } catch {
    return null
  }
}
