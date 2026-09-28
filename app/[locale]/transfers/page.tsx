import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'
import ServiceSchema from '@/components/shared/ServiceSchema'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Transfers to Oludeniz and Babadag",tr:"Oludeniz ve Babadag Transferleri",de:"Transfers nach Oludeniz und Babadag",ru:"Трансферы в Олюдениз и Бабадаг", zh: "前往厄卢代尼兹和巴巴达山的接送"}
  const d = {en:"Getting to Oludeniz from Dalaman Airport, Fethiye, Marmaris and beyond.",tr:"Dalaman Havalimanı, Fethiye, Marmaris ve ötesinden Oludeniz'e ulaşım.",de:"Von Dalaman Flughafen, Fethiye, Marmaris nach Oludeniz.",ru:"Из аэропорта Даламан, Фетхие, Мармариса и других мест в Олюдениз.", zh: "从达拉曼机场、费特希耶、马尔马里斯等地前往厄卢代尼兹。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/transfers'),
    openGraph: { url: localeUrl(locale, '/transfers'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'transfers' })
  const titles = {en:"Transfers to Oludeniz and Babadag",tr:"Oludeniz ve Babadag Transferleri",de:"Transfers nach Oludeniz und Babadag",ru:"Трансферы в Олюдениз и Бабадаг", zh: "前往厄卢代尼兹和巴巴达山的接送"}
  const subs = {en:"Getting to Oludeniz from Dalaman Airport, Fethiye, Marmaris and beyond.",tr:"Dalaman Havalimanı, Fethiye, Marmaris ve ötesinden Oludeniz'e ulaşım.",de:"Von Dalaman Flughafen, Fethiye, Marmaris nach Oludeniz.",ru:"Из аэропорта Даламан, Фетхие, Мармариса и других мест в Олюдениз.", zh: "从达拉曼机场、费特希耶、马尔马里斯等地前往厄卢代尼兹。"}
  const bodies: Record<string,string[]> = {
    en: ["Transfer to Babadağ launch is included in all our tandem flight packages — no need to arrange separate transport. We pick you up from Oludeniz beach and return you after your flight.","Arriving at Dalaman Airport (DLM): approximately 55km from Oludeniz, 1 hour drive. Private transfers available. Public transport: airport shuttle to Fethiye, then dolmus to Oludeniz.","From Fethiye (15km): regular dolmus services throughout the day from Fethiye bus station. Journey time approximately 20 minutes. We also offer free hotel pick-up from Fethiye with your flight booking.","From Marmaris (120km), Bodrum, or other locations: private transfers available on request. Contact us for pricing and availability."],
    tr: ["Babadağ kalkışına transfer tüm tandem uçuş paketlerimize dahildir. Dalaman Havalimanı'ndan Oludeniz'e yaklaşık 55 km (1 saat). Fethiye'den (15 km): düzenli dolmus seferleri. Uçuş rezervasyonunuzla Fethiye'den ücretsiz otel transferi sunuyoruz.","Daha uzak noktalardan özel transfer için bize ulaşın."],
    de: ["Transfer to Babadağ launch is included in all our tandem flight packages — no need to arrange separate transport. We pick you up from Oludeniz beach and return you after your flight.","Arriving at Dalaman Airport (DLM): approximately 55km from Oludeniz, 1 hour drive. Private transfers available. Public transport: airport shuttle to Fethiye, then dolmus to Oludeniz.","From Fethiye (15km): regular dolmus services throughout the day from Fethiye bus station. Journey time approximately 20 minutes. We also offer free hotel pick-up from Fethiye with your flight booking.","From Marmaris (120km), Bodrum, or other locations: private transfers available on request. Contact us for pricing and availability."],
    ru: ["Transfer to Babadağ launch is included in all our tandem flight packages — no need to arrange separate transport. We pick you up from Oludeniz beach and return you after your flight.","Arriving at Dalaman Airport (DLM): approximately 55km from Oludeniz, 1 hour drive. Private transfers available. Public transport: airport shuttle to Fethiye, then dolmus to Oludeniz.","From Fethiye (15km): regular dolmus services throughout the day from Fethiye bus station. Journey time approximately 20 minutes. We also offer free hotel pick-up from Fethiye with your flight booking.","From Marmaris (120km), Bodrum, or other locations: private transfers available on request. Contact us for pricing and availability."], zh: ["我们所有的双人飞行套餐都包含前往巴巴达山起飞点的接送——无需另行安排交通。我们从厄卢代尼兹海滩接您，飞行结束后送您回来。","抵达达拉曼机场（DLM）：距厄卢代尼兹约 55 公里，1 小时车程。可提供私人接送。公共交通：乘机场大巴到费特希耶，再换乘小巴前往厄卢代尼兹。","从费特希耶出发（15 公里）：费特希耶汽车站全天都有定期小巴。车程约 20 分钟。预订飞行后，我们还提供费特希耶的免费酒店接送。","从马尔马里斯（120 公里）、博德鲁姆或其他地点出发：可应要求提供私人接送。请联系我们了解价格和可用性。"],
  }
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = bodies[locale]||bodies.en
  return (
    <>
      <ServiceSchema name="Babadağ & Airport Transfers" description="Transfers to Babadağ launch points, Dalaman airport, Fethiye and Marmaris." path="/transfers" serviceType="Transfer Service" />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c08/BbYEw0ihhZaLcaN29vTrs.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3"><BreadcrumbNav items={[{ label: title }]} /></div>
      </div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl space-y-4">
          {body.map((p, i) => <p key={i} className="text-slate-600 leading-relaxed">{p}</p>)}
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
