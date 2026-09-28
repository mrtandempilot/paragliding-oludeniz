import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'
import ServiceSchema from '@/components/shared/ServiceSchema'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Flight Rules Oludeniz",tr:"Oludeniz Uçuş Kuralları",de:"Flugregeln Oludeniz",ru:"Правила полётов Олюдениз", zh: "厄卢代尼兹飞行规则"}
  const d = {en:"Local airspace rules and procedures for solo pilots.",tr:"Solo pilotlar için yerel hava sahası kuralları ve prosedürleri.",de:"Lokale Luftraumregeln und -verfahren für Solopiloten.",ru:"Правила местного воздушного пространства и процедуры для соло-пилотов.", zh: "单人飞行员的本地空域规则和程序。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/solo-paragliding/flight-rules'),
    openGraph: { url: localeUrl(locale, '/solo-paragliding/flight-rules'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'solo' })
  const titles = {en:"Flight Rules Oludeniz",tr:"Oludeniz Uçuş Kuralları",de:"Flugregeln Oludeniz",ru:"Правила полётов Олюдениз", zh: "厄卢代尼兹飞行规则"}
  const subs = {en:"Local airspace rules and procedures for solo pilots.",tr:"Solo pilotlar için yerel hava sahası kuralları ve prosedürleri.",de:"Lokale Luftraumregeln und -verfahren für Solopiloten.",ru:"Правила местного воздушного пространства и процедуры для соло-пилотов.", zh: "单人飞行员的本地空域规则和程序。"}
  const bodies = {en:["Babadağ airspace is uncontrolled but subject to Turkish Civil Aviation Authority (SHGM) regulations. All pilots must hold a valid SHGM-recognized licence and third-party liability insurance.","Launch procedures: a queuing system operates at all launch points during busy periods. Priority is given to tandem operations during peak hours (10:00-15:00). Solo pilots should launch during the morning (before 10:00) or late afternoon (after 15:00) on busy summer days.","Circuit: the standard landing circuit at Oludeniz beach is a left-hand circuit with a north-south final approach. There is no radio requirement, but we strongly recommend using our ground-to-air frequency (details on briefing arrival).","No-fly zones: do not fly over Oludeniz Lagoon National Park below 300m AGL without permission. Blue Lagoon beach approach requires care during peak beach hours."],tr:["Tüm pilotlar geçerli bir SHGM tanınan lisans ve üçüncü şahıs sorumluluk sigortasına sahip olmalıdır. Yoğun saatlerde kalkış noktalarında kuyruk sistemi işletilmektedir."],de:["Alle Piloten müssen eine gültige SHGM-anerkannte Lizenz und Haftpflichtversicherung besitzen. In Stoßzeiten gilt am Startplatz ein Warteschlangensystem."],ru:["Все пилоты должны иметь действующую лицензию, признанную SHGM, и страхование гражданской ответственности. В оживлённые часы на стартовых площадках действует система очереди."], zh: ["巴巴达山空域为非管制空域，但须遵守土耳其民航总局（SHGM）的规定。所有飞行员都必须持有土耳其民航总局认可的有效执照和第三方责任险。","起飞程序：繁忙时段所有起飞点均实行排队制度。高峰时段（10:00–15:00）优先安排双人飞行。在繁忙的夏日，单人飞行员应在上午（10:00 前）或傍晚（15:00 后）起飞。","航线：厄卢代尼兹海滩的标准降落航线为左航线，最后进近为南北方向。无强制无线电要求，但我们强烈建议使用我们的地空通话频率（到达后简报时提供详情）。","禁飞区：未经许可，请勿在离地 300 米以下飞越厄卢代尼兹泻湖国家公园。在海滩高峰时段进近蓝色泻湖海滩时需格外小心。"]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <ServiceSchema name="Solo Paragliding Flight Rules Oludeniz" description="Flight rules and regulations for solo paragliding in Oludeniz and Babadağ." path="/solo-paragliding/flight-rules" serviceType="Paragliding Service" />
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
