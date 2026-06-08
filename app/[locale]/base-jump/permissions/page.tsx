import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Base Jump Permits Turkey",tr:"Türkiye Base Jump İzinleri",de:"Base Jump Permits Turkey",ru:"Base Jump Permits Turkey"}
  return { title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'baseJump' })
  const titles = {en:"Base Jump Permits Turkey",tr:"Türkiye Base Jump İzinleri",de:"Base Jump Permits Turkey",ru:"Base Jump Permits Turkey"}
  const subs = {en:"Information for base jumping at Oludeniz.",tr:"Oludeniz'de base jumping bilgileri.",de:"Informationen zum Base-Jumping in Oludeniz.",ru:"Информация о бэйс-джампинге в Олюдениз."}
  const bodies = {en:["Base jumping in Turkey requires permits from the Turkish Civil Aviation Authority (SHGM) and local municipality approvals. Requirements change periodically. Contact us for current permit requirements before planning your jump.","WhatsApp: +90 536 461 6674"],tr:["Base jumping in Turkey requires permits from the Turkish Civil Aviation Authority (SHGM) and local municipality approvals. Requirements change periodically. Contact us for current permit requirements before planning your jump.","WhatsApp: +90 536 461 6674"],de:["Base jumping in Turkey requires permits from the Turkish Civil Aviation Authority (SHGM) and local municipality approvals. Requirements change periodically. Contact us for current permit requirements before planning your jump.","WhatsApp: +90 536 461 6674"],ru:["Base jumping in Turkey requires permits from the Turkish Civil Aviation Authority (SHGM) and local municipality approvals. Requirements change periodically. Contact us for current permit requirements before planning your jump.","WhatsApp: +90 536 461 6674"]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=1600&q=85" />
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
