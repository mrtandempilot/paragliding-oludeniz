import type { Metadata } from 'next'
import { CheckCircle, XCircle } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Solo Paragliding Gear Requirements | What You Need to Fly',
  description: 'Equipment requirements for solo paragliders at Babadağ, Ölüdeniz. Glider certification, harness, reserve, radio and instrument requirements.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/solo-paragliding/equipment-requirements' },
}

export default function EquipmentRequirementsPage() {
  return (
    <>
      <PageHero title="Equipment Requirements" subtitle="What gear you need to fly solo from Babadağ, Ölüdeniz." badge="Pilot Info" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Solo Paragliding', href: '/solo-paragliding' }, { label: 'Equipment Requirements' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Required Equipment for Babadağ</h2>
          <div className="space-y-5">
            {[
              { item: 'Main Paraglider', req: 'EN A, B, C or D certified. Must be in airworthy condition. If you have a glider check certificate, bring it. Gliders over 10 years old may be subject to inspection.', required: true },
              { item: 'Reserve Parachute', req: 'Mandatory. Must be within repacking date (within 6 months of last repack). Bring your repack card/certificate as proof.', required: true },
              { item: 'Harness', req: 'Any certified harness in good condition. Airbag or foam back protection recommended but not required.', required: true },
              { item: 'Helmet', req: 'EN 966 certified paragliding helmet required. Bicycle or motorcycle helmets are not acceptable.', required: true },
              { item: 'Radio', req: 'A radio is strongly recommended and required for some launch points. Standard frequencies are used — ask at the Association office.', required: false },
              { item: 'Vario / GPS', req: 'Not required but strongly recommended, especially for XC flying. XCtrack or XCsoar with Babadağ airspace loaded is advised.', required: false },
              { item: 'Rescue Beacon', req: 'Not required but recommended for XC flights into remote areas.', required: false },
            ].map(e => (
              <div key={e.item} className="card p-5 flex gap-4">
                {e.required ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /> : <div className="w-5 h-5 border-2 border-slate-300 rounded-full flex-shrink-0 mt-0.5" />}
                <div><p className="font-semibold text-slate-900 mb-1">{e.item} {e.required && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full ml-1">Required</span>}</p><p className="text-sm text-slate-600">{e.req}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
