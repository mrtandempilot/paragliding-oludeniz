import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import FAQAccordion from '@/components/shared/FAQAccordion'
import BookingCTA from '@/components/shared/BookingCTA'

export const metadata: Metadata = {
  title: 'Ölüdeniz Paragliding | Complete Guide to Flying in Turkey',
  description: 'Everything about paragliding in Ölüdeniz, Turkey. Why it\'s world-famous, how to book, what to expect, and what makes the Blue Lagoon flight so special.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/oludeniz-paragliding' },
}

const faqItems = [
  { question: 'Why is Ölüdeniz famous for paragliding?', answer: 'Ölüdeniz combines three things that are rarely found together: an exceptionally high launch site (Babadağ at 1960m), reliable thermal conditions for 300+ days per year, and one of the most iconic landing zones in the world — the Blue Lagoon beach. The Ölüdeniz Air Games have been held here annually for decades, cementing its global reputation.' },
  { question: 'How do I get to Ölüdeniz from Dalaman Airport?', answer: 'Dalaman Airport is approximately 45–60 minutes from Ölüdeniz by transfer. Private taxis and shuttle services run regularly. The drive follows a scenic coastal road through Fethiye. We can arrange airport transfers — contact us when booking.' },
  { question: 'Is Ölüdeniz paragliding suitable for complete beginners?', answer: 'Absolutely. Tandem paragliding requires no experience or fitness. You fly with a certified pilot who controls everything. The only requirement is being able to run a few steps at launch. We welcome nervous first-timers every day.' },
  { question: 'What else can I do in Ölüdeniz besides paragliding?', answer: 'Ölüdeniz is one of Turkey\'s most beautiful beach destinations. The Blue Lagoon, Butterfly Valley boat trips, Kayaköy ghost village, Saklikent Gorge, and the markets of Fethiye are all nearby. Many guests combine 2–3 days in Ölüdeniz with their flight.' },
]

export default function OludenizParaglidingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: 'Ölüdeniz Paragliding',
    description: 'World-famous paragliding destination in Ölüdeniz, Turkey. Tandem flights over the Blue Lagoon from Babadağ Mountain.',
    geo: { '@type': 'GeoCoordinates', latitude: 36.5497, longitude: 29.1164 },
    touristType: 'Adventure tourism, paragliding',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero title="Paragliding in Ölüdeniz" subtitle="One of the world's great paragliding destinations — and the most beautiful landing zone on earth." badge="Ölüdeniz Guide" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Ölüdeniz Paragliding' }]} /></div></div>

      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Why the World Comes to Ölüdeniz to Fly</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <p className="text-slate-600 leading-relaxed mb-4">Ölüdeniz is a small beach town on the Turquoise Coast of Turkey, in the Fethiye district of Muğla province. It would be famous for its beach alone — the Blue Lagoon is consistently rated among the most beautiful beaches in the Mediterranean. But it is the mountain behind it that made Ölüdeniz a global name in adventure sports.</p>
              <p className="text-slate-600 leading-relaxed">Babadağ Mountain, rising to 1,969 metres directly above the lagoon, provides a launch site that is almost uniquely suited to paragliding. The combination of altitude, south-westerly aspect, reliable thermal development, and the stunning visual backdrop has made it one of the most sought-after flying sites on the planet.</p>
            </div>
            <div className="space-y-4">
              {[
                { title: 'The Blue Lagoon', desc: 'A protected natural lagoon of extraordinary colour, visible from the air in shades ranging from pale turquoise to deep cobalt.' },
                { title: 'Babadağ Mountain', desc: '1,969m above sea level. Four launch points. Over 300 flyable days per year. The engine behind Ölüdeniz\'s reputation.' },
                { title: 'Butterfly Valley', desc: 'A dramatic gorge between orange cliffs, visible from the air and famous for its seasonal butterfly migration.' },
                { title: 'The Ölüdeniz Air Games', desc: 'An annual international paragliding competition held here every October, attracting pilots from 60+ countries.' },
              ].map(item => (
                <div key={item.title} className="flex gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2" />
                  <div><p className="font-semibold text-slate-900 text-sm">{item.title}</p><p className="text-slate-600 text-sm">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[{ v: '1,969m', l: 'Babadağ altitude' }, { v: '300+', l: 'Flying days/year' }, { v: '60+', l: 'Nations at Air Games' }, { v: '30+', l: 'Years of flying' }].map(s => (
              <div key={s.l} className="bg-slate-50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-orange-500">{s.v}</p><p className="text-sm text-slate-600 mt-1">{s.l}</p></div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/book-now" className="btn-primary">Book a Flight <ArrowRight className="w-5 h-5" /></Link>
            <Link href="/babadag-guide" className="btn-secondary">Babadağ Guide</Link>
            <Link href="/weather-guide" className="btn-secondary">Weather Guide</Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50"><div className="container-default max-w-3xl"><FAQAccordion items={faqItems} title="Ölüdeniz Paragliding FAQ" /></div></section>
      <section className="py-16 bg-white"><div className="container-default max-w-2xl"><BookingCTA /></div></section>
    </>
  )
}
