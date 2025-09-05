'use server'

import { createClient } from '@/utils/supabase/server'

export interface AppointmentDetails {
  service: string
  appointmentDate: string
  appointmentTime: string
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

  // --- NEW VALIDATION SAFETY NET ---
  if (!details.service || !details.appointmentDate || !details.appointmentTime || !details.customerName) {
    return { error: "I'm sorry, but I'm missing some required information to book the appointment. Please provide the service, date, time, and your name." }
  }

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
    return { error: 'Sorry, there was an error in our system while booking.' }
  }

  return { success: `Appointment successfully booked for ${details.customerName}!` }
}

// This is the public action for the embeddable widget
export async function bookPublicAppointment(details: AppointmentDetails, botId: string) {
  const supabase = createClient()

  // --- NEW VALIDATION SAFETY NET ---
  if (!details.service || !details.appointmentDate || !details.appointmentTime || !details.customerName) {
    return { error: "I'm sorry, but I'm missing some required information to book the appointment. Please provide the service, date, time, and your name." }
  }

  const fullAppointmentTime = new Date(`${details.appointmentDate}T${details.appointmentTime}:00`).toISOString()

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
    return { error: 'Sorry, there was an error in our system while booking.' }
  }

  return { success: `Appointment successfully booked for ${details.customerName}!` }
}