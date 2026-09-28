import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Acro Paragliding Events Oludeniz",tr:"Oludeniz Akro Paraşüt Etkinlikleri",de:"Acro Paragliding Events Oludeniz",ru:"Acro Paragliding Events Oludeniz", zh: "厄卢代尼兹特技滑翔伞活动"}
  const d = {en:"Advanced paragliding for experienced pilots.",tr:"Deneyimli pilotlar için ileri düzey paraşüt.",de:"Fortgeschrittenes Paragliding für erfahrene Piloten.",ru:"Продвинутый парапланеризм для опытных пилотов.", zh: "面向有经验飞行员的进阶滑翔伞。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/acro-flights/events'),
    openGraph: { url: localeUrl(locale, '/acro-flights/events'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'acro' })
  const titles = {en:"Acro Paragliding Events Oludeniz",tr:"Oludeniz Akro Paraşüt Etkinlikleri",de:"Acro Paragliding Events Oludeniz",ru:"Acro Paragliding Events Oludeniz", zh: "厄卢代尼兹特技滑翔伞活动"}
  const subs = {en:"Advanced paragliding for experienced pilots.",tr:"Deneyimli pilotlar için ileri düzey paraşüt.",de:"Fortgeschrittenes Paragliding für erfahrene Piloten.",ru:"Продвинутый парапланеризм для опытных пилотов.", zh: "面向有经验飞行员的进阶滑翔伞。"}
  const bodies = {en:["Oludeniz hosts international acro competitions and freestyle sessions throughout the season. The annual Oludeniz Air Games (October) includes a dedicated acro competition. Contact us for event calendar.","Contact us for more information: +90 536 461 6674"],tr:["Oludeniz hosts international acro competitions and freestyle sessions throughout the season. The annual Oludeniz Air Games (October) includes a dedicated acro competition. Contact us for event calendar.","Daha fazla bilgi için bize ulaşın: +90 536 461 6674"],de:["Oludeniz hosts international acro competitions and freestyle sessions throughout the season. The annual Oludeniz Air Games (October) includes a dedicated acro competition. Contact us for event calendar.","Kontaktieren Sie uns: +90 536 461 6674"],ru:["Oludeniz hosts international acro competitions and freestyle sessions throughout the season. The annual Oludeniz Air Games (October) includes a dedicated acro competition. Contact us for event calendar.","Свяжитесь с нами: +90 536 461 6674"], zh: ["厄卢代尼兹整个飞行季都会举办国际特技比赛和自由式飞行活动。每年十月的厄卢代尼兹航空节（Oludeniz Air Games）设有专门的特技比赛。欢迎联系我们获取活动日程。","如需了解更多信息，请联系我们：+90 536 461 6674"]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Acro Paragliding Events Oludeniz\", \"description\": \"Acrobatic paragliding events and competitions held in Oludeniz, Turkey.\", \"url\": \"https://atmosparagliding.com/acro-flights/events\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://atmosparagliding.com\"}}" }} />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0b/Ma1uD1AUlcpoxL-48cgg4.jpg" />
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
