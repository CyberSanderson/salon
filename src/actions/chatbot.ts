// src/actions/chatbot.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveBotSettings(formData: FormData) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const welcomeMessage = formData.get('welcomeMessage') as string
  const primaryColor = formData.get('primaryColor') as string

  const { error } = await supabase.from('bots').upsert({
    user_id: user.id, // The user's ID
    welcome_message: welcomeMessage,
    primary_color: primaryColor,
  })

  if (error) {
    console.error('Error saving bot settings:', error)
    // In a real app, you'd return a proper error message
    return { error: 'Failed to save settings.' }
  }

  // Refresh the dashboard page to show the new settings
  revalidatePath('/dashboard')
  return { success: 'Settings saved successfully!' }
}