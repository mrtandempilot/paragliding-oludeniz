import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Award, Users, Clock, Globe, ShieldCheck, Star } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

const milestones = [
  { year: '1999', event: 'First tandem flights from Babadağ Mountain — one of the founding pilots of Ölüdeniz paragliding' },
  { year: '2003', event: 'Founding member of Ölüdeniz Paragliding Association' },
  { year: '2007', event: 'Official partner of the first Ölüdeniz Air Games' },
  { year: '2012', event: 'Expanded to XC and acro pilot services' },
  { year: '2018', event: 'Over 50,000 tandem flights completed safely' },
  { year: '2023', event: 'Launched pilot training and equipment services' },
  { year: '2025', event: 'Still flying, still loving every single flight' },
]

const PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Ceyhun Aksoy',
  jobTitle: 'Certified Tandem Paragliding Pilot',
  description: 'Ceyhun Aksoy is a certified tandem paragliding pilot based in Ölüdeniz, Turkey with over 25 years of experience and 50,000+ flights from Babadağ Mountain.',
  url: 'https://paragliding-oludeniz.com/about-us',
  worksFor: {
    '@type': 'Organization',
    name: 'Paragliding Oludeniz',
    url: 'https://paragliding-oludeniz.com',
  },
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: 'Tandem Paragliding Licence',
    recognizedBy: {
      '@type': 'Organization',
      name: 'Turkish Civil Aviation Authority (SHGM)',
    },
  },
  knowsAbout: ['Tandem Paragliding', 'Babadağ Mountain', 'Ölüdeniz', 'Blue Lagoon', 'XC Paragliding'],
  sameAs: ['https://instagram.com/paragliding.oludeniz'],
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  const d: Record<string, string> = {
    en: 'Meet Ceyhun Aksoy — certified tandem paragliding pilot in Ölüdeniz with 25+ years experience and 50,000+ flights from Babadağ over the Blue Lagoon.',
    tr: 'Ceyhun Aksoy ile tanışın — Babadağ\'dan Mavi Lagün üzerine 25+ yıl deneyimli, 50.000+ uçuşlu sertifikalı tandem paraşüt pilotu.',
    de: 'Lernen Sie Ceyhun Aksoy kennen — zertifizierter Tandempilot in Ölüdeniz mit 25+ Jahren Erfahrung und 50.000+ Flügen vom Babadağ.',
    ru: 'Познакомьтесь с Джейхуном Аксой — сертифицированным пилотом-тандем в Олюденизе с опытом 25+ лет и более 50 000 полётов с Бабадага.',
  }
  return {
    title: { absolute: 'Ceyhun Aksoy — Certified Paragliding Pilot Ölüdeniz | Paragliding Oludeniz' },
    description: d[locale] || d.en,
    alternates: localeAlternates(locale, '/about-us'),
    openGraph: {
      url: localeUrl(locale, '/about-us'),
      title: 'Meet Ceyhun Aksoy — Paragliding Pilot Ölüdeniz',
      description: d[locale] || d.en,
    },
    twitter: { card: 'summary_large_image', description: d[locale] || d.en },
  }
}

export default async function AboutUsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const lp = (href: string) => locale === 'en' ? href : `/${locale}${href}`
  const t = await getTranslations({ locale, namespace: 'about' })

  const stats = [
    { icon: Clock, value: '25+', label: 'Years of Experience', color: 'text-orange-500' },
    { icon: Users, value: '50,000+', label: 'Tandem Flights', color: 'text-sky-500' },
    { icon: Award, value: 'SHGM', label: 'Certified Pilot', color: 'text-emerald-500' },
    { icon: Globe, value: '60+', label: 'Countries', color: 'text-violet-500' },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
      />
      <PageHero title={t('title')} subtitle={t('subtitle')} badge={t('badge')} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c13/VVJ_THDhVNeRP66pu_Ew8.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: t('title') }]} />
        </div>
      </div>

      {/* Pilot Profile Card — E-E-A-T */}
      <section className="section-padding bg-white">
        <div className="container-default">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-6">
                <ShieldCheck className="w-4 h-4 text-orange-500" />
                <span className="text-orange-700 text-sm font-semibold">SHGM Certified Tandem Pilot</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">{t('story')}</h2>
              <p className="text-orange-500 font-semibold mb-4">Head Pilot & Founder · Ölüdeniz, Turkey</p>
              <p className="text-slate-600 leading-relaxed mb-4">{t('storyText')}</p>
              <p className="text-slate-600 leading-relaxed mb-6">{t('missionText')}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {['SHGM Certified', '25+ Years Experience', '50,000+ Flights', 'Annual Safety Checks', 'Babadağ Expert'].map((badge) => (
                  <span key={badge} className="bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full">
                    {badge}
                  </span>
                ))}
              </div>
              <Link href={lp("/book-now")} className="btn-primary">
                Book a Flight with Ceyhun <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-slate-50 rounded-2xl p-6 text-center">
                  <s.icon className={`w-8 h-8 ${s.color} mx-auto mb-3`} />
                  <p className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</p>
                  <p className="text-sm text-slate-600">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Review trust strip */}
      <section className="py-8 bg-orange-50 border-y border-orange-100">
        <div className="container-default text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-slate-700">
            <div className="flex items-center gap-2">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 text-orange-500 fill-orange-500" />)}
              <span className="font-bold ml-1">4.9 / 5</span>
            </div>
            <span className="hidden sm:block text-slate-300">|</span>
            <span>2,400+ verified passenger reviews</span>
            <span className="hidden sm:block text-slate-300">|</span>
            <span>Passengers from 60+ countries</span>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">25 Years Above Ölüdeniz</h2>
          <div className="space-y-6">
            {milestones.map((m) => (
              <div key={m.year} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-16 text-right">
                  <span className="text-orange-500 font-bold">{m.year}</span>
                </div>
                <div className="flex-shrink-0 w-px bg-slate-300 self-stretch relative">
                  <div className="absolute top-1.5 -left-1.5 w-3 h-3 rounded-full bg-orange-500" />
                </div>
                <p className="text-slate-700 pt-0.5">{m.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BookingCTA />
    </>
  )
}
