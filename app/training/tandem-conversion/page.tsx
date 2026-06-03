import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'

export const metadata: Metadata = {
  title: 'Tandem Pilot Training Ölüdeniz | Become a Tandem Pilot',
  description: 'How to become a tandem paragliding pilot at Ölüdeniz. Tandem conversion course requirements, Turkish commercial licence, and career path at Babadağ.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/training/tandem-conversion' },
}

export default function TandemConversionPage() {
  return (
    <>
      <PageHero title="Tandem Pilot Training" subtitle="The pathway to becoming a commercial tandem paragliding pilot at Babadağ." badge="Tandem Licence" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Training', href: '/training' }, { label: 'Tandem Conversion' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <p className="text-slate-600 leading-relaxed mb-8">Becoming a tandem paragliding pilot is one of the most demanding achievements in the sport. It requires mastery of the wing, deep understanding of meteorology, excellent people skills, and a commercial licence that demonstrates you meet the highest safety standards.</p>

          <h2 className="text-2xl font-bold text-slate-900 mb-5">Requirements to Begin</h2>
          <div className="space-y-3 mb-10">
            {[
              { req: 'Solo pilot licence', detail: 'P3/EP (Pilot licence) minimum. Many routes require P4/Advanced Pilot.' },
              { req: 'Flight hours', detail: 'Typically 200+ hours as a solo pilot before tandem training begins.' },
              { req: 'SIV completed', detail: 'At least one SIV course demonstrating emergency procedure competence.' },
              { req: 'Medical certificate', detail: 'Turkish SHGM aviation medical — Class 2 medical certificate required for commercial operations.' },
              { req: 'First Aid', detail: 'Current first aid certification required for commercial pilot licence.' },
              { req: 'Turkish language', detail: 'Working Turkish language ability needed for SHGM exam and passenger communication.' },
            ].map(item => (
              <div key={item.req} className="flex gap-3 card p-4">
                <span className="text-green-500 font-bold flex-shrink-0">✓</span>
                <div>
                  <span className="font-semibold text-slate-900 text-sm">{item.req}: </span>
                  <span className="text-slate-600 text-sm">{item.detail}</span>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-5">The Tandem Course</h2>
          <div className="space-y-4 mb-10">
            {[
              { title: 'Theory Modules', desc: 'Advanced aerodynamics, tandem-specific meteorology, passenger management, emergency procedures with a passenger on board, Turkish aviation law for commercial operators, and insurance requirements.' },
              { title: 'Practical Training', desc: 'Progressive tandem flights with an instructor as the passenger. Includes passenger briefing technique, harness fitting and adjustment, passive launch assistance (helping the passenger run correctly), in-flight communication, and a range of landing scenarios.' },
              { title: 'Assessment Flights', desc: 'Assessed flights with a SHGM examiner as the observer. Multiple flights required demonstrating full passenger management cycle, appropriate weather decision-making, and smooth launch-to-landing technique.' },
              { title: 'Commercial Licence', desc: 'Successful graduates receive a Turkish SHGM commercial tandem pilot licence (Ticari Tandem Pilot Lisansı). This licence must be renewed and maintained with ongoing currency requirements.' },
            ].map(item => (
              <div key={item.title} className="card p-5">
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
            <h3 className="font-bold text-slate-900 mb-2">Career at Babadağ</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Babadağ is one of the busiest tandem paragliding operations in the world — 300+ flight days per season with 200–400 flights per day at peak. Qualified tandem pilots are in demand. Contact the Babadağ Association or established operators directly about seasonal employment once you hold your commercial licence.</p>
          </div>
        </div>
      </section>
      <BookingCTA title="Experience Tandem Flying First" subtitle="See why tandem piloting is such a rewarding career — book a flight as a passenger first." variant="orange" />
    </>
  )
}
