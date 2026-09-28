import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'
import ServiceSchema from '@/components/shared/ServiceSchema'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"School and University Group Flights",tr:"Okul ve Üniversite Grup Uçuşları",de:"Schul- und Universitätsgruppen-Flüge",ru:"Школьные и университетские групповые полёты", zh: "中小学及大学团体飞行"}
  const d = {en:"Educational paragliding experiences for school and university groups.",tr:"Okul ve üniversite grupları için eğitici paraşüt deneyimleri.",de:"Lehrreiche Paragliding-Erlebnisse für Schul- und Universitätsgruppen.",ru:"Образовательные парапланерные мероприятия для школьных и университетских групп.", zh: "面向中小学和大学团体的教育性滑翔伞体验。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/groups/schools'),
    openGraph: { url: localeUrl(locale, '/groups/schools'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'groups' })
  const titles = {en:"School and University Group Flights",tr:"Okul ve Üniversite Grup Uçuşları",de:"Schul- und Universitätsgruppen-Flüge",ru:"Школьные и университетские групповые полёты", zh: "中小学及大学团体飞行"}
  const subs = {en:"Educational paragliding experiences for school and university groups.",tr:"Okul ve üniversite grupları için eğitici paraşüt deneyimleri.",de:"Lehrreiche Paragliding-Erlebnisse für Schul- und Universitätsgruppen.",ru:"Образовательные парапланерные мероприятия для школьных и университетских групп.", zh: "面向中小学和大学团体的教育性滑翔伞体验。"}
  const bodies = {en:["We work with schools, colleges, and universities visiting Oludeniz on educational or activity trips. Our student group packages include supervised flights, a pre-flight education session about meteorology and flight physics, and a post-flight debrief.","All student participants under 18 require signed parental consent forms. We provide template consent documents on request. Minimum recommended age is 12 years.","School group pricing is available for groups of 10+. We work with tour operators and school trip organizers to coordinate the flying within your broader itinerary."],tr:["Eğitim veya aktivite gezileri için okullar ve üniversitelerle çalışıyoruz. 18 yaş altı katılımcılar için veli onay formları gereklidir."],de:["Wir arbeiten mit Schulen und Universitäten zusammen. Alle Teilnehmer unter 18 Jahren benötigen eine elterliche Einverständniserklärung."],ru:["Мы работаем со школами и университетами. Все участники до 18 лет нуждаются в подписанных формах согласия родителей."], zh: ["我们与前来厄卢代尼兹进行教育或活动旅行的中小学、学院和大学合作。我们的学生团体套餐包括有监督的飞行、飞行前关于气象和飞行物理的教育课程，以及飞行后的总结交流。","所有未满 18 岁的学生参与者都需要签署家长同意书。我们可应要求提供同意书模板。建议最低年龄为 12 岁。","10 人以上的团体可享受学校团体价格。我们与旅行社和学校旅行组织者合作，将飞行活动协调安排进您的整体行程中。"]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <ServiceSchema name="School Paragliding Trips Oludeniz" description="School and youth group paragliding trips in Oludeniz with certified instructors." path="/groups/schools" serviceType="Tandem Paragliding Flight" />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c09/2htlcwkJ6pcLBY7gPtf7z.jpg" />
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
