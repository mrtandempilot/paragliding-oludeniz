import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Paramotor Oludeniz",tr:"Oludeniz Paramotor",de:"Paramotor Oludeniz",ru:"Паратрайк Олюдениз"}
  return {
    alternates: localeAlternates(locale, '/paramotor'), title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'paramotor' })
  const titles = {en:"Paramotor Oludeniz",tr:"Oludeniz Paramotor",de:"Paramotor Oludeniz",ru:"Паратрайк Олюдениз"}
  const subs = {en:"Motorised paragliding along the Oludeniz coastline.",tr:"Oludeniz kıyı şeridinde motorlu paraşüt.",de:"Motorisiertes Paragliding entlang der Oludeniz-Küste.",ru:"Моторизованный парапланеризм вдоль побережья Олюдениз."}
  const bodies: Record<string,string[]> = {
    en: ["Paramotoring (powered paragliding) at Oludeniz allows pilots to explore the stunning coastline from Fethiye to Butterfly Valley without depending on thermals. The flat agricultural land south of Fethiye provides ideal launch and landing conditions.","We offer paramotor flight experiences, training courses, and equipment hire. Tandem paramotoring (flying with a passenger) is available on request.","All paramotor operations require valid SHGM paramotor ratings. The Dalaman Airport control zone (CTR) affects operations south of Oludeniz — full airspace briefing is provided to all pilots.","Contact us for paramotor flight bookings, training enquiries, or equipment hire: +90 536 461 6674"],
    tr: ["Oludeniz'de paramotor (motorlu paraşüt), pilotların termiğe bağlı kalmadan Fethiye'den Kelebek Vadisi'ne kadar olan muhteşem kıyı şeridini keşfetmelerine olanak tanır.","Paramotor uçuş deneyimleri, eğitim kursları ve ekipman kiralama sunuyoruz. Tüm operasyonlar geçerli SHGM paramotor dereceleri gerektirir.","Rezervasyon için: +90 536 461 6674"],
    de: ["Paramotoring (powered paragliding) at Oludeniz allows pilots to explore the stunning coastline from Fethiye to Butterfly Valley without depending on thermals. The flat agricultural land south of Fethiye provides ideal launch and landing conditions.","We offer paramotor flight experiences, training courses, and equipment hire. Tandem paramotoring (flying with a passenger) is available on request.","All paramotor operations require valid SHGM paramotor ratings. The Dalaman Airport control zone (CTR) affects operations south of Oludeniz — full airspace briefing is provided to all pilots.","Contact us for paramotor flight bookings, training enquiries, or equipment hire: +90 536 461 6674"],
    ru: ["Paramotoring (powered paragliding) at Oludeniz allows pilots to explore the stunning coastline from Fethiye to Butterfly Valley without depending on thermals. The flat agricultural land south of Fethiye provides ideal launch and landing conditions.","We offer paramotor flight experiences, training courses, and equipment hire. Tandem paramotoring (flying with a passenger) is available on request.","All paramotor operations require valid SHGM paramotor ratings. The Dalaman Airport control zone (CTR) affects operations south of Oludeniz — full airspace briefing is provided to all pilots.","Contact us for paramotor flight bookings, training enquiries, or equipment hire: +90 536 461 6674"],
  }
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = bodies[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0d/dOEuj7ebfM-MdyvUcunPD.jpg" />
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
