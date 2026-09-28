import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'
import ServiceSchema from '@/components/shared/ServiceSchema'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Insurance & Permissions for Solo Pilots",tr:"Solo Pilotlar İçin Sigorta ve İzinler",de:"Versicherung und Genehmigungen für Solopiloten",ru:"Страховка и разрешения для соло-пилотов", zh: "单人飞行员的保险与许可"}
  const d = {en:"What insurance and permissions you need to fly at Oludeniz.",tr:"Oludeniz'de uçmak için ihtiyacınız olan sigorta ve izinler.",de:"Welche Versicherung und Genehmigungen Sie für Oludeniz benötigen.",ru:"Какая страховка и разрешения нужны для полётов в Олюдениз.", zh: "在厄卢代尼兹飞行需要哪些保险和许可。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/solo-paragliding/insurance-permissions'),
    openGraph: { url: localeUrl(locale, '/solo-paragliding/insurance-permissions'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'solo' })
  const titles = {en:"Insurance & Permissions for Solo Pilots",tr:"Solo Pilotlar İçin Sigorta ve İzinler",de:"Versicherung und Genehmigungen für Solopiloten",ru:"Страховка и разрешения для соло-пилотов", zh: "单人飞行员的保险与许可"}
  const subs = {en:"What insurance and permissions you need to fly at Oludeniz.",tr:"Oludeniz'de uçmak için ihtiyacınız olan sigorta ve izinler.",de:"Welche Versicherung und Genehmigungen Sie für Oludeniz benötigen.",ru:"Какая страховка и разрешения нужны для полётов в Олюдениз.", zh: "在厄卢代尼兹飞行需要哪些保险和许可。"}
  const bodies = {en:["Third-party liability insurance is mandatory to fly at Babadağ. This covers injury or damage to third parties caused by your paraglider. BHPA and DHV memberships both include this cover when flying in Turkey.","If your national association membership does not provide liability cover outside your home country, you will need a standalone paragliding insurance policy. We can recommend insurers on request.","No prior permission is required to fly at Babadağ as a licensed pilot — present your licence and insurance at our desk and collect your briefing pack. Flying without a valid licence and insurance is strictly prohibited.","Commercial operations (filming, advertising flights, tandem flights) require SHGM commercial permits. Contact us if you need assistance with commercial permit applications."],tr:["Babadağ'da uçmak için üçüncü şahıs sorumluluk sigortası zorunludur. BHPA ve DHV üyelikleri Türkiye'de uçarken bu kapsamı içerir."],de:["Haftpflichtversicherung ist am Babadağ Pflicht. BHPA- und DHV-Mitgliedschaften beinhalten diese Deckung beim Fliegen in der Türkei."],ru:["Страхование гражданской ответственности обязательно для полётов на Бабадаге. Членство в BHPA и DHV включает эту страховку при полётах в Турции."], zh: ["在巴巴达山飞行必须购买第三方责任险。该保险涵盖您的滑翔伞对第三方造成的伤害或损失。BHPA 和 DHV 会员资格在土耳其飞行时均包含此项保障。","如果您所在国家协会的会员资格不提供本国以外的责任险，您需要购买单独的滑翔伞保险。我们可应要求推荐保险公司。","持证飞行员在巴巴达山飞行无需事先许可——只需在我们的服务台出示执照和保险，并领取简报资料包即可。严禁在没有有效执照和保险的情况下飞行。","商业运营（拍摄、广告飞行、双人飞行）需要土耳其民航总局（SHGM）的商业许可。如需协助申请商业许可，请联系我们。"]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <ServiceSchema name="Solo Paragliding Insurance Oludeniz" description="Insurance and permission requirements for solo paragliding pilots in Turkey." path="/solo-paragliding/insurance-permissions" serviceType="Paragliding Service" />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0d/dOEuj7ebfM-MdyvUcunPD.jpg" />
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
