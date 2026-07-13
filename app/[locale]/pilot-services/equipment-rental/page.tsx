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
  const t = {en:"Equipment Rental",tr:"Ekipman Kiralama",de:"Ausrüstungsverleih",ru:"Прокат снаряжения"}
  const d = {en:"Professional services for licensed paragliding pilots visiting Oludeniz.",tr:"Oludeniz'i ziyaret eden lisanslı paraşüt pilotları için profesyonel hizmetler.",de:"Professionelle Dienste für lizenzierte Paragliding-Piloten, die Oludeniz besuchen.",ru:"Профессиональные услуги для лицензированных пилотов, посещающих Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/pilot-services/equipment-rental'),
    openGraph: { url: localeUrl(locale, '/pilot-services/equipment-rental'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "What Equipment Can Visiting Pilots Hire?", "ps": ["We hire out a full range of paragliding equipment — harnesses, helmets, reserve parachutes and more — to visiting pilots with valid licences. All hire equipment is inspected and in current certification. Contact us in advance to reserve your preferred kit."]}], "faqTitle": "FAQ", "faqs": [{"q": "Is hire equipment certified?", "a": "Yes, all hire equipment is inspected regularly and holds current certification."}], "relatedTitle": "Pilot Services", "related": [{"href": "/pilot-services", "label": "All Pilot Services"}, {"href": "/solo-paragliding", "label": "Solo Paragliding"}, {"href": "/cross-country-flights", "label": "Cross Country Flying"}]}, "tr": {"sections": [{"h2": "Ziyaretçi Pilotlar Hangi Ekipmanı Kiralayabilir?", "ps": ["Geçerli lisansa sahip ziyaretçi pilotlara koşum takımı, kask, yedek paraşüt ve daha fazlasını içeren tam bir paraşüt ekipmanı yelpazesi kiralıyoruz. Tüm kiralık ekipman denetlenir ve güncel sertifikasyona sahiptir. Tercih ettiğiniz ekipmanı ayırtmak için önceden bize ulaşın."]}], "faqTitle": "SSS", "faqs": [{"q": "Kiralık ekipman sertifikalı mı?", "a": "Evet, tüm kiralık ekipman düzenli olarak denetlenir ve güncel sertifikasyona sahiptir."}], "relatedTitle": "Pilot Hizmetleri", "related": [{"href": "/pilot-services", "label": "Tüm Pilot Hizmetleri"}, {"href": "/solo-paragliding", "label": "Solo Yamaç Paraşütü"}, {"href": "/cross-country-flights", "label": "Cross Country Uçuşlar"}]}, "de": {"sections": [{"h2": "Welche Ausrüstung können Gastpiloten mieten?", "ps": ["Wir vermieten ein vollständiges Sortiment an Paragliding-Ausrüstung — Gurtzeuge, Helme, Rettungsschirme und mehr — an Gastpiloten mit gültiger Lizenz. Alle Mietausrüstung wird geprüft und ist aktuell zertifiziert. Kontaktieren Sie uns im Voraus, um Ihre bevorzugte Ausrüstung zu reservieren."]}], "faqTitle": "FAQ", "faqs": [{"q": "Ist die Mietausrüstung zertifiziert?", "a": "Ja, alle Mietausrüstung wird regelmäßig geprüft und ist aktuell zertifiziert."}], "relatedTitle": "Pilotendienste", "related": [{"href": "/pilot-services", "label": "Alle Pilotendienste"}, {"href": "/solo-paragliding", "label": "Solo-Paragliding"}, {"href": "/cross-country-flights", "label": "Streckenflug (XC)"}]}, "ru": {"sections": [{"h2": "Какое снаряжение могут арендовать приезжие пилоты?", "ps": ["Мы предлагаем в аренду полный спектр снаряжения для парапланеризма — подвесные системы, шлемы, запасные парашюты и многое другое — приезжим пилотам с действующей лицензией. Всё арендуемое снаряжение проверено и имеет актуальную сертификацию. Свяжитесь с нами заранее, чтобы забронировать нужное снаряжение."]}], "faqTitle": "FAQ", "faqs": [{"q": "Сертифицировано ли арендуемое снаряжение?", "a": "Да, всё арендуемое снаряжение регулярно проверяется и имеет актуальную сертификацию."}], "relatedTitle": "Услуги для пилотов", "related": [{"href": "/pilot-services", "label": "Все услуги для пилотов"}, {"href": "/solo-paragliding", "label": "Соло-парапланеризм"}, {"href": "/cross-country-flights", "label": "Маршрутные полёты (XC)"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'pilotServices' })
  const titles = {en:"Equipment Rental",tr:"Ekipman Kiralama",de:"Ausrüstungsverleih",ru:"Прокат снаряжения"}
  const subs = {en:"Professional services for licensed paragliding pilots visiting Oludeniz.",tr:"Oludeniz'i ziyaret eden lisanslı paraşüt pilotları için profesyonel hizmetler.",de:"Professionelle Dienste für lizenzierte Paragliding-Piloten, die Oludeniz besuchen.",ru:"Профессиональные услуги для лицензированных пилотов, посещающих Олюдениз."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="Paragliding Equipment Rental Oludeniz" description="Paragliding equipment rental in Oludeniz — harnesses, wings, helmets and accessories." path="/pilot-services/equipment-rental" serviceType="Paragliding Equipment Rental" />
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
