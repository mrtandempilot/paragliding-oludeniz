import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Babadag Road Guide",tr:"Babadag Yol Rehberi",de:"Babadag Strassenführer",ru:"Дорожный гид Бабадаг"}
  const d = {en:"How to get to Babadağ by road.",tr:"Babadağ'a karayoluyla nasıl gidilir.",de:"So gelangen Sie mit dem Auto zum Babadağ.",ru:"Как добраться до Бабадага по дороге."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/babadag-road-guide'),
    openGraph: { url: localeUrl(locale, '/babadag-road-guide'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'babadagGuide' })
  const titles = {en:"Babadag Road Guide",tr:"Babadag Yol Rehberi",de:"Babadag Strassenführer",ru:"Дорожный гид Бабадаг"}
  const subs = {en:"How to get to Babadağ by road.",tr:"Babadağ'a karayoluyla nasıl gidilir.",de:"So gelangen Sie mit dem Auto zum Babadağ.",ru:"Как добраться до Бабадага по дороге."}
  const bodies = {en:["The Babadağ mountain road starts from the Oludeniz junction on the main D400 coastal road and climbs to approximately 1700m. The road is well-maintained tarmac with passing places. Drive time from Oludeniz beach: approximately 30-35 minutes.","For pilots driving to launch: park at the designated pilot parking area at the 1200m launch. Do not block the tandem operations area. The 1700m area has limited parking — arrive early or use our shuttle service.","The road is open from approximately 07:00 daily during the season. It is closed in bad weather and occasionally for road maintenance. We post road status on our WhatsApp status and Instagram stories every morning."],tr:["Babadağ dağ yolu, ana D400 kıyı yolundaki Oludeniz kavşağından başlar ve yaklaşık 1700m'ye tırmanır. Oludeniz plajından sürüş süresi yaklaşık 30-35 dakikadır."],de:["Die Babadağ-Gebirgsstraße beginnt an der Oludeniz-Kreuzung der Hauptstraße D400 und steigt auf ca. 1700m an. Fahrzeit vom Strand: ca. 30-35 Minuten."],ru:["Горная дорога Бабадага начинается от перекрёстка Олюдениз на главной прибрежной дороге D400 и поднимается до примерно 1700м. Время езды от пляжа: около 30-35 минут."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
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
