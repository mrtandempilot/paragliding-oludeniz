import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Our Safety Record",tr:"Güvenlik Rekorumuz",de:"Unsere Sicherheitsbilanz",ru:"Наш рекорд безопасности"}
  const d = {en:"25+ years. Thousands of flights. Zero serious incidents.",tr:"25+ yıl. Binlerce uçuş. Sıfır ciddi kaza.",de:"25+ Jahre. Tausende Flüge. Null ernste Zwischenfälle.",ru:"25+ лет. Тысячи полётов. Ноль серьёзных инцидентов."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/safety-record'),
    openGraph: { url: localeUrl(locale, '/safety-record') }, title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'safetyRecord' })
  const titles = {en:"Our Safety Record",tr:"Güvenlik Rekorumuz",de:"Unsere Sicherheitsbilanz",ru:"Наш рекорд безопасности"}
  const subs = {en:"25+ years. Thousands of flights. Zero serious incidents.",tr:"25+ yıl. Binlerce uçuş. Sıfır ciddi kaza.",de:"25+ Jahre. Tausende Flüge. Null ernste Zwischenfälle.",ru:"25+ лет. Тысячи полётов. Ноль серьёзных инцидентов."}
  const bodies = {en:["Our safety record is the foundation of everything we do. Since our first flight in 1999, we have completed over 50,000 tandem flights without a single serious passenger injury. This is not luck — it is the result of strict protocols, rigorous equipment maintenance, and a culture where safety always comes before revenue.","Pilot certification: all our pilots hold current SHGM (Turkish Civil Aviation Authority) tandem ratings, plus international BHPA or DHV certifications. Annual refresher training is mandatory. Pilots who are not current do not fly, regardless of demand.","Equipment: we replace main canopies on a strict cycle, regardless of apparent condition. Reserve parachutes are repacked every 180 days by certified riggers. Harnesses and helmets are inspected daily and replaced at the first sign of wear.","Weather protocols: we monitor three weather stations continuously and hold daily morning briefings. We have a no-fly policy for crosswinds above 8km/h, gusts above 25km/h, or any frontal activity. We would rather refund a booking than fly in marginal conditions.","We are proud members of the Oludeniz Paragliding Association and adhere to all Turkish Civil Aviation regulations and international best-practice guidelines."],tr:["Güvenlik rekorumuz yaptığımız her şeyin temelini oluşturur. 1999'daki ilk uçuşumuzdan bu yana tek bir ciddi yolcu yaralanması olmaksızın 50.000'den fazla tandem uçuşu tamamladık.","Pilotlarımız SHGM sertifikalı ve uluslararası BHPA veya DHV sertifikalarına sahiptir. Hava koşulları protokolleri katıdır ve sınır koşullarda uçmak yerine rezervasyonu iade etmeyi tercih ederiz."],de:["Unser Sicherheitsrekord ist die Grundlage von allem, was wir tun. Seit unserem ersten Flug 1999 haben wir über 50.000 Tandemflüge ohne eine einzige ernste Passagierverletzung abgeschlossen.","Alle unsere Piloten sind SHGM-zertifiziert und haben internationale BHPA- oder DHV-Zertifizierungen. Wir haben strikte Wetterproktokolle."],ru:["Наш рекорд безопасности — основа всего, что мы делаем. С 1999 года мы выполнили более 50 000 тандемных полётов без единой серьёзной травмы пассажира.","Все наши пилоты имеют сертификацию SHGM и международные сертификаты BHPA или DHV. У нас строгие погодные протоколы."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
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
