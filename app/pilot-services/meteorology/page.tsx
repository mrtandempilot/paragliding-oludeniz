import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Weather Forecasting Tools Babadağ | Paragliding Ölüdeniz',
  description: 'Best weather forecast resources for paragliding at Babadağ and Ölüdeniz. Windguru, Meteogram, XCSkies, Skysight and how to read paragliding-specific forecasts.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/pilot-services/meteorology' },
}

const tools = [
  { name: 'Windguru', url: 'windguru.cz', type: 'Wind forecast', desc: 'The most widely used wind forecast tool at Babadağ. Set up a station for the Babadağ summit and the Ölüdeniz landing zone. The 3-day forecast is reliable; beyond 5 days treat as indicative only. Check both summit and sea-level stations to understand the difference.' },
  { name: 'Meteogram (Windy.com)', url: 'windy.com', type: 'Atmospheric model', desc: 'Excellent for visualising wind layers at different altitudes simultaneously. Set the altitude to 1700m for launch conditions, 3000m for cloudbase forecast. The pressure layer view shows the synoptic wind pattern driving local conditions.' },
  { name: 'XCSkies', url: 'xcskies.com', type: 'Thermal forecast', desc: 'Paragliding-specific forecast that predicts thermal strength, cloudbase, cross-country potential and soarable hours for each day. One of the best tools for planning XC flying. Shows an XC flyability index that experienced pilots use as a daily planning tool.' },
  { name: 'Skysight', url: 'skysight.io', type: 'Premium XC forecast', desc: 'Premium service with high-resolution thermal forecasting. Used by competitive XC pilots for task planning. Shows thermal strength, cloudbase, blue thermals, convergence zones and cloud shadows. Worth the subscription for pilots visiting specifically for XC flying.' },
  { name: 'Babadağ Association Briefing', url: 'On site', type: 'Local briefing', desc: 'The daily 08:30 briefing at the 1700m launch is the most valuable weather input of the day. The Association\'s experienced briefers combine multiple forecast models with local empirical knowledge — their read of whether the day is a "9:00 day", a "10:00 day" or a "not today" is often more accurate than any single model.' },
]

export default function MeteorologyPage() {
  return (
    <>
      <PageHero title="Weather Forecasting Tools" subtitle="The best meteorology resources for planning your Babadağ flying days." badge="Met Tools" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Pilot Services', href: '/pilot-services' }, { label: 'Meteorology' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <p className="text-slate-600 leading-relaxed mb-8">Good weather analysis is a core pilot skill. At Babadağ, the combination of mountain, valley and coastal effects creates a microclimate that generic forecasts don't always capture well. These tools — used together — give experienced pilots the best picture of what each day will deliver.</p>
          <div className="space-y-5">
            {tools.map(t => (
              <div key={t.name} className="card p-5">
                <div className="flex flex-wrap gap-2 items-center mb-3">
                  <h3 className="font-bold text-slate-900">{t.name}</h3>
                  <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">{t.type}</span>
                  <span className="text-slate-400 text-xs">{t.url}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
