import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"1960m Summit Launch",tr:"1960m Zirve Kalkışı",de:"1960m Gipfelstart",ru:"Старт с вершины 1960м"}
  const d = {en:"The 1960m summit is the highest launch point on Babadağ, used by competition pilots and experienced XC flyers.",tr:"1960m zirve, yarışma pilotları ve deneyimli XC uçucular tarafından kullanılan Babadağ'ın en yüksek kalkış noktasıdır.",de:"Der 1960m Gipfel ist der höchste Startpunkt am Babadağ, genutzt von Wettbewerbspiloten und erfahrenen XC-Fliegern.",ru:"Вершина 1960м — самая высокая стартовая точка на Бабадаге, используемая соревновательными пилотами."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/babadag-guide/takeoff-1900m'),
    openGraph: { url: localeUrl(locale, '/babadag-guide/takeoff-1900m'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${t[locale as keyof typeof t]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'babadagGuide' })
  const titles = {en:"1960m Summit Launch",tr:"1960m Zirve Kalkışı",de:"1960m Gipfelstart",ru:"Старт с вершины 1960м"}
  const subs = {en:"The 1960m summit is the highest launch point on Babadağ, used by competition pilots and experienced XC flyers.",tr:"1960m zirve, yarışma pilotları ve deneyimli XC uçucular tarafından kullanılan Babadağ'ın en yüksek kalkış noktasıdır.",de:"Der 1960m Gipfel ist der höchste Startpunkt am Babadağ, genutzt von Wettbewerbspiloten und erfahrenen XC-Fliegern.",ru:"Вершина 1960м — самая высокая стартовая точка на Бабадаге, используемая соревновательными пилотами."}
  const bodies = {en:["The 1960m summit is the highest launch point on Babadağ, used by competition pilots and experienced XC flyers. Contact us for access requirements and booking."],tr:["1960m zirve, yarışma pilotları ve deneyimli XC uçucular tarafından kullanılan Babadağ'ın en yüksek kalkış noktasıdır. Erişim gereksinimleri ve rezervasyon için bize ulaşın."],de:["Der 1960m Gipfel ist der höchste Startpunkt am Babadağ, genutzt von Wettbewerbspiloten und erfahrenen XC-Fliegern. Kontaktieren Sie uns für Zugangsanforderungen und Buchung."],ru:["Вершина 1960м — самая высокая стартовая точка на Бабадаге, используемая соревновательными пилотами. Свяжитесь с нами для получения информации о доступе и бронировании."]}
  type L = keyof typeof titles
  const title = titles[locale as L]||titles.en
  const sub = subs[locale as L]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Babada\\u011f 1900m Summit Launch Guide\", \"description\": \"Guide to the summit launch at 1900m+ on Babada\\u011f \\u2014 for competition and experienced XC pilots.\", \"url\": \"https://atmosparagliding.com/babadag-guide/takeoff-1900m\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://atmosparagliding.com\"}}" }} />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c08/BbYEw0ihhZaLcaN29vTrs.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3"><BreadcrumbNav items={[{ label: title }]} /></div>
      </div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl space-y-4">
          {body.map((p: string, i: number) => <p key={i} className="text-slate-600 leading-relaxed">{p}</p>)}
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
