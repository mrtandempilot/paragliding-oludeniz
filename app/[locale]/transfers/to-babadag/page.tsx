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
  const t = {en:"Transfer to Babadag Launch",tr:"Babadag Kalkis Noktasina Transfer",de:"Transfer to Babadag Launch",ru:"Transfer to Babadag Launch"}
  const d = {en:"Transfer services to and from Oludeniz.",tr:"Oludeniz'e ve oradan transfer hizmetleri.",de:"Transferdienste nach und von Oludeniz.",ru:"Трансферные услуги в Олюдениз и обратно."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/transfers/to-babadag'),
    openGraph: { url: localeUrl(locale, '/transfers/to-babadag'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/transfers/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "How Does the Transfer to Babadağ Work?", "ps": ["Transfer to the Babadağ launch points is included in every tandem flight package — we pick you up from Ölüdeniz beach and take you straight to the mountain. For solo pilots, we offer shuttle services to the 1200m, 1700m and 1960m launch points; timing and frequency depend on demand, so contact us in advance to arrange."]}], "faqTitle": "FAQ", "faqs": [{"q": "Is transfer to Babadağ included in tandem flights?", "a": "Yes, always — it's part of every tandem package, no separate booking needed."}], "relatedTitle": "More Transfer Options", "related": [{"href": "/transfers", "label": "All Transfer Options"}, {"href": "/book-now", "label": "Book Your Flight"}, {"href": "/contact", "label": "Contact Us"}]}, "tr": {"sections": [{"h2": "Babadağ'a Transfer Nasıl Çalışır?", "ps": ["Babadağ kalkış noktalarına transfer her tandem uçuş paketine dahildir — sizi Ölüdeniz plajından alır, doğrudan dağa götürürüz. Solo pilotlar için 1200m, 1700m ve 1960m kalkış noktalarına servis hizmetleri sunuyoruz; zamanlama ve sıklık talebe bağlıdır, ayarlamak için önceden bize ulaşın."]}], "faqTitle": "SSS", "faqs": [{"q": "Babadağ'a transfer tandem uçuşlara dahil mi?", "a": "Evet, her zaman — her tandem paketin bir parçasıdır, ayrı rezervasyon gerekmez."}], "relatedTitle": "Diğer Transfer Seçenekleri", "related": [{"href": "/transfers", "label": "Tüm Transfer Seçenekleri"}, {"href": "/book-now", "label": "Uçuşunuzu Ayırtın"}, {"href": "/contact", "label": "Bize Ulaşın"}]}, "de": {"sections": [{"h2": "Wie funktioniert der Transfer zum Babadağ?", "ps": ["Der Transfer zu den Babadağ-Startplätzen ist in jedem Tandempaket enthalten — wir holen Sie am Strand von Ölüdeniz ab und bringen Sie direkt zum Berg. Für Solo-Piloten bieten wir Shuttle-Service zu den Startplätzen auf 1200m, 1700m und 1960m; Zeiten und Häufigkeit hängen von der Nachfrage ab — kontaktieren Sie uns im Voraus zur Organisation."]}], "faqTitle": "FAQ", "faqs": [{"q": "Ist der Transfer zum Babadağ bei Tandemflügen enthalten?", "a": "Ja, immer — er ist Teil jedes Tandempakets, keine separate Buchung nötig."}], "relatedTitle": "Weitere Transferoptionen", "related": [{"href": "/transfers", "label": "Alle Transferoptionen"}, {"href": "/book-now", "label": "Flug buchen"}, {"href": "/contact", "label": "Kontakt"}]}, "ru": {"sections": [{"h2": "Как работает трансфер на Бабадаг?", "ps": ["Трансфер на стартовые площадки Бабадага включён в каждый тандемный пакет — мы забираем вас с пляжа Олюдениз и везём прямо в гору. Для соло-пилотов мы предлагаем шаттл на стартовые площадки 1200м, 1700м и 1960м; время и частота зависят от спроса — свяжитесь с нами заранее для организации."]}], "faqTitle": "FAQ", "faqs": [{"q": "Включён ли трансфер на Бабадаг в тандемные полёты?", "a": "Да, всегда — это часть каждого тандемного пакета, отдельное бронирование не требуется."}], "relatedTitle": "Другие варианты трансфера", "related": [{"href": "/transfers", "label": "Все варианты трансфера"}, {"href": "/book-now", "label": "Забронировать полёт"}, {"href": "/contact", "label": "Связаться с нами"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'transfers' })
  const titles = {en:"Transfer to Babadag Launch",tr:"Babadag Kalkis Noktasina Transfer",de:"Transfer to Babadag Launch",ru:"Transfer to Babadag Launch"}
  const subs = {en:"Transfer services to and from Oludeniz.",tr:"Oludeniz'e ve oradan transfer hizmetleri.",de:"Transferdienste nach und von Oludeniz.",ru:"Трансферные услуги в Олюдениз и обратно."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="Transfer to Babadağ Paragliding Launch" description="Transfer from Oludeniz beach to Babadağ Mountain launch site for paragliding." path="/transfers/to-babadag" serviceType="Transfer Service" />
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
