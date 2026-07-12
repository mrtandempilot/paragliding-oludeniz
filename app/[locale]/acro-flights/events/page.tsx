import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Acro Paragliding Events Oludeniz",tr:"Oludeniz Akro Paraşüt Etkinlikleri",de:"Acro Paragliding Events Oludeniz",ru:"Acro Paragliding Events Oludeniz"}
  const d = {en:"Advanced paragliding for experienced pilots.",tr:"Deneyimli pilotlar için ileri düzey paraşüt.",de:"Fortgeschrittenes Paragliding für erfahrene Piloten.",ru:"Продвинутый парапланеризм для опытных пилотов."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/acro-flights/events'),
    openGraph: { url: localeUrl(locale, '/acro-flights/events'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "Acro Events Over the Bay: What Happens at Ölüdeniz", "ps": ["Ölüdeniz's event heritage is unique: for decades the bay has hosted international air games and acro gatherings where the world's best pilots throw their hardest tricks over the water — with the beach as a natural grandstand.", "For spectators it is free theatre: infinity tumbles, synchro routines and smoke trails against the lagoon backdrop, all visible from a sun lounger."]}, {"h2": "What an Event Week Looks Like", "ps": ["When a major gathering is on:"], "bullets": ["Daily acro runs over the designated box, usually late morning and afternoon", "Landing displays right on the beach — precision touchdowns metres from the crowd", "Night flights and smoke-and-LED shows on selected evenings at some events", "The town fills with pilots — expect a festival atmosphere and busy flight slots"]}, {"h2": "Visiting During an Event", "ps": ["Event weeks are the most spectacular time to visit Ölüdeniz — and tandem flights keep operating throughout, sharing the sky on a managed schedule.", "Dates change year to year. Ask our team what is on the calendar during your travel window, and book both accommodation and flights earlier than usual."]}], "faqTitle": "FAQ – Acro Events", "faqs": [{"q": "When are the acro events at Ölüdeniz?", "a": "Major gatherings typically land in the warmer months, but exact dates change every year. Contact us with your travel dates and we will tell you what overlaps."}, {"q": "Is watching the events free?", "a": "Yes — the shows happen over the bay and the beach is the grandstand. Arrive early on show days for a good spot; the promenade fills up."}, {"q": "Can I still fly tandem during an event week?", "a": "Yes — tandem operations continue on a managed schedule alongside event flying. Slots are busier than usual, so book ahead."}], "relatedTitle": "Explore More", "related": [{"href": "/acro-flights", "label": "Acro Flights"}, {"href": "/acro-flights/pilots", "label": "Acro Pilots"}, {"href": "/acro-flights/meeting-points", "label": "Meeting Points"}, {"href": "/book-now", "label": "Book Your Flight"}]}, "tr": {"sections": [{"h2": "Körfez Üzerinde Akro Etkinlikleri: Ölüdeniz'de Neler Olur?", "ps": ["Ölüdeniz'in etkinlik mirası benzersizdir: on yıllardır körfez, dünyanın en iyi pilotlarının en zor hareketlerini su üzerinde attığı uluslararası hava oyunlarına ve akro buluşmalarına ev sahipliği yapıyor — plaj da doğal tribün.", "İzleyiciler için bedava tiyatrodur: lagün fonunda infinity tumble'lar, senkron rutinler ve duman izleri; hepsi bir şezlongdan görülebilir."]}, {"h2": "Bir Etkinlik Haftası Nasıl Görünür?", "ps": ["Büyük bir buluşma olduğunda:"], "bullets": ["Belirlenmiş kutu üzerinde günlük akro koşuları; genellikle geç sabah ve öğleden sonra", "Tam plajda iniş gösterileri — kalabalığa metreler kala hassas inişler", "Bazı etkinliklerde seçili akşamlarda gece uçuşları ile duman ve LED şovları", "Kasaba pilotlarla dolar — festival atmosferi ve yoğun uçuş seansları bekleyin"]}, {"h2": "Etkinlik Sırasında Ziyaret", "ps": ["Etkinlik haftaları Ölüdeniz'i ziyaret etmenin en gösterişli zamanıdır — tandem uçuşlar da yönetilen bir programla gökyüzünü paylaşarak süresince devam eder.", "Tarihler yıldan yıla değişir. Seyahat aralığınızda takvimde ne olduğunu ekibimize sorun; konaklamayı da uçuşu da normalden erken ayırtın."]}], "faqTitle": "SSS – Akro Etkinlikleri", "faqs": [{"q": "Ölüdeniz'de akro etkinlikleri ne zaman?", "a": "Büyük buluşmalar genellikle sıcak aylara denk gelir ama kesin tarihler her yıl değişir. Seyahat tarihlerinizle bize ulaşın; neyin denk geldiğini söyleyelim."}, {"q": "Etkinlikleri izlemek ücretsiz mi?", "a": "Evet — şovlar körfezin üzerinde olur ve tribün plajdır. Gösteri günlerinde iyi bir yer için erken gelin; kordon dolar."}, {"q": "Etkinlik haftasında yine de tandem uçabilir miyim?", "a": "Evet — tandem operasyonları etkinlik uçuşlarının yanında yönetilen bir programla devam eder. Seanslar normalden yoğundur; önceden ayırtın."}], "relatedTitle": "Daha Fazlasını Keşfedin", "related": [{"href": "/acro-flights", "label": "Akro Uçuşları"}, {"href": "/acro-flights/pilots", "label": "Akro Pilotları"}, {"href": "/acro-flights/meeting-points", "label": "Buluşma Noktaları"}, {"href": "/book-now", "label": "Uçuşunuzu Ayırtın"}]}, "de": {"sections": [{"h2": "Acro-Events über der Bucht: Was in Ölüdeniz passiert", "ps": ["Das Event-Erbe von Ölüdeniz ist einzigartig: Seit Jahrzehnten richtet die Bucht internationale Air Games und Acro-Treffen aus, bei denen die besten Piloten der Welt ihre härtesten Tricks über dem Wasser zeigen — mit dem Strand als natürlicher Tribüne.", "Für Zuschauer ist es Gratis-Theater: Infinity-Tumbles, Synchro-Küren und Rauchspuren vor der Lagunenkulisse — alles vom Sonnenstuhl aus sichtbar."]}, {"h2": "So sieht eine Eventwoche aus", "ps": ["Wenn ein großes Treffen läuft:"], "bullets": ["Tägliche Acro-Runs über der ausgewiesenen Box, meist am späten Vormittag und Nachmittag", "Landeshows direkt am Strand — Präzisionslandungen wenige Meter vor dem Publikum", "Bei manchen Events Nachtflüge mit Rauch- und LED-Shows an ausgewählten Abenden", "Die Stadt füllt sich mit Piloten — Festivalstimmung und volle Flugslots inklusive"]}, {"h2": "Besuch während eines Events", "ps": ["Eventwochen sind die spektakulärste Zeit für einen Ölüdeniz-Besuch — und der Tandembetrieb läuft die ganze Zeit weiter, den Himmel nach gemanagtem Zeitplan teilend.", "Die Termine wechseln jährlich. Fragen Sie unser Team, was in Ihrem Reisezeitraum im Kalender steht, und buchen Sie Unterkunft wie Flug früher als üblich."]}], "faqTitle": "FAQ – Acro-Events", "faqs": [{"q": "Wann finden die Acro-Events in Ölüdeniz statt?", "a": "Große Treffen liegen typischerweise in den wärmeren Monaten, die genauen Termine wechseln jedes Jahr. Nennen Sie uns Ihre Reisedaten — wir sagen Ihnen, was sich überschneidet."}, {"q": "Ist das Zuschauen bei den Events kostenlos?", "a": "Ja — die Shows finden über der Bucht statt, und der Strand ist die Tribüne. An Showtagen früh kommen; die Promenade füllt sich."}, {"q": "Kann ich während einer Eventwoche trotzdem Tandem fliegen?", "a": "Ja — der Tandembetrieb läuft nach gemanagtem Zeitplan neben dem Eventfliegen weiter. Die Slots sind voller als üblich, also vorausbuchen."}], "relatedTitle": "Mehr entdecken", "related": [{"href": "/acro-flights", "label": "Acro-Flüge"}, {"href": "/acro-flights/pilots", "label": "Acro-Piloten"}, {"href": "/acro-flights/meeting-points", "label": "Treffpunkte"}, {"href": "/book-now", "label": "Flug buchen"}]}, "ru": {"sections": [{"h2": "Акро-события над заливом: что происходит в Олюденизе", "ps": ["Событийное наследие Олюдениза уникально: десятилетиями залив принимает международные воздушные игры и акро-слёты, где лучшие пилоты мира крутят свои сложнейшие трюки над водой — а пляж служит естественной трибуной.", "Для зрителей это бесплатный театр: infinity tumbling, синхронные программы и дымные следы на фоне лагуны — всё видно с шезлонга."]}, {"h2": "Как выглядит неделя события", "ps": ["Когда идёт крупный слёт:"], "bullets": ["Ежедневные акро-проходы над выделенной зоной, обычно поздним утром и днём", "Посадочные шоу прямо на пляже — точные приземления в метрах от публики", "На некоторых событиях — ночные полёты с дымом и LED-шоу в отдельные вечера", "Город наполняется пилотами — ждите фестивальной атмосферы и загруженных слотов"]}, {"h2": "Визит во время события", "ps": ["Недели событий — самое зрелищное время для поездки в Олюдениз, и тандемные полёты продолжаются всё это время по управляемому расписанию, деля небо с шоу.", "Даты меняются из года в год. Спросите нашу команду, что стоит в календаре на ваши даты, и бронируйте жильё и полёты раньше обычного."]}], "faqTitle": "FAQ – акро-события", "faqs": [{"q": "Когда проходят акро-события в Олюденизе?", "a": "Крупные слёты обычно выпадают на тёплые месяцы, но точные даты меняются каждый год. Напишите нам свои даты поездки — скажем, что совпадает."}, {"q": "Смотреть события бесплатно?", "a": "Да — шоу проходят над заливом, а трибуна — пляж. В дни показов приходите пораньше: набережная заполняется."}, {"q": "Можно ли полететь тандемом в неделю события?", "a": "Да — тандемные полёты продолжаются по управляемому расписанию параллельно с шоу. Слоты загруженнее обычного, бронируйте заранее."}], "relatedTitle": "Узнайте больше", "related": [{"href": "/acro-flights", "label": "Акро-полёты"}, {"href": "/acro-flights/pilots", "label": "Акро-пилоты"}, {"href": "/acro-flights/meeting-points", "label": "Точки сбора"}, {"href": "/book-now", "label": "Забронировать полёт"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'acro' })
  const titles = {en:"Acro Paragliding Events Oludeniz",tr:"Oludeniz Akro Paraşüt Etkinlikleri",de:"Acro Paragliding Events Oludeniz",ru:"Acro Paragliding Events Oludeniz"}
  const subs = {en:"Advanced paragliding for experienced pilots.",tr:"Deneyimli pilotlar için ileri düzey paraşüt.",de:"Fortgeschrittenes Paragliding für erfahrene Piloten.",ru:"Продвинутый парапланеризм для опытных пилотов."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Acro Paragliding Events Oludeniz\", \"description\": \"Acrobatic paragliding events and competitions held in Oludeniz, Turkey.\", \"url\": \"https://www.atmosparagliding.com/acro-flights/events\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://www.atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://www.atmosparagliding.com\"}}" }} />
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
