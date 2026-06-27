import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found | Atmos Paragliding',
  robots: { index: false, follow: true },
}

const popularPages = [
  { label: 'Book Your Flight', href: '/book-now', emoji: '🪂' },
  { label: 'Prices', href: '/prices', emoji: '💶' },
  { label: 'Tandem Paragliding', href: '/tandem-paragliding', emoji: '🌄' },
  { label: 'Babadağ Guide', href: '/babadag-guide', emoji: '🏔️' },
  { label: 'Weather Guide', href: '/weather-guide', emoji: '🌤️' },
  { label: 'Blog', href: '/blog', emoji: '📝' },
]

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-900 via-sky-700 to-sky-500 flex items-center justify-center px-4 pt-24 pb-16">
      <div className="max-w-xl w-full text-center text-white">
        <div className="text-7xl mb-6">🪂</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">404 — Lost in the Clouds</h1>
        <p className="text-lg text-sky-100 mb-10">
          This page drifted away over the Blue Lagoon. Let&apos;s get you back to a safe landing zone.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
          {popularPages.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl px-4 py-3 text-sm font-medium transition-colors"
            >
              <span className="block text-2xl mb-1">{p.emoji}</span>
              {p.label}
            </Link>
          ))}
        </div>
        <Link
          href="/"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Back to Homepage
        </Link>
      </div>
    </main>
  )
}
