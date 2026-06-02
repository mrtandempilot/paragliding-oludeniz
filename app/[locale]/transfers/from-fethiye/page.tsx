import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Fethiye to Ölüdeniz Transfer | Dolmuş Bus & Taxi Guide',
  description: 'How to get from Fethiye to Ölüdeniz. Dolmuş timetable, taxi fare, distance and the best way to travel the 14km between Fethiye and Ölüdeniz.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/transfers/from-fethiye' },
}

export default function FromFethiyePage() {
  return (
    <>
      <PageHero title="Fethiye to Ölüdeniz" subtitle="The easiest 14km journey on the Turquoise Coast — dolmuş, taxi or walk." badge="Local Transfer" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Transfers', href: '/transfers' }, { label: 'From Fethiye' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[{ label: 'Distance', value: '14km' }, { label: 'Dolmuş time', value: '~25 min' }, { label: 'Dolmuş cost', value: '₺20–35' }].map(i => (
              <div key={i.label} className="card p-4 text-center">
                <div className="font-bold text-orange-600 mb-1">{i.value}</div>
                <div className="text-slate-500 text-xs">{i.label}</div>
              </div>
            ))}
          </div>
          <div className="space-y-5">
            {[
              { title: 'Dolmuş (Recommended)', emoji: '🚌', desc: 'The Fethiye–Ölüdeniz dolmuş departs from the main Fethiye otogar (bus station) and runs approximately every 20–30 minutes during the season (April–October). The journey takes around 25 minutes through Hisarönü and Ovacık. This is by far the cheapest and most frequently used option. Tell the driver "Ölüdeniz" — the final stop is the beach car park.' },
              { title: 'Taxi', emoji: '🚕', desc: 'Taxis from Fethiye town centre or the otogar to Ölüdeniz cost approximately ₺150–250 depending on time of day and whether the meter is running. Negotiate before departure or ask for the meter to be used. Journey time is similar to the dolmuş — around 20–30 minutes depending on traffic through Hisarönü.' },
              { title: 'Boat from Fethiye Harbour', emoji: '⛵', desc: 'Water taxis and small boats run between Fethiye harbour and Ölüdeniz beach during the summer season. A scenic alternative — particularly enjoyable in the late afternoon. Journey takes approximately 30–40 minutes depending on the boat. Check current operators and timetables at Fethiye harbour.' },
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
