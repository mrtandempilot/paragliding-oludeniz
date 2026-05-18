import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, ArrowRight, AlertTriangle, Phone, Mail } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import FAQAccordion from '@/components/shared/FAQAccordion'

export const metadata: Metadata = {
  title: 'Paragliding Equipment Rental Ölüdeniz | Gliders, Harnesses & Reserves',
  description:
    'Rent paragliding equipment in Ölüdeniz for flying Babadağ. EN-B and EN-C gliders, harnesses, variometers and GPS. Daily and weekly rates. All equipment EN-tested.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/pilot-services/equipment-rental' },
}

const equipment = [
  {
    item: 'EN-B Glider (Beginner / Intermediate)',
    sizes: 'S, M, L, XL',
    daily: '€35',
    weekly: '€180',
    brands: 'Ozone, Nova, GIN',
    note: 'Great for site exploration and leisure flying. Well-suited to variable Babadağ conditions.',
  },
  {
    item: 'EN-C Glider (Advanced)',
    sizes: 'S, M, L',
    daily: '€50',
    weekly: '€250',
    brands: 'Ozone, Advance, Niviuk',
    note: 'For experienced pilots comfortable with high-performance gliders. Ideal for XC flying.',
  },
  {
    item: 'Harness (Reversible)',
    sizes: 'S, M, L, XL',
    daily: '€15',
    weekly: '€70',
    brands: 'Various',
    note: 'Reversible harnesses with integrated backpack. Comfortable for walking to launch.',
  },
  {
    item: 'Reserve Parachute',
    sizes: '70–110 kg',
    daily: '€15',
    weekly: '€70',
    brands: 'Gin, Apco',
    note: 'All reserves freshly repacked. Strongly recommended for all pilots.',
  },
  {
    item: 'Variometer / GPS',
    sizes: '—',
    daily: '€10',
    weekly: '€45',
    brands: 'Flymaster, Bräuniger',
    note: 'Essential for XC flying. Pre-loaded with Ölüdeniz airspace.',
  },
  {
    item: 'Helmet',
    sizes: 'S–XL',
    daily: '€5',
    weekly: '€20',
    brands: 'Various',
    note: 'EN966 certified paragliding helmets.',
  },
]

const faqItems = [
  {
    question: 'Do I need to show my licence to rent equipment?',
    answer:
      'Yes. We require a valid national or IPPI paragliding licence. For EN-C gliders we also request to see your logbook or evidence of recent flying. This is for your safety and to ensure the equipment is appropriate for your skill level.',
  },
  {
    question: 'Is insurance included with the rental?',
    answer:
      'Equipment rental does not include personal injury insurance. You are required to hold your own third-party liability insurance, which is also mandatory for flying at Babadağ. We can advise on suitable insurers if needed.',
  },
  {
    question: 'Can I reserve equipment in advance?',
    answer:
      'Yes, and we strongly recommend this in July and August when demand is highest. Contact us by email or WhatsApp at least 3 days before your arrival. A 50% deposit secures your equipment.',
  },
  {
    question: 'What if I damage the equipment?',
    answer:
      'All rentals include basic damage waiver. The client is responsible for the cost of any damage beyond normal wear and tear. A credit card deposit is taken at collection and released on return in good condition.',
  },
]

export default function EquipmentRentalPage() {
  return (
    <>
      <PageHero
        title="Equipment Rental — Ölüdeniz"
        subtitle="High-quality EN-certified paragliding equipment for visiting pilots. Fly Babadağ with trusted kit."
        badge="Pilot Services"
        bgImage="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=85"
      />

      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav
            items={[
              { label: 'Pilot Services', href: '/pilot-services' },
              { label: 'Equipment Rental' },
            ]}
          />
        </div>
      </div>

      {/* Intro */}
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Fly Babadağ Without the Baggage
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Travelling with a paraglider is expensive and inconvenient. Our rental fleet lets
            you fly Babadağ with quality, well-maintained equipment without the hassle of
            transporting your own. All equipment is EN-certified, regularly inspected, and
            appropriate for the Babadağ site conditions.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            {[
              'Freshly repacked reserves',
              'EN-certified gliders',
              'Variometers pre-loaded with local airspace',
              'Multiple size options',
              'Daily and weekly rates',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-slate-700 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="section-padding bg-slate-50">
        <div className="container-default">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Equipment & Pricing</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold">Equipment</th>
                  <th className="text-left p-4 text-sm font-semibold">Sizes</th>
                  <th className="text-center p-4 text-sm font-semibold">Daily</th>
                  <th className="text-center p-4 text-sm font-semibold">Weekly</th>
                  <th className="text-left p-4 text-sm font-semibold hidden md:table-cell">Brands</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {equipment.map((item) => (
                  <tr key={item.item} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-slate-900 text-sm">{item.item}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{item.note}</p>
                    </td>
                    <td className="p-4 text-slate-600 text-sm">{item.sizes}</td>
                    <td className="p-4 text-center">
                      <span className="font-bold text-orange-600">{item.daily}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-bold text-orange-600">{item.weekly}</span>
                    </td>
                    <td className="p-4 text-slate-500 text-sm hidden md:table-cell">{item.brands}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-slate-500 text-sm mt-4">
            * Prices are indicative and subject to seasonal availability. Contact us for current availability and any combination discounts.
          </p>
        </div>
      </section>

      {/* Requirements */}
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Requirements</h2>
              <div className="space-y-3">
                {[
                  'Valid paragliding licence (national or IPPI)',
                  'Current third-party liability insurance',
                  'Passport or ID for documentation',
                  'Credit card for deposit',
                  'EN-C gliders: logbook showing recent hours',
                ].map((req) => (
                  <div key={req} className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{req}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-800 text-sm">
                    Reminder: Babadağ also requires a daily pilot pass from the Babadağ
                    Paragliding Association. This is separate from equipment rental.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-slate-900 text-white rounded-2xl p-8">
              <h3 className="font-bold text-xl mb-4">Reserve Your Equipment</h3>
              <p className="text-slate-400 text-sm mb-6">
                Contact us to check availability and reserve your equipment before arriving.
              </p>
              <div className="space-y-4">
                <a
                  href="tel:+905551234567"
                  className="flex items-center gap-3 text-white hover:text-orange-400 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span className="text-sm">+90 555 123 4567</span>
                </a>
                <a
                  href="mailto:rental@paragliding-oludeniz.com"
                  className="flex items-center gap-3 text-white hover:text-orange-400 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span className="text-sm">rental@paragliding-oludeniz.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-3xl">
          <FAQAccordion items={faqItems} title="Equipment Rental FAQ" />
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-default max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Need Training Too?</h2>
          <p className="text-slate-600 mb-6">
            Upgrade your skills with one of our SIV courses, XC clinics, or guided flying weeks.
          </p>
          <Link href="/training" className="btn-primary">
            View Training Courses <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  )
}
