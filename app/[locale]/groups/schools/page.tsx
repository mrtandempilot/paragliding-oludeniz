import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"School and University Group Flights",tr:"Okul ve Üniversite Grup Uçuşları",de:"Schul- und Universitätsgruppen-Flüge",ru:"Школьные и университетские групповые полёты"}
  return { title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'groups' })
  const titles = {en:"School and University Group Flights",tr:"Okul ve Üniversite Grup Uçuşları",de:"Schul- und Universitätsgruppen-Flüge",ru:"Школьные и университетские групповые полёты"}
  const subs = {en:"Educational paragliding experiences for school and university groups.",tr:"Okul ve üniversite grupları için eğitici paraşüt deneyimleri.",de:"Lehrreiche Paragliding-Erlebnisse für Schul- und Universitätsgruppen.",ru:"Образовательные парапланерные мероприятия для школьных и университетских групп."}
  const bodies = {en:["We work with schools, colleges, and universities visiting Oludeniz on educational or activity trips. Our student group packages include supervised flights, a pre-flight education session about meteorology and flight physics, and a post-flight debrief.","All student participants under 18 require signed parental consent forms. We provide template consent documents on request. Minimum recommended age is 12 years.","School group pricing is available for groups of 10+. We work with tour operators and school trip organizers to coordinate the flying within your broader itinerary."],tr:["Eğitim veya aktivite gezileri için okullar ve üniversitelerle çalışıyoruz. 18 yaş altı katılımcılar için veli onay formları gereklidir."],de:["Wir arbeiten mit Schulen und Universitäten zusammen. Alle Teilnehmer unter 18 Jahren benötigen eine elterliche Einverständniserklärung."],ru:["Мы работаем со школами и университетами. Все участники до 18 лет нуждаются в подписанных формах согласия родителей."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
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
