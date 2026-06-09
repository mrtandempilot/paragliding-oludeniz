import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Meteorology Briefings",tr:"Meteoroloji Brifingleri",de:"Meteorologie-Briefings",ru:"Метеорологические брифинги"}
  return { title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'pilotServices' })
  const titles = {en:"Meteorology Briefings",tr:"Meteoroloji Brifingleri",de:"Meteorologie-Briefings",ru:"Метеорологические брифинги"}
  const subs = {en:"Professional services for licensed paragliding pilots visiting Oludeniz.",tr:"Oludeniz'i ziyaret eden lisanslı paraşüt pilotları için profesyonel hizmetler.",de:"Professionelle Dienste für lizenzierte Paragliding-Piloten, die Oludeniz besuchen.",ru:"Профессиональные услуги для лицензированных пилотов, посещающих Олюдениз."}
  const bodies = {en:["We offer daily 07:30 meteorology briefings for visiting pilots covering: synoptic situation, forecast wind at all altitudes, cloudbase forecast, thermal forecast, and go/no-go recommendation. Briefings are available in English and Turkish.","Contact us at +90 536 461 6674 or visit our office on Oludeniz beach."],tr:["Ziyaretçi pilotlar için günlük 07:30 meteoroloji brifingleri sunuyoruz.","Oludeniz plajındaki ofisimizi ziyaret edin veya +90 536 461 6674 numaralı telefonu arayın."],de:["We offer daily 07:30 meteorology briefings for visiting pilots covering: synoptic situation, forecast wind at all altitudes, cloudbase forecast, thermal forecast, and go/no-go recommendation. Briefings are available in English and Turkish.","Besuchen Sie unser Büro am Oludeniz-Strand oder rufen Sie uns an: +90 536 461 6674."],ru:["We offer daily 07:30 meteorology briefings for visiting pilots covering: synoptic situation, forecast wind at all altitudes, cloudbase forecast, thermal forecast, and go/no-go recommendation. Briefings are available in English and Turkish.","Посетите наш офис на пляже Олюдениз или позвоните нам: +90 536 461 6674."]}
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
