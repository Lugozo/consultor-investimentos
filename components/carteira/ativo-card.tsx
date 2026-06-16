import { Card } from '@/components/ui/card'
import { formatarMoeda } from '@/lib/utils/format'
import { BotaoComprar } from './botao-comprar'
import type { CarteiraAtivo } from '@/types'

export function AtivoCard({ ativo }: { ativo: CarteiraAtivo }) {
  const variacao = ativo.preco_medio > 0
    ? ((ativo.preco_atual - ativo.preco_medio) / ativo.preco_medio) * 100
    : 0

  return (
    <Card className="flex justify-between items-center">
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-semibold">{ativo.ticker}</h4>
          <span className="text-xs text-slate-400">{ativo.nome}</span>
        </div>
        <div className="flex gap-4 mt-1 text-sm">
          <span className="text-slate-600">Qtd: {ativo.quantidade}</span>
          <span className="text-slate-600">Preço médio: {formatarMoeda(ativo.preco_medio)}</span>
          <span className="text-slate-600">Atual: {formatarMoeda(ativo.preco_atual)}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-sm font-medium ${variacao >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {variacao >= 0 ? '+' : ''}{variacao.toFixed(2)}%
        </span>
        <BotaoComprar ticker={ativo.ticker} classe={ativo.classe} />
      </div>
    </Card>
  )
}
