import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Wind Directions Babadağ | Paragliding Wind Guide Ölüdeniz',
  description: 'How different wind directions affect paragliding at Babadağ and Ölüdeniz. South, north, east and west winds — when it is flyable and when operations are suspended.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/weather-guide/wind-directions' },
}

const winds = [
  { dir: 'South (S) / South-East (SE)', rating: 'Ideal', emoji: '✅', desc: 'The dominant and preferred wind direction at Babadağ. The main launch faces south-southeast, so a southerly wind blows directly into the slope. Steady southerly flow of 10–25 km/h produces perfect launch conditions. The majority of all flights take place in south to south-east wind. The sea breeze from the Fethiye Bay is typically from the south.' },
  { dir: 'North (N) / North-East (NE)', rating: 'Challenging', emoji: '⚠️', desc: 'Northerly wind is a tailwind for the main south-facing launch — this is problematic. Pilots must use reverse launch technique, which is more complex. Northerly flow above 15 km/h typically suspends operations at the 1700m launch. The north face of the mountain sometimes has usable launches in northerly conditions for very experienced pilots only.' },
  { dir: 'West (W) / South-West (SW)', rating: 'Moderate', emoji: '🟡', desc: 'Westerly winds are a crosswind to the main launch. The launch is still usable in light to moderate westerly flow (up to 20 km/h) but requires a sideways launch angle. A south-westerly component is often combined with the afternoon sea breeze and is generally manageable. Strong westerlies (above 30 km/h) lead to launch suspension.' },
  { dir: 'East (E) / North-East (NE)', rating: 'Difficult', emoji: '⚠️', desc: 'East wind is unusual at Ölüdeniz but can occur. A light easterly component can be combined with thermals and is manageable. A strong easterly wind at launch level makes conditions complex — it interacts with the south-facing terrain in unpredictable ways. Most operators will postpone flights in sustained easterly flow above 20 km/h.' },
  { dir: 'Meltemi (N — Regional Scale)', rating: 'Seasonal factor', emoji: 'ℹ️', desc: 'The Meltemi is the strong northerly or north-westerly trade wind that affects the eastern Mediterranean from June to September. At Ölüdeniz it manifests primarily as afternoon sea breeze reinforcement from the south (as the valley channelling rotates the flow). Direct Meltemi conditions rarely close Babadağ operations but can significantly strengthen the afternoon sea breeze at the landing zone.' },
]

export default function WindDirectionsPage() {
  return (
    <>
      <PageHero title="Wind Directions at Babadağ" subtitle="How south, north, east and west winds affect paragliding conditions at Ölüdeniz." badge="Wind Guide" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Weather Guide', href: '/weather-guide' }, { label: 'Wind Directions' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <p className="text-slate-600 leading-relaxed mb-8">Wind direction is one of the primary factors that determines whether flights operate at Babadağ each day. The mountain's south-facing orientation means that conditions are optimal in southerly and south-easterly flow — the most common wind direction during the flying season.</p>
          <div className="space-y-5">
            {winds.map(w => (
              <div key={w.dir} className="card p-5">
                <div className="flex flex-wrap gap-2 items-center mb-3">
                  <span className="text-xl">{w.emoji}</span>
                  <h3 className="font-bold text-slate-900">{w.dir}</h3>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${w.rating === 'Ideal' ? 'bg-green-100 text-green-700' : w.rating === 'Moderate' ? 'bg-yellow-100 text-yellow-700' : w.rating === 'Seasonal factor' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>{w.rating}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
