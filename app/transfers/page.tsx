import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import FAQAccordion from '@/components/shared/FAQAccordion'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Transfers to Ölüdeniz | Airport Transfer Dalaman to Ölüdeniz',
  description: 'How to get to Ölüdeniz for paragliding. Dalaman airport transfers, buses from Fethiye, taxi options and getting to Babadağ launch from your hotel.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/transfers' },
}

const faqItems = [
  { question: 'How far is Dalaman airport from Ölüdeniz?', answer: 'Dalaman airport is approximately 55km from Ölüdeniz. By private transfer the journey takes around 45–60 minutes. By public bus via Fethiye the journey takes 1.5–2 hours total.' },
  { question: 'Is there a direct bus from Dalaman to Ölüdeniz?', answer: 'There is no direct bus. The standard route is: Havataş airport bus from Dalaman to Fethiye bus station, then dolmuş (shared minibus) from Fethiye to Ölüdeniz. The dolmuş runs regularly throughout the day during the season and costs very little.' },
  { question: 'How do I get to Babadağ launch from my hotel?', answer: 'Most tandem paragliding packages include hotel pickup. You will be collected by minibus, driven to the cable car (teleferik) or directly to the mountain road, and transferred to the launch area. Confirm pickup arrangements when booking your flight.' },
  { question: 'Can I take a taxi from Dalaman?', answer: 'Yes — taxis are available at Dalaman airport. The fare to Ölüdeniz is approximately 600–900 Turkish Lira (2024). Agree the price before departure. Private transfer services offer a more reliable fixed price and can be booked in advance.' },
]

const subPages = [
  { href: '/transfers/dalaman-airport', title: 'Dalaman Airport', desc: 'Getting from Dalaman airport to Ölüdeniz — all options.', emoji: '✈️' },
  { href: '/transfers/from-fethiye', title: 'From Fethiye', desc: 'Dolmuş and taxi options from Fethiye city centre.', emoji: '🚌' },
  { href: '/transfers/from-marmaris', title: 'From Marmaris', desc: 'Reaching Ölüdeniz from Marmaris by bus or transfer.', emoji: '🗺️' },
  { href: '/transfers/to-babadag', title: 'To Babadağ Launch', desc: 'Getting from Ölüdeniz village up to the paragliding launch.', emoji: '🏔️' },
  { href: '/transfers/private-transfer', title: 'Private Transfers', desc: 'Book a private door-to-door transfer service.', emoji: '🚐' },
]

export default function TransfersPage() {
  return (
    <>
      <PageHero title="Getting to Ölüdeniz" subtitle="Airport transfers, buses and getting to Babadağ launch for your paragliding adventure." badge="Transport" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Transfers' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Dalaman to Ölüdeniz', value: '~55km / 50 min' },
              { label: 'Fethiye to Ölüdeniz', value: '~14km / 20 min' },
              { label: 'Marmaris to Ölüdeniz', value: '~100km / 90 min' },
              { label: 'Dolmuş cost', value: '~₺20–40' },
            ].map(item => (
              <div key={item.label} className="card p-4 text-center">
                <div className="font-bold text-orange-600 mb-1">{item.value}</div>
                <div className="text-slate-500 text-xs">{item.label}</div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-6">Transfer Options</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {subPages.map(p => (
              <Link key={p.href} href={p.href} className="card p-5 hover:shadow-lg transition-shadow group">
                <span className="text-3xl mb-3 block">{p.emoji}</span>
                <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors mb-2">{p.title}</h3>
                <p className="text-slate-600 text-sm">{p.desc}</p>
              </Link>
            ))}
          </div>

          <FAQAccordion items={faqItems} title="Transfer FAQ" />
        </div>
      </section>
      <BookingCTA title="Book Your Paragliding Flight" subtitle="Once you arrive, your tandem flight package includes transfer to the Babadağ launch." variant="orange" />
    </>
  )
}
