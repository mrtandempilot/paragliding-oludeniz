import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Babadag Road Guide",tr:"Babadag Yol Rehberi",de:"Babadag Strassenführer",ru:"Дорожный гид Бабадаг", zh: "巴巴达山公路指南"}
  const d = {en:"How to get to Babadağ by road.",tr:"Babadağ'a karayoluyla nasıl gidilir.",de:"So gelangen Sie mit dem Auto zum Babadağ.",ru:"Как добраться до Бабадага по дороге.", zh: "如何经公路前往巴巴达山。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/babadag-road-guide'),
    openGraph: { url: localeUrl(locale, '/babadag-road-guide'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'babadagGuide' })
  const titles = {en:"Babadag Road Guide",tr:"Babadag Yol Rehberi",de:"Babadag Strassenführer",ru:"Дорожный гид Бабадаг", zh: "巴巴达山公路指南"}
  const subs = {en:"How to get to Babadağ by road.",tr:"Babadağ'a karayoluyla nasıl gidilir.",de:"So gelangen Sie mit dem Auto zum Babadağ.",ru:"Как добраться до Бабадага по дороге.", zh: "如何经公路前往巴巴达山。"}
  const bodies = {en:["The Babadağ mountain road starts from the Oludeniz junction on the main D400 coastal road and climbs to approximately 1700m. The road is well-maintained tarmac with passing places. Drive time from Oludeniz beach: approximately 30-35 minutes.","For pilots driving to launch: park at the designated pilot parking area at the 1200m launch. Do not block the tandem operations area. The 1700m area has limited parking — arrive early or use our shuttle service.","The road is open from approximately 07:00 daily during the season. It is closed in bad weather and occasionally for road maintenance. We post road status on our WhatsApp status and Instagram stories every morning."],tr:["Babadağ dağ yolu, ana D400 kıyı yolundaki Oludeniz kavşağından başlar ve yaklaşık 1700m'ye tırmanır. Oludeniz plajından sürüş süresi yaklaşık 30-35 dakikadır."],de:["Die Babadağ-Gebirgsstraße beginnt an der Oludeniz-Kreuzung der Hauptstraße D400 und steigt auf ca. 1700m an. Fahrzeit vom Strand: ca. 30-35 Minuten."],ru:["Горная дорога Бабадага начинается от перекрёстка Олюдениз на главной прибрежной дороге D400 и поднимается до примерно 1700м. Время езды от пляжа: около 30-35 минут."], zh: ["巴巴达山公路从 D400 沿海主干道上的厄卢代尼兹路口出发，爬升至约 1700 米。道路为维护良好的柏油路，设有会车点。从厄卢代尼兹海滩出发车程约 30–35 分钟。","自驾前往起飞点的飞行员：请将车停在 1200 米起飞点的指定飞行员停车区。请勿阻挡双人飞行作业区。1700 米区域停车位有限——请早到或使用我们的班车服务。","飞行季期间，道路每天约 07:00 开放。恶劣天气时会关闭，偶尔也会因道路维护而关闭。我们每天早上都会在 WhatsApp 状态和 Instagram 快拍中发布道路状况。"]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Babada\\u011f Road Guide\", \"description\": \"Guide to driving the Babada\\u011f mountain road to the paragliding launch site.\", \"url\": \"https://atmosparagliding.com/babadag-road-guide\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://atmosparagliding.com\"}}" }} />
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
