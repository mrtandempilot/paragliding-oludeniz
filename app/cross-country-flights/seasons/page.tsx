import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Best XC Seasons Babadağ | Cross Country Paragliding Conditions Ölüdeniz',
  description: 'Month by month XC paragliding conditions from Babadağ. Best seasons for cross country flying, wind patterns and historic XC windows.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/cross-country-flights/seasons' },
}

export default function XCSeasonsPage() {
  return (
    <>
      <PageHero title="Best XC Seasons at Babadağ" subtitle="Month by month cross country conditions from one of Europe's finest XC sites." badge="XC Seasons" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Cross Country Flights', href: '/cross-country-flights' }, { label: 'Seasons' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="space-y-5">
            {[
              { month: 'April', rating: '★★★', xcRating: 'Moderate', desc: 'Season opens. Thermals building but often broken and weak in first half of month. Atlantic fronts can interrupt. Good for shorter routes. Dalaman area can produce surprisingly good XC days mid-month.' },
              { month: 'May', rating: '★★★★', xcRating: 'Good', desc: 'One of the best XC months. Thermals consistent by 10:00, often reaching 2,500–3,000m base. Wind is usually manageable. Göcek routes are very achievable.' },
              { month: 'June', rating: '★★★★★', xcRating: 'Excellent', desc: 'Peak XC season begins. Strong thermals, high cloudbase (2,500–3,500m on good days), long flying windows. The best XC records tend to fall in June.' },
              { month: 'July', rating: '★★★★', xcRating: 'Good (strong)', desc: 'Powerful thermals but can be turbulent. High temperatures mean strong climbs but also strong afternoon winds. Experienced pilots can fly big distances early in the day.' },
              { month: 'August', rating: '★★★', xcRating: 'Moderate (hot)', desc: 'Hottest month. XC is possible but conditions often overdevelop by afternoon. Early morning XC can be good before the heat builds. Meltemi influence reduces mid-month.' },
              { month: 'September', rating: '★★★★★', xcRating: 'Best month', desc: 'Consistently the best XC month. Thermal conditions are strong but more predictable than summer. Less crowded in the air. Many pilots specifically travel for September XC.' },
              { month: 'October', rating: '★★★★', xcRating: 'Good', desc: 'Excellent early October. Conditions mellow as month progresses. Autumn atmospheric stability can produce crystal clear XC days. Season typically closes end of October.' },
            ].map(m => (
              <div key={m.month} className="card p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 text-lg">{m.month}</h3>
                  <div className="flex gap-2">
                    <span className="text-yellow-500 text-sm">{m.rating}</span>
                    <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full">{m.xcRating}</span>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
