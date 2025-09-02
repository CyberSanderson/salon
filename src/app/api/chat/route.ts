// src/actions/appointments.ts
'use server'

import { createClient } from '@/utils/supabase/server'

// FIX: Ensure 'export' is here so other files can use this type
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
    console.error('Error booking appointment:', error)
    return { error: 'Sorry, there was an error booking the appointment.' }
  }

  console.log('Successfully booked appointment:', data)
  return { success: `Appointment successfully booked for ${customerName}!` }
}