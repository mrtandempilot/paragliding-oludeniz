import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'

export const metadata: Metadata = {
  title: 'Blue Lagoon Paragliding Ölüdeniz | Fly Over the Blue Lagoon',
  description: 'Fly over the famous Blue Lagoon of Ölüdeniz from Babadağ Mountain. The most iconic aerial view in Turkey — stunning colours, crystal water, unforgettable flight.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/blue-lagoon-paragliding' },
}

export default function BlueLagoonPage() {
  return (
    <>
      <PageHero title="Fly Over the Blue Lagoon" subtitle="The most iconic aerial view in Turkey. Turquoise, cobalt, and crystal — from 1,200 metres above." badge="Blue Lagoon" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Blue Lagoon Paragliding' }]} /></div></div>

      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">The Blue Lagoon from the Air</h2>
          <p className="text-slate-600 leading-relaxed mb-4">The Blue Lagoon (Ölüdeniz Tabiat Parkı) is one of the most photographed places in Turkey — and for good reason. The natural lagoon, separated from the open Aegean by a thin sandbar, creates a colour palette that shifts from pale mint to deep midnight blue within a few hundred metres.</p>
          <p className="text-slate-600 leading-relaxed mb-4">From the beach, it is beautiful. From 1,200–1,700 metres in a paraglider, it is extraordinary.</p>
          <p className="text-slate-600 leading-relaxed mb-8">On clear days, the water is transparent enough to see the sandy seabed patterns from altitude. The sandbar that separates the lagoon from the open sea looks like a thin white brushstroke. Butterfly Valley is visible to the east, dropping in orange cliffs to a secret beach.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { title: 'Best Views', items: ['Early morning — crystal clear air', 'Afternoon — deep blue colour', 'Sunset — golden reflections'] },
              { title: 'What You See', items: ['The Blue Lagoon from above', 'Butterfly Valley gorge', 'Ölüdeniz town and beach', 'Babadağ summit behind you'] },
              { title: 'Photo Tips', items: ['Book the pilot photo package', 'Morning light is sharpest', 'Bring phone with secure grip', 'Wide angle captures more'] },
            ].map(col => (
              <div key={col.title} className="card p-5">
                <h3 className="font-bold text-slate-900 mb-3">{col.title}</h3>
                <ul className="space-y-2">{col.items.map(i => <li key={i} className="text-sm text-slate-600 flex gap-2"><span className="text-orange-400">→</span>{i}</li>)}</ul>
              </div>
            ))}
          </div>

          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-sky-900 mb-2">🎨 The Colour Science</h3>
            <p className="text-sky-800 text-sm leading-relaxed">The extraordinary colours of the Blue Lagoon are caused by the interaction of depth, suspended sediment and light angle. The shallow areas near the sandbar appear pale turquoise. The deeper inner lagoon is cobalt. Where the lagoon meets the open sea, the water shifts to deep navy. The effect is most vivid on sunny mornings when the sun is behind you as you fly south.</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/book-now" className="btn-primary">Book a Flight Over the Lagoon <ArrowRight className="w-5 h-5" /></Link>
            <Link href="/blog/blue-lagoon-from-the-air-oludeniz" className="btn-secondary">Read Our Lagoon Article</Link>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white"><div className="container-default max-w-2xl"><BookingCTA /></div></section>
    </>
  )
}
