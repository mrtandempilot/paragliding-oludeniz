import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'babadagGuide' })
  return { title: `Light Wind Landing Guide | Paragliding Ölüdeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'babadagGuide' })

  const titles: Record<string, string> = {
    en: 'Light Wind Landing Guide',
    tr: 'Hafif Rüzgar İnişi',
    de: 'Leichtwind-Landung',
    ru: 'Посадка при слабом ветре',
  }

  const title = titles[locale] || titles.en

  return (
    <>
      <PageHero title={title} subtitle={t('subtitle') || ''} badge={t('badge') || ''} size="sm" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: title }]} />
        </div>
      </div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <p className="text-slate-500 text-center py-12">Content coming soon.</p>
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
