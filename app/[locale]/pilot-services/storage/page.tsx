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
  const t = {en:"Equipment Storage",tr:"Ekipman Depolama",de:"Ausrüstungslagerung",ru:"Хранение снаряжения"}
  const d = {en:"Professional services for licensed paragliding pilots visiting Oludeniz.",tr:"Oludeniz'i ziyaret eden lisanslı paraşüt pilotları için profesyonel hizmetler.",de:"Professionelle Dienste für lizenzierte Paragliding-Piloten, die Oludeniz besuchen.",ru:"Профессиональные услуги для лицензированных пилотов, посещающих Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/pilot-services/storage'),
    openGraph: { url: localeUrl(locale, '/pilot-services/storage'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "What Storage Options Are Available for Pilot Equipment?", "ps": ["We offer secure, dry storage for paragliding equipment at our Ölüdeniz base, with daily and weekly rates. All stored equipment is kept in a locked, air-conditioned room — ideal for pilots staying in Ölüdeniz for the season who don't want to fly with their kit each time."]}], "faqTitle": "FAQ", "faqs": [{"q": "Is the storage secure?", "a": "Yes, equipment is kept in a locked, air-conditioned room at our Ölüdeniz base."}], "relatedTitle": "Pilot Services", "related": [{"href": "/pilot-services", "label": "All Pilot Services"}, {"href": "/solo-paragliding", "label": "Solo Paragliding"}, {"href": "/cross-country-flights", "label": "Cross Country Flying"}]}, "tr": {"sections": [{"h2": "Pilot Ekipmanı İçin Hangi Depolama Seçenekleri Mevcut?", "ps": ["Ölüdeniz üssümüzde paraşüt ekipmanı için güvenli, kuru depolama sunuyoruz; günlük ve haftalık fiyatlar mevcuttur. Tüm depolanan ekipman kilitli, klimalı bir odada tutulur — sezon boyunca Ölüdeniz'de kalan ve her seferinde ekipmanını taşımak istemeyen pilotlar için idealdir."]}], "faqTitle": "SSS", "faqs": [{"q": "Depolama güvenli mi?", "a": "Evet, ekipman Ölüdeniz üssümüzde kilitli, klimalı bir odada tutulur."}], "relatedTitle": "Pilot Hizmetleri", "related": [{"href": "/pilot-services", "label": "Tüm Pilot Hizmetleri"}, {"href": "/solo-paragliding", "label": "Solo Yamaç Paraşütü"}, {"href": "/cross-country-flights", "label": "Cross Country Uçuşlar"}]}, "de": {"sections": [{"h2": "Welche Lagermöglichkeiten gibt es für Pilotenausrüstung?", "ps": ["Wir bieten sichere, trockene Lagerung für Paragliding-Ausrüstung an unserer Basis in Ölüdeniz, mit Tages- und Wochentarifen. Alle gelagerte Ausrüstung befindet sich in einem verschlossenen, klimatisierten Raum — ideal für Piloten, die die Saison über in Ölüdeniz bleiben und ihre Ausrüstung nicht jedes Mal mitnehmen möchten."]}], "faqTitle": "FAQ", "faqs": [{"q": "Ist die Lagerung sicher?", "a": "Ja, die Ausrüstung wird in einem verschlossenen, klimatisierten Raum an unserer Basis in Ölüdeniz aufbewahrt."}], "relatedTitle": "Pilotendienste", "related": [{"href": "/pilot-services", "label": "Alle Pilotendienste"}, {"href": "/solo-paragliding", "label": "Solo-Paragliding"}, {"href": "/cross-country-flights", "label": "Streckenflug (XC)"}]}, "ru": {"sections": [{"h2": "Какие варианты хранения снаряжения доступны пилотам?", "ps": ["Мы предлагаем безопасное, сухое хранение снаряжения для парапланеризма на нашей базе в Олюденизе с посуточными и понедельными тарифами. Всё хранимое снаряжение находится в запертой комнате с кондиционером — идеально для пилотов, остающихся в Олюденизе на сезон и не желающих каждый раз возить снаряжение с собой."]}], "faqTitle": "FAQ", "faqs": [{"q": "Безопасно ли хранение?", "a": "Да, снаряжение хранится в запертой комнате с кондиционером на нашей базе в Олюденизе."}], "relatedTitle": "Услуги для пилотов", "related": [{"href": "/pilot-services", "label": "Все услуги для пилотов"}, {"href": "/solo-paragliding", "label": "Соло-парапланеризм"}, {"href": "/cross-country-flights", "label": "Маршрутные полёты (XC)"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'pilotServices' })
  const titles = {en:"Equipment Storage",tr:"Ekipman Depolama",de:"Ausrüstungslagerung",ru:"Хранение снаряжения"}
  const subs = {en:"Professional services for licensed paragliding pilots visiting Oludeniz.",tr:"Oludeniz'i ziyaret eden lisanslı paraşüt pilotları için profesyonel hizmetler.",de:"Professionelle Dienste für lizenzierte Paragliding-Piloten, die Oludeniz besuchen.",ru:"Профессиональные услуги для лицензированных пилотов, посещающих Олюдениз."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="Paragliding Equipment Storage Oludeniz" description="Secure paragliding equipment storage in Oludeniz for visiting pilots." path="/pilot-services/storage" serviceType="Paragliding Equipment Storage" />
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
