import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Babadağ 1200m Launch | Lower Takeoff Point Ölüdeniz Paragliding',
  description: 'Babadağ 1200m launch point guide. How to access, wind conditions, who uses the lower launch, and when the 1200m takeoff is preferred over higher launches.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/babadag-guide/takeoff-1200m' },
}

export default function Takeoff1200mPage() {
  return (
    <>
      <PageHero title="1200m Launch — Babadağ" subtitle="The lower launch point, used in specific wind conditions and for training flights." badge="Launch 1200m" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Babadağ Guide', href: '/babadag-guide' }, { label: '1200m Launch' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Altitude', value: '1,200m ASL' },
              { label: 'Flight to beach', value: '~25 min' },
              { label: 'Access', value: 'Road + short hike' },
              { label: 'Best wind', value: 'S-SW, lighter days' },
            ].map(item => (
              <div key={item.label} className="card p-4 text-center">
                <div className="text-xl font-bold text-orange-600 mb-1">{item.value}</div>
                <div className="text-slate-500 text-xs">{item.label}</div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-5">About the 1200m Launch</h2>
          <p className="text-slate-600 leading-relaxed mb-5">The 1200m launch on Babadağ is a secondary takeoff point used when the upper launches (1700–1900m) are unsuitable due to wind strength or direction. On days when the upper mountain has excessive wind, this lower launch often offers calmer, more manageable conditions.</p>
          <p className="text-slate-600 leading-relaxed mb-8">It is also used for training flights by solo pilots who want a shorter, lower-altitude experience to practise specific skills. The shorter flight time (approximately 20–30 minutes to the main beach) makes it suitable for a quick flight when time is limited.</p>

          <div className="space-y-4 mb-8">
            {[
              { title: 'When is the 1200m Launch Used?', desc: 'This launch comes into use when upper launches have winds above the safe limit (typically above 30-35km/h), when pilots specifically request a shorter flight, or when afternoon conditions have deteriorated at altitude but remain flyable lower down.' },
              { title: 'Access', desc: 'The 1200m point is accessible via the main Babadağ road with a short 10-15 minute walk from the nearest vehicle access point. There is no cable car to this altitude — transport is by minibus to the road access point.' },
              { title: 'Launch Conditions', desc: 'The launch is south to south-west facing. It works best in light to moderate southerly flow. The area is more sheltered than the upper launches but can be affected by valley-generated turbulence in the afternoon.' },
            ].map(item => (
              <div key={item.title} className="card p-5">
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
