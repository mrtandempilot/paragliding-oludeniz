import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Paragliding Weather Guide Oludeniz",tr:"Oludeniz Paraşüt Hava Rehberi",de:"Paragliding-Wetterführer Oludeniz",ru:"Погодный гид парапланеризма Олюдениз"}
  return { title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'weatherGuide' })
  const titles = {en:"Paragliding Weather Guide Oludeniz",tr:"Oludeniz Paraşüt Hava Rehberi",de:"Paragliding-Wetterführer Oludeniz",ru:"Погодный гид парапланеризма Олюдениз"}
  const subs = {en:"Understanding flying conditions at Babadağ.",tr:"Babadağ uçuş koşullarını anlamak.",de:"Die Flugbedingungen am Babadağ verstehen.",ru:"Понимание условий полётов на Бабадаге."}
  const bodies = {en:["Oludeniz enjoys one of the best microclimates for paragliding in the world. The mountains surrounding the bay block cold northerly winds, the Aegean produces consistent sea breezes, and the limestone terrain generates reliable thermals from April to October.","Wind: the ideal wind for tandem flying is light north-westerly at 5-15 km/h. We monitor conditions at three stations — beach level, 1200m, and 1960m. Thermals: build from about 10:00 and peak between 12:00-15:00. Morning flying (08:00-10:00) is smoother and suitable for those nervous about turbulence.","The flying season runs from April to October. November to March sees stronger winds and less predictable conditions — we fly on good days but it is not reliable enough for planned holidays."],tr:["Oludeniz, dünyanın en iyi paraşüt mikroklimaslarından birine sahiptir. Tandem uçuş için ideal rüzgar saatte 5-15 km hafif kuzey-batı rüzgarıdır. Uçuş sezonu Nisan'dan Ekim'e kadar sürer."],de:["Oludeniz hat eines der besten Mikroklimas für Paragliding der Welt. Der ideale Wind für Tandemfliegen beträgt 5-15 km/h aus Nordwest. Die Flugsaison läuft von April bis Oktober."],ru:["Олюдениз имеет один из лучших микроклиматов для парапланеризма в мире. Идеальный ветер для тандемных полётов — 5-15 км/ч северо-западный. Сезон полётов с апреля по октябрь."]}
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
