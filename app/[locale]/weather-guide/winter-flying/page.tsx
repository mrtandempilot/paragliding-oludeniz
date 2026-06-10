import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Winter Flying Oludeniz",tr:"Oludeniz Kış Uçuşu",de:"Winterfliegen Oludeniz",ru:"Зимние полёты в Олюдениз"}
  return {
    alternates: localeAlternates(locale, '/weather-guide/winter-flying'), title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'weatherGuide' })
  const titles = {en:"Winter Flying Oludeniz",tr:"Oludeniz Kış Uçuşu",de:"Winterfliegen Oludeniz",ru:"Зимние полёты в Олюдениз"}
  const subs = {en:"November to March: what to expect for pilots visiting off-season.",tr:"Kasım'dan Mart'a: sezon dışı ziyaret eden pilotlar için beklentiler.",de:"November bis März: Was Piloten außerhalb der Saison erwartet.",ru:"С ноября по март: чего ожидать пилотам вне сезона."}
  const bodies = {en:["Oludeniz can be flown year-round, but conditions are inconsistent from November to March. Good flying days do occur — sometimes excellent XC days with strong thermals and clear skies — but they cannot be relied upon for planned trips.","Winter brings more northerly winds, which can be strong and gusty on Babadağ. Low cloud, rain, and fog are more frequent. However, on stable high-pressure days, winter flying is superb: no thermals, smooth laminar air, and the mountains free of summer haze.","If you are visiting in winter: check conditions daily on our WhatsApp status. Bring warm clothes — launch temperature can drop to 5-8°C. We fly on good days for pilots with their own equipment and experience.","We do not operate commercial tandem flights November-March due to unreliable conditions. Contact us if you are a licensed pilot visiting outside the main season."],tr:["Oludeniz yıl boyunca uçulabilir ancak Kasım-Mart arası koşullar tutarsızdır. İyi günler olabilir ancak planlı geziler için güvenilir değildir.","Kasım-Mart arasında ticari tandem uçuşları işletmiyoruz."],de:["Oludeniz kann ganzjährig geflogen werden, aber die Bedingungen sind von November bis März unbeständig. Wir betreiben keine kommerziellen Tandemflüge von November bis März."],ru:["Олюдениз доступен для полётов круглый год, но с ноября по март условия нестабильны. Мы не выполняем коммерческие тандемные полёты с ноября по март."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
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
