import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'XC Landing Zones Babadağ | Cross Country Landing Areas',
  description: 'All cross country landing zones for Babadağ XC pilots. GPS coordinates, access info, field conditions and emergency contacts for each landing zone.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/cross-country-flights/landing-zones' },
}

const zones = [
  { name: 'Ölüdeniz Main Beach', coords: '36.5497, 29.1164', access: 'Town centre — easy', notes: 'Primary tandem and XC landing. Large, clear. Use the designated approach corridor.' },
  { name: 'Kayaköy Fields', coords: '36.5722, 29.0831', access: 'Dolmuş from Fethiye', notes: 'Large agricultural fields north of the ghost village. Good landing on standard XC days.' },
  { name: 'Göcek Town', coords: '36.7458, 29.1261', access: 'Harbour town — taxi/boat', notes: 'Grassy areas near the harbour. 40km route goal. Confirm field status with local pilot before flying.' },
  { name: 'Kaya Valley Floor', coords: '36.5922, 29.0711', access: 'Road access, taxi available', notes: 'Flat valley floor with good access. Used as a waypoint landing on longer XC days.' },
  { name: 'Hisarönü Plateau', coords: '36.5800, 29.1400', access: 'Road access', notes: 'Elevated plateau, good for high-altitude landing. Used in strong conditions when Ölüdeniz beach approach is challenging.' },
]

export default function LandingZonesPage() {
  return (
    <>
      <PageHero title="XC Landing Zones" subtitle="All known landing zones for cross country flights from Babadağ." badge="Landing Zones" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Cross Country Flights', href: '/cross-country-flights' }, { label: 'Landing Zones' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 text-sm text-amber-800"><strong>Important:</strong> Always verify landing zones are clear before flying. Fields can change — crops grow, obstacles appear. Get current intel from local pilots at the Babadağ launch.</div>
          <div className="space-y-4">
            {zones.map(z => (
              <div key={z.name} className="card p-5">
                <h3 className="font-bold text-slate-900 mb-2">{z.name}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                  <div><span className="text-slate-500">GPS: </span><span className="font-mono text-slate-700">{z.coords}</span></div>
                  <div><span className="text-slate-500">Access: </span><span className="text-slate-700">{z.access}</span></div>
                </div>
                <p className="text-slate-600 text-sm">{z.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
