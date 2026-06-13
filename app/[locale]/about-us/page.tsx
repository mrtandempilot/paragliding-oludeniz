import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Award, Users, Clock, Globe } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

const milestones = [
  { year: '1999', event: 'First tandem flights from Babadağ Mountain' },
  { year: '2003', event: 'Founding member of Ölüdeniz Paragliding Association' },
  { year: '2007', event: 'Official partner of the first Ölüdeniz Air Games' },
  { year: '2012', event: 'Expanded to XC and acro pilot services' },
  { year: '2018', event: 'Over 50,000 tandem flights completed' },
  { year: '2023', event: 'Launched pilot training and equipment services' },
  { year: '2025', event: 'Still flying, still loving every single flight' },
]

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const lp = (href: string) => locale === 'en' ? href : `/${locale}${href}`
  const t = await getTranslations({ locale, namespace: 'about' })
  const d: Record<string, string> = {"en": "Meet the team behind Paragliding Oludeniz — certified tandem pilots with 25+ years of experience flying from Babadağ over the Blue Lagoon.", "tr": "Paragliding Ölüdeniz ekibiyle tanışın — Babadağ'dan Mavi Lagün üzerine uçan, 25 yılı aşkın deneyime sahip sertifikalı tandem pilotları.", "de": "Das Team von Paragliding Ölüdeniz — zertifizierte Tandempiloten mit über 25 Jahren Erfahrung am Babadağ über der Blauen Lagune.", "ru": "Команда Paragliding Oludeniz — сертифицированные тандем-пилоты с опытом более 25 лет, полёты с Бабадага над Голубой лагуной."}
  return {
    description: d[locale] || d.en,
    title: `${t('title')}`,
    alternates: localeAlternates(locale, '/about-us'),
    openGraph: { url: localeUrl(locale, '/about-us'), description: d[locale] || d.en },
    twitter: { card: 'summary_large_image', description: d[locale] || d.en },
  }
}

export default async function AboutUsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const lp = (href: string) => locale === 'en' ? href : `/${locale}${href}`
  const t = await getTranslations({ locale, namespace: 'about' })

  const stats = [
    { icon: Clock, value: '25+', label: t('experience'), color: 'text-orange-500' },
    { icon: Users, value: '50,000+', label: 'Tandem Flights', color: 'text-sky-500' },
    { icon: Award, value: '100%', label: t('certified'), color: 'text-emerald-500' },
    { icon: Globe, value: '60+', label: 'Countries', color: 'text-violet-500' },
  ]

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} badge={t('badge')} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c13/VVJ_THDhVNeRP66pu_Ew8.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: t('title') }]} />
        </div>
      </div>

      <section className="section-padding bg-white">
        <div className="container-default">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('story')}</h2>
              <p className="text-slate-600 leading-relaxed mb-4">{t('storyText')}</p>
              <p className="text-slate-600 leading-relaxed mb-8">{t('missionText')}</p>
              <Link href={lp("/book-now")} className="btn-primary">
                Book a Flight <ArrowRight className="w-5 h-5" />
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

      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Timeline</h2>
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
