import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Dalaman Airport to Ölüdeniz Transfer | Paragliding Airport Guide',
  description: 'All transfer options from Dalaman airport (DLM) to Ölüdeniz. Havataş bus, taxi, private transfer costs, journey times and arrival tips for paragliding visitors.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/transfers/dalaman-airport' },
}

const options = [
  { method: 'Havataş Bus + Dolmuş', time: '1.5–2 hours', cost: '~₺100–150', best: 'Budget travellers', desc: 'Take the Havataş airport bus from Dalaman airport directly to Fethiye otogar (bus station). Journey takes approximately 45–60 minutes. From Fethiye otogar, take the Ölüdeniz dolmuş — runs every 20–30 minutes in season and takes around 30 minutes. Cost effective and perfectly adequate for solo travellers with standard luggage.' },
  { method: 'Private Transfer', time: '45–55 minutes', cost: '€25–45 per vehicle', best: 'Groups & families', desc: 'Pre-book a private minibus or car transfer from Dalaman directly to your Ölüdeniz accommodation. No waiting, door-to-door service, fixed price agreed in advance. Most cost-effective for groups of 3 or more. Several reputable operators serve the Dalaman–Ölüdeniz route — book through your hotel or a well-reviewed online service.' },
  { method: 'Airport Taxi', time: '45–55 minutes', cost: '₺600–900', best: 'Late night arrivals', desc: 'Official airport taxis are available at the Dalaman arrivals hall. Metered or negotiate before departure — always agree the price first. More expensive than other options but useful for late-night flights when the bus is not running. Confirm the driver knows Ölüdeniz specifically (not just Fethiye).' },
  { method: 'Rental Car', time: '50 minutes', cost: 'From €20/day', best: 'Exploring the region', desc: 'Several major rental companies operate at Dalaman airport. A rental car gives maximum flexibility for exploring the Lycian Coast, visiting Kayaköy, Saklikent Gorge and other attractions. Parking in Ölüdeniz village can be tight in peak season.' },
]

export default function DalamanAirportPage() {
  return (
    <>
      <PageHero title="Dalaman Airport to Ölüdeniz" subtitle="Every way to get from Dalaman airport (DLM) to your Ölüdeniz accommodation." badge="Airport Transfer" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Transfers', href: '/transfers' }, { label: 'Dalaman Airport' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-8 text-sm text-blue-800">
            <strong>Dalaman Airport (DLM)</strong> is the closest international airport to Ölüdeniz — 55km west of the resort. Direct flights operate from the UK, Germany, Netherlands, Russia and other major markets throughout the season (April–October).
          </div>
          <div className="space-y-5">
            {options.map(o => (
              <div key={o.method} className="card p-5">
                <div className="flex flex-wrap gap-2 items-center mb-3">
                  <h3 className="font-bold text-slate-900">{o.method}</h3>
                  <span className="bg-sky-100 text-sky-700 text-xs font-semibold px-2.5 py-1 rounded-full">{o.time}</span>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">{o.cost}</span>
                  <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full">Best for: {o.best}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
