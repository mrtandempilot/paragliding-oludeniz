import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'
import ServiceSchema from '@/components/shared/ServiceSchema'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Tandem Pilot Conversion Course",tr:"Tandem Pilot Dönüşüm Kursu",de:"Tandempiloten-Umschulungskurs",ru:"Курс переквалификации в тандем-пилоты", zh: "双人飞行员转换课程"}
  const d = {en:"Become a certified tandem paragliding pilot.",tr:"Sertifikalı tandem paraşüt pilotu olun.",de:"Werden Sie ein zertifizierter Tandemparagliding-Pilot.",ru:"Станьте сертифицированным тандем-пилотом.", zh: "成为认证的双人滑翔伞飞行员。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/training/tandem-conversion'),
    openGraph: { url: localeUrl(locale, '/training/tandem-conversion'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'training' })
  const titles = {en:"Tandem Pilot Conversion Course",tr:"Tandem Pilot Dönüşüm Kursu",de:"Tandempiloten-Umschulungskurs",ru:"Курс переквалификации в тандем-пилоты", zh: "双人飞行员转换课程"}
  const subs = {en:"Become a certified tandem paragliding pilot.",tr:"Sertifikalı tandem paraşüt pilotu olun.",de:"Werden Sie ein zertifizierter Tandemparagliding-Pilot.",ru:"Станьте сертифицированным тандем-пилотом.", zh: "成为认证的双人滑翔伞飞行员。"}
  const bodies = {en:["Our tandem conversion course is designed for licensed solo pilots (minimum P4/Advance rating) who wish to carry passengers commercially. The course leads to SHGM tandem certification, valid for commercial operations in Turkey.","Course content: tandem equipment handling, pre-flight passenger briefings, tandem launch and landing techniques, emergency procedures with a passenger, passenger management in flight, and regulatory requirements.","Course duration: 10 days minimum. You will need to complete a minimum number of tandem flights and pass both written and practical examinations.","This course is only available to holders of valid paragliding licences. Contact us for prerequisites, course dates, and fees."],tr:["Tandem dönüşüm kursu, yolcu taşımak isteyen lisanslı solo pilotlar (minimum P4) için tasarlanmıştır. Kurs SHGM tandem sertifikasyonuna yönlendirir."],de:["Unser Tandem-Umschulungskurs richtet sich an lizenzierte Solopiloten (min. P4), die Passagiere kommerziell befördern möchten. Der Kurs führt zur SHGM-Tandemzertifizierung."],ru:["Курс переквалификации предназначен для лицензированных соло-пилотов (мин. P4), желающих коммерчески перевозить пассажиров. Курс ведёт к сертификации SHGM тандем."], zh: ["我们的双人转换课程专为希望以商业形式搭载乘客的持证单人飞行员（至少 P4/高级资质）设计。课程结业可获得土耳其民航总局（SHGM）双人飞行认证，可在土耳其从事商业运营。","课程内容：双人装备操作、飞行前的乘客讲解、双人起飞和降落技术、带乘客时的紧急程序、飞行中的乘客管理，以及法规要求。","课程时长：至少 10 天。您需要完成最低数量的双人飞行，并通过笔试和实操考试。","本课程仅面向持有有效滑翔伞执照的飞行员。请联系我们了解先决条件、课程日期和费用。"]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <ServiceSchema name="Tandem Pilot Conversion Course Oludeniz" description="Tandem pilot conversion training in Oludeniz — become a certified tandem instructor." path="/training/tandem-conversion" serviceType="Paragliding Training Course" />
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
