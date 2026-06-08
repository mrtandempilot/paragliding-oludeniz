import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Live Weather Oludeniz",tr:"Oludeniz Canli Hava",de:"Live-Wetter Oludeniz",ru:"Погода Олюдениз онлайн"}
  return { title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'liveWeather' })
  const titles = {en:"Live Weather Oludeniz",tr:"Oludeniz Canli Hava",de:"Live-Wetter Oludeniz",ru:"Погода Олюдениз онлайн"}
  const subs = {en:"Current conditions at Babadağ and Oludeniz beach.",tr:"Babadağ ve Oludeniz plajındaki güncel koşullar.",de:"Aktuelle Bedingungen am Babadağ und Oludeniz-Strand.",ru:"Текущие условия на Бабадаге и пляже Олюдениз."}
  const bodies = {en:["Our live weather data is updated every 15 minutes from three stations: Oludeniz beach (5m ASL), 1200m launch, and Babadağ summit (1960m).","Current go/no-go status for tandem flights is posted on our WhatsApp status and Instagram every morning by 08:00. Follow us for real-time updates throughout the day.","Key conditions we monitor: wind speed and direction at all three altitudes, temperature differential (indicates thermal strength), cloudbase height, and visibility. We also receive forecast data from the Turkish Meteorological Service.","If you are a visiting pilot, our daily 07:30 briefing at the office includes full weather analysis for the day. We welcome all pilots to attend."],tr:["Canlı hava verilerimiz üç istasyondan her 15 dakikada bir güncellenir. Go/no-go durumu her sabah 08:00'da WhatsApp durumumuzda ve Instagram'da paylaşılır."],de:["Unsere Live-Wetterdaten werden alle 15 Minuten von drei Stationen aktualisiert. Der Go/No-Go-Status wird täglich um 08:00 auf unserem WhatsApp-Status und Instagram gepostet."],ru:["Наши данные о погоде обновляются каждые 15 минут с трёх станций. Статус go/no-go публикуется каждое утро в 08:00 в нашем WhatsApp-статусе и Instagram."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=85" />
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
