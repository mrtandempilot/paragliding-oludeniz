import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Tour Operator Packages",tr:"Tur Operatörü Paketleri",de:"Reiseveranstalter-Pakete",ru:"Пакеты для туроператоров"}
  const d = {en:"We are the preferred paragliding partner for tour operators in the Fethiye region.",tr:"Fethiye bölgesindeki tur operatörlerinin tercih ettiği paraşüt ortağıyız.",de:"Wir sind der bevorzugte Paragliding-Partner für Reiseveranstalter in der Fethiye-Region.",ru:"Мы являемся предпочтительным партнёром по парапланеризму для туроператоров региона Фетхие."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/groups/tour-operators'), title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'groups' })
  const titles = {en:"Tour Operator Packages",tr:"Tur Operatörü Paketleri",de:"Reiseveranstalter-Pakete",ru:"Пакеты для туроператоров"}
  const subs = {en:"We are the preferred paragliding partner for tour operators in the Fethiye region.",tr:"Fethiye bölgesindeki tur operatörlerinin tercih ettiği paraşüt ortağıyız.",de:"Wir sind der bevorzugte Paragliding-Partner für Reiseveranstalter in der Fethiye-Region.",ru:"Мы являемся предпочтительным партнёром по парапланеризму для туроператоров региона Фетхие."}
  const bodies = {en:["We have established relationships with tour operators, travel agents, and hotel concierges throughout the Fethiye and Oludeniz region. We offer competitive trade rates, reliable operations, and a seamless guest experience.","What we provide for tour operators: confirmed booking system with same-day slots available, dedicated trade pricing, co-branded materials, emergency contact protocols, and a 99%+ reliability record.","Contact our trade desk to establish a partnership account: trade@paragliding-oludeniz.com or WhatsApp +90 536 461 6674."],tr:["Fethiye ve Oludeniz bölgesindeki tur operatörleri, seyahat acentaları ve otel conciergeleriyle köklü ilişkilerimiz bulunmaktadır. Ticari fiyatlandırma için bize ulaşın."],de:["Wir haben etablierte Beziehungen zu Reiseveranstaltern in der Region Fethiye und Oludeniz. Kontaktieren Sie uns für Handelspreis-Konditionen."],ru:["У нас налаженные отношения с туроператорами региона Фетхие и Олюдениз. Свяжитесь с нами для партнёрских условий."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c09/2htlcwkJ6pcLBY7gPtf7z.jpg" />
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
