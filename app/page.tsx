import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-white">
      {/* Header */}
      <header className="flex justify-between items-center px-4 sm:px-6 py-4 max-w-6xl mx-auto">
        <span className="text-xl font-bold text-teal-700 tracking-tight">Investo</span>
        <Link href="/login">
          <Button variant="outline">Entrar</Button>
        </Link>
      </header>

      {/* Hero */}
      <main className="max-w-3xl mx-auto text-center px-4 sm:px-6 pt-16 sm:pt-24 pb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
          Sua carteira de investimentos{' '}
          <span className="text-teal-700">sob medida</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 mb-10 max-w-xl mx-auto leading-relaxed">
          Descubra seu perfil de investidor, monte carteiras personalizadas com
          ativos reais e invista com confiança. Tudo baseado em dados do mercado.
        </p>
        <Link href="/cadastro">
          <Button size="lg" className="px-8 py-3 text-base">
            Começar Gratuitamente
          </Button>
        </Link>

        {/* Features */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-3 mt-20 sm:mt-24">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-700">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <path d="M9 14l2 2 4-4" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Questionário Inteligente</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Responda 10 perguntas e descubra seu perfil de investidor com precisão.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-700">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Carteira Personalizada</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Alocação automática com ativos reais baseada no seu perfil e objetivos.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-700">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Acompanhe Tudo</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Dashboard completo, simulações &quot;E se?&quot; e alertas de rebalanceamento.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-center text-sm text-slate-400">
          <p>
            © {new Date().getFullYear()} Investo. Ferramenta educacional — não é recomendação de investimento.
          </p>
        </div>
      </footer>
    </div>
  )
}
