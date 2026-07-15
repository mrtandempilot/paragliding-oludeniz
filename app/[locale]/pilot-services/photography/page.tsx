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
  const t = {en:"Flight Photography",tr:"Uçuş Fotoğrafçılığı",de:"Flugfotografie",ru:"Аэрофотосъёмка"}
  const d = {en:"Professional services for licensed paragliding pilots visiting Oludeniz.",tr:"Oludeniz'i ziyaret eden lisanslı paraşüt pilotları için profesyonel hizmetler.",de:"Professionelle Dienste für lizenzierte Paragliding-Piloten, die Oludeniz besuchen.",ru:"Профессиональные услуги для лицензированных пилотов, посещающих Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/pilot-services/photography'),
    openGraph: { url: localeUrl(locale, '/pilot-services/photography'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/pilot-services/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "How Does Flight Photography Work?", "ps": ["Our photographers shoot from the launch, from a boat in the bay, and from the landing zone. We can also arrange drone photography for an XC task or a tandem flight. Photos are delivered the same day via digital download."]}], "faqTitle": "FAQ", "faqs": [{"q": "Can I get drone photography?", "a": "Yes, drone photography can be arranged for XC tasks or tandem flights."}], "relatedTitle": "Pilot Services", "related": [{"href": "/pilot-services", "label": "All Pilot Services"}, {"href": "/solo-paragliding", "label": "Solo Paragliding"}, {"href": "/cross-country-flights", "label": "Cross Country Flying"}]}, "tr": {"sections": [{"h2": "Uçuş Fotoğrafçılığı Nasıl Çalışır?", "ps": ["Fotoğrafçılarımız kalkış noktasından, körfezdeki bir tekneden ve iniş alanından çekim yapar. XC görevi veya tandem uçuşu için drone fotoğrafçılığı da ayarlayabiliriz. Fotoğraflar aynı gün dijital indirme yoluyla teslim edilir."]}], "faqTitle": "SSS", "faqs": [{"q": "Drone fotoğrafçılığı alabilir miyim?", "a": "Evet, XC görevleri veya tandem uçuşlar için drone fotoğrafçılığı ayarlanabilir."}], "relatedTitle": "Pilot Hizmetleri", "related": [{"href": "/pilot-services", "label": "Tüm Pilot Hizmetleri"}, {"href": "/solo-paragliding", "label": "Solo Yamaç Paraşütü"}, {"href": "/cross-country-flights", "label": "Cross Country Uçuşlar"}]}, "de": {"sections": [{"h2": "Wie funktioniert die Flugfotografie?", "ps": ["Unsere Fotografen fotografieren vom Startplatz, von einem Boot in der Bucht und von der Landezone aus. Wir können auch Drohnenfotografie für einen Streckenflug oder Tandemflug arrangieren. Die Fotos werden noch am selben Tag per digitalem Download geliefert."]}], "faqTitle": "FAQ", "faqs": [{"q": "Kann ich Drohnenfotografie bekommen?", "a": "Ja, Drohnenfotografie kann für Streckenflüge oder Tandemflüge arrangiert werden."}], "relatedTitle": "Pilotendienste", "related": [{"href": "/pilot-services", "label": "Alle Pilotendienste"}, {"href": "/solo-paragliding", "label": "Solo-Paragliding"}, {"href": "/cross-country-flights", "label": "Streckenflug (XC)"}]}, "ru": {"sections": [{"h2": "Как работает фотосъёмка полёта?", "ps": ["Наши фотографы снимают со старта, с лодки в заливе и с места посадки. Мы также можем организовать аэрофотосъёмку с дрона для XC-задачи или тандемного полёта. Фотографии доставляются в тот же день в виде цифровой загрузки."]}], "faqTitle": "FAQ", "faqs": [{"q": "Могу ли я заказать аэрофотосъёмку с дрона?", "a": "Да, аэрофотосъёмку с дрона можно организовать для XC-задач или тандемных полётов."}], "relatedTitle": "Услуги для пилотов", "related": [{"href": "/pilot-services", "label": "Все услуги для пилотов"}, {"href": "/solo-paragliding", "label": "Соло-парапланеризм"}, {"href": "/cross-country-flights", "label": "Маршрутные полёты (XC)"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'pilotServices' })
  const titles = {en:"Flight Photography",tr:"Uçuş Fotoğrafçılığı",de:"Flugfotografie",ru:"Аэрофотосъёмка"}
  const subs = {en:"Professional services for licensed paragliding pilots visiting Oludeniz.",tr:"Oludeniz'i ziyaret eden lisanslı paraşüt pilotları için profesyonel hizmetler.",de:"Professionelle Dienste für lizenzierte Paragliding-Piloten, die Oludeniz besuchen.",ru:"Профессиональные услуги для лицензированных пилотов, посещающих Олюдениз."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="Paragliding Photography Oludeniz" description="Professional aerial photography during your tandem paragliding flight in Oludeniz." path="/pilot-services/photography" serviceType="Paragliding Photography Service" />
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
