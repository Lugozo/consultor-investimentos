import Link from 'next/link'

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <header className="flex justify-between items-center px-4 sm:px-6 py-4 max-w-3xl mx-auto">
        <Link href="/" className="text-xl font-bold text-teal-700 tracking-tight">
          Investo
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          Política de Privacidade
        </h1>
        <p className="text-sm text-slate-500 mb-8">Última atualização: Julho de 2026</p>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">1. Introdução</h2>
            <p>
              Esta política descreve como o Investo coleta, utiliza e protege seus dados
              pessoais, em conformidade com a Lei Geral de Proteção de Dados Pessoais
              (LGPD — Lei nº 13.709/2018).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">2. Dados Coletados</h2>
            <p>Coletamos os seguintes dados fornecidos por você:</p>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>Nome (opcional, via cadastro ou Google OAuth)</li>
              <li>Email</li>
              <li>Respostas do questionário de perfil de investidor</li>
              <li>Metas financeiras cadastradas</li>
              <li>Carteiras geradas e simulações realizadas</li>
            </ul>
            <p className="mt-2">
              Não coletamos dados de navegação, localização precisa, ou informações
              financeiras reais (saldo bancário, extratos, etc).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">3. Finalidade do Tratamento</h2>
            <p>Seus dados são utilizados exclusivamente para:</p>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>Autenticação e acesso à plataforma</li>
              <li>Geração do perfil de investidor e carteiras personalizadas</li>
              <li>Cálculo de metas financeiras e simulações</li>
              <li>Melhoria dos algoritmos de recomendação</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">4. Compartilhamento de Dados</h2>
            <p>
              Seus dados não são compartilhados com terceiros. Utilizamos os seguintes
              processadores para operação do serviço:
            </p>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>
                <strong>Supabase</strong> — banco de dados e autenticação
                (servidores nos EUA, com cláusulas contratuais padrão)
              </li>
              <li>
                <strong>Vercel</strong> — hospedagem da aplicação
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">5. Cookies</h2>
            <p>
              Utilizamos apenas cookies estritamente necessários para o funcionamento
              da plataforma (sessão de autenticação via Supabase). Estes cookies são
              essenciais e não requerem consentimento nos termos da LGPD.
            </p>
            <p className="mt-2">
              Não utilizamos cookies de rastreamento, publicidade ou analytics de
              terceiros.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">6. Seus Direitos (LGPD)</h2>
            <p>
              Você tem direito a:
            </p>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>Confirmar a existência de tratamento de seus dados</li>
              <li>Acessar seus dados</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
              <li>Solicitar a exclusão de seus dados (direito ao esquecimento)</li>
              <li>Revogar o consentimento a qualquer momento</li>
              <li>Portabilidade dos dados a outro fornecedor</li>
            </ul>
            <p className="mt-2">
              Para exercer qualquer um destes direitos, envie um email para{' '}
              <a href="mailto:privacidade@investo.app.br" className="text-teal-700 hover:underline">
                privacidade@investo.app.br
              </a>
              . Responderemos em até 15 dias.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">7. Retenção e Exclusão</h2>
            <p>
              Seus dados são mantidos enquanto sua conta estiver ativa. Ao excluir sua
              conta, todos os dados são removidos permanentemente do banco de dados em
              até 30 dias.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">8. Segurança</h2>
            <p>
              Utilizamos criptografia em trânsito (HTTPS/TLS), autenticação segura via
              Supabase e Row Level Security (RLS) no banco de dados para garantir que
              cada usuário acesse apenas seus próprios dados.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">9. Contato do Encarregado (DPO)</h2>
            <p>
              O encarregado pelo tratamento de dados pessoais pode ser contatado em:{' '}
              <a href="mailto:privacidade@investo.app.br" className="text-teal-700 hover:underline">
                privacidade@investo.app.br
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
