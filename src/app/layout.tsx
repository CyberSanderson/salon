// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer'
import Header from '@/components/Header' // 1. Import Header

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>
        <Header /> {/* 2. Add Header */}
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}