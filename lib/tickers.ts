export const ACOES_BR: string[] = [
  'PETR4', 'VALE3', 'ITUB4', 'BBDC4', 'BBAS3',
  'ABEV3', 'WEGE3', 'RENT3', 'RAIZ4', 'EQTL3',
  'ELET3', 'SUZB3', 'PRIO3', 'CMIG4', 'GGBR4',
  'CSAN3', 'TOTS3', 'HAPV3', 'RDOR3', 'RADL3',
  'B3SA3', 'LREN3', 'MGLU3', 'ASAI3', 'CRFB3',
  'NTCO3', 'EMBR3', 'BRFS3', 'JBSS3', 'MRFG3',
  'CPLE6', 'EGIE3', 'VIVT3', 'TIMS3', 'CCRO3',
  'STBP3', 'PSSA3', 'CXSE3', 'ITSA4', 'TAEE11',
]

export const FIIS_BR: string[] = [
  'HGLG11', 'KNRI11', 'XPLG11', 'VISC11', 'MXRF11',
  'BCFF11', 'BRCO11', 'HGRE11', 'KNIP11', 'RBRR11',
  'HSML11', 'IRDM11', 'JSRE11', 'PVBI11', 'RBVA11',
  'RECT11', 'SDIL11', 'TRXF11', 'VINO11', 'XPML11',
  'ALZR11', 'BTLG11', 'CPTS11', 'DEVA11', 'GGRC11',
]

export const CRIPTO_TICKERS: string[] = [
  'BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'XRP', 'DOT', 'DOGE', 'LINK',
]

export const INTERNACIONAL_BDRS: string[] = [
  'AAPL34', 'GOGL34', 'MSFT34', 'AMZO34', 'NFLX34',
  'TSLA34', 'MELI34', 'M1TA34', 'NVDC34', 'DISB34',
  'JPMC34', 'WALM34', 'COCA34', 'PEPB34', 'MCDC34',
]

// Produtos de Renda Fixa — estáticos (sem API pública)
export interface RendaFixaProduto {
  ticker: string
  nome: string
  tipo: string
  rentabilidade: string
  liquidez: string
  risco: string
}

export const RENDA_FIXA_PRODUTOS: RendaFixaProduto[] = [
  { ticker: 'SELIC',  nome: 'Tesouro Selic',             tipo: 'Tesouro Direto', rentabilidade: '~100% CDI',  liquidez: 'Diária',      risco: 'Baixíssimo' },
  { ticker: 'IPCA+',  nome: 'Tesouro IPCA+',             tipo: 'Tesouro Direto', rentabilidade: 'IPCA + 6%',  liquidez: 'No vencimento', risco: 'Baixo' },
  { ticker: 'CDB100', nome: 'CDB 100% CDI',              tipo: 'CDB',            rentabilidade: '100% CDI',   liquidez: 'No vencimento', risco: 'Baixo' },
  { ticker: 'CDB120', nome: 'CDB 120% CDI',              tipo: 'CDB',            rentabilidade: '120% CDI',   liquidez: 'No vencimento', risco: 'Baixo' },
  { ticker: 'LCI90',  nome: 'LCI 90% CDI',               tipo: 'LCI',            rentabilidade: '~90% CDI',   liquidez: 'No vencimento', risco: 'Baixo' },
  { ticker: 'LCA90',  nome: 'LCA 90% CDI',               tipo: 'LCA',            rentabilidade: '~90% CDI',   liquidez: 'No vencimento', risco: 'Baixo' },
  { ticker: 'PREFIX', nome: 'Tesouro Prefixado',          tipo: 'Tesouro Direto', rentabilidade: '~12% a.a.',  liquidez: 'No vencimento', risco: 'Baixo' },
  { ticker: 'CRI',    nome: 'CRI (Cert. Recebíveis Imob.)', tipo: 'CRI',         rentabilidade: 'IPCA + 8%',  liquidez: 'Baixa',         risco: 'Moderado' },
  { ticker: 'CRA',    nome: 'CRA (Cert. Recebíveis Agro)', tipo: 'CRA',          rentabilidade: 'CDI + 2%',   liquidez: 'Baixa',         risco: 'Moderado' },
  { ticker: 'DEB',    nome: 'Debêntures Incentivadas',     tipo: 'Debênture',    rentabilidade: 'IPCA + 6%',  liquidez: 'Baixa',         risco: 'Moderado' },
]
