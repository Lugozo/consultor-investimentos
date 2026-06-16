import yahooFinance from 'yahoo-finance2'
import type { AtivoInfo } from '@/types'

function mapClasse(quote: yahooFinance.Quote): string {
  const type = quote.quoteType?.toLowerCase() ?? ''
  const symbol = quote.symbol ?? ''
  if (type === 'etf' || symbol.includes('FII')) return 'fiis'
  if (type === 'etf') return 'internacional'
  return 'acoes'
}

export async function buscarAtivo(ticker: string): Promise<AtivoInfo | null> {
  try {
    const symbol = ticker.endsWith('.SA') ? ticker : `${ticker}.SA`
    const quote = await yahooFinance.quote(symbol)
    return {
      ticker,
      nome: quote.longName ?? quote.shortName ?? ticker,
      classe: mapClasse(quote),
      preco: quote.regularMarketPrice ?? 0,
      variacao_dia: quote.regularMarketChangePercent ?? 0,
      variacao_mes: 0,
      variacao_ano: 0,
      pl: quote.trailingPE,
      pvp: quote.priceToBook,
      dy: quote.dividendYield ? quote.dividendYield * 100 : undefined,
      volume: quote.regularMarketVolume ?? 0,
      market_cap: quote.marketCap,
    }
  } catch {
    return null
  }
}

export async function buscarMultiplosAtivos(tickers: string[]): Promise<AtivoInfo[]> {
  const symbols = tickers.map(t => t.endsWith('.SA') ? t : `${t}.SA`)
  try {
    const quotes = await yahooFinance.quote(symbols)
    const results = Array.isArray(quotes) ? quotes : [quotes]
    return results.map(q => ({
      ticker: q.symbol?.replace('.SA', '') ?? '',
      nome: q.longName ?? q.shortName ?? '',
      classe: mapClasse(q),
      preco: q.regularMarketPrice ?? 0,
      variacao_dia: q.regularMarketChangePercent ?? 0,
      variacao_mes: 0,
      variacao_ano: 0,
      pl: q.trailingPE,
      pvp: q.priceToBook,
      dy: q.dividendYield ? q.dividendYield * 100 : undefined,
      volume: q.regularMarketVolume ?? 0,
      market_cap: q.marketCap,
    }))
  } catch {
    return []
  }
}
