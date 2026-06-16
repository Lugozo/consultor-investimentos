'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { CarteiraAlocacao } from '@/types'

const COLORS: Record<string, string> = {
  'Renda Fixa': '#0f766e',
  'Ações': '#0ea5e9',
  'Fundos Imobiliários': '#8b5cf6',
  'Criptomoedas': '#f59e0b',
  'Internacional': '#ef4444',
}

const CLASSE_LABELS: Record<string, string> = {
  rf: 'Renda Fixa',
  acoes: 'Ações',
  fiis: 'Fundos Imobiliários',
  cripto: 'Criptomoedas',
  internacional: 'Internacional',
}

export function AlocacaoChart({ alocacoes }: { alocacoes: CarteiraAlocacao[] }) {
  const data = alocacoes.map(a => ({
    name: CLASSE_LABELS[a.classe_ativo] ?? a.classe_ativo,
    value: a.pct_alvo,
    color: COLORS[CLASSE_LABELS[a.classe_ativo]] ?? '#94a3b8',
  }))

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
