'use client'

// Define a type for the appointment data for type safety
type Appointment = {
  id: string;
  customer_name: string;
  service: string;
  appointment_time: string;
  status: string;
}

export default function AppointmentsList({ appointments }: { appointments: Appointment[] | null }) {
  if (!appointments || appointments.length === 0) {
    return (
      <div className="mt-8 p-6 bg-white border rounded-lg shadow-sm text-center">
        <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
        <p className="mt-4 text-gray-500">
          Your bot hasn&apos;t booked any appointments yet. Once it does, they will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-8 p-6 bg-white border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Customer Name</th>
              <th scope="col" className="px-4 py-3 font-semibold">Service</th>
              <th scope="col" className="px-4 py-3 font-semibold">Date & Time</th>
              <th scope="col" className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id} className="border-b">
                <td className="px-4 py-3">{appt.customer_name}</td>
                <td className="px-4 py-3">{appt.service}</td>
                <td className="px-4 py-3">
                  {/* Format the date to be more human-readable */}
                  {new Date(appt.appointment_time).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
                    {appt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}