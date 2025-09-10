'use server'

import { createClient } from '@/utils/supabase/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Ensure the interface is exported so other files can use it
export interface AppointmentDetails {
  service: string
  appointmentDate: string
  appointmentTime: string
  customerName: string
  customerPhone?: string
}

export async function bookAppointment(details: AppointmentDetails) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { return { error: 'You must be logged in.' } }

  if (!details.service || !details.appointmentDate || !details.appointmentTime || !details.customerName) {
    return { error: "I'm sorry, but I'm missing some required information to book the appointment. Please provide the service, date, time, and your name." }
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

export async function bookPublicAppointment(details: AppointmentDetails, botId: string) {
  const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { get: (name: string) => { return cookies().get(name)?.value } } }
  );

  if (!details.service || !details.appointmentDate || !details.appointmentTime || !details.customerName) {
    return { error: "I'm sorry, but I'm missing some required information to book the appointment. Please provide the service, date, time, and your name." }
  }
  
  const fullAppointmentTime = new Date(`${details.appointmentDate}T${details.appointmentTime}:00`).toISOString()
  const { data, error } = await supabaseAdmin.from('appointments').insert([{
    user_id: botId,
    service: details.service,
    appointment_time: fullAppointmentTime,
    customer_name: details.customerName,
    customer_phone: details.customerPhone,
    status: 'booked',
  }]).select()

  if (error) {
    console.error('Error booking public appointment:', details, error)
    return { error: 'Sorry, there was an error in our system while booking.' }
  }
  return { success: `Appointment successfully booked for ${details.customerName}!` }
}
