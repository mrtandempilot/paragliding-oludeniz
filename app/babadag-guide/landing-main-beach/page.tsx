import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Ölüdeniz Main Beach Landing Zone | Paragliding Landing Area Guide',
  description: 'Complete guide to the Ölüdeniz main beach landing zone. Approach corridor, right of way rules, landing markers, crowd awareness and what happens after you land.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/babadag-guide/landing-main-beach' },
}

export default function LandingMainBeachPage() {
  return (
    <>
      <PageHero title="Main Beach Landing Zone" subtitle="The primary landing zone for all Babadağ paragliding flights — Ölüdeniz beach." badge="Landing Zone" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Babadağ Guide', href: '/babadag-guide' }, { label: 'Main Beach Landing' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'GPS', value: '36.5497°N 29.1164°E' },
              { label: 'Surface', value: 'Sand / grass' },
              { label: 'Size', value: 'Large — 150×80m' },
              { label: 'Daily flights', value: '200–400 in season' },
            ].map(item => (
              <div key={item.label} className="card p-4 text-center">
                <div className="text-lg font-bold text-orange-600 mb-1">{item.value}</div>
                <div className="text-slate-500 text-xs">{item.label}</div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-5">The Primary Landing Zone</h2>
          <p className="text-slate-600 leading-relaxed mb-5">The designated landing zone at Ölüdeniz is a large, flat area adjacent to the main beach. This is where the vast majority of Babadağ flights land — both tandem and solo. The area is managed by the Babadağ Association and marked with landing circles and directional indicators.</p>
          <p className="text-slate-600 leading-relaxed mb-8">As a tandem passenger, you don't need to worry about any of this — your pilot manages the entire approach and landing. This information is primarily for solo pilots planning their approach.</p>

          <div className="space-y-4 mb-8">
            {[
              { title: 'Approach Corridor', desc: 'The standard approach corridor approaches from the north-northeast, following the coastline. This keeps pilots over the sea until final approach, avoiding the crowds on the beach. Pilots join a left-hand circuit over the lagoon and turn final over the water.' },
              { title: 'Right of Way Rules', desc: 'Landing aircraft have right of way over all other airspace users. Within the circuit, standard right-of-way rules apply — lower pilots have priority. The launch coordinator monitors radio frequencies and manages congestion during peak periods.' },
              { title: 'Landing Markers', desc: 'The landing zone is marked with large X markers and wind indicators (windsocks). Land within the designated zone — landing on the public beach is not permitted and creates hazard for beach users. The zone boundary is clearly visible from the air.' },
              { title: 'After Landing', desc: 'After landing, move away from the landing zone immediately to clear the area for the next pilot. Staff are on hand to help tandem passengers with harness removal. The landing zone has a designated spectator area where friends and family can watch arrivals.' },
              { title: 'GoPro & Video Service', desc: 'Video footage recorded during your flight (if you purchased this service) is processed by the tandem pilot after landing. You\'ll typically receive your USB stick or download link within 30–60 minutes of landing.' },
            ].map(item => (
              <div key={item.title} className="card p-5">
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
