import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import FAQAccordion from '@/components/shared/FAQAccordion'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

const faqs = [
  {
    category: 'Booking & Prices',
    questions: [
      { question: 'How do I book a flight?', answer: 'You can book online through our booking page, call us directly on +90 536 461 6674, or message us on WhatsApp. We recommend booking at least 24 hours in advance, especially in peak season (July–August).' },
      { question: 'How much does a tandem paragliding flight cost?', answer: 'Please check our prices page for current rates. Prices vary by flight type — standard tandem, sunset flight, and group bookings all have different rates. We offer group discounts for 4+ people.' },
      { question: 'Can I cancel or reschedule if the weather is bad?', answer: 'Yes. We offer free cancellation up to 24 hours before your flight. If we cancel due to weather on the day, you can reschedule at no extra cost or receive a full refund.' },
      { question: 'What payment methods do you accept?', answer: 'We accept online card payments (Visa, Mastercard), cash on the day, and bank transfer for large group bookings. All prices include VAT.' },
    ],
  },
  {
    category: 'Safety & Health',
    questions: [
      { question: 'Is tandem paragliding safe?', answer: 'Tandem paragliding with a certified pilot is one of the safest adventure sports available. Our pilots are fully certified by the Turkish Civil Aviation Authority and have thousands of flight hours each.' },
      { question: 'Are there any health conditions that prevent flying?', answer: 'You should not fly if you are pregnant, have a serious heart condition, or have had recent surgery. If you have a medical condition you are unsure about, please consult your doctor first.' },
      { question: 'Is there a weight or age limit?', answer: 'The maximum passenger weight is 110kg (242 lbs). Passengers under 18 require parental consent.' },
    ],
  },
  {
    category: 'What to Expect',
    questions: [
      { question: 'How long does the whole experience take?', answer: 'Allow 2–3 hours in total: transfer up to Babadağ (45 min), waiting time, the flight itself (25–50 min depending on your package), and return transfer.' },
      { question: 'What should I wear?', answer: 'Wear comfortable, layered clothing. Bring a light jacket as it can be cooler at altitude. Closed-toe shoes are required — sandals and flip-flops are not permitted.' },
      { question: 'Can I bring my camera or phone?', answer: 'Yes, but secure it properly. We recommend a wrist strap. We also offer professional photo and video packages taken by your pilot.' },
    ],
  },
]

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const lp = (href: string) => locale === 'en' ? href : `/${locale}${href}`
  const t = await getTranslations({ locale, namespace: 'faq' })
  return {
    title: `${t('title')} | Paragliding Ölüdeniz`,
    alternates: { canonical: 'https://paragliding-oludeniz.com/faq' },
  }
}

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const lp = (href: string) => locale === 'en' ? href : `/${locale}${href}`
  const t = await getTranslations({ locale, namespace: 'faq' })

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} badge={t('badge')} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0a/3Aur6SnimoW0BlFJ4cq8J.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: t('title') }]} />
        </div>
      </div>

      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          {faqs.map((section) => (
            <div key={section.category} className="mb-12">
              <h2 className="text-xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-200">
                {section.category}
              </h2>
              <FAQAccordion items={section.questions} />
            </div>
          ))}

          <div className="mt-12 bg-orange-50 border border-orange-200 rounded-2xl p-8 text-center">
            <p className="text-slate-700 font-medium mb-4">{t('stillQ')}</p>
            <Link href={lp("/contact")} className="btn-primary">
              {t('contactUs')}
            </Link>
          </div>
        </div>
      </section>

      <BookingCTA />
    </>
  )
}
