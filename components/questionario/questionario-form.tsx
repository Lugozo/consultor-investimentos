'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { calcularScoreRisco, classificarPerfil } from '@/lib/algorithms/score-risco'
import type { QuestionarioRespostas } from '@/types'

type Passo = {
  titulo: string
  campo: keyof QuestionarioRespostas
  tipo: 'number' | 'select' | 'slider' | 'boolean'
  opcoes?: { value: string; label: string }[]
}

const passos: Passo[] = [
  { titulo: 'Qual sua idade?', campo: 'idade', tipo: 'number' },
  {
    titulo: 'Qual sua renda mensal aproximada?',
    campo: 'renda_mensal',
    tipo: 'select',
    opcoes: [
      { value: 'ate_3000', label: 'Até R$ 3.000' },
      { value: '3000_5000', label: 'R$ 3.000 a R$ 5.000' },
      { value: '5000_10000', label: 'R$ 5.000 a R$ 10.000' },
      { value: '10000_20000', label: 'R$ 10.000 a R$ 20.000' },
      { value: 'acima_20000', label: 'Acima de R$ 20.000' },
    ],
  },
  {
    titulo: 'Qual seu patrimônio atual?',
    campo: 'patrimonio',
    tipo: 'select',
    opcoes: [
      { value: 'ate_10000', label: 'Até R$ 10.000' },
      { value: '10000_50000', label: 'R$ 10.000 a R$ 50.000' },
      { value: '50000_100000', label: 'R$ 50.000 a R$ 100.000' },
      { value: '100000_500000', label: 'R$ 100.000 a R$ 500.000' },
      { value: 'acima_500000', label: 'Acima de R$ 500.000' },
    ],
  },
  {
    titulo: 'Qual seu objetivo principal?',
    campo: 'objetivo',
    tipo: 'select',
    opcoes: [
      { value: 'aposentadoria', label: 'Aposentadoria' },
      { value: 'imovel', label: 'Compra de Imóvel' },
      { value: 'reserva_emergencia', label: 'Reserva de Emergência' },
      { value: 'renda_extra', label: 'Renda Extra' },
      { value: 'crescimento', label: 'Crescimento Patrimonial' },
    ],
  },
  {
    titulo: 'Qual o horizonte do seu objetivo?',
    campo: 'horizonte',
    tipo: 'select',
    opcoes: [
      { value: 'curto', label: 'Curto prazo (até 2 anos)' },
      { value: 'medio', label: 'Médio prazo (3 a 5 anos)' },
      { value: 'longo', label: 'Longo prazo (6 a 10 anos)' },
      { value: 'muito_longo', label: 'Muito longo (+10 anos)' },
    ],
  },
  {
    titulo: 'Quanto você entende de investimentos?',
    campo: 'experiencia_nivel',
    tipo: 'select',
    opcoes: [
      { value: '1', label: 'Nível 1 — Iniciante' },
      { value: '2', label: 'Nível 2 — Básico' },
      { value: '3', label: 'Nível 3 — Intermediário' },
      { value: '4', label: 'Nível 4 — Avançado' },
      { value: '5', label: 'Nível 5 — Expert' },
    ],
  },
  {
    titulo: 'Se sua carteira cair 20% em um mês, você:',
    campo: 'tolerancia_risco',
    tipo: 'select',
    opcoes: [
      { value: 'venderia_tudo', label: 'Venderia tudo' },
      { value: 'venderia_parte', label: 'Venderia parte' },
      { value: 'manteria', label: 'Manteria' },
      { value: 'compraria_mais', label: 'Compraria mais' },
    ],
  },
  {
    titulo: 'Quanto % da sua renda consegue investir?',
    campo: 'pct_investimento',
    tipo: 'slider',
  },
  {
    titulo: 'Você tem reserva de emergência?',
    campo: 'tem_reserva',
    tipo: 'boolean',
  },
  {
    titulo: 'Prefere simplicidade ou otimização máxima?',
    campo: 'pref_simplicidade',
    tipo: 'select',
    opcoes: [
      { value: '1', label: '1 — Máxima simplicidade' },
      { value: '2', label: '2' },
      { value: '3', label: '3 — Equilíbrio' },
      { value: '4', label: '4' },
      { value: '5', label: '5 — Máxima otimização' },
    ],
  },
]

export function QuestionarioForm() {
  const [passoAtual, setPassoAtual] = useState(0)
  const [respostas, setRespostas] = useState<Record<string, string | number | boolean>>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const passo = passos[passoAtual]
  const valor = respostas[passo.campo] ?? ''

  const setValor = (v: string | number | boolean) => {
    setRespostas(prev => ({ ...prev, [passo.campo]: v }))
  }

  const avancar = () => {
    if (valor === '' || valor === undefined) return
    if (passoAtual < passos.length - 1) {
      setPassoAtual(passoAtual + 1)
    }
  }

  const voltar = () => {
    if (passoAtual > 0) setPassoAtual(passoAtual - 1)
  }

  const finalizar = async () => {
    setLoading(true)
    setError('')

    const typed = respostas as unknown as QuestionarioRespostas
    typed.idade = Number(typed.idade)
    typed.experiencia_nivel = Number(typed.experiencia_nivel)
    typed.pct_investimento = Number(typed.pct_investimento)
    typed.pref_simplicidade = Number(typed.pref_simplicidade)
    typed.tem_reserva = Boolean(typed.tem_reserva)

    const score = calcularScoreRisco(typed)
    const perfil = classificarPerfil(score)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Usuário não autenticado'); setLoading(false); return }

    const { error: insertErr } = await supabase.from('perfis_investidor').upsert({
      user_id: user.id,
      idade: typed.idade,
      renda_mensal: typed.renda_mensal,
      patrimonio: typed.patrimonio,
      objetivo: typed.objetivo,
      horizonte: typed.horizonte,
      experiencia_nivel: typed.experiencia_nivel,
      tolerancia_risco: typed.tolerancia_risco,
      pct_investimento: typed.pct_investimento,
      tem_reserva: typed.tem_reserva,
      pref_simplicidade: typed.pref_simplicidade,
      score_risco: score,
      perfil_final: perfil,
    })

    if (insertErr) { setError(insertErr.message); setLoading(false); return }

    router.push('/questionario/resultado')
  }

  const renderInput = () => {
    switch (passo.tipo) {
      case 'number':
        return (
          <Input
            type="number"
            value={String(valor)}
            onChange={e => setValor(Number(e.target.value))}
            min={0}
            max={120}
          />
        )
      case 'select':
        return (
          <Select
            options={passo.opcoes ?? []}
            value={String(valor)}
            onChange={e => setValor(e.target.value)}
          />
        )
      case 'slider':
        return (
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={0}
              max={100}
              value={Number(valor) || 0}
              onChange={e => setValor(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm font-medium w-12">{valor || 0}%</span>
          </div>
        )
      case 'boolean':
        return (
          <div className="flex gap-4">
            <Button
              variant={valor === true ? 'primary' : 'outline'}
              onClick={() => setValor(true)}
            >
              Sim
            </Button>
            <Button
              variant={valor === false ? 'primary' : 'outline'}
              onClick={() => setValor(false)}
            >
              Não
            </Button>
          </div>
        )
    }
  }

  const isUltimoPasso = passoAtual === passos.length - 1

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>{passo.titulo}</CardTitle>
        <p className="text-sm text-slate-500">
          Pergunta {passoAtual + 1} de {passos.length}
        </p>
      </CardHeader>

      <div className="mb-6">{renderInput()}</div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="flex justify-between">
        <Button variant="outline" onClick={voltar} disabled={passoAtual === 0}>
          Voltar
        </Button>
        {isUltimoPasso ? (
          <Button onClick={finalizar} disabled={loading}>
            {loading ? 'Salvando...' : 'Ver Resultado'}
          </Button>
        ) : (
          <Button onClick={avancar} disabled={valor === '' || valor === undefined}>
            Próxima
          </Button>
        )}
      </div>

      <div className="mt-6 h-1 rounded-full bg-slate-200">
        <div
          className="h-1 rounded-full bg-teal-600 transition-all"
          style={{ width: `${((passoAtual + 1) / passos.length) * 100}%` }}
        />
      </div>
    </Card>
  )
}
