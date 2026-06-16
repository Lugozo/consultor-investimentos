import { FichaAtivo } from '@/components/ativos/ficha-ativo'
import type { AtivoInfo } from '@/types'

export default async function AtivoPage({
  params,
}: {
  params: Promise<{ ticker: string }>
}) {
  const { ticker } = await params
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/ativos/${ticker}`, { cache: 'no-store' })
  if (!res.ok) return <p className="text-red-600">Ativo não encontrado.</p>
  const ativo: AtivoInfo = await res.json()

  return <FichaAtivo ativo={ativo} />
}
