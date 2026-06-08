import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Instructor Information",tr:"Eğitmen Bilgileri",de:"Instruktorinformationen",ru:"Информация об инструкторах"}
  return { title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'training' })
  const titles = {en:"Instructor Information",tr:"Eğitmen Bilgileri",de:"Instruktorinformationen",ru:"Информация об инструкторах"}
  const subs = {en:"Our instructors are among the most experienced paragliding coaches in the region.",tr:"Eğitmenlerimiz bölgedeki en deneyimli paraşüt antrenörleri arasındadır.",de:"Unsere Instruktoren gehören zu den erfahrensten Paragliding-Coaches der Region.",ru:"Наши инструкторы — одни из самых опытных тренеров по парапланеризму в регионе."}
  const bodies = {en:["All our instructors hold current SHGM instructor ratings plus international certifications from BHPA or DHV. The instructors who run our courses have been teaching at Babadağ for an average of 12 years.","We keep student-instructor ratios low: maximum 4:1 for beginner courses, 3:1 for advanced coaching, and 6:1 for SIV clinics. This ensures you get maximum flight time and one-on-one coaching.","Our head instructor has competed at national and international level and holds an advanced coaching qualification. All instructors complete annual instructor refresher training."],tr:["Tüm eğitmenlerimiz SHGM eğitmen derecelerine ve uluslararası BHPA veya DHV sertifikalarına sahiptir. Öğrenci-eğitmen oranını düşük tutuyoruz."],de:["Alle unsere Instruktoren haben SHGM-Instruktoren-Ratings und internationale Zertifizierungen. Wir halten die Schüler-Instruktoren-Verhältnisse niedrig."],ru:["Все наши инструкторы имеют рейтинги инструкторов SHGM и международные сертификаты. Мы поддерживаем низкие соотношения студент-инструктор."]}
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
