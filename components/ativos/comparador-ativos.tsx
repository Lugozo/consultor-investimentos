'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatarMoeda, formatarPct } from '@/lib/utils/format'
import type { AtivoInfo } from '@/types'

export function ComparadorAtivos() {
  const [tickers, setTickers] = useState(['', '', ''])
  const [ativos, setAtivos] = useState<(AtivoInfo | null)[]>([null, null, null])
  const [loading, setLoading] = useState(false)

  const comparar = async () => {
    setLoading(true)
    const resultados = await Promise.all(
      tickers.map(async (t) => {
        if (!t.trim()) return null
        const res = await fetch(`/api/ativos/${encodeURIComponent(t)}`)
        if (!res.ok) return null
        return res.json()
      })
    )
    setAtivos(resultados)
    setLoading(false)
  }

  const indicadores = ['preco', 'variacao_dia', 'pl', 'pvp', 'dy', 'volume'] as const
  const labels: Record<string, string> = {
    preco: 'Preço', variacao_dia: 'Var. Dia', pl: 'P/L', pvp: 'P/VP', dy: 'DY', volume: 'Volume',
  }

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {tickers.map((t, i) => (
          <Input
            key={i}
            placeholder={`Ticker ${i + 1}`}
            value={t}
            onChange={e => {
              const novo = [...tickers]
              novo[i] = e.target.value
              setTickers(novo)
            }}
          />
        ))}
        <Button onClick={comparar} disabled={loading}>
          {loading ? '...' : 'Comparar'}
        </Button>
      </div>

      {ativos.some(a => a) && (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Indicador</th>
                {ativos.map((a, i) => a && (
                  <th key={i} className="text-right p-3 font-semibold">{a.ticker}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {indicadores.map(ind => (
                <tr key={ind} className="border-b">
                  <td className="p-3 text-slate-600">{labels[ind]}</td>
                  {ativos.map((a, i) => (
                    <td key={i} className="text-right p-3">
                      {a ? (ind === 'preco' ? formatarMoeda(a.preco) :
                            ind === 'variacao_dia' ? formatarPct(a.variacao_dia) :
                            ind === 'volume' ? formatarMoeda(a.volume) :
                            a[ind]?.toFixed(2) ?? '—') : '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
