import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Cloudbase Guide",tr:"Bulut Tabanı Rehberi",de:"Wolkenbasis-Leitfaden",ru:"Гид по облачному основанию"}
  const d = {en:"Expert guide for paragliding pilots.",tr:"Paraşüt pilotları için uzman rehberi.",de:"Expertenführer für Paragliding-Piloten.",ru:"Экспертный гид для пилотов параплана."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/thermals-guide/cloudbase-guide'),
    openGraph: { url: localeUrl(locale, '/thermals-guide/cloudbase-guide'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'thermalsGuide' })
  const titles = {en:"Cloudbase Guide",tr:"Bulut Tabanı Rehberi",de:"Wolkenbasis-Leitfaden",ru:"Гид по облачному основанию"}
  const subs = {en:"Expert guide for paragliding pilots.",tr:"Paraşüt pilotları için uzman rehberi.",de:"Expertenführer für Paragliding-Piloten.",ru:"Экспертный гид для пилотов параплана."}
  const bodies = {en:["Cloudbase is the altitude at which thermals condense into cumulus clouds. Flying significantly above cloudbase risks entering cloud (illegal and dangerous). At Oludeniz, cloudbase ranges from 1500m (spring) to 2800m (summer).","Contact our team for full pilot briefing information."],tr:["Tam pilot brifing bilgisi için ekibimizle iletişime geçin."],de:["Kontaktieren Sie unser Team für vollständige Pilot-Briefinginformationen."],ru:["Свяжитесь с нашей командой для получения полной информации о брифинге пилотов."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0b/Ma1uD1AUlcpoxL-48cgg4.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3"><BreadcrumbNav items={[{ label: title }]} /></div>
      </div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl space-y-4">
          {body.map((p: string, i: number) => <p key={i} className="text-slate-600 leading-relaxed">{p}</p>)}
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
