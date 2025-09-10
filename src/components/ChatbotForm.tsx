'use client'

import { saveBotSettings } from '@/actions/chatbot'
import { useState } from 'react'

type BotSettings = {
  welcome_message?: string
  primary_color?: string
  salon_name?: string
  services?: string
  hours?: string
}

export default function ChatbotForm({
  initialData,
}: {
  initialData: BotSettings | null
}) {
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const result = await saveBotSettings(formData)

    if (result.error) {
      setMessage(`Error: ${result.error}`)
    } else {
      setMessage('Success! Your settings have been saved.')
    }

    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 p-6 bg-white border rounded-lg shadow-sm space-y-4"
    >
      <h2 className="text-xl font-semibold">Chatbot Settings</h2>
      
      <div>
        <label htmlFor="salon_name" className="block text-sm font-medium text-gray-700">Salon Name</label>
        <input
          id="salon_name"
          name="salon_name"
          type="text"
          defaultValue={initialData?.salon_name || ''}
          className="w-full px-3 py-2 mt-1 border rounded-md"
          placeholder="e.g., Luxe Beauty Bar"
        />
      </div>

      <div>
        <label htmlFor="welcomeMessage" className="block text-sm font-medium text-gray-700">Welcome Message</label>
        <textarea
          id="welcomeMessage"
          name="welcomeMessage"
          defaultValue={initialData?.welcome_message || ''}
          rows={3}
          className="w-full px-3 py-2 mt-1 border rounded-md"
          placeholder="Hi there! How can I help you book an appointment today?"
        />
      </div>

       <div>
        <label htmlFor="services" className="block text-sm font-medium text-gray-700">Services & Pricing (one per line)</label>
        <textarea
          id="services"
          name="services"
          defaultValue={initialData?.services || ''}
          rows={5}
          className="w-full px-3 py-2 mt-1 border rounded-md"
          placeholder="e.g., Haircut: $50&#10;Coloring: $120&#10;Manicure: $35"
        />
      </div>

       <div>
        <label htmlFor="hours" className="block text-sm font-medium text-gray-700">Business Hours</label>
        <textarea
          id="hours"
          name="hours"
          defaultValue={initialData?.hours || ''}
          rows={3}
          className="w-full px-3 py-2 mt-1 border rounded-md"
          placeholder="e.g., Monday-Friday: 9am - 7pm&#10;Saturday: 10am - 5pm"
        />
      </div>

      <div>
        <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">Chat Widget Color</label>
        <input
          id="primaryColor"
          name="primaryColor"
          type="color"
          defaultValue={initialData?.primary_color || '#000000'}
          className="mt-1 h-10 w-full"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          className="px-5 py-2 font-semibold text-white bg-teal-500 rounded-md hover:bg-teal-600"
        >
          Save Settings
        </button>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </div>
    </form>
  )
}
