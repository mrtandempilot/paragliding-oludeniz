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
  const t = {en:"Fethiye to Oludeniz Transfer",tr:"Fethiye Oludeniz Transfer",de:"Fethiye to Oludeniz Transfer",ru:"Fethiye to Oludeniz Transfer", zh: "费特希耶至厄卢代尼兹接送"}
  const d = {en:"Transfer services to and from Oludeniz.",tr:"Oludeniz'e ve oradan transfer hizmetleri.",de:"Transferdienste nach und von Oludeniz.",ru:"Трансферные услуги в Олюдениз и обратно.", zh: "往返厄卢代尼兹的接送服务。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/transfers/from-fethiye'),
    openGraph: { url: localeUrl(locale, '/transfers/from-fethiye'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/transfers/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "How Do You Get from Fethiye to Ölüdeniz?", "ps": ["Fethiye is 15km from Ölüdeniz, about 20 minutes by road. Regular dolmuş (minibus) services run between Fethiye bus station and Ölüdeniz throughout the day. Take the dolmuş or a taxi to Ölüdeniz and meet us at our office — the transfer up the mountain is included in your flight."]}], "faqTitle": "FAQ", "faqs": [{"q": "Is hotel pickup from Fethiye included?", "a": "No — hotel pickup is not included. Make your own way to our Ölüdeniz office (dolmuş or taxi, about 20 minutes); the transfer up Babadağ is included in your flight."}], "relatedTitle": "More Transfer Options", "related": [{"href": "/transfers", "label": "All Transfer Options"}, {"href": "/book-now", "label": "Book Your Flight"}, {"href": "/contact", "label": "Contact Us"}]}, "tr": {"sections": [{"h2": "Fethiye'den Ölüdeniz'e Nasıl Ulaşılır?", "ps": ["Fethiye, Ölüdeniz'e 15 km uzaklıktadır, karayoluyla yaklaşık 20 dakika. Fethiye otogarı ile Ölüdeniz arasında gün boyu düzenli dolmuş seferleri vardır. Dolmuş veya taksiyle Ölüdeniz'e gelip ofisimizde buluşun — dağa transfer uçuşa dahildir."]}], "faqTitle": "SSS", "faqs": [{"q": "Fethiye'den otel alımı dahil mi?", "a": "Hayır — otelden alış dahil değil. Ölüdeniz ofisimize kendiniz gelin (dolmuş veya taksiyle yaklaşık 20 dakika); Babadağ'a transfer uçuşa dahildir."}], "relatedTitle": "Diğer Transfer Seçenekleri", "related": [{"href": "/transfers", "label": "Tüm Transfer Seçenekleri"}, {"href": "/book-now", "label": "Uçuşunuzu Ayırtın"}, {"href": "/contact", "label": "Bize Ulaşın"}]}, "de": {"sections": [{"h2": "Wie kommt man von Fethiye nach Ölüdeniz?", "ps": ["Fethiye liegt 15km von Ölüdeniz entfernt, etwa 20 Minuten mit dem Auto. Zwischen dem Busbahnhof Fethiye und Ölüdeniz verkehren den ganzen Tag über regelmäßige Dolmuş (Kleinbusse). Fahren Sie mit dem Dolmuş oder Taxi nach Ölüdeniz und treffen Sie uns in unserem Büro — der Bergtransfer ist im Flug enthalten."]}], "faqTitle": "FAQ", "faqs": [{"q": "Ist eine Hotelabholung ab Fethiye enthalten?", "a": "Nein — eine Hotelabholung ist nicht enthalten. Kommen Sie selbst zu unserem Büro in Ölüdeniz (Dolmuş oder Taxi, ca. 20 Minuten); der Transfer auf den Babadağ ist im Flug enthalten."}], "relatedTitle": "Weitere Transferoptionen", "related": [{"href": "/transfers", "label": "Alle Transferoptionen"}, {"href": "/book-now", "label": "Flug buchen"}, {"href": "/contact", "label": "Kontakt"}]}, "ru": {"sections": [{"h2": "Как добраться из Фетхие в Олюдениз?", "ps": ["Фетхие находится в 15км от Олюдениза, около 20 минут по дороге. Между автовокзалом Фетхие и Олюденизом весь день курсируют регулярные долмуши (маршрутки). Доберитесь на долмуше или такси до Олюдениза и встретьтесь с нами в нашем офисе — трансфер на гору входит в стоимость полёта."]}], "faqTitle": "FAQ", "faqs": [{"q": "Входит ли трансфер из отеля в Фетхие?", "a": "Нет — трансфер из отеля не входит. Доберитесь до нашего офиса в Олюденизе сами (долмуш или такси, около 20 минут); подъём на Бабадаг входит в стоимость полёта."}], "relatedTitle": "Другие варианты трансфера", "related": [{"href": "/transfers", "label": "Все варианты трансфера"}, {"href": "/book-now", "label": "Забронировать полёт"}, {"href": "/contact", "label": "Связаться с нами"}]}, "zh": {"sections": [{"h2": "如何从费特希耶前往厄卢代尼兹？", "ps": ["费特希耶距厄卢代尼兹 15 公里，车程约 20 分钟。全天都有往返费特希耶汽车站和厄卢代尼兹的小巴（dolmuş）。您可乘坐小巴或出租车前往厄卢代尼兹，到我们的办公室集合——上山接送已包含在飞行费用中。"]}], "faqTitle": "常见问题", "faqs": [{"q": "包含从费特希耶酒店接送吗？", "a": "不包含酒店接送。请自行前往我们在厄卢代尼兹的办公室（乘小巴或出租车约 20 分钟）；上山接送已包含在飞行费用中。"}], "relatedTitle": "更多接送选项", "related": [{"href": "/transfers", "label": "全部接送选项"}, {"href": "/book-now", "label": "预订飞行"}, {"href": "/contact", "label": "联系我们"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'transfers' })
  const titles = {en:"Fethiye to Oludeniz Transfer",tr:"Fethiye Oludeniz Transfer",de:"Fethiye to Oludeniz Transfer",ru:"Fethiye to Oludeniz Transfer", zh: "费特希耶至厄卢代尼兹接送"}
  const subs = {en:"Transfer services to and from Oludeniz.",tr:"Oludeniz'e ve oradan transfer hizmetleri.",de:"Transferdienste nach und von Oludeniz.",ru:"Трансферные услуги в Олюдениз и обратно.", zh: "往返厄卢代尼兹的接送服务。"}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="Transfer from Fethiye to Oludeniz Paragliding" description="Comfortable transfer from Fethiye to Oludeniz for your tandem paragliding flight." path="/transfers/from-fethiye" serviceType="Transfer Service" />
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
