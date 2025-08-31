// src/actions/stripe.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';

export async function createCheckoutSession() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID) {
    throw new Error('Stripe environment variables are not configured.');
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const priceId = process.env.STRIPE_PRICE_ID;
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${baseUrl}/dashboard?payment=success`,
      cancel_url: `${baseUrl}/dashboard?payment=cancelled`,
      metadata: { supabaseUserId: user.id }, // Use the Supabase user ID
    });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    // In a real app, handle this more gracefully
    return redirect('/dashboard?error=true');
  }

  if (session?.url) {
    redirect(session.url);
  }
}