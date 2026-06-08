import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Flight Rules Oludeniz",tr:"Oludeniz Uçuş Kuralları",de:"Flugregeln Oludeniz",ru:"Правила полётов Олюдениз"}
  return { title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'solo' })
  const titles = {en:"Flight Rules Oludeniz",tr:"Oludeniz Uçuş Kuralları",de:"Flugregeln Oludeniz",ru:"Правила полётов Олюдениз"}
  const subs = {en:"Local airspace rules and procedures for solo pilots.",tr:"Solo pilotlar için yerel hava sahası kuralları ve prosedürleri.",de:"Lokale Luftraumregeln und -verfahren für Solopiloten.",ru:"Правила местного воздушного пространства и процедуры для соло-пилотов."}
  const bodies = {en:["Babadağ airspace is uncontrolled but subject to Turkish Civil Aviation Authority (SHGM) regulations. All pilots must hold a valid SHGM-recognized licence and third-party liability insurance.","Launch procedures: a queuing system operates at all launch points during busy periods. Priority is given to tandem operations during peak hours (10:00-15:00). Solo pilots should launch during the morning (before 10:00) or late afternoon (after 15:00) on busy summer days.","Circuit: the standard landing circuit at Oludeniz beach is a left-hand circuit with a north-south final approach. There is no radio requirement, but we strongly recommend using our ground-to-air frequency (details on briefing arrival).","No-fly zones: do not fly over Oludeniz Lagoon National Park below 300m AGL without permission. Blue Lagoon beach approach requires care during peak beach hours."],tr:["Tüm pilotlar geçerli bir SHGM tanınan lisans ve üçüncü şahıs sorumluluk sigortasına sahip olmalıdır. Yoğun saatlerde kalkış noktalarında kuyruk sistemi işletilmektedir."],de:["Alle Piloten müssen eine gültige SHGM-anerkannte Lizenz und Haftpflichtversicherung besitzen. In Stoßzeiten gilt am Startplatz ein Warteschlangensystem."],ru:["Все пилоты должны иметь действующую лицензию, признанную SHGM, и страхование гражданской ответственности. В оживлённые часы на стартовых площадках действует система очереди."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0d/dOEuj7ebfM-MdyvUcunPD.jpg" />
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
