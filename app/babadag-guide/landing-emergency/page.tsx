import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Emergency Landing Babadağ | Paragliding Emergency Procedures Ölüdeniz',
  description: 'Emergency landing procedures for Babadağ paragliding. Tree landing recovery, water landing protocol, reserve deployment and emergency contacts in Ölüdeniz.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/babadag-guide/landing-emergency' },
}

export default function LandingEmergencyPage() {
  return (
    <>
      <PageHero title="Emergency Landing Procedures" subtitle="What to do in the rare event of an emergency landing at Babadağ." badge="Emergency" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Babadağ Guide', href: '/babadag-guide' }, { label: 'Emergency Landing' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 text-sm text-amber-800">
            <strong>For Tandem Passengers:</strong> If you are flying as a tandem passenger, your pilot is trained and experienced in all emergency procedures. Your role is to follow their instructions and stay calm. This page is primarily for solo pilots.
          </div>

          <div className="bg-red-900 text-white rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-white text-lg mb-3">Emergency Numbers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { service: 'Turkish Emergency Services', number: '112' },
                { service: 'Ölüdeniz Coast Guard', number: '158' },
                { service: 'Babadağ Association (in-season)', number: 'Ask on arrival' },
                { service: 'Fethiye Hospital', number: '+90 252 614 9500' },
              ].map(em => (
                <div key={em.service} className="bg-red-800 rounded-xl p-3">
                  <div className="text-red-300 text-xs mb-1">{em.service}</div>
                  <div className="text-white font-bold">{em.number}</div>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-5">Emergency Procedures</h2>
          <div className="space-y-4">
            {[
              { title: 'Reserve Parachute Deployment', desc: 'If you deploy your reserve: look for the best available landing area below, prepare for a harder landing than normal (reserve descent rates are faster than glider), and protect your head if landing in trees or rough terrain. After landing, signal your position immediately. Keep your reserve deployed — do not pack it before you are found.' },
              { title: 'Tree Landing', desc: 'Aim for smaller, younger trees where possible. Cross your arms over your face to protect from branches. Keep your legs together and slightly bent. Once in the tree, do not attempt to descend until the canopy is secure. Call for help via radio or phone. Wait for rescue — do not attempt to descend a large tree with full equipment.' },
              { title: 'Water Landing', desc: 'If landing in the sea or Blue Lagoon: unclip your chest strap and leg straps before hitting the water so you can swim clear of the canopy. The canopy filling with water is the primary risk. Inflate your life jacket if fitted. Swim away from the canopy before it sinks and pulls you down. Signal the rescue boats which patrol the lagoon during flying operations.' },
              { title: 'Radio Mayday', desc: 'The Babadağ operating frequency is monitored during operations. Transmit: "Mayday, mayday, mayday, [your callsign], I am [situation], my position is [description or GPS coordinates], I require [assistance]." Repeat three times. Even if you receive no response, your transmission is heard by other pilots.' },
            ].map(item => (
              <div key={item.title} className="card p-5 border-l-4 border-red-400">
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
