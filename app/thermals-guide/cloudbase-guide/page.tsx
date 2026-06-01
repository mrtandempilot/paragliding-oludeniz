import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Cloudbase Guide Babadağ | Thermal Ceiling Ölüdeniz',
  description: 'Cloudbase and thermal ceiling guide for Babadağ paragliding. How high you can fly, seasonal cloudbase heights and what determines the thermal ceiling each day.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/thermals-guide/cloudbase-guide' },
}

export default function CloudbaseGuidePage() {
  return (
    <>
      <PageHero title="Cloudbase & Thermal Ceiling" subtitle="How high you can fly at Babadağ — seasonal cloudbase heights and what sets the ceiling." badge="Cloudbase" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Thermals Guide', href: '/thermals-guide' }, { label: 'Cloudbase Guide' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <p className="text-slate-600 leading-relaxed mb-8">Babadağ's cloudbase is consistently among the highest of any paragliding site in Europe — a product of the dry Mediterranean air that dominates the region from April to October. In peak season, pilots regularly fly to 3000m+ above sea level, gaining over 1300m from the launch altitude.</p>
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { label: 'Launch altitude', value: '1,700m' },
                { label: 'Typical June CB', value: '3,000m+' },
                { label: 'Max climb rate', value: '5m/s+' },
                { label: 'Altitude gain', value: '1,300m typical' },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-orange-600">{s.value}</div>
                  <div className="text-orange-700 text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {[
              { title: 'What Determines Cloudbase?', desc: 'Cloudbase height is set by the lifting condensation level (LCL) — the altitude at which rising air cools to its dew point and water vapour condenses. In the dry Mediterranean summer, this level is very high because the air contains little moisture. Lower relative humidity = higher cloudbase. This is why Babadağ\'s cloudbase is exceptional.' },
              { title: 'Blue Sky Days (No Clouds)', desc: 'On extremely dry days, thermals may extend to 3500m+ without forming clouds at all. These "blue sky" or "blue thermal" days offer unlimited altitude but require skill to locate thermals without visual cues. Experienced XC pilots love blue days; beginners find them challenging because the sky gives no guidance.' },
              { title: 'Cloudbase and XC Distance', desc: 'There is a direct relationship between cloudbase height and achievable XC distance. Every 500m of extra cloudbase translates to more potential glide distance between thermals. A 3000m cloudbase at Babadağ makes 60km+ XC flights possible; a 2000m cloudbase limits pilots to shorter routes.' },
              { title: 'Airspace Ceiling', desc: 'The Babadağ free-flight zone has an upper airspace limit. Pilots must not enter controlled airspace above the designated ceiling without ATC clearance. On very high cloudbase days, the cloudbase may be at or above the legal ceiling — pilots are responsible for maintaining airspace compliance regardless of where the cloudbase is.' },
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
