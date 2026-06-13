import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Transfer to Babadag Launch",tr:"Babadag Kalkis Noktasina Transfer",de:"Transfer to Babadag Launch",ru:"Transfer to Babadag Launch"}
  const d = {en:"Transfer services to and from Oludeniz.",tr:"Oludeniz'e ve oradan transfer hizmetleri.",de:"Transferdienste nach und von Oludeniz.",ru:"Трансферные услуги в Олюдениз и обратно."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/transfers/to-babadag'),
    openGraph: { url: localeUrl(locale, '/transfers/to-babadag'), description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'transfers' })
  const titles = {en:"Transfer to Babadag Launch",tr:"Babadag Kalkis Noktasina Transfer",de:"Transfer to Babadag Launch",ru:"Transfer to Babadag Launch"}
  const subs = {en:"Transfer services to and from Oludeniz.",tr:"Oludeniz'e ve oradan transfer hizmetleri.",de:"Transferdienste nach und von Oludeniz.",ru:"Трансферные услуги в Олюдениз и обратно."}
  const bodies = {en:["Transfer to the Babadağ launch points is included in all our tandem flight packages. For solo pilots, we offer shuttle services to the 1200m, 1700m, and 1960m launch points. Times and frequency depend on demand — contact us to arrange.","Contact us to arrange: WhatsApp +90 536 461 6674"],tr:["Babadağ kalkış noktalarına transfer tüm tandem uçuş paketlerimize dahildir. Solo pilotlar için servis hizmetleri sunuyoruz.","Düzenlemek için bize ulaşın: WhatsApp +90 536 461 6674"],de:["Transfer to the Babadağ launch points is included in all our tandem flight packages. For solo pilots, we offer shuttle services to the 1200m, 1700m, and 1960m launch points. Times and frequency depend on demand — contact us to arrange.","Kontaktieren Sie uns: WhatsApp +90 536 461 6674"],ru:["Transfer to the Babadağ launch points is included in all our tandem flight packages. For solo pilots, we offer shuttle services to the 1200m, 1700m, and 1960m launch points. Times and frequency depend on demand — contact us to arrange.","Свяжитесь с нами: WhatsApp +90 536 461 6674"]}
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
