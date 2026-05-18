import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Paramotor Rules Turkey | PPG Airspace Regulations Ölüdeniz',
  description: 'Turkish paramotor rules and airspace regulations. SHGM requirements, no-fly zones near Ölüdeniz, Babadağ airspace and PPG licence requirements in Turkey.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/paramotor/rules' },
}

export default function ParamotorRulesPage() {
  return (
    <>
      <PageHero title="Paramotor Rules & Airspace" subtitle="Turkish CAA regulations, Babadağ airspace rules and no-fly zones for paramotor pilots." badge="Rules" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Paramotor', href: '/paramotor' }, { label: 'Rules' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="space-y-5">
            {[
              { title: 'SHGM Registration', icon: '📝', desc: 'All paramotor pilots flying in Turkey must register their equipment with the SHGM (Turkish Directorate General of Civil Aviation). Foreign visitors should carry their home-country licence and equipment documentation. Check SHGM\'s current policy for visiting foreign pilots as rules evolve.' },
              { title: 'Altitude Limits', icon: '📏', desc: 'Uncontrolled airspace in Turkey has a ceiling of 500ft AGL in most areas. Flying above 500ft AGL requires ATC clearance unless you are in designated free-flight airspace (such as the Babadağ sector). Check the relevant chart before flight.' },
              { title: 'Babadağ Airspace', icon: '🏔️', desc: 'The Babadağ area has designated free-flight airspace that extends to significant altitude. Paramotor pilots entering this zone must coordinate with the Babadağ Association and respect right-of-way rules that give priority to unpowered aircraft. Powered aircraft must give way to gliders and free-flight paragliders.' },
              { title: 'No-Fly Zones', icon: '🚫', desc: 'Military areas, national parks, and zones above populated areas are restricted. The Fethiye region has military zones to the east — check military NOTAMs before any cross-country flight. Flying over beaches with crowds is restricted during peak hours.' },
              { title: 'Night Flying', icon: '🌙', desc: 'Night flying with paramotors is prohibited without special authorisation. This is strictly enforced in Turkey. Flights must be conducted in VMC (Visual Meteorological Conditions) only.' },
              { title: 'Third-Party Insurance', icon: '🛡️', desc: 'Third-party liability insurance is compulsory for all paramotor operations in Turkey. Your home country policy may cover Turkey — verify this in writing before departing. Minimum coverage requirements apply.' },
            ].map(rule => (
              <div key={rule.title} className="card p-5">
                <div className="flex gap-4 items-start">
                  <span className="text-2xl">{rule.icon}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">{rule.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{rule.desc}</p>
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
