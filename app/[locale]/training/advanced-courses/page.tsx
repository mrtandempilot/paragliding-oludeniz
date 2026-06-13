import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Advanced Paragliding Courses",tr:"İleri Düzey Paraşüt Kursları",de:"Fortgeschrittene Paragliding-Kurse",ru:"Продвинутые курсы парапланеризма"}
  const d = {en:"Take your flying to the next level with expert coaching.",tr:"Uzman koçlukla uçuşunuzu bir sonraki seviyeye taşıyın.",de:"Heben Sie Ihr Fliegen mit Expertencoaching auf die nächste Stufe.",ru:"Поднимите свои полёты на новый уровень с экспертным коучингом."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/training/advanced-courses'),
    openGraph: { url: localeAlternates(locale, '/training/advanced-courses').canonical! }, title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'training' })
  const titles = {en:"Advanced Paragliding Courses",tr:"İleri Düzey Paraşüt Kursları",de:"Fortgeschrittene Paragliding-Kurse",ru:"Продвинутые курсы парапланеризма"}
  const subs = {en:"Take your flying to the next level with expert coaching.",tr:"Uzman koçlukla uçuşunuzu bir sonraki seviyeye taşıyın.",de:"Heben Sie Ihr Fliegen mit Expertencoaching auf die nächste Stufe.",ru:"Поднимите свои полёты на новый уровень с экспертным коучингом."}
  const bodies = {en:["Our advanced courses are for pilots holding P2/CP or equivalent who want to develop XC skills, improve thermalling technique, or prepare for SIV training. Oludeniz is one of the best places in the world to advance your skills.","Course options include: XC coaching (route reading, thermal centering, decision making), mountain flying clinics (ridge soaring, valley flying, lee-side awareness), and competition preparation for the Oludeniz Air Games.","All advanced coaching is led by our most experienced pilots, many of whom are competition pilots with national and international results.","Contact us to discuss a tailored programme based on your current skill level and goals."],tr:["İleri düzey kurslarımız P2/CP veya eşdeğer alan pilotlar için tasarlanmıştır. XC koçluğu, dağ uçuş klinikleri ve yarışma hazırlığı seçenekleri sunuyoruz."],de:["Unsere Fortgeschrittenenkurse sind für Piloten mit P2/CP oder höher. Wir bieten XC-Coaching, Bergflugkliniken und Wettkampfvorbereitung an."],ru:["Наши продвинутые курсы для пилотов с уровнем P2/CP. Предлагаем XC коучинг, клиники горных полётов и подготовку к соревнованиям."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0c/Dn0br3flHariTrqYqhISR.jpg" />
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
