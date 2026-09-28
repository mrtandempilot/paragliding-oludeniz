import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'
import ServiceSchema from '@/components/shared/ServiceSchema'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Retrieve Service",tr:"Geri Alma Hizmeti",de:"Abholservice",ru:"Услуга подбора", zh: "回收服务"}
  const d = {en:"Professional services for licensed paragliding pilots visiting Oludeniz.",tr:"Oludeniz'i ziyaret eden lisanslı paraşüt pilotları için profesyonel hizmetler.",de:"Professionelle Dienste für lizenzierte Paragliding-Piloten, die Oludeniz besuchen.",ru:"Профессиональные услуги для лицензированных пилотов, посещающих Олюдениз.", zh: "为来厄卢代尼兹的持证滑翔伞飞行员提供的专业服务。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/pilot-services/retrieval'),
    openGraph: { url: localeUrl(locale, '/pilot-services/retrieval'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'pilotServices' })
  const titles = {en:"Retrieve Service",tr:"Geri Alma Hizmeti",de:"Abholservice",ru:"Услуга подбора", zh: "回收服务"}
  const subs = {en:"Professional services for licensed paragliding pilots visiting Oludeniz.",tr:"Oludeniz'i ziyaret eden lisanslı paraşüt pilotları için profesyonel hizmetler.",de:"Professionelle Dienste für lizenzierte Paragliding-Piloten, die Oludeniz besuchen.",ru:"Профессиональные услуги для лицензированных пилотов, посещающих Олюдениз.", zh: "为来厄卢代尼兹的持证滑翔伞飞行员提供的专业服务。"}
  const bodies = {en:["Our retrieve vehicle covers Oludeniz, Fethiye, Calis, Gocek, and surrounding areas. Pre-book your retrieve before launch so we know your planned route and landing options. We track WhatsApp location sharing during your flight.","Contact us at +90 536 461 6674 or visit our office on Oludeniz beach."],tr:["Geri alma aracımız Oludeniz, Fethiye, Calis, Gocek ve çevre alanları kapsar.","Oludeniz plajındaki ofisimizi ziyaret edin veya +90 536 461 6674 numaralı telefonu arayın."],de:["Our retrieve vehicle covers Oludeniz, Fethiye, Calis, Gocek, and surrounding areas. Pre-book your retrieve before launch so we know your planned route and landing options. We track WhatsApp location sharing during your flight.","Besuchen Sie unser Büro am Oludeniz-Strand oder rufen Sie uns an: +90 536 461 6674."],ru:["Our retrieve vehicle covers Oludeniz, Fethiye, Calis, Gocek, and surrounding areas. Pre-book your retrieve before launch so we know your planned route and landing options. We track WhatsApp location sharing during your flight.","Посетите наш офис на пляже Олюдениз или позвоните нам: +90 536 461 6674."], zh: ["我们的回收车辆覆盖厄卢代尼兹、费特希耶、恰勒什、格奇克及周边地区。请在起飞前预订回收服务，以便我们了解您计划的航线和降落选项。飞行期间我们会通过 WhatsApp 位置共享追踪您的位置。","请致电 +90 536 461 6674 联系我们，或前往我们位于厄卢代尼兹海滩的办公室。"]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <ServiceSchema name="Paragliding Retrieval Service Oludeniz" description="Safe and efficient retrieval service for paragliding pilots landing away from Oludeniz." path="/pilot-services/retrieval" serviceType="Paragliding Retrieval Service" />
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
