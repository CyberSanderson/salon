'use client'

import { useTransition } from 'react'
import { createCheckoutSession } from '@/actions/stripe'

export default function SubscriptionButton() {
  const [isPending, startTransition] = useTransition()

  const handleSubscribeClick = () => {
    startTransition(async () => {
      const result = await createCheckoutSession();

      // Check if the server action returned an error
      if (result.error) {
        alert(result.error);
      } 
      // Check if the server action returned a success URL
      else if (result.url) {
        // Perform a standard browser redirect to the Stripe page
        window.location.href = result.url;
      }
    });
  };

  return (
    <button
      onClick={handleSubscribeClick}
      disabled={isPending}
      className="mt-4 bg-yellow-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-yellow-600 transition-colors shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {isPending ? 'Redirecting to payment...' : 'Manage Subscription'}
    </button>
  );
}
