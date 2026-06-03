import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Acro Paragliding Pilots Ölüdeniz | Pro Acro Pilots Babadağ',
  description: 'Meet the acro paragliding pilots who train and perform at Ölüdeniz. Resident professionals, visiting champions and the SIV coach community.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/acro-flights/pilots' },
}

export default function AcroPilotsPage() {
  return (
    <>
      <PageHero title="Acro Pilots at Ölüdeniz" subtitle="The talented pilots who call Babadağ their acro training home." badge="Pilots" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Acro Flights', href: '/acro-flights' }, { label: 'Pilots' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <p className="text-slate-600 leading-relaxed mb-8">Ölüdeniz attracts serious acro pilots from across Europe and beyond. The Blue Lagoon's sheltered water, combined with reliable afternoon calm windows, makes it an ideal venue for low-altitude acro practice with a safety net below.</p>

          <h2 className="text-xl font-bold text-slate-900 mb-6">What Makes Ölüdeniz an Acro Hotspot</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {[
              { title: 'Natural Safety Net', emoji: '🌊', desc: 'The Blue Lagoon\'s calm, shallow water provides an ideal practice zone. Pilots can attempt dynamic manoeuvres at low altitude with support boats on standby.' },
              { title: 'Consistent Conditions', emoji: '🌤️', desc: 'The calm morning and evening windows between thermal cycles give acro pilots reliable flat-air practice time, especially from May through October.' },
              { title: 'Pilot Community', emoji: '👥', desc: 'A strong international acro community has developed at Ölüdeniz over the years. Pilots share knowledge, spot for each other, and organise informal sessions.' },
              { title: 'SIV Infrastructure', emoji: '🪂', desc: 'Multiple SIV courses run from Ölüdeniz annually with rescue boats, radio contact, and experienced coaches. This makes the venue excellent for progressive acro learning.' },
            ].map(item => (
              <div key={item.title} className="card p-5">
                <span className="text-2xl mb-3 block">{item.emoji}</span>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-slate-900 mb-3">Finding Acro Pilots at Ölüdeniz</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">Acro pilots are typically found at the pilot cafés on the 1700m launch plateau in the morning, or at the beach watching sessions in the afternoon. The Babadağ pilot community Telegram group is the best channel for connecting with active acro pilots and learning about informal sessions.</p>
            <p className="text-slate-600 text-sm leading-relaxed">Visiting acro pilots often announce their arrival and planned session windows in the Telegram group — a great opportunity for spectators to know when to watch from the beach.</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
            <strong>Note:</strong> We don't publish individual pilot profiles here out of respect for privacy. To connect with specific acro pilots, attend one of the weekly pilot meetups in Ölüdeniz town or join the pilot community Telegram group via the Babadağ Association office.
          </div>
        </div>
      </section>
    </>
  )
}
