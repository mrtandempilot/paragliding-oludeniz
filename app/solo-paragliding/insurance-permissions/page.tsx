import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Babadağ Pilot Pass & Insurance | Solo Paragliding Ölüdeniz',
  description: 'How to get a pilot pass for Babadağ paragliding. Day, weekly and season passes explained. Insurance requirements for solo pilots.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/solo-paragliding/insurance-permissions' },
}

export default function InsurancePermissionsPage() {
  return (
    <>
      <PageHero title="Pilot Passes & Insurance" subtitle="How to get permission to fly solo from Babadağ and what insurance you need." badge="Pilot Info" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Solo Paragliding', href: '/solo-paragliding' }, { label: 'Insurance & Passes' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Pilot Passes</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">All solo pilots flying from Babadağ must purchase a pass from the Babadağ Paragliding Association office at the 1700m station. Passes are purchased on-site — no advance online booking required.</p>
              <div className="space-y-3">
                {[
                  { type: 'Day Pass', price: '€15', detail: 'Valid for one calendar day. Multiple flights allowed.' },
                  { type: 'Weekly Pass', price: '€80', detail: '7 consecutive days from purchase date.' },
                  { type: 'Monthly Pass', price: '€250', detail: '30 days from purchase date.' },
                  { type: 'Season Pass', price: '€600', detail: 'Full April–October season.' },
                ].map(p => (
                  <div key={p.type} className="card p-4 flex justify-between items-start">
                    <div><p className="font-bold text-slate-900">{p.type}</p><p className="text-sm text-slate-500">{p.detail}</p></div>
                    <span className="text-orange-500 font-bold text-lg">{p.price}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Insurance Requirements</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">Third-party liability insurance is mandatory for all pilots at Babadağ. Minimum coverage: €300,000 per incident.</p>
              <div className="bg-slate-50 rounded-xl p-5 space-y-3 text-sm text-slate-600">
                <p><strong className="text-slate-900">Accepted policies:</strong> Any national paragliding federation insurance, specialist adventure sports policies (Allianz, FFVL, BHPA, DHV, etc.)</p>
                <p><strong className="text-slate-900">Proof required:</strong> Current insurance certificate showing your name, dates of validity, and coverage amount.</p>
                <p><strong className="text-slate-900">Expired insurance:</strong> Flying with expired insurance is prohibited and grounds for removal from the site.</p>
                <p><strong className="text-slate-900">On-site purchase:</strong> Short-term insurance is not available on-site. Arrange your insurance before travelling.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
