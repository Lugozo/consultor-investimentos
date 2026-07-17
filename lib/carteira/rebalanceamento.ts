import type { CarteiraAlocacao, CarteiraAtivo, ClasseAtivo } from '@/types'

export type Desvio = {
  classe: string
  pct_alvo: number
  pct_atual: number
  diferenca: number
  label: string
}

const CLASSE_LABELS: Record<string, string> = {
  rf: 'Renda Fixa',
  acoes: 'Ações',
  fiis: 'Fundos Imobiliários',
  cripto: 'Criptomoedas',
  internacional: 'Internacional',
}

/**
 * Calcula alocação atual (%) por classe a partir dos ativos da carteira.
 * Usa preco_atual como proxy de valor quando quantidade = 0.
 */
export function calcularAlocacaoAtual(
  ativos: CarteiraAtivo[],
): Record<string, number> {
  if (ativos.length === 0) return {}

  const porClasse: Record<string, number> = {}

  for (const a of ativos) {
    const valor = a.quantidade > 0
      ? a.quantidade * a.preco_atual
      : a.preco_atual // proxy: assume 1 unidade se quantidade não informada
    porClasse[a.classe] = (porClasse[a.classe] ?? 0) + valor
  }

  const total = Object.values(porClasse).reduce((s, v) => s + v, 0)
  if (total === 0) return {}

  const pcts: Record<string, number> = {}
  for (const [classe, valor] of Object.entries(porClasse)) {
    pcts[classe] = Math.round((valor / total) * 100)
  }

  return pcts
}

/**
 * Verifica desvios entre alocação alvo e atual.
 * Retorna apenas classes com diferença > limitePercentual (default 5%).
 */
export function verificarRebalanceamento(
  alocacoes: CarteiraAlocacao[],
  ativos: CarteiraAtivo[],
  limitePercentual = 5,
): Desvio[] {
  const atual = calcularAlocacaoAtual(ativos)
  const desvios: Desvio[] = []

  for (const a of alocacoes) {
    // Renda fixa é estática — não sofre drift de mercado
    if (a.classe_ativo === 'rf') continue

    const pctAtual = atual[a.classe_ativo] ?? 0
    const diff = Math.abs(a.pct_alvo - pctAtual)

    if (diff > limitePercentual) {
      desvios.push({
        classe: a.classe_ativo,
        pct_alvo: a.pct_alvo,
        pct_atual: pctAtual,
        diferenca: diff,
        label: CLASSE_LABELS[a.classe_ativo] ?? a.classe_ativo,
      })
    }
  }

  return desvios.sort((a, b) => b.diferenca - a.diferenca)
}
