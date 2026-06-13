import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Crosswind Landing Guide",tr:"Çapraz Rüzgar İnişi Rehberi",de:"Seitenwind-Landung",ru:"Посадка при боковом ветре"}
  const d = {en:"Detailed guide for pilots flying into Oludeniz.",tr:"Oludeniz'e inen pilotlar için ayrıntılı rehber.",de:"Detaillierter Leitfaden für Piloten, die in Oludeniz landen.",ru:"Подробный гид для пилотов, приземляющихся в Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/babadag-guide/landing-crosswind'),
    openGraph: { url: localeUrl(locale, '/babadag-guide/landing-crosswind'), description: (d as any)[locale] || d.en }, title: `${t[locale as keyof typeof t]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'babadagGuide' })
  const titles = {en:"Crosswind Landing Guide",tr:"Çapraz Rüzgar İnişi Rehberi",de:"Seitenwind-Landung",ru:"Посадка при боковом ветре"}
  const subs = {en:"Detailed guide for pilots flying into Oludeniz.",tr:"Oludeniz'e inen pilotlar için ayrıntılı rehber.",de:"Detaillierter Leitfaden für Piloten, die in Oludeniz landen.",ru:"Подробный гид для пилотов, приземляющихся в Олюдениз."}
  const bodies = {en:["This page contains detailed landing zone information for licensed pilots. The main landing zone is on Oludeniz beach, directly in front of the Blue Lagoon. Coordinates and approach procedures are available on request.","All landings require awareness of wind direction, beach traffic, and other paragliders in the circuit. New pilots should fly with a local guide on their first visit.","Contact us for a full pilot briefing pack: wind windows, circuit procedures, emergency contacts, and local airspace information."],tr:["Bu sayfa lisanslı pilotlar için ayrıntılı iniş alanı bilgileri içermektedir. Ana iniş alanı Mavi Lagün'ün hemen önünde Oludeniz plajındadır.","Tüm inişler rüzgar yönü, plaj trafiği ve devredeki diğer paraşütçülerin farkındalığını gerektirir. İlk ziyaretlerinde yeni pilotların yerel bir rehberle uçması önerilir.","Tam pilot brifing paketi için bize ulaşın."],de:["Diese Seite enthält detaillierte Landezoneninformationen für lizenzierte Piloten. Die Hauptlandezone befindet sich am Oludeniz-Strand, direkt vor der Blauen Lagune.","Kontaktieren Sie uns für ein vollständiges Pilot-Briefingpaket."],ru:["Эта страница содержит подробную информацию о зонах приземления для лицензированных пилотов. Основная зона приземления — пляж Олюдениз.","Свяжитесь с нами для получения полного брифинг-пакета для пилотов."]}
  type L = keyof typeof titles
  const title = titles[locale as L]||titles.en
  const sub = subs[locale as L]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c08/BbYEw0ihhZaLcaN29vTrs.jpg" />
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
