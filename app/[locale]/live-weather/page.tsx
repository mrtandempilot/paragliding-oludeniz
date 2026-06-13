import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { getOludenizWeather, weatherCodeLabel, windDirectionCompass } from '@/lib/weather'
import { localeAlternates, localeUrl } from '@/lib/seo'

export const revalidate = 900 // 15 minutes

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Live Weather Oludeniz",tr:"Oludeniz Canli Hava",de:"Live-Wetter Oludeniz",ru:"Погода Олюдениз онлайн"}
  const d = {en:"Current conditions at Babadağ and Oludeniz beach.",tr:"Babadağ ve Oludeniz plajındaki güncel koşullar.",de:"Aktuelle Bedingungen am Babadağ und Oludeniz-Strand.",ru:"Текущие условия на Бабадаге и пляже Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/live-weather'),
    openGraph: { url: localeUrl(locale, '/live-weather'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'liveWeather' })
  const titles = {en:"Live Weather Oludeniz",tr:"Oludeniz Canli Hava",de:"Live-Wetter Oludeniz",ru:"Погода Олюдениз онлайн"}
  const subs = {en:"Current conditions at Babadağ and Oludeniz beach.",tr:"Babadağ ve Oludeniz plajındaki güncel koşullar.",de:"Aktuelle Bedingungen am Babadağ und Oludeniz-Strand.",ru:"Текущие условия на Бабадаге и пляже Олюдениз."}
  const bodies = {en:["Live readings below are pulled directly from open weather models for Ölüdeniz beach, the 1200m take-off, and the Babadağ summit, refreshed every 15 minutes.","Current go/no-go status for tandem flights is posted on our WhatsApp status and Instagram every morning by 08:00. Follow us for real-time updates throughout the day.","Key conditions we monitor: wind speed and direction at all three altitudes, temperature differential (indicates thermal strength), cloudbase height, and visibility. We also receive forecast data from the Turkish Meteorological Service.","If you are a visiting pilot, our daily 07:30 briefing at the office includes full weather analysis for the day. We welcome all pilots to attend."],tr:["Aşağıdaki canlı veriler, Ölüdeniz plajı, 1200m kalkış noktası ve Babadağ zirvesi için açık hava durumu modellerinden alınır ve her 15 dakikada bir güncellenir.","Tandem uçuşlar için güncel go/no-go durumu her sabah 08:00'da WhatsApp durumumuzda ve Instagram'da paylaşılır."],de:["Die Live-Werte unten stammen direkt aus offenen Wettermodellen für den Ölüdeniz-Strand, den 1200-m-Startplatz und den Babadağ-Gipfel und werden alle 15 Minuten aktualisiert.","Der Go/No-Go-Status wird täglich um 08:00 auf unserem WhatsApp-Status und Instagram gepostet."],ru:["Показания ниже берутся напрямую из открытых погодных моделей для пляжа Олюдениз, точки старта на 1200 м и вершины Бабадаг и обновляются каждые 15 минут.","Статус go/no-go публикуется каждое утро в 08:00 в нашем WhatsApp-статусе и Instagram."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  const weather = await getOludenizWeather()

  const labels = {
    en: { wind: 'Wind', gusts: 'Gusts', humidity: 'Humidity', updated: 'Updated', unavailable: 'Live weather data is temporarily unavailable — please check back shortly.' },
    tr: { wind: 'Rüzgar', gusts: 'Hamle', humidity: 'Nem', updated: 'Güncellendi', unavailable: 'Canlı hava verileri geçici olarak alınamıyor — lütfen kısa süre sonra tekrar kontrol edin.' },
    de: { wind: 'Wind', gusts: 'Böen', humidity: 'Luftfeuchtigkeit', updated: 'Aktualisiert', unavailable: 'Live-Wetterdaten sind vorübergehend nicht verfügbar — bitte später erneut prüfen.' },
    ru: { wind: 'Ветер', gusts: 'Порывы', humidity: 'Влажность', updated: 'Обновлено', unavailable: 'Данные о погоде временно недоступны — проверьте позже.' },
  } as const
  const L = (labels as any)[locale] || labels.en

  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0a/3Aur6SnimoW0BlFJ4cq8J.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3"><BreadcrumbNav items={[{ label: title }]} /></div>
      </div>

      <section className="section-padding bg-white">
        <div className="container-default max-w-5xl">
          {weather ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {weather.stations.map((s) => (
                  <div key={s.label} className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
                    <div className="text-sm font-semibold text-orange-500 uppercase tracking-wider">{s.label}</div>
                    <div className="text-xs text-slate-400 mb-4">{s.elevation}</div>
                    <div className="text-4xl font-bold text-slate-900 mb-1">
                      {s.temperatureC !== null ? `${Math.round(s.temperatureC)}°C` : '—'}
                    </div>
                    <div className="text-sm text-slate-500 mb-4">{weatherCodeLabel(s.weatherCode, locale)}</div>
                    <div className="space-y-1.5 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>{L.wind}</span>
                        <span className="font-medium text-slate-900">
                          {s.windSpeedKmh !== null ? `${Math.round(s.windSpeedKmh)} km/h ${windDirectionCompass(s.windDirectionDeg)}` : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{L.gusts}</span>
                        <span className="font-medium text-slate-900">
                          {s.windGustKmh !== null ? `${Math.round(s.windGustKmh)} km/h` : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{L.humidity}</span>
                        <span className="font-medium text-slate-900">
                          {s.humidity !== null ? `${Math.round(s.humidity)}%` : '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-4">
                {L.updated}: {new Date(weather.fetchedAt).toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' })} · Open-Meteo
              </p>
            </>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-slate-500 text-sm">
              {L.unavailable}
            </div>
          )}

          <div className="space-y-4 mt-12">
            {body.map((p: string, i: number) => <p key={i} className="text-slate-600 leading-relaxed">{p}</p>)}
          </div>
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
