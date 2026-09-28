import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'
import ServiceSchema from '@/components/shared/ServiceSchema'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Paramotor Oludeniz",tr:"Oludeniz Paramotor",de:"Paramotor Oludeniz",ru:"Паратрайк Олюдениз", zh: "厄卢代尼兹动力伞"}
  const d = {en:"Motorised paragliding along the Oludeniz coastline.",tr:"Oludeniz kıyı şeridinde motorlu paraşüt.",de:"Motorisiertes Paragliding entlang der Oludeniz-Küste.",ru:"Моторизованный парапланеризм вдоль побережья Олюдениз.", zh: "沿厄卢代尼兹海岸线的动力滑翔伞飞行。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/paramotor'),
    openGraph: { url: localeUrl(locale, '/paramotor'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'paramotor' })
  const titles = {en:"Paramotor Oludeniz",tr:"Oludeniz Paramotor",de:"Paramotor Oludeniz",ru:"Паратрайк Олюдениз", zh: "厄卢代尼兹动力伞"}
  const subs = {en:"Motorised paragliding along the Oludeniz coastline.",tr:"Oludeniz kıyı şeridinde motorlu paraşüt.",de:"Motorisiertes Paragliding entlang der Oludeniz-Küste.",ru:"Моторизованный парапланеризм вдоль побережья Олюдениз.", zh: "沿厄卢代尼兹海岸线的动力滑翔伞飞行。"}
  const bodies: Record<string,string[]> = {
    en: ["Paramotoring (powered paragliding) at Oludeniz allows pilots to explore the stunning coastline from Fethiye to Butterfly Valley without depending on thermals. The flat agricultural land south of Fethiye provides ideal launch and landing conditions.","We offer paramotor flight experiences, training courses, and equipment hire. Tandem paramotoring (flying with a passenger) is available on request.","All paramotor operations require valid SHGM paramotor ratings. The Dalaman Airport control zone (CTR) affects operations south of Oludeniz — full airspace briefing is provided to all pilots.","Contact us for paramotor flight bookings, training enquiries, or equipment hire: +90 536 461 6674"],
    tr: ["Oludeniz'de paramotor (motorlu paraşüt), pilotların termiğe bağlı kalmadan Fethiye'den Kelebek Vadisi'ne kadar olan muhteşem kıyı şeridini keşfetmelerine olanak tanır.","Paramotor uçuş deneyimleri, eğitim kursları ve ekipman kiralama sunuyoruz. Tüm operasyonlar geçerli SHGM paramotor dereceleri gerektirir.","Rezervasyon için: +90 536 461 6674"],
    de: ["Paramotoring (powered paragliding) at Oludeniz allows pilots to explore the stunning coastline from Fethiye to Butterfly Valley without depending on thermals. The flat agricultural land south of Fethiye provides ideal launch and landing conditions.","We offer paramotor flight experiences, training courses, and equipment hire. Tandem paramotoring (flying with a passenger) is available on request.","All paramotor operations require valid SHGM paramotor ratings. The Dalaman Airport control zone (CTR) affects operations south of Oludeniz — full airspace briefing is provided to all pilots.","Contact us for paramotor flight bookings, training enquiries, or equipment hire: +90 536 461 6674"],
    ru: ["Paramotoring (powered paragliding) at Oludeniz allows pilots to explore the stunning coastline from Fethiye to Butterfly Valley without depending on thermals. The flat agricultural land south of Fethiye provides ideal launch and landing conditions.","We offer paramotor flight experiences, training courses, and equipment hire. Tandem paramotoring (flying with a passenger) is available on request.","All paramotor operations require valid SHGM paramotor ratings. The Dalaman Airport control zone (CTR) affects operations south of Oludeniz — full airspace briefing is provided to all pilots.","Contact us for paramotor flight bookings, training enquiries, or equipment hire: +90 536 461 6674"], zh: ["在厄卢代尼兹玩动力伞（动力滑翔伞），飞行员无需依赖热气流，就能探索从费特希耶到蝴蝶谷的壮丽海岸线。费特希耶以南平坦的农田提供了理想的起降条件。","我们提供动力伞飞行体验、培训课程和装备租赁。可应要求提供双人动力伞飞行（带乘客飞行）。","所有动力伞运营都需要有效的土耳其民航总局（SHGM）动力伞资质。达拉曼机场管制区（CTR）会影响厄卢代尼兹以南的飞行——我们会为所有飞行员提供完整的空域简报。","如需预订动力伞飞行、咨询培训或租赁装备，请联系我们：+90 536 461 6674"],
  }
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = bodies[locale]||bodies.en
  return (
    <>
      <ServiceSchema name="Paramotor Flight Oludeniz" description="Powered paragliding flights and training along the Oludeniz coastline." path="/paramotor" serviceType="Paramotor Flight" />
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
