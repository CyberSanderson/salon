'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function AffiliatePage() {
  // A placeholder link to a Google Form where affiliates can apply
  const googleFormLink = 'https://docs.google.com/forms/d/e/1FAIpQLSeNOeZJoKLPcDbxUwDfCp7KUSzzZA8XSuOVhq15MBIpFaSCzQ/viewform?usp=sharing&ouid=106585305711303122724'

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gray-50 py-20 text-center">
        <div className="container mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-6xl font-bold text-gray-800"
          >
            Partner with Ariah Desk
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-600"
          >
            Join our affiliate program and earn a recurring commission for every salon owner you refer to Ariah Desk. Help your audience grow their business while you grow your income.
          </motion.p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">
            Simple & Rewarding
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-500 mb-2">1.</div>
              <h3 className="text-2xl font-semibold mb-2">Apply to Join</h3>
              <p className="text-gray-600">
                Fill out our simple application form. We&apos;ll review it and provide you with a unique discount code to share with your audience.
              </p>
            </div>
            {/* Step 2 */}
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-500 mb-2">2.</div>
              <h3 className="text-2xl font-semibold mb-2">Share Your Code</h3>
              <p className="text-gray-600">
                Promote Ariah Desk on your blog, social media, or with your clients. Your code will give them a special discount on our Pro plan.
              </p>
            </div>
            {/* Step 3 */}
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-500 mb-2">3.</div>
              <h3 className="text-2xl font-semibold mb-2">Earn Recurring Income</h3>
              <p className="text-gray-600">
                You&apos;ll earn a **30% recurring commission** for every customer who signs up with your code, for as long as they stay subscribed.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-teal-500 py-20 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold">Ready to Partner Up?</h2>
          <p className="mt-4 text-lg text-teal-100 max-w-2xl mx-auto">
            Become an Ariah Desk partner today and start earning.
          </p>
          <a
            href={googleFormLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block px-8 py-3 bg-yellow-500 text-white font-semibold rounded-full shadow-lg hover:bg-yellow-600 transition-colors"
          >
            Apply to Become a Partner
          </a>
        </div>
      </section>
    </div>
  )
}