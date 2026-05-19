import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Thermal Safety Babadağ | Paragliding Turbulence & Collapse Safety',
  description: 'Thermal safety for paraglider pilots at Babadağ. Handling collapses, avoiding strong thermals, turbulence management and when to fly conservatively at Ölüdeniz.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/thermals-guide/thermal-safety' },
}

export default function ThermalSafetyPage() {
  return (
    <>
      <PageHero title="Thermal Safety" subtitle="Managing turbulence, collapses and strong conditions at Babadağ — for solo pilots." badge="Safety" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Thermals Guide', href: '/thermals-guide' }, { label: 'Thermal Safety' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 text-sm text-amber-800">
            <strong>For Solo Pilots:</strong> This page contains technical safety information for solo paraglider pilots. Tandem passengers do not need to know this content — your pilot manages all aspects of thermal flying and safety.
          </div>
          <div className="space-y-5">
            {[
              { title: 'Fly Within Your Experience Level', desc: 'Babadağ produces strong thermals, especially in June–August. If you are a beginner solo pilot (P1/CP with fewer than 50 hours), fly only in the morning calm window (07:00–09:30) and avoid the strong thermal period. Do not let the presence of more experienced pilots around you encourage overconfidence.' },
              { title: 'Collapses — Stay Calm', desc: 'A frontal collapse (B-stall, asymmetric collapse) is a normal paragliding event in turbulent conditions. Modern certification testing ensures wings recover from all standard collapse scenarios. The correct response is: hold the other brake to prevent rotation, do not over-brake the collapsed side, wait for reinflation, then resume normal flying. Panic responses (grabbing both brakes hard) make the situation worse.' },
              { title: 'Reserve Parachute', desc: 'Always fly with a packed, in-date reserve parachute. At Babadağ, the launch altitude of 1700m gives meaningful time for reserve deployment if needed. Know your reserve deployment handles, practice the motion on the ground, and ensure your reserve has been repacked within the last 12 months.' },
              { title: 'Strong Thermal Indicators', desc: 'Be aware of days when conditions exceed your experience level. Warning signs: very strong, sharp climbs (above 4m/s) in the morning, aircraft at the launch struggling in the wind, the Association briefing mentioning "strong thermal" conditions. On these days, choose to fly early morning or wait for the afternoon calm.' },
              { title: 'Avoid Overdeveloped Clouds', desc: 'If cumulus clouds begin growing rapidly with dark bases and losing their flat-bottom shape, land immediately. Cumulonimbus (thunderstorm) development is rare at Ölüdeniz but possible. Never fly under or near a developing storm cloud. The suction from a strong cumulonimbus can pull a paraglider in regardless of speed bar input.' },
              { title: 'Know When Not to Fly', desc: 'The single most important safety skill is the ability to decide not to fly. If conditions look wrong, if you feel unwell, if other pilots are struggling, if the Association has flagged concerns — cancel your flight. No XC goal, no peer pressure, no holiday schedule is worth compromising on a go/no-go decision.' },
            ].map(item => (
              <div key={item.title} className="card p-5 border-l-4 border-orange-400">
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
