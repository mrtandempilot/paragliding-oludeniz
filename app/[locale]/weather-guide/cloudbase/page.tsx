import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Cloudbase at Babadağ | Paragliding Cloudbase Guide Ölüdeniz',
  description: 'Cloudbase heights at Babadağ throughout the season. What cloudbase means for paragliding, typical heights by month and how to read cloud indicators at Ölüdeniz.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/weather-guide/cloudbase' },
}

export default function CloudbasePage() {
  return (
    <>
      <PageHero title="Cloudbase at Babadağ" subtitle="Understanding thermal cloudbase and what it means for your paragliding experience." badge="Cloudbase Guide" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Weather Guide', href: '/weather-guide' }, { label: 'Cloudbase' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-5">What is Cloudbase?</h2>
          <p className="text-slate-600 leading-relaxed mb-5">Cloudbase is the altitude at which thermals reach the dew point and form cumulus clouds. For paraglider pilots, it represents the upper limit of the thermal climb — the ceiling of the day's lift system. A higher cloudbase means more altitude, more time in the air, and longer potential XC distances.</p>
          <p className="text-slate-600 leading-relaxed mb-8">At Babadağ, the cloudbase is one of the highest of any paragliding site in Europe during the peak season — a result of the dry Mediterranean air mass that dominates from June to September. On the best summer days, cloudbase regularly exceeds 3000m.</p>

          <h2 className="text-xl font-bold text-slate-900 mb-5">Typical Cloudbase by Month</h2>
          <div className="space-y-3 mb-10">
            {[
              { month: 'April', cb: '1,500–2,000m', note: 'Building from winter values. Variable day to day.' },
              { month: 'May', cb: '2,000–2,800m', note: 'Excellent XC cloudbase. One of the best months.' },
              { month: 'June', cb: '2,500–3,200m', note: 'Peak XC season begins. Spectacular on good days.' },
              { month: 'July', cb: '2,800–3,500m', note: 'Highest cloudbase of the year. Very dry air.' },
              { month: 'August', cb: '2,800–3,500m', note: 'Same as July. Slight moisture increase mid-month.' },
              { month: 'September', cb: '2,500–3,200m', note: 'Excellent and more predictable than summer.' },
              { month: 'October', cb: '1,800–2,500m', note: 'Gradually lowering as autumn arrives.' },
            ].map(m => (
              <div key={m.month} className="flex items-center justify-between card p-4">
                <span className="font-semibold text-slate-900">{m.month}</span>
                <div className="text-right">
                  <span className="text-orange-600 font-bold">{m.cb}</span>
                  <p className="text-slate-500 text-xs mt-0.5">{m.note}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-5">Reading the Sky</h2>
          <div className="space-y-4 mb-8">
            {[
              { title: 'Cumulus Clouds — Good Sign', desc: 'White, fluffy cumulus clouds with flat bases are classic thermal indicators. The flat base of the cloud is the cloudbase. Pilots can fly to the base of these clouds and follow the cloud street for long XC flights. Cumulus with well-defined bases indicate a stable, organised thermal day.' },
              { title: 'Over-development — Warning', desc: 'When cumulus clouds begin growing very rapidly upward, darkening at the base, and losing their flat-bottomed shape, the thermals are over-developing. This can lead to gusty conditions and in extreme cases, thunderstorms. The Association monitors cloud development and will issue warnings.' },
              { title: 'Blue Thermals — Invisible', desc: 'On days with very dry air, thermals can be strong but invisible — the air is too dry for clouds to form. These are called "blue days". Experienced pilots use other indicators (birds, dust devils, smoke) to locate thermals. Tandem flights on blue days can be smooth or bumpy depending on thermal strength.' },
              { title: 'High Cloud Cover — Capped Day', desc: 'A layer of high cirrus cloud or a cirrostratus layer can cap the atmosphere, preventing thermals from developing fully. On these days, cloudbase may be lower than the day suggests and thermals weaker. Often still flyable but XC distances are reduced.' },
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
