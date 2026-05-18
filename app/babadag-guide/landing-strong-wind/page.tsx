import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Strong Wind Landing Babadağ | High Wind Paragliding Procedures Ölüdeniz',
  description: 'How to land at Ölüdeniz in strong wind conditions. Approach adjustments, speed management, landing technique for high-wind days at Babadağ.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/babadag-guide/landing-strong-wind' },
}

export default function LandingStrongWindPage() {
  return (
    <>
      <PageHero title="Strong Wind Landing" subtitle="Technique and approach adjustments for landing at Ölüdeniz in high wind." badge="Strong Wind" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Babadağ Guide', href: '/babadag-guide' }, { label: 'Strong Wind Landing' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <p className="text-slate-600 leading-relaxed mb-8">Strong wind landings at Ölüdeniz are a regular occurrence during the afternoon sea-breeze period and on particularly active thermal days. Understanding how to adapt your approach and landing technique is essential for solo pilots operating here.</p>

          <div className="space-y-5">
            {[
              { title: 'Recognising Strong Wind on Approach', desc: 'Ground speed on approach will feel slow or even stationary in extreme cases. The windsock at the landing zone will be horizontal. Turbulence increases near the ground as the sea breeze meets the terrain. If your approach feels "sticky" or you are making very slow progress into wind, you are in strong wind conditions.' },
              { title: 'Speed Bar Usage', desc: 'On a strong-wind approach, use speed bar (accelerator) to maintain penetration. This is counter-intuitive for new pilots — but without maintaining airspeed, you risk being blown backward or stalling in gusts. Keep 30–50% speed bar deployed until you are certain you can reach the landing zone.' },
              { title: 'Height Management', desc: 'In strong wind, approach height is critical. You will lose altitude much faster when facing into a strong headwind than on a normal day. Plan your approach earlier and higher than usual. Avoid deep penetration over obstacles where wind-shadow turbulence can cause collapse.' },
              { title: 'Landing Flare Technique', desc: 'In strong wind, your groundspeed at touchdown will be very low — sometimes near zero. The flare should be gentle and progressive rather than aggressive. A hard flare in strong wind will result in a rapid pitch-up that can cause an unintentional upward surge. Aim to walk out of the landing.' },
              { title: 'After Landing — Canopy Control', desc: 'The most dangerous part of a strong-wind landing is after touchdown. Your canopy remains fully inflated and will try to relaunch. Immediately turn to face the canopy, grab a brake toggle and front riser simultaneously to collapse one side. Never let go of both toggles simultaneously in strong wind.' },
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
