import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Star } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import FAQAccordion from '@/components/shared/FAQAccordion'

export const metadata: Metadata = {
  title: 'Paragliding Prices Ölüdeniz 2025 | Tandem Flight Costs',
  description:
    'Full price guide for paragliding in Ölüdeniz 2025. Tandem flights from €80. Sunset flights, group discounts, XC pilot passes. What\'s included, how to book.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/prices' },
}

const packages = [
  {
    name: 'Standard Tandem Flight',
    launch: '1200m Launch',
    price: '€80',
    duration: '25–35 min',
    highlight: false,
    badge: '',
    features: [
      'Certified tandem pilot',
      'Full safety equipment',
      'Transfer to launch',
      'Beach landing',
      'Third-party insurance',
    ],
  },
  {
    name: 'High Altitude Flight',
    launch: '1700m Launch',
    price: '€100',
    duration: '35–50 min',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Everything in Standard',
      'Higher launch point (1700m)',
      'Longer flight time',
      'Better thermal conditions',
      'More panoramic views',
    ],
  },
  {
    name: 'Sunset Flight',
    launch: '1200m Launch',
    price: '€110',
    duration: '20–30 min',
    highlight: false,
    badge: 'Premium',
    features: [
      'Late afternoon departure',
      'Golden hour over Blue Lagoon',
      'Calmer, smoother air',
      'Professional photo package included',
      'Limited slots — book early',
    ],
  },
]

const addOns = [
  { name: 'Professional Photo Package', price: '€25', desc: 'Photos taken by your pilot during flight' },
  { name: 'Professional Video Package', price: '€30', desc: 'HD video of your entire flight' },
  { name: 'Photo + Video Bundle', price: '€45', desc: 'Best value — both photo and video' },
  { name: 'GoPro Mount', price: '€10', desc: 'Mount for your own GoPro or phone' },
]

const faqItems = [
  {
    question: 'What currency do you accept?',
    answer: 'We accept EUR, USD, GBP and Turkish Lira (TRY). Prices above are in EUR. Payment can be made online by card or in cash on arrival. Card payments are accepted in our office.',
  },
  {
    question: 'Is there a group discount?',
    answer: 'Yes. Groups of 4 or more receive a 10% discount. Groups of 8 or more receive 15% off. Please contact us directly to arrange group bookings and we will provide a custom quote.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'Free cancellation up to 24 hours before your flight. Cancellations within 24 hours are non-refundable but can be rescheduled once. If we cancel due to weather, you receive a full refund or free reschedule.',
  },
  {
    question: 'Do prices change by season?',
    answer: 'Standard prices apply April through October. Peak season (June–August) prices may be slightly higher. Always check the booking page for current pricing when you book.',
  },
]

export default function PricesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'PriceSpecification',
    name: 'Tandem Paragliding Ölüdeniz Prices',
    price: '80',
    priceCurrency: 'EUR',
    description: 'Tandem paragliding flights from Babadağ Mountain, Ölüdeniz',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        title="Paragliding Prices Ölüdeniz 2025"
        subtitle="Transparent pricing. No hidden fees. Everything included."
        badge="Full Price Guide"
        size="sm"
      />

      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: 'Prices' }]} />
        </div>
      </div>

      {/* Packages */}
      <section className="section-padding bg-white">
        <div className="container-default">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Flight Packages</h2>
            <p className="text-slate-600">All prices include equipment, transfer to launch, and insurance.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`rounded-2xl border-2 overflow-hidden flex flex-col ${
                  pkg.highlight
                    ? 'border-orange-500 shadow-xl shadow-orange-100'
                    : 'border-slate-200 shadow-sm'
                }`}
              >
                {pkg.badge && (
                  <div className={`py-2 text-center text-sm font-bold text-white ${pkg.highlight ? 'bg-orange-500' : 'bg-slate-700'}`}>
                    {pkg.badge}
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-slate-500 text-sm mb-1">{pkg.launch}</p>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{pkg.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">⏱ {pkg.duration}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-slate-900">{pkg.price}</span>
                    <span className="text-slate-500 text-sm ml-1">per person</span>
                  </div>
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/book-now"
                    className={`w-full text-center py-3 rounded-xl font-bold text-sm transition-all ${
                      pkg.highlight
                        ? 'bg-orange-500 hover:bg-orange-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                    }`}
                  >
                    Book This Flight
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Optional Add-Ons</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addOns.map((addon) => (
              <div key={addon.name} className="card p-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{addon.name}</h3>
                  <p className="text-slate-600 text-sm">{addon.desc}</p>
                </div>
                <span className="text-orange-500 font-bold text-lg flex-shrink-0">{addon.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solo Pilot Passes */}
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Licensed Pilot Fees</h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-slate-700">Pass Type</th>
                  <th className="text-right px-5 py-3 font-semibold text-slate-700">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: 'Daily Pilot Pass', price: '€15' },
                  { name: 'Weekly Pilot Pass (7 days)', price: '€80' },
                  { name: 'Monthly Pilot Pass', price: '€250' },
                  { name: 'Full Season Pass (Apr–Oct)', price: '€600' },
                ].map((row) => (
                  <tr key={row.name} className="hover:bg-slate-50">
                    <td className="px-5 py-3 text-slate-700">{row.name}</td>
                    <td className="px-5 py-3 text-right font-bold text-orange-500">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-slate-500 mt-3">Pilot passes include launch site access and basic rescue cover. Foreign pilots must present valid licence and insurance.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-3xl">
          <FAQAccordion items={faqItems} title="Pricing FAQ" />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container-default text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to Book?</h2>
          <p className="text-slate-600 mb-8">Secure your slot online in 2 minutes. Free cancellation up to 24 hours before.</p>
          <Link href="/book-now" className="btn-primary text-base px-8 py-4">
            Book Your Flight Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  )
}
