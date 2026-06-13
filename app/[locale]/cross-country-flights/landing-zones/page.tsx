import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"XC Landing Zones",tr:"XC İniş Alanları",de:"XC-Landezonen",ru:"Зоны посадки XC"}
  const d = {en:"Detailed information for licensed paragliding pilots.",tr:"Lisanslı paraşütçüler için ayrıntılı bilgi.",de:"Detaillierte Informationen für lizenzierte Paragliding-Piloten.",ru:"Подробная информация для лицензированных пилотов."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/cross-country-flights/landing-zones'),
    openGraph: { url: localeUrl(locale, '/cross-country-flights/landing-zones'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'crossCountry' })
  const titles = {en:"XC Landing Zones",tr:"XC İniş Alanları",de:"XC-Landezonen",ru:"Зоны посадки XC"}
  const subs = {en:"Detailed information for licensed paragliding pilots.",tr:"Lisanslı paraşütçüler için ayrıntılı bilgi.",de:"Detaillierte Informationen für lizenzierte Paragliding-Piloten.",ru:"Подробная информация для лицензированных пилотов."}
  const bodies = {en:["Primary landing zone: Oludeniz main beach. Secondary: Calis Beach (Fethiye). Northern options: Gocek bay, Dalaman agricultural fields. All landing zones require prior coordination with our operations team for retrieve.","Contact us for full briefing packs, retrieve coordination, and local knowledge."],tr:["Birincil iniş alanı: Oludeniz ana plajı. İkincil: Calis Plajı (Fethiye). Tüm iniş alanları geri alma için operasyon ekibimizle önceden koordinasyon gerektirir.","Tam brifing paketi, geri alma koordinasyonu ve yerel bilgi için bize ulaşın."],de:["Primäre Landezone: Oludeniz Hauptstrand. Sekundär: Calis Beach (Fethiye). Alle Landezonen erfordern Vorkoordination mit unserem Team.","Kontaktieren Sie uns für vollständige Briefingpakete und Abholkoordination."],ru:["Основная зона приземления: главный пляж Олюдениз. Вторичная: пляж Калыш (Фетхие). Все зоны требуют предварительной координации.","Свяжитесь с нами для полных брифинг-пакетов и координации подбора."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7bd4/rtDjiycQ-CNoCYjmlrN3-.jpg" />
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
