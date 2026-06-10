import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"XC Flying Seasons Oludeniz",tr:"Oludeniz XC Uçuş Mevsimleri",de:"XC-Flugsaisons Oludeniz",ru:"Сезоны XC Олюдениз"}
  return {
    alternates: localeAlternates(locale, '/cross-country-flights/seasons'), title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'crossCountry' })
  const titles = {en:"XC Flying Seasons Oludeniz",tr:"Oludeniz XC Uçuş Mevsimleri",de:"XC-Flugsaisons Oludeniz",ru:"Сезоны XC Олюдениз"}
  const subs = {en:"Detailed information for licensed paragliding pilots.",tr:"Lisanslı paraşütçüler için ayrıntılı bilgi.",de:"Detaillierte Informationen für lizenzierte Paragliding-Piloten.",ru:"Подробная информация для лицензированных пилотов."}
  const bodies = {en:["April-May: thermals build from 11:00, moderate strength, ideal for learning XC routes. June-July: strong summer thermals, best for ambitious routes. August: powerful, can be turbulent in the afternoon. September-October: classic conditions return, Air Games competition month in October.","Contact us for full briefing packs, retrieve coordination, and local knowledge."],tr:["Nisan-Mayıs: termikler saat 11'den itibaren oluşur, orta güç. Haziran-Temmuz: güçlü yaz termikleri. Ekim: Air Games yarışma ayı.","Tam brifing paketi, geri alma koordinasyonu ve yerel bilgi için bize ulaşın."],de:["April-Mai: Thermik ab 11:00, moderat. Juni-Juli: starke Sommerthermik. Oktober: Air Games-Wettbewerbsmonat.","Kontaktieren Sie uns für vollständige Briefingpakete und Abholkoordination."],ru:["Апрель-май: термики с 11:00, умеренные. Июнь-июль: сильные летние термики. Октябрь: месяц соревнований Air Games.","Свяжитесь с нами для полных брифинг-пакетов и координации подбора."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7bd4/rtDjiycQ-CNoCYjmlrN3-.jpg" />
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
