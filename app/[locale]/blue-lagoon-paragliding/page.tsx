import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Paragliding over the Blue Lagoon",tr:"Mavi Lagün Üzerinde Paraşüt",de:"Paragliding über die Blaue Lagune",ru:"Парапланеризм над Голубой Лагуной"}
  const d = {en:"The Blue Lagoon of Oludeniz from 1200 metres above — one of the most photographed views in the world.",tr:"1200 metre yukarıdan Oludeniz Mavi Lagünü — dünyanın en çok fotoğraflanan manzaralarından biri.",de:"Die Blaue Lagune von Oludeniz aus 1200 Metern Höhe — eine der meistfotografierten Aussichten der Welt.",ru:"Голубая Лагуна Олюдениза с высоты 1200 метров — один из самых фотографируемых видов в мире."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/blue-lagoon-paragliding'),
    openGraph: { url: localeUrl(locale, '/blue-lagoon-paragliding'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'blueLagoon' })
  const titles = {en:"Paragliding over the Blue Lagoon",tr:"Mavi Lagün Üzerinde Paraşüt",de:"Paragliding über die Blaue Lagune",ru:"Парапланеризм над Голубой Лагуной"}
  const subs = {en:"The Blue Lagoon of Oludeniz from 1200 metres above — one of the most photographed views in the world.",tr:"1200 metre yukarıdan Oludeniz Mavi Lagünü — dünyanın en çok fotoğraflanan manzaralarından biri.",de:"Die Blaue Lagune von Oludeniz aus 1200 Metern Höhe — eine der meistfotografierten Aussichten der Welt.",ru:"Голубая Лагуна Олюдениза с высоты 1200 метров — один из самых фотографируемых видов в мире."}
  const bodies = {en:["The Blue Lagoon (Oludeniz Lagoon) is a protected natural landmark — a shallow, perfectly turquoise body of water separated from the Aegean Sea by a narrow sandy spit. From above, the contrast between the deep blue Aegean and the vivid turquoise lagoon is breathtaking.","Every tandem paragliding flight from Babadağ flies directly over or beside the Blue Lagoon. Your pilot will point out the lagoon, Butterfly Valley, Gemiler Island, and the surrounding mountains during your flight.","The Blue Lagoon is at its most spectacular in the morning light. For the deepest turquoise colour, fly between 09:00 and 12:00. For golden light and the most dramatic colours, choose our sunset flight.","We carry a camera on every flight and can capture your reaction as you see the Blue Lagoon for the first time from above."],tr:["Mavi Lagün koruma altındaki doğal bir anıttır. Yukarıdan bakıldığında derin mavi Ege ve canlı turkuaz lagün arasındaki kontrast nefes kesicidir.","Babadağ'dan her tandem paraşüt uçuşu doğrudan Mavi Lagün üzerinden veya yanından geçer."],de:["Die Blaue Lagune ist ein geschütztes Naturschutzgebiet. Von oben ist der Kontrast zwischen dem tiefen blauen Ägäischen Meer und der leuchtend türkisfarbenen Lagune atemberaubend.","Jeder Tandemflug vom Babadağ fliegt direkt über oder neben der Blauen Lagune."],ru:["Голубая Лагуна — охраняемый природный памятник. Сверху контраст между тёмно-синим Эгейским морем и ярко-бирюзовой лагуной захватывает дух.","Каждый тандемный полёт с Бабадага пролетает прямо над или рядом с Голубой Лагуной."]}
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
