import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"GoPro Video Service",tr:"GoPro Video Hizmeti",de:"GoPro-Video-Service",ru:"Видеосъёмка GoPro"}
  const d = {en:"Professional services for licensed paragliding pilots visiting Oludeniz.",tr:"Oludeniz'i ziyaret eden lisanslı paraşüt pilotları için profesyonel hizmetler.",de:"Professionelle Dienste für lizenzierte Paragliding-Piloten, die Oludeniz besuchen.",ru:"Профессиональные услуги для лицензированных пилотов, посещающих Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/pilot-services/gopro-video'),
    openGraph: { url: localeAlternates(locale, '/pilot-services/gopro-video').canonical! }, title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'pilotServices' })
  const titles = {en:"GoPro Video Service",tr:"GoPro Video Hizmeti",de:"GoPro-Video-Service",ru:"Видеосъёмка GoPro"}
  const subs = {en:"Professional services for licensed paragliding pilots visiting Oludeniz.",tr:"Oludeniz'i ziyaret eden lisanslı paraşüt pilotları için profesyonel hizmetler.",de:"Professionelle Dienste für lizenzierte Paragliding-Piloten, die Oludeniz besuchen.",ru:"Профессиональные услуги для лицензированных пилотов, посещающих Олюдениз."}
  const bodies = {en:["We fit GoPro cameras to your harness or helmet for self-shot flight videos. Camera hire includes a full charge, 64GB card, and post-flight download to your phone or USB. Available for both solo pilots and tandem passengers.","Contact us at +90 536 461 6674 or visit our office on Oludeniz beach."],tr:["Uçuş videoları için kaskınıza veya koşum takımınıza GoPro kamera takıyoruz.","Oludeniz plajındaki ofisimizi ziyaret edin veya +90 536 461 6674 numaralı telefonu arayın."],de:["We fit GoPro cameras to your harness or helmet for self-shot flight videos. Camera hire includes a full charge, 64GB card, and post-flight download to your phone or USB. Available for both solo pilots and tandem passengers.","Besuchen Sie unser Büro am Oludeniz-Strand oder rufen Sie uns an: +90 536 461 6674."],ru:["We fit GoPro cameras to your harness or helmet for self-shot flight videos. Camera hire includes a full charge, 64GB card, and post-flight download to your phone or USB. Available for both solo pilots and tandem passengers.","Посетите наш офис на пляже Олюдениз или позвоните нам: +90 536 461 6674."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
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
