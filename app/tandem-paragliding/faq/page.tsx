import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import FAQAccordion from '@/components/shared/FAQAccordion'
import BookingCTA from '@/components/shared/BookingCTA'

export const metadata: Metadata = {
  title: 'Tandem Paragliding FAQ Ölüdeniz | All Your Questions Answered',
  description: '20+ questions answered about tandem paragliding in Ölüdeniz. Weight limits, age, health conditions, what to bring, booking, cancellation and more.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/tandem-paragliding/faq' },
}

const faqItems = [
  { question: 'Do I need any experience to do tandem paragliding?', answer: 'None whatsoever. In a tandem flight, you are attached to a certified pilot who controls everything. You run a few steps at launch and then sit back and enjoy the view. We fly complete beginners every single day.' },
  { question: 'What is the weight limit for tandem paragliding?', answer: 'The maximum weight is 110kg (242 lbs). There is no minimum adult weight. Children need to be at least approximately 15kg for the harness to fit correctly. If your weight is close to the limit, please contact us — we may be able to accommodate you depending on conditions.' },
  { question: 'What is the minimum age for tandem paragliding?', answer: 'The minimum age is 5 years old, with a parent or guardian present and signing consent. There is no maximum age limit. We regularly fly guests in their 70s and 80s.' },
  { question: 'Are there any health conditions that prevent flying?', answer: 'People with serious heart conditions, epilepsy, severe vertigo or recent major surgery should consult their doctor before flying. People who are pregnant should not fly. If you have any medical concerns, contact us and we will advise. Most conditions do not prevent flying — we assess each case individually.' },
  { question: 'How long is the flight?', answer: 'Standard flights from the 1200m launch last 25–35 minutes. Flights from the 1700m launch last 35–50 minutes. Sunset flights typically last 20–30 minutes. Exact duration depends on weather and thermal conditions on the day.' },
  { question: 'What should I wear?', answer: 'Closed-toe shoes (trainers or hiking shoes — not sandals). Comfortable trousers or leggings. A light jacket or fleece as it is 5–10°C cooler at launch altitude. Sunglasses with a secure fit. Tie back long hair.' },
  { question: 'Can I bring my phone or camera?', answer: 'Yes. Many guests take photos with their phone. Secure your phone in a tight pocket or use a wrist strap. GoPros can be used with a head mount. We also offer a professional photo and video package taken by your pilot — much better quality than self-photos.' },
  { question: 'What is your cancellation policy?', answer: 'Free cancellation up to 24 hours before your flight for a full refund. Within 24 hours, we offer a reschedule (once). If we cancel due to weather, you receive a full refund or free reschedule — always your choice.' },
  { question: 'What if I feel sick during the flight?', answer: 'Paragliding is much smoother than most people expect — not at all like a rollercoaster. If you feel unwell during the flight, tell your pilot and they will guide you to a smooth, direct descent. To minimise the risk, avoid a heavy meal in the 2 hours before flying, and choose a morning flight for calmer conditions.' },
  { question: 'Do I need travel insurance to paraglide?', answer: 'We recommend comprehensive travel insurance that covers adventure activities. All our tandem flights include third-party liability insurance on our side. For your own medical coverage in the event of an incident, personal travel insurance is advisable.' },
  { question: 'How do I get from Ölüdeniz beach to Babadağ?', answer: 'We take care of the transfer. Your booking includes transport to the launch site — either by cable car or our shuttle vehicle. You meet us at our office on the Ölüdeniz beach road.' },
  { question: 'Can I choose my pilot?', answer: 'You can request a specific pilot if you have flown with us before. For first bookings, we match pilots to guests based on availability and experience level. All our pilots are equally certified and experienced.' },
  { question: 'Do you operate in winter?', answer: 'Our organised tandem operation runs April to October. The cable car does not operate in winter and the mountain road can be icy. Some local pilots fly in winter windows but we do not offer commercial flights outside the season.' },
  { question: 'Can I book last minute?', answer: 'Yes, subject to availability. In peak season (July–September) flights can sell out 1–2 weeks in advance. Sunset flights sell out earliest. For guaranteed availability, book as early as possible. WhatsApp us for last-minute slots.' },
]

export default function TandemFAQPage() {
  // FAQAccordion komponenti zaten FAQPage schema üretiyor — burada duplicate yapmıyoruz
  return (
    <>
      <PageHero title="Tandem Paragliding FAQ" subtitle="Every question answered — from weight limits to what to wear." badge="FAQ" size="sm" />
      <div className="bg-slate-50 border-b border-slate-200"><div className="container-default py-3"><BreadcrumbNav items={[{ label: 'Tandem Paragliding', href: '/tandem-paragliding' }, { label: 'FAQ' }]} /></div></div>
      <section className="section-padding bg-white"><div className="container-default max-w-3xl"><FAQAccordion items={faqItems} title="Tandem Paragliding — All Questions Answered" /></div></section>
      <section className="py-16 bg-white"><div className="container-default max-w-2xl"><BookingCTA /></div></section>
    </>
  )
}
