import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Babadağ 1900m Summit Launch | Highest Takeoff Turkey',
  description: 'Babadağ 1900m near-summit launch. The highest paragliding takeoff point at Babadağ. Hike route, conditions, altitude sickness risks and who this launch is for.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/babadag-guide/takeoff-1900m' },
}

export default function Takeoff1900mPage() {
  return (
    <>
      <PageHero title="1900m Summit Launch — Babadağ" subtitle="The highest launch point — stunning views and serious XC starts for experienced pilots." badge="Summit Launch" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Babadağ Guide', href: '/babadag-guide' }, { label: '1900m Launch' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Altitude', value: '~1,900m ASL' },
              { label: 'Hike from 1700m', value: '60–80 minutes' },
              { label: 'Level', value: 'Advanced+ only' },
              { label: 'Season', value: 'May–October' },
            ].map(item => (
              <div key={item.label} className="card p-4 text-center">
                <div className="text-xl font-bold text-orange-600 mb-1">{item.value}</div>
                <div className="text-slate-500 text-xs">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 text-sm text-red-800">
            <strong>Experienced Pilots Only:</strong> The 1900m launch is for advanced and expert pilots with significant Babadağ experience. Do not attempt this launch without prior experience at the lower launches and local knowledge of conditions at altitude.
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-5">The Highest Launch</h2>
          <p className="text-slate-600 leading-relaxed mb-5">The near-summit launch at approximately 1900m ASL is Babadağ's premium launch point for serious XC pilots. The views from this altitude are genuinely spectacular — the entire Fethiye Bay, the Blue Lagoon, and on clear days the Greek islands are all visible simultaneously.</p>
          <p className="text-slate-600 leading-relaxed mb-8">The extra altitude compared to the 1700m launch gives pilots a significantly better start position for long XC routes. On good thermal days with a 3000m+ cloudbase, launching from here can add 20–30 minutes of useful soaring time to a flight and potentially unlock routes that are not reachable from lower launches.</p>

          <div className="space-y-4 mb-8">
            {[
              { title: 'Hike to the Summit Launch', desc: 'The hike from the 1700m plateau takes approximately 60–80 minutes with paragliding equipment. The trail is clear but steep in sections. Bring at least 2L of water, sun protection, and allow extra time for the conditions assessment once you arrive at the top.' },
              { title: 'Altitude Sickness Risk', desc: 'At 1900m, altitude sickness is unlikely for most healthy adults but possible for those who arrived at sea level very recently. Headache, nausea, and reduced coordination are warning signs. Do not launch if you feel unwell — altitude sickness impairs decision-making dangerously.' },
              { title: 'Launch Complexity', desc: 'The summit area can be exposed to wind from multiple directions simultaneously due to the ridgeline geometry. Reading the conditions requires experience. Wind that appears calm at the 1700m area can be significantly stronger at the summit. Check conditions thoroughly before setup.' },
              { title: 'Descent if Not Flying', desc: 'If you hike up and conditions are not flyable, you face a descent on foot with full equipment. This is physically demanding. Do not commit to the hike unless you are comfortable with this outcome.' },
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
