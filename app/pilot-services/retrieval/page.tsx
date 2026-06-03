import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Pilot Retrieval Service Babadağ | XC Retrieve Ölüdeniz',
  description: 'Pilot retrieval service for XC paraglider pilots at Ölüdeniz. How to organise a retrieve from Kayaköy, Göcek and other XC landing zones around Babadağ.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/pilot-services/retrieval' },
}

export default function RetrievalPage() {
  return (
    <>
      <PageHero title="Pilot Retrieval Service" subtitle="Getting back to base after a cross-country flight from Babadağ." badge="XC Retrieve" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Pilot Services', href: '/pilot-services' }, { label: 'Retrieval' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <p className="text-slate-600 leading-relaxed mb-8">One of the practical realities of XC paragliding is the retrieve — getting yourself and your equipment back to your starting point after landing somewhere other than the main landing zone. At Ölüdeniz, the established XC community has developed good retrieve systems that make longer flights logistically straightforward.</p>
          <div className="space-y-5 mb-8">
            {[
              { title: 'Self-Retrieve Options', emoji: '🚌', desc: 'Many XC landing zones around Babadağ are accessible by public dolmuş (shared minibus). Kayaköy is connected to Fethiye by regular dolmuş. From Fethiye, buses and dolmuş run to Ölüdeniz. Self-retrieve by public transport is possible from most standard landing zones and is free or very cheap.' },
              { title: 'Organised XC Day Retrieve', emoji: '🚐', desc: 'On weekly XC group days, the Babadağ XC community organises shared retrieves. A driver covers the circuit to collect pilots from the agreed landing zones. Costs are shared among flying pilots. This is the most convenient and social option for visiting pilots joining group XC days.' },
              { title: 'Taxi Retrieve', emoji: '🚕', desc: 'Fethiye taxis can collect pilots from most XC landing zones. The fare from Kayaköy to Ölüdeniz is approximately 150–250 TL (2024). From Göcek, expect a longer drive and higher fare. Agree the price before departure and confirm the driver knows the landing area.' },
              { title: 'App-Based Navigation', emoji: '📱', desc: 'Share your GPS location with your retrieve driver via WhatsApp location sharing when you land. This is the most reliable way to communicate exactly where you are, especially if you have landed in an unmarked field. XContest and XCTrack automatically log your track and final location.' },
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
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
            <h3 className="font-bold text-slate-900 mb-2">Plan Your Retrieve Before You Launch</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Always agree your retrieve arrangement before you launch on an XC day. Either have a driver's number saved, confirm your participation in the group retrieve, or have a public transport plan ready. Landing 40km from base with no retrieve plan is an unpleasant way to end an otherwise great XC flight.</p>
          </div>
        </div>
      </section>
    </>
  )
}
