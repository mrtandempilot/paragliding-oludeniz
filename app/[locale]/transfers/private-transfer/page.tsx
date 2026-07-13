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
  const t = {en:"Private Transfer Service",tr:"Ozel Transfer Hizmeti",de:"Private Transfer Service",ru:"Private Transfer Service"}
  const d = {en:"Transfer services to and from Oludeniz.",tr:"Oludeniz'e ve oradan transfer hizmetleri.",de:"Transferdienste nach und von Oludeniz.",ru:"Трансферные услуги в Олюдениз и обратно."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/transfers/private-transfer'),
    openGraph: { url: localeUrl(locale, '/transfers/private-transfer'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "What Does a Private Transfer Include?", "ps": ["We offer private transfer services from Dalaman Airport, Fethiye, Marmaris, Bodrum and other regional centres to Ölüdeniz — air-conditioned vehicles, English-speaking drivers, and flight tracking for airport pickups so you're never left waiting or waiting on us."]}], "faqTitle": "FAQ", "faqs": [{"q": "Do drivers speak English?", "a": "Yes, our private transfer drivers speak English."}], "relatedTitle": "More Transfer Options", "related": [{"href": "/transfers", "label": "All Transfer Options"}, {"href": "/book-now", "label": "Book Your Flight"}, {"href": "/contact", "label": "Contact Us"}]}, "tr": {"sections": [{"h2": "Özel Transfer Neleri İçerir?", "ps": ["Dalaman Havalimanı, Fethiye, Marmaris, Bodrum ve diğer bölgesel merkezlerden Ölüdeniz'e özel transfer hizmeti sunuyoruz — klimalı araçlar, İngilizce konuşan şoförler ve havalimanı alımları için uçuş takibi; böylece ne siz bekletilirsiniz ne de biz sizi bekleriz."]}], "faqTitle": "SSS", "faqs": [{"q": "Şoförler İngilizce konuşuyor mu?", "a": "Evet, özel transfer şoförlerimiz İngilizce konuşmaktadır."}], "relatedTitle": "Diğer Transfer Seçenekleri", "related": [{"href": "/transfers", "label": "Tüm Transfer Seçenekleri"}, {"href": "/book-now", "label": "Uçuşunuzu Ayırtın"}, {"href": "/contact", "label": "Bize Ulaşın"}]}, "de": {"sections": [{"h2": "Was beinhaltet ein privater Transfer?", "ps": ["Wir bieten private Transferdienste vom Flughafen Dalaman, aus Fethiye, Marmaris, Bodrum und anderen regionalen Zentren nach Ölüdeniz — klimatisierte Fahrzeuge, englischsprachige Fahrer und Flugverfolgung für Flughafenabholungen, damit niemand warten muss."]}], "faqTitle": "FAQ", "faqs": [{"q": "Sprechen die Fahrer Englisch?", "a": "Ja, unsere privaten Transferfahrer sprechen Englisch."}], "relatedTitle": "Weitere Transferoptionen", "related": [{"href": "/transfers", "label": "Alle Transferoptionen"}, {"href": "/book-now", "label": "Flug buchen"}, {"href": "/contact", "label": "Kontakt"}]}, "ru": {"sections": [{"h2": "Что включает частный трансфер?", "ps": ["Мы предлагаем услуги частного трансфера из аэропорта Даламан, Фетхие, Мармариса, Бодрума и других региональных центров в Олюдениз — кондиционированные автомобили, англоговорящие водители и отслеживание рейса для встреч в аэропорту, чтобы никому не пришлось ждать."]}], "faqTitle": "FAQ", "faqs": [{"q": "Говорят ли водители по-английски?", "a": "Да, наши водители частного трансфера говорят по-английски."}], "relatedTitle": "Другие варианты трансфера", "related": [{"href": "/transfers", "label": "Все варианты трансфера"}, {"href": "/book-now", "label": "Забронировать полёт"}, {"href": "/contact", "label": "Связаться с нами"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'transfers' })
  const titles = {en:"Private Transfer Service",tr:"Ozel Transfer Hizmeti",de:"Private Transfer Service",ru:"Private Transfer Service"}
  const subs = {en:"Transfer services to and from Oludeniz.",tr:"Oludeniz'e ve oradan transfer hizmetleri.",de:"Transferdienste nach und von Oludeniz.",ru:"Трансферные услуги в Олюдениз и обратно."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="Private Transfer to Paragliding Oludeniz" description="Private transfer service to Oludeniz for your tandem paragliding experience." path="/transfers/private-transfer" serviceType="Transfer Service" />
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
