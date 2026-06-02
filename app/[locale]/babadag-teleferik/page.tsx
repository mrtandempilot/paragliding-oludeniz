import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, Euro, MapPin, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import FAQAccordion from '@/components/shared/FAQAccordion'
import BookingCTA from '@/components/shared/BookingCTA'

export const metadata: Metadata = {
  title: 'Babadağ Cable Car (Teleferik) | Ölüdeniz Guide',
  description:
    'Everything about the Babadağ teleferik (cable car) in Ölüdeniz — ticket prices, opening hours, location, tips, and how to use it to reach the paragliding launch.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/babadag-teleferik' },
}

const faqItems = [
  {
    question: 'How long does the cable car ride take?',
    answer:
      'The ride from the valley station to the mountain station takes approximately 10–12 minutes each way. The total journey including boarding time is usually 15–20 minutes.',
  },
  {
    question: 'Can I take the cable car as a non-paraglider just for the view?',
    answer:
      'Absolutely. The cable car is open to everyone, not just paragliders. The view from the top is spectacular and many visitors take it purely for sightseeing. There is a viewing terrace and a small café at the top station.',
  },
  {
    question: 'Is the cable car included in my tandem paragliding booking?',
    answer:
      'No — if you book a tandem paragliding flight with us, your transfer to the launch is handled separately by our team (usually by minibus up the mountain road). You do not need to take the cable car for your paragliding flight.',
  },
  {
    question: 'What happens if it is windy or cloudy at the top?',
    answer:
      'The cable car operates in most weather conditions. However, it may pause or close temporarily during thunderstorms or very high winds. Check at the ticket office on the day. The view from the top can still be impressive even with some cloud — you may be looking down on the clouds!',
  },
  {
    question: 'Is the cable car suitable for people with a fear of heights?',
    answer:
      'The cabins are enclosed, relatively large, and move smoothly. Many visitors with mild height anxiety enjoy the experience. However, if you have a severe fear of heights, the open views and height of the ride may be challenging. The mountain road alternative may be more comfortable.',
  },
]

export default function BabadagTeleferikPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: 'Babadağ Cable Car (Teleferik)',
    description:
      'Cable car connecting Ölüdeniz beach area to Babadağ Mountain station. Used by paragliders and tourists.',
    geo: { '@type': 'GeoCoordinates', latitude: 36.548, longitude: 29.118 },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ölüdeniz',
      addressRegion: 'Fethiye, Muğla',
      addressCountry: 'TR',
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        title="Babadağ Cable Car (Teleferik)"
        subtitle="The easiest way to reach Babadağ Mountain — 10 minutes from the valley floor to 1200m."
        badge="Babadağ Access"
        bgImage="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=85"
      />

      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav
            items={[
              { label: 'Babadağ Guide', href: '/babadag-guide' },
              { label: 'Cable Car (Teleferik)' },
            ]}
          />
        </div>
      </div>

      {/* Quick Info Cards */}
      <section className="section-padding bg-white">
        <div className="container-default">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { icon: Clock, label: 'Ride Duration', value: '~10 min', color: 'text-sky-600', bg: 'bg-sky-50' },
              { icon: Euro, label: 'Return Ticket', value: '~€12', color: 'text-green-600', bg: 'bg-green-50' },
              { icon: MapPin, label: 'Arrives At', value: '1,200m', color: 'text-orange-600', bg: 'bg-orange-50' },
              { icon: Clock, label: 'Season', value: 'Apr–Oct', color: 'text-purple-600', bg: 'bg-purple-50' },
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

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                How the Babadağ Teleferik Works
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                The Babadağ cable car (teleferik in Turkish) is the most popular and convenient way
                to reach the mountain. The lower valley station is located near the entrance to the
                Ölüdeniz beach lagoon — easy to find and a short walk from most hotels and the
                beach strip.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                Modern enclosed gondola cabins carry you smoothly up the mountainside in around
                10 minutes. The views during the ascent are spectacular — the Blue Lagoon gradually
                reveals itself below as you climb. At the top station (approximately 1,200m) there is
                a terrace, café, souvenir shop, and direct access to the main tandem paragliding
                launch area.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                The cable car runs from approximately 08:00 to 22:00 during the season (April–October).
                Tickets can be bought at the lower station. Return tickets are available and
                recommended. Last car down is usually around 22:00 — check locally for exact timings
                as they can vary by season and demand.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900 mb-1">For tandem paragliding guests</p>
                    <p className="text-amber-800 text-sm">
                      If you have booked a tandem flight with us, your transfer to the launch is
                      included and handled by our team. You do not need to buy cable car tickets
                      separately.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Tips for Visiting</h3>
              {[
                {
                  tip: 'Go early to avoid queues',
                  detail: 'The cable car is very popular in July and August. Arriving before 09:00 avoids the longest queues.',
                },
                {
                  tip: 'Bring a jacket',
                  detail: 'It is noticeably cooler at 1200m — often 5–10°C lower than on the beach. A light layer is recommended.',
                },
                {
                  tip: 'Check the weather',
                  detail: 'The top can be in cloud when the valley is clear. Check the mountain webcam before going.',
                },
                {
                  tip: 'The view is worth it alone',
                  detail: 'Even without a paragliding flight, the view of the Blue Lagoon from 1200m is genuinely breathtaking.',
                },
                {
                  tip: 'Combined paragliding + cable car',
                  detail: 'Some visitors take the cable car up, watch paragliders launch, then take it back down. A great way to experience the mountain without flying.',
                },
              ].map((item) => (
                <div key={item.tip} className="card p-5 flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{item.tip}</p>
                    <p className="text-slate-600 text-sm mt-1">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Finding the Cable Car</h2>
          <div className="card p-6">
            <div className="flex gap-3 mb-4">
              <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">Valley Station (Lower)</p>
                <p className="text-slate-600 text-sm">
                  Near the Ölüdeniz beach lagoon entrance / Belcekız Beach. Walking distance from
                  most hotels on the main strip. Look for the cable car signs — it is impossible to
                  miss once you reach the lagoon area.
                </p>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-4">
              <p className="text-slate-600 text-sm">
                From Fethiye: take the Ölüdeniz dolmuş (shared minibus) which stops near the cable
                car station. Journey time approximately 20 minutes from Fethiye centre.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/babadag-road-guide"
              className="inline-flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700 transition-colors"
            >
              Prefer to drive? See the mountain road guide <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <FAQAccordion items={faqItems} title="Cable Car FAQ" />
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-2xl">
          <BookingCTA
            title="Ready to Fly from the Top?"
            subtitle="Book a tandem paragliding flight and we handle your transfer to the launch."
          />
        </div>
      </section>
    </>
  )
}
