import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Dalaman Airport to Oludeniz Transfer",tr:"Dalaman Havalimanı Oludeniz Transfer",de:"Dalaman Airport to Oludeniz Transfer",ru:"Dalaman Airport to Oludeniz Transfer"}
  const d = {en:"Transfer services to and from Oludeniz.",tr:"Oludeniz'e ve oradan transfer hizmetleri.",de:"Transferdienste nach und von Oludeniz.",ru:"Трансферные услуги в Олюдениз и обратно."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/transfers/dalaman-airport'),
    openGraph: { url: localeUrl(locale, '/transfers/dalaman-airport') }, title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'transfers' })
  const titles = {en:"Dalaman Airport to Oludeniz Transfer",tr:"Dalaman Havalimanı Oludeniz Transfer",de:"Dalaman Airport to Oludeniz Transfer",ru:"Dalaman Airport to Oludeniz Transfer"}
  const subs = {en:"Transfer services to and from Oludeniz.",tr:"Oludeniz'e ve oradan transfer hizmetleri.",de:"Transferdienste nach und von Oludeniz.",ru:"Трансферные услуги в Олюдениз и обратно."}
  const bodies = {en:["Dalaman Airport (IATA: DLM) is the nearest international airport to Oludeniz, approximately 55km away (1 hour drive). We can arrange private transfers from the airport directly to your hotel or our office.","Contact us to arrange: WhatsApp +90 536 461 6674"],tr:["Dalaman Havalimanı, Oludeniz'e en yakın uluslararası havalimanıdır (yaklaşık 55 km). Havalimanından doğrudan otelinize veya ofisimize özel transfer ayarlayabiliriz.","Düzenlemek için bize ulaşın: WhatsApp +90 536 461 6674"],de:["Dalaman Airport (IATA: DLM) is the nearest international airport to Oludeniz, approximately 55km away (1 hour drive). We can arrange private transfers from the airport directly to your hotel or our office.","Kontaktieren Sie uns: WhatsApp +90 536 461 6674"],ru:["Dalaman Airport (IATA: DLM) is the nearest international airport to Oludeniz, approximately 55km away (1 hour drive). We can arrange private transfers from the airport directly to your hotel or our office.","Свяжитесь с нами: WhatsApp +90 536 461 6674"]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
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
