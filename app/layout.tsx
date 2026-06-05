import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://paragliding-oludeniz.com'),
  title: {
    default: 'Paragliding Oludeniz | Tandem Flights from Babadağ',
    template: '%s',
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
    url: 'https://paragliding-oludeniz.com',
    siteName: 'Paragliding Oludeniz',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paragliding Oludeniz | Tandem Flights from Babadağ',
    description: 'Soar over the Blue Lagoon. Book your tandem paragliding flight today.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
          `}
        </Script>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
