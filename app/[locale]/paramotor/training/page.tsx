import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Paramotor Training Oludeniz",tr:"Oludeniz Paramotor Eğitimi",de:"Paramotor Training Oludeniz",ru:"Paramotor Training Oludeniz"}
  const d = {en:"Powered paragliding information for Oludeniz.",tr:"Oludeniz için motorlu paraşüt bilgileri.",de:"Motorisiertes Paragliding-Informationen für Oludeniz.",ru:"Информация о моторизованном парапланеризме для Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/paramotor/training'),
    openGraph: { url: localeAlternates(locale, '/paramotor/training').canonical! }, title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'paramotor' })
  const titles = {en:"Paramotor Training Oludeniz",tr:"Oludeniz Paramotor Eğitimi",de:"Paramotor Training Oludeniz",ru:"Paramotor Training Oludeniz"}
  const subs = {en:"Powered paragliding information for Oludeniz.",tr:"Oludeniz için motorlu paraşüt bilgileri.",de:"Motorisiertes Paragliding-Informationen für Oludeniz.",ru:"Информация о моторизованном парапланеризме для Олюдениз."}
  const bodies = {en:["We offer introductory and full paramotor training courses at Oludeniz. Courses lead to SHGM paramotor certification. Contact us for course dates and pricing.","Contact us for more details: +90 536 461 6674"],tr:["We offer introductory and full paramotor training courses at Oludeniz. Courses lead to SHGM paramotor certification. Contact us for course dates and pricing.","Daha fazla bilgi için: +90 536 461 6674"],de:["We offer introductory and full paramotor training courses at Oludeniz. Courses lead to SHGM paramotor certification. Contact us for course dates and pricing.","Für weitere Details: +90 536 461 6674"],ru:["We offer introductory and full paramotor training courses at Oludeniz. Courses lead to SHGM paramotor certification. Contact us for course dates and pricing.","Для получения подробной информации: +90 536 461 6674"]}
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
