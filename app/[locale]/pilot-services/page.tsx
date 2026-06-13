import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'
import ServiceSchema from '@/components/shared/ServiceSchema'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Pilot Services Oludeniz",tr:"Oludeniz Pilot Hizmetleri",de:"Pilotendienste Oludeniz",ru:"Услуги пилотам Олюдениз"}
  const d = {en:"Everything a visiting pilot needs at Babadağ.",tr:"Babadağ'ı ziyaret eden bir pilotun ihtiyacı olan her şey.",de:"Alles, was ein Gastpilot am Babadağ braucht.",ru:"Всё, что нужно приезжему пилоту на Бабадаге."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/pilot-services'),
    openGraph: { url: localeUrl(locale, '/pilot-services'), description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'pilotServices' })
  const titles = {en:"Pilot Services Oludeniz",tr:"Oludeniz Pilot Hizmetleri",de:"Pilotendienste Oludeniz",ru:"Услуги пилотам Олюдениз"}
  const subs = {en:"Everything a visiting pilot needs at Babadağ.",tr:"Babadağ'ı ziyaret eden bir pilotun ihtiyacı olan her şey.",de:"Alles, was ein Gastpilot am Babadağ braucht.",ru:"Всё, что нужно приезжему пилоту на Бабадаге."}
  const bodies = {en:["We provide a full range of services for visiting solo and XC pilots. Whether you are here for a day or a full season, we can support your flying with equipment, information, retrieve, and local knowledge.","Our pilot services include: equipment hire (harnesses, helmets, reserve parachutes), meteorology briefings, retrieve service, equipment storage, GoPro and photography, and access to our daily pilot WhatsApp group for conditions updates.","All pilots must present a valid licence and logbook on first visit. We provide a full airspace, procedures, and emergency contacts briefing pack.","Operating hours for pilot services: 07:00-19:00 daily during the main season (April-October). Off-season by appointment."],tr:["Solo ve XC pilotları ziyaret için tam hizmet yelpazesi sunuyoruz. Ekipman kiralama, meteoroloji brifingleri, geri alma hizmeti, ekipman depolama ve günlük koşullar için WhatsApp grubu dahildir."],de:["Wir bieten ein umfassendes Dienstleistungsangebot für Gastpiloten. Dazu gehören Ausrüstungsverleih, Meteorologie-Briefings, Abholservice, Ausrüstungslagerung und Zugang zu unserer täglichen Piloten-WhatsApp-Gruppe."],ru:["Мы предлагаем полный спектр услуг для приезжих пилотов: аренда снаряжения, метео-брифинги, услуга подбора, хранение снаряжения и доступ к нашей ежедневной группе WhatsApp для пилотов."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <ServiceSchema name="Pilot Services Oludeniz" description="Equipment rental, storage, retrieval, radio hire and photography services for visiting pilots." path="/pilot-services" serviceType="Pilot Services" />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c13/VVJ_THDhVNeRP66pu_Ew8.jpg" />
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
