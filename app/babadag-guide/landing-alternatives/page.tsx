import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Alternative Landing Zones Babadağ | Secondary Areas',
  description: 'Alternative landing zones for Babadağ paragliding. When to use secondary landing areas, locations, access and conditions for each alternative landing site.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/babadag-guide/landing-alternatives' },
}

const zones = [
  { name: 'Belcekız Beach', situation: 'Overcrowded main zone', desc: 'The long Belcekız beach to the south of Ölüdeniz is a reliable alternative landing zone. Used when the main zone is congested or when a pilot is arriving from a southerly direction. Less formal than the main zone but well-known to local pilots.' },
  { name: 'Hisarönü Plateau', situation: 'High cloudbase XC days', desc: 'The elevated plateau above Ölüdeniz (approximately 650m) is used on days when pilots cannot descend through the sea breeze layer and need to land at altitude. Good flat area, road access for retrieval.' },
  { name: 'Kayaköy Fields', situation: 'XC flights going north', desc: 'The agricultural fields around Kayaköy (the ghost village) are the primary XC landing zone for northbound flights. Clear, large, and accessible by dolmuş from Fethiye. GPS: 36.5722, 29.0831.' },
  { name: 'Hotel Helipad (Emergency)', situation: 'Medical emergency', desc: 'Several large hotels near Ölüdeniz have parking areas or fields suitable for emergency landings. Pilots know these locations as a backup. Used only in genuine emergencies.' },
]

export default function LandingAlternativesPage() {
  return (
    <>
      <PageHero title="Alternative Landing Zones" subtitle="Secondary landing areas for Babadağ pilots when the main beach zone is not suitable." badge="Alternative LZs" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Babadağ Guide', href: '/babadag-guide' }, { label: 'Alternative Landings' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <p className="text-slate-600 leading-relaxed mb-8">Every experienced pilot knows their alternative landing options before taking off. While the Ölüdeniz main beach landing zone handles the vast majority of flights without issue, congestion, weather changes, or XC diversions occasionally require using a secondary zone.</p>
          <div className="space-y-5">
            {zones.map(z => (
              <div key={z.name} className="card p-5">
                <div className="flex flex-wrap gap-2 items-center mb-3">
                  <h3 className="font-bold text-slate-900">{z.name}</h3>
                  <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">Use when: {z.situation}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{z.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
