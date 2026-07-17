import { createServerSupabase } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getPlano } from '@/lib/stripe/queries'
import { stripe } from '@/lib/stripe/client'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatarDataCompleta } from '@/lib/utils/format'
import { UpgradeButton } from './upgrade-button'

export default async function ConfigPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string; session_id?: string }>
}) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const sp = await searchParams
  const checkoutStatus = sp?.checkout
  const sessionId = sp?.session_id

  // Verifica e ativa assinatura server-side
  if (checkoutStatus === 'success' && sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      if (session.payment_status === 'paid' && session.subscription) {
        await supabase.from('assinaturas').upsert({
          user_id: user.id,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          status: 'active',
          updated_at: new Date().toISOString(),
        })
        // Redireciona limpo (sem query params) pra mostrar Premium
        redirect('/config')
      }
    } catch {
      // Falha silenciosa — mostra mensagem
    }
  }

  const plano = await getPlano(user.id)
  const planoLabel = plano === 'active' ? 'Premium' : 'Free'
  const planoCor = plano === 'active' ? 'text-teal-700' : 'text-slate-500'

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>

      {checkoutStatus === 'success' && (
        <Card className="mb-6 border-green-300 bg-green-50">
          <p className="text-green-800 text-sm">
            {plano === 'active'
              ? 'Pagamento confirmado! Plano Premium ativado.'
              : 'Verificando pagamento... Recarregue se o plano não atualizar.'}
          </p>
        </Card>
      )}

      {checkoutStatus === 'canceled' && (
        <Card className="mb-6 border-slate-300 bg-slate-50">
          <p className="text-slate-600 text-sm">
            Pagamento cancelado. Você continua no plano Free.
          </p>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader><CardTitle>Conta</CardTitle></CardHeader>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Email</span>
            <span>{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Nome</span>
            <span>{user?.user_metadata?.nome ?? '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Conta criada em</span>
            <span>{user?.created_at ? formatarDataCompleta(user.created_at) : '—'}</span>
          </div>
        </div>
      </Card>

      <Card className="mb-6">
        <CardHeader><CardTitle>Plano</CardTitle></CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <p className={`font-semibold ${planoCor}`}>{planoLabel}</p>
            <p className="text-sm text-slate-500 mt-1">
              {plano === 'active' ? 'R$ 19,90/mês' : 'Gratuito — 1 carteira'}
            </p>
          </div>
          {plano !== 'active' ? <UpgradeButton /> : null}
        </div>
      </Card>

      <Card className="mb-6">
        <CardHeader><CardTitle>Perfil de Investidor</CardTitle></CardHeader>
        <p className="text-sm text-slate-500 mb-4">
          Refazer o questionário para atualizar seu perfil.
        </p>
        <Link href="/questionario">
          <Button variant="outline">Refazer Questionário</Button>
        </Link>
      </Card>

      <Card>
        <CardHeader><CardTitle>Sobre</CardTitle></CardHeader>
        <p className="text-sm text-slate-500">
          Consultor de Investimentos v1.0. Dados de mercado via Yahoo Finance e CoinGecko.
          Links de corretora com possibilidade de afiliado.
        </p>
      </Card>
    </div>
  )
}
