import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Paragliding Community Oludeniz",tr:"Oludeniz Paraşüt Topluluğu",de:"Paragliding-Community Oludeniz",ru:"Сообщество парапланеристов Олюдениз"}
  return { title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'community' })
  const titles = {en:"Paragliding Community Oludeniz",tr:"Oludeniz Paraşüt Topluluğu",de:"Paragliding-Community Oludeniz",ru:"Сообщество парапланеристов Олюдениз"}
  const subs = {en:"Join one of the world's most vibrant paragliding communities.",tr:"Dünyanın en canlı paraşüt topluluklarından birine katılın.",de:"Treten Sie einer der lebendigsten Paragliding-Communities der Welt bei.",ru:"Присоединяйтесь к одному из самых живых сообществ парапланеристов мира."}
  const bodies = {en:["Oludeniz has one of the most active and welcoming paragliding communities in the world. Pilots from over 60 countries visit every season, from weekend warriors to world champions. The atmosphere on launch is uniquely international — you will meet pilots from Germany, the UK, Russia, Australia, Brazil, and everywhere in between.","The Oludeniz Air Games (held annually in October) is one of the world's premier paragliding events, attracting top XC and acro pilots for a week of competitions, demos, and social flying.","Year-round, the Oludeniz flying community gathers at the launch, at the beach bar, and at the weekly pilot meetups. Whether you are a student on your first hill soar or a competition XC pilot, you will find your people here.","Follow us on Instagram and Facebook for daily conditions reports, flight videos, and community news."],tr:["Oludeniz, dünyanın en aktif ve sıcak paraşüt topluluklarından birine sahiptir. Her sezon 60'tan fazla ülkeden pilot ziyaret eder.","Yıllık Oludeniz Air Games (Ekim ayında düzenlenir) dünya genelinde en önemli paraşüt etkinliklerinden biridir."],de:["Oludeniz hat eine der aktivsten und einladendsten Paragliding-Communities der Welt. Piloten aus über 60 Ländern besuchen jede Saison.","Die jährlichen Oludeniz Air Games (im Oktober) sind eines der weltweit bedeutendsten Paragliding-Events."],ru:["Олюдениз имеет одно из самых активных и гостеприимных сообществ парапланеристов в мире. Пилоты из 60+ стран приезжают каждый сезон.","Ежегодные Oludeniz Air Games (в октябре) — одно из ведущих мировых событий парапланеризма."]}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = (bodies as any)[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7bd4/rtDjiycQ-CNoCYjmlrN3-.jpg" />
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
