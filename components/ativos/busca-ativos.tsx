'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatarMoeda, formatarPct } from '@/lib/utils/format'
import type { AtivoInfo } from '@/types'

export function BuscaAtivos() {
  const [query, setQuery] = useState('')
  const [resultados, setResultados] = useState<AtivoInfo[]>([])
  const [loading, setLoading] = useState(false)

  const buscar = async () => {
    if (!query.trim()) return
    setLoading(true)
    const res = await fetch(`/api/ativos/busca?q=${encodeURIComponent(query)}`)
    const data = await res.json()
    setResultados(data)
    setLoading(false)
  }

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Buscar por ticker (ex: PETR4, BTC, MXRF11)"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && buscar()}
          className="flex-1"
        />
        <Button onClick={buscar} disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {resultados.map(ativo => (
          <Card key={ativo.ticker} className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{ativo.ticker}</h3>
                <p className="text-sm text-slate-500">{ativo.nome}</p>
              </div>
              <p className="font-bold text-lg">{formatarMoeda(ativo.preco)}</p>
            </div>
            <div className="mt-3 flex gap-4 text-sm">
              <span className={ativo.variacao_dia >= 0 ? 'text-green-600' : 'text-red-600'}>
                Dia: {formatarPct(ativo.variacao_dia)}
              </span>
              {ativo.dy != null && (
                <span className="text-slate-500">DY: {ativo.dy.toFixed(1)}%</span>
              )}
              {ativo.pl != null && (
                <span className="text-slate-500">P/L: {ativo.pl.toFixed(1)}</span>
              )}
            </div>
            <a href={`/ativos/${ativo.ticker}`} className="text-teal-700 text-sm hover:underline mt-2 inline-block">
              Ver detalhes →
            </a>
          </Card>
        ))}
      </div>

      {resultados.length === 0 && !loading && query && (
        <p className="text-slate-500 text-center py-8">Nenhum ativo encontrado.</p>
      )}
    </div>
  )
}
