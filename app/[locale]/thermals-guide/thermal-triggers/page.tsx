import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Thermal Trigger Points Babadağ | Where Thermals Start',
  description: 'The specific thermal trigger points around Babadağ and Ölüdeniz. Which terrain features generate thermals, when they fire and how to connect them for XC flights.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/thermals-guide/thermal-triggers' },
}

const triggers = [
  { name: 'Babadağ South Face', time: '09:00–15:00', strength: 'Strong', desc: 'The primary thermal generator for the whole area. The south-facing limestone face heats rapidly from sunrise. The first usable thermal of the day at 1700m launch typically originates here. Climb rates of 3–5m/s are common in peak conditions.' },
  { name: 'Kayaköy (Kaya Valley)', time: '10:00–16:00', strength: 'Very Strong', desc: 'The hot, dry valley floor around the ghost village of Kayaköy is one of the most reliable thermal sources in the region. The dark abandoned buildings and exposed rock heat intensely. Key thermal for connecting north to Göcek on XC days.' },
  { name: 'Fethiye Rocky Hills', time: '11:00–15:00', strength: 'Moderate', desc: 'The rocky hills east of Fethiye generate consistent thermals from mid-morning. These link the coastal zone to the inland thermal landscape. Used by XC pilots as connectors when the Kayaköy route needs support.' },
  { name: 'Ölüdeniz Cliffs', time: 'All day', strength: 'Weak–Moderate', desc: 'The coastal cliff faces around Ölüdeniz generate small thermals all day from solar heating of the rock. These are weak compared to the valley thermals but useful for staying in the air on lighter days and for gaining enough height to reach the main thermal streets.' },
  { name: 'Ovacık Plateau', time: '10:00–14:00', strength: 'Moderate', desc: 'The developed plateau of Ovacık east of Ölüdeniz generates thermal from the built environment and surrounding scrub. A useful trigger point for pilots who need lift after crossing the beach zone.' },
  { name: 'Northern Ridge Chain', time: '09:00–13:00', strength: 'Moderate', desc: 'The series of ridges north of Babadağ catch the morning sun on their east faces. XC pilots can hop from ridge to ridge on these morning thermals to gain the northbound altitude needed for the Göcek route.' },
]

export default function ThermalTriggersPage() {
  return (
    <>
      <PageHero title="Thermal Trigger Points" subtitle="Where thermals start around Babadağ — the specific terrain features that generate lift." badge="Trigger Guide" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Thermals Guide', href: '/thermals-guide' }, { label: 'Thermal Triggers' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <p className="text-slate-600 leading-relaxed mb-8">Every regular XC pilot at Babadağ develops a mental map of the reliable thermal trigger points. These are the terrain features that fire consistently day after day — the starting points of the lift that makes long cross-country flights possible.</p>
          <div className="space-y-5">
            {triggers.map(t => (
              <div key={t.name} className="card p-5">
                <div className="flex flex-wrap gap-2 items-center mb-3">
                  <h3 className="font-bold text-slate-900">{t.name}</h3>
                  <span className="bg-sky-100 text-sky-700 text-xs font-semibold px-2.5 py-1 rounded-full">{t.time}</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${t.strength === 'Strong' || t.strength === 'Very Strong' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{t.strength}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
