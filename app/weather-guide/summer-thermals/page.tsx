import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Summer Thermals Babadağ | Peak Season Thermal Conditions Ölüdeniz',
  description: 'Summer thermal conditions at Babadağ. How July and August thermals behave, best flight times, heat effects on flying and staying safe in strong summer conditions.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/weather-guide/summer-thermals' },
}

export default function SummerThermalsPage() {
  return (
    <>
      <PageHero title="Summer Thermals at Babadağ" subtitle="Understanding July and August thermal conditions — powerful, predictable and rewarding." badge="Summer Flying" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Weather Guide', href: '/weather-guide' }, { label: 'Summer Thermals' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <p className="text-slate-600 leading-relaxed mb-8">July and August at Babadağ produce the most powerful thermals of the year. The combination of intense Mediterranean sun, the south-facing limestone rock face, and consistently low humidity creates thermal conditions that routinely deliver 3m/s+ climb rates and cloudbases above 3000m. For experienced pilots this is extraordinary flying. For tandem passengers in the morning window, it's an exhilarating and smooth experience.</p>

          <h2 className="text-xl font-bold text-slate-900 mb-5">Daily Thermal Cycle</h2>
          <div className="space-y-3 mb-10">
            {[
              { time: '07:00–09:00', conditions: 'Pre-thermal calm', colour: 'green', desc: 'The mountain is in thermal shadow. Conditions are calm and smooth. Ideal for beginners and tandem flights. The air is still cool enough to be comfortable. First thermals beginning to trigger on east-facing slopes.' },
              { time: '09:00–11:00', conditions: 'Early thermals', colour: 'green', desc: 'Thermals beginning from the south face. Clean, well-organised climbs. Cloudbase building toward 2000–2500m. The best window for tandem flights and less experienced solo pilots. Flying is active but not turbulent.' },
              { time: '11:00–14:00', conditions: 'Peak conditions', colour: 'yellow', desc: 'Full thermal development. Strong climbs (2–4m/s), high cloudbase (2500–3500m). Turbulent in between thermals, particularly below 800m. Experienced solo pilots thrive. Tandem operators manage the schedule carefully in this window.' },
              { time: '14:00–16:00', conditions: 'Sea breeze transition', colour: 'orange', desc: 'The Meltemi (sea breeze) begins to dominate at beach level. Conflict between thermals and sea breeze can create turbulent mixing zones. Not ideal for inexperienced pilots. Experienced pilots can still fly but must manage the transition carefully.' },
              { time: '16:00–18:00', conditions: 'Evening calm', colour: 'green', desc: 'The thermal cycle winds down and the sea breeze typically eases. Conditions smooth out for the evening window. Sunset flights launch in this period into consistently smooth air. One of the best times to fly all day.' },
            ].map(slot => (
              <div key={slot.time} className="card p-4">
                <div className="flex flex-wrap gap-2 items-center mb-2">
                  <span className="font-mono text-slate-700 font-semibold text-sm">{slot.time}</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${slot.colour === 'green' ? 'bg-green-100 text-green-700' : slot.colour === 'yellow' ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'}`}>{slot.conditions}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{slot.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-5">Heat Effects on Flying</h2>
          <div className="space-y-4 mb-8">
            {[
              { title: 'Air Density Reduction', desc: 'At 35–40°C ground temperature, air density drops significantly compared to standard conditions. Gliders perform slightly differently — stall speeds are marginally higher, sink rates slightly increased. Experienced pilots account for this; beginners should not notice any difference in tandem flights.' },
              { title: 'Pilot Fatigue', desc: 'Flying in high heat is physically demanding. Dehydration is the main risk — even at altitude where temperatures are cooler, the sun exposure is intense. All pilots and tandem passengers should drink at least 1L of water before flying and avoid alcohol the evening before.' },
              { title: 'Overdevelopment Risk', desc: 'On the hottest days with highest moisture content (rare at Ölüdeniz but possible), thermals can overdevelop into cumulus clouds and occasionally cumulonimbus. The Babadağ Association monitors cloud development and will suspend operations if cumulonimbus activity develops nearby.' },
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
