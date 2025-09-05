import { createClient } from '@/utils/supabase/server'
import ChatWidget from '@/components/ChatWidget'

// This page will be rendered on the server
export default async function ChatEmbedPage({
  searchParams,
}: {
  searchParams: { id: string }
}) {
  const supabase = createClient()
  const botId = searchParams.id;

  if (!botId) {
    // In a real app, you might render an error message
    return null;
  }

  // Fetch the bot settings using the public ID from the URL
  // NOTE: This requires your 'bots' table to have read access for anyone.
  // We will need to set up a specific RLS policy for this.
  const { data: botSettings } = await supabase
    .from('bots')
    .select('*')
    .eq('user_id', botId) // We're using the user_id as the public bot ID
    .single()

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* The ChatWidget is designed to be 'fixed' to the viewport, which works inside the iframe.
        We pass the fetched settings to it.
      */}
      <ChatWidget settings={botSettings} />
    </div>
  )
}
