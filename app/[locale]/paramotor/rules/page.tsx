import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Paramotor Rules Turkey",tr:"Türkiye Paramotor Kuralları",de:"Paramotor Rules Turkey",ru:"Paramotor Rules Turkey", zh: "土耳其动力伞规定"}
  const d = {en:"Powered paragliding information for Oludeniz.",tr:"Oludeniz için motorlu paraşüt bilgileri.",de:"Motorisiertes Paragliding-Informationen für Oludeniz.",ru:"Информация о моторизованном парапланеризме для Олюдениз.", zh: "厄卢代尼兹动力滑翔伞信息。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/paramotor/rules'),
    openGraph: { url: localeUrl(locale, '/paramotor/rules'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'paramotor' })
  const titles = {en:"Paramotor Rules Turkey",tr:"Türkiye Paramotor Kuralları",de:"Paramotor Rules Turkey",ru:"Paramotor Rules Turkey", zh: "土耳其动力伞规定"}
  const subs = {en:"Powered paragliding information for Oludeniz.",tr:"Oludeniz için motorlu paraşüt bilgileri.",de:"Motorisiertes Paragliding-Informationen für Oludeniz.",ru:"Информация о моторизованном парапланеризме для Олюдениз.", zh: "厄卢代尼兹动力滑翔伞信息。"}
  const bodies = {en:["Paramotors in Turkey are regulated by SHGM. All pilots must hold a valid paramotor rating. Minimum altitude over populated areas is 300m AGL. Airspace restrictions apply around Dalaman Airport (LTBS).","Contact us for more details: +90 536 461 6674"],tr:["Paramotors in Turkey are regulated by SHGM. All pilots must hold a valid paramotor rating. Minimum altitude over populated areas is 300m AGL. Airspace restrictions apply around Dalaman Airport (LTBS).","Daha fazla bilgi için: +90 536 461 6674"],de:["Paramotors in Turkey are regulated by SHGM. All pilots must hold a valid paramotor rating. Minimum altitude over populated areas is 300m AGL. Airspace restrictions apply around Dalaman Airport (LTBS).","Für weitere Details: +90 536 461 6674"],ru:["Paramotors in Turkey are regulated by SHGM. All pilots must hold a valid paramotor rating. Minimum altitude over populated areas is 300m AGL. Airspace restrictions apply around Dalaman Airport (LTBS).","Для получения подробной информации: +90 536 461 6674"], zh: ["土耳其的动力伞由土耳其民航总局（SHGM）监管。所有飞行员都必须持有有效的动力伞资质。在人口密集区上空的最低高度为离地 300 米。达拉曼机场（LTBS）周边有空域限制。","如需了解更多详情，请联系我们：+90 536 461 6674"]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Paramotor Rules and Regulations Turkey\", \"description\": \"Rules and regulations for paramotoring in Turkey and around Oludeniz.\", \"url\": \"https://atmosparagliding.com/paramotor/rules\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://atmosparagliding.com\"}}" }} />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0d/dOEuj7ebfM-MdyvUcunPD.jpg" />
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
