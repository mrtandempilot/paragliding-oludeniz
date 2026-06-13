import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t: Record<string,string> = {en:"Altitude Sickness at Babadag",tr:"Babadağ\'da İrtifa Tutması",de:"Höhenkrankheit am Babadağ",ru:"Горная болезнь на Бабадаг"}
  const d = {en:"At 1960m, most visitors feel fine. Here is what to know.",tr:"1960m\'de çoğu ziyaretçi kendini iyi hisseder. İşte bilmeniz gerekenler.",de:"Bei 1960m fühlen sich die meisten Besucher gut. Das sollten Sie wissen.",ru:"На 1960м большинство посетителей чувствуют себя хорошо. Вот что нужно знать."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/babadag-guide/babadag-altitude-sickness'),
    openGraph: { url: localeUrl(locale, '/babadag-guide/babadag-altitude-sickness'), description: (d as any)[locale] || d.en }, title: `${t[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'babadagGuide' })
  const titles: Record<string,string> = {en:"Altitude Sickness at Babadag",tr:"Babadağ\'da İrtifa Tutması",de:"Höhenkrankheit am Babadağ",ru:"Горная болезнь на Бабадаг"}
  const subs: Record<string,string> = {en:"At 1960m, most visitors feel fine. Here is what to know.",tr:"1960m\'de çoğu ziyaretçi kendini iyi hisseder. İşte bilmeniz gerekenler.",de:"Bei 1960m fühlen sich die meisten Besucher gut. Das sollten Sie wissen.",ru:"На 1960м большинство посетителей чувствуют себя хорошо. Вот что нужно знать."}
  const bodies: Record<string,string[]> = {
    en:["Altitude sickness (acute mountain sickness) typically begins to affect people above 2500m. At Babadağ summit (1960m) the vast majority of visitors experience no symptoms at all. The air feels slightly fresher and thinner, but nothing more for most people.","However, some individuals are more sensitive to altitude changes. If you feel unusually tired, have a headache, feel nauseous, or notice shortness of breath at the summit, tell your pilot immediately. We will adjust your flight or bring you down if needed.","Tips: stay hydrated (drink water on the drive up), avoid alcohol the night before, eat a light meal beforehand. Do not fly if you have a respiratory condition without consulting your doctor first.","Children, the elderly, and those with cardiac conditions should take extra care. If you have any concerns, speak to us before booking."],
    tr:["İrtifa tutması (akut dağ hastalığı) genellikle 2500m üzerinde etkilemeye başlar. Babadağ zirvesinde (1960m) ziyaretçilerin büyük çoğunluğu hiçbir belirti yaşamaz. Hava biraz daha taze ve hafif hissettiriyor, ama çoğu insan için bu kadar.","Ancak bazı bireyler irtifa değişikliklerine karşı daha hassastır. Zirvedeyken olağandışı yorgunluk, baş ağrısı, mide bulantısı veya nefes darlığı hissediyorsanız pilotunuza hemen bildirin.","Öneriler: (yukarı gidişte su için), önceki gece alkol tüketiminden kaçının, öncesinde hafif bir şeyler yiyin."],
    de:["Höhenkrankheit beginnt typischerweise über 2500m. Am Babadağ-Gipfel (1960m) erleben die meisten Besucher keinerlei Symptome. Die Luft fühlt sich etwas frischer an, aber mehr nicht.","Wenn Sie am Gipfel ungewöhnliche Müdigkeit, Kopfschmerzen, Übelkeit oder Kurzatmigkeit spüren, informieren Sie sofort Ihren Piloten.","Tipps: Bleiben Sie hydratisiert, vermeiden Sie Alkohol am Vorabend, essen Sie vorher eine leichte Mahlzeit."],
    ru:["Горная болезнь обычно начинает проявляться выше 2500м. На вершине Бабадага (1960м) большинство посетителей не испытывают никаких симптомов.","Если вы чувствуете необычную усталость, головную боль, тошноту или одышку на вершине — немедленно сообщите пилоту.","Советы: пейте воду по дороге наверх, избегайте алкоголя накануне, съешьте лёгкий обед перед полётом."],
  }
  const title = titles[locale]||titles.en
  const sub = subs[locale]||subs.en
  const body = bodies[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c08/BbYEw0ihhZaLcaN29vTrs.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3"><BreadcrumbNav items={[{ label: title }]} /></div>
      </div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl space-y-4">
          {body.map((p,i) => <p key={i} className="text-slate-600 leading-relaxed">{p}</p>)}
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
