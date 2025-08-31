// src/app/api/stripe/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  const supabase = createClient()
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  try {
    const body = await req.text()
    const sig = req.headers.get('stripe-signature') as string
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret)

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      // Get user_id from metadata
      const userId = session.metadata?.supabaseUserId
      const stripeCustomerId = session.customer as string
      const stripeSubscriptionId = session.subscription as string

      if (!userId) {
        throw new Error('User ID not found in Stripe checkout session metadata.')
      }
      
      // Update the user's subscription in your database
      const { error } = await supabase.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        status: 'active',
      })
      
      if (error) {
        throw new Error(`Failed to update subscription in database: ${error.message}`)
      }
    }
    
    // Handle other events like subscription cancellations later

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('Webhook Error:', err.message)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }
}