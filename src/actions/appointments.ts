'use server'

import { createClient } from '@/utils/supabase/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export interface AppointmentDetails {
  service: string
  appointmentDate: string
  appointmentTime: string
  customerName: string
  customerPhone?: string
  timeZone?: string
}

function toUTCISOStringLocal(dateStr: string, timeZone?: string) {
  try {
    const date = new Date(`${dateStr}T${dateStr.includes('T') ? '' : ''}${dateStr}`)
    return new Date(`${dateStr}T${dateStr.includes('T') ? '' : ''}`).toISOString()
  } catch {
    return new Date().toISOString()
  }
}

export async function bookAppointment(details: AppointmentDetails) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be logged in.' }

  if (!details.service || !details.appointmentDate || !details.appointmentTime || !details.customerName) {
    return { error: "Missing required info: service, date, time, and name." }
  }

  const localDateTime = new Date(`${details.appointmentDate}T${details.appointmentTime}:00`)
  const utcDateTime = new Date(localDateTime.getTime() - localDateTime.getTimezoneOffset() * 60000).toISOString()

  const { error } = await supabase.from('appointments').insert([{
    user_id: user.id,
    service: details.service,
    appointment_time: utcDateTime,
    appointment_time_zone: details.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    customer_name: details.customerName,
    customer_phone: details.customerPhone,
    status: 'booked',
  }])

  if (error) {
    console.error('Error booking appointment:', details, error)
    return { error: 'Error booking appointment.' }
  }

  return { success: `Appointment booked for ${details.customerName}!` }
}

export async function bookPublicAppointment(details: AppointmentDetails, botId: string) {
  const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { get: (n: string) => cookies().get(n)?.value } }
  )

  if (!details.service || !details.appointmentDate || !details.appointmentTime || !details.customerName) {
    return { error: "Missing required info: service, date, time, and name." }
  }

  const localDateTime = new Date(`${details.appointmentDate}T${details.appointmentTime}:00`)
  const utcDateTime = new Date(localDateTime.getTime() - localDateTime.getTimezoneOffset() * 60000).toISOString()

  const { error } = await supabaseAdmin.from('appointments').insert([{
    user_id: botId,
    service: details.service,
    appointment_time: utcDateTime,
    appointment_time_zone: details.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    customer_name: details.customerName,
    customer_phone: details.customerPhone,
    status: 'booked',
  }])

  if (error) {
    console.error('Error booking public appointment:', details, error)
    return { error: 'Error booking appointment.' }
  }

  return { success: `Appointment booked for ${details.customerName}!` }
}
