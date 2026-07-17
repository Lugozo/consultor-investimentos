import { createServerSupabase } from '@/lib/supabase/server'
import { gerarAlocacao } from '@/lib/algorithms/alocacao'
import { ranquearAtivos, sugerirAtivosPorClasse } from '@/lib/algorithms/selecao-ativos'
import { buscarMultiplosAtivos } from '@/lib/api/yahoo-finance'
import { buscarCripto } from '@/lib/api/coingecko'
import { ACOES_BR, FIIS_BR, CRIPTO_TICKERS, INTERNACIONAL_BDRS, RENDA_FIXA_PRODUTOS } from '@/lib/tickers'
import { getPlano } from '@/lib/stripe/queries'
import type { AtivoInfo, ClasseAtivo, PerfilInvestidor } from '@/types'

const LIMITES: Record<string, number> = {
  acoes: 10,
  fiis: 8,
  cripto: 4,
  internacional: 5,
}

async function buscarAtivosPorClasse(
  classe: ClasseAtivo,
  tickers: string[],
): Promise<AtivoInfo[]> {
  if (classe === 'rf' || tickers.length === 0) return []

  try {
    let ativos: AtivoInfo[]

    if (classe === 'cripto') {
      const results = await Promise.allSettled(tickers.map(t => buscarCripto(t)))
      ativos = results
        .filter((r): r is PromiseFulfilledResult<AtivoInfo> =>
          r.status === 'fulfilled' && r.value !== null,
        )
        .map(r => r.value)
    } else {
      ativos = await buscarMultiplosAtivos(tickers)
    }

    // Override class to match expected — yahoo-finance mapClasse may misclassify BDRs
    return ativos.map(a => ({ ...a, classe }))
  } catch {
    console.error(`[gerarCarteira] Falha ao buscar ativos para classe ${classe}`)
    return []
  }
}

export async function gerarCarteira(userId: string): Promise<string> {
  const supabase = await createServerSupabase()

  // 1. Read perfil
  const { data: perfil, error: perfilErr } = await supabase
    .from('perfis_investidor')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (perfilErr || !perfil) {
    throw new Error('Perfil não encontrado. Responda o questionário primeiro.')
  }

  const p = perfil as PerfilInvestidor

  // 2. Check Free tier limit (1 active carteira)
  const plano = await getPlano(userId)
  if (plano !== 'active') {
    const { count } = await supabase
      .from('carteiras')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'ativa')

    if ((count ?? 0) >= 1) {
      throw new Error('Plano Free permite apenas 1 carteira. Faça upgrade para criar mais.')
    }
  }

  // 3. Mark old active carteiras as historicas
  await supabase
    .from('carteiras')
    .update({ status: 'historica' })
    .eq('user_id', userId)
    .eq('status', 'ativa')

  // 3. Create new carteira
  const { data: carteira, error: carteiraErr } = await supabase
    .from('carteiras')
    .insert({
      user_id: userId,
      nome: 'Minha Carteira',
      perfil_id: p.id,
      status: 'ativa',
    })
    .select('id')
    .single()

  if (carteiraErr || !carteira) {
    throw new Error('Erro ao criar carteira.')
  }

  const carteiraId = carteira.id

  // 4. Compute allocation and save
  const alocacao = gerarAlocacao(p.perfil_final, p.objetivo)

  const alocacaoRows = Object.entries(alocacao).map(([classe, pct]) => ({
    carteira_id: carteiraId,
    classe_ativo: classe,
    pct_alvo: pct,
    pct_atual: 0,
  }))

  const { error: alocErr } = await supabase
    .from('carteiras_alocacao')
    .insert(alocacaoRows)

  if (alocErr) {
    console.error('[gerarCarteira] Erro ao salvar alocação:', alocErr.message)
  }

  // 5. Fetch and save assets per class
  const tickerMap: Record<string, string[]> = {
    acoes: ACOES_BR,
    fiis: FIIS_BR,
    cripto: CRIPTO_TICKERS,
    internacional: INTERNACIONAL_BDRS,
  }

  for (const classe of Object.keys(tickerMap)) {
    const tickers = tickerMap[classe]
    const limite = LIMITES[classe] ?? 5

    try {
      const ativos = await buscarAtivosPorClasse(classe as ClasseAtivo, tickers)
      if (ativos.length === 0) continue

      const selecionados = sugerirAtivosPorClasse(
        ativos,
        classe,
        p.objetivo,
        limite,
      )

      if (selecionados.length === 0) continue

      const rows = selecionados.map(a => ({
        carteira_id: carteiraId,
        ticker: a.ticker,
        nome: a.nome,
        classe: a.classe,
        quantidade: 0,
        preco_medio: 0,
        preco_atual: a.preco,
      }))

      const { error: ativosErr } = await supabase
        .from('carteiras_ativos')
        .insert(rows)

      if (ativosErr) {
        console.error(`[gerarCarteira] Erro ao salvar ativos de ${classe}:`, ativosErr.message)
      }
    } catch (err) {
      console.error(`[gerarCarteira] Erro ao processar classe ${classe}:`, err)
      // Continue to next class
    }
  }

  // 6. Renda Fixa — produtos estáticos (sem API pública)
  if (alocacao.rf > 0 && RENDA_FIXA_PRODUTOS.length > 0) {
    const rfSelecionados = RENDA_FIXA_PRODUTOS.slice(0, 6) // top 6 produtos
    const rfRows = rfSelecionados.map(p => ({
      carteira_id: carteiraId,
      ticker: p.ticker,
      nome: `${p.nome} (${p.rentabilidade})`,
      classe: 'rf',
      quantidade: 0,
      preco_medio: 0,
      preco_atual: 0,
    }))

    await supabase.from('carteiras_ativos').insert(rfRows)
  }

  return carteiraId
}
