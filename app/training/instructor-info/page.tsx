import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Paragliding Instructors Ölüdeniz | Qualified Instructors',
  description: 'How to find a qualified paragliding instructor at Ölüdeniz. Turkish instructor qualifications, what to check and how the Babadağ training community is organised.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/training/instructor-info' },
}

export default function InstructorInfoPage() {
  return (
    <>
      <PageHero title="Paragliding Instructors" subtitle="How to find and verify a qualified paragliding instructor at Ölüdeniz." badge="Instructors" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Training', href: '/training' }, { label: 'Instructor Info' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <p className="text-slate-600 leading-relaxed mb-8">Choosing the right instructor is one of the most important decisions a new paraglider pilot makes. At Ölüdeniz and Babadağ, a community of experienced instructors operates across beginner, intermediate and advanced levels — with both Turkish and internationally certified qualifications.</p>
          <div className="space-y-5 mb-10">
            {[
              { title: 'Turkish SHGM Qualification', emoji: '🇹🇷', desc: 'Instructors teaching in Turkey must hold a Turkish SHGM (Sivil Havacılık Genel Müdürlüğü) instructor rating. This is issued after passing theory and practical assessments, and must be renewed periodically. Ask to see your instructor\'s current SHGM rating card before committing to a course.' },
              { title: 'International Ratings', emoji: '🌍', desc: 'Many instructors at Ölüdeniz also hold internationally recognised ratings from BHPA (British), FFVL (French), DHV (German) or CIVL. These ratings indicate the instructor has met internationally benchmarked standards. Some visiting instructors (for SIV, acro and coaching clinics) hold international ratings only — verify Turkish legality for any commercial instruction.' },
              { title: 'Experience at Babadağ', emoji: '🏔️', desc: 'Local knowledge matters enormously at a complex site like Babadağ. An instructor who has been flying and teaching here for multiple seasons understands the site\'s specific risks, conditions and student challenges in a way that a generic qualified instructor from elsewhere would not. Ask how many seasons your instructor has worked at Babadağ.' },
              { title: 'Finding Instructors', emoji: '🔍', desc: 'The Babadağ Association maintains a list of approved instructors and schools operating from the site. Start there. Word-of-mouth recommendations from pilots in the community Telegram group are also valuable. Avoid instructors who cannot produce their current licence documentation.' },
              { title: 'Red Flags', emoji: '⚠️', desc: 'Be cautious of: instructors who cannot show current documentation, schools advertising unusually short course durations, anyone who downplays the importance of reserve parachutes or SIV training, and any operator who does not have public liability insurance for training activities.' },
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
        </div>
      </section>
    </>
  )
}
