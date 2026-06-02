import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import FAQAccordion from '@/components/shared/FAQAccordion'

export const metadata: Metadata = {
  title: 'Corporate Paragliding Ölüdeniz | Team Building Babadağ',
  description: 'Corporate team-building paragliding at Ölüdeniz. Group flights from Babadağ for company events, incentive travel and corporate retreats in Turkey.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/groups/corporate' },
}

const faqItems = [
  { question: 'Can paragliding be combined with other activities?', answer: 'Absolutely. Ölüdeniz is a full activity destination — paragliding pairs well with boat trips, quad biking, zip-lining, and beach days. We can help you put together a two or three day itinerary that centres on the paragliding experience.' },
  { question: 'What if some team members do not want to fly?', answer: 'Non-flying team members can watch from the Ölüdeniz beach landing zone and participate in the group celebration on the ground. The experience of watching colleagues land is often described as equally memorable.' },
  { question: 'Can you arrange branded merchandise or certificates?', answer: 'We can arrange personalised certificates for each participant. For larger corporate groups, branded GoPro footage editing and company-logo certificates can be arranged with advance notice.' },
  { question: 'What is the best time of year for a corporate event?', answer: 'May, June and September offer the best combination of settled weather, comfortable temperatures and availability. July and August are peak season with more crowds. October can be excellent for later-season events.' },
]

export default function CorporatePage() {
  return (
    <>
      <PageHero title="Corporate Paragliding" subtitle="Team-building and incentive travel with tandem paragliding at Babadağ — an unforgettable Ölüdeniz experience." badge="Corporate" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Groups', href: '/groups' }, { label: 'Corporate Groups' }]} /></div></div>

      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Min. group size', value: '4 people' },
              { label: 'Max group size', value: 'Unlimited' },
              { label: 'Certificate', value: 'Included' },
              { label: 'Custom pricing', value: '16+ people' },
            ].map(item => (
              <div key={item.label} className="card p-4 text-center">
                <div className="text-xl font-bold text-orange-600 mb-1">{item.value}</div>
                <div className="text-slate-500 text-xs">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
            {[
              { title: 'Incentive Travel', emoji: '🏆', desc: 'Paragliding over the Blue Lagoon is a genuinely exceptional reward for high performers. Ölüdeniz ranks among the world\'s most photographed paragliding destinations — the footage your team takes home becomes a lasting reminder of their achievement.' },
              { title: 'Team Building', emoji: '🤝', desc: 'Shared adventure builds genuine team bonds that office events rarely achieve. The mix of individual bravery and group support — watching colleagues take their turn, cheering each other on at landing — creates real connection.' },
              { title: 'Retreat Activities', emoji: '🌊', desc: 'Combine paragliding with the Ölüdeniz beach, local restaurants and the surrounding Turquoise Coast for a complete corporate retreat. We can advise on hotels, dining and itinerary planning for groups of any size.' },
              { title: 'Conference Add-On', emoji: '📊', desc: 'If your team is already attending a conference in Antalya, Marmaris or Fethiye, Ölüdeniz paragliding makes an ideal half-day or full-day add-on excursion. Transfer logistics from all Turquoise Coast locations are straightforward.' },
              { title: 'Video & Media Packages', emoji: '🎬', desc: 'Each participant\'s GoPro flight footage can be edited into a group highlight reel for internal comms, LinkedIn, or event documentation. Branded certificates with the company logo are available for groups booking in advance.' },
              { title: 'Full Coordination', emoji: '📋', desc: 'We manage all logistics — hotel pickups, mountain transfers, pilot assignments, launch sequencing, and landing coordination. Your event coordinator deals with one point of contact from booking to beach landing.' },
            ].map(item => (
              <div key={item.title} className="card p-5">
                <span className="text-2xl mb-3 block">{item.emoji}</span>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-10">
            <h2 className="font-bold text-blue-900 mb-3">Pricing Structure for Corporate Groups</h2>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex justify-between border-b border-blue-200 pb-2"><span>4–7 people</span><span className="font-semibold">~10% off standard rate</span></div>
              <div className="flex justify-between border-b border-blue-200 pb-2"><span>8–15 people</span><span className="font-semibold">~15% off standard rate</span></div>
              <div className="flex justify-between border-b border-blue-200 pb-2"><span>16–30 people</span><span className="font-semibold">Custom package pricing</span></div>
              <div className="flex justify-between pt-1"><span>30+ people</span><span className="font-semibold">Full event management rate</span></div>
            </div>
            <p className="text-blue-700 text-xs mt-3">All packages include hotel transfer, pilot coordination, harness fitting and beach landing. GoPro video, certificate printing and catering are available as add-ons.</p>
          </div>

          <FAQAccordion items={faqItems} title="Corporate Events FAQ" />
        </div>
      </section>

      <BookingCTA title="Plan Your Corporate Paragliding Event" subtitle="Contact us with your group size, dates and requirements for a tailored proposal." variant="dark" />
    </>
  )
}
