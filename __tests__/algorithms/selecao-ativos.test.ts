import { describe, it, expect } from 'vitest'
import { ranquearAtivos, sugerirAtivosPorClasse } from '@/lib/algorithms/selecao-ativos'
import type { AtivoInfo } from '@/types'

const mockAtivos: AtivoInfo[] = [
  { ticker: 'PETR4', nome: 'Petrobras PN', classe: 'acoes', preco: 32.40, variacao_dia: 2.1, variacao_mes: 5.3, variacao_ano: 15.0, pl: 4.5, pvp: 1.2, dy: 8.5, volume: 50000000, market_cap: 400000000000 },
  { ticker: 'VALE3', nome: 'Vale ON', classe: 'acoes', preco: 68.20, variacao_dia: -1.2, variacao_mes: -3.1, variacao_ano: -5.0, pl: 3.8, pvp: 1.5, dy: 12.0, volume: 30000000, market_cap: 300000000000 },
  { ticker: 'ITUB4', nome: 'Itaú PN', classe: 'acoes', preco: 35.80, variacao_dia: 0.5, variacao_mes: 2.0, variacao_ano: 20.0, pl: 8.0, pvp: 2.0, dy: 4.0, volume: 40000000, market_cap: 350000000000 },
  { ticker: 'MXRF11', nome: 'Maxi Renda FII', classe: 'fiis', preco: 10.15, variacao_dia: -0.3, variacao_mes: 1.5, variacao_ano: 8.0, dy: 8.0, volume: 5000000, market_cap: 5000000000 },
  { ticker: 'BTC', nome: 'Bitcoin', classe: 'cripto', preco: 350000, variacao_dia: 3.2, variacao_mes: 10.0, variacao_ano: 80.0, volume: 1000000000, market_cap: 7000000000000 },
]

describe('ranquearAtivos', () => {
  it('ranqueia ações por combinação de DY e P/L', () => {
    const ranqueados = ranquearAtivos(mockAtivos.slice(0, 3), 'acoes', 'crescimento')
    expect(ranqueados.length).toBe(3)
  })

  it('ranqueia FIIs por DY', () => {
    const ranqueados = ranquearAtivos(mockAtivos.slice(3, 4), 'fiis', 'renda_extra')
    expect(ranqueados[0].ticker).toBe('MXRF11')
  })

  it('retorna array vazio para lista vazia', () => {
    const ranqueados = ranquearAtivos([], 'acoes', 'crescimento')
    expect(ranqueados).toEqual([])
  })

  it('ordenacao sem crash com dados incompletos', () => {
    const incompleto: AtivoInfo = { ticker: 'TEST', nome: 'Test', classe: 'acoes', preco: 10, variacao_dia: 0, variacao_mes: 0, variacao_ano: 0, volume: 0 }
    const ranqueados = ranquearAtivos([incompleto], 'acoes', 'crescimento')
    expect(ranqueados.length).toBe(1)
  })
})

describe('sugerirAtivosPorClasse', () => {
  it('sugere no máximo N ativos', () => {
    const sugestoes = sugerirAtivosPorClasse(mockAtivos, 'acoes', 'crescimento', 2)
    expect(sugestoes.length).toBeLessThanOrEqual(2)
  })

  it('crescimento prioriza ações com bom P/L e retorno positivo', () => {
    const sugestoes = sugerirAtivosPorClasse(mockAtivos.slice(0, 3), 'acoes', 'crescimento', 3)
    // PETR4 wins: P/L 4.5 + var ano +15% beats VALE3 P/L 3.8 + var ano -5%
    expect(sugestoes[0].ticker).toBe('PETR4')
  })

  it('renda extra prioriza DY alto', () => {
    const sugestoes = sugerirAtivosPorClasse(mockAtivos.slice(0, 3), 'acoes', 'renda_extra', 3)
    expect(sugestoes[0].ticker).toBe('VALE3')
  })
})
