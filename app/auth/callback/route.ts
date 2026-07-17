import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Open redirect protection — only allow internal paths
  const safePaths = ['/dashboard', '/carteira', '/ativos', '/metas', '/questionario', '/config', '/watchlist']
  const nextParam = searchParams.get('next')
  const next = nextParam && safePaths.some(p => nextParam.startsWith('/') && !nextParam.includes('//'))
    ? nextParam
    : '/dashboard'

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return [] }, setAll() {} } }
    )
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(`${origin}${next}`)
}
