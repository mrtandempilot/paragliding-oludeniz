import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Winter Flying Oludeniz",tr:"Oludeniz Kış Uçuşu",de:"Winterfliegen Oludeniz",ru:"Зимние полёты в Олюдениз", zh: "厄卢代尼兹冬季飞行"}
  const d = {en:"November to March: what to expect for pilots visiting off-season.",tr:"Kasım'dan Mart'a: sezon dışı ziyaret eden pilotlar için beklentiler.",de:"November bis März: Was Piloten außerhalb der Saison erwartet.",ru:"С ноября по март: чего ожидать пилотам вне сезона.", zh: "11 月至次年 3 月：淡季来访的飞行员可以期待什么。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/weather-guide/winter-flying'),
    openGraph: { url: localeUrl(locale, '/weather-guide/winter-flying'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'weatherGuide' })
  const titles = {en:"Winter Flying Oludeniz",tr:"Oludeniz Kış Uçuşu",de:"Winterfliegen Oludeniz",ru:"Зимние полёты в Олюдениз", zh: "厄卢代尼兹冬季飞行"}
  const subs = {en:"November to March: what to expect for pilots visiting off-season.",tr:"Kasım'dan Mart'a: sezon dışı ziyaret eden pilotlar için beklentiler.",de:"November bis März: Was Piloten außerhalb der Saison erwartet.",ru:"С ноября по март: чего ожидать пилотам вне сезона.", zh: "11 月至次年 3 月：淡季来访的飞行员可以期待什么。"}
  const bodies = {en:["Oludeniz can be flown year-round, but conditions are inconsistent from November to March. Good flying days do occur — sometimes excellent XC days with strong thermals and clear skies — but they cannot be relied upon for planned trips.","Winter brings more northerly winds, which can be strong and gusty on Babadağ. Low cloud, rain, and fog are more frequent. However, on stable high-pressure days, winter flying is superb: no thermals, smooth laminar air, and the mountains free of summer haze.","If you are visiting in winter: check conditions daily on our WhatsApp status. Bring warm clothes — launch temperature can drop to 5-8°C. We fly on good days for pilots with their own equipment and experience.","We do not operate commercial tandem flights November-March due to unreliable conditions. Contact us if you are a licensed pilot visiting outside the main season."],tr:["Oludeniz yıl boyunca uçulabilir ancak Kasım-Mart arası koşullar tutarsızdır. İyi günler olabilir ancak planlı geziler için güvenilir değildir.","Kasım-Mart arasında ticari tandem uçuşları işletmiyoruz."],de:["Oludeniz kann ganzjährig geflogen werden, aber die Bedingungen sind von November bis März unbeständig. Wir betreiben keine kommerziellen Tandemflüge von November bis März."],ru:["Олюдениз доступен для полётов круглый год, но с ноября по март условия нестабильны. Мы не выполняем коммерческие тандемные полёты с ноября по март."], zh: ["厄卢代尼兹全年都可以飞行，但 11 月至次年 3 月的条件不稳定。确实会有适合飞行的好日子——有时甚至是热气流强劲、天空晴朗的绝佳越野日——但无法据此安排计划中的行程。","冬季北风较多，在巴巴达山上可能强劲且多阵风。低云、雨和雾也更为频繁。不过，在稳定的高压天气里，冬季飞行非常棒：没有热气流，空气平稳呈层流状态，山峦也没有夏季的雾霾。","如果您在冬季来访：请每天在我们的 WhatsApp 状态中查看天气条件。请带上保暖衣物——起飞点气温可能降至 5–8°C。天气好的日子，我们会为自带装备且有经验的飞行员安排飞行。","由于条件不稳定，11 月至次年 3 月我们不经营商业双人飞行。如果您是在主飞行季以外来访的持证飞行员，请联系我们。"]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Winter Flying Paragliding Oludeniz\", \"description\": \"Guide to paragliding in Oludeniz during winter months \\u2014 conditions, risks and opportunities.\", \"url\": \"https://atmosparagliding.com/weather-guide/winter-flying\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://atmosparagliding.com\"}}" }} />
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
