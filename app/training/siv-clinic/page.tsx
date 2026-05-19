import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import FAQAccordion from '@/components/shared/FAQAccordion'

export const metadata: Metadata = {
  title: 'SIV Clinic Ölüdeniz | Paragliding SIV Over Blue Lagoon Turkey',
  description: 'SIV paragliding clinics over the Blue Lagoon at Ölüdeniz. What is SIV, what to expect, who should attend and how to book a clinic at Babadağ.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/training/siv-clinic' },
}

const faqItems = [
  { question: 'What does SIV stand for?', answer: 'SIV stands for "Simulation of Incidents in Flight" (or the Spanish equivalent — Simulación de Incidentes en Vuelo, since it originated in Spanish-speaking paragliding culture). It involves deliberately inducing controlled emergency situations in flight over water, to learn how the wing responds and how to recover correctly.' },
  { question: 'Is SIV training mandatory?', answer: 'SIV is not legally mandatory but is strongly recommended — and in some club rules effectively required — before flying in challenging thermalling conditions. It is the essential prerequisite before any acro training. Many experienced pilots consider at least one SIV course per season as routine currency maintenance.' },
  { question: 'What manoeuvres are covered?', answer: 'A typical SIV course covers: Big ears, spiral dive, full stall (frontal and symmetrical), B-stall, asymmetric collapses (small and large), spin, and reserve deployment practice (often dry run, sometimes wet run). Advanced courses add dynamic collapses, SAT entry, and other acro-adjacent manoeuvres.' },
  { question: 'How long does an SIV course take?', answer: 'Most SIV clinics at Ölüdeniz run over 3–5 days. Each day consists of morning theory, a boat briefing, 2–4 tow or self-launch flights over the lagoon with boat safety cover, and an afternoon debrief with video analysis.' },
  { question: 'How is safety managed on SIV?', answer: 'The Blue Lagoon setting provides the safety net — pilots fly low enough that a water landing is the worst-case outcome for any manoeuvre. Rescue boats are positioned below pilots throughout the session. Radio communication with the coach is maintained throughout each flight. Reserve parachutes are mandatory.' },
]

export default function SivClinicPage() {
  return (
    <>
      <PageHero title="SIV Clinic at Ölüdeniz" subtitle="Simulation of Incidents in Flight over the Blue Lagoon — the safety training every paraglider needs." badge="SIV Clinic" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Training', href: '/training' }, { label: 'SIV Clinic' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8">
            <p className="text-blue-800 text-sm"><strong>Why SIV Matters:</strong> Every paraglider pilot who flies in thermalling conditions should complete at least one SIV course. It converts theoretical emergency knowledge into muscle memory — so that when a collapse or spiral happens at low altitude, your body responds correctly without needing to think.</p>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-5">Why Ölüdeniz is Perfect for SIV</h2>
          <p className="text-slate-600 leading-relaxed mb-5">The Blue Lagoon is one of the world's great SIV venues. The sheltered, shallow water provides a genuine safety net — pilots practise collapses and stalls knowing that a water landing is survivable and boats are immediately below. The calm morning conditions give perfect flat air for controlled exercises, and the warm water temperature means that even an accidental swim is not a cold shock.</p>

          <div className="space-y-4 mb-10">
            {[
              { title: 'Typical SIV Clinic Structure', desc: 'Day 1: Theory and equipment check. Day 2–3: Foundation manoeuvres (big ears, B-stall, spiral, frontal collapses). Day 4: Advanced manoeuvres (full stall, asymmetric collapse series). Day 5: Reserve deployment practice and review. Each flying session lasts 2–3 hours with boat support throughout.' },
              { title: 'Prerequisites', desc: 'Minimum P2/CP licence with at least 30 hours airborne. You must be comfortable on your own wing before SIV — the course teaches emergency responses, not basic flying skills. A freshly serviced and repacked reserve parachute is required before the first flight.' },
              { title: 'What You Take Away', desc: 'Confidence. The most commonly reported outcome is not "I learned emergency procedures" but "I now feel completely confident in my wing." Knowing how the wing behaves in extremes removes the fear of normal turbulence in everyday flying. SIV graduates consistently fly more relaxed and make better decisions.' },
            ].map(item => (
              <div key={item.title} className="card p-5">
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <FAQAccordion items={faqItems} title="SIV FAQ" />
        </div>
      </section>
    </>
  )
}
