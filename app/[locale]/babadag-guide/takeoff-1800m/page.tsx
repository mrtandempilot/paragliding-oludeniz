import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"1800m Launch Point",tr:"1800m Kalkış Noktası",de:"1800m Startplatz",ru:"Стартовая площадка 1800м"}
  const d = {en:"The 1800m launch is used by advanced pilots and selected high-altitude tandem flights on good thermal days.",tr:"1800m kalkış, ileri düzey pilotlar ve iyi termik günlerinde seçilmiş yüksek irtifa tandem uçuşlar için kullanılır.",de:"Der 1800m Start wird von fortgeschrittenen Piloten und ausgewählten Hochaltitude-Tandemflügen genutzt.",ru:"Площадка 1800м используется опытными пилотами и выбранными высотными тандемными полётами."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/babadag-guide/takeoff-1800m'),
    openGraph: { url: localeUrl(locale, '/babadag-guide/takeoff-1800m'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${t[locale as keyof typeof t]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'babadagGuide' })
  const titles = {en:"1800m Launch Point",tr:"1800m Kalkış Noktası",de:"1800m Startplatz",ru:"Стартовая площадка 1800м"}
  const subs = {en:"The 1800m launch is used by advanced pilots and selected high-altitude tandem flights on good thermal days.",tr:"1800m kalkış, ileri düzey pilotlar ve iyi termik günlerinde seçilmiş yüksek irtifa tandem uçuşlar için kullanılır.",de:"Der 1800m Start wird von fortgeschrittenen Piloten und ausgewählten Hochaltitude-Tandemflügen genutzt.",ru:"Площадка 1800м используется опытными пилотами и выбранными высотными тандемными полётами."}
  const bodies = {en:["The 1800m launch is used by advanced pilots and selected high-altitude tandem flights on good thermal days. Contact us for access requirements and booking."],tr:["1800m kalkış, ileri düzey pilotlar ve iyi termik günlerinde seçilmiş yüksek irtifa tandem uçuşlar için kullanılır. Erişim gereksinimleri ve rezervasyon için bize ulaşın."],de:["Der 1800m Start wird von fortgeschrittenen Piloten und ausgewählten Hochaltitude-Tandemflügen genutzt. Kontaktieren Sie uns für Zugangsanforderungen und Buchung."],ru:["Площадка 1800м используется опытными пилотами и выбранными высотными тандемными полётами. Свяжитесь с нами для получения информации о доступе и бронировании."]}
  type L = keyof typeof titles
  const title = titles[locale as L]||titles.en
  const sub = subs[locale as L]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
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
