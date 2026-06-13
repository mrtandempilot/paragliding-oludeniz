import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Tandem Pilot Conversion Course",tr:"Tandem Pilot Dönüşüm Kursu",de:"Tandempiloten-Umschulungskurs",ru:"Курс переквалификации в тандем-пилоты"}
  const d = {en:"Become a certified tandem paragliding pilot.",tr:"Sertifikalı tandem paraşüt pilotu olun.",de:"Werden Sie ein zertifizierter Tandemparagliding-Pilot.",ru:"Станьте сертифицированным тандем-пилотом."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/training/tandem-conversion'),
    openGraph: { url: localeUrl(locale, '/training/tandem-conversion') }, title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'training' })
  const titles = {en:"Tandem Pilot Conversion Course",tr:"Tandem Pilot Dönüşüm Kursu",de:"Tandempiloten-Umschulungskurs",ru:"Курс переквалификации в тандем-пилоты"}
  const subs = {en:"Become a certified tandem paragliding pilot.",tr:"Sertifikalı tandem paraşüt pilotu olun.",de:"Werden Sie ein zertifizierter Tandemparagliding-Pilot.",ru:"Станьте сертифицированным тандем-пилотом."}
  const bodies = {en:["Our tandem conversion course is designed for licensed solo pilots (minimum P4/Advance rating) who wish to carry passengers commercially. The course leads to SHGM tandem certification, valid for commercial operations in Turkey.","Course content: tandem equipment handling, pre-flight passenger briefings, tandem launch and landing techniques, emergency procedures with a passenger, passenger management in flight, and regulatory requirements.","Course duration: 10 days minimum. You will need to complete a minimum number of tandem flights and pass both written and practical examinations.","This course is only available to holders of valid paragliding licences. Contact us for prerequisites, course dates, and fees."],tr:["Tandem dönüşüm kursu, yolcu taşımak isteyen lisanslı solo pilotlar (minimum P4) için tasarlanmıştır. Kurs SHGM tandem sertifikasyonuna yönlendirir."],de:["Unser Tandem-Umschulungskurs richtet sich an lizenzierte Solopiloten (min. P4), die Passagiere kommerziell befördern möchten. Der Kurs führt zur SHGM-Tandemzertifizierung."],ru:["Курс переквалификации предназначен для лицензированных соло-пилотов (мин. P4), желающих коммерчески перевозить пассажиров. Курс ведёт к сертификации SHGM тандем."]}
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
