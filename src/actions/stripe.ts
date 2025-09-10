'use server'

import { createClient } from '@/utils/supabase/server'
import Stripe from 'stripe'

// Define the shape of the data this action will return
type ActionResponse = {
  url?: string;
  error?: string;
}

export async function createCheckoutSession(): Promise<ActionResponse> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to subscribe.' }
  }

  if (
    !process.env.STRIPE_SECRET_KEY ||
    !process.env.STRIPE_PRICE_ID ||
    !process.env.NEXT_PUBLIC_APP_URL
  ) {
    return { error: 'Stripe or App URL environment variables are not configured.' }
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const priceId = process.env.STRIPE_PRICE_ID
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${baseUrl}/dashboard?payment=success`,
      cancel_url: `${baseUrl}/dashboard?payment=cancelled`,
      metadata: { supabaseUserId: user.id },
    })

    if (session.url) {
      // On success, simply return the URL to the client
      return { url: session.url }
    } else {
      return { error: 'Failed to create Stripe session URL.' }
    }
  } catch (error) {
    console.error('Error creating Stripe session:', error)
    return { error: 'Failed to create Stripe session.' }
  }
}
