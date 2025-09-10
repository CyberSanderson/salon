import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import SubscriptionButton from '@/components/SubscriptionButton'
import ChatbotForm from '@/components/ChatbotForm'
import ChatWidget from '@/components/ChatWidget'
import AppointmentsList from '@/components/AppointmentsList'
import InstallationCode from '@/components/InstallationCode'

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Fetch both the bot settings AND the appointments in parallel for efficiency
  const [
    { data: botSettings },
    { data: appointments }
  ] = await Promise.all([
    supabase.from('bots').select('*').eq('user_id', user.id).single(),
    supabase.from('appointments').select('*').eq('user_id', user.id).order('appointment_time', { ascending: false })
  ]);

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-800">
        Welcome to Your Dashboard
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        This is your private, secure area. View your bot&apos;s performance, configure its settings, and manage
        your subscription below.
      </p>

      {/* The installation code snippet for the user's website */}
      <InstallationCode userId={user.id} />

      {/* The list of appointments booked by the bot */}
      <AppointmentsList appointments={appointments} />

      {/* The form for configuring the chatbot */}
      <ChatbotForm initialData={botSettings} />

      {/* The section for managing the subscription */}
      <div className="mt-8 p-6 bg-white border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold">Subscription Status</h2>
        <p className="mt-2 text-gray-500">
          You are currently on the <strong>Free Trial</strong>.
        </p>
        <SubscriptionButton />
      </div>
      
      {/* The live preview of the chat widget */}
      <ChatWidget settings={botSettings} botId={user.id} />
    </div>
  )
}