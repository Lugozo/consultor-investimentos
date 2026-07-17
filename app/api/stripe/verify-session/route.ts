import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/client'

export async function POST(req: Request) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const { session_id } = await req.json()

    if (!session_id) {
      return NextResponse.json({ error: 'session_id ausente' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(session_id)

    if (session.payment_status === 'paid' && session.subscription) {
      await supabase
        .from('assinaturas')
        .upsert({
          user_id: user.id,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          status: 'active',
          updated_at: new Date().toISOString(),
        })

      return NextResponse.json({ status: 'active' })
    }

    return NextResponse.json({ status: session.payment_status })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao verificar sessão'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
