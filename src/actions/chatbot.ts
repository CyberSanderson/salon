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
  const salonName = formData.get('salon_name') as string
  const services = formData.get('services') as string
  const hours = formData.get('hours') as string

  // --- THE CRITICAL FIX IS HERE ---
  // We now tell upsert to use the 'user_id' column to handle conflicts.
  // This will correctly UPDATE the existing row instead of inserting a new one.
  const { error } = await supabase.from('bots').upsert(
    {
      user_id: user.id,
      welcome_message: welcomeMessage,
      primary_color: primaryColor,
      salon_name: salonName,
      services: services,
      hours: hours,
    },
    { onConflict: 'user_id' }
  )

  if (error) {
    console.error('Error saving bot settings:', error)
    return { error: 'Failed to save settings.' }
  }

  revalidatePath('/dashboard')
  return { success: 'Settings saved successfully!' }
}