'use server'

import { createClient } from '@/utils/supabase/server'

// The new, simpler interface for our tool
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
  const fullAppointmentTime = new Date(`${details.appointmentDate}T${details.appointmentTime}:00`).toISOString();

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

// --- NEW PUBLIC ACTION ---
export async function bookPublicAppointment(details: AppointmentDetails, botId: string) {
  const supabase = createClient()

  // Combine date and time into a full ISO string
  const fullAppointmentTime = new Date(`${details.appointmentDate}T${details.appointmentTime}:00`).toISOString();

  const { data, error } = await supabase.from('appointments').insert([
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
    return { error: 'Sorry, there was an error booking the appointment.' }
  }

  return { success: `Appointment successfully booked for ${details.customerName}!` }
}