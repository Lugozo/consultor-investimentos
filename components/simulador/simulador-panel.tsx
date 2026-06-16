'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatarMoeda } from '@/lib/utils/format'
import type { CarteiraAlocacao } from '@/types'

type ClassePct = { classe: string; pct: number }

export function SimuladorPanel({ alocacoes, carteiraId }: { alocacoes: CarteiraAlocacao[]; carteiraId: string }) {
  const [sliders, setSliders] = useState<ClassePct[]>(
    alocacoes.map(a => ({ classe: a.classe_ativo, pct: a.pct_alvo }))
  )
  const [resultado, setResultado] = useState<any>(null)

  const total = sliders.reduce((s, c) => s + c.pct, 0)

  const atualizar = (i: number, v: number) => {
    const novo = [...sliders]
    novo[i] = { ...novo[i], pct: v }
    setSliders(novo)
  }

  const simular = async () => {
    const retornosEstimados: Record<string, number> = {
      rf: 0.11, acoes: 0.18, fiis: 0.14, cripto: 0.40, internacional: 0.15,
    }

    let retornoPonderado = 0
    let riscoPonderado = 0
    const volatilidades: Record<string, number> = { rf: 0.03, acoes: 0.25, fiis: 0.15, cripto: 0.60, internacional: 0.20 }

    for (const s of sliders) {
      const pct = s.pct / 100
      retornoPonderado += (retornosEstimados[s.classe] ?? 0.10) * pct
      riscoPonderado += (volatilidades[s.classe] ?? 0.15) * pct
    }

    setResultado({
      retorno_anual_estimado: retornoPonderado,
      volatilidade_estimada: riscoPonderado,
      indice_sharpe: retornoPonderado / (riscoPonderado || 0.01),
      projecao_5_anos: 10000 * Math.pow(1 + retornoPonderado, 5),
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Ajustar Alocação (%)</CardTitle></CardHeader>
        <div className="space-y-4">
          {sliders.map((s, i) => (
            <div key={s.classe}>
              <div className="flex justify-between text-sm mb-1">
                <span>{s.classe}</span>
                <span className="font-medium">{s.pct}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={s.pct}
                onChange={e => atualizar(i, Number(e.target.value))}
                className="w-full"
              />
            </div>
          ))}
          <p className={`text-sm ${total !== 100 ? 'text-red-500' : 'text-green-600'}`}>
            Total: {total}% {total !== 100 && '(deve ser 100%)'}
          </p>
          <Button onClick={simular} disabled={total !== 100}>Simular</Button>
        </div>
      </Card>

      {resultado && (
        <Card>
          <CardHeader><CardTitle>Resultado da Simulação</CardTitle></CardHeader>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-500">Retorno anual estimado</p>
              <p className="text-xl font-bold text-green-600">{(resultado.retorno_anual_estimado * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Volatilidade estimada</p>
              <p className="text-xl font-bold text-amber-600">{(resultado.volatilidade_estimada * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Índice Sharpe</p>
              <p className="text-xl font-bold">{resultado.indice_sharpe.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Projeção em 5 anos (R$ 10.000)</p>
              <p className="text-xl font-bold">{formatarMoeda(resultado.projecao_5_anos)}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
