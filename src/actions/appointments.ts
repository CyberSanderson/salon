'use server'

import { createClient } from '@/utils/supabase/server'

// Ensure the interface is exported so other files can use it
export interface AppointmentDetails {
  service: string
  appointmentDate: string // e.g., "2025-09-08"
  appointmentTime: string // e.g., "11:00"
  customerName: string
  customerPhone?: string
}

// This is the secure action for the dashboard preview
export async function bookAppointment(details: AppointmentDetails) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to book an appointment.' }
  }

  // Combine date and time into a full ISO string
  const fullAppointmentTime = new Date(`${details.appointmentDate}T${details.appointmentTime}:00`).toISOString()

  const { data, error } = await supabase.from('appointments').insert([
    {
      user_id: user.id,
      service: details.service,
      appointment_time: fullAppointmentTime,
      customer_name: details.customerName,
      customer_phone: details.customerPhone,
      status: 'booked',
    },
  ]).select()

  if (error) {
    console.error('Error booking appointment:', details, error)
    return { error: 'Sorry, there was an error booking the appointment.' }
  }

  return { success: `Appointment successfully booked for ${details.customerName}!` }
}

// This is the new public action for the embeddable widget
export async function bookPublicAppointment(details: AppointmentDetails, botId: string) {
  const supabase = createClient()

  const fullAppointmentTime = new Date(`${details.appointmentDate}T${details.appointmentTime}:00`).toISOString()

  const { data, error } = await supabase.from('appointments').insert([
    {
      user_id: botId, // Use the botId as the owner of the appointment
      service: details.service,
      appointment_time: fullAppointmentTime,
      customer_name: details.customerName,
      customer_phone: details.customerPhone,
      status: 'booked',
    },
  ]).select()

  if (error) {
    console.error('Error booking public appointment:', details, error)
    return { error: 'Sorry, there was an error booking the appointment.' }
  }

  return { success: `Appointment successfully booked for ${details.customerName}!` }
}