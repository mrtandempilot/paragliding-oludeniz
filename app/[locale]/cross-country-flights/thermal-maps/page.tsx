import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Thermal Maps Oludeniz",tr:"Oludeniz Termik Haritaları",de:"Thermikkarten Oludeniz",ru:"Карты термиков Олюдениз"}
  const d = {en:"Detailed information for licensed paragliding pilots.",tr:"Lisanslı paraşütçüler için ayrıntılı bilgi.",de:"Detaillierte Informationen für lizenzierte Paragliding-Piloten.",ru:"Подробная информация для лицензированных пилотов."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/cross-country-flights/thermal-maps'),
    openGraph: { url: localeUrl(locale, '/cross-country-flights/thermal-maps'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'crossCountry' })
  const titles = {en:"Thermal Maps Oludeniz",tr:"Oludeniz Termik Haritaları",de:"Thermikkarten Oludeniz",ru:"Карты термиков Олюдениз"}
  const subs = {en:"Detailed information for licensed paragliding pilots.",tr:"Lisanslı paraşütçüler için ayrıntılı bilgi.",de:"Detaillierte Informationen für lizenzierte Paragliding-Piloten.",ru:"Подробная информация для лицензированных пилотов."}
  const bodies = {en:["Oludeniz thermals are driven by the limestone terrain, sea-land temperature differential, and consistent north-westerly flow. Key trigger points include the south-east face of Babadağ, the valley above Faralya, and the rocky headlands north of Oludeniz beach.","Contact us for full briefing packs, retrieve coordination, and local knowledge."],tr:["Oludeniz termikleri kireçtaşı arazi, deniz-kara sıcaklık farkı ve tutarlı kuzey-batı akışı tarafından yönlendirilir.","Tam brifing paketi, geri alma koordinasyonu ve yerel bilgi için bize ulaşın."],de:["Oludeniz-Thermik wird durch das Kalksteingelände, den See-Land-Temperaturunterschied und den gleichmäßigen Nordwestwind angetrieben.","Kontaktieren Sie uns für vollständige Briefingpakete und Abholkoordination."],ru:["Термики Олюдениза обусловлены известняковым рельефом, разницей температур море-суша и устойчивым северо-западным потоком.","Свяжитесь с нами для полных брифинг-пакетов и координации подбора."]}
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
