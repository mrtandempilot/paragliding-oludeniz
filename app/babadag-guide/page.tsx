import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Mountain, Wind, AlertTriangle, CheckCircle } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import FAQAccordion from '@/components/shared/FAQAccordion'
import BookingCTA from '@/components/shared/BookingCTA'

export const metadata: Metadata = {
  title: 'Babadağ Mountain Guide | Paragliding Launch Points & Landing Zones',
  description:
    'Complete guide to Babadağ Mountain for paragliding. All 4 launch points (1200m–1900m), landing zones, cable car info, road access and weather conditions.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/babadag-guide' },
}

const launches = [
  {
    altitude: '1200m',
    href: '/babadag-guide/takeoff-1200m',
    title: 'Lower Launch — 1200m',
    level: 'Tandem & Beginners',
    levelColor: 'bg-green-100 text-green-700',
    desc: 'The main launch point for tandem flights. Smooth runway, well-organised, and operates even in moderate wind. Shortest flight time but spectacular views of the Blue Lagoon.',
  },
  {
    altitude: '1700m',
    href: '/babadag-guide/takeoff-1700m',
    title: 'Mid Launch — 1700m',
    level: 'All Levels',
    levelColor: 'bg-sky-100 text-sky-700',
    desc: 'The most popular launch for both tandem and solo pilots. Excellent thermal development, longer flight times, and panoramic views of the Fethiye region.',
  },
  {
    altitude: '1800m',
    href: '/babadag-guide/takeoff-1800m',
    title: 'Upper Launch — 1800m',
    level: 'Intermediate+',
    levelColor: 'bg-amber-100 text-amber-700',
    desc: 'The primary XC launch point. From here, pilots can link thermals for cross-country flights toward Göcek, Kayaköy, and beyond. Requires good skills and local knowledge.',
  },
  {
    altitude: '1900m',
    href: '/babadag-guide/takeoff-1900m',
    title: 'Summit Launch — 1900m',
    level: 'Expert Only',
    levelColor: 'bg-red-100 text-red-700',
    desc: 'The highest launch on Babadağ. Used by experienced pilots in specific conditions only. Not suitable for tandem flights. Breathtaking views of the entire Aegean coast.',
  },
]

const faqItems = [
  {
    question: 'How do I get to Babadağ Mountain?',
    answer: 'There are two ways. The cable car (teleferik) departs from near the Ölüdeniz beach car park and takes about 10 minutes to the main station. Alternatively, you can drive up the mountain road — about 20 minutes from Ölüdeniz. Parking is available at the top. Our tandem transfers include transport to the launch.',
  },
  {
    question: 'What is the best time of day to fly from Babadağ?',
    answer: 'Morning flights (before 10:00) are smoothest and calmer — ideal for first-timers or anyone prone to motion sickness. From around 10:00–14:00, thermals build and it gets more lively — great for XC pilots. Afternoon and sunset flights are popular for the light and views, with calming conditions as the day cools.',
  },
  {
    question: 'Do I need a permit to fly solo from Babadağ?',
    answer: 'Yes. All licensed pilots must purchase a daily, weekly or seasonal pilot pass from the Babadağ Paragliding Association office at the launch site. You will also need to show a valid licence and current third-party liability insurance. Foreign licences are accepted.',
  },
  {
    question: 'Can I fly in winter from Babadağ?',
    answer: 'The mountain is officially open April to October. Winter flying does happen but is not organised — the cable car does not run, road access can be icy, and there is no support infrastructure. Some local expert pilots fly during winter windows, but we do not recommend it for visitors.',
  },
  {
    question: 'What are the emergency procedures if something goes wrong?',
    answer: 'Babadağ has an organised rescue service operating during the season. The launch and landing areas have first aid stations. In the event of a tree or sea landing, contact the rescue line immediately (number posted at launch). All tandem flights are covered by third-party insurance.',
  },
]

export default function BabadagGuidePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: 'Babadağ Mountain — Paragliding Launch Site',
    description: 'World-renowned paragliding mountain in Ölüdeniz, Turkey. 4 launch points from 1200m to 1900m.',
    geo: { '@type': 'GeoCoordinates', latitude: 36.5281, longitude: 29.1183 },
    address: { '@type': 'PostalAddress', addressLocality: 'Fethiye', addressCountry: 'TR' },
    touristType: 'Adventure tourism, paragliding',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        title="Babadağ Mountain — Complete Paragliding Guide"
        subtitle="Everything you need to know about the world's most famous paragliding mountain."
        badge="Babadağ Guide"
      />

      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: 'Babadağ Guide' }]} />
        </div>
      </div>

      {/* Overview */}
      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">The Mountain</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-6">Why Babadağ is a Paragliding Legend</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-slate-600 leading-relaxed mb-4">
                Babadağ (literally &ldquo;Father Mountain&rdquo; in Turkish) rises to 1,969 metres above the turquoise waters of the Mediterranean. From its slopes, paragliders have been launching for over 30 years — and the combination of reliable thermals, spectacular scenery and four distinct launch points makes it unique in the world.
              </p>
              <p className="text-slate-600 leading-relaxed">
                The mountain faces south-west, catching the afternoon sea breeze perfectly. Below it lies the Blue Lagoon — one of the most photographed places in Turkey — and the long sandy beach of Ölüdeniz. The views from the air are simply exceptional.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Summit', value: '1,969m' },
                { label: 'Main Launch', value: '1,700m' },
                { label: 'Flying Days', value: '300+/year' },
                { label: 'Launch Points', value: '4' },
                { label: 'Landing Zone', value: 'Main Beach' },
                { label: 'XC Record', value: '180km' },
              ].map((s) => (
                <div key={s.label} className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-xl font-bold text-orange-500">{s.value}</p>
                  <p className="text-xs text-slate-600 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Launch Points */}
      <section className="section-padding bg-slate-50">
        <div className="container-default">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">The 4 Launch Points</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {launches.map((launch) => (
              <Link key={launch.href} href={launch.href}
                className="card p-6 hover:shadow-md transition-all hover:-translate-y-0.5 group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Mountain className="w-5 h-5 text-orange-500" />
                    <span className="font-bold text-slate-900">{launch.altitude}</span>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${launch.levelColor}`}>
                    {launch.level}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-orange-600 transition-colors">
                  {launch.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{launch.desc}</p>
                <div className="flex items-center gap-1 text-orange-500 text-sm font-medium">
                  Detailed guide <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Access */}
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Getting to Babadağ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                🚡 Cable Car (Teleferik)
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">The easiest and most popular way. The cable car departs from near the Ölüdeniz beach lagoon entrance and reaches the mountain station in about 10 minutes.</p>
              <Link href="/babadag-teleferik" className="text-orange-500 text-sm font-medium hover:underline">
                Full cable car guide →
              </Link>
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                🚗 Mountain Road
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">A winding road leads from Ölüdeniz village to the launch area. Takes about 20–25 minutes by car. Parking available at the top. Good road condition in season.</p>
              <Link href="/babadag-road-guide" className="text-orange-500 text-sm font-medium hover:underline">
                Road guide →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-3xl">
          <FAQAccordion items={faqItems} title="Babadağ FAQ" />
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-3xl">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Explore More About Flying at Babadağ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { href: '/cross-country-flights', title: 'Cross Country Flying', desc: 'XC routes up to 180km, landing zones and seasonal XC windows from Babadağ.' },
              { href: '/solo-paragliding', title: 'Solo Pilot Information', desc: 'Licences, pilot passes, airspace rules and site requirements for visiting pilots.' },
              { href: '/thermals-guide', title: 'Thermals Guide', desc: 'Understand the daily thermal cycle and wind patterns on Babadağ before you fly.' },
            ].map(link => (
              <Link key={link.href} href={link.href} className="flex gap-3 p-4 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50 transition-all group">
                <ArrowRight className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-orange-600 text-sm">{link.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{link.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-default max-w-2xl">
          <BookingCTA title="Book a Tandem Flight from Babadağ" subtitle="We handle everything — transfer to launch, equipment, certified pilot, beach landing." />
        </div>
      </section>
    </>
  )
}
