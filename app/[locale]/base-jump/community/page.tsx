import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Base Jump Community Oludeniz",tr:"Oludeniz Base Jump Topluluğu",de:"Base Jump Community Oludeniz",ru:"Base Jump Community Oludeniz"}
  return { title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'baseJump' })
  const titles = {en:"Base Jump Community Oludeniz",tr:"Oludeniz Base Jump Topluluğu",de:"Base Jump Community Oludeniz",ru:"Base Jump Community Oludeniz"}
  const subs = {en:"Information for base jumping at Oludeniz.",tr:"Oludeniz'de base jumping bilgileri.",de:"Informationen zum Base-Jumping in Oludeniz.",ru:"Информация о бэйс-джампинге в Олюдениз."}
  const bodies = {en:["Oludeniz has a small but active base jumping community. The area around Babadağ cliffs and the Butterfly Valley has attracted base jumpers since the 1990s. Contact us to connect with the local community.","WhatsApp: +90 536 461 6674"],tr:["Oludeniz has a small but active base jumping community. The area around Babadağ cliffs and the Butterfly Valley has attracted base jumpers since the 1990s. Contact us to connect with the local community.","WhatsApp: +90 536 461 6674"],de:["Oludeniz has a small but active base jumping community. The area around Babadağ cliffs and the Butterfly Valley has attracted base jumpers since the 1990s. Contact us to connect with the local community.","WhatsApp: +90 536 461 6674"],ru:["Oludeniz has a small but active base jumping community. The area around Babadağ cliffs and the Butterfly Valley has attracted base jumpers since the 1990s. Contact us to connect with the local community.","WhatsApp: +90 536 461 6674"]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" />
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
