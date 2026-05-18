import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'XC Paragliding Routes Ölüdeniz | Cross Country Route Maps Babadağ',
  description: 'Full cross country paragliding routes from Babadağ, Ölüdeniz. Route maps, distances, landing zones, difficulty ratings and GPS waypoints.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/cross-country-flights/routes' },
}

const routes = [
  { name: 'Babadağ → Kayaköy', distance: '~25km', difficulty: 'Intermediate', time: '1.5–2h', desc: 'A classic introductory XC. Head north-east along the ridge, cross the Kaya Valley, and land in the old village area of Kayaköy. Good landable fields throughout.' },
  { name: 'Babadağ → Göcek Bay', distance: '~40km', difficulty: 'Intermediate+', time: '2.5–3h', desc: 'Fly north along the mountain chain to Göcek Bay. Stunning views over the island-dotted bay. Multiple landing options on approach.' },
  { name: 'Babadağ → Yakaköy', distance: '~60km', difficulty: 'Advanced', time: '3–4h', desc: 'A serious XC requiring consistent thermals and good navigation. Crosses varied terrain including the forested Fethiye highlands.' },
  { name: 'Babadağ → Dalyan', distance: '~80km', difficulty: 'Expert', time: '4–5h', desc: 'A long XC toward the Dalyan delta and the famous Lycian rock tombs. Requires an excellent flying day and local knowledge of the lower terrain.' },
]

export default function XCRoutesPage() {
  return (
    <>
      <PageHero title="XC Routes from Babadağ" subtitle="Cross country paragliding routes from one of Europe's finest XC sites." badge="XC Routes" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Cross Country Flights', href: '/cross-country-flights' }, { label: 'Routes' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">
          <p className="text-slate-600 leading-relaxed mb-8">Babadağ offers XC routes in multiple directions. The following are the most commonly flown routes, with difficulty ratings based on typical conditions. All ratings assume a solid intermediate skill level as a baseline.</p>
          <div className="space-y-5">
            {routes.map(r => (
              <div key={r.name} className="card p-6">
                <div className="flex flex-wrap gap-3 items-start justify-between mb-3">
                  <h3 className="font-bold text-slate-900 text-lg">{r.name}</h3>
                  <div className="flex gap-2 flex-wrap">
                    <span className="bg-sky-100 text-sky-700 text-xs font-semibold px-2.5 py-1 rounded-full">{r.distance}</span>
                    <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full">{r.difficulty}</span>
                    <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">⏱ {r.time}</span>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mt-8">
            <p className="text-amber-800 text-sm"><strong>Local Knowledge Essential:</strong> These routes are general guides. Actual flying conditions, landing zones and safe routes vary by season, time of day and weather. On your first XC flights from Babadağ, fly with a local pilot or join the weekly XC group days organised by the pilot community.</p>
          </div>
        </div>
      </section>
    </>
  )
}
