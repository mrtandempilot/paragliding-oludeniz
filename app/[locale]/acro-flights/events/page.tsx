import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Acro Paragliding Events Oludeniz",tr:"Oludeniz Akro Paraşüt Etkinlikleri",de:"Acro Paragliding Events Oludeniz",ru:"Acro Paragliding Events Oludeniz"}
  return {
    alternates: localeAlternates(locale, '/acro-flights/events'), title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'acro' })
  const titles = {en:"Acro Paragliding Events Oludeniz",tr:"Oludeniz Akro Paraşüt Etkinlikleri",de:"Acro Paragliding Events Oludeniz",ru:"Acro Paragliding Events Oludeniz"}
  const subs = {en:"Advanced paragliding for experienced pilots.",tr:"Deneyimli pilotlar için ileri düzey paraşüt.",de:"Fortgeschrittenes Paragliding für erfahrene Piloten.",ru:"Продвинутый парапланеризм для опытных пилотов."}
  const bodies = {en:["Oludeniz hosts international acro competitions and freestyle sessions throughout the season. The annual Oludeniz Air Games (October) includes a dedicated acro competition. Contact us for event calendar.","Contact us for more information: +90 536 461 6674"],tr:["Oludeniz hosts international acro competitions and freestyle sessions throughout the season. The annual Oludeniz Air Games (October) includes a dedicated acro competition. Contact us for event calendar.","Daha fazla bilgi için bize ulaşın: +90 536 461 6674"],de:["Oludeniz hosts international acro competitions and freestyle sessions throughout the season. The annual Oludeniz Air Games (October) includes a dedicated acro competition. Contact us for event calendar.","Kontaktieren Sie uns: +90 536 461 6674"],ru:["Oludeniz hosts international acro competitions and freestyle sessions throughout the season. The annual Oludeniz Air Games (October) includes a dedicated acro competition. Contact us for event calendar.","Свяжитесь с нами: +90 536 461 6674"]}
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
