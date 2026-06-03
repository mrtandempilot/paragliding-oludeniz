import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import FAQAccordion from '@/components/shared/FAQAccordion'

export const metadata: Metadata = {
  title: 'Solo Paragliding Ölüdeniz | Licensed Pilot Info & Passes',
  description: 'Guide for licensed solo paragliders visiting Ölüdeniz and Babadağ. Pilot passes, flight rules, equipment requirements, insurance, and community info.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/solo-paragliding' },
}

const faqItems = [
  { question: 'Can foreign pilots fly from Babadağ?', answer: 'Yes. Foreign pilots with a valid national paragliding licence are welcome. Accepted licences include IPPI (any level 3+), BHPA Pilot, FFVL Pilote, DHV Pilot, and equivalent national certifications from most countries. You will need to show your licence and current third-party liability insurance at the Babadağ Association office.' },
  { question: 'Where do I buy a pilot pass?', answer: 'Pilot day and season passes are sold at the Babadağ Paragliding Association office located at the 1700m station area. The office is open during flying hours (approximately 09:00–18:00) throughout the season (April–October).' },
  { question: 'Are there specific rules for the Babadağ airspace?', answer: 'Yes. The Babadağ airspace has altitude limits, mandatory approach paths to the main landing zone, and coordination rules during busy periods. All pilots should obtain the current airspace map and briefing from the Association office on arrival. Local pilots are always happy to brief visiting pilots.' },
]

export default function SoloParaglidingPage() {
  return (
    <>
      <PageHero title="Solo Paragliding at Babadağ" subtitle="Information for licensed paragliding pilots visiting Ölüdeniz." badge="Licensed Pilots" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Solo Paragliding' }]} /></div></div>

      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Welcome to Babadağ, Licensed Pilots</h2>
          <p className="text-slate-600 leading-relaxed mb-4">Babadağ is one of the most visited free-flight sites in the world. Every year, thousands of licensed paragliders travel from Europe, Asia and beyond to fly here. The combination of altitude, reliable thermals, XC potential and stunning scenery makes it a pilgrimage for serious pilots.</p>
          <p className="text-slate-600 leading-relaxed mb-8">This page covers everything you need to know as a visiting licensed pilot — passes, rules, launch etiquette, equipment and the local pilot community.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {[
              { href: '/solo-paragliding/flight-rules', title: 'Flight Rules & Airspace', desc: 'Turkish aviation rules, local airspace limits and Babadağ-specific regulations.' },
              { href: '/solo-paragliding/equipment-requirements', title: 'Equipment Requirements', desc: 'What gliders, harnesses, reserves and radios are required to fly from Babadağ.' },
              { href: '/solo-paragliding/insurance-permissions', title: 'Insurance & Passes', desc: 'Where to buy day, weekly and season passes. Insurance requirements explained.' },
              { href: '/cross-country-flights', title: 'Cross Country Flying', desc: 'XC routes, landing zones, and everything about flying cross-country from Babadağ.' },
              { href: '/acro-flights', title: 'Acro & Aerobatics', desc: 'World-class acro flying over the Blue Lagoon — from wing-overs to infinity tumbling.' },
              { href: '/training', title: 'Training Courses', desc: 'SIV clinics, XC coaching and guided flying weeks based at Babadağ.' },
              { href: '/pilot-services', title: 'Pilot Services', desc: 'Equipment rental, local guiding, weather briefings and community for visiting pilots.' },
              { href: '/community', title: 'Pilot Community', desc: 'Join 200+ local and visiting pilots on WhatsApp groups and at weekly events.' },
            ].map(link => (
              <Link key={link.href} href={link.href} className="card p-5 hover:shadow-md transition-all hover:-translate-y-0.5 group">
                <h3 className="font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">{link.title}</h3>
                <p className="text-sm text-slate-600">{link.desc}</p>
                <div className="flex items-center gap-1 text-orange-500 text-sm mt-3">Read more <ArrowRight className="w-4 h-4" /></div>
              </Link>
            ))}
          </div>

          <div className="card p-6 mb-8">
            <h3 className="font-bold text-slate-900 mb-4">Quick Requirements Checklist</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {['Valid national paragliding licence (min. Pilot level)', 'Current third-party liability insurance (min. €300k)', 'EN-certified paraglider in airworthy condition', 'Reserve parachute (not expired)', 'Radio (recommended, required for some launches)', 'Babadağ pilot pass (purchased at site)'].map(r => (
                <div key={r} className="flex gap-2 text-sm text-slate-700"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{r}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50"><div className="container-default max-w-3xl"><FAQAccordion items={faqItems} title="Solo Pilot FAQ" /></div></section>
    </>
  )
}
