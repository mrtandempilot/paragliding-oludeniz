import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingForm from './BookingForm'
import { getTranslations } from 'next-intl/server'
import { localeAlternates } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'bookNow' })
  return {
    title: `${t('title')} | Paragliding Ölüdeniz`,
    alternates: localeAlternates(locale, '/book-now'),
  }
}

export default async function BookNowPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'bookNow' })

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} badge={t('badge')} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0d/dOEuj7ebfM-MdyvUcunPD.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: t('title') }]} />
        </div>
      </div>
      <BookingForm />
    </>
  )
}
