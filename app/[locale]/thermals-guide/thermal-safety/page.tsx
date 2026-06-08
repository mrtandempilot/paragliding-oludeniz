import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Thermal Safety Guide",tr:"Termik Güvenlik Rehberi",de:"Thermik-Sicherheitsleitfaden",ru:"Безопасность в термиках"}
  return { title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'thermalsGuide' })
  const titles = {en:"Thermal Safety Guide",tr:"Termik Güvenlik Rehberi",de:"Thermik-Sicherheitsleitfaden",ru:"Безопасность в термиках"}
  const subs = {en:"Expert guide for paragliding pilots.",tr:"Paraşüt pilotları için uzman rehberi.",de:"Expertenführer für Paragliding-Piloten.",ru:"Экспертный гид для пилотов параплана."}
  const bodies = {en:["Strong thermals can cause glider collapses. This is normal in paragliding and all paragliders are designed to recover. Our tandem pilots are trained to handle collapses and fly conservatively with passengers. Never fly alone in strong thermals without SIV training.","Contact our team for full pilot briefing information."],tr:["Tam pilot brifing bilgisi için ekibimizle iletişime geçin."],de:["Kontaktieren Sie unser Team für vollständige Pilot-Briefinginformationen."],ru:["Свяжитесь с нашей командой для получения полной информации о брифинге пилотов."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1600&q=85" />
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
