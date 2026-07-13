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
  const t = {en:"Radio Hire",tr:"Telsiz Kiralama",de:"Funkvermietung",ru:"Аренда радиостанции"}
  const d = {en:"Professional services for licensed paragliding pilots visiting Oludeniz.",tr:"Oludeniz'i ziyaret eden lisanslı paraşüt pilotları için profesyonel hizmetler.",de:"Professionelle Dienste für lizenzierte Paragliding-Piloten, die Oludeniz besuchen.",ru:"Профессиональные услуги для лицензированных пилотов, посещающих Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/pilot-services/radio-hire'),
    openGraph: { url: localeUrl(locale, '/pilot-services/radio-hire'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "How Does Radio Hire Work for Visiting Pilots?", "ps": ["We hire VHF radios pre-programmed with the Babadağ launch and retrieve frequencies — essential for pilots unfamiliar with the local area. Hire includes a full frequency briefing and an emergency protocol card, so you're set up correctly before you launch."]}], "faqTitle": "FAQ", "faqs": [{"q": "Do I need my own radio?", "a": "No — hire is available, pre-programmed with the correct local frequencies and an emergency protocol briefing."}], "relatedTitle": "Pilot Services", "related": [{"href": "/pilot-services", "label": "All Pilot Services"}, {"href": "/solo-paragliding", "label": "Solo Paragliding"}, {"href": "/cross-country-flights", "label": "Cross Country Flying"}]}, "tr": {"sections": [{"h2": "Ziyaretçi Pilotlar İçin Telsiz Kiralama Nasıl Çalışır?", "ps": ["Babadağ kalkış ve geri alma frekanslarıyla önceden programlanmış VHF telsiz kiralıyoruz — bölgeye aşina olmayan pilotlar için gereklidir. Kiralama, tam bir frekans brifingi ve acil durum protokol kartını içerir; böylece kalkıştan önce doğru şekilde hazırlanmış olursunuz."]}], "faqTitle": "SSS", "faqs": [{"q": "Kendi telsizime ihtiyacım var mı?", "a": "Hayır — doğru yerel frekanslarla önceden programlanmış kiralık telsiz ve acil durum protokolü brifingi mevcuttur."}], "relatedTitle": "Pilot Hizmetleri", "related": [{"href": "/pilot-services", "label": "Tüm Pilot Hizmetleri"}, {"href": "/solo-paragliding", "label": "Solo Yamaç Paraşütü"}, {"href": "/cross-country-flights", "label": "Cross Country Uçuşlar"}]}, "de": {"sections": [{"h2": "Wie funktioniert der Funkgeräteverleih für Gastpiloten?", "ps": ["Wir vermieten VHF-Funkgeräte, die mit den Start- und Abholfrequenzen des Babadağ vorprogrammiert sind — unverzichtbar für Piloten, die das Gebiet nicht kennen. Die Miete beinhaltet ein vollständiges Frequenz-Briefing und eine Notfallprotokoll-Karte."]}], "faqTitle": "FAQ", "faqs": [{"q": "Brauche ich mein eigenes Funkgerät?", "a": "Nein — Mietgeräte sind verfügbar, vorprogrammiert mit den korrekten lokalen Frequenzen und einem Notfallprotokoll-Briefing."}], "relatedTitle": "Pilotendienste", "related": [{"href": "/pilot-services", "label": "Alle Pilotendienste"}, {"href": "/solo-paragliding", "label": "Solo-Paragliding"}, {"href": "/cross-country-flights", "label": "Streckenflug (XC)"}]}, "ru": {"sections": [{"h2": "Как работает аренда рации для приезжих пилотов?", "ps": ["Мы предлагаем в аренду УКВ-рации, предварительно настроенные на частоты старта и подбора Бабадага — необходимо для пилотов, незнакомых с местностью. Аренда включает полный инструктаж по частотам и карточку с протоколом действий при ЧС."]}], "faqTitle": "FAQ", "faqs": [{"q": "Нужна ли своя рация?", "a": "Нет — доступна аренда с предварительной настройкой на нужные местные частоты и инструктажем по протоколу ЧС."}], "relatedTitle": "Услуги для пилотов", "related": [{"href": "/pilot-services", "label": "Все услуги для пилотов"}, {"href": "/solo-paragliding", "label": "Соло-парапланеризм"}, {"href": "/cross-country-flights", "label": "Маршрутные полёты (XC)"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'pilotServices' })
  const titles = {en:"Radio Hire",tr:"Telsiz Kiralama",de:"Funkvermietung",ru:"Аренда радиостанции"}
  const subs = {en:"Professional services for licensed paragliding pilots visiting Oludeniz.",tr:"Oludeniz'i ziyaret eden lisanslı paraşüt pilotları için profesyonel hizmetler.",de:"Professionelle Dienste für lizenzierte Paragliding-Piloten, die Oludeniz besuchen.",ru:"Профессиональные услуги для лицензированных пилотов, посещающих Олюдениз."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="Paragliding Radio Hire Oludeniz" description="Radio hire for paragliding pilots flying in Oludeniz and Babadağ." path="/pilot-services/radio-hire" serviceType="Paragliding Equipment Rental" />
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
