'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [supabase.auth])

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/">
          <Image
            src="/icon.png" // Path to your new logo in the public folder
            alt="Ariah Desk Logo"
            width={140} // Increased width for the new design
            height={50}  // Increased height for the new design
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#pricing" className="text-gray-600 hover:text-teal-500">
            Pricing
          </Link>
          <Link href="/blog" className="text-gray-600 hover:text-teal-500">
            Blog
          </Link>
        </nav>

        {/* Auth Buttons & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          {!loading && (
            <>
              {user ? (
                <div className="hidden md:flex items-center gap-4">
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-teal-500"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={signOut}
                    className="bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:block bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
                >
                  Login
                </Link>
              )}
            </>
          )}

          {/* Mobile Menu Button (Hamburger) */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="flex flex-col items-center gap-4 p-4">
            <Link
              href="/#pricing"
              className="text-gray-600 hover:text-teal-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/blog"
              className="text-gray-600 hover:text-teal-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-gray-600 hover:text-teal-500"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={signOut}
                      className="w-full bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="w-full text-center bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}