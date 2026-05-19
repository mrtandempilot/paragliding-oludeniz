import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import FAQAccordion from '@/components/shared/FAQAccordion'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Babadağ Teleferik (Cable Car) | Ölüdeniz Cable Car Guide',
  description: 'Complete guide to the Babadağ cable car (teleferik). Prices, operating hours, QR ticket booking, journey time and what to expect on the way up to 1700m.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/babadag-guide/babadag-teleferik' },
}

const faqItems = [
  { question: 'How long does the cable car take?', answer: 'The Babadağ teleferik journey takes approximately 8–12 minutes from the base station to the 1700m launch area. The cable car moves continuously and the views during the ascent are spectacular.' },
  { question: 'How much does the cable car cost?', answer: 'Ticket prices vary by season and are set by the municipality. As of 2024, a single ascent ticket costs approximately 300–400 Turkish Lira. Return tickets and day passes are also available. Check the official Babadağ teleferik website or kiosk for current pricing.' },
  { question: 'Can I take a paraglider on the cable car?', answer: 'Yes — the teleferik is designed to transport paragliding equipment. Both tandem and solo pilot equipment fits in the cable car gondolas. There may be a small supplement charge for equipment. Tandem pilots loading equipment should arrive early during busy periods.' },
  { question: 'What if the cable car is not operating?', answer: 'If the teleferik is closed (maintenance, high wind, etc.), the only access to the launch area is via the Babadağ road by minibus or private vehicle. Check operating status on the day at the base station before planning your journey.' },
  { question: 'Is there a QR ticket system?', answer: 'Yes — the Babadağ teleferik operates a QR code ticketing system. Tickets can be pre-purchased online and accessed via QR code on your phone. This saves queuing at the ticket desk, which can be long in peak season.' },
]

export default function BabadagTeleferikPage() {
  return (
    <>
      <PageHero title="Babadağ Cable Car (Teleferik)" subtitle="The fastest and most scenic way to reach the Babadağ paragliding launch area." badge="Teleferik" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Babadağ Guide', href: '/babadag-guide' }, { label: 'Cable Car' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Journey time', value: '~10 min' },
              { label: 'Top altitude', value: '1,700m' },
              { label: 'Season', value: 'Apr – Oct' },
              { label: 'Equipment', value: 'Allowed' },
            ].map(item => (
              <div key={item.label} className="card p-4 text-center">
                <div className="text-xl font-bold text-orange-600 mb-1">{item.value}</div>
                <div className="text-slate-500 text-xs">{item.label}</div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-5">About the Babadağ Teleferik</h2>
          <p className="text-slate-600 leading-relaxed mb-5">The Babadağ cable car (teleferik) is the primary means of accessing the 1700m launch area for tandem passengers and pilots. The system runs from a base station near Ölüdeniz town up to the main launch plateau, covering nearly 1700m of altitude in around 10 minutes.</p>
          <p className="text-slate-600 leading-relaxed mb-8">The views during the ascent are exceptional — the Blue Lagoon, Ölüdeniz beach, and the Fethiye Bay panorama unfold as you climb. Many visitors ride the teleferik as a sightseeing attraction in its own right, even without paragliding.</p>

          <div className="space-y-5 mb-10">
            {[
              { title: 'Base Station Location', desc: 'The teleferik base station is located approximately 2km from Ölüdeniz beach, signposted from the main road. Parking is available at the base station. Dolmuş (shared minibus) services run from Fethiye and Ölüdeniz to the base station throughout the day in season.' },
              { title: 'Operating Hours', desc: 'The cable car typically operates from 08:00 to 19:00 (last ascent) during the main season (April–October). Hours are reduced outside peak season. The cable car may close in high wind conditions — call ahead or check on-site if weather is uncertain.' },
              { title: 'Queuing & Peak Times', desc: 'Peak queuing times are 09:00–11:00 and 13:00–15:00 in July and August. Arriving at 08:00 or after 16:00 typically means no queue. Pre-purchasing QR tickets online eliminates the ticketing queue but you still join the boarding queue.' },
              { title: 'The Descent', desc: 'After your paragliding flight, you land at the Ölüdeniz beach landing zone — not back at the top. There is no need to take the cable car back down after flying. Ground transport back to where you came from is organised by your tandem operator.' },
            ].map(item => (
              <div key={item.title} className="card p-5">
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-10">
            <h3 className="font-bold text-slate-900 mb-2">Skip the Queue with QR Tickets</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">The teleferik QR ticket system lets you purchase your ticket online and show a QR code at the gate — no queuing at the ticket desk.</p>
            <Link href="/babadag-guide/babadag-teleferik/qr-ticket-guide" className="inline-flex items-center gap-2 bg-orange-500 text-white font-semibold px-4 py-2 rounded-xl text-sm hover:bg-orange-600 transition-colors">
              QR Ticket Guide →
            </Link>
          </div>

          <FAQAccordion items={faqItems} title="Cable Car FAQ" />
        </div>
      </section>
    </>
  )
}
