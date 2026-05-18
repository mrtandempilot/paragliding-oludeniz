import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Babadağ 1800m Launch | High Altitude XC Takeoff Ölüdeniz',
  description: 'Babadağ 1800m launch point for experienced paragliders. Higher altitude launch for XC flights and strong thermal days. Access, conditions and who can use this launch.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/babadag-guide/takeoff-1800m' },
}

export default function Takeoff1800mPage() {
  return (
    <>
      <PageHero title="1800m Launch — Babadağ" subtitle="The intermediate high launch — favoured on strong days by experienced XC pilots." badge="Launch 1800m" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Babadağ Guide', href: '/babadag-guide' }, { label: '1800m Launch' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Altitude', value: '1,800m ASL' },
              { label: 'Access', value: '30 min hike from 1700m' },
              { label: 'Level', value: 'Experienced pilots' },
              { label: 'Best for', value: 'XC & strong days' },
            ].map(item => (
              <div key={item.label} className="card p-4 text-center">
                <div className="text-xl font-bold text-orange-600 mb-1">{item.value}</div>
                <div className="text-slate-500 text-xs">{item.label}</div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-5">The 1800m Launch</h2>
          <p className="text-slate-600 leading-relaxed mb-5">The 1800m launch sits above the main plateau and is reached by a 25–35 minute hike from the 1700m area. The extra altitude gives XC pilots a significant advantage — more height means more time to find thermals and connect to the day's lift system before committing to a route.</p>
          <p className="text-slate-600 leading-relaxed mb-8">On strong thermal days when the 1700m launch becomes turbulent close to the ground, the 1800m launch often offers cleaner conditions and a less congested launch area. It is used primarily by experienced solo pilots rather than tandems.</p>

          <div className="space-y-4">
            {[
              { title: 'Who Uses This Launch', desc: 'Primarily experienced solo paraglider pilots (P3/EP and above) planning XC flights. Some tandems use it on very calm days or for sunrise flights. The hike is non-trivial with equipment — bring at least 1.5L water and allow extra time.' },
              { title: 'Launch Conditions', desc: 'The 1800m launch faces south and is less sheltered than the 1700m area. Wind effects at this altitude can be stronger and more variable. Experience in reading the sky and interpreting wind indicators is essential. Do not launch if you are uncertain about conditions.' },
              { title: 'XC Advantage', desc: 'Launching 100m higher translates directly to more time in the air and a better start position for XC routes north to Kayaköy and Göcek. On days with a 2500m cloudbase, launching from 1800m can be the difference between completing a 40km flight and landing short.' },
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
