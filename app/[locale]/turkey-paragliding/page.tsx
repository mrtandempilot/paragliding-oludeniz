import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Paragliding Turkey — Best Sites Guide",tr:"Türkiye Paraşüt — En İyi Yerler Rehberi",de:"Paragliding Türkei — Bester Standortführer",ru:"Парапланеризм Турция — Лучшие места"}
  return { title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'turkey' })
  const titles = {en:"Paragliding Turkey — Best Sites Guide",tr:"Türkiye Paraşüt — En İyi Yerler Rehberi",de:"Paragliding Türkei — Bester Standortführer",ru:"Парапланеризм Турция — Лучшие места"}
  const subs = {en:"Turkey has incredible paragliding. Oludeniz is the best.",tr:"Türkiye'de inanılmaz paraşüt yerleri var. Oludeniz en iyisi.",de:"Die Türkei hat unglaubliches Paragliding. Oludeniz ist das Beste.",ru:"Турция предлагает невероятный парапланеризм. Олюдениз — лучшее место."}
  const bodies = {en:["Turkey has emerged as one of the world's premier paragliding destinations, and Oludeniz consistently tops the rankings. With 300+ flyable days per year, world-class infrastructure, and the most photographed scenery in the sport, it draws pilots and passengers from over 60 countries every season.","Other notable Turkish paragliding sites include Antalya (Taurus Mountains), Sarikaya, Kazdaglari, and Bozburun. However, none combine the altitude, reliability, scenery, and infrastructure of Babadağ and Oludeniz.","The Turkish paragliding scene is world-class. The annual Oludeniz Air Games attract elite XC and acro pilots from around the world, and the site hosts multiple World Cup events.","If you are planning a paragliding trip to Turkey, Oludeniz should be your first and primary destination. Combine it with a stay in Fethiye (15 minutes away) or Oludeniz village for the perfect trip."],tr:["Türkiye, dünyanın önde gelen paraşüt destinasyonlarından biri olarak öne çıkmaktadır ve Oludeniz listelerin başında yer almaktadır. Yılda 300'den fazla uçuş günü ve 60'tan fazla ülkeden ziyaretçi çekmektedir.","Türkiye'ye paraşüt gezisi planlıyorsanız, Oludeniz ilk ve ana destinasyonunuz olmalıdır."],de:["Die Türkei hat sich zu einem der weltbesten Paragliding-Ziele entwickelt, und Oludeniz führt die Rankings an. Mit 300+ Flugtagen pro Jahr und Besuchern aus über 60 Ländern ist es einzigartig."],ru:["Турция стала одним из ведущих направлений для парапланеризма в мире, а Олюдениз неизменно возглавляет рейтинги. С 300+ лётными днями в год и гостями из 60+ стран — это уникальное место."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
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
