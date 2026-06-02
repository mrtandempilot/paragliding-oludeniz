import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Solo Paragliding Flight Rules Ölüdeniz | Babadağ Airspace',
  description: 'Turkish aviation rules and Babadağ-specific flight regulations for solo paragliders. Airspace limits, mandatory approach paths, and local rules explained.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/solo-paragliding/flight-rules' },
}

export default function FlightRulesPage() {
  return (
    <>
      <PageHero title="Flight Rules & Airspace" subtitle="Turkish aviation rules and Babadağ local regulations for licensed pilots." badge="Pilot Info" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Solo Paragliding', href: '/solo-paragliding' }, { label: 'Flight Rules' }]} /></div></div>

      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Turkish Civil Aviation Rules for Paragliding</h2>
          <p className="text-slate-600 leading-relaxed mb-6">Paragliding in Turkey is regulated by the Directorate General of Civil Aviation (Sivil Havacılık Genel Müdürlüğü — SHGM). All pilots must comply with Turkish aviation law and local site rules.</p>

          <div className="space-y-6">
            {[
              { title: 'Altitude Limits', content: 'The Babadağ area has specific altitude restrictions to protect commercial air traffic. Maximum altitude above the beach landing zone is limited. Current limits are posted at the launch area. Do not exceed without prior clearance from the Association.' },
              { title: 'Approach Path Rules', content: 'The main beach landing zone has a mandatory approach corridor. All pilots must follow the designated approach path, especially during busy periods. Cutting across other pilots\' approaches is strictly prohibited.' },
              { title: 'Right of Way', content: 'Standard free-flight right of way rules apply: glider on your right has right of way, overtaking from the left only, thermal entry and exit rules apply. Lower altitude glider has right of way in the approach zone.' },
              { title: 'Restricted Zones', content: 'The Blue Lagoon national park has restricted low-altitude flying zones. Do not fly below 200m over the lagoon itself during peak beach hours. The area above the beach landing zone is a landing corridor — no thermalling below 100m AGL.' },
              { title: 'Radio', content: 'A radio is strongly recommended and required for some launches. The Babadağ coordination frequency is posted at the launch. All pilots should monitor this frequency during flight.' },
              { title: 'Alcohol & Drugs', content: 'Flying under the influence of alcohol or any impairing substance is illegal under Turkish law and will result in immediate removal from the site and potential legal action.' },
            ].map(rule => (
              <div key={rule.title} className="card p-5">
                <h3 className="font-bold text-slate-900 mb-2">{rule.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{rule.content}</p>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mt-8">
            <p className="font-bold text-amber-800 mb-2">⚠️ Always Check Current Rules</p>
            <p className="text-amber-700 text-sm">Rules can change between seasons. Always obtain the current briefing and airspace map from the Babadağ Paragliding Association office at the 1700m station on your first day.</p>
          </div>
        </div>
      </section>
    </>
  )
}
