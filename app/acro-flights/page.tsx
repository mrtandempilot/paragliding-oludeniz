import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import FAQAccordion from '@/components/shared/FAQAccordion'

export const metadata: Metadata = {
  title: 'Acro Paragliding Ölüdeniz | Aerobatics Babadağ Turkey',
  description: 'Acrobatic paragliding at Ölüdeniz and Babadağ. SAT, helicopter, infinity tumbling, wing-overs — watch world-class acro pilots or join acro training camps.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/acro-flights' },
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'SportsActivityLocation',
  name: 'Acro Paragliding Ölüdeniz',
  description: 'Aerobatic paragliding at Babadağ, Ölüdeniz — one of Europe\'s premier acro flying destinations.',
  url: 'https://paragliding-oludeniz.com/acro-flights',
  address: { '@type': 'PostalAddress', addressLocality: 'Ölüdeniz', addressCountry: 'TR' },
}

const subPages = [
  { href: '/acro-flights/pilots', title: 'Acro Pilots', desc: 'Meet the resident acro pilots and visiting pros who train at Babadağ.', emoji: '🎖️' },
  { href: '/acro-flights/meeting-points', title: 'Meeting Points', desc: 'Best spectator spots and photography positions for acro flying.', emoji: '📍' },
  { href: '/acro-flights/safety', title: 'Acro Safety', desc: 'Reserve parachutes, SIV training requirements, and acro safety culture.', emoji: '🪂' },
  { href: '/acro-flights/events', title: 'Acro Events', desc: 'Competitions, slalom courses, and acro festivals at Ölüdeniz.', emoji: '🏆' },
]

const faqItems = [
  { question: 'Can I do acro as a tandem passenger?', answer: 'Not typically — tandem acrobatics requires specialist equipment and highly experienced pilots. Standard tandem flights are smooth recreational experiences. Some pilots offer mild wing-overs for interested passengers; ask when booking.' },
  { question: 'What qualification do I need to learn acro?', answer: 'You should have at minimum a P2/CP licence and around 100+ hours logged. SIV (Simulation of Incidents in Flight) training over water is strongly recommended before any acro training.' },
  { question: 'Is there an acro school at Ölüdeniz?', answer: 'Several visiting instructors run SIV and acro progression camps from Ölüdeniz each season. These are advertised through the pilot community Telegram group. There is no permanent acro school year-round.' },
  { question: 'When is the best time to watch acro?', answer: 'The calm morning and late afternoon windows (before thermals build) are when pilots practice. Early May and September see the most acro activity as conditions are consistent.' },
]

export default function AcroFlightsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <PageHero title="Acro Paragliding" subtitle="Aerobatics, tumbling, helicos — the world of acro paragliding at Ölüdeniz and Babadağ." badge="Aerobatics" size="md" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Acro Flights' }]} /></div></div>

      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">A World-Class Acro Destination</h2>
              <p className="text-slate-600 leading-relaxed mb-4">Ölüdeniz has established itself as one of Europe's most respected acro paragliding venues. The combination of consistent thermals, the calm waters of the Blue Lagoon for safe practice, and the welcoming pilot community draws world-class acro pilots every season.</p>
              <p className="text-slate-600 leading-relaxed mb-4">The Blue Lagoon serves as a natural safety net — pilots practise dynamic manoeuvres low over the sheltered water, with support boats standing by. This makes Ölüdeniz an ideal venue for SIV and acro progression training.</p>
              <p className="text-slate-600 leading-relaxed">During summer months, spectators on the beach are regularly treated to free air shows as resident acro pilots run through their sequences in the late afternoon calm.</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-8">
              <h3 className="font-bold text-slate-900 mb-4">Acro Manoeuvres at Ölüdeniz</h3>
              <ul className="space-y-3">
                {[
                  { move: 'Wing-Over', level: 'Entry level' },
                  { move: 'SAT', level: 'Intermediate' },
                  { move: 'Helicopter', level: 'Advanced' },
                  { move: 'Infinity Tumbling', level: 'Expert' },
                  { move: 'Misty Flip', level: 'Expert' },
                  { move: 'Rythmic SAT', level: 'Expert' },
                  { move: 'Flat Spin', level: 'Intermediate' },
                  { move: 'Looping', level: 'Expert' },
                ].map(m => (
                  <li key={m.move} className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">{m.move}</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${m.level === 'Entry level' ? 'bg-green-100 text-green-700' : m.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{m.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-purple-600 text-white rounded-3xl p-8 mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { num: '500m', label: 'Blue Lagoon practice altitude' },
                { num: '20+', label: 'Acro pilots per season' },
                { num: 'May–Oct', label: 'Acro season' },
                { num: '100+', label: 'Hours recommended before acro' },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-3xl font-bold mb-1">{s.num}</div>
                  <div className="text-purple-200 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-6">Acro at Ölüdeniz</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {subPages.map(p => (
              <Link key={p.href} href={p.href} className="card p-6 hover:shadow-lg transition-shadow group">
                <span className="text-3xl mb-3 block">{p.emoji}</span>
                <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors mb-2">{p.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{p.desc}</p>
              </Link>
            ))}
          </div>

          <FAQAccordion items={faqItems} title="Acro FAQ" />

          <div className="mt-10 border-t border-slate-200 pt-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Further Reading for Pilots</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: '/training', title: 'SIV & Training Courses', desc: 'SIV clinics over the Blue Lagoon are the essential foundation before acro progression.' },
                { href: '/solo-paragliding', title: 'Solo Pilot Information', desc: 'Licence requirements, pilot passes, and site regulations for flying at Babadağ.' },
                { href: '/community', title: 'Pilot Community', desc: 'Connect with acro pilots via WhatsApp groups and the annual Ölüdeniz Acro Show.' },
              ].map(link => (
                <Link key={link.href} href={link.href} className="flex gap-3 p-4 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50 transition-all group">
                  <ArrowRight className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900 group-hover:text-orange-600 text-sm">{link.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{link.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <BookingCTA title="Watch or Fly — Ölüdeniz Awaits" subtitle="Book your tandem flight and witness acro pilots performing overhead, or enquire about SIV training camps." variant="orange" />
    </>
  )
}
