import { createClient } from '@/utils/supabase/server'
import ChatWidget from '@/components/ChatWidget'

// This page will be rendered on the server
export default async function ChatEmbedPage({
  searchParams,
}: {
  searchParams: { id: string }
}) {
  const supabase = createClient()
  const botId = searchParams.id

  if (!botId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error: Bot ID is missing.</p>
      </div>
    )
  }

  // Fetch the bot settings using the public ID from the URL
  const { data: botSettings, error } = await supabase
    .from('bots')
    .select('*')
    .eq('user_id', botId) // We're using the user_id as the public bot ID
    .single()

  if (error || !botSettings) {
     return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error: Could not load bot settings.</p>
      </div>
    )
  }

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Pass the botSettings AND the botId to the widget */}
      <ChatWidget settings={botSettings} botId={botId} />
    </div>
  )
}