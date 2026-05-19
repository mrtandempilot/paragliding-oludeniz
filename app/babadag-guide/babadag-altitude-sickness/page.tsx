import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import FAQAccordion from '@/components/shared/FAQAccordion'

export const metadata: Metadata = {
  title: 'Altitude Sickness at Babadağ | AMS Prevention Ölüdeniz Paragliding',
  description: 'Can you get altitude sickness at Babadağ (1966m)? Symptoms, prevention and what to do if you feel unwell at the paragliding launch area at 1700m.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/babadag-guide/babadag-altitude-sickness' },
}

const faqItems = [
  { question: 'Is 1700m high enough to cause altitude sickness?', answer: 'For most healthy people, 1700m is below the threshold where Acute Mountain Sickness (AMS) becomes a significant concern — that threshold is usually quoted at around 2500m. However, individuals who are particularly sensitive, have underlying health conditions, or ascend very rapidly (e.g. via the fast cable car) may experience mild symptoms such as headache or lightheadedness. Serious AMS at Babadağ is rare.' },
  { question: 'What should I do if I feel unwell at the launch?', answer: 'If you feel headache, nausea, unusual breathlessness or dizziness at the launch area, tell your tandem pilot or a member of the Association staff immediately. Rest and drink water. If symptoms are mild, they often pass within 30–60 minutes. If symptoms worsen, the correct action is to descend — not to try to fly through the discomfort.' },
  { question: 'Can I still fly if I have a headache at the top?', answer: 'A mild headache from the rapid ascent usually resolves with rest and water. However, flying with any symptoms of altitude sickness is not recommended — it impairs judgement and you may feel worse at altitude. Your tandem pilot needs to know about any physical symptoms before takeoff. There is no penalty for deciding not to fly on the day.' },
  { question: 'Are there people more at risk?', answer: 'People who live at sea level and ascend rapidly, those with anaemia, heart or lung conditions, and those who are dehydrated are at greater risk. Children are generally not more susceptible to altitude effects than adults. Coming to Babadağ already well-rested and well-hydrated significantly reduces any risk.' },
]

export default function BabadagAltitudeSicknessPage() {
  return (
    <>
      <PageHero title="Altitude at Babadağ" subtitle="Understanding altitude effects at the 1700m launch area — what's normal and what to watch for." badge="Health & Safety" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Babadağ Guide', href: '/babadag-guide' }, { label: 'Altitude Sickness' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-8">
            <p className="text-green-800 text-sm"><strong>Good News:</strong> True altitude sickness (AMS — Acute Mountain Sickness) at Babadağ's 1700m launch altitude is uncommon for healthy adults. The vast majority of the tens of thousands of visitors who ride the cable car to the top each year experience no ill effects.</p>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-5">Altitude Effects at 1700m</h2>
          <p className="text-slate-600 leading-relaxed mb-5">The Babadağ launch area sits at 1700m above sea level — about the same altitude as many European ski resorts. At this altitude, the air contains approximately 80% of the oxygen available at sea level. For most healthy people this is noticeable but not limiting.</p>
          <p className="text-slate-600 leading-relaxed mb-8">The rapid ascent via cable car (from sea level to 1700m in 10 minutes) can occasionally cause mild symptoms in susceptible individuals — primarily because the body hasn't had time to acclimatise. Given a 30–60 minute rest at the top with water, most people feel completely normal.</p>

          <h2 className="text-xl font-bold text-slate-900 mb-5">Symptoms to Know</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {[
              { label: 'Mild (common, usually self-resolving)', symptoms: ['Mild headache', 'Slight breathlessness at rest', 'Feeling of light-headedness', 'Mild fatigue'], colour: 'green' },
              { label: 'Concerning (report to staff)', symptoms: ['Persistent severe headache', 'Nausea or vomiting', 'Loss of coordination', 'Severe breathlessness at rest'], colour: 'red' },
            ].map(group => (
              <div key={group.label} className={`rounded-2xl p-5 border ${group.colour === 'green' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <h3 className={`font-bold mb-3 text-sm ${group.colour === 'green' ? 'text-green-800' : 'text-red-800'}`}>{group.label}</h3>
                <ul className="space-y-1">
                  {group.symptoms.map(s => (
                    <li key={s} className={`text-sm flex items-center gap-2 ${group.colour === 'green' ? 'text-green-700' : 'text-red-700'}`}>
                      <span>{group.colour === 'green' ? '○' : '⚠'}</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-5">Prevention</h2>
          <div className="space-y-3 mb-10">
            {[
              'Arrive well hydrated — drink at least 1L of water before your cable car ride',
              'Avoid alcohol the evening before and morning of your flight',
              'Do not rush upon arrival at the top — rest for 20–30 minutes before any strenuous activity',
              'Eat a light meal before ascending — low blood sugar worsens altitude symptoms',
              'Tell your pilot about any relevant medical conditions before booking',
            ].map((tip, i) => (
              <div key={i} className="flex gap-3 items-start card p-4">
                <span className="text-green-500 font-bold text-lg flex-shrink-0">✓</span>
                <span className="text-slate-600 text-sm">{tip}</span>
              </div>
            ))}
          </div>

          <FAQAccordion items={faqItems} title="Altitude FAQ" />
        </div>
      </section>
    </>
  )
}
