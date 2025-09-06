'use server'

import { createClient } from '@/utils/supabase/server'
// Import the admin client creator from the Supabase SSR library
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export interface AppointmentDetails {
  service: string
  appointmentDate: string
  appointmentTime: string
  customerName: string
  customerPhone?: string
}

// This function remains the same, using the standard client
export async function bookAppointment(details: AppointmentDetails) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { return { error: 'You must be logged in.' } }

  if (!details.service || !details.appointmentDate || !details.appointmentTime || !details.customerName) {
    return { error: "Missing required information." }
  }

  const fullAppointmentTime = new Date(`${details.appointmentDate}T${details.appointmentTime}:00`).toISOString()
  const { data, error } = await supabase.from('appointments').insert([{
    user_id: user.id,
    service: details.service,
    appointment_time: fullAppointmentTime,
    customer_name: details.customerName,
    customer_phone: details.customerPhone,
    status: 'booked',
  }]).select()

  if (error) {
    console.error('Error booking appointment:', details, error)
    return { error: 'Sorry, there was an error in our system while booking.' }
  }
  return { success: `Appointment successfully booked for ${details.customerName}!` }
}


// --- THIS IS THE FINAL, CORRECTED PUBLIC ACTION ---
export async function bookPublicAppointment(details: AppointmentDetails, botId: string) {
  
  // Create a new, temporary Supabase admin client using the Service Role Key.
  // This client has the power to bypass RLS policies, which is necessary for this trusted server-side action.
  const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { get: (name: string) => { return cookies().get(name)?.value } } }
  );

  if (!details.service || !details.appointmentDate || !details.appointmentTime || !details.customerName) {
    return { error: "Missing required information." }
  }

  const fullAppointmentTime = new Date(`${details.appointmentDate}T${details.appointmentTime}:00`).toISOString()

  // Use the admin client to insert the data
  const { data, error } = await supabaseAdmin.from('appointments').insert([
    {
      user_id: botId,
      service: details.service,
      appointment_time: fullAppointmentTime,
      customer_name: details.customerName,
      customer_phone: details.customerPhone,
      status: 'booked',
    },
  ]).select()

  if (error) {
    console.error('Error booking public appointment:', details, error)
    return { error: 'Sorry, there was an error in our system while booking.' }
  }

  return { success: `Appointment successfully booked for ${details.customerName}!` }
}
