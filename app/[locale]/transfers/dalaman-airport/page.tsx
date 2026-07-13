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
  const t = {en:"Dalaman Airport to Oludeniz Transfer",tr:"Dalaman Havalimanı Oludeniz Transfer",de:"Dalaman Airport to Oludeniz Transfer",ru:"Dalaman Airport to Oludeniz Transfer"}
  const d = {en:"Transfer services to and from Oludeniz.",tr:"Oludeniz'e ve oradan transfer hizmetleri.",de:"Transferdienste nach und von Oludeniz.",ru:"Трансферные услуги в Олюдениз и обратно."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/transfers/dalaman-airport'),
    openGraph: { url: localeUrl(locale, '/transfers/dalaman-airport'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "How Far Is Dalaman Airport from Ölüdeniz?", "ps": ["Dalaman Airport (IATA: DLM) is the nearest international airport to Ölüdeniz, approximately 55km away — about a 1-hour drive. We can arrange private transfers directly from the airport to your hotel or our office, with flight tracking so pickup times adjust to your actual landing."]}], "faqTitle": "FAQ", "faqs": [{"q": "Is transfer from Dalaman included in my flight package?", "a": "Transfer to Babadağ is included in tandem packages; airport-to-hotel transfer can be arranged separately — contact us for pricing."}], "relatedTitle": "More Transfer Options", "related": [{"href": "/transfers", "label": "All Transfer Options"}, {"href": "/book-now", "label": "Book Your Flight"}, {"href": "/contact", "label": "Contact Us"}]}, "tr": {"sections": [{"h2": "Dalaman Havalimanı Ölüdeniz'e Ne Kadar Uzaklıkta?", "ps": ["Dalaman Havalimanı (IATA: DLM), Ölüdeniz'e en yakın uluslararası havalimanıdır; yaklaşık 55 km uzaklıkta, araçla yaklaşık 1 saat. Havalimanından doğrudan otelinize veya ofisimize özel transfer ayarlayabiliriz; uçuş takibi sayesinde alım saatleri gerçek iniş saatinize göre ayarlanır."]}], "faqTitle": "SSS", "faqs": [{"q": "Dalaman'dan transfer uçuş paketime dahil mi?", "a": "Babadağ'a transfer tandem paketlere dahildir; havalimanından otele transfer ayrıca ayarlanabilir — fiyatlandırma için bize ulaşın."}], "relatedTitle": "Diğer Transfer Seçenekleri", "related": [{"href": "/transfers", "label": "Tüm Transfer Seçenekleri"}, {"href": "/book-now", "label": "Uçuşunuzu Ayırtın"}, {"href": "/contact", "label": "Bize Ulaşın"}]}, "de": {"sections": [{"h2": "Wie weit ist der Flughafen Dalaman von Ölüdeniz entfernt?", "ps": ["Der Flughafen Dalaman (IATA: DLM) ist der nächstgelegene internationale Flughafen zu Ölüdeniz, etwa 55km entfernt — rund eine Stunde Fahrzeit. Wir organisieren private Transfers direkt vom Flughafen zu Ihrem Hotel oder unserem Büro, mit Flugverfolgung, damit die Abholzeit an Ihre tatsächliche Landung angepasst wird."]}], "faqTitle": "FAQ", "faqs": [{"q": "Ist der Transfer ab Dalaman in meinem Flugpaket enthalten?", "a": "Der Transfer zum Babadağ ist in Tandempaketen enthalten; ein Flughafen-Hotel-Transfer kann separat organisiert werden — kontaktieren Sie uns für Preise."}], "relatedTitle": "Weitere Transferoptionen", "related": [{"href": "/transfers", "label": "Alle Transferoptionen"}, {"href": "/book-now", "label": "Flug buchen"}, {"href": "/contact", "label": "Kontakt"}]}, "ru": {"sections": [{"h2": "Как далеко аэропорт Даламан от Олюдениза?", "ps": ["Аэропорт Даламан (IATA: DLM) — ближайший международный аэропорт к Олюденизу, примерно в 55км — около часа на машине. Мы можем организовать частный трансфер прямо из аэропорта в ваш отель или офис, с отслеживанием рейса, чтобы время встречи подстраивалось под фактическое время приземления."]}], "faqTitle": "FAQ", "faqs": [{"q": "Включён ли трансфер из Даламана в мой пакет полёта?", "a": "Трансфер на Бабадаг включён в тандемные пакеты; трансфер из аэропорта в отель можно организовать отдельно — свяжитесь с нами для уточнения цен."}], "relatedTitle": "Другие варианты трансфера", "related": [{"href": "/transfers", "label": "Все варианты трансфера"}, {"href": "/book-now", "label": "Забронировать полёт"}, {"href": "/contact", "label": "Связаться с нами"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'transfers' })
  const titles = {en:"Dalaman Airport to Oludeniz Transfer",tr:"Dalaman Havalimanı Oludeniz Transfer",de:"Dalaman Airport to Oludeniz Transfer",ru:"Dalaman Airport to Oludeniz Transfer"}
  const subs = {en:"Transfer services to and from Oludeniz.",tr:"Oludeniz'e ve oradan transfer hizmetleri.",de:"Transferdienste nach und von Oludeniz.",ru:"Трансферные услуги в Олюдениз и обратно."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="Dalaman Airport Transfer Paragliding Oludeniz" description="Airport transfer from Dalaman to Oludeniz for your paragliding flight." path="/transfers/dalaman-airport" serviceType="Airport Transfer Service" />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c08/BbYEw0ihhZaLcaN29vTrs.jpg" />
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
