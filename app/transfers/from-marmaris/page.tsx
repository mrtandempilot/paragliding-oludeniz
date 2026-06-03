import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Marmaris to Ölüdeniz Transfer | Bus & Taxi Options',
  description: 'How to travel from Marmaris to Ölüdeniz for paragliding. Bus route via Fethiye, transfer options and journey time from Marmaris to Babadağ.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/transfers/from-marmaris' },
}

export default function FromMarmarisPage() {
  return (
    <>
      <PageHero title="Marmaris to Ölüdeniz" subtitle="Getting from Marmaris to Ölüdeniz for your paragliding adventure." badge="Marmaris Transfer" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Transfers', href: '/transfers' }, { label: 'From Marmaris' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[{ label: 'Distance', value: '~100km' }, { label: 'Bus journey', value: '~2 hours' }, { label: 'Private transfer', value: '~80 min' }].map(i => (
              <div key={i.label} className="card p-4 text-center">
                <div className="font-bold text-orange-600 mb-1">{i.value}</div>
                <div className="text-slate-500 text-xs">{i.label}</div>
              </div>
            ))}
          </div>
          <div className="space-y-5">
            {[
              { title: 'Bus via Fethiye', emoji: '🚌', desc: 'Take an intercity bus from Marmaris otogar to Fethiye (approximately 1.5 hours). From Fethiye otogar, transfer to the Ölüdeniz dolmuş (25 minutes). Total journey including connection is typically 2–2.5 hours. Buses run regularly throughout the day in season.' },
              { title: 'Private Transfer', emoji: '🚐', desc: 'Several transfer companies offer direct Marmaris–Ölüdeniz transfers. Pre-booking gives you a fixed price and door-to-door service without the bus connection. Journey time approximately 80–90 minutes depending on route. Cost-effective for groups of 3 or more.' },
              { title: 'Day Trip', emoji: '🗺️', desc: 'Many visitors base themselves in Marmaris and visit Ölüdeniz for a day trip specifically for paragliding. Your tandem operator can arrange early-morning collection if you are coming from Marmaris — the paragliding schedule starts early enough to allow a comfortable return journey the same day.' },
            ].map(item => (
              <div key={item.title} className="card p-5">
                <div className="flex gap-3 items-start">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
