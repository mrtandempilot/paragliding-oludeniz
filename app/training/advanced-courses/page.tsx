import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Advanced Paragliding Courses Ölüdeniz | P3 EP Training Turkey',
  description: 'Advanced paragliding training at Ölüdeniz. P3/EP licence courses, XC coaching, speed flying training and guided flying weeks at Babadağ Turkey.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/training/advanced-courses' },
}

export default function AdvancedCoursesPage() {
  return (
    <>
      <PageHero title="Advanced Training Courses" subtitle="Take your paragliding to the next level with advanced coaching at Babadağ." badge="Advanced Training" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Training', href: '/training' }, { label: 'Advanced Courses' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <p className="text-slate-600 leading-relaxed mb-8">Babadağ's diverse conditions — from calm morning air to strong peak-season thermals — make it an outstanding venue for advanced pilot development. Pilots with 50–200+ hours regularly visit specifically to progress their skills under the guidance of Babadağ's experienced local coaching team.</p>
          <div className="space-y-5 mb-10">
            {[
              { title: 'P3/EP Licence Upgrade', emoji: '🎓', desc: 'Pilots with P2/CP licences and 30+ hours can progress to P3/EP (European standard Pilot licence). The upgrade involves an assessment of thermal flying technique, emergency procedures, navigation and meteorology. It unlocks XC flying and access to more challenging sites.' },
              { title: 'XC Coaching Clinics', emoji: '🗺️', desc: 'One-week XC coaching camps run by experienced local pilots. Typically 4–6 students with one coach. Daily pre-flight briefings, guided XC tasks, debrief with tracklog analysis. Covers thermal reading, route planning, decision-making in the air and retrieve organisation.' },
              { title: 'Guided Flying Weeks', emoji: '✈️', desc: 'Not a formal course — a week of guided flying with an experienced local pilot. Perfect for competent pilots visiting for the first time who want to understand the Babadağ airspace, thermal cycle, and XC routes before flying independently. Highly recommended for first-season visitors.' },
              { title: 'Acro Progression (Post-SIV)', emoji: '🪂', desc: 'For pilots who have completed SIV training and want to progress toward aerobatics. Structured progression: wing-overs → asymmetric SAT → helicopter. Only available from coaches with specific acro qualifications. Limited availability — book months ahead.' },
              { title: 'Competition Preparation', emoji: '🏆', desc: 'Pilots preparing for PWC, European or national competitions can work with local coaches on task flying, start gate tactics, speed optimisation and competition meteorology. Babadağ\'s active thermal environment is excellent for competition-style training.' },
            ].map(item => (
              <div key={item.title} className="card p-5">
                <div className="flex gap-3 items-start">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-slate-50 rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-3">Booking Advanced Training</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Advanced courses and coaching clinics are announced through the pilot community Telegram group and at the Babadağ Association office. Places are limited and fill quickly, especially for the September coaching clinics. Make contact with instructors at least 4–6 weeks before your intended visit.</p>
          </div>
        </div>
      </section>
    </>
  )
}
