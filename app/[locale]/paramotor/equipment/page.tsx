import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Paramotor Equipment Guide",tr:"Paramotor Ekipman Rehberi",de:"Paramotor Equipment Guide",ru:"Paramotor Equipment Guide"}
  const d = {en:"Powered paragliding information for Oludeniz.",tr:"Oludeniz için motorlu paraşüt bilgileri.",de:"Motorisiertes Paragliding-Informationen für Oludeniz.",ru:"Информация о моторизованном парапланеризме для Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/paramotor/equipment'),
    openGraph: { url: localeUrl(locale, '/paramotor/equipment'), description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'paramotor' })
  const titles = {en:"Paramotor Equipment Guide",tr:"Paramotor Ekipman Rehberi",de:"Paramotor Equipment Guide",ru:"Paramotor Equipment Guide"}
  const subs = {en:"Powered paragliding information for Oludeniz.",tr:"Oludeniz için motorlu paraşüt bilgileri.",de:"Motorisiertes Paragliding-Informationen für Oludeniz.",ru:"Информация о моторизованном парапланеризме для Олюдениз."}
  const bodies = {en:["Paramotor (powered paraglider) equipment includes the motor unit (frame, engine, propeller, harness) and the paramotor-specific wing. We can advise on equipment selection and have hire equipment available.","Contact us for more details: +90 536 461 6674"],tr:["Paramotor (powered paraglider) equipment includes the motor unit (frame, engine, propeller, harness) and the paramotor-specific wing. We can advise on equipment selection and have hire equipment available.","Daha fazla bilgi için: +90 536 461 6674"],de:["Paramotor (powered paraglider) equipment includes the motor unit (frame, engine, propeller, harness) and the paramotor-specific wing. We can advise on equipment selection and have hire equipment available.","Für weitere Details: +90 536 461 6674"],ru:["Paramotor (powered paraglider) equipment includes the motor unit (frame, engine, propeller, harness) and the paramotor-specific wing. We can advise on equipment selection and have hire equipment available.","Для получения подробной информации: +90 536 461 6674"]}
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
