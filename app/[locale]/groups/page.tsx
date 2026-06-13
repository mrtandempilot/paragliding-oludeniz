import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const lp = (href: string) => locale === 'en' ? href : `/${locale}${href}`
  const t = await getTranslations({ locale, namespace: 'groups' })
  const d: Record<string, string> = {"en": "Group paragliding in Oludeniz for families, friends, corporate events, hen & stag parties and schools. Group discounts and full logistics.", "tr": "Aileler, arkadaş grupları, kurumsal etkinlikler ve okullar için Ölüdeniz'de grup yamaç paraşütü. Grup indirimi ve tam lojistik destek.", "de": "Gruppen-Paragliding in Ölüdeniz für Familien, Freunde, Firmenevents und Schulen. Gruppenrabatte und komplette Logistik.", "ru": "Групповые полёты на параплане в Олюденизе для семей, друзей, корпоративов и школ. Скидки для групп и полная логистика."}
  return {
    description: d[locale] || d.en,
    alternates: localeAlternates(locale, '/groups'),
    openGraph: { url: localeAlternates(locale, '/groups').canonical! }, title: `${t('title')} | Paragliding Ölüdeniz` }
}

export default async function GroupsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const lp = (href: string) => locale === 'en' ? href : `/${locale}${href}`
  const t = await getTranslations({ locale, namespace: 'groups' })

  const types = [
    { href: '/groups/hen-stag', emoji: '🎉', title: 'Hen & Stag Parties' },
    { href: '/groups/corporate', emoji: '💼', title: 'Corporate Groups' },
    { href: '/groups/schools', emoji: '🎒', title: 'School & University Trips' },
    { href: '/groups/tour-operators', emoji: '🌍', title: 'Tour Operators' },
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {types.map((g) => (
              <Link key={g.href} href={g.href} className="card p-5 text-center hover:shadow-md transition-shadow group">
                <span className="text-4xl mb-3 block">{g.emoji}</span>
                <h3 className="font-semibold text-slate-900 text-sm group-hover:text-orange-600 transition-colors">{g.title}</h3>
              </Link>
            ))}
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 text-center">
            <p className="text-slate-700 mb-4">Groups of 4+ receive 10% discount. Groups of 8+ receive 15% off.</p>
            <Link href={lp("/contact")} className="btn-primary">Get a Group Quote <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>
    </>
  )
}
