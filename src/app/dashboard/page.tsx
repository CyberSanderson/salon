import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import SubscriptionButton from '@/components/SubscriptionButton'
import ChatbotForm from '@/components/ChatbotForm'
import ChatWidget from '@/components/ChatWidget'

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: botSettings } = await supabase
    .from('bots')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-800">
        Welcome to Your Dashboard
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        This is your private, secure area. Configure your chatbot and manage
        your subscription below.
      </p>

      <ChatbotForm initialData={botSettings} />

      <div className="mt-8 p-6 bg-white border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold">Subscription Status</h2>
        <p className="mt-2 text-gray-500">
          You are currently on the <strong>Free Trial</strong>.
        </p>
        <SubscriptionButton />
      </div>
      
      {/* Pass the bot settings to the widget */}
      <ChatWidget settings={botSettings} />
    </div>
  )
}