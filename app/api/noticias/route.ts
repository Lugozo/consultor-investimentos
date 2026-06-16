import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

type Noticia = {
  titulo: string
  link: string
  fonte: string
  data: string
}

export async function GET() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const noticias: Noticia[] = [
    { titulo: 'Acompanhe as principais notícias do mercado no InfoMoney', link: 'https://www.infomoney.com.br/', fonte: 'InfoMoney', data: new Date().toISOString() },
    { titulo: 'Análises e recomendações de investimentos na Suno', link: 'https://www.sunoresearch.com.br/', fonte: 'Suno Research', data: new Date().toISOString() },
    { titulo: 'Conteúdo educativo sobre investimentos na Toro', link: 'https://blog.toroinvestimentos.com.br/', fonte: 'Toro', data: new Date().toISOString() },
  ]

  return NextResponse.json(noticias)
}
