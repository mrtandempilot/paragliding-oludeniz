import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import FAQAccordion from '@/components/shared/FAQAccordion'
import BookingCTA from '@/components/shared/BookingCTA'

export const metadata: Metadata = {
  title: 'FAQ | Paragliding Ölüdeniz — Common Questions Answered',
  description:
    'Answers to the most common questions about tandem paragliding in Ölüdeniz. Booking, safety, what to wear, weight limits, weather and everything else you need to know.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/faq' },
}

const faqs = [
  {
    category: 'Booking & Prices',
    questions: [
      {
        q: 'How do I book a flight?',
        a: 'You can book online through our booking page, call us directly on +90 536 461 6674, or message us on WhatsApp. We recommend booking at least 24 hours in advance, especially in peak season (July–August).',
      },
      {
        q: 'How much does a tandem paragliding flight cost?',
        a: 'Please check our prices page for current rates. Prices vary by flight type — standard tandem, sunset flight, and group bookings all have different rates. We offer group discounts for 4+ people.',
      },
      {
        q: 'Can I cancel or reschedule if the weather is bad?',
        a: 'Yes. We offer free cancellation up to 24 hours before your flight. If we cancel due to weather on the day, you can reschedule at no extra cost or receive a full refund. Your safety is always our priority — we never fly in unsafe conditions.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept online card payments (Visa, Mastercard), cash on the day, and bank transfer for large group bookings. All prices include VAT.',
      },
    ],
  },
  {
    category: 'Safety & Health',
    questions: [
      {
        q: 'Is tandem paragliding safe?',
        a: 'Tandem paragliding with a certified pilot is one of the safest adventure sports available. Our pilots are fully certified by the Turkish Civil Aviation Authority and have thousands of flight hours each. We have operated for 25+ years with an unblemished safety record.',
      },
      {
        q: 'Are there any health conditions that prevent flying?',
        a: 'You should not fly if you are pregnant, have a serious heart condition, or have had recent surgery. If you have a medical condition you are unsure about, please consult your doctor first and let us know when booking. We want to make sure flying is right for you.',
      },
      {
        q: 'Is there a weight or age limit?',
        a: 'The maximum passenger weight is 110kg (242 lbs). There is no strict age minimum for tandem flights, but passengers under 18 require parental consent. Children should be able to understand and follow safety instructions from the pilot.',
      },
      {
        q: 'What happens if something goes wrong in the air?',
        a: 'Our pilots are trained in emergency procedures and carry reserve parachutes. The entire Ölüdeniz flying area is well mapped and our pilots know every safe landing option. In 25+ years, we have never had a serious incident.',
      },
    ],
  },
  {
    category: 'What to Expect',
    questions: [
      {
        q: 'How long does the flight last?',
        a: 'A standard tandem flight from the 1700m launch lasts approximately 30–45 minutes. Sunset flights are timed to coincide with the golden hour and typically last 40–60 minutes. Flight time varies with conditions.',
      },
      {
        q: 'What should I wear?',
        a: 'Wear comfortable, closed-toe shoes (trainers are ideal) and comfortable clothing appropriate for the weather. At the top of Babadağ it can be cooler than the beach, so bring a light jacket even in summer. Avoid loose items like scarves or open sandals.',
      },
      {
        q: 'Where do we land?',
        a: 'We land on Ölüdeniz main beach — a long sandy beach right beside the Blue Lagoon. It is a smooth, easy landing that most guests find exciting but not scary. We brief you fully on landing technique before take-off.',
      },
      {
        q: 'Can I bring my phone or camera?',
        a: 'Yes, but we strongly recommend securing them with a lanyard or leaving them with your ground team. We offer GoPro video recording with your pilot so you can relax and enjoy the flight without worrying about filming.',
      },
      {
        q: 'How do I get to the launch point?',
        a: 'We offer transfers from Ölüdeniz as part of your booking. You can also take the cable car (teleferik) from near the Blue Lagoon beach entrance, or drive up the mountain road. Your booking confirmation will include all logistics.',
      },
    ],
  },
  {
    category: 'Weather & Season',
    questions: [
      {
        q: 'When is the best time to fly?',
        a: 'We fly from April through to October. The best conditions are typically in May, June and September — warm, stable weather with reliable thermal development. July and August are peak season with very high demand. Check our weather guide for more detail.',
      },
      {
        q: 'What happens if the weather is bad on my day?',
        a: 'Safety is our priority — we do not fly if conditions are not right. If we cancel due to weather, we will contact you as early as possible to reschedule or refund. Ölüdeniz has 300+ flyable days per year, so cancellations are rare.',
      },
      {
        q: 'Can I fly in the morning or afternoon?',
        a: 'Both are possible. Thermals are typically stronger in the afternoon (after midday). Mornings can offer smoother, calmer conditions. Sunset flights depart specifically timed for the best golden hour light — usually around 5–6pm depending on the season.',
      },
    ],
  },
]

export default function FAQPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.flatMap((cat) =>
      cat.questions.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      }))
    ),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about flying with us in Ölüdeniz."
        size="sm"
      />

      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: 'FAQ' }]} />
        </div>
      </div>

      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          {faqs.map((cat) => (
            <div key={cat.category} className="mb-12">
              <h2 className="text-xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-200">
                {cat.category}
              </h2>
              <FAQAccordion
                items={cat.questions.map((faq) => ({ question: faq.q, answer: faq.a }))}
              />
            </div>
          ))}

          <div className="mt-12 p-6 bg-orange-50 rounded-2xl text-center">
            <p className="text-slate-700 font-medium mb-2">Still have a question?</p>
            <p className="text-slate-500 text-sm mb-4">
              Call or WhatsApp us directly — we are happy to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="tel:+905364616674" className="btn-primary">
                Call +90 536 461 6674
              </a>
              <a
                href="https://wa.me/905364616674?text=Hi!%20I%20have%20a%20question%20about%20paragliding%20in%20%C3%96l%C3%BCdeniz."
                className="btn-secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-2xl">
          <BookingCTA
            title="Ready to Book?"
            subtitle="Flights available daily April to October. Book online in 2 minutes."
          />
        </div>
      </section>
    </>
  )
}
