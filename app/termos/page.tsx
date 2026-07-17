import Link from 'next/link'

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <header className="flex justify-between items-center px-4 sm:px-6 py-4 max-w-3xl mx-auto">
        <Link href="/" className="text-xl font-bold text-teal-700 tracking-tight">
          Investo
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Termos de Uso</h1>
        <p className="text-sm text-slate-500 mb-8">Última atualização: Julho de 2026</p>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">1. Aceitação dos Termos</h2>
            <p>
              Ao utilizar o Investo, você concorda com estes Termos de Uso. Se não concordar,
              não utilize o serviço. O Investo é uma ferramenta educacional e não constitui
              consultoria financeira regulamentada.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">2. Natureza do Serviço</h2>
            <p>
              O Investo é uma ferramenta de auxílio educacional para investidores. As análises,
              alocações sugeridas e carteiras geradas são baseadas em algoritmos e dados de
              mercado públicos, e NÃO constituem recomendação de investimento nos termos da
              Resolução CVM nº 179.
            </p>
            <p className="mt-2">
              O Investo não é registrado na Comissão de Valores Mobiliários (CVM) como
              consultor de valores mobiliários. As informações fornecidas não devem ser
              interpretadas como aconselhamento financeiro, jurídico ou fiscal.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">3. Responsabilidade do Usuário</h2>
            <p>
              Toda decisão de investimento é de exclusiva responsabilidade do usuário.
              O Investo não se responsabiliza por perdas financeiras decorrentes do uso
              das informações disponibilizadas. Recomendamos consultar um profissional
              certificado antes de tomar decisões de investimento.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">4. Dados de Mercado</h2>
            <p>
              Os dados de mercado são obtidos de fontes públicas (Yahoo Finance e CoinGecko)
              e podem apresentar atraso de até 15 minutos. O Investo não garante a precisão,
              integridade ou atualidade dos dados exibidos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">5. Links de Afiliado</h2>
            <p>
              Os links para corretoras (XP, Rico, Clear, BTG, Binance, Mercado Bitcoin)
              podem conter códigos de afiliado. O Investo pode receber comissão por
              cadastros realizados através destes links, sem custo adicional para o usuário.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">6. Conta do Usuário</h2>
            <p>
              O usuário é responsável por manter a confidencialidade de suas credenciais.
              O Investo reserva-se o direito de suspender contas que violem estes termos
              ou utilizem o serviço de forma abusiva.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">7. Modificações</h2>
            <p>
              Estes termos podem ser alterados a qualquer momento. Alterações significativas
              serão comunicadas por email. O uso continuado do serviço após alterações
              constitui aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">8. Contato</h2>
            <p>
              Dúvidas sobre estes termos? Entre em contato pelo email:{' '}
              <a href="mailto:contato@investo.app.br" className="text-teal-700 hover:underline">
                contato@investo.app.br
              </a>
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200">
          <Link href="/" className="text-sm text-teal-700 hover:underline">
            ← Voltar para o início
          </Link>
        </div>
      </main>
    </div>
  )
}
