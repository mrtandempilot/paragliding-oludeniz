import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'
import ServiceSchema from '@/components/shared/ServiceSchema'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Meteorology Briefings",tr:"Meteoroloji Brifingleri",de:"Meteorologie-Briefings",ru:"Метеорологические брифинги"}
  const d = {en:"Professional services for licensed paragliding pilots visiting Oludeniz.",tr:"Oludeniz'i ziyaret eden lisanslı paraşüt pilotları için profesyonel hizmetler.",de:"Professionelle Dienste für lizenzierte Paragliding-Piloten, die Oludeniz besuchen.",ru:"Профессиональные услуги для лицензированных пилотов, посещающих Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/pilot-services/meteorology'),
    openGraph: { url: localeUrl(locale, '/pilot-services/meteorology'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "What Do the Daily Meteorology Briefings Cover?", "ps": ["We run daily 07:30 meteorology briefings for visiting pilots covering the synoptic situation, forecast wind at all altitudes, cloudbase forecast, thermal forecast, and a clear go/no-go recommendation. Briefings are given in English and Turkish."]}], "faqTitle": "FAQ", "faqs": [{"q": "What time is the daily briefing?", "a": "07:30, covering wind, cloudbase, thermal forecast and a go/no-go recommendation for the day."}], "relatedTitle": "Pilot Services", "related": [{"href": "/pilot-services", "label": "All Pilot Services"}, {"href": "/solo-paragliding", "label": "Solo Paragliding"}, {"href": "/cross-country-flights", "label": "Cross Country Flying"}]}, "tr": {"sections": [{"h2": "Günlük Meteoroloji Brifingleri Neleri Kapsıyor?", "ps": ["Ziyaretçi pilotlar için günlük 07:30 meteoroloji brifingleri düzenliyoruz; sinoptik durum, tüm irtifalarda tahmin edilen rüzgar, bulut tabanı tahmini, termik tahmini ve net bir go/no-go önerisini kapsar. Brifingler İngilizce ve Türkçe verilir."]}], "faqTitle": "SSS", "faqs": [{"q": "Günlük brifing saat kaçta?", "a": "07:30'da; rüzgar, bulut tabanı, termik tahmini ve günün go/no-go önerisini kapsar."}], "relatedTitle": "Pilot Hizmetleri", "related": [{"href": "/pilot-services", "label": "Tüm Pilot Hizmetleri"}, {"href": "/solo-paragliding", "label": "Solo Yamaç Paraşütü"}, {"href": "/cross-country-flights", "label": "Cross Country Uçuşlar"}]}, "de": {"sections": [{"h2": "Was umfassen die täglichen Meteorologie-Briefings?", "ps": ["Wir bieten tägliche Meteorologie-Briefings um 07:30 Uhr für Gastpiloten mit synoptischer Lage, Windvorhersage für alle Höhen, Wolkenbasisprognose, Thermikprognose und einer klaren Go/No-Go-Empfehlung. Die Briefings finden auf Englisch und Türkisch statt."]}], "faqTitle": "FAQ", "faqs": [{"q": "Wann findet das tägliche Briefing statt?", "a": "Um 07:30 Uhr, mit Wind, Wolkenbasis, Thermikprognose und einer Go/No-Go-Empfehlung für den Tag."}], "relatedTitle": "Pilotendienste", "related": [{"href": "/pilot-services", "label": "Alle Pilotendienste"}, {"href": "/solo-paragliding", "label": "Solo-Paragliding"}, {"href": "/cross-country-flights", "label": "Streckenflug (XC)"}]}, "ru": {"sections": [{"h2": "Что охватывают ежедневные метеобрифинги?", "ps": ["Мы проводим ежедневные метеобрифинги в 07:30 для приезжих пилотов, охватывающие синоптическую ситуацию, прогноз ветра на всех высотах, прогноз облачности, прогноз термиков и чёткую рекомендацию go/no-go. Брифинги проводятся на английском и турецком языках."]}], "faqTitle": "FAQ", "faqs": [{"q": "Во сколько проходит ежедневный брифинг?", "a": "В 07:30, охватывает ветер, облачность, прогноз термиков и рекомендацию go/no-go на день."}], "relatedTitle": "Услуги для пилотов", "related": [{"href": "/pilot-services", "label": "Все услуги для пилотов"}, {"href": "/solo-paragliding", "label": "Соло-парапланеризм"}, {"href": "/cross-country-flights", "label": "Маршрутные полёты (XC)"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'pilotServices' })
  const titles = {en:"Meteorology Briefings",tr:"Meteoroloji Brifingleri",de:"Meteorologie-Briefings",ru:"Метеорологические брифинги"}
  const subs = {en:"Professional services for licensed paragliding pilots visiting Oludeniz.",tr:"Oludeniz'i ziyaret eden lisanslı paraşüt pilotları için profesyonel hizmetler.",de:"Professionelle Dienste für lizenzierte Paragliding-Piloten, die Oludeniz besuchen.",ru:"Профессиональные услуги для лицензированных пилотов, посещающих Олюдениз."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="Paragliding Weather Forecast Oludeniz" description="Professional meteorology and weather briefing service for paragliding in Oludeniz." path="/pilot-services/meteorology" serviceType="Paragliding Weather Service" />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c13/VVJ_THDhVNeRP66pu_Ew8.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3"><BreadcrumbNav items={[{ label: title }]} /></div>
      </div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          {c.sections.map((s: any) => (
            <div key={s.h2} className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{s.h2}</h2>
              {s.ps.map((p: string, i: number) => <p key={i} className="text-slate-600 leading-relaxed mb-4">{p}</p>)}
              {s.bullets && <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-4">{s.bullets.map((b: string, i: number) => <li key={i}>{b}</li>)}</ul>}
            </div>
          ))}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{c.faqTitle}</h2>
            {c.faqs.map((f: any) => (
              <div key={f.q} className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.q}</h3>
                <p className="text-slate-600 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3">{c.relatedTitle}</h2>
            <ul className="space-y-2">
              {c.related.map((r: any) => (
                <li key={r.href}><Link href={lp(r.href)} className="text-orange-600 hover:underline">{r.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
