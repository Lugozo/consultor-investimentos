import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { formatarMoeda, formatarPct, formatarNumero } from '@/lib/utils/format'
import type { AtivoInfo } from '@/types'

export function FichaAtivo({ ativo }: { ativo: AtivoInfo }) {
  const indicadores = [
    { label: 'Preço', value: formatarMoeda(ativo.preco) },
    { label: 'Variação (dia)', value: formatarPct(ativo.variacao_dia), positivo: ativo.variacao_dia >= 0 },
    { label: 'P/L', value: ativo.pl != null ? ativo.pl.toFixed(2) : '—' },
    { label: 'P/VP', value: ativo.pvp != null ? ativo.pvp.toFixed(2) : '—' },
    { label: 'Dividend Yield', value: ativo.dy != null ? `${ativo.dy.toFixed(2)}%` : '—' },
    { label: 'Volume', value: formatarNumero(ativo.volume) },
    { label: 'Market Cap', value: ativo.market_cap ? formatarMoeda(ativo.market_cap) : '—' },
  ]

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-6">
        <h1 className="text-2xl font-bold">{ativo.ticker}</h1>
        <span className="text-lg text-slate-500">{ativo.nome}</span>
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle>Indicadores</CardTitle></CardHeader>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {indicadores.map(i => (
            <div key={i.label}>
              <p className="text-xs text-slate-500">{i.label}</p>
              <p className={`text-lg font-semibold ${
                i.positivo === true ? 'text-green-600' :
                i.positivo === false ? 'text-red-600' : ''
              }`}>{i.value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
