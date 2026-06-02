import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Light Wind Landing Babadağ | Calm Conditions Approach',
  description: 'Landing at Ölüdeniz in light and calm wind conditions. Downwind approach risks, high speed at touchdown and landing technique for low-wind days.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/babadag-guide/landing-light-wind' },
}

export default function LandingLightWindPage() {
  return (
    <>
      <PageHero title="Light Wind Landing" subtitle="Technique for calm and light wind landings at the Ölüdeniz landing zone." badge="Light Wind" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Babadağ Guide', href: '/babadag-guide' }, { label: 'Light Wind Landing' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <p className="text-slate-600 leading-relaxed mb-8">Light and calm wind landings are deceptively challenging. With no headwind component to slow your ground speed, your touchdown speed is much higher than on a windy day. This requires excellent timing of the flare and good physical preparation for landing.</p>

          <div className="space-y-4">
            {[
              { title: 'Higher Ground Speed', desc: 'In calm conditions, your ground speed at touchdown equals your airspeed — typically 30–40 km/h. This is significantly faster than a windy-day landing where headwind reduces your groundspeed. Always be prepared to run your landing in calm conditions — the "stand and stop" landing does not work in calm wind.' },
              { title: 'Flare Timing is Critical', desc: 'A perfectly timed flare in calm wind generates maximum lift and can produce a smooth, slow touchdown. An early flare results in a surge followed by a hard touchdown. A late flare gives insufficient time for the canopy to decelerate. Calm-wind flare technique requires practice — log it during lighter sessions before attempting it at Ölüdeniz with spectators watching.' },
              { title: 'Approach Direction', desc: 'In calm conditions, you have more flexibility about approach direction. The landing zone at Ölüdeniz is large enough to accommodate different approach headings in calm air. However, maintain consistency with other traffic — the circuit direction remains left-hand even in calm conditions.' },
              { title: 'Evening Calm Flights', desc: 'The calmest conditions at Ölüdeniz are typically just after dawn (06:00–08:00) and at dusk (18:00–20:00). Sunset and sunrise flights often land in genuinely calm air. If you are booking a sunset tandem flight, expect a calm-conditions landing — your pilot will run the landing out to manage the higher ground speed.' },
              { title: 'Hot Air Density', desc: 'Summer afternoons at Ölüdeniz bring another factor: reduced air density due to high temperatures. Your glider\'s effective stall speed is higher in hot, less-dense air. Do not flare too aggressively in hot afternoon conditions — the wing loses lift faster than you\'d expect from cooler conditions.' },
            ].map(item => (
              <div key={item.title} className="card p-5">
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
