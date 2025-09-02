// src/actions/appointments.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

// Define a type for the data we expect
interface AppointmentDetails {
  service: string
  appointmentTime: string // We'll receive this as an ISO string (e.g., "2025-09-10T11:00:00.000Z")
  customerName: string
  customerPhone?: string
}

export async function bookAppointment(details: AppointmentDetails) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // This should ideally not be hit if the API route is secure, but it's good practice
    return { error: 'You must be logged in to book an appointment.' }
  }

  const { service, appointmentTime, customerName, customerPhone } = details

  // Insert the new appointment into the database
  const { data, error } = await supabase
    .from('appointments')
    .insert([
      {
        user_id: user.id, // The ID of the salon owner
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