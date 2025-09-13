'use client'

import { useForm, ValidationError } from '@formspree/react'
import { motion } from 'framer-motion'

export default function ContactPage() {
  // Use your new, unique Formspree ID
  const [state, handleSubmit] = useForm('mwpnzkvw')

  if (state.succeeded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-teal-500">Thank You!</h1>
          <p className="mt-4 text-lg text-gray-600">
            Your message has been sent. We&apos;ll get back to you shortly.
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800">Get in Touch</h1>
          <p className="mt-4 text-lg text-gray-600">
            Have a question or want to discuss a partnership? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 bg-gray-50 p-8 rounded-lg shadow-md">
          {/* Contact Information */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-gray-800">Contact Information</h2>
            <p className="mt-4 text-gray-600">
              For support, sales, or general inquiries, please use the form or email us directly.
            </p>
            <div className="mt-6">
              {/* --- THIS IS THE CORRECTED PART --- */}
              <a 
                href="mailto:sanderson@ariahdesk.com" 
                className="flex items-center text-gray-800 hover:text-teal-500 hover:underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-teal-500 mr-2"><path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" /><path d="M19 8.839l-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" /></svg>
                <span>sanderson@ariahdesk.com</span>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                className="w-full px-3 py-2 mt-1 border rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                className="w-full px-3 py-2 mt-1 border rounded-md"
                required
              />
              <ValidationError
                prefix="Email"
                field="email"
                errors={state.errors}
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full px-3 py-2 mt-1 border rounded-md"
                required
              ></textarea>
              <ValidationError
                prefix="Message"
                field="message"
                errors={state.errors}
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={state.submitting}
                className="w-full px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 disabled:bg-gray-400"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
