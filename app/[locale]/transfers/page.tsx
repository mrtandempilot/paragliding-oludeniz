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
  const t = {en:"Transfers to Oludeniz and Babadag",tr:"Oludeniz ve Babadag Transferleri",de:"Transfers nach Oludeniz und Babadag",ru:"Трансферы в Олюдениз и Бабадаг"}
  const d = {en:"Getting to Oludeniz from Dalaman Airport, Fethiye, Marmaris and beyond.",tr:"Dalaman Havalimanı, Fethiye, Marmaris ve ötesinden Oludeniz'e ulaşım.",de:"Von Dalaman Flughafen, Fethiye, Marmaris nach Oludeniz.",ru:"Из аэропорта Даламан, Фетхие, Мармариса и других мест в Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/transfers'),
    openGraph: { url: localeUrl(locale, '/transfers'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "How Do You Get to Ölüdeniz for Your Paragliding Flight?", "ps": ["Most visitors arrive via Dalaman Airport (55km, about 1 hour by road), or overland from Fethiye (15km, ~20 minutes) or Marmaris (120km, ~2 hours). Whichever way you're arriving, transfer options are available for every leg of the journey."]}, {"h2": "Is Transfer to Babadağ Included in My Flight?", "ps": ["Yes — transfer to the Babadağ launch is included in every tandem flight package. We pick you up from Ölüdeniz beach and return you there after your flight, so no separate transport arrangement is needed for the mountain leg."]}, {"h2": "What If You're Coming From Somewhere Else in the Region?", "ps": ["Private transfers from Bodrum or other regional centres are available on request. Contact us for pricing and availability based on your dates and group size."]}], "faqTitle": "FAQ – Getting to Ölüdeniz", "faqs": [{"q": "How far is Dalaman Airport from Ölüdeniz?", "a": "About 55km, roughly a 1-hour drive. See our Dalaman Airport transfer page for options."}, {"q": "Is hotel pickup included with my flight booking?", "a": "Transfer to the Babadağ launch is included with every tandem package. Free hotel pickup from Fethiye is also available with your flight booking."}, {"q": "Can I arrange a private transfer from Marmaris or Bodrum?", "a": "Yes, private transfers are available on request from Marmaris, Bodrum and other regional centres — contact us for pricing."}], "relatedTitle": "Transfer Options", "related": [{"href": "/transfers/dalaman-airport", "label": "Dalaman Airport Transfer"}, {"href": "/transfers/from-fethiye", "label": "From Fethiye"}, {"href": "/transfers/from-marmaris", "label": "From Marmaris"}, {"href": "/transfers/private-transfer", "label": "Private Transfer"}, {"href": "/transfers/to-babadag", "label": "To Babadağ Launch"}]}, "tr": {"sections": [{"h2": "Paraşüt Uçuşunuz İçin Ölüdeniz'e Nasıl Ulaşılır?", "ps": ["Çoğu ziyaretçi Dalaman Havalimanı üzerinden (55 km, karayoluyla yaklaşık 1 saat) veya karayoluyla Fethiye'den (15 km, ~20 dakika) ya da Marmaris'ten (120 km, ~2 saat) gelir. Hangi yoldan gelirseniz gelin, yolculuğunuzun her aşaması için transfer seçenekleri mevcuttur."]}, {"h2": "Babadağ'a Transfer Uçuşuma Dahil mi?", "ps": ["Evet — Babadağ kalkışına transfer her tandem uçuş paketine dahildir. Sizi Ölüdeniz plajından alır, uçuşunuzdan sonra geri bırakırız; dağ bölümü için ayrı bir ulaşım ayarlamanıza gerek yoktur."]}, {"h2": "Bölgede Başka Bir Yerden Geliyorsanız?", "ps": ["Bodrum veya diğer bölgesel merkezlerden özel transferler talep üzerine mevcuttur. Tarihleriniz ve grup büyüklüğünüze göre fiyatlandırma ve uygunluk için bize ulaşın."]}], "faqTitle": "SSS – Ölüdeniz'e Ulaşım", "faqs": [{"q": "Dalaman Havalimanı Ölüdeniz'e ne kadar uzaklıkta?", "a": "Yaklaşık 55 km, araçla bir saat. Seçenekler için Dalaman Havalimanı transfer sayfamıza bakın."}, {"q": "Uçuş rezervasyonuma otel alımı dahil mi?", "a": "Babadağ kalkışına transfer her tandem pakete dahildir. Ayrıca uçuş rezervasyonunuzla Fethiye'den ücretsiz otel alımı da mevcuttur."}, {"q": "Marmaris veya Bodrum'dan özel transfer ayarlayabilir miyim?", "a": "Evet, Marmaris, Bodrum ve diğer bölgesel merkezlerden talep üzerine özel transfer mevcuttur — fiyatlandırma için bize ulaşın."}], "relatedTitle": "Transfer Seçenekleri", "related": [{"href": "/transfers/dalaman-airport", "label": "Dalaman Havalimanı Transferi"}, {"href": "/transfers/from-fethiye", "label": "Fethiye'den"}, {"href": "/transfers/from-marmaris", "label": "Marmaris'ten"}, {"href": "/transfers/private-transfer", "label": "Özel Transfer"}, {"href": "/transfers/to-babadag", "label": "Babadağ Kalkışına"}]}, "de": {"sections": [{"h2": "Wie kommt man für seinen Paragliding-Flug nach Ölüdeniz?", "ps": ["Die meisten Besucher reisen über den Flughafen Dalaman an (55km, etwa 1 Stunde mit dem Auto) oder auf dem Landweg von Fethiye (15km, ~20 Minuten) oder Marmaris (120km, ~2 Stunden). Egal wie Sie anreisen — für jede Etappe der Reise gibt es Transfermöglichkeiten."]}, {"h2": "Ist der Transfer zum Babadağ in meinem Flug enthalten?", "ps": ["Ja — der Transfer zum Babadağ-Startplatz ist in jedem Tandempaket enthalten. Wir holen Sie vom Strand von Ölüdeniz ab und bringen Sie nach Ihrem Flug zurück — für die Bergetappe ist keine separate Organisation nötig."]}, {"h2": "Was, wenn Sie von woanders in der Region kommen?", "ps": ["Private Transfers ab Bodrum oder anderen regionalen Zentren sind auf Anfrage verfügbar. Kontaktieren Sie uns für Preise und Verfügbarkeit je nach Reisedaten und Gruppengröße."]}], "faqTitle": "FAQ – Anreise nach Ölüdeniz", "faqs": [{"q": "Wie weit ist der Flughafen Dalaman von Ölüdeniz entfernt?", "a": "Etwa 55km, rund eine Stunde mit dem Auto. Optionen finden Sie auf unserer Seite zum Dalaman-Flughafentransfer."}, {"q": "Ist die Hotelabholung in meiner Flugbuchung enthalten?", "a": "Der Transfer zum Babadağ-Startplatz ist in jedem Tandempaket enthalten. Kostenlose Hotelabholung ab Fethiye ist ebenfalls mit Ihrer Flugbuchung verfügbar."}, {"q": "Kann ich einen privaten Transfer ab Marmaris oder Bodrum organisieren?", "a": "Ja, private Transfers ab Marmaris, Bodrum und anderen regionalen Zentren sind auf Anfrage verfügbar — kontaktieren Sie uns für Preise."}], "relatedTitle": "Transferoptionen", "related": [{"href": "/transfers/dalaman-airport", "label": "Dalaman-Flughafentransfer"}, {"href": "/transfers/from-fethiye", "label": "Ab Fethiye"}, {"href": "/transfers/from-marmaris", "label": "Ab Marmaris"}, {"href": "/transfers/private-transfer", "label": "Privater Transfer"}, {"href": "/transfers/to-babadag", "label": "Zum Babadağ-Startplatz"}]}, "ru": {"sections": [{"h2": "Как добраться до Олюдениза для вашего полёта на параплане?", "ps": ["Большинство гостей прибывают через аэропорт Даламан (55км, около 1 часа по дороге), либо по суше из Фетхие (15км, ~20 минут) или Мармариса (120км, ~2 часа). Каким бы путём вы ни приехали, для каждого этапа поездки доступны варианты трансфера."]}, {"h2": "Включён ли трансфер на Бабадаг в мой полёт?", "ps": ["Да — трансфер на старт Бабадага включён в каждый тандемный пакет. Мы забираем вас с пляжа Олюдениз и привозим обратно после полёта, так что отдельно организовывать транспорт до горы не нужно."]}, {"h2": "Что если вы едете из другого места в регионе?", "ps": ["Частные трансферы из Бодрума или других региональных центров доступны по запросу. Свяжитесь с нами для уточнения цен и наличия в зависимости от ваших дат и размера группы."]}], "faqTitle": "FAQ – как добраться до Олюдениза", "faqs": [{"q": "Как далеко аэропорт Даламан от Олюдениза?", "a": "Около 55км, примерно час на машине. Варианты смотрите на нашей странице трансфера из аэропорта Даламан."}, {"q": "Включён ли трансфер из отеля в бронирование полёта?", "a": "Трансфер на старт Бабадага включён в каждый тандемный пакет. Бесплатный трансфер из отеля в Фетхие также доступен при бронировании полёта."}, {"q": "Можно ли организовать частный трансфер из Мармариса или Бодрума?", "a": "Да, частные трансферы доступны по запросу из Мармариса, Бодрума и других региональных центров — свяжитесь с нами для уточнения цен."}], "relatedTitle": "Варианты трансфера", "related": [{"href": "/transfers/dalaman-airport", "label": "Трансфер из аэропорта Даламан"}, {"href": "/transfers/from-fethiye", "label": "Из Фетхие"}, {"href": "/transfers/from-marmaris", "label": "Из Мармариса"}, {"href": "/transfers/private-transfer", "label": "Частный трансфер"}, {"href": "/transfers/to-babadag", "label": "На старт Бабадага"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'transfers' })
  const titles = {en:"Transfers to Oludeniz and Babadag",tr:"Oludeniz ve Babadag Transferleri",de:"Transfers nach Oludeniz und Babadag",ru:"Трансферы в Олюдениз и Бабадаг"}
  const subs = {en:"Getting to Oludeniz from Dalaman Airport, Fethiye, Marmaris and beyond.",tr:"Dalaman Havalimanı, Fethiye, Marmaris ve ötesinden Oludeniz'e ulaşım.",de:"Von Dalaman Flughafen, Fethiye, Marmaris nach Oludeniz.",ru:"Из аэропорта Даламан, Фетхие, Мармариса и других мест в Олюдениз."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="Babadağ & Airport Transfers" description="Transfers to Babadağ launch points, Dalaman airport, Fethiye and Marmaris." path="/transfers" serviceType="Transfer Service" />
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
