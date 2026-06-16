export type PerfilInvestidor = {
  id: string
  user_id: string
  idade: number
  renda_mensal: string
  patrimonio: string
  objetivo: 'aposentadoria' | 'imovel' | 'reserva_emergencia' | 'renda_extra' | 'crescimento'
  horizonte: 'curto' | 'medio' | 'longo' | 'muito_longo'
  experiencia_nivel: number
  tolerancia_risco: 'venderia_tudo' | 'venderia_parte' | 'manteria' | 'compraria_mais'
  pct_investimento: number
  tem_reserva: boolean
  pref_simplicidade: number
  score_risco: number
  perfil_final: 'conservador' | 'moderado' | 'agressivo'
  created_at: string
}

export type Carteira = {
  id: string
  user_id: string
  nome: string
  perfil_id: string | null
  meta_id: string | null
  status: 'ativa' | 'historica'
  created_at: string
}

export type CarteiraAlocacao = {
  id: string
  carteira_id: string
  classe_ativo: string
  pct_alvo: number
  pct_atual: number
}

export type CarteiraAtivo = {
  id: string
  carteira_id: string
  ticker: string
  nome: string
  classe: string
  quantidade: number
  preco_medio: number
  preco_atual: number
  data_atualizacao: string
}

export type Meta = {
  id: string
  user_id: string
  nome: string
  valor_alvo: number
  data_alvo: string
  aporte_mensal_planejado: number
  created_at: string
}

export type Simulacao = {
  id: string
  user_id: string
  carteira_id: string
  parametros: Record<string, unknown>
  resultado: Record<string, unknown>
  created_at: string
}

export type AtivoInfo = {
  ticker: string
  nome: string
  classe: string
  preco: number
  variacao_dia: number
  variacao_mes: number
  variacao_ano: number
  pl?: number
  pvp?: number
  dy?: number
  volume: number
  market_cap?: number
}

export type ClasseAtivo = 'rf' | 'acoes' | 'fiis' | 'cripto' | 'internacional'

export type QuestionarioRespostas = {
  idade: number
  renda_mensal: string
  patrimonio: string
  objetivo: PerfilInvestidor['objetivo']
  horizonte: PerfilInvestidor['horizonte']
  experiencia_nivel: number
  tolerancia_risco: PerfilInvestidor['tolerancia_risco']
  pct_investimento: number
  tem_reserva: boolean
  pref_simplicidade: number
}
