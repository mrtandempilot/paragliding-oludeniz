import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'solo' })
  return { title: `${t('title')} | Paragliding Ölüdeniz` }
}

export default async function SoloPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'solo' })

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
          <p className="text-slate-600 leading-relaxed mb-6">Ölüdeniz is a world-class destination for solo and XC pilots. With reliable thermals, 300+ flying days per year, and multiple launch points on Babadağ, it attracts pilots from all over the world.</p>
          <p className="text-slate-600 leading-relaxed mb-8">We offer pilot services including equipment hire, meteorology briefings, retrieve services, and storage facilities.</p>
          <Link href="/pilot-services" className="btn-primary">Pilot Services <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
