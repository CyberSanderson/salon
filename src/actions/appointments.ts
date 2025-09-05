'use server'

import { createClient } from '@/utils/supabase/server'

// Ensure the interface is exported so other files can use it
export interface AppointmentDetails {
  service: string
  appointmentTime: string
  customerName: string
  customerPhone?: string
}

// This is the secure action used by the authenticated dashboard preview.
// It relies on the user's active session.
export async function bookAppointment(details: AppointmentDetails) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to book an appointment.' }
  }

  const { data, error } = await supabase
    .from('appointments')
    .insert([
      {
        user_id: user.id,
        ...details,
        status: 'booked',
      },
    ])
    .select()

  if (error) {
    console.error(
      'Error booking appointment:',
      details,
      'Supabase error:',
      error
    )
    return { error: 'Sorry, there was an error booking the appointment.' }
  }

  console.log('Successfully booked appointment:', data)
  return { success: `Appointment successfully booked for ${details.customerName}!` }
}

// --- NEW PUBLIC ACTION ---
// This action is for the public widget. It's called by the chat action
// and uses the botId to associate the appointment with the correct salon owner.
export async function bookPublicAppointment(
  details: AppointmentDetails,
  botId: string
) {
  // We use the standard server client here. A more advanced setup might use a
  // service_role key to bypass RLS, but for now, we'll rely on the RLS policies.
  const supabase = createClient()

  const { data, error } = await supabase
    .from('appointments')
    .insert([
      {
        user_id: botId, // Use the botId as the owner of the appointment
        ...details,
        status: 'booked',
      },
    ])
    .select()

  if (error) {
    console.error(
      'Error booking public appointment:',
      details,
      'Supabase error:',
      error
    )
    return { error: 'Sorry, there was an error booking the appointment.' }
  }
  
  console.log('Successfully booked public appointment:', data)
  return { success: `Appointment successfully booked for ${details.customerName}!` }
}