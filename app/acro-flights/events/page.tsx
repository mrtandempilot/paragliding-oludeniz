import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Acro Paragliding Events Ölüdeniz | Competitions & Festivals',
  description: 'Acro paragliding events, competitions and festivals at Ölüdeniz. Annual acro contests, slalom courses and free-flying festivals in Turkey.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/acro-flights/events' },
}

const events = [
  { name: 'Ölüdeniz International Air Games', month: 'October', type: 'Festival', desc: 'The flagship annual event. Paragliders, hang gliders, speed riders and acro pilots converge on Ölüdeniz for a week-long celebration of free flight. Acro competitions are a highlight, with pilots performing over the Blue Lagoon in front of thousands of spectators.' },
  { name: 'Babadağ Acro Sessions', month: 'May & September', type: 'Training Camp', desc: 'Informal but organised acro training camps run by visiting coaches. Open to intermediate and advanced pilots. Registration via the pilot community Telegram group.' },
  { name: 'Blue Lagoon Slalom', month: 'July', type: 'Competition', desc: 'A precision flying slalom competition over the Blue Lagoon. Pilots navigate a course of buoys at low altitude. Part acro, part precision — a popular spectator event from the beach.' },
  { name: 'SIV Clinic Weekends', month: 'Multiple per season', type: 'Training', desc: 'Regular SIV training clinics run over the Blue Lagoon from May to October. Prerequisite for acro training. Coaches from across Europe lead sessions for both beginner SIV and advanced acro progression.' },
]

export default function AcroEventsPage() {
  return (
    <>
      <PageHero title="Acro Events at Ölüdeniz" subtitle="Competitions, training camps, and festivals celebrating aerobatic paragliding." badge="Events" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Acro Flights', href: '/acro-flights' }, { label: 'Events' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <p className="text-slate-600 leading-relaxed mb-8">Ölüdeniz hosts some of the most spectacular acro events in the Mediterranean region. The Blue Lagoon setting provides a world-class backdrop for competitions and draws pilots and spectators from across Europe.</p>

          <div className="space-y-5 mb-10">
            {events.map(e => (
              <div key={e.name} className="card p-6">
                <div className="flex flex-wrap gap-2 items-center mb-3">
                  <h3 className="font-bold text-slate-900">{e.name}</h3>
                  <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full">{e.type}</span>
                  <span className="bg-sky-100 text-sky-700 text-xs font-semibold px-2.5 py-1 rounded-full">{e.month}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-3">Stay Updated on Events</h3>
            <p className="text-slate-600 text-sm leading-relaxed">The paragliding calendar at Ölüdeniz evolves each season. For the most current event schedule, follow the Babadağ Association social media channels or check with the Association office on arrival. Most events are announced 4–8 weeks in advance through the pilot community.</p>
          </div>
        </div>
      </section>
    </>
  )
}
