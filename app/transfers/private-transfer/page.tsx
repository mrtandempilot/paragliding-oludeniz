import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'

export const metadata: Metadata = {
  title: 'Private Transfer to Ölüdeniz | Airport & Hotel Transfer Service',
  description: 'Private transfer service to Ölüdeniz from Dalaman airport, Fethiye and Marmaris. Fixed price, door-to-door, air-conditioned vehicles for paragliding visitors.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/transfers/private-transfer' },
}

export default function PrivateTransferPage() {
  return (
    <>
      <PageHero title="Private Transfer Service" subtitle="Door-to-door, fixed-price transfers to Ölüdeniz from any airport or resort." badge="Private Transfer" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Transfers', href: '/transfers' }, { label: 'Private Transfer' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <p className="text-slate-600 leading-relaxed mb-8">A private transfer removes all the stress from your arrival — no navigating bus stations with luggage, no waiting, no connection anxiety. Your driver meets you at arrivals, helps with luggage, and takes you directly to your Ölüdeniz accommodation in an air-conditioned vehicle.</p>

          <h2 className="text-xl font-bold text-slate-900 mb-5">Typical Prices (2024 Guide)</h2>
          <div className="space-y-3 mb-10">
            {[
              { route: 'Dalaman Airport → Ölüdeniz', car: '€25–35', minibus: '€35–50', note: 'Most popular route, 55km' },
              { route: 'Fethiye → Ölüdeniz', car: '€15–20', minibus: '€20–30', note: '14km, 20 min' },
              { route: 'Marmaris → Ölüdeniz', car: '€60–80', minibus: '€80–110', note: '~100km, 80 min' },
              { route: 'Antalya Airport → Ölüdeniz', car: '€90–120', minibus: '€120–160', note: '~300km, 3.5 hours' },
            ].map(r => (
              <div key={r.route} className="card p-4">
                <div className="flex flex-wrap gap-2 justify-between items-center">
                  <div>
                    <span className="font-semibold text-slate-900 text-sm">{r.route}</span>
                    <p className="text-slate-400 text-xs mt-0.5">{r.note}</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-semibold">Car: {r.car}</span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-semibold">Minibus: {r.minibus}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 mb-8">
            {[
              { title: 'What\'s Included', desc: 'Meet and greet at arrivals, luggage assistance, air-conditioned vehicle, door-to-door service, fixed price (no meter surprises), child seats on request, and flight delay tracking for airport pickups.' },
              { title: 'How to Book', desc: 'Contact us when booking your paragliding flight and we can recommend current transfer operators. Alternatively, book directly through your hotel or a well-reviewed online transfer service. Always confirm the vehicle type and confirm your destination is specifically Ölüdeniz (not just "Fethiye area").' },
              { title: 'Group Travel', desc: 'Private transfers become increasingly cost-effective for groups. A 6–8 person minibus from Dalaman at €40–50 total is cheaper per person than the bus-plus-dolmuş combination for larger groups, with the major added benefit of direct door-to-door service.' },
            ].map(item => (
              <div key={item.title} className="card p-5">
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <BookingCTA title="Arrive Stress-Free — Book Everything Together" subtitle="When you book your tandem flight, ask us about recommended transfer partners." variant="dark" />
    </>
  )
}
