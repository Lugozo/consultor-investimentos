import type { QuestionarioRespostas } from '@/types'

export const OBJETIVO_LABELS: Record<string, string> = {
  aposentadoria: 'Aposentadoria',
  imovel: 'Compra de Imóvel',
  reserva_emergencia: 'Reserva de Emergência',
  renda_extra: 'Renda Extra',
  crescimento: 'Crescimento Patrimonial',
}

export const HORIZONTE_PESOS: Record<string, number> = {
  curto: 10,
  medio: 30,
  longo: 60,
  muito_longo: 90,
}

export const TOLERANCIA_PESOS: Record<string, number> = {
  venderia_tudo: 5,
  venderia_parte: 25,
  manteria: 60,
  compraria_mais: 95,
}

export const PERFIL_LIMITES = {
  conservador: { min: 0, max: 30 },
  moderado: { min: 31, max: 60 },
  agressivo: { min: 61, max: 100 },
} as const

export const ALOCACAO_BASE: Record<string, Record<string, number>> = {
  conservador: { rf: 80, acoes: 15, fiis: 3, cripto: 2, internacional: 0 },
  moderado: { rf: 50, acoes: 25, fiis: 15, cripto: 7, internacional: 3 },
  agressivo: { rf: 20, acoes: 45, fiis: 10, cripto: 15, internacional: 10 },
}
