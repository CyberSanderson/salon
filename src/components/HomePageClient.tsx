'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, Variants } from 'framer-motion'

export default function HomePageClient({ isLoggedIn }: { isLoggedIn: boolean }) {
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  }

  // Determine the correct link for the "Get Started" buttons
  const getStartedLink = isLoggedIn ? '/dashboard' : '/login'

  return (
    <>
      {/* 1. Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center text-white p-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-background.png"
            alt="Elegant salon interior"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
          >
            Never Miss a Booking Again.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-4 text-lg md:text-xl max-w-2xl text-gray-200"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
          >
            Our AI chatbot answers client questions and automatically books appointments from your social media and website, 24/7.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link href={getStartedLink} className="mt-8 inline-block px-8 py-3 bg-yellow-500 text-white font-semibold rounded-full shadow-lg hover:bg-yellow-600 transition-colors transform hover:scale-105">
                Start Your Free Trial
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Problem Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800">Tired of Late-Night DMs and Missed Calls?</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            You&apos;re a master of your craft, not a full-time admin. Every moment spent juggling messages is a moment you&apos;re not creating beauty or growing your business.
          </p>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-teal-500"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" /></svg></div>
              <h3 className="mt-4 text-xl font-semibold text-gray-800">Lost Clients</h3>
              <p className="mt-2 text-gray-500">Appointments slip away due to slow or missed replies on social media.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-teal-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg></div>
              <h3 className="mt-4 text-xl font-semibold text-gray-800">Wasted Time</h3>
              <p className="mt-2 text-gray-500">Hours are spent each week on repetitive questions and scheduling.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-teal-500"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg></div>
              <h3 className="mt-4 text-xl font-semibold text-gray-800">After-Hours Stress</h3>
              <p className="mt-2 text-gray-500">You can&apos;t switch off when booking requests come in at all hours.</p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-20 bg-gray-50"
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800">Your Salon&apos;s 24/7 Automated Receptionist</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Free up your time and watch your calendar fill itself.</p>
          <div className="mt-12 max-w-lg mx-auto">
            <Image
              src="/app-visual.png"
              alt="A demonstration of the Ariah Desk interface"
              width={400}
              height={800}
              className="rounded-lg shadow-2xl border"
            />
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800">Ready in Minutes, Results in Hours</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Getting started is as simple as 1, 2, 3.</p>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-8 bg-gray-50 rounded-lg border">
              <h3 className="text-2xl font-bold text-teal-500">01</h3>
              <h4 className="mt-2 text-xl font-semibold text-gray-800">Connect</h4>
              <p className="mt-2 text-gray-500">Link your social media accounts and website in just a few clicks.</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-lg border">
              <h3 className="text-2xl font-bold text-teal-500">02</h3>
              <h4 className="mt-2 text-xl font-semibold text-gray-800">Customize</h4>
              <p className="mt-2 text-gray-500">Tell the bot about your services, pricing, and business hours.</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-lg border">
              <h3 className="text-2xl font-bold text-teal-500">03</h3>
              <h4 className="mt-2 text-xl font-semibold text-gray-800">Launch</h4>
              <p className="mt-2 text-gray-500">Activate your bot and let it start capturing leads and bookings automatically.</p>
            </div>
          </div>
        </div>
      </motion.section>
      
      <motion.section
        id="pricing"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-20 bg-gray-50"
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800">Simple, Transparent Pricing</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Choose the plan that&apos;s right for your business. No hidden fees, ever.</p>
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="p-8 bg-white rounded-lg border shadow-md flex flex-col">
              <h3 className="text-2xl font-semibold text-gray-800">Pro</h3>
              <p className="mt-2 text-gray-500">For the DIY business owner</p>
              <p className="mt-6 text-4xl font-bold">$29<span className="text-lg font-medium text-gray-500">/mo</span></p>
              <ul className="mt-6 space-y-3 text-left flex-grow">
                 <li className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-teal-500 mr-2 flex-shrink-0"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" /></svg><span>Unlimited Chatbots</span></li>
                <li className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-teal-500 mr-2 flex-shrink-0"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" /></svg><span>Unlimited bookings/mo</span></li>
                 <li className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-teal-500 mr-2 flex-shrink-0"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" /></svg><span>Standard Support</span></li>
              </ul>
              <Link href={getStartedLink} className="mt-8 block w-full px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 text-center">Get Started</Link>
            </div>
            <div className="p-8 bg-white rounded-lg border-2 border-yellow-500 shadow-xl flex flex-col relative">
              <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2"><span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Most Popular</span></div>
              <h3 className="text-2xl font-semibold text-gray-800">Premium</h3>
              <p className="mt-2 text-yellow-600 font-semibold">Done For You Service</p>
              <p className="mt-6 text-4xl font-bold">$199<span className="text-lg font-medium text-gray-500">/mo</span></p>
              <ul className="mt-6 space-y-3 text-left flex-grow">
                 <li className="flex items-center font-semibold"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" /></svg><span>Everything in Pro, plus:</span></li>
                <li className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" /></svg><span>Full Onboarding &amp; Setup</span></li>
                 <li className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" /></svg><span>Monthly Bot Optimization</span></li>
                 <li className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" /></svg><span>VIP Priority Support</span></li>
              </ul>
              <a href="https://calendar.app.google/TFsMHWEf9CPzc7hv8" target="_blank" rel="noopener noreferrer" className="mt-8 block w-full px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors text-center">Book a Free Consultation</a>
            </div>
            <div className="p-8 bg-white rounded-lg border shadow-md flex flex-col">
              <h3 className="text-2xl font-semibold text-gray-800">Free</h3>
              <p className="mt-2 text-gray-500">To try it out</p>
              <p className="mt-6 text-4xl font-bold">$0<span className="text-lg font-medium text-gray-500">/mo</span></p>
              <ul className="mt-6 space-y-3 text-left flex-grow">
                <li className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-teal-500 mr-2 flex-shrink-0"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" /></svg><span>1 Chatbot</span></li>
                <li className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-teal-500 mr-2 flex-shrink-0"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" /></svg><span>Up to 25 bookings/mo</span></li>
              </ul>
              <button className="mt-8 w-full px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg cursor-not-allowed">Included in your trial</button>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-20 bg-teal-50"
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-white shadow-lg flex-shrink-0 overflow-hidden">
              <Image src="/sande-headshot.png" alt="Sande, Founder of Ariah Desk" width={256} height={256} className="w-full h-full object-cover" />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-bold text-gray-800">From One Business Owner to Another</h2>
              <p className="mt-4 text-lg text-gray-600">&quot;I created Ariah Desk because I saw so many talented service providers, especially in the beauty industry, overwhelmed by the administrative side of their business. My goal is to give you back your most valuable asset—your time—so you can focus on your clients and your craft.&quot;</p>
              <p className="mt-4 font-semibold text-gray-800">Sande, Founder of Ariah Desk</p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800">Loved by Salon Owners Like You</h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-gray-50 rounded-lg border text-left">
              <p className="text-gray-600">&quot;Ariah Desk has been a game-changer. I&apos;m booking more clients than ever, and I&apos;m not glued to my phone answering DMs all night.&quot;</p>
              <p className="mt-4 font-semibold text-gray-800">- Jessica L., Owner of Luxe Beauty Bar</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-lg border text-left">
              <p className="text-gray-600">&quot;The setup was surprisingly easy, and it started working almost immediately. It&apos;s the best investment I&apos;ve made for my salon this year.&quot;</p>
              <p className="mt-4 font-semibold text-gray-800">- Maria R., Owner of The Glam Room</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-lg border text-left">
              <p className="text-gray-600">&quot;I was losing clients because I couldn&apos;t reply fast enough. Now, my bot handles everything. My stress levels are way down.&quot;</p>
              <p className="mt-4 font-semibold text-gray-800">- Chloe T., Owner of City Style Salon</p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-20 bg-gray-800 text-white"
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold">Ready to Fill Your Calendar?</h2>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">Stop losing clients and start automating your bookings today. Try Ariah Desk risk-free.</p>
          <a href="/login" className="mt-8 inline-block px-8 py-3 bg-yellow-500 text-white font-semibold rounded-full shadow-lg hover:bg-yellow-600 transition-colors">Start Your Free Trial</a>
        </div>
      </motion.section>
    </>
  )
}