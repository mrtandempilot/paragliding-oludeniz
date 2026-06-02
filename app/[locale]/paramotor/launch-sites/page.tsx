import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Paramotor Launch Sites Oludeniz",tr:"Oludeniz Paramotor Kalkış Noktaları",de:"Paramotor Launch Sites Oludeniz",ru:"Paramotor Launch Sites Oludeniz"}
  return { title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'paramotor' })
  const titles = {en:"Paramotor Launch Sites Oludeniz",tr:"Oludeniz Paramotor Kalkış Noktaları",de:"Paramotor Launch Sites Oludeniz",ru:"Paramotor Launch Sites Oludeniz"}
  const subs = {en:"Powered paragliding information for Oludeniz.",tr:"Oludeniz için motorlu paraşüt bilgileri.",de:"Motorisiertes Paragliding-Informationen für Oludeniz.",ru:"Информация о моторизованном парапланеризме для Олюдениз."}
  const bodies = {en:["Paramotor operations at Oludeniz use beach and flat-ground launches separate from the Babadağ hill launches. Coordination with our operations team is required before flying.","Contact us for more details: +90 536 461 6674"],tr:["Paramotor operations at Oludeniz use beach and flat-ground launches separate from the Babadağ hill launches. Coordination with our operations team is required before flying.","Daha fazla bilgi için: +90 536 461 6674"],de:["Paramotor operations at Oludeniz use beach and flat-ground launches separate from the Babadağ hill launches. Coordination with our operations team is required before flying.","Für weitere Details: +90 536 461 6674"],ru:["Paramotor operations at Oludeniz use beach and flat-ground launches separate from the Babadağ hill launches. Coordination with our operations team is required before flying.","Для получения подробной информации: +90 536 461 6674"]}
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
