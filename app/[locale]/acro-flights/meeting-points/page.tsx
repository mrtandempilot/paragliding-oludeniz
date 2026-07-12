import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Acro Pilots Meeting Point",tr:"Akro Pilot Buluşma Noktaları",de:"Acro Pilots Meeting Point",ru:"Acro Pilots Meeting Point"}
  const d = {en:"Advanced paragliding for experienced pilots.",tr:"Deneyimli pilotlar için ileri düzey paraşüt.",de:"Fortgeschrittenes Paragliding für erfahrene Piloten.",ru:"Продвинутый парапланеризм для опытных пилотов."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/acro-flights/meeting-points'),
    openGraph: { url: localeUrl(locale, '/acro-flights/meeting-points'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "Where Do Acro Flights Meet and Launch?", "ps": ["Acro flying at Ölüdeniz uses the same infrastructure as all Babadağ flying, with a few specifics. Tandem acro passengers meet at our Ölüdeniz office like any tandem guest — the difference is in the air, not the logistics.", "Solo acro pilots typically launch from the higher takeoffs for maximum working altitude over the bay, then fly out to the designated manoeuvre box over the water."]}, {"h2": "The Key Locations", "ps": ["The acro day maps onto a few fixed points:"], "bullets": ["Ölüdeniz meeting point — our office in the town centre; transfers to the mountain leave from here", "Upper launches (1700m+) — the standard start for altitude-hungry acro flights", "The acro box — the designated manoeuvre zone over the bay, clear of tandem traffic", "Beach landing zone — everyone's finish line, spectators welcome"]}, {"h2": "Timing Your Acro Session", "ps": ["Acro flying favours the smoother edges of the day — late afternoon sessions over the bay are the local classic, with soft light for video and calmer air between manoeuvres.", "Book tandem acro like any flight and tell us you want dynamic — we assign a senior pilot and the right slot for conditions."]}], "faqTitle": "FAQ – Acro Meeting Points", "faqs": [{"q": "Where do I meet for a tandem acro flight?", "a": "Same as any tandem: our Ölüdeniz office, where transfers to the mountain depart. Hotel pickup within Ölüdeniz–Ovacık and from Fethiye can also be arranged."}, {"q": "Where exactly is the acro box?", "a": "Over the bay, offshore from the landing beach — positioned so manoeuvres stay over water and clear of the tandem descent routes. Solo pilots get exact bounds in the site briefing."}, {"q": "What time of day is best for an acro flight?", "a": "Late afternoon is the classic acro window — smoother air between manoeuvres and golden light for the video package. Morning slots work well too."}], "relatedTitle": "Explore More", "related": [{"href": "/acro-flights", "label": "Acro Flights"}, {"href": "/acro-flights/safety", "label": "Acro Safety"}, {"href": "/babadag-guide/takeoff-1700m", "label": "1700m Launch Point"}, {"href": "/book-now", "label": "Book Your Flight"}]}, "tr": {"sections": [{"h2": "Akro Uçuşları Nerede Buluşur ve Kalkar?", "ps": ["Ölüdeniz'de akro, tüm Babadağ uçuşlarıyla aynı altyapıyı birkaç özel farkla kullanır. Tandem akro yolcuları, her tandem misafiri gibi Ölüdeniz ofisimizde buluşur — fark lojistikte değil, havadadır.", "Solo akro pilotları, körfez üzerinde maksimum çalışma irtifası için genellikle üst pistlerden kalkar; sonra su üzerindeki belirlenmiş manevra kutusuna açılır."]}, {"h2": "Kilit Konumlar", "ps": ["Akro günü birkaç sabit noktaya oturur:"], "bullets": ["Ölüdeniz buluşma noktası — kasaba merkezindeki ofisimiz; dağ transferleri buradan kalkar", "Üst pistler (1700m+) — irtifa acıkmış akro uçuşlarının standart başlangıcı", "Akro kutusu — körfez üzerinde, tandem trafiğinden arındırılmış belirlenmiş manevra bölgesi", "Plaj iniş alanı — herkesin bitiş çizgisi; izleyiciler hoş gelir"]}, {"h2": "Akro Seansınızı Zamanlamak", "ps": ["Akro, günün daha pürüzsüz kenarlarını sever — körfez üzerinde geç öğleden sonra seansları yerel klasiktir: video için yumuşak ışık, manevralar arasında daha sakin hava.", "Tandem akroyu herhangi bir uçuş gibi ayırtın ve dinamik istediğinizi söyleyin — kıdemli bir pilot ve koşullara uygun seansı biz atarız."]}], "faqTitle": "SSS – Akro Buluşma Noktaları", "faqs": [{"q": "Tandem akro uçuşu için nerede buluşuyoruz?", "a": "Her tandem gibi: dağ transferlerinin kalktığı Ölüdeniz ofisimizde. Ölüdeniz–Ovacık içinde ve Fethiye'den otel alımı da ayarlanabilir."}, {"q": "Akro kutusu tam olarak nerede?", "a": "Körfezin üzerinde, iniş plajının açığında — manevralar su üzerinde ve tandem alçalma rotalarından uzak kalacak şekilde konumlanmıştır. Solo pilotlar kesin sınırları saha brifinginde alır."}, {"q": "Akro uçuşu için günün en iyi saati?", "a": "Geç öğleden sonra klasik akro penceresidir — manevralar arasında daha pürüzsüz hava ve video paketi için altın ışık. Sabah seansları da iyi çalışır."}], "relatedTitle": "Daha Fazlasını Keşfedin", "related": [{"href": "/acro-flights", "label": "Akro Uçuşları"}, {"href": "/acro-flights/safety", "label": "Akro Güvenliği"}, {"href": "/babadag-guide/takeoff-1700m", "label": "1700m Kalkış Noktası"}, {"href": "/book-now", "label": "Uçuşunuzu Ayırtın"}]}, "de": {"sections": [{"h2": "Wo treffen und starten Acro-Flüge?", "ps": ["Acro-Fliegen in Ölüdeniz nutzt dieselbe Infrastruktur wie alles Babadağ-Fliegen, mit wenigen Besonderheiten. Tandem-Acro-Passagiere treffen sich wie jeder Tandemgast an unserem Büro in Ölüdeniz — der Unterschied liegt in der Luft, nicht in der Logistik.", "Solo-Acro-Piloten starten typischerweise von den höheren Startplätzen für maximale Arbeitshöhe über der Bucht und fliegen dann hinaus zur ausgewiesenen Manöverbox über dem Wasser."]}, {"h2": "Die Schlüsselorte", "ps": ["Der Acro-Tag spielt sich an wenigen festen Punkten ab:"], "bullets": ["Treffpunkt Ölüdeniz — unser Büro im Ortszentrum; hier starten die Bergtransfers", "Obere Startplätze (1700m+) — der Standardstart für höhenhungrige Acro-Flüge", "Die Acro-Box — die ausgewiesene Manöverzone über der Bucht, frei vom Tandemverkehr", "Landezone am Strand — die Ziellinie für alle, Zuschauer willkommen"]}, {"h2": "Das Timing der Acro-Session", "ps": ["Acro bevorzugt die ruhigeren Ränder des Tages — Sessions am späten Nachmittag über der Bucht sind der lokale Klassiker, mit weichem Licht fürs Video und ruhigerer Luft zwischen den Manövern.", "Buchen Sie Tandem-Acro wie jeden Flug und sagen Sie uns, dass Sie es dynamisch wollen — wir teilen einen erfahrenen Piloten und den passenden Slot zu."]}], "faqTitle": "FAQ – Acro-Treffpunkte", "faqs": [{"q": "Wo treffe ich mich für einen Tandem-Acro-Flug?", "a": "Wie bei jedem Tandem: an unserem Büro in Ölüdeniz, von dem die Bergtransfers abfahren. Hotelabholung in Ölüdeniz–Ovacık und ab Fethiye ist ebenfalls möglich."}, {"q": "Wo genau liegt die Acro-Box?", "a": "Über der Bucht, vor dem Landestrand — so positioniert, dass Manöver über Wasser und frei von den Tandem-Abstiegsrouten bleiben. Solopiloten bekommen die genauen Grenzen im Geländebriefing."}, {"q": "Welche Tageszeit ist die beste für einen Acro-Flug?", "a": "Der späte Nachmittag ist das klassische Acro-Fenster — ruhigere Luft zwischen den Manövern und goldenes Licht fürs Videopaket. Morgenslots funktionieren ebenfalls gut."}], "relatedTitle": "Mehr entdecken", "related": [{"href": "/acro-flights", "label": "Acro-Flüge"}, {"href": "/acro-flights/safety", "label": "Acro-Sicherheit"}, {"href": "/babadag-guide/takeoff-1700m", "label": "1700m Startplatz"}, {"href": "/book-now", "label": "Flug buchen"}]}, "ru": {"sections": [{"h2": "Где собираются и стартуют акро-полёты?", "ps": ["Акро в Олюденизе использует ту же инфраструктуру, что и все полёты с Бабадага, с несколькими особенностями. Пассажиры тандем-акро встречаются у нашего офиса в Олюденизе, как любой тандемный гость — разница в воздухе, а не в логистике.", "Solo-акро-пилоты обычно стартуют с верхних площадок ради максимальной рабочей высоты над заливом, а затем уходят в выделенную зону манёвров над водой."]}, {"h2": "Ключевые точки", "ps": ["Акро-день укладывается в несколько фиксированных точек:"], "bullets": ["Точка сбора в Олюденизе — наш офис в центре; отсюда уходят трансферы в гору", "Верхние старты (1700м+) — стандартное начало для жадных до высоты акро-полётов", "Акро-бокс — выделенная зона манёвров над заливом, свободная от тандемного трафика", "Пляжная зона посадки — финиш для всех, зрители приветствуются"]}, {"h2": "Когда планировать акро-сессию", "ps": ["Акро любит спокойные края дня — сессии позднего дня над заливом здесь классика: мягкий свет для видео и более ровный воздух между манёврами.", "Бронируйте тандем-акро как обычный полёт и скажите, что хотите динамики — мы назначим старшего пилота и подходящий слот под условия."]}], "faqTitle": "FAQ – точки сбора акро", "faqs": [{"q": "Где встречаемся для тандем-акро?", "a": "Как для любого тандема: у нашего офиса в Олюденизе, откуда уходят трансферы в гору. Возможен трансфер из отелей Олюдениз–Оваджик и из Фетхие."}, {"q": "Где именно акро-бокс?", "a": "Над заливом, мористее посадочного пляжа — так, чтобы манёвры оставались над водой и в стороне от маршрутов снижения тандемов. Solo-пилоты получают точные границы на брифинге."}, {"q": "Какое время дня лучшее для акро-полёта?", "a": "Поздний день — классическое акро-окно: ровнее воздух между манёврами и золотой свет для видеопакета. Утренние слоты тоже хороши."}], "relatedTitle": "Узнайте больше", "related": [{"href": "/acro-flights", "label": "Акро-полёты"}, {"href": "/acro-flights/safety", "label": "Безопасность акро"}, {"href": "/babadag-guide/takeoff-1700m", "label": "Площадка 1700м"}, {"href": "/book-now", "label": "Забронировать полёт"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'acro' })
  const titles = {en:"Acro Pilots Meeting Point",tr:"Akro Pilot Buluşma Noktaları",de:"Acro Pilots Meeting Point",ru:"Acro Pilots Meeting Point"}
  const subs = {en:"Advanced paragliding for experienced pilots.",tr:"Deneyimli pilotlar için ileri düzey paraşüt.",de:"Fortgeschrittenes Paragliding für erfahrene Piloten.",ru:"Продвинутый парапланеризм для опытных пилотов."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Acro Paragliding Meeting Points Oludeniz\", \"description\": \"Meeting points and logistics for acrobatic paragliding in Oludeniz.\", \"url\": \"https://www.atmosparagliding.com/acro-flights/meeting-points\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://www.atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://www.atmosparagliding.com\"}}" }} />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0b/Ma1uD1AUlcpoxL-48cgg4.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3"><BreadcrumbNav items={[{ label: title }]} /></div>
      </div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl">
          {c.sections.map((s: any) => (
            <div key={s.h2} className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{s.h2}</h2>
              {s.ps.map((p: string, i: number) => <p key={i} className="text-slate-600 leading-relaxed mb-4">{p}</p>)}
              {s.bullets && <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-4">{s.bullets.map((b: string, i: number) => <li key={i}>{b}</li>)}</ul>}
            </div>
          ))}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{c.faqTitle}</h2>
            {c.faqs.map((f: any) => (
              <div key={f.q} className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.q}</h3>
                <p className="text-slate-600 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3">{c.relatedTitle}</h2>
            <ul className="space-y-2">
              {c.related.map((r: any) => (
                <li key={r.href}><Link href={lp(r.href)} className="text-orange-600 hover:underline">{r.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
