import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Live Weather Ölüdeniz | Babadağ Paragliding Conditions',
  description:
    'Live weather and flying conditions for Ölüdeniz and Babadağ Mountain. Real-time wind, temperature, and links to the best forecasts used by local paragliding pilots.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/live-weather' },
}

import { Wind, Thermometer, Eye, Droplets, RefreshCw, ExternalLink, ArrowRight } from 'lucide-react'

// Note: In production this page would fetch from a weather API.
// For now it shows static representative data and links to live sources.

const weatherSources = [
  {
    name: 'Windguru — Babadağ',
    url: 'https://www.windguru.cz/station/1234',
    desc: 'Real-time wind speed, direction and gusts from the Babadağ station. Most popular resource among local pilots.',
    icon: '💨',
  },
  {
    name: 'Windyty — Ölüdeniz',
    url: 'https://www.windy.com/?36.55,29.12,12',
    desc: 'Animated wind forecast overlay. Zoom in on Babadağ to see local conditions and cloud development.',
    icon: '🌀',
  },
  {
    name: 'Meteoblue — Fethiye',
    url: 'https://www.meteoblue.com/en/weather/forecast/week/fethiye',
    desc: 'High-quality mountain weather forecast. Use the "multimodel" view for the best accuracy on Babadağ.',
    icon: '📊',
  },
  {
    name: 'XCweather — Ölüdeniz',
    url: 'https://xcweather.co.uk',
    desc: 'Simple wind speed and direction forecast specifically formatted for paraglider pilots.',
    icon: '🪂',
  },
]

const currentConditions = [
  { label: 'Wind Speed', value: '12 km/h', icon: Wind, color: 'text-sky-600', bg: 'bg-sky-50', note: 'SW · Light breeze' },
  { label: 'Temperature', value: '28°C', icon: Thermometer, color: 'text-orange-600', bg: 'bg-orange-50', note: 'Feels like 29°C' },
  { label: 'Visibility', value: '30+ km', icon: Eye, color: 'text-green-600', bg: 'bg-green-50', note: 'Excellent' },
  { label: 'Humidity', value: '52%', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-50', note: 'Comfortable' },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://paragliding-oludeniz.com/' },
    { '@type': 'ListItem', position: 2, name: 'Live Weather', item: 'https://paragliding-oludeniz.com/live-weather' },
  ],
}

export default function LiveWeatherPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Page Header (static since this is client component) */}
      <div className="relative py-28 md:py-36 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1601134467661-3d775b999c18?w=1920&q=85')" }}
        />
        <div className="absolute inset-0 bg-hero" />
        <div className="relative z-10 text-center px-4">
          <span className="inline-block bg-orange-500/90 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Live Conditions
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">
            Ölüdeniz Live Weather
          </h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto">
            Current conditions at Babadağ Mountain and Ölüdeniz beach, with links to the best
            real-time forecasts used by local pilots.
          </p>
        </div>
      </div>

      {/* Current Conditions */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Current Conditions</h2>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <RefreshCw className="w-4 h-4" />
              <span>Representative data — see live sources below</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
            ⚠️ The values below are indicative only. Always check the live sources listed on this page before flying.
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {currentConditions.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
                  <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                  <p className="text-slate-500 text-sm mt-0.5">{item.label}</p>
                  <p className="text-xs text-slate-400 mt-1">{item.note}</p>
                </div>
              )
            })}
          </div>

          {/* Flying Status Banner */}
          <div className="bg-green-50 border border-green-300 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xl">✓</span>
            </div>
            <div>
              <p className="font-bold text-green-900 text-lg">Conditions Typically Good for Flying</p>
              <p className="text-green-700 text-sm">Based on typical May–September conditions. Always verify with live sources before flight.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Sources */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Trusted Live Forecast Sources</h2>
          <p className="text-slate-600 mb-8">
            These are the resources used daily by Babadağ pilots and our tandem team.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {weatherSources.map((source) => (
              <a
                key={source.name}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow flex gap-4 group"
              >
                <span className="text-3xl flex-shrink-0">{source.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {source.name}
                    </h3>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-slate-600 text-sm">{source.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Pilot Tips */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Reading the Weather for Babadağ</h2>
          <div className="space-y-3">
            {[
              { tip: 'Check wind at 1500–2000m, not just surface', detail: 'Upper winds often differ significantly from what you feel at beach level.' },
              { tip: 'The Babadağ webcam is your best friend', detail: 'You can literally see whether cloud is above or below the launch. Check it live before driving up.' },
              { tip: 'Morning forecasts are more reliable', detail: 'The afternoon sea breeze timing is hard to predict precisely. Always have a plan for early arrival.' },
              { tip: 'Windguru local station > global models', detail: 'The local Babadağ station shows actual conditions at the launch, far more accurate than interpolated forecasts.' },
            ].map((item) => (
              <div key={item.tip} className="bg-slate-50 rounded-xl p-5">
                <p className="font-semibold text-slate-900 mb-1">{item.tip}</p>
                <p className="text-slate-600 text-sm">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Links */}
      <section className="py-8 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="flex flex-wrap gap-4">
            <Link href="/weather-guide" className="inline-flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700">
              Full weather guide <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/thermals-guide" className="inline-flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700">
              Thermals guide <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/weather-guide/best-months" className="inline-flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700">
              Best months to fly <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-orange-500 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Let Us Check the Weather for You</h3>
            <p className="text-orange-100 text-sm mb-6">
              Our operations team monitors conditions daily and only flies when it is safe. Book a
              tandem flight and we handle all the weather decisions.
            </p>
            <Link
              href="/book-now"
              className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors"
            >
              Book Your Flight <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
