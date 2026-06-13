import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Paragliding Oludeniz Turkey",tr:"Oludeniz Yamaç Paraşütü",de:"Paragliding Oludeniz Türkei",ru:"Парапланеризм Олюдениз Турция"}
  const d = {en:"The complete guide to paragliding in Oludeniz.",tr:"Oludeniz'de yamaç paraşütü için eksiksiz rehber.",de:"Der vollständige Leitfaden zum Paragliding in Oludeniz.",ru:"Полный гид по парапланеризму в Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/oludeniz-paragliding'),
    openGraph: { url: localeUrl(locale, '/oludeniz-paragliding'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'oludenizPara' })
  const titles = {en:"Paragliding Oludeniz Turkey",tr:"Oludeniz Yamaç Paraşütü",de:"Paragliding Oludeniz Türkei",ru:"Парапланеризм Олюдениз Турция"}
  const subs = {en:"The complete guide to paragliding in Oludeniz.",tr:"Oludeniz'de yamaç paraşütü için eksiksiz rehber.",de:"Der vollständige Leitfaden zum Paragliding in Oludeniz.",ru:"Полный гид по парапланеризму в Олюдениз."}
  const bodies = {en:["Oludeniz is consistently ranked as one of the top five paragliding destinations in the world. The combination of Babadağ Mountain (1960m), reliable thermals, 300+ flying days per year, and a beach landing directly next to the iconic Blue Lagoon makes it unique.","Tandem paragliding flights launch from four separate points between 1200m and 1960m. Flights last 25-50 minutes depending on conditions and your chosen package. Our certified pilots have flown thousands of passengers safely over the lagoon.","The best time to visit is May-June and September-October when thermals are perfect for both beginners and experienced pilots. July and August are busier but still excellent flying conditions.","Book your flight online or contact us by WhatsApp for same-day bookings. We fly every day weather permits, April to October."],tr:["Oludeniz, dünyada en iyi paraşüt destinasyonlarından biri olarak tutarlı şekilde sıralanır. Babadağ (1960m), 300+ uçuş günü ve ikonik Mavi Lagün'ün yanında plaj inişi ile benzersizdir.","Tandem uçuşlar 1200m ile 1960m arasında dört ayrı noktadan kalkar. Uçuşlar 25-50 dakika sürer. Nisan'dan Ekim'e kadar hava izin verdiğinde her gün uçuyoruz."],de:["Oludeniz wird durchgehend als eines der Top-5-Paragliding-Ziele der Welt bewertet. Die Kombination aus Babadağ (1960m), 300+ Flugtagen und einer Strandlandung neben der Blauen Lagune macht es einzigartig.","Tandemflüge starten von vier Startpunkten zwischen 1200m und 1960m. Flüge dauern 25-50 Minuten. Wir fliegen täglich von April bis Oktober."],ru:["Олюдениз неизменно входит в пятёрку лучших мест для парапланеризма в мире. Сочетание горы Бабадаг (1960м), 300+ лётных дней и приземления на пляж рядом с Голубой Лагуной делает его уникальным.","Тандемные полёты стартуют с четырёх точек между 1200м и 1960м. Полёты длятся 25-50 минут. Летаем ежедневно с апреля по октябрь."]}
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
