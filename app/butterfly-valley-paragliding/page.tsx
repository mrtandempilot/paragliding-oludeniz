import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'

export const metadata: Metadata = {
  title: 'Butterfly Valley Paragliding | Fly Over Kelebekler Vadisi',
  description: 'See Butterfly Valley from the air during your paragliding flight over Ölüdeniz. The dramatic gorge and orange cliffs are visible on clear flights from Babadağ.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/butterfly-valley-paragliding' },
}

export default function ButterflyValleyPage() {
  return (
    <>
      <PageHero title="Butterfly Valley from the Air" subtitle="The dramatic gorge of Kelebekler Vadisi — visible from altitude on your Babadağ paragliding flight." badge="Butterfly Valley" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Butterfly Valley Paragliding' }]} /></div></div>

      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Kelebekler Vadisi from 1,200 Metres</h2>
          <p className="text-slate-600 leading-relaxed mb-4">Butterfly Valley (Kelebekler Vadisi) is one of the most dramatic natural features on the Turquoise Coast. A deep gorge between sheer orange and white limestone cliffs, it drops steeply to a small, remote beach accessible only by boat or a challenging hike.</p>
          <p className="text-slate-600 leading-relaxed mb-4">From the ground, Butterfly Valley is hidden and mysterious. From a paraglider at altitude, the full scale of the gorge becomes visible — the cliffs, the narrow canyon, the tiny beach, and the valley floor carpeted with vegetation.</p>
          <p className="text-slate-600 leading-relaxed mb-8">The valley is named after the Jersey Tiger moth (Euplagia quadripunctaria), which migrates here in its thousands from June to September. In spring, the valley floor is alive with wildflowers.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="card p-6">
              <h3 className="font-bold text-slate-900 mb-4">What You See from the Air</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                {['The full gorge profile between orange limestone cliffs', 'The tiny beach at the bottom accessible only by boat', 'The wooded valley floor and stream bed', 'The dramatic coastal cliff line stretching toward Ölüdeniz', 'The open Aegean Sea beyond the valley mouth'].map(i => <li key={i} className="flex gap-2"><span className="text-orange-400 flex-shrink-0">→</span>{i}</li>)}
              </ul>
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-slate-900 mb-4">Best Season for Views</h3>
              <div className="space-y-3">
                {[
                  { season: 'Spring (Apr–May)', desc: 'Valley floor green and flowering. Butterflies beginning to arrive. Crystal clear air.' },
                  { season: 'Summer (Jun–Sep)', desc: 'Peak butterfly season. More haze some days but thermals give higher altitude for wider view.' },
                  { season: 'Autumn (Oct)', desc: 'Autumn colours in the valley. Clear air. Best overall visibility.' },
                ].map(s => <div key={s.season}><p className="font-semibold text-sm text-orange-600">{s.season}</p><p className="text-sm text-slate-600">{s.desc}</p></div>)}
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">
            <p className="text-amber-800 text-sm"><strong>Note:</strong> Butterfly Valley is visible from most standard tandem flights from the 1200m and 1700m launches. The valley appears to the east as you fly south toward the landing beach. Flight path depends on weather conditions — ask your pilot at launch.</p>
          </div>

          <Link href="/book-now" className="btn-primary">Book Your Flight <ArrowRight className="w-5 h-5" /></Link>
        </div>
      </section>
      <section className="py-16 bg-white"><div className="container-default max-w-2xl"><BookingCTA /></div></section>
    </>
  )
}
