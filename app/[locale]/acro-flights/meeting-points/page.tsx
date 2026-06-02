import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Acro Paragliding Spectator Spots Ölüdeniz | Viewing Points',
  description: 'Best spots to watch acro paragliding at Ölüdeniz. Beach positions, photography angles, and when to be there to see the best aerial acrobatics.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/acro-flights/meeting-points' },
}

const spots = [
  { name: 'Ölüdeniz Beach (Main)', emoji: '🏖️', timing: 'Late afternoon 16:00–18:00', desc: 'The most popular spectator position. Pilots perform over the lagoon directly in front of the beach. The low sun in late afternoon makes for spectacular photography with the Blue Lagoon as backdrop.', tip: 'Bring a telephoto lens — 200mm+ gives great results from the beach.' },
  { name: 'Blue Lagoon Barrier Beach', emoji: '🏝️', timing: 'Morning 08:00–10:00', desc: 'The narrow sand bar separating the Blue Lagoon from the sea gives an unobstructed view of pilots practising over the lagoon. Accessible by walking from the main beach.', tip: 'Morning sessions are calmer with less crowd noise. Great for video.' },
  { name: 'Belcekız Beach', emoji: '🌊', timing: 'Anytime', desc: 'The long stretch of Belcekız beach south of Ölüdeniz offers wide-angle views of pilots approaching and landing. Useful for capturing the full arc of acro sequences at altitude.', tip: 'Position near the landing zone for dramatic close-ups on approach.' },
  { name: 'Hillside Café Terrace', emoji: '☕', timing: 'Afternoon 14:00–17:00', desc: 'Several hillside cafés above Ölüdeniz have terraces with elevated views over the lagoon. Watch while enjoying a cold drink — arguably the most comfortable spectating option.', tip: 'Ask locally for current café recommendations as they change seasonally.' },
]

export default function AcroMeetingPointsPage() {
  return (
    <>
      <PageHero title="Watching Acro at Ölüdeniz" subtitle="The best spectator spots and photography positions for acro paragliding." badge="Spectator Guide" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Acro Flights', href: '/acro-flights' }, { label: 'Meeting Points' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <p className="text-slate-600 leading-relaxed mb-8">Acro paragliding at Ölüdeniz is a spectacular free show for beach visitors. Knowing where to position yourself — and when — makes the difference between watching tiny dots in the sky and witnessing breathtaking close-up aerobatics.</p>

          <div className="space-y-5 mb-10">
            {spots.map(s => (
              <div key={s.name} className="card p-6">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{s.emoji}</span>
                  <div>
                    <div className="flex flex-wrap gap-2 items-center mb-2">
                      <h3 className="font-bold text-slate-900">{s.name}</h3>
                      <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full">{s.timing}</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-2">{s.desc}</p>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-500"><strong className="text-slate-700">Tip:</strong> {s.tip}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-3">When Are Pilots Flying?</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">Acro practice typically happens in two windows: early morning (07:00–10:00) before thermals develop, and late afternoon (16:00–18:00) as thermals decay. These are the flattest, most controllable air conditions for low-altitude practice.</p>
            <p className="text-slate-600 text-sm leading-relaxed">Follow the Babadağ pilot community on social media or ask at the Babadağ Association office to find out when sessions are planned. Acro pilots often announce their session windows the evening before.</p>
          </div>
        </div>
      </section>
    </>
  )
}
