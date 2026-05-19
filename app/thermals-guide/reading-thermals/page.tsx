import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Reading Thermals Babadağ | How to Find and Use Thermals Ölüdeniz',
  description: 'How to find, enter and use thermals at Babadağ. Visual cues, bird behaviour, terrain features and in-flight indicators for reading the thermal atmosphere.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/thermals-guide/reading-thermals' },
}

export default function ReadingThermalsPage() {
  return (
    <>
      <PageHero title="Reading Thermals" subtitle="How to find and use thermals at Babadağ — visual cues, terrain reading and sky signs." badge="Thermal Skills" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Thermals Guide', href: '/thermals-guide' }, { label: 'Reading Thermals' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <p className="text-slate-600 leading-relaxed mb-8">Finding thermals is the core skill of cross-country paragliding. At Babadağ, the thermal landscape is rich and relatively readable — the same triggers fire reliably day after day, which is part of what makes this site so exceptional for building thermal flying skills.</p>

          <h2 className="text-xl font-bold text-slate-900 mb-5">Visual Thermal Indicators</h2>
          <div className="space-y-4 mb-10">
            {[
              { indicator: 'Cumulus Clouds', emoji: '☁️', desc: 'The most reliable thermal indicator. Flat-based cumulus directly overhead marks an active thermal. The flat base indicates the cloudbase altitude. Fly toward the upwind side of cumulus — the thermal is feeding it from below.' },
              { indicator: 'Raptors and Storks', emoji: '🦅', desc: 'Birds are expert thermal locators. Griffon vultures and white storks at Babadağ are almost always in thermals. A group of birds circling indicates an active thermal at their altitude. Fly to their position and circle with them.' },
              { indicator: 'Dust Devils', emoji: '🌪️', desc: 'Dust devils on the ground are surface thermals that haven\'t yet connected with the soaring layer. They indicate strong ground heating in that area. A dust devil is often followed by a connected thermal 5–15 minutes later in the same area.' },
              { indicator: 'Terrain Features', emoji: '🏔️', desc: 'Dark rocky outcrops, ploughed fields, and south-facing slopes heat faster than surrounding terrain. The south face of Babadağ, the Kayaköy valley floor, and rocky ridges are reliable thermal sources. Learn the terrain and you learn where the thermals will be.' },
              { indicator: 'Glide Angle Changes', emoji: '📊', desc: 'When your glide ratio suddenly improves (you are covering more ground per metre of altitude loss than expected), you are in rising air. This invisible lift is often a thermal edge or a full thermal. Slow down and circle to find the core.' },
            ].map(item => (
              <div key={item.indicator} className="card p-5">
                <div className="flex gap-3 items-start">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">{item.indicator}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-5">Centering the Thermal</h2>
          <div className="space-y-4">
            {[
              { title: 'Enter Upwind', desc: 'Thermals drift downwind as they rise. Enter the thermal from the upwind side to stay in the strongest lift for longest. At Babadağ this usually means entering from the south.' },
              { title: 'Circle Toward the Lift', desc: 'When you feel lift asymmetrically (one side of the wing rises more than the other), turn immediately toward the side that rose. This turns you toward the thermal core.' },
              { title: 'Tighten in the Core', desc: 'Once you find consistent lift, tighten your circles to stay in the core. The core is strongest at the centre of the thermal column — identified by the highest vario reading.' },
              { title: 'Leave at the Top', desc: 'Leave the thermal at cloudbase or when the lift weakens. Thermal strength typically decreases near the top of the bubble. At Babadağ, also leave if the cloud above you starts growing rapidly.' },
            ].map(item => (
              <div key={item.title} className="card p-4">
                <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
