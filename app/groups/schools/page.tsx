import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import FAQAccordion from '@/components/shared/FAQAccordion'

export const metadata: Metadata = {
  title: 'School & University Paragliding Ölüdeniz | Educational Group Flights',
  description: 'Educational paragliding experiences for school and university groups at Ölüdeniz. Supervised tandem flights from Babadağ with safety briefings and group coordination.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/groups/schools' },
}

const faqItems = [
  { question: 'What is the minimum age for tandem paragliding?', answer: 'The minimum age is 5 years old. For school groups, most operators recommend a practical minimum of 8–10 years for children to properly understand and follow the take-off run instruction. Parental consent forms are required for all participants under 18.' },
  { question: 'Is parental consent required?', answer: 'Yes — written parental or guardian consent is required for all participants under 18. We can provide standard consent forms that meet Turkish regulatory requirements. Schools should also ensure their own duty-of-care documentation is in place.' },
  { question: 'Can teachers and staff fly too?', answer: 'Yes — accompanying teachers and staff are encouraged to participate. This helps with duty-of-care supervision and typically results in better group cohesion. Group pricing applies to all flyers regardless of role.' },
  { question: 'What educational elements can be incorporated?', answer: 'Many school groups incorporate weather and meteorology briefings, aerodynamics explanations, geography of the Babadağ mountain and local ecology into the experience. Pilots can tailor their in-flight commentary to highlight educational content relevant to your curriculum.' },
  { question: 'Is insurance required?', answer: 'All tandem flights are covered by the operator\'s liability insurance. Schools should verify their own trip insurance covers adventure activities. We can provide documentation of our safety certification and insurance for school risk assessments.' },
]

export default function SchoolsPage() {
  return (
    <>
      <PageHero title="School & University Groups" subtitle="Educational paragliding experiences for school trips and university societies — safely supervised from Babadağ." badge="Schools" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Groups', href: '/groups' }, { label: 'School Groups' }]} /></div></div>

      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Minimum age', value: '5 years' },
              { label: 'Max weight', value: '100–110kg' },
              { label: 'Group discount', value: 'From 10%' },
              { label: 'Consent forms', value: 'Required <18' },
            ].map(item => (
              <div key={item.label} className="card p-4 text-center">
                <div className="text-xl font-bold text-orange-600 mb-1">{item.value}</div>
                <div className="text-slate-500 text-xs">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-10">
            <h2 className="font-bold text-green-900 mb-2">Safety First — School Group Protocols</h2>
            <p className="text-green-800 text-sm leading-relaxed">All tandem pilots hold current SHGM (Turkish Civil Aviation Authority) tandem licences. Each flight includes a full pre-flight safety briefing covering take-off technique, in-flight communication and landing procedure. Students are never rushed — each participant is individually briefed and only launches when the pilot is satisfied they are ready and conditions are suitable.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
            {[
              { title: 'Curriculum Connections', emoji: '📚', desc: 'Paragliding at Babadağ connects to geography (coastal geomorphology, Mediterranean climate), physics (aerodynamics, lift and drag), biology (mountain ecology, bird species) and outdoor education. Pilots can provide subject-relevant commentary during the flight.' },
              { title: 'University Sports Societies', emoji: '🎓', desc: 'University paragliding and outdoor societies regularly bring groups to Ölüdeniz. Whether your interest is in taking up the sport or simply experiencing the world\'s best tandem site, we can cater for societies of any size with competitive group rates.' },
              { title: 'Supervision Ratios', emoji: '👥', desc: 'Our ground coordination team ensures each student is supervised from hotel pickup through to beach landing. Teacher-to-student ratios from your school\'s own policy are respected — we work within your existing group management structure.' },
              { title: 'Risk Assessment Support', emoji: '📋', desc: 'We can provide documentation to support your school\'s risk assessment process: pilot licence copies, insurance certificates, safety record information and operator registration details. Contact us early in your planning to allow time for paperwork.' },
            ].map(item => (
              <div key={item.title} className="card p-5">
                <span className="text-2xl mb-3 block">{item.emoji}</span>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <FAQAccordion items={faqItems} title="School Groups FAQ" />
        </div>
      </section>

      <BookingCTA title="Enquire About School Group Pricing" subtitle="We'll provide full documentation and pricing for your school trip planning." variant="orange" />
    </>
  )
}
