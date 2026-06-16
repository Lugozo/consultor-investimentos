export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)
}

export function formatarPct(valor: number): string {
  return `${valor > 0 ? '+' : ''}${valor.toFixed(2)}%`
}

export function formatarNumero(valor: number): string {
  return new Intl.NumberFormat('pt-BR').format(valor)
}

export function formatarData(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(iso))
}

export function formatarDataCompleta(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}

export function pctAbsoluto(valor: number, total: number): number {
  if (total === 0) return 0
  return Math.round((valor / total) * 10000) / 100
}
