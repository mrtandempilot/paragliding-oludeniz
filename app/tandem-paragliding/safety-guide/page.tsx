import type { Metadata } from 'next'
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import FAQAccordion from '@/components/shared/FAQAccordion'
import BookingCTA from '@/components/shared/BookingCTA'

export const metadata: Metadata = {
  title: 'Paragliding Safety Guide Ölüdeniz | Is Paragliding Safe?',
  description: 'Complete safety guide for tandem paragliding in Ölüdeniz. Equipment, pilot certifications, safety record, weather decisions and emergency procedures.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/tandem-paragliding/safety-guide' },
}

const faqItems = [
  { question: 'Is tandem paragliding dangerous?', answer: 'Tandem paragliding with a certified pilot is statistically safer than many everyday activities including driving. The primary risks are managed by weather assessment (we don\'t fly in unsafe conditions), equipment maintenance (regular inspection schedule), and pilot experience (all our pilots have thousands of hours of tandem experience). We have operated for 25+ years without a serious incident.' },
  { question: 'What equipment safety checks are done?', answer: 'All paragliders undergo regular inspection and testing by certified paragliding equipment inspectors. We maintain a strict replacement schedule — equipment is retired well before the end of its certified lifespan. Harnesses, helmets, reserve parachutes and lines are all regularly checked.' },
  { question: 'What happens if the paraglider fails?', answer: 'All tandem paragliders carry a reserve parachute. In the extremely unlikely event of a catastrophic malfunction, the pilot deploys the reserve. This is why reserve parachute deployment training is a mandatory part of our pilots\' certification. In 25+ years of operation, we have never needed to deploy a reserve on a tandem flight.' },
  { question: 'Who decides if it\'s safe to fly?', answer: 'Our pilots make the final safety decision. Not office staff, not management, not commercial pressure. If the conditions are not right for flying — whether due to wind, clouds, turbulence, or any other factor — the flight is cancelled or rescheduled. This is non-negotiable.' },
]

export default function SafetyGuidePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        mainEntity: faqItems.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://paragliding-oludeniz.com' },
          { '@type': 'ListItem', position: 2, name: 'Tandem Paragliding', item: 'https://paragliding-oludeniz.com/tandem-paragliding' },
          { '@type': 'ListItem', position: 3, name: 'Safety Guide', item: 'https://paragliding-oludeniz.com/tandem-paragliding/safety-guide' },
        ],
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero title="Tandem Paragliding Safety Guide" subtitle="How we keep every flight safe — equipment, pilots, weather and emergency procedures." badge="Safety First" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Tandem Paragliding', href: '/tandem-paragliding' }, { label: 'Safety Guide' }]} /></div></div>

      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-10 flex gap-4">
            <Shield className="w-10 h-10 text-green-600 flex-shrink-0" />
            <div><h2 className="font-bold text-green-900 text-xl mb-2">25+ Years. 50,000+ Flights. Zero Serious Incidents.</h2><p className="text-green-800">This is our safety record. We are proud of it and we protect it by making no compromises on safety — ever.</p></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[
              { icon: Shield, title: 'Pilot Certifications', color: 'text-sky-600', bg: 'bg-sky-50', items: ['Turkish Directorate General of Civil Aviation (SHGM) tandem licence', 'Annual competency assessments', 'Minimum 500 hours before tandem certification', 'Ongoing first aid and emergency training', 'Regular skills refresher training'] },
              { icon: CheckCircle, title: 'Equipment Standards', color: 'text-green-600', bg: 'bg-green-50', items: ['EN-certified paragliders only', 'Regular glider porosity and load testing', 'Reserve parachute repacking every 6 months', 'Harness and helmet replacement schedule', 'All equipment logged and traceable'] },
              { icon: AlertTriangle, title: 'Weather Policy', color: 'text-amber-600', bg: 'bg-amber-50', items: ['Pilot makes final weather call — not management', 'Wind speed and direction checked hourly', 'Flights cancelled in south wind (lodos)', 'Cloud base assessment before each flight', 'Free reschedule or refund on cancellations'] },
              { icon: Shield, title: 'Emergency Procedures', color: 'text-purple-600', bg: 'bg-purple-50', items: ['Reserve parachute carried on every flight', 'Pilot emergency training updated annually', 'Radio contact with ground throughout flight', 'Emergency landing zones mapped and known', 'Rescue coordination number at all launches'] },
            ].map(section => {
              const Icon = section.icon
              return (
                <div key={section.title} className="card p-6">
                  <div className={`w-10 h-10 ${section.bg} rounded-xl flex items-center justify-center mb-4`}><Icon className={`w-5 h-5 ${section.color}`} /></div>
                  <h3 className="font-bold text-slate-900 mb-3">{section.title}</h3>
                  <ul className="space-y-2">{section.items.map(i => <li key={i} className="text-sm text-slate-600 flex gap-2"><CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />{i}</li>)}</ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50"><div className="container-default max-w-3xl"><FAQAccordion items={faqItems} title="Safety FAQ" /></div></section>
      <section className="py-16 bg-white"><div className="container-default max-w-2xl"><BookingCTA /></div></section>
    </>
  )
}
