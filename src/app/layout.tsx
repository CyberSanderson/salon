import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Footer from '@/components/footer'
import Header from '@/components/Header'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Ariah Desk',
  description: 'Automated appointment booking for salon owners.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1441828204616933&ev=PageView&noscript=1"
            alt="" // FIX: Added empty alt tag for accessibility
          />
        </noscript>

        <Header />
        <main>{children}</main>
        <Footer />

        {/* Google Analytics Scripts */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-J6VV76BZ4W"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-J6VV76BZ4W');
          `}
        </Script>

        {/* Meta Pixel Script */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1441828204616933');
            fbq('track', 'PageView');
          `}
        </Script>
      </body>
    </html>
  )
}
