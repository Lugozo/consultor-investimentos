import { Card } from '@/components/ui/card'
import { formatarMoeda } from '@/lib/utils/format'
import type { Meta } from '@/types'

export function MetaCard({ meta }: { meta: Meta }) {
  const hoje = new Date()
  const dataAlvo = new Date(meta.data_alvo + 'T00:00:00')
  const diasRestantes = Math.max(0, Math.ceil((dataAlvo.getTime() - hoje.getTime()) / 86400000))
  const mesesRestantes = Math.ceil(diasRestantes / 30)

  const progresso = meta.aporte_mensal_planejado > 0
    ? Math.min(100, (meta.valor_alvo / (meta.aporte_mensal_planejado * (mesesRestantes || 1))) * 100)
    : 0

  return (
    <Card className="hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg">{meta.nome}</h3>
      <p className="text-3xl font-bold text-teal-700 mt-2">{formatarMoeda(meta.valor_alvo)}</p>
      <div className="mt-3 space-y-2 text-sm text-slate-500">
        <div className="flex justify-between">
          <span>Aporte mensal</span>
          <span>{formatarMoeda(meta.aporte_mensal_planejado)}</span>
        </div>
        <div className="flex justify-between">
          <span>Prazo</span>
          <span>{new Date(meta.data_alvo + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
        </div>
      </div>
      <div className="mt-4 h-2 rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-teal-600"
          style={{ width: `${Math.min(100, progresso)}%` }}
        />
      </div>
    </Card>
  )
}
