import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'
import ServiceSchema from '@/components/shared/ServiceSchema'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Radio Hire",tr:"Telsiz Kiralama",de:"Funkvermietung",ru:"Аренда радиостанции", zh: "对讲机租赁"}
  const d = {en:"Professional services for licensed paragliding pilots visiting Oludeniz.",tr:"Oludeniz'i ziyaret eden lisanslı paraşüt pilotları için profesyonel hizmetler.",de:"Professionelle Dienste für lizenzierte Paragliding-Piloten, die Oludeniz besuchen.",ru:"Профессиональные услуги для лицензированных пилотов, посещающих Олюдениз.", zh: "为来厄卢代尼兹的持证滑翔伞飞行员提供的专业服务。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/pilot-services/radio-hire'),
    openGraph: { url: localeUrl(locale, '/pilot-services/radio-hire'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'pilotServices' })
  const titles = {en:"Radio Hire",tr:"Telsiz Kiralama",de:"Funkvermietung",ru:"Аренда радиостанции", zh: "对讲机租赁"}
  const subs = {en:"Professional services for licensed paragliding pilots visiting Oludeniz.",tr:"Oludeniz'i ziyaret eden lisanslı paraşüt pilotları için profesyonel hizmetler.",de:"Professionelle Dienste für lizenzierte Paragliding-Piloten, die Oludeniz besuchen.",ru:"Профессиональные услуги для лицензированных пилотов, посещающих Олюдениз.", zh: "为来厄卢代尼兹的持证滑翔伞飞行员提供的专业服务。"}
  const bodies = {en:["We hire VHF radios pre-programmed with the Babadağ launch and retrieve frequencies. Essential for pilots unfamiliar with the local area. Includes a full frequency briefing and emergency protocol card.","Contact us at +90 536 461 6674 or visit our office on Oludeniz beach."],tr:["Babadağ kalkış ve geri alma frekanslarıyla önceden programlanmış VHF telsiz kiralıyoruz.","Oludeniz plajındaki ofisimizi ziyaret edin veya +90 536 461 6674 numaralı telefonu arayın."],de:["We hire VHF radios pre-programmed with the Babadağ launch and retrieve frequencies. Essential for pilots unfamiliar with the local area. Includes a full frequency briefing and emergency protocol card.","Besuchen Sie unser Büro am Oludeniz-Strand oder rufen Sie uns an: +90 536 461 6674."],ru:["We hire VHF radios pre-programmed with the Babadağ launch and retrieve frequencies. Essential for pilots unfamiliar with the local area. Includes a full frequency briefing and emergency protocol card.","Посетите наш офис на пляже Олюдениз или позвоните нам: +90 536 461 6674."], zh: ["我们出租已预设巴巴达山起飞和回收频率的 VHF 对讲机。对于不熟悉当地的飞行员来说必不可少。包含完整的频率简报和紧急程序卡。","请致电 +90 536 461 6674 联系我们，或前往我们位于厄卢代尼兹海滩的办公室。"]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <ServiceSchema name="Paragliding Radio Hire Oludeniz" description="Radio hire for paragliding pilots flying in Oludeniz and Babadağ." path="/pilot-services/radio-hire" serviceType="Paragliding Equipment Rental" />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c13/VVJ_THDhVNeRP66pu_Ew8.jpg" />
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
