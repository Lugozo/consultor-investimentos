import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/client'
import type Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch {
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 400 })
  }

  const supabase = await createServerSupabase()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string

        if (customerId && subscriptionId) {
          await supabase
            .from('assinaturas')
            .update({
              stripe_subscription_id: subscriptionId,
              status: 'active',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_customer_id', customerId)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        if (customerId) {
          await supabase
            .from('assinaturas')
            .update({
              status: 'canceled',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_customer_id', customerId)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        if (customerId && subscription.status) {
          const statusMap: Record<string, string> = {
            active: 'active',
            past_due: 'past_due',
            unpaid: 'past_due',
            canceled: 'canceled',
            incomplete_expired: 'canceled',
          }

          await supabase
            .from('assinaturas')
            .update({
              status: statusMap[subscription.status] ?? subscription.status,
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_customer_id', customerId)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro no webhook'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
