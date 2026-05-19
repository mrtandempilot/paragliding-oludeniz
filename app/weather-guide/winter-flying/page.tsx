import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Winter Paragliding Ölüdeniz | Off-Season Flying Babadağ November–March',
  description: 'Can you paraglide at Ölüdeniz in winter? Off-season flying conditions at Babadağ from November to March — what to expect and whether it is worth it.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/weather-guide/winter-flying' },
}

export default function WinterFlyingPage() {
  return (
    <>
      <PageHero title="Winter Flying at Ölüdeniz" subtitle="Off-season conditions, closures and what winter paragliding at Babadağ looks like." badge="Winter Season" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Weather Guide', href: '/weather-guide' }, { label: 'Winter Flying' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8">
            <p className="text-blue-800 text-sm"><strong>Off-Season Reality:</strong> The Babadağ launch operates primarily from April to October. Winter operations (November–March) are limited to occasional flyable days when conditions allow. Commercial tandem operations do not run year-round. Solo pilots who know the site can sometimes fly in winter.</p>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-5">Winter Conditions at Babadağ</h2>
          <p className="text-slate-600 leading-relaxed mb-5">Winter in the Fethiye region is mild by European standards — Ölüdeniz town rarely sees frost and the sea temperature stays above 16°C through the winter. However, the Babadağ summit at 1966m is a different matter: snow, ice on the launch approach road, and significantly stronger and more variable winds are common from December through February.</p>
          <p className="text-slate-600 leading-relaxed mb-8">Thermals are weak to non-existent in winter. Flying is possible on coastal soaring days — when a steady onshore breeze allows ridge soaring at lower altitudes — but the thermalling conditions that make Babadağ special are absent until April.</p>

          <div className="space-y-4 mb-10">
            {[
              { month: 'November', conditions: 'Variable', desc: 'Early November can still produce good flying days as the summer pattern slowly breaks down. Rain days increase through the month. The last weekend of the season often falls in early November. Tandem operators close progressively through October–November.' },
              { month: 'December–January', conditions: 'Mostly closed', desc: 'These are the quietest months. The mountain road may be affected by snow or ice. Commercial tandem operations are suspended. Occasional coastal soaring is possible for local solo pilots on clear days with steady onshore breeze.' },
              { month: 'February', conditions: 'Improving slowly', desc: 'The days begin to lengthen and the first warm spells hint at the approaching season. Flying is still limited but experienced local pilots will take any decent weather window. The mountain is often spectacular with snow on the upper sections.' },
              { month: 'March', conditions: 'Season preparation', desc: 'March is setup month. Operators and the Association are preparing for the season. Occasional flying happens, particularly in the second half of the month when conditions can briefly feel almost summer-like. Not a reliable month for visiting specifically to fly.' },
            ].map(item => (
              <div key={item.month} className="card p-5">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-slate-900">{item.month}</h3>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.conditions === 'Mostly closed' ? 'bg-red-100 text-red-700' : item.conditions === 'Variable' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{item.conditions}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-3">Should You Visit in Winter to Fly?</h3>
            <p className="text-slate-600 text-sm leading-relaxed">If paragliding is your primary reason for visiting Ölüdeniz, winter is not the right time. Save the trip for April–October. However, if you are visiting the region for other reasons (the ancient Lycian sites, the quieter beaches, the local culture) and would like to fly if conditions allow, contact local operators in advance to check current flyability.</p>
          </div>
        </div>
      </section>
    </>
  )
}
