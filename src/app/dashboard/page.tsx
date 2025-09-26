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

  // --- THE DEFINITIVE FIX IS HERE ---
  // We now fetch the data in a more resilient way that doesn't crash for new users.
  
  // Fetch bot settings using .maybeSingle().
  // This is the perfect tool for this job: it returns one row OR null,
  // but it does not throw an error if no row is found.
  const { data: botSettings } = await supabase
    .from('bots')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle(); 

  // Fetch appointments. This query is already safe as it returns an array (which will be empty for a new user).
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('user_id', user.id)
    .order('appointment_time', { ascending: false });

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-800">
        Welcome to Your Dashboard
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        This is your private, secure area. View your bot&apos;s performance, configure its settings, and manage
        your subscription below.
      </p>

      <InstallationCode userId={user.id} />
      <AppointmentsList appointments={appointments} />
      <ChatbotForm initialData={botSettings} />

      <div className="mt-8 p-6 bg-white border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold">Subscription Status</h2>
        <p className="mt-2 text-gray-500">
          You are currently on the <strong>Free Trial</strong>.
        </p>
        <SubscriptionButton />
      </div>
      
      {/* We pass the (potentially null) settings to the widget.
          The widget is already designed to handle this gracefully.
      */}
      <ChatWidget settings={botSettings} botId={user.id} />
    </div>
  )
}