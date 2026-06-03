import type { Metadata } from 'next'
import Link from 'next/link'
import { Car, Clock, MapPin, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'

export const metadata: Metadata = {
  title: 'Babadağ Mountain Road Guide | Driving to the Launch',
  description:
    'Complete driving guide to Babadağ Mountain in Ölüdeniz. Road conditions, parking, directions, distance from Fethiye, and tips for solo pilots driving to launch.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/babadag-road-guide' },
}

const tips = [
  {
    icon: '🔄',
    title: 'Narrow switchbacks',
    detail:
      'The road has many tight hairpin bends. Drive slowly and use your horn on blind corners. Give way to downhill traffic at passing places.',
  },
  {
    icon: '🚗',
    title: 'Suitable vehicles',
    detail:
      'Any car can make it in dry conditions. In wet weather or if carrying heavy equipment, a higher-clearance vehicle is preferable. Large vans and buses have dedicated routes.',
  },
  {
    icon: '🅿️',
    title: 'Parking at the top',
    detail:
      'Paid parking is available at the main launch area. In peak summer season (July–August) arrive before 09:00 to secure a space. The car park fills up quickly on good flying days.',
  },
  {
    icon: '❄️',
    title: 'Winter access',
    detail:
      'The road can become icy or snow-covered outside of the main season. Do not attempt the road in winter without checking conditions first.',
  },
  {
    icon: '⛽',
    title: 'Fuel up before',
    detail:
      'There are no petrol stations on the mountain road. Fill up in Fethiye or Ölüdeniz before heading up.',
  },
  {
    icon: '📱',
    title: 'GPS / navigation',
    detail:
      'Search for "Babadağ Paragliding Launch" or "Babadağ Teleferik Üst İstasyonu" in Google Maps or Maps.me. Both work reliably on this route.',
  },
]

export default function BabadagRoadGuidePage() {
  return (
    <>
      <PageHero
        title="Driving to Babadağ Mountain"
        subtitle="Complete road guide for pilots and visitors driving to the Babadağ paragliding launch."
        badge="Access Guide"
        bgImage="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=85"
      />

      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav
            items={[
              { label: 'Babadağ Guide', href: '/babadag-guide' },
              { label: 'Road Guide' },
            ]}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <section className="section-padding bg-white">
        <div className="container-default">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { icon: Clock, label: 'Drive from Ölüdeniz', value: '20 min', color: 'text-sky-600', bg: 'bg-sky-50' },
              { icon: Clock, label: 'Drive from Fethiye', value: '35 min', color: 'text-orange-600', bg: 'bg-orange-50' },
              { icon: Car, label: 'Road Type', value: 'Tarmac', color: 'text-green-600', bg: 'bg-green-50' },
              { icon: MapPin, label: 'Elevation Gain', value: '+1,200m', color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="card p-5 text-center">
                  <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div className="font-bold text-slate-900 text-lg">{item.value}</div>
                  <div className="text-slate-500 text-xs mt-1">{item.label}</div>
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">The Route</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                The mountain road to Babadağ is a well-maintained tarmac road that winds up the
                southern face of the mountain. The total distance from the Ölüdeniz beach road is
                approximately 12km, with an ascent of around 1,200 metres. The road is steep and
                winding in places but perfectly driveable in a standard car.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                For pilots driving to the launch: the road takes you directly to the main car park
                adjacent to the launch area. From here you can access all four launch points on foot.
                The tandem launch at 1,200m is just steps from the car park.
              </p>

              {/* Step by step */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-lg">Step by Step Directions</h3>
                {[
                  { step: '1', instruction: 'From Ölüdeniz beach road, head through the village towards Hisarönü/Babadağ.' },
                  { step: '2', instruction: 'Look for the brown "Babadağ Paragliding" or "Teleferik" signs — follow these consistently.' },
                  { step: '3', instruction: 'After leaving the village, the road begins to climb steeply with switchbacks. Stay on the main road.' },
                  { step: '4', instruction: 'After approximately 20 minutes driving, you will reach the cable car upper station and main car park.' },
                  { step: '5', instruction: 'Park in the designated car park (fee applies in season). The launch area is visible from the car park.' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <p className="text-slate-700 text-sm pt-1">{item.instruction}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-6">Road Tips & Advice</h3>
              <div className="space-y-4">
                {tips.map((tip) => (
                  <div key={tip.title} className="card p-5">
                    <div className="flex gap-3">
                      <span className="text-xl flex-shrink-0">{tip.icon}</span>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm mb-1">{tip.title}</p>
                        <p className="text-slate-600 text-sm">{tip.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Warning */}
      <section className="bg-amber-50 py-8">
        <div className="container-default max-w-3xl">
          <div className="flex gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-900 mb-2">Important Safety Note</h3>
              <p className="text-amber-800 text-sm leading-relaxed">
                The mountain road can be busy with paragliding traffic in summer mornings. Drive carefully,
                use dipped headlights, and always give way to oncoming vehicles at narrow sections.
                Do not attempt to overtake on blind bends. The road is not suitable for large motorhomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alternative */}
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Prefer the Cable Car?</h2>
          <div className="card p-6">
            <p className="text-slate-600 mb-4">
              If you would rather not drive the mountain road, the Babadağ teleferik (cable car)
              is the most convenient alternative. It departs from near the Ölüdeniz beach lagoon
              entrance and takes just 10 minutes to reach the mountain station.
            </p>
            <Link
              href="/babadag-teleferik"
              className="inline-flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700 transition-colors"
            >
              Full cable car guide <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-2xl">
          <BookingCTA
            title="Tandem Flight? We Handle the Transfer"
            subtitle="All tandem flights include transfer to the Babadağ launch. No driving needed."
          />
        </div>
      </section>
    </>
  )
}
