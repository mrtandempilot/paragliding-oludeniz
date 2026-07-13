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
  const t = {en:"GoPro Video Service",tr:"GoPro Video Hizmeti",de:"GoPro-Video-Service",ru:"Видеосъёмка GoPro"}
  const d = {en:"Professional services for licensed paragliding pilots visiting Oludeniz.",tr:"Oludeniz'i ziyaret eden lisanslı paraşüt pilotları için profesyonel hizmetler.",de:"Professionelle Dienste für lizenzierte Paragliding-Piloten, die Oludeniz besuchen.",ru:"Профессиональные услуги для лицензированных пилотов, посещающих Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/pilot-services/gopro-video'),
    openGraph: { url: localeUrl(locale, '/pilot-services/gopro-video'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "How Does GoPro Video Hire Work?", "ps": ["We fit GoPro cameras to your harness or helmet for self-shot flight videos. Hire includes a full charge, a 64GB card, and post-flight download to your phone or USB — available for both solo pilots and tandem passengers."]}], "faqTitle": "FAQ", "faqs": [{"q": "Do I get the footage the same day?", "a": "Yes, footage is downloaded to your phone or USB right after your flight."}], "relatedTitle": "Pilot Services", "related": [{"href": "/pilot-services", "label": "All Pilot Services"}, {"href": "/solo-paragliding", "label": "Solo Paragliding"}, {"href": "/cross-country-flights", "label": "Cross Country Flying"}]}, "tr": {"sections": [{"h2": "GoPro Video Kiralama Nasıl Çalışır?", "ps": ["Kendi çektiğiniz uçuş videoları için kaskınıza veya koşum takımınıza GoPro kamera takıyoruz. Kiralama, tam şarj, 64GB kart ve uçuş sonrası telefonunuza veya USB'ye indirmeyi içerir — hem solo pilotlar hem tandem yolcuları için mevcuttur."]}], "faqTitle": "SSS", "faqs": [{"q": "Görüntüleri aynı gün alabilir miyim?", "a": "Evet, görüntüler uçuşunuzdan hemen sonra telefonunuza veya USB'ye indirilir."}], "relatedTitle": "Pilot Hizmetleri", "related": [{"href": "/pilot-services", "label": "Tüm Pilot Hizmetleri"}, {"href": "/solo-paragliding", "label": "Solo Yamaç Paraşütü"}, {"href": "/cross-country-flights", "label": "Cross Country Uçuşlar"}]}, "de": {"sections": [{"h2": "Wie funktioniert die GoPro-Video-Vermietung?", "ps": ["Wir bringen GoPro-Kameras an Ihrem Gurtzeug oder Helm an, für selbst gedrehte Flugvideos. Die Miete beinhaltet vollen Akku, eine 64-GB-Karte und den Download nach dem Flug auf Ihr Handy oder USB — verfügbar für Solo-Piloten und Tandempassagiere."]}], "faqTitle": "FAQ", "faqs": [{"q": "Bekomme ich das Filmmaterial am selben Tag?", "a": "Ja, das Filmmaterial wird direkt nach Ihrem Flug auf Ihr Handy oder USB heruntergeladen."}], "relatedTitle": "Pilotendienste", "related": [{"href": "/pilot-services", "label": "Alle Pilotendienste"}, {"href": "/solo-paragliding", "label": "Solo-Paragliding"}, {"href": "/cross-country-flights", "label": "Streckenflug (XC)"}]}, "ru": {"sections": [{"h2": "Как работает аренда GoPro-камер?", "ps": ["Мы крепим GoPro-камеры на вашу подвесную систему или шлем для самостоятельной съёмки полёта. Аренда включает полную зарядку, карту на 64ГБ и загрузку видео на телефон или USB после полёта — доступно как для соло-пилотов, так и для тандемных пассажиров."]}], "faqTitle": "FAQ", "faqs": [{"q": "Получу ли я видео в тот же день?", "a": "Да, видео загружается на ваш телефон или USB сразу после полёта."}], "relatedTitle": "Услуги для пилотов", "related": [{"href": "/pilot-services", "label": "Все услуги для пилотов"}, {"href": "/solo-paragliding", "label": "Соло-парапланеризм"}, {"href": "/cross-country-flights", "label": "Маршрутные полёты (XC)"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'pilotServices' })
  const titles = {en:"GoPro Video Service",tr:"GoPro Video Hizmeti",de:"GoPro-Video-Service",ru:"Видеосъёмка GoPro"}
  const subs = {en:"Professional services for licensed paragliding pilots visiting Oludeniz.",tr:"Oludeniz'i ziyaret eden lisanslı paraşüt pilotları için profesyonel hizmetler.",de:"Professionelle Dienste für lizenzierte Paragliding-Piloten, die Oludeniz besuchen.",ru:"Профессиональные услуги для лицензированных пилотов, посещающих Олюдениз."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="GoPro Video Paragliding Oludeniz" description="Professional GoPro video of your paragliding flight over the Blue Lagoon in Oludeniz." path="/pilot-services/gopro-video" serviceType="Paragliding Photography Service" />
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
