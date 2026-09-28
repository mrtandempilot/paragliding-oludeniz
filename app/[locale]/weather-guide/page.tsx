import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Paragliding Weather Guide Oludeniz",tr:"Oludeniz Paraşüt Hava Rehberi",de:"Paragliding-Wetterführer Oludeniz",ru:"Погодный гид парапланеризма Олюдениз", zh: "厄卢代尼兹滑翔伞天气指南"}
  const d = {en:"Understanding flying conditions at Babadağ.",tr:"Babadağ uçuş koşullarını anlamak.",de:"Die Flugbedingungen am Babadağ verstehen.",ru:"Понимание условий полётов на Бабадаге.", zh: "了解巴巴达山的飞行条件。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/weather-guide'),
    openGraph: { url: localeUrl(locale, '/weather-guide'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'weatherGuide' })
  const titles = {en:"Paragliding Weather Guide Oludeniz",tr:"Oludeniz Paraşüt Hava Rehberi",de:"Paragliding-Wetterführer Oludeniz",ru:"Погодный гид парапланеризма Олюдениз", zh: "厄卢代尼兹滑翔伞天气指南"}
  const subs = {en:"Understanding flying conditions at Babadağ.",tr:"Babadağ uçuş koşullarını anlamak.",de:"Die Flugbedingungen am Babadağ verstehen.",ru:"Понимание условий полётов на Бабадаге.", zh: "了解巴巴达山的飞行条件。"}
  const bodies = {en:["Oludeniz enjoys one of the best microclimates for paragliding in the world. The mountains surrounding the bay block cold northerly winds, the Aegean produces consistent sea breezes, and the limestone terrain generates reliable thermals from April to October.","Wind: the ideal wind for tandem flying is light north-westerly at 5-15 km/h. We monitor conditions at three stations — beach level, 1200m, and 1960m. Thermals: build from about 10:00 and peak between 12:00-15:00. Morning flying (08:00-10:00) is smoother and suitable for those nervous about turbulence.","The flying season runs from April to October. November to March sees stronger winds and less predictable conditions — we fly on good days but it is not reliable enough for planned holidays."],tr:["Oludeniz, dünyanın en iyi paraşüt mikroklimaslarından birine sahiptir. Tandem uçuş için ideal rüzgar saatte 5-15 km hafif kuzey-batı rüzgarıdır. Uçuş sezonu Nisan'dan Ekim'e kadar sürer."],de:["Oludeniz hat eines der besten Mikroklimas für Paragliding der Welt. Der ideale Wind für Tandemfliegen beträgt 5-15 km/h aus Nordwest. Die Flugsaison läuft von April bis Oktober."],ru:["Олюдениз имеет один из лучших микроклиматов для парапланеризма в мире. Идеальный ветер для тандемных полётов — 5-15 км/ч северо-западный. Сезон полётов с апреля по октябрь."], zh: ["厄卢代尼兹拥有世界上最适合滑翔伞运动的小气候之一。环绕海湾的群山阻挡了寒冷的北风，爱琴海带来稳定的海风，石灰岩地形在 4 月至 10 月间产生可靠的热气流。","风：双人飞行的理想风况是 5–15 公里/小时的微弱西北风。我们在三个站点监测天气——海滩、1200 米和 1960 米。热气流：约 10:00 开始形成，12:00–15:00 达到高峰。上午飞行（08:00–10:00）更平稳，适合担心颠簸的人。","飞行季为 4 月至 10 月。11 月至次年 3 月风力较强，条件难以预测——天气好的日子我们也会飞，但不足以可靠地安排假期计划。"]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Weather Guide for Paragliding Oludeniz\", \"description\": \"Complete weather guide for paragliding in Oludeniz \\u2014 wind, thermals and seasonal conditions.\", \"url\": \"https://atmosparagliding.com/weather-guide\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://atmosparagliding.com\"}}" }} />
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
