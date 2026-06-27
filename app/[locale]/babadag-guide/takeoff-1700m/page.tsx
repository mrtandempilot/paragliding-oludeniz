import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"1700m Launch Point",tr:"1700m Kalkış Noktası",de:"1700m Startplatz",ru:"Стартовая площадка 1700м"}
  const d = {en:"The 1700m launch gives longer flight times, better thermals, and more dramatic views over the Blue Lagoon.",tr:"1700m kalkış daha uzun uçuş süresi, daha iyi termikler ve Mavi Lagün üzerinde daha dramatik manzaralar sunar.",de:"Der 1700m Start bietet längere Flugzeiten, bessere Thermik und dramatischere Aussichten über die Blaue Lagune.",ru:"Площадка 1700м обеспечивает более длительное время полёта, лучшие термики и более впечатляющие виды."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/babadag-guide/takeoff-1700m'),
    openGraph: { url: localeUrl(locale, '/babadag-guide/takeoff-1700m'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${t[locale as keyof typeof t]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'babadagGuide' })
  const titles = {en:"1700m Launch Point",tr:"1700m Kalkış Noktası",de:"1700m Startplatz",ru:"Стартовая площадка 1700м"}
  const subs = {en:"The 1700m launch gives longer flight times, better thermals, and more dramatic views over the Blue Lagoon.",tr:"1700m kalkış daha uzun uçuş süresi, daha iyi termikler ve Mavi Lagün üzerinde daha dramatik manzaralar sunar.",de:"Der 1700m Start bietet längere Flugzeiten, bessere Thermik und dramatischere Aussichten über die Blaue Lagune.",ru:"Площадка 1700м обеспечивает более длительное время полёта, лучшие термики и более впечатляющие виды."}
  const bodies = {en:["The 1700m launch gives longer flight times, better thermals, and more dramatic views over the Blue Lagoon. Contact us for access requirements and booking."],tr:["1700m kalkış daha uzun uçuş süresi, daha iyi termikler ve Mavi Lagün üzerinde daha dramatik manzaralar sunar. Erişim gereksinimleri ve rezervasyon için bize ulaşın."],de:["Der 1700m Start bietet längere Flugzeiten, bessere Thermik und dramatischere Aussichten über die Blaue Lagune. Kontaktieren Sie uns für Zugangsanforderungen und Buchung."],ru:["Площадка 1700м обеспечивает более длительное время полёта, лучшие термики и более впечатляющие виды. Свяжитесь с нами для получения информации о доступе и бронировании."]}
  type L = keyof typeof titles
  const title = titles[locale as L]||titles.en
  const sub = subs[locale as L]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Babada\\u011f 1700m Takeoff Guide\", \"description\": \"Guide to the 1700m high-altitude launch site on Babada\\u011f for tandem and XC pilots.\", \"url\": \"https://atmosparagliding.com/babadag-guide/takeoff-1700m\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://atmosparagliding.com\"}}" }} />
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
