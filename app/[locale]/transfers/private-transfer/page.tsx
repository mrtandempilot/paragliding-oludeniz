import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'
import ServiceSchema from '@/components/shared/ServiceSchema'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Private Transfer Service",tr:"Ozel Transfer Hizmeti",de:"Private Transfer Service",ru:"Private Transfer Service", zh: "私人接送服务"}
  const d = {en:"Transfer services to and from Oludeniz.",tr:"Oludeniz'e ve oradan transfer hizmetleri.",de:"Transferdienste nach und von Oludeniz.",ru:"Трансферные услуги в Олюдениз и обратно.", zh: "往返厄卢代尼兹的接送服务。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/transfers/private-transfer'),
    openGraph: { url: localeUrl(locale, '/transfers/private-transfer'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'transfers' })
  const titles = {en:"Private Transfer Service",tr:"Ozel Transfer Hizmeti",de:"Private Transfer Service",ru:"Private Transfer Service", zh: "私人接送服务"}
  const subs = {en:"Transfer services to and from Oludeniz.",tr:"Oludeniz'e ve oradan transfer hizmetleri.",de:"Transferdienste nach und von Oludeniz.",ru:"Трансферные услуги в Олюдениз и обратно.", zh: "往返厄卢代尼兹的接送服务。"}
  const bodies = {en:["We offer private transfer services from Dalaman Airport, Fethiye, Marmaris, Bodrum, and other regional centres to Oludeniz. Air-conditioned vehicles, English-speaking drivers, flight tracking for airport pickups.","Contact us to arrange: WhatsApp +90 536 461 6674"],tr:["Dalaman Havalimanı, Fethiye, Marmaris, Bodrum ve diğer bölgesel merkezlerden Oludeniz'e özel transfer hizmeti sunuyoruz.","Düzenlemek için bize ulaşın: WhatsApp +90 536 461 6674"],de:["We offer private transfer services from Dalaman Airport, Fethiye, Marmaris, Bodrum, and other regional centres to Oludeniz. Air-conditioned vehicles, English-speaking drivers, flight tracking for airport pickups.","Kontaktieren Sie uns: WhatsApp +90 536 461 6674"],ru:["We offer private transfer services from Dalaman Airport, Fethiye, Marmaris, Bodrum, and other regional centres to Oludeniz. Air-conditioned vehicles, English-speaking drivers, flight tracking for airport pickups.","Свяжитесь с нами: WhatsApp +90 536 461 6674"], zh: ["我们提供从达拉曼机场、费特希耶、马尔马里斯、博德鲁姆及其他地区中心前往厄卢代尼兹的私人接送服务。空调车辆、会说英语的司机，机场接机时实时追踪航班。","联系我们安排：WhatsApp +90 536 461 6674"]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <ServiceSchema name="Private Transfer to Paragliding Oludeniz" description="Private transfer service to Oludeniz for your tandem paragliding experience." path="/transfers/private-transfer" serviceType="Transfer Service" />
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
