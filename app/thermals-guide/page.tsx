import type { Metadata } from 'next'
import Link from 'next/link'
import { Wind, Sun, ArrowRight, AlertTriangle } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import FAQAccordion from '@/components/shared/FAQAccordion'
import BookingCTA from '@/components/shared/BookingCTA'

export const metadata: Metadata = {
  title: 'Thermals Guide for Babadağ & Ölüdeniz | Paragliding Conditions',
  description:
    'Understanding thermals at Babadağ Mountain, Ölüdeniz. Daily thermal cycles, trigger points, cloud base, XC potential, and conditions by season.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/thermals-guide' },
}

const faqItems = [
  {
    question: 'When do thermals start on Babadağ?',
    answer:
      'Thermals typically begin to develop from around 09:00–10:00 as the sun heats the southern slopes. By 11:00–12:00 in summer, thermals are usually well established and the air becomes noticeably more active. In spring and autumn, thermal development may be an hour later.',
  },
  {
    question: 'What is the typical cloud base at Babadağ?',
    answer:
      'In summer (June–September), cloud base is typically 2,000–2,800m, giving plenty of working height above the 1,960m summit. In spring and autumn it can be lower, sometimes 1,400–1,800m, which can compress the usable airspace. On some days the mountain is above cloud base — in this case pilots must fly below the cloud layer.',
  },
  {
    question: 'Is the sea breeze a problem for paragliders?',
    answer:
      'The sea breeze (locally called the Meltemi in summer) can make afternoon conditions challenging. It typically arrives from the south-west between 13:00–16:00 in July and August, and can make conditions rough for less experienced pilots. Morning flights before the sea breeze are recommended for beginners.',
  },
  {
    question: 'Can I do cross-country flights from Babadağ?',
    answer:
      'Absolutely. Babadağ is one of the premier XC sites in Turkey. The main XC route runs north towards Kayaköy and the Fethiye valley. Strong pilots have recorded flights of over 180km. The best XC conditions are from May to September, with June and July producing the strongest thermal conditions.',
  },
  {
    question: 'Are there rotor or turbulence problems behind the mountain?',
    answer:
      'In northerly or strong westerly winds, rotor can develop on the lee side of Babadağ. The north-facing slopes are not suitable for flying in these conditions. The launch areas are carefully positioned to avoid the worst rotors, but pilots should always check wind direction carefully before launching.',
  },
]

export default function ThermalsGuidePage() {
  return (
    <>
      <PageHero
        title="Thermals Guide — Babadağ & Ölüdeniz"
        subtitle="Understanding the air at Babadağ: thermal cycles, triggers, sea breeze, and XC conditions."
        badge="Pilots' Guide"
        bgImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85"
      />

      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav
            items={[
              { label: 'Weather Guide', href: '/weather-guide' },
              { label: 'Thermals Guide' },
            ]}
          />
        </div>
      </div>

      {/* Overview */}
      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">
                Why Babadağ Works
              </span>
              <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-6">
                Exceptional Thermal Conditions
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Babadağ Mountain is positioned almost perfectly for paragliding thermals. The
                south-west facing slopes receive direct sun from mid-morning through the afternoon,
                heating the rocky terrain and creating strong, reliable thermals. The mountain rises
                directly from the sea, meaning the interaction between sea air and heated mountain
                air generates consistent uplift.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                The primary thermal triggers are the rocky clearings and south-facing slopes between
                1,200m and 1,700m. The summit ridge also produces strong orographic lift when the
                sea breeze is running. On good days, pilots can top out at cloud base and begin
                cross-country flights heading north into the Fethiye valley.
              </p>
              <p className="text-slate-600 leading-relaxed">
                In summer, the classic Babadağ day follows a predictable pattern: calm mornings,
                thermals building from 09:00–10:00, strong conditions midday through 15:00, then
                sea breeze arrival in the afternoon bringing ridge lift and evening calm.
              </p>
            </div>

            {/* Daily Cycle */}
            <div className="bg-slate-900 text-white rounded-2xl p-8">
              <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                <Sun className="w-5 h-5 text-yellow-400" />
                Typical Summer Day
              </h3>
              <div className="space-y-4">
                {[
                  { time: '07:00–09:00', condition: 'Calm', desc: 'Smooth air, great for beginners, no thermals yet.', color: 'bg-green-500' },
                  { time: '09:00–11:00', condition: 'Building', desc: 'First thermals developing. Pleasant flying conditions.', color: 'bg-lime-500' },
                  { time: '11:00–14:00', condition: 'Active', desc: 'Strong thermals, XC potential, experienced pilots.', color: 'bg-amber-500' },
                  { time: '14:00–17:00', condition: 'Sea Breeze', desc: 'Meltemi arrives. Ridge soaring. Can be rough.', color: 'bg-orange-500' },
                  { time: '17:00–20:00', condition: 'Calming', desc: 'Evening smooths out. Best sunset flight window.', color: 'bg-sky-500' },
                ].map((slot) => (
                  <div key={slot.time} className="flex gap-3 items-start">
                    <div className={`w-2 h-2 rounded-full ${slot.color} mt-2 flex-shrink-0`} />
                    <div>
                      <span className="text-slate-400 text-xs font-mono">{slot.time}</span>
                      <span className="font-bold text-white text-sm ml-2">{slot.condition}</span>
                      <p className="text-slate-400 text-xs mt-0.5">{slot.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="section-padding bg-slate-50">
        <div className="container-default">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Thermal Data</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: 'Avg Summer Cloud Base', value: '2,400m', icon: '☁️' },
              { label: 'Max Climb Rates', value: '3–6 m/s', icon: '↑' },
              { label: 'XC Record', value: '180+ km', icon: '🏆' },
              { label: 'Flyable Days / Year', value: '~300', icon: '📅' },
            ].map((stat) => (
              <div key={stat.label} className="card p-5 text-center">
                <span className="text-3xl block mb-2">{stat.icon}</span>
                <p className="text-xl font-bold text-orange-500">{stat.value}</p>
                <p className="text-slate-600 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wind Directions */}
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Wind Directions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { direction: 'SW / W (Sea Breeze)', verdict: 'Flyable', color: 'border-green-300 bg-green-50', detail: 'The prevailing summer wind. Good for ridge soaring on the south face. Standard flying conditions.' },
              { direction: 'NW (Northerly)', verdict: 'Caution', color: 'border-amber-300 bg-amber-50', detail: 'Can work but creates variable conditions. Check carefully before launch. Not suitable for inexperienced pilots.' },
              { direction: 'NE / N (Tramontane)', verdict: 'Difficult', color: 'border-orange-300 bg-orange-50', detail: 'Tailwind for south-facing launches. Rotor risk on lee side. Wait for conditions to change or fly only with expert local guidance.' },
              { direction: 'S / SE (Sirocco)', verdict: 'Off', color: 'border-red-300 bg-red-50', detail: 'Strong southerlies bring rough conditions and potentially dangerous turbulence. Site is closed on strong S days.' },
            ].map((w) => (
              <div key={w.direction} className={`border ${w.color} rounded-xl p-5`}>
                <div className="flex items-start justify-between mb-2">
                  <p className="font-bold text-slate-900">{w.direction}</p>
                  <span className="text-xs font-bold text-slate-600">{w.verdict}</span>
                </div>
                <p className="text-slate-600 text-sm">{w.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-amber-800 text-sm">
                Always consult a local pilot or instructor before flying Babadağ for the first time.
                Local knowledge of the specific conditions, rotor areas, and landing zones is essential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-3xl">
          <FAQAccordion items={faqItems} title="Thermals FAQ" />
        </div>
      </section>

      {/* Links */}
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Related Guides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/weather-guide" className="card p-5 hover:shadow-md transition-shadow flex items-center gap-3 group">
              <Wind className="w-6 h-6 text-sky-500" />
              <span className="font-medium text-slate-900 group-hover:text-orange-600 transition-colors">Full Weather Guide</span>
              <ArrowRight className="w-4 h-4 text-orange-500 ml-auto" />
            </Link>
            <Link href="/weather-guide/best-months" className="card p-5 hover:shadow-md transition-shadow flex items-center gap-3 group">
              <Sun className="w-6 h-6 text-amber-500" />
              <span className="font-medium text-slate-900 group-hover:text-orange-600 transition-colors">Best Months to Fly</span>
              <ArrowRight className="w-4 h-4 text-orange-500 ml-auto" />
            </Link>
            <Link href="/cross-country-flights" className="card p-5 hover:shadow-md transition-shadow flex items-center gap-3 group">
              <Wind className="w-6 h-6 text-orange-500" />
              <span className="font-medium text-slate-900 group-hover:text-orange-600 transition-colors">Cross Country Flying</span>
              <ArrowRight className="w-4 h-4 text-orange-500 ml-auto" />
            </Link>
            <Link href="/babadag-guide" className="card p-5 hover:shadow-md transition-shadow flex items-center gap-3 group">
              <Sun className="w-6 h-6 text-slate-500" />
              <span className="font-medium text-slate-900 group-hover:text-orange-600 transition-colors">Babadağ Mountain Guide</span>
              <ArrowRight className="w-4 h-4 text-orange-500 ml-auto" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 section-padding">
        <div className="container-default max-w-2xl">
          <BookingCTA
            title="Fly with a Pilot Who Knows the Air"
            subtitle="Our tandem pilots have thousands of hours on Babadağ. They know exactly when and where to fly."
          />
        </div>
      </section>
    </>
  )
}
