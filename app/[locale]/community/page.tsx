import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Paragliding Community Oludeniz",tr:"Oludeniz Paraşüt Topluluğu",de:"Paragliding-Community Oludeniz",ru:"Сообщество парапланеристов Олюдениз", zh: "厄卢代尼兹滑翔伞社区"}
  const d = {en:"Join one of the world's most vibrant paragliding communities.",tr:"Dünyanın en canlı paraşüt topluluklarından birine katılın.",de:"Treten Sie einer der lebendigsten Paragliding-Communities der Welt bei.",ru:"Присоединяйтесь к одному из самых живых сообществ парапланеристов мира.", zh: "加入世界上最有活力的滑翔伞社区之一。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/community'),
    openGraph: { url: localeUrl(locale, '/community'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'community' })
  const titles = {en:"Paragliding Community Oludeniz",tr:"Oludeniz Paraşüt Topluluğu",de:"Paragliding-Community Oludeniz",ru:"Сообщество парапланеристов Олюдениз", zh: "厄卢代尼兹滑翔伞社区"}
  const subs = {en:"Join one of the world's most vibrant paragliding communities.",tr:"Dünyanın en canlı paraşüt topluluklarından birine katılın.",de:"Treten Sie einer der lebendigsten Paragliding-Communities der Welt bei.",ru:"Присоединяйтесь к одному из самых живых сообществ парапланеристов мира.", zh: "加入世界上最有活力的滑翔伞社区之一。"}
  const bodies = {en:["Oludeniz has one of the most active and welcoming paragliding communities in the world. Pilots from over 60 countries visit every season, from weekend warriors to world champions. The atmosphere on launch is uniquely international — you will meet pilots from Germany, the UK, Russia, Australia, Brazil, and everywhere in between.","The Oludeniz Air Games (held annually in October) is one of the world's premier paragliding events, attracting top XC and acro pilots for a week of competitions, demos, and social flying.","Year-round, the Oludeniz flying community gathers at the launch, at the beach bar, and at the weekly pilot meetups. Whether you are a student on your first hill soar or a competition XC pilot, you will find your people here.","Follow us on Instagram and Facebook for daily conditions reports, flight videos, and community news."],tr:["Oludeniz, dünyanın en aktif ve sıcak paraşüt topluluklarından birine sahiptir. Her sezon 60'tan fazla ülkeden pilot ziyaret eder.","Yıllık Oludeniz Air Games (Ekim ayında düzenlenir) dünya genelinde en önemli paraşüt etkinliklerinden biridir."],de:["Oludeniz hat eine der aktivsten und einladendsten Paragliding-Communities der Welt. Piloten aus über 60 Ländern besuchen jede Saison.","Die jährlichen Oludeniz Air Games (im Oktober) sind eines der weltweit bedeutendsten Paragliding-Events."],ru:["Олюдениз имеет одно из самых активных и гостеприимных сообществ парапланеристов в мире. Пилоты из 60+ стран приезжают каждый сезон.","Ежегодные Oludeniz Air Games (в октябре) — одно из ведущих мировых событий парапланеризма."], zh: ["厄卢代尼兹拥有世界上最活跃、最热情的滑翔伞社区之一。每个飞行季都有来自 60 多个国家的飞行员到访，从周末爱好者到世界冠军应有尽有。起飞点的氛围独具国际特色——您会遇到来自德国、英国、俄罗斯、澳大利亚、巴西以及世界各地的飞行员。","厄卢代尼兹航空节（每年 10 月举办）是世界顶级的滑翔伞盛会之一，吸引顶尖的越野和特技飞行员参加为期一周的比赛、表演和社交飞行。","一年四季，厄卢代尼兹的飞行社区都会在起飞点、海滩酒吧以及每周的飞行员聚会上相聚。无论您是第一次尝试山坡滑翔的学员，还是参加比赛的越野飞行员，都能在这里找到志同道合的伙伴。","在 Instagram 和 Facebook 上关注我们，获取每日天气报告、飞行视频和社区新闻。"]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Paragliding Community Oludeniz\", \"description\": \"The paragliding community in Oludeniz \\u2014 pilots, events and local knowledge.\", \"url\": \"https://atmosparagliding.com/community\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://atmosparagliding.com\"}}" }} />
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
