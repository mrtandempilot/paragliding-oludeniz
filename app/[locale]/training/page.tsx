import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'
import ServiceSchema from '@/components/shared/ServiceSchema'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'training' })
  const d: Record<string, string> = {"en": "Paragliding courses in Oludeniz: beginner to advanced training, SIV clinics and tandem conversion with certified instructors on Babadağ.", "tr": "Ölüdeniz'de yamaç paraşütü kursları: başlangıçtan ileri seviyeye eğitim, SIV klinikleri ve sertifikalı eğitmenlerle tandem dönüşümü.", "de": "Paragliding-Kurse in Ölüdeniz: Training vom Anfänger bis Fortgeschrittenen, SIV-Kurse und Tandem-Umschulung mit zertifizierten Lehrern.", "ru": "Курсы парапланеризма в Олюденизе: обучение от начального до продвинутого уровня, SIV-клиники с сертифицированными инструкторами."}
  return {
    description: d[locale] || d.en,
    alternates: localeAlternates(locale, '/training'),
    openGraph: { url: localeUrl(locale, '/training'), description: d[locale] || d.en },
    twitter: { card: 'summary_large_image', description: d[locale] || d.en }, title: `${t('title')}` }
}

export default async function TrainingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'training' })

  const courses = [
    { href: '/training/beginner-courses', title: 'Beginner Courses', desc: 'Learn to fly from scratch with our certified instructors. P1/P2 certification.' },
    { href: '/training/advanced-courses', title: 'Advanced Courses', desc: 'Improve your skills with advanced techniques, XC flying and SIV clinics.' },
    { href: '/training/tandem-conversion', title: 'Tandem Conversion', desc: 'Become a certified tandem pilot. International certification available.' },
    { href: '/training/siv-clinic', title: 'SIV Clinic', desc: 'Safety and incident vivid training over the water with boat support.' },
  ]

  return (
    <>
      <ServiceSchema name="Paragliding Training Courses" description="Paragliding courses from beginner to advanced, SIV clinics and tandem conversion in Oludeniz." path="/training" serviceType="Paragliding Training" />
      <PageHero title={t('title')} subtitle={t('subtitle')} badge={t('badge')} bgImage="https://v3b.fal.media/files/b/0a9d7c0c/Dn0br3flHariTrqYqhISR.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: t('title') }]} />
        </div>
      </div>
      <section className="section-padding bg-white">
        <div className="container-default">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {courses.map((c) => (
              <Link key={c.href} href={c.href} className="card p-6 hover:shadow-md transition-shadow group">
                <h3 className="font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">{c.title}</h3>
                <p className="text-sm text-slate-600 mb-4">{c.desc}</p>
                <span className="text-orange-500 text-sm font-medium flex items-center gap-1">Learn more <ArrowRight className="w-4 h-4" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
