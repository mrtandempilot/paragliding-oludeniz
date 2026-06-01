import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'South Wind Landing Babadağ | Southerly Approach Guide',
  description: 'Landing at Ölüdeniz in south wind conditions. Approach modifications, turbulence areas to avoid, and alternative landing options in southerly wind.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/babadag-guide/landing-south-wind' },
}

export default function LandingSouthWindPage() {
  return (
    <>
      <PageHero title="South Wind Landing" subtitle="Approach modifications for southerly wind conditions at the Ölüdeniz landing zone." badge="South Wind" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Babadağ Guide', href: '/babadag-guide' }, { label: 'South Wind Landing' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <p className="text-slate-600 leading-relaxed mb-8">South wind is the dominant direction at Ölüdeniz and provides the best launch conditions from Babadağ. For landing, southerly flow is generally favourable but requires a modified approach compared to light wind days.</p>

          <div className="space-y-4">
            {[
              { title: 'Standard South Wind Approach', desc: 'In moderate southerly conditions (10–20 km/h at the LZ), the standard left-hand circuit over the lagoon works well. Approach from the north-east, turn crosswind over the lagoon and turn final into the south. This is the most common approach at Ölüdeniz and the one all tandem pilots use by default.' },
              { title: 'Rotor Zone — North Shore', desc: 'In strong southerly conditions, a rotor zone develops immediately downwind of the cliffs on the north shore of the lagoon. This area — low over the water near the cliff base — can produce severe turbulence. Avoid flying below 200m AGL in this area on strong south wind days.' },
              { title: 'Afternoon Sea Breeze', desc: 'The Ölüdeniz area has a pronounced afternoon sea breeze from the south that typically kicks in between 13:00 and 15:00. This sea breeze can be very consistent and refreshing for landing but can strengthen rapidly. The transition from calm to sea breeze conditions can produce temporary turbulence at low level.' },
              { title: 'Alternative Approach — Strong South', desc: 'In very strong southerly conditions (above 25 km/h at the LZ), an alternative approach from the east along the valley axis can avoid the worst turbulence. This approach requires good local knowledge — fly it for the first time with an instructor or experienced local pilot who can talk you through it.' },
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
