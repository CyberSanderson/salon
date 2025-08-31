import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Header() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const signOut = async () => {
    'use server'

    const supabase = createClient()
    await supabase.auth.signOut()
    return redirect('/login')
  }

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Local Lead Bot
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-teal-500">
                Dashboard
              </Link>
              <form action={signOut}>
                <button className="bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
