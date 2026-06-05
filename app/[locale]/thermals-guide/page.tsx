import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Thermals Guide Oludeniz",tr:"Oludeniz Termik Rehberi",de:"Thermikführer Oludeniz",ru:"Гид по термикам Олюдениз"}
  return { title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'thermalsGuide' })
  const titles = {en:"Thermals Guide Oludeniz",tr:"Oludeniz Termik Rehberi",de:"Thermikführer Oludeniz",ru:"Гид по термикам Олюдениз"}
  const subs = {en:"Understanding thermals for paragliding at Babadağ.",tr:"Babadağ'da paraşüt için termikleri anlamak.",de:"Thermik für Paragliding am Babadağ verstehen.",ru:"Понимание термиков для парапланеризма на Бабадаге."}
  const bodies = {en:["Thermals at Babadağ are generated primarily by the limestone rock face heating in the morning sun. The south-east face of the mountain begins producing strong thermals by 09:30-10:00 on clear days, spreading across the ridge by 11:00.","Understanding thermals is essential for solo pilots and helpful for tandem passengers wanting to know what to expect during their flight. Thermals feel like gentle upward pushes or rocking — the paraglider reacts to them by rising and slightly pitching.","For tandem passengers: thermals are safe. Your pilot uses them to extend your flight time. If you are motion-sensitive, request a morning slot before 10:30 when thermals have not yet developed."],tr:["Babadağ'daki termikler öncelikle kireçtaşı kaya yüzeyinin sabah güneşinde ısınmasıyla oluşur. Termikler saat 10:00'dan itibaren gelişmeye başlar."],de:["Thermik am Babadağ entsteht hauptsächlich durch die sich in der Morgensonne erwärmende Kalksteinflanke. Thermik beginnt sich ab 10:00 Uhr zu entwickeln."],ru:["Термики на Бабадаге генерируются в основном нагревом известняковой поверхности утренним солнцем. Термики начинают развиваться с 10:00."]}
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
