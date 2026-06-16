import { NextResponse } from 'next/server'
import { getCorretorasParaClasse } from '@/lib/api/corretoras'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const classe = searchParams.get('classe') ?? 'acoes'
  const corretoras = await getCorretorasParaClasse(classe)
  return NextResponse.json(corretoras)
}
