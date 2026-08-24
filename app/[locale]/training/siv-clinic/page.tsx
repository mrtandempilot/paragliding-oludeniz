import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'
import ServiceSchema from '@/components/shared/ServiceSchema'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"SIV Clinic Oludeniz",tr:"Oludeniz SIV Kliniği",de:"SIV-Klinik Oludeniz",ru:"SIV клиника Олюдениз"}
  const d = {en:"Safety and Incident Vivid training over the water at Oludeniz.",tr:"Oludeniz'de su üzerinde Güvenlik ve Olay Canlı eğitimi.",de:"SIV-Training über dem Wasser in Oludeniz.",ru:"SIV обучение над водой в Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/training/siv-clinic'),
    openGraph: { url: localeUrl(locale, '/training/siv-clinic'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'training' })
  const titles = {en:"SIV Clinic Oludeniz",tr:"Oludeniz SIV Kliniği",de:"SIV-Klinik Oludeniz",ru:"SIV клиника Олюдениз"}
  const subs = {en:"Safety and Incident Vivid training over the water at Oludeniz.",tr:"Oludeniz'de su üzerinde Güvenlik ve Olay Canlı eğitimi.",de:"SIV-Training über dem Wasser in Oludeniz.",ru:"SIV обучение над водой в Олюдениз."}
  const bodies = {en:["SIV (Simulation d'Incident en Vol) clinics teach pilots how to actively manage their paraglider in extreme situations — collapses, spirals, stalls, and emergency procedures. Training is conducted over water with boat rescue support.","Oludeniz is one of the best SIV venues in the world. The protected bay provides safe water training, the thermals are consistent for practising active flying, and the altitude available from Babadağ allows extended exercises.","Our SIV courses are run in partnership with certified SIV instructors. All participants must hold a minimum P3/CP rating and have appropriate third-party insurance.","Course duration: 5 days. Maximum 6 participants. All training flights are recorded by drone for debrief analysis. Contact us for next available dates."],tr:["SIV klinikleri pilotlara ekstrem durumlarda paraşütlerini aktif olarak yönetmeyi öğretir. Eğitim, tekne kurtarma desteğiyle su üzerinde gerçekleştirilir. Oludeniz, dünyanın en iyi SIV mekanlarından biridir."],de:["SIV-Kurse lehren Piloten, ihren Gleitschirm in extremen Situationen aktiv zu managen. Das Training findet über Wasser mit Bootsrettungsunterstützung statt. Oludeniz ist einer der besten SIV-Standorte der Welt."],ru:["SIV клиники учат пилотов активно управлять парапланом в экстремальных ситуациях. Тренировки проводятся над водой с поддержкой лодки. Олюдениз — одно из лучших мест для SIV."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <ServiceSchema name="SIV Clinic Paragliding Oludeniz" description="SIV paragliding safety clinic in Oludeniz — essential training for all pilots." path="/training/siv-clinic" serviceType="Paragliding Training Course" />
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
