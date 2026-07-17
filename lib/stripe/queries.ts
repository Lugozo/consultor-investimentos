import { createServerSupabase } from '@/lib/supabase/server'

export async function getPlano(userId: string): Promise<string> {
  const supabase = await createServerSupabase()

  const { data } = await supabase
    .from('assinaturas')
    .select('status')
    .eq('user_id', userId)
    .maybeSingle()

  return data?.status ?? 'free'
}

export async function isPremium(userId: string): Promise<boolean> {
  const plano = await getPlano(userId)
  return plano === 'active'
}
