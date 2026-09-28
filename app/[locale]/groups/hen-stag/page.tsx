import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'
import ServiceSchema from '@/components/shared/ServiceSchema'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Hen and Stag Party Paragliding",tr:"Bekarlığa Veda Partisi Paraşütü",de:"Junggesellinnen-Abschieds-Paragliding",ru:"Девичник и мальчишник на параплане", zh: "单身派对滑翔伞"}
  const d = {en:"Make your hen or stag party unforgettable with paragliding over the Blue Lagoon.",tr:"Mavi Lagün üzerinde paraşütle bekarlığa veda partinizi unutulmaz kılın.",de:"Machen Sie Ihren Junggesellen-Abschied mit Paragliding über die Blaue Lagune unvergesslich.",ru:"Сделайте девичник или мальчишник незабываемым с парапланеризмом над Голубой Лагуной.", zh: "在蓝色泻湖上空玩滑翔伞，让您的单身派对难以忘怀。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/groups/hen-stag'),
    openGraph: { url: localeUrl(locale, '/groups/hen-stag'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'groups' })
  const titles = {en:"Hen and Stag Party Paragliding",tr:"Bekarlığa Veda Partisi Paraşütü",de:"Junggesellinnen-Abschieds-Paragliding",ru:"Девичник и мальчишник на параплане", zh: "单身派对滑翔伞"}
  const subs = {en:"Make your hen or stag party unforgettable with paragliding over the Blue Lagoon.",tr:"Mavi Lagün üzerinde paraşütle bekarlığa veda partinizi unutulmaz kılın.",de:"Machen Sie Ihren Junggesellen-Abschied mit Paragliding über die Blaue Lagune unvergesslich.",ru:"Сделайте девичник или мальчишник незабываемым с парапланеризмом над Голубой Лагуной.", zh: "在蓝色泻湖上空玩滑翔伞，让您的单身派对难以忘怀。"}
  const bodies = {en:["Paragliding is one of the most talked-about hen and stag party activities in Oludeniz. Groups of 4-20 can fly on the same day with our coordinated group booking service.","We launch participants in succession from the same point so the group can watch and cheer each person take off. Photos and video packages are available for the full group.","We work with local accommodation, restaurants, and activity providers to create complete hen or stag day packages. Ask about our full-day coordination service.","Book at least 3-5 days in advance for groups of 6+. In peak summer season, book 1-2 weeks ahead. Contact us on WhatsApp for the fastest response: +90 536 461 6674."],tr:["Paraşüt, Oludeniz'deki en çok konuşulan bekarlığa veda partisi aktivitelerinden biridir. 4-20 kişilik gruplar aynı gün uçabilir.","Zirve yaz sezonunda 1-2 hafta önceden rezervasyon yapın. WhatsApp: +90 536 461 6674"],de:["Paragliding ist eine der beliebtesten Junggesellen-Abschied-Aktivitäten in Oludeniz. Gruppen von 4-20 können am selben Tag fliegen. WhatsApp: +90 536 461 6674"],ru:["Парапланеризм — одна из самых популярных активностей для девичников и мальчишников в Олюдениз. Группы 4-20 человек могут летать в один день. WhatsApp: +90 536 461 6674"], zh: ["滑翔伞是厄卢代尼兹最受热议的单身派对活动之一。通过我们的团体协调预订服务，4–20 人的团体可以在同一天飞行。","我们让参与者从同一地点依次起飞，这样整个团队都可以观看并为每个人的起飞欢呼。全团都可以选购照片和视频套餐。","我们与当地的住宿、餐厅和活动供应商合作，打造完整的单身派对一日套餐。欢迎咨询我们的全天协调服务。","6 人以上的团体请至少提前 3–5 天预订。夏季旺季请提前 1–2 周预订。通过 WhatsApp 联系我们可获得最快回复：+90 536 461 6674。"]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <ServiceSchema name="Hen and Stag Paragliding Oludeniz" description="Paragliding experiences for hen and stag parties in Oludeniz, Turkey." path="/groups/hen-stag" serviceType="Tandem Paragliding Flight" />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c09/2htlcwkJ6pcLBY7gPtf7z.jpg" />
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
