import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import Script from 'next/script'
import { getLocale } from 'next-intl/server'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://paragliding-oludeniz.com'),
  title: {
    default: 'Paragliding Oludeniz | Tandem Flights from Babadağ',
    template: '%s | Paragliding Ölüdeniz',
  },
  description:
    'Book tandem paragliding flights in Oludeniz, Turkey. Launch from Babadağ at 1960m and soar over the Blue Lagoon. Certified pilots, 25+ years experience.',
  keywords: [
    'paragliding oludeniz',
    'tandem paragliding oludeniz',
    'paragliding fethiye',
    'babadag paragliding',
    'oludeniz paragliding booking',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Paragliding Oludeniz',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: { index: true, follow: true },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let locale = 'en'
  try {
    locale = await getLocale()
  } catch {
    // outside next-intl context (e.g. admin routes) -> default to en
  }
  return (
    <html lang={locale}>
      <body className={inter.className}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XDHL6LYTX0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-XDHL6LYTX0');
            gtag('config', 'AW-1048206545');
          `}
        </Script>
        <Header />
        {children}
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  )
}
