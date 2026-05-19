import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Radio Hire Babadağ | Paragliding Radio Rental Ölüdeniz',
  description: 'Radio hire for paraglider pilots at Babadağ. Frequency information, radio hire rates, recommended models and radio communication etiquette at Ölüdeniz.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/pilot-services/radio-hire' },
}

export default function RadioHirePage() {
  return (
    <>
      <PageHero title="Radio Hire" subtitle="Communication radios for paraglider pilots flying at Babadağ." badge="Radio Hire" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Pilot Services', href: '/pilot-services' }, { label: 'Radio Hire' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <p className="text-slate-600 leading-relaxed mb-8">Radio communication is strongly recommended for solo pilots flying at Babadağ. The busy airspace, multiple launch areas, and active landing zone management all benefit from radio contact. The Babadağ Association coordinates traffic on a dedicated frequency during operating hours.</p>
          <div className="space-y-5 mb-8">
            {[
              { title: 'Why Radio Matters', emoji: '📻', desc: 'With 200–400 flights per day in peak season, voice communication between pilots and the launch coordinator is essential for safety and flow management. Pilots without radios miss weather updates, landing zone warnings, and traffic advisories that are regularly broadcast during operations.' },
              { title: 'Babadağ Operating Frequency', emoji: '📡', desc: 'The Babadağ Association operates on a designated frequency during flying hours. The frequency is published at the Association office on arrival and changes periodically for operational reasons. Ask at the office for the current frequency on your first day.' },
              { title: 'Radio Hire', emoji: '🔋', desc: 'Short-range radios can be hired from the Babadağ Association office. Daily and weekly rates apply. The radios are pre-programmed with the current operating frequency and common weather information channels. A deposit is required — collect on departure.' },
              { title: 'Your Own Radio', emoji: '📲', desc: 'Most pilots bring their own handheld radio. Any PMR446 or licence-free radio will work for basic communication. Programming the Babadağ frequency requires a programming cable or manual input — bring the frequency information you obtain from the Association office.' },
            ].map(item => (
              <div key={item.title} className="card p-5">
                <div className="flex gap-3 items-start">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
            <strong>Etiquette:</strong> Keep radio transmissions brief and clear. Identify yourself with your wing colour or name. Do not transmit over others. Save the channel for safety-relevant information — social chat belongs in the pilot café, not on the operating frequency.
          </div>
        </div>
      </section>
    </>
  )
}
