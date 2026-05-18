import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Star, Shield, Clock, Users, Camera, Wind } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import FAQAccordion from '@/components/shared/FAQAccordion'
import BookingCTA from '@/components/shared/BookingCTA'

export const metadata: Metadata = {
  title: 'Tandem Paragliding Ölüdeniz | Book Your Flight from Babadağ',
  description:
    'Book tandem paragliding in Ölüdeniz, Turkey. No experience needed. Fly with a certified pilot over the Blue Lagoon from Babadağ Mountain at 1960m. From €80.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/tandem-paragliding' },
}

const included = [
  'Full safety briefing before flight',
  'Certified, experienced tandem pilot',
  'All equipment (harness, helmet, glider)',
  'Transfer from Ölüdeniz to Babadağ launch',
  'Approximately 25–45 minute flight',
  'Landing on Ölüdeniz beach',
  'Third-party liability insurance',
]

const subPages = [
  {
    href: '/tandem-paragliding/first-time',
    title: 'First Time Flying',
    desc: 'Complete guide for beginners — what to expect, what to wear, fear of heights tips.',
    emoji: '🎉',
  },
  {
    href: '/tandem-paragliding/sunset-flight',
    title: 'Sunset Flights',
    desc: 'Watch the sun set over the Blue Lagoon from 1200m. The most magical experience.',
    emoji: '🌅',
  },
  {
    href: '/tandem-paragliding/group-flights',
    title: 'Group Flights',
    desc: 'Coming with friends or family? We cater for groups of all sizes with special rates.',
    emoji: '👥',
  },
  {
    href: '/tandem-paragliding/safety-guide',
    title: 'Safety Guide',
    desc: 'Everything about our safety record, equipment, pilot qualifications and procedures.',
    emoji: '🛡️',
  },
]

const faqItems = [
  {
    question: 'Do I need any experience to do tandem paragliding?',
    answer:
      'No experience is needed at all. In a tandem flight, you are attached to a certified pilot who controls everything. Your only job is to run a few steps at launch and enjoy the flight. We welcome complete beginners every day.',
  },
  {
    question: 'Is there a weight or age limit for tandem paragliding in Ölüdeniz?',
    answer:
      'The maximum weight limit is 110kg (242 lbs). The minimum age is 5 years old with parental consent. There is no upper age limit — we regularly fly guests in their 70s and 80s. People with certain medical conditions (heart conditions, epilepsy, recent surgery) should consult their doctor first.',
  },
  {
    question: 'How long does the flight last?',
    answer:
      'A standard tandem flight from the 1200m launch lasts approximately 25–35 minutes. Flights from the higher 1700m and 1900m launches typically last 35–50 minutes depending on thermal conditions. Sunset flights tend to be calmer and slightly shorter.',
  },
  {
    question: 'What should I wear for paragliding?',
    answer:
      'Wear comfortable, closed-toe shoes (trainers or hiking shoes — not sandals or flip-flops). Dress in layers as it can be 5–10°C cooler at launch altitude than on the beach. Avoid loose clothing that could flap in the wind. We provide all safety equipment.',
  },
  {
    question: 'Can I take photos or video during the flight?',
    answer:
      'Yes! Many guests bring their own GoPro cameras or phones. We also offer a professional photo and video package taken by your pilot during the flight. This is available to add when booking and is highly recommended — it is very difficult to take good photos yourself while flying!',
  },
  {
    question: 'What happens if the weather is bad on my booked day?',
    answer:
      'Safety is always our priority. If conditions are not suitable for flying on your booked day, we will offer you a free reschedule to another day or a full refund. We fly approximately 300 days per year, so cancellations due to weather are rare but do happen, especially in spring.',
  },
]

export default function TandemParaglidingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Tandem Paragliding Ölüdeniz',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Paragliding Ölüdeniz',
      url: 'https://paragliding-oludeniz.com',
    },
    description:
      'Tandem paragliding flights over the Blue Lagoon in Ölüdeniz from Babadağ Mountain. No experience needed. Certified pilots.',
    areaServed: 'Ölüdeniz, Fethiye, Turkey',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: '80',
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        title="Tandem Paragliding in Ölüdeniz"
        subtitle="No experience needed. Fly with a certified pilot over the world-famous Blue Lagoon from Babadağ Mountain."
        badge="Most Popular"
      />

      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: 'Tandem Paragliding' }]} />
        </div>
      </div>

      {/* Intro Section */}
      <section className="section-padding bg-white">
        <div className="container-default">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">
                No Experience Required
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-6">
                The World&apos;s Most Spectacular Tandem Flight
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Tandem paragliding in Ölüdeniz is one of those experiences that changes people.
                You launch from Babadağ Mountain — one of the highest tandem launch sites in the
                world at 1,960 metres — and glide silently over the turquoise Blue Lagoon, the
                ancient ruins of Kayaköy, and the pine-covered mountains of the Fethiye region.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                You don&apos;t need any experience. Our certified tandem pilots have thousands of
                hours of flight time on Babadağ. You run a few steps, lift off — and then it&apos;s
                just you, the sky, and the most breathtaking view in Turkey.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { value: '4.9★', label: '2,400+ Reviews' },
                  { value: '25+', label: 'Years Experience' },
                  { value: '300+', label: 'Flying Days/Year' },
                ].map((s) => (
                  <div key={s.label} className="bg-slate-50 rounded-xl p-4 text-center">
                    <p className="text-xl font-bold text-orange-500">{s.value}</p>
                    <p className="text-xs text-slate-600 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/book-now" className="btn-primary">
                  Book Your Flight <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/prices" className="btn-secondary">
                  View Prices
                </Link>
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="font-bold text-slate-900 text-xl mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                What&apos;s Included
              </h3>
              <ul className="space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  Optional add-on: Professional photo &amp; video package from your pilot
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sub-pages Grid */}
      <section className="section-padding bg-slate-50">
        <div className="container-default">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Everything You Need to Know
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {subPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="card p-6 hover:shadow-md transition-all hover:-translate-y-0.5 group"
              >
                <span className="text-3xl mb-3 block">{page.emoji}</span>
                <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-orange-600 transition-colors">
                  {page.title}
                </h3>
                <p className="text-slate-600 text-sm">{page.desc}</p>
                <div className="flex items-center gap-1 text-orange-500 text-sm font-medium mt-4">
                  Read more <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="section-padding bg-white">
        <div className="container-default">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Fully Certified', desc: 'All pilots hold Turkish aviation and international tandem certifications.', color: 'text-green-600', bg: 'bg-green-50' },
              { icon: Star, title: '4.9/5 Rating', desc: 'Over 2,400 verified reviews from guests across 60+ countries.', color: 'text-yellow-600', bg: 'bg-yellow-50' },
              { icon: Clock, title: '25+ Years Flying', desc: 'We have been flying from Babadağ since the early days of the sport.', color: 'text-sky-600', bg: 'bg-sky-50' },
              { icon: Wind, title: 'Top Equipment', desc: 'We fly modern, regularly inspected EN-certified paragliders only.', color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="text-center p-6">
                  <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-3xl">
          <FAQAccordion items={faqItems} title="Tandem Paragliding FAQ" />
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white">
        <div className="container-default max-w-2xl">
          <BookingCTA
            title="Ready to Fly Over the Blue Lagoon?"
            subtitle="Book your tandem flight online in 2 minutes. Free cancellation up to 24 hours before."
          />
        </div>
      </section>
    </>
  )
}
