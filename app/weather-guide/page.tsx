import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Sun, Cloud, Wind, Thermometer } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import FAQAccordion from '@/components/shared/FAQAccordion'

export const metadata: Metadata = {
  title: 'Paragliding Weather Guide Ölüdeniz | Best Months',
  description:
    'Complete weather guide for paragliding in Ölüdeniz. Best months to fly, wind directions, thermal conditions, and what to expect season by season on Babadağ.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/weather-guide' },
}

const months = [
  { month: 'Jan', rating: 1, flying: 'Off Season', color: 'bg-slate-200', textColor: 'text-slate-500' },
  { month: 'Feb', rating: 1, flying: 'Off Season', color: 'bg-slate-200', textColor: 'text-slate-500' },
  { month: 'Mar', rating: 2, flying: 'Variable', color: 'bg-amber-200', textColor: 'text-amber-700' },
  { month: 'Apr', rating: 4, flying: 'Good', color: 'bg-green-300', textColor: 'text-green-700' },
  { month: 'May', rating: 5, flying: 'Excellent', color: 'bg-green-500', textColor: 'text-white' },
  { month: 'Jun', rating: 5, flying: 'Excellent', color: 'bg-green-500', textColor: 'text-white' },
  { month: 'Jul', rating: 5, flying: 'Excellent', color: 'bg-green-500', textColor: 'text-white' },
  { month: 'Aug', rating: 5, flying: 'Excellent', color: 'bg-green-500', textColor: 'text-white' },
  { month: 'Sep', rating: 5, flying: 'Best Month', color: 'bg-orange-500', textColor: 'text-white' },
  { month: 'Oct', rating: 4, flying: 'Good', color: 'bg-green-300', textColor: 'text-green-700' },
  { month: 'Nov', rating: 2, flying: 'Variable', color: 'bg-amber-200', textColor: 'text-amber-700' },
  { month: 'Dec', rating: 1, flying: 'Off Season', color: 'bg-slate-200', textColor: 'text-slate-500' },
]

const faqItems = [
  {
    question: 'What is the best month to go paragliding in Ölüdeniz?',
    answer: 'September is widely considered the best month by pilots. The summer crowds have thinned, thermals are still strong and reliable, and the sea breeze is consistent. May and October are also excellent — calmer, cleaner air, perfect for first-timers. The peak summer months (July–August) are great for flying but can be very busy and thermals are strong, which is exciting for experienced pilots.',
  },
  {
    question: 'What wind direction is best for Babadağ?',
    answer: 'The ideal wind direction is north to north-west (N–NW). This creates lift along the Babadağ face and allows smooth soaring flights. A gentle sea breeze from the SW is also flyable and common in afternoons. South wind (known locally as "lodos") is the most challenging and often causes cancellations. East wind can work at certain launch points.',
  },
  {
    question: 'How many days per year is Babadağ flyable?',
    answer: 'Babadağ enjoys around 280–320 flyable days per year during the April–October season. The microclimate created by the surrounding mountains makes it one of the most consistent sites in the world. Cancellations are rare but do happen, usually due to strong south wind, thunderstorms, or low cloud cover.',
  },
  {
    question: 'Is summer flying good for beginners?',
    answer: 'July and August have strong thermals which makes the air lively. Most first-timers do fine — our pilots manage the flight and avoid rough air. However, if you are very nervous or prone to motion sickness, flying in early morning (08:00–10:00) in July–August gives smoother, calmer conditions. April, May and September are the easiest months for nervous flyers.',
  },
]

export default function WeatherGuidePage() {
  return (
    <>
      <PageHero
        title="Paragliding Weather Guide — Ölüdeniz"
        subtitle="Month-by-month flying conditions, wind directions and what to expect on Babadağ."
        badge="Weather Guide"
      />

      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: 'Weather Guide' }]} />
        </div>
      </div>

      {/* Monthly Chart */}
      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Month-by-Month Flying Conditions</h2>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
            {months.map((m) => (
              <div key={m.month} className="text-center">
                <div className={`${m.color} rounded-xl py-8 px-1 mb-2 flex flex-col items-center justify-center`}>
                  {[...Array(m.rating)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-white/70 rounded-full mb-0.5" />
                  ))}
                </div>
                <p className="text-xs font-bold text-slate-700">{m.month}</p>
                <p className={`text-xs ${m.textColor === 'text-white' ? 'text-slate-600' : m.textColor} hidden md:block`} style={{fontSize: '9px'}}>{m.flying}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6 justify-center mt-6 flex-wrap">
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-orange-500 rounded" /><span className="text-sm text-slate-600">Best month</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded" /><span className="text-sm text-slate-600">Excellent</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-300 rounded" /><span className="text-sm text-slate-600">Good</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-amber-200 rounded" /><span className="text-sm text-slate-600">Variable</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-slate-200 rounded" /><span className="text-sm text-slate-600">Off season</span></div>
          </div>
        </div>
      </section>

      {/* Sub-pages */}
      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Detailed Weather Guides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { href: '/weather-guide/best-months', icon: Sun, title: 'Best Months to Fly', desc: 'Month by month detailed breakdown of flying quality, tourist crowds and what to expect.', color: 'text-amber-500', bg: 'bg-amber-50' },
              { href: '/weather-guide/wind-directions', icon: Wind, title: 'Wind Directions Explained', desc: 'How each wind direction affects flying in Ölüdeniz and which launches work in each.', color: 'text-sky-500', bg: 'bg-sky-50' },
              { href: '/weather-guide/summer-thermals', icon: Thermometer, title: 'Summer Thermals Guide', desc: 'Everything about strong summer thermals — best hours, danger signs and how to stay safe.', color: 'text-red-500', bg: 'bg-red-50' },
              { href: '/weather-guide/winter-flying', icon: Cloud, title: 'Winter Flying in Ölüdeniz', desc: 'Is it possible to fly in winter? What expert pilots do and what you need to know.', color: 'text-slate-500', bg: 'bg-slate-50' },
              { href: '/thermals-guide', icon: Wind, title: 'Complete Thermals Guide', desc: 'Deep dive into how thermals work in Ölüdeniz, best locations, and reading the sky.', color: 'text-purple-500', bg: 'bg-purple-50' },
              { href: '/live-weather', icon: Sun, title: 'Live Weather & Forecasts', desc: 'Real-time wind data, webcams, and forecast tools used by our pilots.', color: 'text-green-500', bg: 'bg-green-50' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}
                  className="card p-6 hover:shadow-md transition-all hover:-translate-y-0.5 group flex gap-4">
                  <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-orange-600 transition-colors">{item.title}</h3>
                    <p className="text-slate-600 text-sm">{item.desc}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <FAQAccordion items={faqItems} title="Weather FAQ" />
        </div>
      </section>
    </>
  )
}
