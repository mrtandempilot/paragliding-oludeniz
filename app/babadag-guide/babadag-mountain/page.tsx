import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Babadağ Mountain Guide | Hiking, Flora & Geology Ölüdeniz',
  description: 'Everything about Babadağ mountain beyond paragliding. Hiking trails, summit route, mountain flora, geology, wildlife and best photography spots.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/babadag-guide/babadag-mountain' },
}

export default function BabadagMountainPage() {
  return (
    <>
      <PageHero title="Babadağ Mountain" subtitle="Beyond paragliding — the natural beauty, hiking trails and character of Babadağ." badge="Mountain Guide" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Babadağ Guide', href: '/babadag-guide' }, { label: 'The Mountain' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Summit altitude', value: '1,966m' },
              { label: 'Rock type', value: 'Limestone' },
              { label: 'Nearest town', value: 'Ölüdeniz' },
              { label: 'Trail length', value: '~8km to summit' },
            ].map(item => (
              <div key={item.label} className="card p-4 text-center">
                <div className="text-xl font-bold text-orange-600 mb-1">{item.value}</div>
                <div className="text-slate-500 text-xs">{item.label}</div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-5">A Mountain of Character</h2>
          <p className="text-slate-600 leading-relaxed mb-5">Babadağ — literally "Father Mountain" in Turkish — rises dramatically from the Mediterranean coastline to 1966m. The mountain's southern face is the iconic limestone wall visible from Ölüdeniz beach and the Blue Lagoon, and the thermal engine that powers one of the world's finest paragliding sites.</p>
          <p className="text-slate-600 leading-relaxed mb-8">But Babadağ is much more than a launch platform. The mountain supports rich Mediterranean mountain flora, diverse birdlife including raptors that share the thermals with paragliders, and offers challenging hiking for those who prefer their adventures on foot.</p>

          <div className="space-y-5 mb-10">
            {[
              {
                title: 'Geology',
                emoji: '🪨',
                desc: 'Babadağ is composed primarily of Mesozoic limestone — the same rock type that defines much of the Taurus mountain chain. The limestone\'s thermal properties (rapid heating, slow cooling) are a key reason the mountain generates such reliable and powerful thermals. The near-vertical cliff sections on the south face are the result of tectonic uplift combined with Mediterranean erosion patterns.',
              },
              {
                title: 'Flora',
                emoji: '🌿',
                desc: 'The mountain\'s vegetation zones change dramatically with altitude. The lower slopes below 800m support typical Mediterranean maquis — dense scrub of cistus, myrtle and wild herbs. Above 1000m, cedar and pine forest dominate. The upper plateau (1500–1900m) has open alpine meadows in summer, carpeted with wild flowers including orchids, chamomile and thyme.',
              },
              {
                title: 'Wildlife',
                emoji: '🦅',
                desc: 'Babadağ is a significant raptor site. Griffon vultures, long-legged buzzards, short-toed snake eagles and hobby falcons are all regularly observed riding the same thermals as the paragliders. Golden eagles and eagle owls inhabit the cliff sections. The mountain also supports populations of wild boar, foxes, and — more rarely — Anatolian leopard in the highest and most remote areas.',
              },
              {
                title: 'Hiking',
                emoji: '🥾',
                desc: 'Several hiking trails access Babadağ from different directions. The most popular route climbs from Ölüdeniz via the 1700m launch area to the summit — approximately 8km one way, gaining 1966m from sea level. The trail is unmarked in sections and a map or GPS is recommended. The best hiking season is April–June and September–October, avoiding the extreme heat of July and August.',
              },
              {
                title: 'Photography',
                emoji: '📷',
                desc: 'The summit of Babadağ offers a 360° panorama that is genuinely extraordinary. On clear days you can see the Greek islands of Rhodes and Symi to the south-west, the Dalaman plain to the north-east, and the entire Fethiye Bay below. The best light for photography of the Blue Lagoon from the summit is in the morning hours before the sea haze builds.',
              },
            ].map(item => (
              <div key={item.title} className="card p-6">
                <div className="flex gap-4 items-start">
                  <span className="text-3xl">{item.emoji}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
