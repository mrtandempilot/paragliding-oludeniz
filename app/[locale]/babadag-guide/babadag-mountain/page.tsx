import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t: Record<string,string> = {en:"Babadag Mountain — Complete Guide",tr:"Babadağ Dağı — Eksiksiz Rehber",de:"Babadağ-Berg — Vollständiger Leitfaden",ru:"Гора Бабадаг — Полный гид"}
  return { title: `${t[locale]||t.en} | Paragliding Oludeniz` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'babadagGuide' })
  const titles: Record<string,string> = {en:"Babadag Mountain — Complete Guide",tr:"Babadağ Dağı — Eksiksiz Rehber",de:"Babadağ-Berg — Vollständiger Leitfaden",ru:"Гора Бабадаг — Полный гид"}
  const subs: Record<string,string> = {en:"Rising to 1960m above Oludeniz, Babadag is a world-class paragliding mountain.",tr:"1960m yüksekliğiyle Oludeniz\'in üzerindeki Babadağ, dünya klasmanında bir paraşüt dağıdır.",de:"Der Babadağ ragt 1960m über Oludeniz auf — ein Paragliding-Berg von Weltklasse.",ru:"Поднимаясь на 1960м над Олюдениз, Бабадаг — гора мирового класса для парапланеризма."}
  const bodies: Record<string,string[]> = {
    en:["Babadag Mountain (Babadağ in Turkish, meaning Father Mountain) stands at 1960 metres above sea level, directly above the beach and Blue Lagoon of Oludeniz. It is the highest regular commercial tandem launch site in Europe and one of the most famous in the world.","The mountain offers four separate launch points: 1200m (standard tandem), 1700m (high altitude tandem and XC pilots), 1800m (advanced pilots), and 1960m summit (competition and experienced XC pilots only). Each launch has different characteristics — direction, gradient, and thermal behaviour.","Access is via the Babadag road (a well-maintained mountain road, about 30 minutes from Oludeniz) or by cable car (teleferik). We include transfer in all our tandem flight packages.","The flying season runs from April to October. Peak flying months are May, June, September, and October when thermals are strong but predictable. July and August can produce very powerful thermals suited to experienced pilots.","At the summit, you are standing above the clouds on a clear day. The views take in the entire Oludeniz bay, the Blue Lagoon, Butterfly Valley, Gemiler Island, Fethiye harbour, and on the clearest days, the island of Rhodes."],
    tr:["Babadağ (Türkçe'de Baba Dağı anlamına gelir) deniz seviyesinden 1960 metre yükseklikte, doğrudan Oludeniz plajı ve Mavi Lagünün üzerinde yer alır. Avrupa'nın en yüksek ticari tandem kalkış noktasıdır.","Dört ayrı kalkış noktası sunar: 1200m (standart tandem), 1700m (yüksek irtifa tandem ve XC pilotlar), 1800m (ileri düzey pilotlar) ve 1960m zirve. Uçuş sezonu Nisan'dan Ekim'e kadar sürer.","Zirvedeyken bulutların üzerinde duruyorsunuz. Manzara tüm Oludeniz körfezini, Mavi Lagün'ü, Kelebek Vadisi'ni, Gemiler Adası'nı ve en net günlerde Rodos adası'nı kapsar."],
    de:["Der Babadağ (Türkisch für Väterberg) liegt auf 1960 Metern über dem Meeresspiegel, direkt über dem Strand und der Blauen Lagune von Oludeniz. Er ist der höchste reguläre kommerzielle Tandem-Startplatz in Europa.","Es gibt vier Startpunkte: 1200m, 1700m, 1800m und 1960m Gipfel. Die Flugsaison läuft von April bis Oktober.","Am Gipfel stehen Sie an klaren Tagen über den Wolken und genießen die Aussicht auf die gesamte Bucht von Oludeniz, die Blaue Lagune, das Schmetterlingstal und an den klarsten Tagen die Insel Rhodos."],
    ru:["Бабадаг (по-турецки «Отцовская гора») возвышается на 1960 метров над уровнем моря, прямо над пляжем и Голубой Лагуной Олюдениза. Это самое высокое коммерческое тандемное место старта в Европе.","Предлагает четыре стартовых площадки: 1200м, 1700м, 1800м и вершина 1960м. Сезон полётов с апреля по октябрь.","На вершине в ясный день вы стоите над облаками с видом на весь залив Олюдениз, Голубую Лагуну, Долину Бабочек и в самые ясные дни — остров Родос."],
  }
  const title = titles[locale]||titles.en
  const sub = subs[locale]||subs.en
  const body = bodies[locale]||bodies.en
  return (
    <>
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=85" />
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
