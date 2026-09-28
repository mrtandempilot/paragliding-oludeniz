import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Pilot Certifications",tr:"Pilot Sertifikaları",de:"Pilotenzertifizierungen",ru:"Сертификаты пилотов", zh: "飞行员资质认证"}
  const d = {en:"Our pilots hold the highest international paragliding certifications.",tr:"Pilotlarımız en yüksek uluslararası paraşüt sertifikalarına sahiptir.",de:"Unsere Piloten halten die höchsten internationalen Paragliding-Zertifizierungen.",ru:"Наши пилоты имеют высшие международные сертификаты парапланеризма.", zh: "我们的飞行员拥有最高级别的国际滑翔伞资质认证。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/certifications'),
    openGraph: { url: localeUrl(locale, '/certifications'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'certifications' })
  const titles = {en:"Pilot Certifications",tr:"Pilot Sertifikaları",de:"Pilotenzertifizierungen",ru:"Сертификаты пилотов", zh: "飞行员资质认证"}
  const subs = {en:"Our pilots hold the highest international paragliding certifications.",tr:"Pilotlarımız en yüksek uluslararası paraşüt sertifikalarına sahiptir.",de:"Unsere Piloten halten die höchsten internationalen Paragliding-Zertifizierungen.",ru:"Наши пилоты имеют высшие международные сертификаты парапланеризма.", zh: "我们的飞行员拥有最高级别的国际滑翔伞资质认证。"}
  const bodies = {en:["All our pilots are certified by SHGM (Sivil Havacılık Genel Müdürlüğü) — the Turkish Civil Aviation Authority. This is a legal requirement to operate commercial tandem flights in Turkey.","In addition to Turkish certification, our senior pilots hold ratings from BHPA (British Hang Gliding and Paragliding Association) or DHV (German), the two most respected international paragliding bodies. These ratings require written examinations, practical flight assessments, and ongoing continuing education.","All pilots hold current First Aid certification and complete biannual refresher courses. Emergency procedures are practised regularly at the launch and landing zones.","Our tandem pilots have a combined total of over 200,000 tandem flights. The most experienced members of our team have been flying from Babadağ since the late 1990s."],tr:["Tüm pilotlarımız SHGM (Sivil Havacılık Genel Müdürlüğü) tarafından sertifikalandırılmıştır. Kıdemli pilotlarımız ayrıca BHPA veya DHV derecelerine sahiptir.","Tüm pilotlar geçerli İlk Yardım sertifikasına sahiptir. En deneyimli ekip üyelerimiz 1990'ların sonundan bu yana Babadağ'dan uçmaktadır."],de:["Alle unsere Piloten sind von SHGM zertifiziert. Unsere erfahrenen Piloten haben zusätzlich BHPA- oder DHV-Ratings.","Alle Piloten haben aktuelle Erste-Hilfe-Zertifizierung. Unsere erfahrensten Teammitglieder fliegen seit den späten 1990er Jahren vom Babadağ."],ru:["Все наши пилоты сертифицированы SHGM. Старшие пилоты имеют также рейтинги BHPA или DHV.","Все пилоты имеют актуальные сертификаты первой помощи. Наши самые опытные члены команды летают с Бабадага с конца 1990-х годов."], zh: ["我们所有的飞行员都持有土耳其民航总局 SHGM（Sivil Havacılık Genel Müdürlüğü）的认证。这是在土耳其经营商业双人飞行的法定要求。","除土耳其认证外，我们的资深飞行员还持有 BHPA（英国悬挂滑翔与滑翔伞协会）或 DHV（德国）的资质，这是两个最受尊敬的国际滑翔伞机构。这些资质需要通过笔试、实际飞行考核以及持续的继续教育。","所有飞行员都持有有效的急救证书，并每半年完成一次复训课程。我们会定期在起飞区和降落区演练紧急程序。","我们的双人飞行员累计完成了超过 200,000 次双人飞行。团队中经验最丰富的成员自 20 世纪 90 年代末就开始在巴巴达山飞行。"]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Paragliding Certifications and Qualifications\", \"description\": \"Certifications and qualifications required for paragliding in Turkey and internationally.\", \"url\": \"https://atmosparagliding.com/certifications\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://atmosparagliding.com\"}}" }} />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0e/5dF2dxA0ErV0Pcg9kh6CJ.jpg" />
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
