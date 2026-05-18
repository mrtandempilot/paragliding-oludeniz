import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Award, Users, Clock, Globe } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'

export const metadata: Metadata = {
  title: 'About Us | Paragliding Ölüdeniz — 25 Years on Babadağ',
  description:
    'Learn about the team behind Paragliding Ölüdeniz. 25+ years flying from Babadağ Mountain. Certified, passionate, local — the original Ölüdeniz paragliding operation.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/about-us' },
}

const milestones = [
  { year: '1999', event: 'First tandem flights from Babadağ Mountain' },
  { year: '2003', event: 'Became founding member of Ölüdeniz Paragliding Association' },
  { year: '2007', event: 'Official partner of the first Ölüdeniz Air Games' },
  { year: '2012', event: 'Expanded to XC and acro pilot services' },
  { year: '2018', event: 'Over 50,000 tandem flights completed' },
  { year: '2023', event: 'Launched pilot training and equipment services' },
  { year: '2025', event: 'Still flying, still loving every single flight' },
]

export default function AboutUsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Paragliding Ölüdeniz',
    foundingDate: '1999',
    description: 'World-class paragliding operation based in Ölüdeniz, Turkey. Tandem flights, pilot services and training from Babadağ Mountain.',
    url: 'https://paragliding-oludeniz.com',
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
      <PageHero title="About Paragliding Ölüdeniz" subtitle="25 years in the air. Thousands of flights. One passion." size="sm" />

      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: 'About Us' }]} />
        </div>
      </div>

      {/* Story */}
      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">Our Story</span>
              <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-6">We Were Here Before the Cable Car</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We started flying from Babadağ in the late 1990s, when the mountain road was barely passable and the Blue Lagoon was known only to a handful of Turkish locals and early adventure travellers. Back then, we carried our equipment up by hand.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                Over 25 years, we have watched Ölüdeniz grow into one of the world&apos;s most recognised paragliding destinations. We helped organise the early Air Games. We have trained pilots who now fly competitively around the world. We have given thousands of people their first taste of flight.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                But the feeling never gets old. Every time we see a first-timer land on the beach with a massive smile on their face, we remember exactly why we do this.
              </p>
              <div className="flex gap-4">
                <Link href="/our-pilots" className="btn-primary">
                  Meet Our Pilots <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Clock, value: '25+', label: 'Years Flying', color: 'text-orange-500', bg: 'bg-orange-50' },
                { icon: Users, value: '50,000+', label: 'Tandem Flights', color: 'text-sky-500', bg: 'bg-sky-50' },
                { icon: Globe, value: '60+', label: 'Countries', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { icon: Award, value: '0', label: 'Serious Incidents', color: 'text-purple-500', bg: 'bg-purple-50' },
              ].map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className={`${stat.bg} rounded-2xl p-6 text-center`}>
                    <Icon className={`w-7 h-7 ${stat.color} mx-auto mb-3`} />
                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-slate-600 text-sm mt-1">{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-10 text-center">Our Journey</h2>
          <div className="relative border-l-2 border-orange-200 pl-8 space-y-8">
            {milestones.map((m) => (
              <div key={m.year} className="relative">
                <div className="absolute -left-10 w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow" />
                <p className="text-orange-500 font-bold text-sm mb-1">{m.year}</p>
                <p className="text-slate-700">{m.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: 'Safety Above All', desc: 'We have never compromised on safety. Not once. Not for a booking, not for weather, not for anything. Every flight decision is made by our pilots, not by commercial pressure.' },
              { title: 'Genuine Local Knowledge', desc: 'We know Babadağ like our own home. We know which thermals to use in July, which launch to avoid in south wind, and how the sea breeze behaves in August. That knowledge protects you.' },
              { title: 'Passion for the Sport', desc: 'We are not a tourist agency that happens to offer paragliding. We are paragliders who happen to run a business. Every pilot on our team flies for the love of it, not just the income.' },
            ].map((v) => (
              <div key={v.title} className="card p-6">
                <h3 className="font-bold text-slate-900 mb-3">{v.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-2xl">
          <BookingCTA title="Come Fly With Us" subtitle="25 years of safe, unforgettable flights from Babadağ. Join us." />
        </div>
      </section>
    </>
  )
}
