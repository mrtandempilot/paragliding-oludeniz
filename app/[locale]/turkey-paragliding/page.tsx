import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Paragliding Turkey — Best Sites Guide",tr:"Türkiye Paraşüt — En İyi Yerler Rehberi",de:"Paragliding Türkei — Bester Standortführer",ru:"Парапланеризм Турция — Лучшие места", zh: "土耳其滑翔伞——最佳场地指南"}
  const d = {en:"Turkey has incredible paragliding. Oludeniz is the best.",tr:"Türkiye'de inanılmaz paraşüt yerleri var. Oludeniz en iyisi.",de:"Die Türkei hat unglaubliches Paragliding. Oludeniz ist das Beste.",ru:"Турция предлагает невероятный парапланеризм. Олюдениз — лучшее место.", zh: "土耳其的滑翔伞令人惊叹。厄卢代尼兹是其中最好的。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/turkey-paragliding'),
    openGraph: { url: localeUrl(locale, '/turkey-paragliding'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'turkey' })
  const titles = {en:"Paragliding Turkey — Best Sites Guide",tr:"Türkiye Paraşüt — En İyi Yerler Rehberi",de:"Paragliding Türkei — Bester Standortführer",ru:"Парапланеризм Турция — Лучшие места", zh: "土耳其滑翔伞——最佳场地指南"}
  const subs = {en:"Turkey has incredible paragliding. Oludeniz is the best.",tr:"Türkiye'de inanılmaz paraşüt yerleri var. Oludeniz en iyisi.",de:"Die Türkei hat unglaubliches Paragliding. Oludeniz ist das Beste.",ru:"Турция предлагает невероятный парапланеризм. Олюдениз — лучшее место.", zh: "土耳其的滑翔伞令人惊叹。厄卢代尼兹是其中最好的。"}
  const bodies = {en:["Turkey has emerged as one of the world's premier paragliding destinations, and Oludeniz consistently tops the rankings. With 300+ flyable days per year, world-class infrastructure, and the most photographed scenery in the sport, it draws pilots and passengers from over 60 countries every season.","Other notable Turkish paragliding sites include Antalya (Taurus Mountains), Sarikaya, Kazdaglari, and Bozburun. However, none combine the altitude, reliability, scenery, and infrastructure of Babadağ and Oludeniz.","The Turkish paragliding scene is world-class. The annual Oludeniz Air Games attract elite XC and acro pilots from around the world, and the site hosts multiple World Cup events.","If you are planning a paragliding trip to Turkey, Oludeniz should be your first and primary destination. Combine it with a stay in Fethiye (15 minutes away) or Oludeniz village for the perfect trip."],tr:["Türkiye, dünyanın önde gelen paraşüt destinasyonlarından biri olarak öne çıkmaktadır ve Oludeniz listelerin başında yer almaktadır. Yılda 300'den fazla uçuş günü ve 60'tan fazla ülkeden ziyaretçi çekmektedir.","Türkiye'ye paraşüt gezisi planlıyorsanız, Oludeniz ilk ve ana destinasyonunuz olmalıdır."],de:["Die Türkei hat sich zu einem der weltbesten Paragliding-Ziele entwickelt, und Oludeniz führt die Rankings an. Mit 300+ Flugtagen pro Jahr und Besuchern aus über 60 Ländern ist es einzigartig."],ru:["Турция стала одним из ведущих направлений для парапланеризма в мире, а Олюдениз неизменно возглавляет рейтинги. С 300+ лётными днями в год и гостями из 60+ стран — это уникальное место."], zh: ["土耳其已成为世界顶级的滑翔伞目的地之一，而厄卢代尼兹始终名列前茅。这里每年有 300 多个可飞行日，拥有世界级的基础设施，以及这项运动中被拍摄最多的风景，每个飞行季都吸引着来自 60 多个国家的飞行员和乘客。","土耳其其他著名的滑翔伞场地包括安塔利亚（托罗斯山脉）、萨勒卡亚（Sarıkaya）、卡兹山（Kazdağları）和博兹布伦（Bozburun）。然而，没有一个地方能像巴巴达山和厄卢代尼兹一样，将高度、可靠性、风景和基础设施完美结合。","土耳其的滑翔伞运动水平世界一流。一年一度的厄卢代尼兹航空节吸引着来自世界各地的精英越野和特技飞行员，这里还举办过多站世界杯赛事。","如果您计划去土耳其玩滑翔伞，厄卢代尼兹应该是您的首选目的地。搭配入住费特希耶（15 分钟车程）或厄卢代尼兹村，就是一次完美的旅行。"]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Paragliding in Turkey \\u2014 Complete Guide\", \"description\": \"Complete guide to paragliding in Turkey \\u2014 best sites, seasons and what to expect.\", \"url\": \"https://atmosparagliding.com/turkey-paragliding\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://atmosparagliding.com\"}}" }} />
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
