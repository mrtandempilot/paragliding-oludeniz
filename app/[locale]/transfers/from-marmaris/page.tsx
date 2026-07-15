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
  const t = {en:"Marmaris to Oludeniz Transfer",tr:"Marmaris Oludeniz Transfer",de:"Marmaris to Oludeniz Transfer",ru:"Marmaris to Oludeniz Transfer"}
  const d = {en:"Transfer services to and from Oludeniz.",tr:"Oludeniz'e ve oradan transfer hizmetleri.",de:"Transferdienste nach und von Oludeniz.",ru:"Трансферные услуги в Олюдениз и обратно."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/transfers/from-marmaris'),
    openGraph: { url: localeUrl(locale, '/transfers/from-marmaris'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/transfers/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "How Do You Get from Marmaris to Ölüdeniz?", "ps": ["Marmaris is approximately 120km from Ölüdeniz, about 2 hours by road. We can arrange private transfers for groups or individuals. Alternatively, regular bus services connect Marmaris to Fethiye, where you can pick up a dolmuş on to Ölüdeniz."]}], "faqTitle": "FAQ", "faqs": [{"q": "Is a direct transfer available from Marmaris?", "a": "Yes, private transfers direct from Marmaris are available on request — contact us for pricing."}], "relatedTitle": "More Transfer Options", "related": [{"href": "/transfers", "label": "All Transfer Options"}, {"href": "/book-now", "label": "Book Your Flight"}, {"href": "/contact", "label": "Contact Us"}]}, "tr": {"sections": [{"h2": "Marmaris'ten Ölüdeniz'e Nasıl Ulaşılır?", "ps": ["Marmaris, Ölüdeniz'e yaklaşık 120 km uzaklıktadır, karayoluyla yaklaşık 2 saat. Gruplar veya bireyler için özel transfer ayarlayabiliriz. Alternatif olarak, düzenli otobüs seferleri Marmaris'i Fethiye'ye bağlar; oradan Ölüdeniz'e dolmuş ile devam edebilirsiniz."]}], "faqTitle": "SSS", "faqs": [{"q": "Marmaris'ten direkt transfer var mı?", "a": "Evet, Marmaris'ten talep üzerine doğrudan özel transfer mevcuttur — fiyatlandırma için bize ulaşın."}], "relatedTitle": "Diğer Transfer Seçenekleri", "related": [{"href": "/transfers", "label": "Tüm Transfer Seçenekleri"}, {"href": "/book-now", "label": "Uçuşunuzu Ayırtın"}, {"href": "/contact", "label": "Bize Ulaşın"}]}, "de": {"sections": [{"h2": "Wie kommt man von Marmaris nach Ölüdeniz?", "ps": ["Marmaris liegt etwa 120km von Ölüdeniz entfernt, rund 2 Stunden mit dem Auto. Wir organisieren private Transfers für Gruppen oder Einzelpersonen. Alternativ verbinden regelmäßige Busse Marmaris mit Fethiye, von wo aus Sie mit dem Dolmuş nach Ölüdeniz weiterfahren können."]}], "faqTitle": "FAQ", "faqs": [{"q": "Gibt es einen direkten Transfer ab Marmaris?", "a": "Ja, private Transfers direkt ab Marmaris sind auf Anfrage verfügbar — kontaktieren Sie uns für Preise."}], "relatedTitle": "Weitere Transferoptionen", "related": [{"href": "/transfers", "label": "Alle Transferoptionen"}, {"href": "/book-now", "label": "Flug buchen"}, {"href": "/contact", "label": "Kontakt"}]}, "ru": {"sections": [{"h2": "Как добраться из Мармариса в Олюдениз?", "ps": ["Мармарис находится примерно в 120км от Олюдениза, около 2 часов по дороге. Мы можем организовать частный трансфер для групп или индивидуально. Также регулярные автобусы связывают Мармарис с Фетхие, откуда можно доехать до Олюдениза на долмуше."]}], "faqTitle": "FAQ", "faqs": [{"q": "Есть ли прямой трансфер из Мармариса?", "a": "Да, частный трансфер напрямую из Мармариса доступен по запросу — свяжитесь с нами для уточнения цен."}], "relatedTitle": "Другие варианты трансфера", "related": [{"href": "/transfers", "label": "Все варианты трансфера"}, {"href": "/book-now", "label": "Забронировать полёт"}, {"href": "/contact", "label": "Связаться с нами"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'transfers' })
  const titles = {en:"Marmaris to Oludeniz Transfer",tr:"Marmaris Oludeniz Transfer",de:"Marmaris to Oludeniz Transfer",ru:"Marmaris to Oludeniz Transfer"}
  const subs = {en:"Transfer services to and from Oludeniz.",tr:"Oludeniz'e ve oradan transfer hizmetleri.",de:"Transferdienste nach und von Oludeniz.",ru:"Трансферные услуги в Олюдениз и обратно."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="Transfer from Marmaris to Oludeniz Paragliding" description="Transfer from Marmaris to Oludeniz for tandem paragliding from Babadağ." path="/transfers/from-marmaris" serviceType="Transfer Service" />
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
