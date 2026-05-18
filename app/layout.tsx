import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://paragliding-oludeniz.com'),
  title: {
    default: 'Paragliding Ölüdeniz | Tandem Flights from Babadağ Mountain',
    template: '%s | Paragliding Ölüdeniz',
  },
  description:
    'Experience world-class tandem paragliding in Ölüdeniz, Turkey. Fly over the Blue Lagoon from Babadağ Mountain. Book your flight today — safe, certified, unforgettable.',
  keywords: [
    'paragliding oludeniz',
    'tandem paragliding turkey',
    'babadag paragliding',
    'oludeniz blue lagoon',
    'paragliding fethiye',
  ],
  authors: [{ name: 'Paragliding Ölüdeniz' }],
  creator: 'Paragliding Ölüdeniz',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://paragliding-oludeniz.com',
    siteName: 'Paragliding Ölüdeniz',
    title: 'Paragliding Ölüdeniz | Tandem Flights from Babadağ Mountain',
    description:
      'Experience world-class tandem paragliding in Ölüdeniz, Turkey. Fly over the Blue Lagoon from Babadağ Mountain.',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Paragliding over the Blue Lagoon in Ölüdeniz, Turkey',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paragliding Ölüdeniz | Tandem Flights from Babadağ Mountain',
    description:
      'Experience world-class tandem paragliding in Ölüdeniz, Turkey. Fly over the Blue Lagoon from Babadağ Mountain.',
    images: ['/images/og-default.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
