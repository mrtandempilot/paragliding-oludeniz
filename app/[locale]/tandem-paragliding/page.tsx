import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import FAQAccordion from '@/components/shared/FAQAccordion'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

const faqItems = [
  { question: 'Do I need any experience to do tandem paragliding?', answer: 'No experience is needed at all. In a tandem flight, you are attached to a certified pilot who controls everything. Your only job is to run a few steps at launch and enjoy the flight.' },
  { question: 'Is there a weight or age limit?', answer: 'Maximum passenger weight is 110kg. Passengers under 18 require parental consent.' },
  { question: 'What should I wear?', answer: 'Comfortable, layered clothing and closed-toe shoes. Bring a light jacket — it can be cooler at altitude.' },
  { question: 'How long is the flight?', answer: 'Flights last 25–45 minutes depending on your package and weather conditions.' },
]

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const lp = (href: string) => locale === 'en' ? href : `/${locale}${href}`
  const t = await getTranslations({ locale, namespace: 'tandem' })
  return {
    title: `${t('title')} | Book from Babadağ`,
    alternates: { canonical: 'https://paragliding-oludeniz.com/tandem-paragliding' },
  }
}

export default async function TandemPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const lp = (href: string) => locale === 'en' ? href : `/${locale}${href}`
  const t = await getTranslations({ locale, namespace: 'tandem' })

  const included = [t('inc1'), t('inc2'), t('inc3'), t('inc4'), t('inc5'), t('inc6'), t('inc7')]

  const subPages = [
    { href: '/tandem-paragliding/first-time', title: t('firstTime'), desc: t('firstTimeDesc'), emoji: '🎉' },
    { href: '/tandem-paragliding/sunset-flight', title: t('sunsetTitle'), desc: t('sunsetDesc'), emoji: '🌅' },
    { href: '/tandem-paragliding/group-flights', title: t('groupTitle'), desc: t('groupDesc'), emoji: '👥' },
    { href: '/tandem-paragliding/safety-guide', title: t('safetyTitle'), desc: t('safetyDesc'), emoji: '🛡️' },
  ]

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} badge={t('badge')} bgImage="https://v3b.fal.media/files/b/0a9d7c09/2htlcwkJ6pcLBY7gPtf7z.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: t('title') }]} />
        </div>
      </div>

      <section className="section-padding bg-white">
        <div className="container-default">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('included')}</h2>
              <ul className="space-y-3 mb-8">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-4 flex-wrap">
                <Link href={lp("/book-now")} className="btn-primary">{t('bookNow')} <ArrowRight className="w-4 h-4" /></Link>
                <Link href={lp("/prices")} className="btn-secondary">{t('viewPrices')}</Link>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subPages.map((p) => (
                <Link key={p.href} href={p.href} className="card p-5 hover:shadow-md transition-shadow group">
                  <span className="text-3xl mb-3 block">{p.emoji}</span>
                  <h3 className="font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">{p.title}</h3>
                  <p className="text-sm text-slate-600">{p.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-3xl">
          <FAQAccordion items={faqItems} />
        </div>
      </section>

      <BookingCTA />
    </>
  )
}
