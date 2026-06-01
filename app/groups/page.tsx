import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import FAQAccordion from '@/components/shared/FAQAccordion'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Group Paragliding Ölüdeniz | Group Flights & Bookings',
  description: 'Group paragliding at Ölüdeniz for hen parties, stag dos, corporate teams, schools and tour groups. Group discounts, coordination and what to expect flying as a group.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/groups' },
}

const faqItems = [
  { question: 'What is the minimum group size for a discount?', answer: 'Group discounts typically start from 4 people flying together. The discount increases with group size — 4–7 people receive approximately 10% off, 8–15 people around 15%, and groups of 16+ receive custom pricing. Confirm exact thresholds when enquiring.' },
  { question: 'Can all group members fly at the same time?', answer: 'Not simultaneously — tandem flights launch approximately every 2–5 minutes. A group of 10 would typically all be airborne within 30–45 minutes of the first launch, with some overlap in the air. The last to launch will often still be able to see the first flyers landing.' },
  { question: 'How do we organise a group booking?', answer: 'Contact us via the group booking form or WhatsApp with your group size, preferred dates and any special requirements. We coordinate the pilot assignments, transfer logistics and scheduling for your group. Advance booking of 2–4 weeks is recommended for groups of 8+.' },
  { question: 'Is paragliding suitable for a hen or stag party?', answer: 'Absolutely — paragliding at Ölüdeniz is one of the most popular hen and stag activities in Turkey. The combination of adrenaline, spectacular views and the beachside landing makes for an unforgettable group experience. We can arrange the flight alongside other Ölüdeniz activities.' },
]

const subPages = [
  { href: '/groups/hen-stag', title: 'Hen & Stag Parties', desc: 'Tandem paragliding for hen and stag groups — the ultimate Ölüdeniz experience.', emoji: '🥂' },
  { href: '/groups/corporate', title: 'Corporate Groups', desc: 'Team-building and corporate events with paragliding at Babadağ.', emoji: '💼' },
  { href: '/groups/schools', title: 'School Groups', desc: 'Educational paragliding experiences for school and university groups.', emoji: '🎓' },
  { href: '/groups/tour-operators', title: 'Tour Operators', desc: 'Trade rates and coordination for tour operators sending groups to Ölüdeniz.', emoji: '🌍' },
]

export default function GroupsPage() {
  return (
    <>
      <PageHero title="Group Paragliding" subtitle="Group bookings, discounts and coordination for parties, teams and tour groups." badge="Groups" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Groups' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: '4–7 people', value: '10% off' },
              { label: '8–15 people', value: '15% off' },
              { label: '16+ people', value: 'Custom pricing' },
              { label: 'Max group', value: 'Unlimited' },
            ].map(item => (
              <div key={item.label} className="card p-4 text-center">
                <div className="text-xl font-bold text-orange-600 mb-1">{item.value}</div>
                <div className="text-slate-500 text-xs">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
            {subPages.map(p => (
              <Link key={p.href} href={p.href} className="card p-5 hover:shadow-lg transition-shadow group">
                <span className="text-3xl mb-3 block">{p.emoji}</span>
                <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors mb-2">{p.title}</h3>
                <p className="text-slate-600 text-sm">{p.desc}</p>
              </Link>
            ))}
          </div>

          <FAQAccordion items={faqItems} title="Group Booking FAQ" />
        </div>
      </section>
      <BookingCTA title="Get a Group Quote" subtitle="Contact us with your group size and dates for a custom paragliding package." variant="orange" />
    </>
  )
}
