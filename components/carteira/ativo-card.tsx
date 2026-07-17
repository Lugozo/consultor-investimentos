import { Card } from '@/components/ui/card'
import { formatarMoeda } from '@/lib/utils/format'
import { BotaoComprar } from './botao-comprar'
import type { CarteiraAtivo } from '@/types'

export function AtivoCard({ ativo }: { ativo: CarteiraAtivo }) {
  const variacao = ativo.preco_medio > 0
    ? ((ativo.preco_atual - ativo.preco_medio) / ativo.preco_medio) * 100
    : 0

  const isRendaFixa = ativo.classe === 'rf'

  return (
    <Card className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-semibold truncate">{isRendaFixa ? ativo.nome.split(' (')[0] : ativo.ticker}</h4>
          <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${isRendaFixa ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
            {isRendaFixa ? 'Renda Fixa' : ativo.nome}
          </span>
        </div>
        {isRendaFixa ? (
          <p className="text-xs text-slate-500 mt-1 truncate">{ativo.nome}</p>
        ) : (
          <div className="flex gap-3 mt-1 text-sm flex-wrap">
            <span className="text-slate-600">Qtd: {ativo.quantidade}</span>
            <span className="text-slate-600">Médio: {formatarMoeda(ativo.preco_medio)}</span>
            <span className="text-slate-600">Atual: {formatarMoeda(ativo.preco_atual)}</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 justify-end">
        {!isRendaFixa && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${variacao >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {variacao >= 0 ? '+' : ''}{variacao.toFixed(1)}%
          </span>
        )}
        {isRendaFixa ? (
          <span className="text-xs text-slate-400 italic">Consulte a corretora</span>
        ) : (
          <BotaoComprar ticker={ativo.ticker} classe={ativo.classe} />
        )}
      </div>
    </Card>
  )
}
