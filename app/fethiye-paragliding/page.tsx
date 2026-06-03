import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MapPin, Clock, Car } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import FAQAccordion from '@/components/shared/FAQAccordion'
import BookingCTA from '@/components/shared/BookingCTA'

export const metadata: Metadata = {
  title: 'Fethiye Paragliding | Tandem Flights from Babadağ Ölüdeniz',
  description: 'Paragliding near Fethiye, Turkey. Tandem flights over the Blue Lagoon from Babadağ Mountain in Ölüdeniz, just 15km from Fethiye city centre.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/fethiye-paragliding' },
}

const faqItems = [
  { question: 'How far is Ölüdeniz from Fethiye?', answer: 'Ölüdeniz is approximately 14–15km from Fethiye city centre. By car or taxi it takes 20–25 minutes along a coastal road. Dolmuş (minibus) services run regularly between Fethiye and Ölüdeniz during the tourist season, departing from the town centre.' },
  { question: 'Can I do paragliding directly from Fethiye?', answer: 'The paragliding itself takes place from Babadağ Mountain above Ölüdeniz, not from Fethiye itself. However, many of our guests stay in Fethiye and transfer to Ölüdeniz for their flight. We can arrange transfer pickups from Fethiye — contact us when booking.' },
  { question: 'Is there other paragliding near Fethiye?', answer: 'Babadağ above Ölüdeniz is by far the best and most established paragliding site in the Fethiye region. There are smaller sites in the region but none with the infrastructure, safety record, or scenery of Babadağ.' },
]

export default function FethiyeParaglidingPage() {
  return (
    <>
      <PageHero title="Paragliding near Fethiye" subtitle="The world-class tandem flights are in Ölüdeniz — just 15km from Fethiye. Here's everything you need to know." badge="Fethiye Region" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Fethiye Paragliding' }]} /></div></div>

      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Fethiye Region — Paragliding Capital of Turkey</h2>
          <p className="text-slate-600 leading-relaxed mb-4">If you're staying in Fethiye and want to go paragliding, you're in the right place. The Fethiye district is home to Ölüdeniz — one of the world's most iconic paragliding destinations — and Babadağ Mountain, where tandem flights have been operating for over 30 years.</p>
          <p className="text-slate-600 leading-relaxed mb-8">Ölüdeniz is just 14km from Fethiye town centre. Most visitors do their paragliding as a day trip from Fethiye, or combine it with a stay at the beach.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { icon: MapPin, title: '14km from Fethiye', desc: 'Easy day trip or combined with beach stay', color: 'text-orange-500', bg: 'bg-orange-50' },
              { icon: Clock, title: '20 min transfer', desc: 'By car, taxi, or dolmuş minibus', color: 'text-sky-500', bg: 'bg-sky-50' },
              { icon: Car, title: 'Transfers available', desc: 'We offer pickups from Fethiye hotels', color: 'text-green-500', bg: 'bg-green-50' },
            ].map(item => {
              const Icon = item.icon
              return (
                <div key={item.title} className={`${item.bg} rounded-2xl p-6 text-center`}>
                  <Icon className={`w-8 h-8 ${item.color} mx-auto mb-3`} />
                  <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
              )
            })}
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-4">How to Get from Fethiye to Ölüdeniz</h3>
          <div className="space-y-4 mb-8">
            {[
              { method: 'Taxi', time: '20 min', cost: '~€10–15', detail: 'Most convenient. Available from Fethiye town centre and marina.' },
              { method: 'Dolmuş (Minibus)', time: '25–30 min', cost: '~€1.50', detail: 'Regular departures from Fethiye town centre bus station. Very frequent in summer.' },
              { method: 'Our Transfer Service', time: '20 min', cost: 'Ask when booking', detail: 'We can arrange hotel pickup in Fethiye and include it in your flight package.' },
              { method: 'Rental Car', time: '20 min', cost: 'Varies', detail: 'Scenic coastal drive. Parking available in Ölüdeniz near our office.' },
            ].map(t => (
              <div key={t.method} className="card p-4 flex gap-4 items-start">
                <div className="w-20 flex-shrink-0"><p className="font-bold text-slate-900 text-sm">{t.method}</p><p className="text-xs text-orange-500">{t.time}</p><p className="text-xs text-slate-500">{t.cost}</p></div>
                <p className="text-slate-600 text-sm">{t.detail}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/book-now" className="btn-primary">Book Your Flight <ArrowRight className="w-5 h-5" /></Link>
            <Link href="/transfers" className="btn-secondary">Transfer Options</Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50"><div className="container-default max-w-3xl"><FAQAccordion items={faqItems} title="Fethiye Paragliding FAQ" /></div></section>
      <section className="py-16 bg-white"><div className="container-default max-w-2xl"><BookingCTA /></div></section>
    </>
  )
}
