import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Paragliding Photography Ölüdeniz | Aerial Photo Tips Babadağ',
  description: 'Best photography tips for paragliding at Ölüdeniz. Camera settings, best angles, timing for the Blue Lagoon, and using your own camera during a tandem flight.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/pilot-services/photography' },
}

export default function PhotographyPage() {
  return (
    <>
      <PageHero title="Paragliding Photography" subtitle="Tips, settings and the best moments to photograph at Ölüdeniz from the air." badge="Photography" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Pilot Services', href: '/pilot-services' }, { label: 'Photography' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <p className="text-slate-600 leading-relaxed mb-8">The aerial views from a Babadağ paragliding flight are among the most photogenic in the Mediterranean. The Blue Lagoon's impossible turquoise colour, the white sand beaches, and the dramatic mountain backdrop create photographs that look like professional travel shots.</p>

          <div className="space-y-5 mb-10">
            {[
              { title: 'Can I Bring My Own Camera?', desc: 'Yes — most tandem pilots are happy for passengers to bring their own camera, smartphone or GoPro for personal use during the flight. Secure your camera with a wrist strap or lanyard at minimum. A dropped camera at altitude cannot be recovered. Inform your pilot before takeoff that you plan to photograph.' },
              { title: 'Best Settings for Aerial Photography', desc: 'For smartphones: use standard portrait mode and trust the auto exposure. For DSLR/mirrorless: ISO 100–200, f/5.6–f/8, 1/1000s minimum shutter speed (higher if the wing or glider is in frame). Shoot in RAW if your camera supports it — the dynamic range between bright sky and blue water is large.' },
              { title: 'Best Moments to Shoot', desc: 'Just after launch (mountain perspective, pilot and glider visible), over the Blue Lagoon (the colour is most vivid mid-morning), during any wing-overs if your pilot performs them (dramatic wide shots), and on final approach to landing (beach and crowds below).' },
              { title: 'Timing for the Best Blue', desc: 'The Blue Lagoon\'s famous turquoise colour is most vivid between 09:00 and 13:00 when the sun is high enough to illuminate the shallow water fully but not yet bleaching the colour with direct overhead glare. Morning flights in May and September have the best combination of light and colour.' },
              { title: 'Avoiding Camera Sickness', desc: 'Some passengers focus too much on their camera screen and experience nausea during the flight. Look through the viewfinder rather than a phone screen where possible. Take breaks from shooting to look at the horizon — this prevents vestibular-optical mismatch that causes airsickness.' },
              { title: 'Video on Smartphones', desc: 'Modern smartphones in 4K video mode capture excellent aerial footage. Stabilisation modes help but the wing and lines overhead can create distracting motion. Shoot in short clips rather than one continuous take, as the best moments are brief and specific.' },
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
