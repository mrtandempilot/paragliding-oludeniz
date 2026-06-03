import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Babadağ 1700m Launch | Main Tandem Takeoff Ölüdeniz',
  description: 'Babadağ 1700m launch — the primary takeoff point for tandem and solo paragliding. Facilities, wind requirements, timing and what to expect at the main launch.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/babadag-guide/takeoff-1700m' },
}

export default function Takeoff1700mPage() {
  return (
    <>
      <PageHero title="1700m Launch — Babadağ" subtitle="The main launch plateau and hub of all paragliding activity at Babadağ." badge="Launch 1700m" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Babadağ Guide', href: '/babadag-guide' }, { label: '1700m Launch' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Altitude', value: '1,700m ASL' },
              { label: 'Flight to beach', value: '25–45 min' },
              { label: 'Access', value: 'Minibus / teleferik' },
              { label: 'Best wind', value: 'S-SE, 10–25 km/h' },
            ].map(item => (
              <div key={item.label} className="card p-4 text-center">
                <div className="text-xl font-bold text-orange-600 mb-1">{item.value}</div>
                <div className="text-slate-500 text-xs">{item.label}</div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-5">The Main Launch Plateau</h2>
          <p className="text-slate-600 leading-relaxed mb-5">The 1700m plateau is the beating heart of Babadağ paragliding. This is where you'll find the Association office, pilot cafés, equipment storage, and the primary launch area that handles the majority of all flights — both tandem and solo. On a typical summer day, 200–300 flights depart from this area.</p>
          <p className="text-slate-600 leading-relaxed mb-8">The launch itself is a wide, grass-covered slope facing broadly south-southeast. The gradient is consistent, the surface is well-maintained, and there is ample room for multiple simultaneous launches when conditions allow. A launch coordinator manages traffic during peak periods.</p>

          <div className="space-y-4 mb-8">
            {[
              { title: 'Facilities at 1700m', desc: 'Two pilot cafés serving hot and cold food and drinks. Association office with daily weather briefings at 08:30. Equipment rental and storage. WC facilities. Tandem pilot briefing area with benches for passengers. Shade shelters for waiting.' },
              { title: 'Wind Requirements', desc: 'Ideal conditions at the 1700m launch are a steady south to south-east wind of 10–25 km/h. The launch faces well into this flow. Northerly winds require a reverse launch approach — experienced pilots only. Winds above 35 km/h typically trigger temporary suspension of flights.' },
              { title: 'Launch Timing', desc: 'The first flights launch around 08:30–09:00 as morning thermals begin to trigger. Peak activity is from 10:00–14:00. A mid-afternoon lull sometimes occurs as sea breeze strengthens. Evening flying resumes 16:00–18:00 in calm conditions. Sunset flights launch 30 minutes before dusk.' },
              { title: 'Tandem Launch Process', desc: 'Tandem passengers are briefed at the launch area before departure. The pilot sets up the glider, asks you to stand at the front of the harness, and then you run together into the wind off the slope. The run is typically only 3–5 steps before you are airborne. No experience or fitness required.' },
            ].map(item => (
              <div key={item.title} className="card p-5">
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
            <h3 className="font-bold text-slate-900 mb-2">Morning Briefing</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Every day at 08:30, the Babadağ Association holds a weather briefing at the 1700m office. Attending this briefing — even as a tandem passenger — gives you valuable insight into the day's flying conditions and expected schedule.</p>
          </div>
        </div>
      </section>
    </>
  )
}
