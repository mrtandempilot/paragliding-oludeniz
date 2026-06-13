import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Acro Pilots Meeting Point",tr:"Akro Pilot Buluşma Noktaları",de:"Acro Pilots Meeting Point",ru:"Acro Pilots Meeting Point"}
  const d = {en:"Advanced paragliding for experienced pilots.",tr:"Deneyimli pilotlar için ileri düzey paraşüt.",de:"Fortgeschrittenes Paragliding für erfahrene Piloten.",ru:"Продвинутый парапланеризм для опытных пилотов."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/acro-flights/meeting-points'),
    openGraph: { url: localeAlternates(locale, '/acro-flights/meeting-points').canonical! }, title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'acro' })
  const titles = {en:"Acro Pilots Meeting Point",tr:"Akro Pilot Buluşma Noktaları",de:"Acro Pilots Meeting Point",ru:"Acro Pilots Meeting Point"}
  const subs = {en:"Advanced paragliding for experienced pilots.",tr:"Deneyimli pilotlar için ileri düzey paraşüt.",de:"Fortgeschrittenes Paragliding für erfahrene Piloten.",ru:"Продвинутый парапланеризм для опытных пилотов."}
  const bodies = {en:["The acro flying area is designated over the deep water section of the bay, well clear of tandem flight paths and the beach. Briefing and meetup point is our office at 08:30 on flying mornings.","Contact us for more information: +90 536 461 6674"],tr:["The acro flying area is designated over the deep water section of the bay, well clear of tandem flight paths and the beach. Briefing and meetup point is our office at 08:30 on flying mornings.","Daha fazla bilgi için bize ulaşın: +90 536 461 6674"],de:["The acro flying area is designated over the deep water section of the bay, well clear of tandem flight paths and the beach. Briefing and meetup point is our office at 08:30 on flying mornings.","Kontaktieren Sie uns: +90 536 461 6674"],ru:["The acro flying area is designated over the deep water section of the bay, well clear of tandem flight paths and the beach. Briefing and meetup point is our office at 08:30 on flying mornings.","Свяжитесь с нами: +90 536 461 6674"]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
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
