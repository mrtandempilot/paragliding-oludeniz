import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Acro Paragliding Safety Ölüdeniz | SIV & Reserve Parachute',
  description: 'Acro paragliding safety at Ölüdeniz. Reserve parachute requirements, SIV training, safety culture and risk management for aerobatic pilots.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/acro-flights/safety' },
}

export default function AcroSafetyPage() {
  return (
    <>
      <PageHero title="Acro Safety at Ölüdeniz" subtitle="Reserve parachutes, SIV training, and the safety culture of the acro community." badge="Safety" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Acro Flights', href: '/acro-flights' }, { label: 'Safety' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-8">
            <p className="text-red-800 text-sm"><strong>Important:</strong> Acro paragliding is a high-risk discipline. It should only be pursued after completing a recognised SIV course and with proper mentorship from experienced acro pilots. Never attempt acro manoeuvres without a reserve parachute and appropriate training.</p>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-6">Safety Pillars</h2>
          <div className="space-y-5 mb-10">
            {[
              {
                title: 'Reserve Parachute — Mandatory',
                emoji: '🪂',
                content: 'Every pilot flying acro at Ölüdeniz must carry a reserve parachute. No exceptions. The Babadağ Association and the acro pilot community enforce this. Annual reserve repacking is required — reserve must have been repacked within the last 12 months. A rescue harness (capable of supporting the forces generated in acro) is also required.',
              },
              {
                title: 'SIV Training Requirement',
                emoji: '🎓',
                content: 'SIV (Simulation of Incidents in Flight) training is the essential prerequisite for acro. SIV courses teach controlled collapses, stalls, spiral dives and reserve deployment — all over water with rescue boat support. At Ölüdeniz, SIV courses run over the Blue Lagoon several times per season. Completing at least one SIV course is the minimum requirement before attempting any acro manoeuvres.',
              },
              {
                title: 'Water Practice Zones',
                emoji: '🌊',
                content: 'Acro practice at Ölüdeniz is conducted over the Blue Lagoon and adjacent sheltered water areas. These are designated zones where pilots can practice low-altitude manoeuvres with a water landing as the worst-case outcome rather than a ground impact. Rescue boats are present during organised sessions.',
              },
              {
                title: 'Buddy System',
                emoji: '👥',
                content: 'The acro community at Ölüdeniz operates a buddy system. Pilots always have at least one observer on the ground or in the water during low acro practice sessions. The observer monitors altitude and signals if the pilot is getting low. This redundant safety layer has prevented numerous incidents.',
              },
              {
                title: 'Radio Communication',
                emoji: '📻',
                content: 'During organised acro sessions, pilots maintain radio contact with the ground team and rescue boats. Pilots announce their manoeuvres and altitude. Ground observers can call the session if conditions deteriorate or if a pilot appears to be struggling.',
              },
            ].map(item => (
              <div key={item.title} className="card p-6">
                <div className="flex gap-4 items-start">
                  <span className="text-3xl">{item.emoji}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-3">SIV Courses at Ölüdeniz</h3>
            <p className="text-slate-600 text-sm leading-relaxed">SIV courses at Ölüdeniz typically run in May, June, and September — when conditions are ideal. Courses are announced through the pilot community Telegram group and at the Babadağ Association office. Places fill quickly. If you plan to pursue acro, sign up for an SIV course early in your planning process.</p>
          </div>
        </div>
      </section>
    </>
  )
}
