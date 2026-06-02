import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import FAQAccordion from '@/components/shared/FAQAccordion'

export const metadata: Metadata = {
  title: 'Tour Operator Paragliding Ölüdeniz | Trade Rates',
  description: 'Trade rates and group coordination for tour operators sending clients to Ölüdeniz paragliding. Babadağ tandem flights for package holidays, excursion desks and incoming agents.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/groups/tour-operators' },
}

const faqItems = [
  { question: 'Do you work with excursion desk operators?', answer: 'Yes — we have established relationships with hotel excursion desks throughout Ölüdeniz, Hisarönü, Ovacık, Fethiye and Marmaris. If your clients are staying in any of these areas, we can arrange hotel pickup coordination that integrates with your existing excursion workflow.' },
  { question: 'What is the minimum booking volume for trade rates?', answer: 'Trade rates are available from a committed volume of 20+ passengers per season. For larger operators with higher volumes, tiered pricing is available. Contact us with your expected seasonal volume and we will provide a tailored rate card.' },
  { question: 'What cancellation policy applies to group bookings?', answer: 'Weather cancellations are always rebooked at no penalty — this is non-negotiable given the nature of the activity. Client no-shows and late cancellations are subject to the standard terms in the trade agreement. Full details are provided in the operator contract.' },
  { question: 'Can we use your flights in our brochure or website?', answer: 'Yes — we provide high-resolution images and video content for approved trade partners for use in marketing materials. This is subject to a standard usage agreement and attribution requirements.' },
]

export default function TourOperatorsPage() {
  return (
    <>
      <PageHero title="Tour Operators & Incoming Agents" subtitle="Trade rates, seamless coordination and priority booking for operators sending groups to Ölüdeniz paragliding." badge="Trade" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Groups', href: '/groups' }, { label: 'Tour Operators' }]} /></div></div>

      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Trade rates from', value: '20 pax/season' },
              { label: 'Commission', value: 'Available' },
              { label: 'Priority booking', value: 'Trade partners' },
              { label: 'Rebooking', value: 'Weather flex' },
            ].map(item => (
              <div key={item.label} className="card p-4 text-center">
                <div className="text-xl font-bold text-orange-600 mb-1">{item.value}</div>
                <div className="text-slate-500 text-xs">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
            {[
              { title: 'Trade Pricing', emoji: '💼', desc: 'We offer competitive net rates for tour operators, incoming agents and excursion desk operators. Rates are structured by volume commitment and can include commission arrangements for operators selling on a retail basis to end clients.' },
              { title: 'Priority Allocation', emoji: '📅', desc: 'Trade partners receive priority slot allocation during peak season (July–August). During high demand periods, retail bookings are accepted around confirmed trade allocations. This ensures your clients\' dates are secured.' },
              { title: 'Hotel Pickup Coordination', emoji: '🚐', desc: 'We coordinate pickup from hotels across Ölüdeniz, Hisarönü, Ovacık and Fethiye. Pickup schedules are shared with your local representative or excursion desk in advance so your clients know exactly what to expect.' },
              { title: 'Weather Rebooking Policy', emoji: '🌤️', desc: 'All weather cancellations are rebooked at no cost to the operator or client. We provide same-day notification by 7am if conditions are not suitable. For groups, we aim to find an alternative date within the client\'s stay where possible.' },
              { title: 'Client Communications', emoji: '📱', desc: 'We can provide branded confirmation vouchers with your operator\'s name, pre-flight information packs and day-before reminder messages. All client communication templates are available in English, German, Russian and Turkish.' },
              { title: 'Marketing Support', emoji: '📸', desc: 'Approved trade partners receive access to our photo and video library for use in brochures, websites and social media. Co-branded content can be arranged for significant volume partners.' },
            ].map(item => (
              <div key={item.title} className="card p-5">
                <span className="text-2xl mb-3 block">{item.emoji}</span>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Setting Up a Trade Account</h2>
            <div className="space-y-3">
              {[
                { step: '1', text: 'Contact us via the form below with your company details, expected seasonal volume and the hotels or resorts your clients use.' },
                { step: '2', text: 'We provide a rate card and sample trade agreement for your review within 2 working days.' },
                { step: '3', text: 'Agree terms and sign the trade partnership agreement — this covers pricing, commission, cancellation policy and marketing usage.' },
                { step: '4', text: 'Your designated account contact sets up your booking access, confirms the pickup zone map, and provides client information templates.' },
                { step: '5', text: 'First bookings accepted. We recommend a trial run with a small group before the main season begins.' },
              ].map(item => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white text-sm font-bold flex items-center justify-center shrink-0">{item.step}</div>
                  <p className="text-slate-600 text-sm leading-relaxed pt-1">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <FAQAccordion items={faqItems} title="Trade Partner FAQ" />
        </div>
      </section>

      <BookingCTA title="Open a Trade Account" subtitle="Contact us with your company details and expected volume to receive our trade rate card." variant="dark" />
    </>
  )
}
