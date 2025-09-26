'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function AboutPage() {
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
            Our Mission is to Give You Back Your Time
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-600"
          >
            Ariah Desk was born from a simple observation: talented beauty professionals are spending more time managing their schedule than perfecting their craft. We&apos;re here to change that.
          </motion.p>
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
              className="w-full md:w-1/2"
            >
              <Image
                src="/sanderson.png"
                alt="Sande, Founder of Ariah Desk"
                width={500}
                height={500}
                className="rounded-lg shadow-2xl object-cover"
              />
            </motion.div>
            <div className="w-full md:w-1/2 text-left">
              <h2 className="text-4xl font-bold text-gray-800">The Story Behind the Desk</h2>
              <p className="mt-4 text-lg text-gray-600">
                My name is Sande, and I&apos;m the founder of Ariah Desk. I created this company because I saw firsthand how many brilliant salon owners and stylists were getting bogged down by the endless administrative tasks that come with running a business. Late-night DMs, missed calls, and the constant back-and-forth of scheduling were stealing their time and their passion.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                I knew there had to be a better way. With a background in full-stack development from Harvard, I decided to build a solution. Not just another generic tool, but a smart, elegant, and intuitive AI assistant designed specifically for the unique needs of the beauty industry.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                Our mission is simple: to handle your front desk, so you can get back to doing what you love.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-teal-500 py-20 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold">Ready to Reclaim Your Time?</h2>
          <p className="mt-4 text-lg text-teal-100 max-w-2xl mx-auto">
            See how Ariah Desk can transform your business. Check out our pricing and start your free trial today.
          </p>
          <Link
            href="/#pricing"
            className="mt-8 inline-block px-8 py-3 bg-yellow-500 text-white font-semibold rounded-full shadow-lg hover:bg-yellow-600 transition-colors"
          >
            View Pricing Plans
          </Link>
        </div>
      </section>
    </div>
  )
}