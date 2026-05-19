import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Babadağ Cable Car QR Ticket | How to Buy Online Teleferik Tickets',
  description: 'How to buy Babadağ teleferik QR tickets online. Step-by-step guide to purchasing cable car tickets in advance and skipping the queue at Ölüdeniz.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/babadag-guide/babadag-teleferik/qr-ticket-guide' },
}

export default function QrTicketGuidePage() {
  return (
    <>
      <PageHero title="Teleferik QR Ticket Guide" subtitle="Buy your Babadağ cable car ticket online and skip the queue." badge="QR Tickets" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Babadağ Guide', href: '/babadag-guide' }, { label: 'Cable Car', href: '/babadag-guide/babadag-teleferik' }, { label: 'QR Ticket Guide' }]} /></div></div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-8">
            <p className="text-green-800 text-sm"><strong>Save Time:</strong> In peak season (July–August), the teleferik ticket desk queue can be 20–40 minutes. Buying a QR ticket online means you walk straight to the gate — a significant time saving, especially for morning flights.</p>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-6">How to Buy QR Tickets</h2>
          <div className="space-y-4 mb-10">
            {[
              { step: 1, title: 'Visit the Official Website', desc: 'Go to the official Babadağ teleferik ticketing website. Look for the online ticket purchase section. Ensure you are on the official site — third-party resellers may charge a premium.' },
              { step: 2, title: 'Select Your Ticket Type', desc: 'Choose single ascent, return, or day pass. For paragliding passengers, a single ascent is all you need — you will not return by cable car after your flight. Select the number of tickets and your preferred date.' },
              { step: 3, title: 'Complete Payment', desc: 'Pay online by credit or debit card. International cards are accepted. You will receive a confirmation email with your QR code ticket(s).' },
              { step: 4, title: 'Show QR Code at the Gate', desc: 'At the teleferik base station, go directly to the QR code scanner gate (separate from the main ticket queue). Hold your phone screen up to the scanner. The gate opens automatically when the code is validated.' },
              { step: 5, title: 'Boarding', desc: 'After gate validation, join the standard boarding queue. The boarding queue is usually short even in peak season. Gondolas hold approximately 6–8 passengers plus equipment.' },
            ].map(item => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="bg-orange-500 text-white font-bold rounded-full w-9 h-9 flex items-center justify-center flex-shrink-0">{item.step}</div>
                <div className="card p-4 flex-1">
                  <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <h3 className="font-bold text-slate-900 mb-2">Tips for QR Tickets</h3>
              <ul className="space-y-2 text-sm text-amber-800">
                <li>• Screenshot your QR code in case of poor mobile signal at the base station</li>
                <li>• QR codes are typically valid for the date selected — check flexibility/cancellation policy when booking</li>
                <li>• Group bookings of 4+ people save the most time with QR tickets vs. queuing</li>
                <li>• If the cable car is closed on your booked date (high wind etc.), most online tickets can be rescheduled</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
