import { createClient } from '@/utils/supabase/server'
import ChatWidget from '@/components/ChatWidget'
import { notFound } from 'next/navigation'

export default async function BookingPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = createClient()
  const botId = params.slug;

  if (!botId) {
    return notFound();
  }

  // Fetch the bot settings using the public ID from the URL.
  // This requires the 'bots' table to have a public read policy.
  const { data: botSettings, error } = await supabase
    .from('bots')
    .select('*')
    .eq('user_id', botId)
    .single()

  if (error || !botSettings) {
     return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 font-semibold">Error: This booking page could not be found.</p>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen overflow-hidden">
      {/* We pass both the bot's settings and its unique ID to the widget.
        The ChatWidget will see the botId and automatically open in its full-screen view.
      */}
      <ChatWidget settings={botSettings} botId={botId} />
    </div>
  )
}

