import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Crosswind Landing Babadağ | East-West Wind Approach Ölüdeniz',
  description: 'Crosswind landing technique at Ölüdeniz landing zone. East and west wind approaches, crabbing technique and when to use alternative landing zones.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/babadag-guide/landing-crosswind' },
}

export default function LandingCrosswindPage() {
  return (
    <>
      <PageHero title="Crosswind Landing" subtitle="Handling easterly and westerly crosswinds at the Ölüdeniz landing zone." badge="Crosswind" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Babadağ Guide', href: '/babadag-guide' }, { label: 'Crosswind Landing' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <p className="text-slate-600 leading-relaxed mb-8">Crosswind conditions at Ölüdeniz are less common than southerly flow but occur regularly — particularly in the morning and during the transition between thermal and sea-breeze cycles. Handling crosswind approaches requires the crabbing technique and confident control inputs.</p>

          <div className="space-y-4">
            {[
              { title: 'The Crabbing Technique', desc: 'In crosswind conditions, point the glider\'s nose slightly into wind to maintain a straight ground track toward the landing zone. You will be moving sideways relative to the direction you\'re pointing — this is normal and correct. The goal is to maintain your desired ground track while compensating for the drift.' },
              { title: 'Easterly Crosswind', desc: 'East wind at Ölüdeniz typically indicates an offshore flow — unusual but possible in settled weather. In easterly conditions, the approach from the north is more turbulent due to the interaction with the hills to the east. A westerly approach (upwind from the sea side) may give a cleaner approach path. Assess carefully before committing.' },
              { title: 'Westerly Crosswind', desc: 'West or south-west wind conditions can create a wind-shadow on the east side of the hill above the landing zone. Avoid flying too close to this terrain on the leeward (east) side. The turbulence from this rotor extends further downwind than it appears — give generous clearance.' },
              { title: 'Landing Flare in Crosswind', desc: 'In crosswind, the flare technique is modified. In the final seconds before landing, straighten up to face directly into wind (accepting the drift) and flare normally. Landing with significant crosswind drift puts excessive side-load on your ankles. If crosswind is above 15 km/h, use an alternative landing direction.' },
              { title: 'When to Divert', desc: 'If crosswind at the landing zone exceeds approximately 15–20 km/h, consider diverting to an alternative zone with a better orientation relative to the current wind. The Hisarönü plateau and Kayaköy fields often offer different wind exposure and may provide a more favourable approach in unusual wind conditions.' },
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
