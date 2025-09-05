'use server'

import { createClient } from '@/utils/supabase/server'

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

  // --- NEW USAGE LIMIT LOGIC ---

  // 1. Check the user's subscription status first.
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .single()

  // 2. If the user is NOT on an active paid plan, check their usage.
  if (subscription?.status !== 'active') {
    // Calculate the start and end of the current month in UTC
    const now = new Date()
    const startOfMonth = new Date(now.getUTCFullYear(), now.getUTCMonth(), 1)
    const startOfNextMonth = new Date(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)

    // Query how many appointments this user has booked in the current month
    const { count, error: countError } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', startOfMonth.toISOString())
      .lt('created_at', startOfNextMonth.toISOString())

    if (countError) {
      console.error('Error counting appointments:', countError)
      return { error: 'Could not verify booking limit.' }
    }

    // 3. If the limit is reached, return an error.
    if (count !== null && count >= 25) {
      return { error: 'The monthly booking limit for the free plan has been reached.' }
    }
  }

  // 4. If the user has a subscription or is under the limit, proceed with booking.
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