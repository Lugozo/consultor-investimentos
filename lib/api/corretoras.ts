import { createServerSupabase } from '@/lib/supabase/server'

export type CorretoraLink = {
  id: string
  corretora: string
  url_base: string
  afiliado_id: string | null
  classes: string[]
}

export async function getCorretorasParaClasse(classe: string): Promise<CorretoraLink[]> {
  const supabase = await createServerSupabase()
  const { data } = await supabase
    .from('corretora_links')
    .select('*')
    .eq('ativo', true)
    .contains('classes', [classe])

  return (data ?? []) as CorretoraLink[]
}
