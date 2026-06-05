import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Pilot Certifications",tr:"Pilot Sertifikaları",de:"Pilotenzertifizierungen",ru:"Сертификаты пилотов"}
  return { title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'certifications' })
  const titles = {en:"Pilot Certifications",tr:"Pilot Sertifikaları",de:"Pilotenzertifizierungen",ru:"Сертификаты пилотов"}
  const subs = {en:"Our pilots hold the highest international paragliding certifications.",tr:"Pilotlarımız en yüksek uluslararası paraşüt sertifikalarına sahiptir.",de:"Unsere Piloten halten die höchsten internationalen Paragliding-Zertifizierungen.",ru:"Наши пилоты имеют высшие международные сертификаты парапланеризма."}
  const bodies = {en:["All our pilots are certified by SHGM (Sivil Havacılık Genel Müdürlüğü) — the Turkish Civil Aviation Authority. This is a legal requirement to operate commercial tandem flights in Turkey.","In addition to Turkish certification, our senior pilots hold ratings from BHPA (British Hang Gliding and Paragliding Association) or DHV (German), the two most respected international paragliding bodies. These ratings require written examinations, practical flight assessments, and ongoing continuing education.","All pilots hold current First Aid certification and complete biannual refresher courses. Emergency procedures are practised regularly at the launch and landing zones.","Our tandem pilots have a combined total of over 200,000 tandem flights. The most experienced members of our team have been flying from Babadağ since the late 1990s."],tr:["Tüm pilotlarımız SHGM (Sivil Havacılık Genel Müdürlüğü) tarafından sertifikalandırılmıştır. Kıdemli pilotlarımız ayrıca BHPA veya DHV derecelerine sahiptir.","Tüm pilotlar geçerli İlk Yardım sertifikasına sahiptir. En deneyimli ekip üyelerimiz 1990'ların sonundan bu yana Babadağ'dan uçmaktadır."],de:["Alle unsere Piloten sind von SHGM zertifiziert. Unsere erfahrenen Piloten haben zusätzlich BHPA- oder DHV-Ratings.","Alle Piloten haben aktuelle Erste-Hilfe-Zertifizierung. Unsere erfahrensten Teammitglieder fliegen seit den späten 1990er Jahren vom Babadağ."],ru:["Все наши пилоты сертифицированы SHGM. Старшие пилоты имеют также рейтинги BHPA или DHV.","Все пилоты имеют актуальные сертификаты первой помощи. Наши самые опытные члены команды летают с Бабадага с конца 1990-х годов."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" />
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
