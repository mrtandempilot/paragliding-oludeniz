import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Thermal Map Babadağ Ölüdeniz | Best Thermal Locations for XC Flying',
  description: 'Interactive thermal guide for Babadağ and the Fethiye region. Best thermal trigger points, altitude bands, time of day guide and reading the sky.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/cross-country-flights/thermal-maps' },
}

export default function ThermalMapsPage() {
  return (
    <>
      <PageHero title="Thermal Maps — Babadağ Region" subtitle="Key thermal trigger points, altitude bands and time-of-day guide for Babadağ XC pilots." badge="Thermal Guide" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Cross Country Flights', href: '/cross-country-flights' }, { label: 'Thermal Maps' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Key Thermal Sources</h2>
          <div className="space-y-4">
            {[
              { name: 'Babadağ South Face', strength: 'Strong', time: '10:00–15:00', altitude: '1,700–3,200m', desc: 'Primary thermal generator. South-facing rock face heats rapidly. First thermal of the day typically triggers here by 09:30 in summer.' },
              { name: 'Kaya Valley (Kayaköy)', strength: 'Strong', time: '11:00–16:00', altitude: '1,200–2,800m', desc: 'The hot, dry valley floor generates powerful thermals that pilots can use for transition to the north-east. Key thermal on the Göcek route.' },
              { name: 'Fethiye Bay Convergence', strength: 'Moderate', time: '13:00–17:00', altitude: '800–1,500m', desc: 'Sea breeze convergence over Fethiye Bay creates a reliable lift band in the afternoon. Good for staying aloft on the way to Göcek.' },
              { name: 'Babadağ Ridge — North Side', strength: 'Moderate', time: '09:00–12:00', altitude: '1,900–2,500m', desc: 'Morning sun hits the north face after 09:00. Good early thermal source for pilots wanting to get altitude quickly after launch.' },
              { name: 'Ölüdeniz Coastal Cliffs', strength: 'Weak-Moderate', time: 'All day', altitude: '200–800m', desc: 'Sea cliff thermals. Useful for soaring and staying up on light days. Not suitable as a primary XC thermal — too close to the sea.' },
            ].map(t => (
              <div key={t.name} className="card p-5">
                <div className="flex flex-wrap gap-2 justify-between mb-2">
                  <h3 className="font-bold text-slate-900">{t.name}</h3>
                  <div className="flex gap-2 flex-wrap text-xs">
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">{t.strength}</span>
                    <span className="bg-sky-100 text-sky-700 px-2 py-1 rounded-full font-semibold">{t.time}</span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">{t.altitude}</span>
                  </div>
                </div>
                <p className="text-slate-600 text-sm">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
