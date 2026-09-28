import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Summer Thermals Oludeniz",tr:"Oludeniz Yaz Termikleri",de:"Sommer-Thermik Oludeniz",ru:"Летние термики Олюдениз", zh: "厄卢代尼兹夏季热气流"}
  const d = {en:"Understanding thermals in July and August.",tr:"Temmuz ve Ağustos'ta termikleri anlamak.",de:"Thermik im Juli und August verstehen.",ru:"Понимание термиков в июле и августе.", zh: "了解 7 月和 8 月的热气流。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/weather-guide/summer-thermals'),
    openGraph: { url: localeUrl(locale, '/weather-guide/summer-thermals'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'weatherGuide' })
  const titles = {en:"Summer Thermals Oludeniz",tr:"Oludeniz Yaz Termikleri",de:"Sommer-Thermik Oludeniz",ru:"Летние термики Олюдениз", zh: "厄卢代尼兹夏季热气流"}
  const subs = {en:"Understanding thermals in July and August.",tr:"Temmuz ve Ağustos'ta termikleri anlamak.",de:"Thermik im Juli und August verstehen.",ru:"Понимание термиков в июле и августе.", zh: "了解 7 月和 8 月的热气流。"}
  const bodies = {en:["July and August produce the strongest thermals of the year at Babadağ. The high sun angle, long days, and hot land surface create powerful convective lift from late morning onwards. Thermals can reach 4-5 m/s (strong) between 12:00-16:00.","For tandem passengers: summer afternoon thermals can feel bumpy. If you are prone to motion sickness or want a smooth first experience, book a morning slot (before 10:30) or our sunset flight. Morning air is thermally inactive and very smooth.","For solo pilots: summer thermals are the best in the season for XC flying. With strong, reliable lift and low cloud base (typically 2200-2600m), experienced pilots can fly 50-100km routes across the Fethiye region.","Summer flying tip: hydrate well, wear sunscreen, and bring a buff or sun hat for the launch wait. Temperatures at 1200m launch can reach 30°C+."],tr:["Temmuz ve Ağustos, Babadağ'daki yılın en güçlü termiklerini üretir. Tandem yolcular için: sabah slotları (10:30'dan önce) daha pürüzsüzdür.","Solo pilotlar için: yaz termikleri sezondaki XC uçuşu için en iyisidir."],de:["Juli und August produzieren die stärkste Thermik am Babadağ. Für Tandempassagiere: Morgenstarts (vor 10:30) sind glatter. Für Solopiloten: Sommerthermik ist ideal für XC-Fliegen."],ru:["Июль и август дают самые сильные термики на Бабадаге. Для тандемных пассажиров: утренние старты (до 10:30) более плавные. Для соло-пилотов: летние термики идеальны для XC полётов."], zh: ["7 月和 8 月是巴巴达山一年中热气流最强的时候。高太阳角、漫长的白昼和炎热的地表从上午晚些时候开始产生强劲的对流上升气流。12:00–16:00 之间，热气流可达 4–5 米/秒（强）。","致双人飞行乘客：夏季下午的热气流可能会让人感觉颠簸。如果您容易晕动，或希望第一次体验平稳顺畅，请预订上午时段（10:30 之前）或我们的日落飞行。上午的空气没有热气流活动，非常平稳。","致单人飞行员：夏季热气流是全年最适合越野飞行的。凭借强劲可靠的上升气流和较低的云底（通常为 2200–2600 米），经验丰富的飞行员可以在费特希耶地区飞行 50–100 公里的航线。","夏季飞行小贴士：多补充水分，涂抹防晒霜，并带上头巾或遮阳帽以便在起飞点等待。1200 米起飞点的气温可能超过 30°C。"]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Summer Thermals Paragliding Oludeniz\", \"description\": \"Guide to summer thermal conditions for paragliding in Oludeniz during July and August.\", \"url\": \"https://atmosparagliding.com/weather-guide/summer-thermals\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://atmosparagliding.com\"}}" }} />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0a/3Aur6SnimoW0BlFJ4cq8J.jpg" />
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
