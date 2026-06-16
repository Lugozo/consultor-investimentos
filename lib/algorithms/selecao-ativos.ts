import type { AtivoInfo, PerfilInvestidor } from '@/types'

function scoreCrescimento(a: AtivoInfo): number {
  let score = 0
  if (a.pl != null && a.pl > 0) score += (1 / a.pl) * 10
  if (a.pvp != null && a.pvp > 0) score += (1 / a.pvp) * 3
  if (a.variacao_ano) score += a.variacao_ano * 0.1
  return score
}

function scoreDividendos(a: AtivoInfo): number {
  let score = 0
  if (a.dy != null) score += a.dy * 2
  if (a.pvp != null && a.pvp > 0) score += (1 / a.pvp) * 2
  return score
}

function scoreEstabilidade(a: AtivoInfo): number {
  let score = 0
  score -= Math.abs(a.variacao_ano) * 0.3
  if (a.volume > 0) score += Math.log10(a.volume)
  return score
}

export function ranquearAtivos(
  ativos: AtivoInfo[],
  classe: string,
  objetivo: PerfilInvestidor['objetivo']
): AtivoInfo[] {
  const scored = ativos.map(a => {
    let score = 0
    switch (objetivo) {
      case 'crescimento':
      case 'aposentadoria':
        score = scoreCrescimento(a)
        break
      case 'renda_extra':
        score = scoreDividendos(a)
        break
      case 'reserva_emergencia':
      case 'imovel':
        score = scoreEstabilidade(a)
        break
    }

    if (a.classe === 'fiis' && (objetivo === 'renda_extra' || objetivo === 'aposentadoria')) {
      score += 2
    }
    if (a.classe === 'cripto' && objetivo === 'crescimento') {
      score += 1
    }

    return { ...a, _score: score }
  })

  return scored
    .sort((a, b) => (b as any)._score - (a as any)._score)
    .map(({ _score, ...rest }: any) => rest as AtivoInfo)
}

export function sugerirAtivosPorClasse(
  ativos: AtivoInfo[],
  classe: string,
  objetivo: PerfilInvestidor['objetivo'],
  limite: number
): AtivoInfo[] {
  const daClasse = ativos.filter(a => a.classe === classe)
  const ranqueados = ranquearAtivos(daClasse, classe, objetivo)
  return ranqueados.slice(0, limite)
}
