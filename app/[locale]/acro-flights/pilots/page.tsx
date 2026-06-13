import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Acro Pilots Oludeniz",tr:"Oludeniz Akro Pilotları",de:"Acro Pilots Oludeniz",ru:"Acro Pilots Oludeniz"}
  const d = {en:"Advanced paragliding for experienced pilots.",tr:"Deneyimli pilotlar için ileri düzey paraşüt.",de:"Fortgeschrittenes Paragliding für erfahrene Piloten.",ru:"Продвинутый парапланеризм для опытных пилотов."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/acro-flights/pilots'),
    openGraph: { url: localeAlternates(locale, '/acro-flights/pilots').canonical! }, title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'acro' })
  const titles = {en:"Acro Pilots Oludeniz",tr:"Oludeniz Akro Pilotları",de:"Acro Pilots Oludeniz",ru:"Acro Pilots Oludeniz"}
  const subs = {en:"Advanced paragliding for experienced pilots.",tr:"Deneyimli pilotlar için ileri düzey paraşüt.",de:"Fortgeschrittenes Paragliding für erfahrene Piloten.",ru:"Продвинутый парапланеризм для опытных пилотов."}
  const bodies = {en:["Oludeniz has a resident community of acro pilots and attracts visiting acro specialists from across Europe and beyond. Our team includes pilots with national and international acro competition experience.","Contact us for more information: +90 536 461 6674"],tr:["Oludeniz has a resident community of acro pilots and attracts visiting acro specialists from across Europe and beyond. Our team includes pilots with national and international acro competition experience.","Daha fazla bilgi için bize ulaşın: +90 536 461 6674"],de:["Oludeniz has a resident community of acro pilots and attracts visiting acro specialists from across Europe and beyond. Our team includes pilots with national and international acro competition experience.","Kontaktieren Sie uns: +90 536 461 6674"],ru:["Oludeniz has a resident community of acro pilots and attracts visiting acro specialists from across Europe and beyond. Our team includes pilots with national and international acro competition experience.","Свяжитесь с нами: +90 536 461 6674"]}
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
