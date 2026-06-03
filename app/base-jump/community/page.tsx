import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'BASE Jumping Community Ölüdeniz | Jumpers Network Turkey',
  description: 'Connect with the BASE jumping community at Ölüdeniz. How to make contact, community events, and integrating with the local jumping scene.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/base-jump/community' },
}

export default function BaseCommunityPage() {
  return (
    <>
      <PageHero title="BASE Community at Ölüdeniz" subtitle="Connect with the experienced jumpers who call Babadağ their home mountain." badge="Community" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'BASE Jump', href: '/base-jump' }, { label: 'Community' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <p className="text-slate-600 leading-relaxed mb-8">The BASE jumping community at Ölüdeniz is small, tight-knit, and serious about safety. Visiting jumpers who approach with respect, proper credentials and a willingness to learn local conditions are welcomed. Those who arrive with a cavalier attitude are not.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {[
              { title: 'Making Contact', emoji: '📞', desc: 'The best way to connect with local BASE jumpers is through international BASE networks before you arrive. Post in respected BASE forums with your credentials and travel plans. Local jumpers monitor these channels and reach out to visiting jumpers with good standing.' },
              { title: 'Pilot Community Overlap', emoji: '🪂', desc: 'There is significant overlap between the paragliding and BASE communities at Babadağ. The pilot cafés at the 1700m launch are common ground. Arriving as a paraglider pilot — even if you also BASE jump — gives you natural access to the community.' },
              { title: 'Safety Culture', emoji: '🛡️', desc: 'The local community has a strict safety culture. Jumpers are expected to have a current BASE logbook, valid insurance, and verifiable experience. Exaggerating credentials is quickly discovered and will exclude you from the community.' },
              { title: 'Seasonal Presence', emoji: '📅', desc: 'Most BASE activity happens from May to October. The core local community is present throughout the season. Visiting jumpers tend to concentrate in May, June and September when conditions are most consistent.' },
            ].map(item => (
              <div key={item.title} className="card p-5">
                <span className="text-2xl mb-3 block">{item.emoji}</span>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-6">
            <h3 className="font-bold text-white mb-3">Approach With Respect</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-3">Ölüdeniz is primarily a paragliding destination. The BASE jumping community exists here at the tolerance of the broader aviation community and local authorities. Jumpers who behave irresponsibly risk spoiling access for everyone.</p>
            <p className="text-slate-300 text-sm leading-relaxed">The cardinal rule: never jump without permits, never jump alone on a new exit, and always debrief with the community after jumping. These norms exist because people have died not following them.</p>
          </div>
        </div>
      </section>
    </>
  )
}
