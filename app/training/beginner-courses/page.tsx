import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'

export const metadata: Metadata = {
  title: 'Beginner Paragliding Courses Ölüdeniz | Learn to Fly',
  description: 'Beginner paragliding courses near Ölüdeniz. P1/CP licence training, what to expect on a beginner course, duration, cost and how to get started in Turkey.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/training/beginner-courses' },
}

export default function BeginnerCoursesPage() {
  return (
    <>
      <PageHero title="Beginner Paragliding Courses" subtitle="Start your paragliding journey near Ölüdeniz — from first steps to your first solo flights." badge="Beginner Course" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Training', href: '/training' }, { label: 'Beginner Courses' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Course duration', value: '8–14 days' },
              { label: 'Age minimum', value: '16 years' },
              { label: 'Fitness required', value: 'Basic' },
              { label: 'Class size', value: '4–8 students' },
            ].map(item => (
              <div key={item.label} className="card p-4 text-center">
                <div className="text-xl font-bold text-orange-600 mb-1">{item.value}</div>
                <div className="text-slate-500 text-xs">{item.label}</div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-5">What You Learn</h2>
          <div className="space-y-4 mb-10">
            {[
              { phase: 'Phase 1 — Theory', days: 'Days 1–2', desc: 'Aerodynamics, meteorology, equipment inspection, airspace rules, emergency procedures. Written theory exam at end of course. All taught in Turkish (and English for visiting students).' },
              { phase: 'Phase 2 — Ground Handling', days: 'Days 2–4', desc: 'Wing inflation, kiting and canopy control on flat ground and gentle slopes. The most time-consuming phase — mastery of ground handling is essential before any airborne flights.' },
              { phase: 'Phase 3 — Low Hill Flights', days: 'Days 4–7', desc: 'First airborne flights from small hills (5–20m). Straight-and-level flight, gentle turns, and landing technique. Builds confidence in a controlled environment before the mountain.' },
              { phase: 'Phase 4 — Mountain Flights', days: 'Days 7–12', desc: 'Flights from the Babadağ training area or other designated beginner sites. Under instructor supervision at all times. Progressive altitude increase as skills develop.' },
              { phase: 'Phase 5 — Assessment', days: 'Days 12–14', desc: 'Practical assessment for P1/CP licence. Includes oral exam, equipment check, observed flight and post-flight debrief. Successful graduates receive a Turkish civil aviation (SHGM) recognised licence.' },
            ].map((item, i) => (
              <div key={item.phase} className="flex gap-4 items-start">
                <div className="bg-orange-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">{i + 1}</div>
                <div className="card p-4 flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-slate-900">{item.phase}</h3>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-semibold">{item.days}</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-3">Finding a Beginner Course</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Beginner courses run from several approved paragliding schools in the Fethiye-Ölüdeniz region. Ask at the Babadağ Association office for accredited school recommendations. Most courses run in April–May and September–October — the best flying seasons for learning. July and August are not recommended for beginner training due to the strong thermal conditions.</p>
          </div>
        </div>
      </section>
      <BookingCTA title="Questions About Training?" subtitle="Contact us and we'll connect you with accredited training schools near Ölüdeniz." variant="dark" />
    </>
  )
}
