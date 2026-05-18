import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Paramotor Launch Sites Fethiye | PPG Take-Off Fields Turkey',
  description: 'Best paramotor launch sites around Fethiye and Ölüdeniz. Flat fields, beach launches, GPS locations and access details for PPG pilots.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/paramotor/launch-sites' },
}

const sites = [
  { name: 'Çalış Beach North End', type: 'Beach launch', access: 'Fethiye — 3km north', desc: 'Long, flat beach with consistent onshore breeze in the morning. Good for coastal runs north toward Fethiye harbour. Best in early morning before the sea breeze strengthens. Busy with beach-goers after 09:00 in summer.' },
  { name: 'Fethiye Agricultural Plain', type: 'Flat field', access: 'Fethiye — east of town', desc: 'The flat farmland east of Fethiye offers several field launch options. Good surface in dry season. Verify permission with landowners before launching — these are private fields.' },
  { name: 'Kemer Valley', type: 'Valley floor', access: '15km east of Fethiye', desc: 'Wide valley floor with multiple field options. More sheltered from sea breeze. Good thermal potential later in the morning. Longer drive but worth it for a full-day flying session.' },
  { name: 'Ölüdeniz East Valley', type: 'Valley floor', access: 'East of Ölüdeniz village', desc: 'Flat areas in the valley east of Ölüdeniz. Must coordinate with Babadağ airspace — keep at low altitude and avoid the free-flight approach corridor. Early morning only when paragliding traffic is low.' },
]

export default function ParamotorLaunchSitesPage() {
  return (
    <>
      <PageHero title="Paramotor Launch Sites" subtitle="The best flat-field and beach launch sites for paramotor around Fethiye." badge="Launch Sites" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Paramotor', href: '/paramotor' }, { label: 'Launch Sites' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 text-sm text-amber-800">
            <strong>Important:</strong> Always verify current field availability and permissions before launching. Agricultural fields are private property — always obtain landowner permission. Check Babadağ airspace NOTAMs before flying in the Ölüdeniz area.
          </div>

          <div className="space-y-5">
            {sites.map(s => (
              <div key={s.name} className="card p-5">
                <div className="flex flex-wrap gap-2 items-center mb-3">
                  <h3 className="font-bold text-slate-900">{s.name}</h3>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">{s.type}</span>
                </div>
                <div className="text-sm text-slate-500 mb-2">Access: <span className="text-slate-700">{s.access}</span></div>
                <p className="text-slate-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
