import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import FAQAccordion from '@/components/shared/FAQAccordion'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Paramotor Flying Ölüdeniz | Powered Paragliding Fethiye',
  description: 'Paramotor and powered paragliding at Ölüdeniz and Fethiye. Flat beaches, launch sites, local operators and training courses for powered paragliding.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/paramotor' },
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'SportsActivityLocation',
  name: 'Paramotor Flying Ölüdeniz',
  description: 'Paramotor and powered paragliding in the Fethiye and Ölüdeniz region of Turkey.',
  url: 'https://paragliding-oludeniz.com/paramotor',
  address: { '@type': 'PostalAddress', addressLocality: 'Ölüdeniz', addressCountry: 'TR' },
}

const subPages = [
  { href: '/paramotor/launch-sites', title: 'Launch Sites', desc: 'Best flat-field launch sites for paramotor around the Fethiye region.', emoji: '🛫' },
  { href: '/paramotor/training', title: 'Paramotor Training', desc: 'PPG (powered paragliding) training courses available in the area.', emoji: '🎓' },
  { href: '/paramotor/rules', title: 'Rules & Airspace', desc: 'Turkish CAA rules for paramotor, airspace classes and no-fly zones.', emoji: '📋' },
  { href: '/paramotor/equipment', title: 'Equipment Guide', desc: 'Wings, motors, harnesses and gear for paramotor in Turkish conditions.', emoji: '⚙️' },
]

const faqItems = [
  { question: 'Is paramotor popular around Ölüdeniz?', answer: 'Paramotor is growing in the Fethiye region. The flat agricultural land around Fethiye, Çalış beach, and the inland valleys provide good flat-field launch options, while the coastal scenery makes for spectacular flying. It is less developed than in northern Turkey but gaining momentum.' },
  { question: 'Can I fly my paramotor at Babadağ?', answer: 'Powered paragliding in the Babadağ controlled airspace requires coordination with the Babadağ Association. The mountain is primarily a free flight site; paramotor pilots must notify the Association and respect priority rules for unpowered aircraft on approach.' },
  { question: 'Do I need a licence to fly paramotor in Turkey?', answer: 'Turkey requires paramotor pilots to hold a recognised PPG licence. Foreign pilots with valid home-country licences are generally accepted for recreational flying. Commercial operations require Turkish certification. Always check current SHGM requirements.' },
  { question: 'Can I get paramotor training near Ölüdeniz?', answer: 'Several operators in the Fethiye region offer PPG training courses. These typically run over 5–10 days and culminate in a practical assessment. Ask at the Babadağ Association office for current operator recommendations.' },
]

export default function ParamotorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <PageHero title="Paramotor Flying" subtitle="Powered paragliding in the spectacular Fethiye and Ölüdeniz region of Turkey." badge="Paramotor" size="md" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Paramotor' }]} /></div></div>

      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-16">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Paramotor in the Fethiye Region</h2>
              <p className="text-slate-600 leading-relaxed mb-4">While Ölüdeniz is best known for free-flight paragliding from Babadağ, the broader Fethiye region offers excellent conditions for paramotor pilots. The combination of flat coastal plains, agricultural valleys, and spectacular coastal scenery makes powered paragliding here uniquely rewarding.</p>
              <p className="text-slate-600 leading-relaxed mb-4">The Çalış Beach area, the Fethiye plain, and the agricultural land around Kemer provide the flat launch surfaces that paramotor pilots need. From these areas, coastal beach runs, lagoon overflights, and inland valley exploration are all achievable.</p>
              <p className="text-slate-600 leading-relaxed">Thermal conditions are strong from May to October — skilled paramotor pilots can shut down the motor and soar on thermals just like free-flight paraglider pilots, significantly extending flight duration.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { emoji: '🏖️', label: 'Coastal beach runs', desc: 'Fly low along Çalış beach at sunrise' },
                { emoji: '🏔️', label: 'Mountain backdrops', desc: 'The Babadağ massif as a stunning backdrop' },
                { emoji: '🌅', label: 'Sunset flights', desc: 'Flat light evening conditions ideal for PPG' },
                { emoji: '🗺️', label: 'Valley exploration', desc: 'Inland valleys and ancient ruins from above' },
              ].map(item => (
                <div key={item.label} className="card p-4 text-center">
                  <span className="text-3xl mb-2 block">{item.emoji}</span>
                  <div className="font-semibold text-slate-900 text-sm mb-1">{item.label}</div>
                  <div className="text-slate-500 text-xs">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-600 text-white rounded-3xl p-8 mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { num: '5–10', label: 'Days to learn PPG' },
                { num: '25km', label: 'Coastal route potential' },
                { num: 'Apr–Oct', label: 'Flying season' },
                { num: '15kn', label: 'Max safe wind for launch' },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-3xl font-bold mb-1">{s.num}</div>
                  <div className="text-green-200 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-6">Paramotor Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
            {subPages.map(p => (
              <Link key={p.href} href={p.href} className="card p-6 hover:shadow-lg transition-shadow group">
                <span className="text-3xl mb-3 block">{p.emoji}</span>
                <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors mb-2">{p.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{p.desc}</p>
              </Link>
            ))}
          </div>

          <FAQAccordion items={faqItems} title="Paramotor FAQ" />
        </div>
      </section>

      <BookingCTA title="Explore Ölüdeniz from the Air" subtitle="Tandem paragliding from Babadağ — the perfect introduction to free flight in Ölüdeniz." variant="orange" />
    </>
  )
}
