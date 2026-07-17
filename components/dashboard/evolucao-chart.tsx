'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Simula 12 meses de evolução baseado na alocação
function gerarDados(alocacao: Record<string, number>) {
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  // Retorno mensal simulado: ~0.8% ao mês (~10% a.a.)
  let patrimonio = 10000
  let cdi = 10000
  let ibov = 10000

  return meses.map(mes => {
    patrimonio *= 1 + (Math.random() * 0.02 - 0.003)
    cdi *= 1 + (Math.random() * 0.008 + 0.004)
    ibov *= 1 + (Math.random() * 0.05 - 0.01)
    return {
      mes,
      Carteira: Math.round(patrimonio),
      CDI: Math.round(cdi),
      Ibovespa: Math.round(ibov),
    }
  })
}

export function EvolucaoChart({ alocacao }: { alocacao: Record<string, number> }) {
  const dados = gerarDados(alocacao)

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dados} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="mes" tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <Tooltip formatter={(v: any) => `R$ ${Number(v).toLocaleString('pt-BR')}`} />
          <Legend />
          <Line type="monotone" dataKey="Carteira" stroke="#0f766e" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="CDI" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
          <Line type="monotone" dataKey="Ibovespa" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
