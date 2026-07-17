import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/client'

export async function POST() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    // Get or create Stripe customer
    const { data: assinatura } = await supabase
      .from('assinaturas')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle()

    let customerId = assinatura?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id },
      })
      customerId = customer.id

      await supabase.from('assinaturas').upsert({
        user_id: user.id,
        stripe_customer_id: customerId,
        status: 'free',
      }, { onConflict: 'user_id' })
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/config?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/config?checkout=canceled`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao criar checkout'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
