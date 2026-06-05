import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Cross Country Paragliding Oludeniz",tr:"Oludeniz Kros Paraşüt",de:"Streckenflug Paragliding Oludeniz",ru:"Маршрутный парапланеризм Олюдениз"}
  return { title: `${(t as any)[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'crossCountry' })
  const titles = {en:"Cross Country Paragliding Oludeniz",tr:"Oludeniz Kros Paraşüt",de:"Streckenflug Paragliding Oludeniz",ru:"Маршрутный парапланеризм Олюдениз"}
  const subs = {en:"XC flying from Babadağ across the Fethiye region.",tr:"Babadağ'dan Fethiye bölgesi üzerinde XC uçuşu.",de:"XC-Fliegen vom Babadağ über die Fethiye-Region.",ru:"XC полёты с Бабадага над регионом Фетхие."}
  const bodies = {en:["Cross country (XC) paragliding from Babadağ offers some of the best routes in the Mediterranean. With reliable thermals from April to October, a diverse landscape of mountains, valleys, and coastline, and strong local pilot knowledge, Oludeniz is a destination for serious XC pilots.","The standard XC corridor runs north from Babadağ along the Taurus foothills to Fethiye, with options to extend to Gocek, Dalaman, and beyond. Triangle routes returning to Oludeniz beach are possible on good days. Goal-and-return routes using Fethiye as a turnpoint are popular.","We provide pilot services including meteorology briefings, retrieve service (vehicle pick-up from your landing field), equipment storage, and local knowledge packs. Contact us to arrange your XC support package.","Requirements: minimum P3/CP rating, appropriate equipment inspection on arrival, and a briefing from our operations team. Foreign licenses recognized under CIVL reciprocal agreements."],tr:["Babadağ'dan kros paraşüt, Akdeniz'deki en iyi rotalardan bazılarını sunar. Standart XC koridoru Babadağ'dan kuzeye Fethiye'ye doğru uzanır.","Meteoroloji brifingleri, geri alma hizmeti ve ekipman depolama dahil pilot hizmetleri sunuyoruz."],de:["XC-Fliegen vom Babadağ bietet einige der besten Routen im Mittelmeer. Wir bieten Pilotendienste wie Meteorologie-Briefings, Abholservice und Ausrüstungslagerung an."],ru:["XC парапланеризм с Бабадага предлагает одни из лучших маршрутов в Средиземноморье. Мы предоставляем услуги пилотам: метео-брифинги, подбор и хранение снаряжения."]}
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
