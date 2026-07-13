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
  const t = {en:"Retrieve Service",tr:"Geri Alma Hizmeti",de:"Abholservice",ru:"Услуга подбора"}
  const d = {en:"Professional services for licensed paragliding pilots visiting Oludeniz.",tr:"Oludeniz'i ziyaret eden lisanslı paraşüt pilotları için profesyonel hizmetler.",de:"Professionelle Dienste für lizenzierte Paragliding-Piloten, die Oludeniz besuchen.",ru:"Профессиональные услуги для лицензированных пилотов, посещающих Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/pilot-services/retrieval'),
    openGraph: { url: localeUrl(locale, '/pilot-services/retrieval'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "How Does the Retrieve Service Work?", "ps": ["Our retrieve vehicle covers Ölüdeniz, Fethiye, Çalış, Göcek and surrounding areas. Pre-book your retrieve before launch so we know your planned route and landing options, and we track your location via WhatsApp location sharing during the flight."]}], "faqTitle": "FAQ", "faqs": [{"q": "How far does the retrieve service cover?", "a": "Ölüdeniz, Fethiye, Çalış, Göcek and the surrounding area."}], "relatedTitle": "Pilot Services", "related": [{"href": "/pilot-services", "label": "All Pilot Services"}, {"href": "/solo-paragliding", "label": "Solo Paragliding"}, {"href": "/cross-country-flights", "label": "Cross Country Flying"}]}, "tr": {"sections": [{"h2": "Geri Alma Hizmeti Nasıl Çalışır?", "ps": ["Geri alma aracımız Ölüdeniz, Fethiye, Çalış, Göcek ve çevre bölgeleri kapsar. Planladığınız rotayı ve iniş seçeneklerini bilmemiz için kalkıştan önce rezervasyon yapın; uçuş sırasında WhatsApp konum paylaşımıyla sizi takip ediyoruz."]}], "faqTitle": "SSS", "faqs": [{"q": "Geri alma hizmeti ne kadar alanı kapsıyor?", "a": "Ölüdeniz, Fethiye, Çalış, Göcek ve çevresini kapsar."}], "relatedTitle": "Pilot Hizmetleri", "related": [{"href": "/pilot-services", "label": "Tüm Pilot Hizmetleri"}, {"href": "/solo-paragliding", "label": "Solo Yamaç Paraşütü"}, {"href": "/cross-country-flights", "label": "Cross Country Uçuşlar"}]}, "de": {"sections": [{"h2": "Wie funktioniert der Abholservice?", "ps": ["Unser Abholfahrzeug deckt Ölüdeniz, Fethiye, Çalış, Göcek und die umliegenden Gebiete ab. Buchen Sie Ihre Abholung vor dem Start, damit wir Ihre geplante Route und Landeoptionen kennen — wir verfolgen Ihren Standort während des Flugs per WhatsApp."]}], "faqTitle": "FAQ", "faqs": [{"q": "Wie weit reicht der Abholservice?", "a": "Ölüdeniz, Fethiye, Çalış, Göcek und die umliegende Region."}], "relatedTitle": "Pilotendienste", "related": [{"href": "/pilot-services", "label": "Alle Pilotendienste"}, {"href": "/solo-paragliding", "label": "Solo-Paragliding"}, {"href": "/cross-country-flights", "label": "Streckenflug (XC)"}]}, "ru": {"sections": [{"h2": "Как работает услуга подбора?", "ps": ["Наш автомобиль для подбора обслуживает Олюдениз, Фетхие, Чалыш, Гёджек и окрестности. Забронируйте подбор перед стартом, чтобы мы знали ваш планируемый маршрут и варианты посадки — мы отслеживаем ваше местоположение через геолокацию WhatsApp во время полёта."]}], "faqTitle": "FAQ", "faqs": [{"q": "Насколько далеко распространяется услуга подбора?", "a": "Олюдениз, Фетхие, Чалыш, Гёджек и окрестности."}], "relatedTitle": "Услуги для пилотов", "related": [{"href": "/pilot-services", "label": "Все услуги для пилотов"}, {"href": "/solo-paragliding", "label": "Соло-парапланеризм"}, {"href": "/cross-country-flights", "label": "Маршрутные полёты (XC)"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'pilotServices' })
  const titles = {en:"Retrieve Service",tr:"Geri Alma Hizmeti",de:"Abholservice",ru:"Услуга подбора"}
  const subs = {en:"Professional services for licensed paragliding pilots visiting Oludeniz.",tr:"Oludeniz'i ziyaret eden lisanslı paraşüt pilotları için profesyonel hizmetler.",de:"Professionelle Dienste für lizenzierte Paragliding-Piloten, die Oludeniz besuchen.",ru:"Профессиональные услуги для лицензированных пилотов, посещающих Олюдениз."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="Paragliding Retrieval Service Oludeniz" description="Safe and efficient retrieval service for paragliding pilots landing away from Oludeniz." path="/pilot-services/retrieval" serviceType="Paragliding Retrieval Service" />
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
