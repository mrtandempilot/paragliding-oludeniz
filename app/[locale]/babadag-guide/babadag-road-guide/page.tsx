import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Babadağ Road Guide | How to Drive to Babadağ Launch Ölüdeniz',
  description: 'How to drive to Babadağ paragliding launch by road. Route directions, road conditions, parking, minibus options and driving tips for the mountain road.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/babadag-guide/babadag-road-guide' },
}

export default function BabadagRoadGuidePage() {
  return (
    <>
      <PageHero title="Babadağ Road Guide" subtitle="How to reach the Babadağ launch area by road — driving directions, minibus and parking." badge="Road Access" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Babadağ Guide', href: '/babadag-guide' }, { label: 'Road Guide' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Drive from Ölüdeniz', value: '~25 min' },
              { label: 'Drive from Fethiye', value: '~35 min' },
              { label: 'Road quality', value: 'Paved, steep' },
              { label: 'Parking at top', value: 'Limited' },
            ].map(item => (
              <div key={item.label} className="card p-4 text-center">
                <div className="text-xl font-bold text-orange-600 mb-1">{item.value}</div>
                <div className="text-slate-500 text-xs">{item.label}</div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-5">The Mountain Road</h2>
          <p className="text-slate-600 leading-relaxed mb-5">The Babadağ mountain road is a narrow, paved mountain road that winds steeply from the base of the mountain to the 1700m launch plateau. The drive is scenic but requires care — the road is single-track in sections with passing places, and the hairpin bends require slow, careful driving.</p>
          <p className="text-slate-600 leading-relaxed mb-8">For most tandem paragliding visitors, the minibus (included in your tandem package) is the recommended option. For solo pilots or those with their own equipment, private vehicle access is possible.</p>

          <div className="space-y-4 mb-10">
            {[
              { title: 'Route from Ölüdeniz', desc: 'From Ölüdeniz beach, head east toward Hisarönü. At the Hisarönü junction, follow signs for Babadağ. The mountain road begins after Ovacık. The road climbs steeply with multiple hairpin bends. Allow 25–30 minutes from Ölüdeniz to the 1700m car park in normal conditions.' },
              { title: 'Route from Fethiye', desc: 'From Fethiye, take the main road toward Ölüdeniz (D400/D625). Pass through Hisarönü following Babadağ signs. The drive from Fethiye to the launch takes approximately 35–40 minutes. SatNav will generally take you correctly — search for "Babadağ Teleferik" or "Babadağ Yamaç Paraşütü".' },
              { title: 'Road Conditions', desc: 'The road surface is paved throughout but narrow. In wet conditions (rare in summer) the surface can be slippery. The steepest sections have gradients of 15–18%. A standard car handles the road comfortably in dry conditions. High ground clearance is not required.' },
              { title: 'Parking at the Top', desc: 'There is limited parking at the 1700m launch area. In peak season (July–August), the car park fills early. Arrive before 09:00 to guarantee parking. Later arrivals may need to park lower on the mountain and walk the final section.' },
              { title: 'Minibus (Önerilir / Recommended)', desc: 'Most tandem operators include minibus transport to the launch as part of their package. The Babadağ Association also runs minibus services from the cable car base station to the 1700m launch — useful for pilots who take the teleferik up and need transport between levels.' },
            ].map(item => (
              <div key={item.title} className="card p-5">
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <h3 className="font-bold text-slate-900 mb-2">Driving Tips</h3>
            <ul className="space-y-2 text-sm text-amber-800">
              <li>• Use low gear on the descent — do not ride the brakes continuously on steep sections</li>
              <li>• Uphill traffic has priority on single-track sections</li>
              <li>• Sound your horn before blind hairpin bends</li>
              <li>• The road is closed to vehicles after dark — ensure you descend before sunset</li>
              <li>• Motorcycles and scooters can navigate the road but require experience on mountain roads</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
