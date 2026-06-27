import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Babadag Teleferik (Cable Car)",tr:"Babadag Teleferik",de:"Babadag Seilbahn",ru:"Канатная дорога Бабадаг"}
  const d = {en:"The Babadağ cable car — from sea level to 1960m.",tr:"Babadag teleferik — deniz seviyesinden 1960m'ye.",de:"Die Babadağ-Seilbahn — vom Meeresspiegel auf 1960m.",ru:"Канатная дорога Бабадаг — от уровня моря до 1960м."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/babadag-guide/babadag-teleferik'),
    openGraph: { url: localeUrl(locale, '/babadag-guide/babadag-teleferik'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'babadagGuide' })
  const titles = {en:"Babadag Teleferik (Cable Car)",tr:"Babadag Teleferik",de:"Babadag Seilbahn",ru:"Канатная дорога Бабадаг"}
  const subs = {en:"The Babadağ cable car — from sea level to 1960m.",tr:"Babadag teleferik — deniz seviyesinden 1960m'ye.",de:"Die Babadağ-Seilbahn — vom Meeresspiegel auf 1960m.",ru:"Канатная дорога Бабадаг — от уровня моря до 1960м."}
  const bodies: Record<string,string[]> = {
    en: ["The Babadağ teleferik (cable car) runs from near Oludeniz to the 1960m summit. It operates daily approximately 08:00-20:00 during season. The journey takes about 20 minutes with spectacular views over the bay and Blue Lagoon.","Tickets are purchased at the base station. In peak season (July-August) queues can be 30-60 minutes — visit early or late for shorter waits.","For paragliding: tandem flights use road transfers (faster and more flexible). The teleferik is used by some solo pilots and tourists wanting panoramic views from the summit."],
    tr: ["Babadağ teleferik, Oludeniz yakınından 1960m zirvesine çıkar. Sezon boyunca günlük yaklaşık 08:00-20:00 saatleri arasında çalışır. Yolculuk yaklaşık 20 dakika sürer.","Biletler alt istasyondan satın alınır. Zirve sezonunda (Temmuz-Ağustos) kuyruklar 30-60 dakika olabilir.","Tandem uçuşlarımız kara transferi kullanır (daha hızlı ve esnek)."],
    de: ["The Babadağ teleferik (cable car) runs from near Oludeniz to the 1960m summit. It operates daily approximately 08:00-20:00 during season. The journey takes about 20 minutes with spectacular views over the bay and Blue Lagoon.","Tickets are purchased at the base station. In peak season (July-August) queues can be 30-60 minutes — visit early or late for shorter waits.","For paragliding: tandem flights use road transfers (faster and more flexible). The teleferik is used by some solo pilots and tourists wanting panoramic views from the summit."],
    ru: ["The Babadağ teleferik (cable car) runs from near Oludeniz to the 1960m summit. It operates daily approximately 08:00-20:00 during season. The journey takes about 20 minutes with spectacular views over the bay and Blue Lagoon.","Tickets are purchased at the base station. In peak season (July-August) queues can be 30-60 minutes — visit early or late for shorter waits.","For paragliding: tandem flights use road transfers (faster and more flexible). The teleferik is used by some solo pilots and tourists wanting panoramic views from the summit."],
  }
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = bodies[locale]||bodies.en
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Babada\\u011f Teleferik Cable Car Guide\", \"description\": \"Guide to the Babada\\u011f cable car (teleferik) \\u2014 schedule, prices and how to book.\", \"url\": \"https://atmosparagliding.com/babadag-guide/babadag-teleferik\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://atmosparagliding.com\"}}" }} />
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
