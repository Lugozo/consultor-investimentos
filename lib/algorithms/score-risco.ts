import type { QuestionarioRespostas } from '@/types'
import { HORIZONTE_PESOS, TOLERANCIA_PESOS, PERFIL_LIMITES } from '@/lib/utils/constants'

export function calcularScoreRisco(respostas: QuestionarioRespostas): number {
  const horizonteScore = HORIZONTE_PESOS[respostas.horizonte] ?? 30
  const toleranciaScore = TOLERANCIA_PESOS[respostas.tolerancia_risco] ?? 30
  const experienciaScore = (respostas.experiencia_nivel / 5) * 100
  const idadeScore = Math.max(0, 100 - respostas.idade * 1.5)

  const score = Math.round(
    horizonteScore * 0.30 +
    toleranciaScore * 0.35 +
    experienciaScore * 0.15 +
    idadeScore * 0.20
  )

  return Math.max(0, Math.min(100, score))
}

export function classificarPerfil(score: number): 'conservador' | 'moderado' | 'agressivo' {
  if (score <= PERFIL_LIMITES.conservador.max) return 'conservador'
  if (score <= PERFIL_LIMITES.moderado.max) return 'moderado'
  return 'agressivo'
}
