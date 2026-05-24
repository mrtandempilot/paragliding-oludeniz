import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://paragliding-oludeniz.com'),
  title: {
    default: 'Paragliding Oludeniz | Tandem Flights from Babadağ',
    template: '%s | Paragliding Oludeniz',
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
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Tandem Paragliding Oludeniz' }],
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
      <body className={inter.className}>{children}</body>
    </html>
  )
}
