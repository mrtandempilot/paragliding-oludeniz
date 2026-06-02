import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'acro' })
  return { title: `${t('title')} | Paragliding Ölüdeniz` }
}

export default async function AcroPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'acro' })

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} badge={t('badge')} />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: t('title') }]} />
        </div>
      </div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          <p className="text-slate-600 leading-relaxed mb-6">Ölüdeniz is one of the world&apos;s premier acro paragliding destinations, hosting international competitions and attracting elite pilots from around the globe. The combination of reliable thermals, safe landing zones and stunning scenery makes it perfect for acrobatic flying.</p>
          <p className="text-slate-600 leading-relaxed mb-8">Whether you want to watch acro flying, try an introductory acro flight, or join the local acro community, we can help.</p>
          <Link href="/contact" className="btn-primary">Contact Us <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
