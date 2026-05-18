import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import FAQAccordion from '@/components/shared/FAQAccordion'

export const metadata: Metadata = {
  title: 'Cross Country Paragliding Ölüdeniz | XC Flying from Babadağ',
  description: 'Cross country paragliding guide for Ölüdeniz and Babadağ. XC routes, landing zones, best seasons and what makes this one of Europe\'s best XC sites.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/cross-country-flights' },
}

const faqItems = [
  { question: 'How far can you fly XC from Babadağ?', answer: 'The local record from Babadağ is over 180km. On good XC days, pilots regularly reach Göcek (40km), Kayaköy (25km), Yakaköy (60km) and beyond. The terrain is varied — coastal cliffs, river valleys, forested mountains — with multiple landing options throughout.' },
  { question: 'What experience level is needed for XC from Babadağ?', answer: 'Solid intermediate to advanced skills are required. You should be comfortable in active air, know how to read thermals and avoid rotor zones, and have experience with mountain XC flying. Local knowledge of the landing zones is essential — flying with a local pilot or joining a guided XC day on your first flights is strongly recommended.' },
  { question: 'What is the best time of year for XC from Babadağ?', answer: 'May, June and September offer the best combination of reliable thermals and manageable conditions. July and August have powerful thermals but can be strong and challenging. Spring XC often involves Atlantic-influenced weather fronts. Autumn XC in September and October can produce outstanding conditions.' },
]

export default function CrossCountryPage() {
  return (
    <>
      <PageHero title="Cross Country Flying at Ölüdeniz" subtitle="One of Europe's great XC sites — 180km records, world-class thermals, incredible terrain." badge="XC Flying" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Cross Country Flights' }]} /></div></div>

      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">XC Flying from Babadağ</h2>
          <p className="text-slate-600 leading-relaxed mb-4">Babadağ is not just a tandem site. For experienced cross-country pilots, it is one of the finest XC departure points in the Mediterranean region. The combination of a 1,969m starting altitude, reliable thermal development by mid-morning, and vast open terrain in multiple directions makes it exceptional.</p>
          <p className="text-slate-600 leading-relaxed mb-8">The Fethiye region is large and varied. To the east lies the deep Esen Valley and the Taurus mountain range. To the north-east, the Xanthos Valley and the ancient ruins of Letoon and Xanthos. To the west, the bay of Fethiye and the islands beyond. Good XC days from Babadağ are genuinely exciting.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {[
              { href: '/cross-country-flights/routes', title: 'XC Routes', desc: 'Full route maps, distances, landing zones and difficulty ratings.' },
              { href: '/cross-country-flights/seasons', title: 'Best XC Seasons', desc: 'Month by month XC conditions, weather patterns and historic XC windows.' },
              { href: '/cross-country-flights/thermal-maps', title: 'Thermal Maps', desc: 'Best thermal locations, altitude bands and time-of-day thermal guide.' },
              { href: '/cross-country-flights/landing-zones', title: 'Landing Zones', desc: 'All XC landing zones with GPS coordinates and access instructions.' },
              { href: '/cross-country-flights/community', title: 'XC Community', desc: 'Local XC pilots, weekly XC days, Telegram group and meetups.' },
            ].map(link => (
              <Link key={link.href} href={link.href} className="card p-5 hover:shadow-md transition-all group">
                <h3 className="font-bold text-slate-900 mb-2 group-hover:text-orange-600">{link.title}</h3>
                <p className="text-sm text-slate-600 mb-3">{link.desc}</p>
                <div className="flex items-center gap-1 text-orange-500 text-sm">Read more <ArrowRight className="w-4 h-4" /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50"><div className="container-default max-w-3xl"><FAQAccordion items={faqItems} title="XC Flying FAQ" /></div></section>
    </>
  )
}
