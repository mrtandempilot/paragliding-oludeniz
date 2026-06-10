import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingForm from './BookingForm'
import { getTranslations } from 'next-intl/server'
import { localeAlternates } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'bookNow' })
  const d: Record<string, string> = {"en": "Book your tandem paragliding flight in Oludeniz online. Instant confirmation, free transfer to Babadağ launch, certified pilots. Fly today!", "tr": "Ölüdeniz'de tandem yamaç paraşütü uçuşunuzu online rezerve edin. Anında onay, Babadağ'a ücretsiz transfer, sertifikalı pilotlar.", "de": "Buchen Sie Ihren Tandem-Gleitschirmflug in Ölüdeniz online. Sofortige Bestätigung, kostenloser Transfer zum Babadağ, zertifizierte Piloten.", "ru": "Забронируйте тандемный полёт на параплане в Олюденизе онлайн. Мгновенное подтверждение, бесплатный трансфер на Бабадаг."}
  return {
    description: d[locale] || d.en,
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
