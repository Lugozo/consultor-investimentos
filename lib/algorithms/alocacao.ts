import { ALOCACAO_BASE } from '@/lib/utils/constants'
import type { ClasseAtivo, PerfilInvestidor } from '@/types'

type Alocacao = Record<ClasseAtivo, number>

const AJUSTES_OBJETIVO: Record<string, Partial<Alocacao>> = {
  reserva_emergencia: { rf: 90, acoes: 8, fiis: 2, cripto: 0, internacional: 0 },
  imovel: { rf: 65, acoes: 20, fiis: 10, cripto: 3, internacional: 2 },
  renda_extra: { rf: 35, acoes: 30, fiis: 25, cripto: 5, internacional: 5 },
  aposentadoria: { rf: 25, acoes: 40, fiis: 10, cripto: 10, internacional: 15 },
}

export function gerarAlocacao(
  perfil: PerfilInvestidor['perfil_final'],
  objetivo: PerfilInvestidor['objetivo']
): Alocacao {
  const base = { ...ALOCACAO_BASE[perfil] } as Alocacao

  const ajuste = AJUSTES_OBJETIVO[objetivo]
  if (ajuste) {
    const blendFactor = objetivo === 'reserva_emergencia' ? 1.0 : 0.5
    for (const classe of Object.keys(ajuste) as ClasseAtivo[]) {
      base[classe] = Math.round(
        base[classe] * (1 - blendFactor) + (ajuste[classe] ?? base[classe]) * blendFactor
      )
    }
  }

  const soma = Object.values(base).reduce((a: number, b: number) => a + b, 0)
  const diff = 100 - soma
  const maiorClasse = Object.entries(base).sort(([, a], [, b]) => b - a)[0][0] as ClasseAtivo
  base[maiorClasse] += diff

  return base
}
