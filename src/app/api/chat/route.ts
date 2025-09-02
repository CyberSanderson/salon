'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

// FIX: Ensure this interface is exported so other files can import it
export interface AppointmentDetails {
  service: string
  appointmentTime: string
  customerName: string
  customerPhone?: string
}

export async function bookAppointment(details: AppointmentDetails) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to book an appointment.' }
  }

  const { service, appointmentTime, customerName, customerPhone } = details

  const { data, error } = await supabase
    .from('appointments')
    .insert([
      {
        user_id: user.id,
        service,
        appointment_time: appointmentTime,
        customer_name: customerName,
        customer_phone: customerPhone,
        status: 'booked',
      },
    ])
    .select()

  if (error) {
    console.error(
      'Error booking appointment. Details received:',
      details,
      'Supabase error:',
      error
    )
    return { error: 'Sorry, there was an error booking the appointment.' }
  }

  console.log('Successfully booked appointment:', data)
  return { success: `Appointment successfully booked for ${customerName}!` }
}