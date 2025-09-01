import type { Metadata } from 'next'
import { Poppins } from 'next/font/google' // 1. Import Poppins
import './globals.css'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

// 2. Configure the font
const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '600', '700'] 
})

export const metadata: Metadata = {
  title: 'Local Lead Bot',
  description: 'Automated appointment booking for salon owners.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}> {/* 3. Apply the font */}
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}