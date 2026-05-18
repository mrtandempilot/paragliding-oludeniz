import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'BASE Jump Permissions Turkey | Legal Status Babadağ Ölüdeniz',
  description: 'BASE jumping legal status in Turkey. Permits required for Babadağ, how to obtain authorisation, and what happens if you jump without permission.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/base-jump/permissions' },
}

export default function BasePermissionsPage() {
  return (
    <>
      <PageHero title="BASE Jump Permissions & Legality" subtitle="Turkish law, permit requirements, and how to jump legally at Babadağ." badge="Permissions" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'BASE Jump', href: '/base-jump' }, { label: 'Permissions' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">
            <p className="text-amber-800 text-sm"><strong>Legal Notice:</strong> Turkish aviation and extreme sports law is subject to change. This page provides general guidance only. Always consult with the Turkish Directorate General of Civil Aviation (SHGM) and local authorities for current, binding information before planning any BASE jump activity.</p>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-6">Legal Framework</h2>
          <div className="space-y-5 mb-10">
            {[
              {
                title: 'Turkish Civil Aviation Authority (SHGM)',
                desc: 'All airspace activities in Turkey — including BASE jumping — fall under the jurisdiction of the SHGM (Sivil Havacılık Genel Müdürlüğü). BASE jumping from elevated objects requires prior notification and, in most cases, a specific permit from the SHGM and from local authorities who control the land from which you jump.',
              },
              {
                title: 'Military Zones',
                desc: 'Significant parts of the Babadağ area are adjacent to or within Turkish military controlled zones. These areas require additional clearance from the Turkish Armed Forces. Jumping without military zone clearance is a serious offence.',
              },
              {
                title: 'Land Access Permission',
                desc: 'In addition to airspace permission, you need land access rights for the exit point. Much of Babadağ is managed by the local municipality or forestry authority. Written permission from the land owner or manager is required.',
              },
              {
                title: 'Insurance Requirements',
                desc: 'Third-party liability insurance is required for any organised sporting activity in Turkey. Some authorities also require personal accident insurance with coverage up to a specified minimum. International policies from your home country may be acceptable — verify this before arrival.',
              },
            ].map(item => (
              <div key={item.title} className="card p-5">
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-white mb-3">The Permission Process</h3>
            <ol className="space-y-3">
              {[
                'Contact the SHGM (shgm.gov.tr) 4–6 weeks before your planned jump date',
                'Submit your BASE jumping credentials, insurance documentation and intended exit point',
                'Obtain SHGM authorisation in writing',
                'Contact the local municipality (Fethiye) for land access permission',
                'Verify military zone status for your specific exit point',
                'Notify the Babadağ Association office on arrival',
              ].map((step, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  <span className="text-slate-300 text-sm">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <h3 className="font-bold text-red-900 mb-2">Consequences of Jumping Without Permission</h3>
            <p className="text-red-800 text-sm leading-relaxed">Unauthorised BASE jumping in Turkey can result in immediate detention, equipment confiscation, substantial fines and deportation. Turkish authorities take airspace violations seriously. Do not assume that jumping at dawn or in remote areas will go unnoticed — mountain areas are monitored.</p>
          </div>
        </div>
      </section>
    </>
  )
}
