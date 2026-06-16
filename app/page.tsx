import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <header className="flex justify-between items-center px-6 py-4 max-w-6xl mx-auto">
        <span className="text-xl font-bold text-teal-700">Investo</span>
        <Link href="/login">
          <Button variant="outline">Entrar</Button>
        </Link>
      </header>

      <main className="max-w-3xl mx-auto text-center px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
          Sua carteira de investimentos sob medida
        </h1>
        <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto">
          Descubra seu perfil de investidor, monte carteiras personalizadas e
          invista com confiança. Tudo baseado em dados reais do mercado.
        </p>
        <Link href="/cadastro">
          <Button size="lg">Começar Gratuitamente</Button>
        </Link>

        <div className="grid gap-8 md:grid-cols-3 mt-20">
          <div className="text-center">
            <div className="text-3xl mb-3">📋</div>
            <h3 className="font-semibold mb-2">Questionário Inteligente</h3>
            <p className="text-sm text-slate-500">
              Responda 10 perguntas e descubra seu perfil de investidor.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold mb-2">Carteira Personalizada</h3>
            <p className="text-sm text-slate-500">
              Alocação automática baseada no seu perfil e objetivos.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold mb-2">Acompanhe Tudo</h3>
            <p className="text-sm text-slate-500">
              Dashboard completo, simulações e alertas de rebalanceamento.
            </p>
          </div>
        </div>
      </main>

      <footer className="text-center text-sm text-slate-400 py-8">
        © {new Date().getFullYear()} Investo. Dados de mercado podem ter atraso.
      </footer>
    </div>
  )
}
