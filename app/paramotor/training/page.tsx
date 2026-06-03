import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Paramotor Training Fethiye Turkey | PPG Courses Ölüdeniz',
  description: 'Paramotor and powered paragliding training courses near Fethiye and Ölüdeniz. Learn to fly a paramotor in Turkey with certified instructors.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/paramotor/training' },
}

export default function ParamotorTrainingPage() {
  return (
    <>
      <PageHero title="Paramotor Training" subtitle="Powered paragliding courses in the Fethiye region — from first flight to solo." badge="PPG Training" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Paramotor', href: '/paramotor' }, { label: 'Training' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <p className="text-slate-600 leading-relaxed mb-8">Learning to fly a paramotor (PPG — powered paragliding) is one of the most accessible forms of personal aviation. A complete beginner can typically reach safe solo flight standard in 5–10 days with a qualified instructor.</p>

          <h2 className="text-xl font-bold text-slate-900 mb-5">Course Stages</h2>
          <div className="space-y-4 mb-10">
            {[
              { stage: 'Ground Handling', days: 'Days 1–2', desc: 'Wing inflation, kiting and canopy control without the motor. Mastering ground handling is the foundation of all paragliding — with or without power.' },
              { stage: 'Motor Introduction', days: 'Day 2–3', desc: 'Introduction to the paramotor unit — engine operation, thrust management, and taxiing. First low hovers. Getting comfortable with the weight and noise of the motor.' },
              { stage: 'First Solo Flights', days: 'Days 3–5', desc: 'Short flights with radio guidance from the instructor on the ground. Straight-and-level flight, turns and approaches. Building confidence and consistency.' },
              { stage: 'Navigation & Circuit Work', days: 'Days 5–7', desc: 'Planned routes, altitude management, and landing in specific spots. Learning to read the terrain and airspace below you.' },
              { stage: 'Cross-Country Foundations', days: 'Days 7–10', desc: 'Longer flights to multiple waypoints, thermal awareness (when to shut off the motor), and post-flight briefings. Building toward independent flying.' },
            ].map((item, i) => (
              <div key={item.stage} className="flex gap-4">
                <div className="bg-green-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">{i + 1}</div>
                <div className="card p-4 flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-slate-900">{item.stage}</h3>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-semibold">{item.days}</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-3">Finding a PPG Instructor</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">PPG instructors operating in the Fethiye region advertise through the local paragliding community and online. Always verify your instructor holds a recognised teaching qualification (Turkish or internationally recognised PPG instructor rating).</p>
            <p className="text-slate-600 text-sm leading-relaxed">Ask at the Babadağ Association office for current instructor recommendations. Training typically takes place in the flatter terrain around Fethiye rather than at the mountain launch sites.</p>
          </div>
        </div>
      </section>
    </>
  )
}
