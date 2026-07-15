import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"XC Flying Seasons Oludeniz",tr:"Oludeniz XC Uçuş Mevsimleri",de:"XC-Flugsaisons Oludeniz",ru:"Сезоны XC Олюдениз"}
  const d = {en:"Detailed information for licensed paragliding pilots.",tr:"Lisanslı paraşütçüler için ayrıntılı bilgi.",de:"Detaillierte Informationen für lizenzierte Paragliding-Piloten.",ru:"Подробная информация для лицензированных пилотов."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/cross-country-flights/seasons'),
    openGraph: { url: localeUrl(locale, '/cross-country-flights/seasons'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/cross-country-flights/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "When Is XC Season at Babadağ?", "ps": ["The practical XC window runs from late April to October, inside the site's seven-month season. But 'XC season' is really three different seasons, each with its own character — and choosing the right one for your goals matters more than picking a date."]}, {"h2": "The Three XC Seasons", "ps": ["How the year breaks down for cross-country:"], "bullets": ["Spring (late April–June) — fresh air masses, well-structured thermals, greener valleys; many locals call May–June the finest XC weeks of the year", "High summer (July–August) — highest cloudbases and strongest cycles; big-number potential, but demanding midday air and strong valley breezes", "Autumn (September–October) — stable, forgiving conditions with soft light; ideal for pilots who want relaxed XC and reliable retrieves"]}, {"h2": "Matching Season to Your XC Goals", "ps": ["Chasing a personal distance record? Aim for high summer and be ready for spicy midday air. Building XC experience? Spring and autumn give the friendliest learning conditions.", "Whenever you come, our team can advise on the specific week's outlook and set up briefings, radio and retrieval to match."]}], "faqTitle": "FAQ – XC Seasons", "faqs": [{"q": "Which month is best for a first XC at Babadağ?", "a": "May, June or September — organised thermals, moderate valley winds and generous daylight, without high summer's punchy midday cycle."}, {"q": "Can you fly XC here in high summer?", "a": "Absolutely — July and August give the highest cloudbases of the year. Plan around the strong midday cycle: launch late morning, respect the peak hours, and finish on the softer evening air."}, {"q": "Is October too late for XC?", "a": "No — October regularly delivers stable, flyable XC days with gentler cycles. Distances shorten with the daylight, but the flying quality stays high."}], "relatedTitle": "Explore More", "related": [{"href": "/cross-country-flights", "label": "Cross Country XC"}, {"href": "/cross-country-flights/routes", "label": "XC Routes"}, {"href": "/weather-guide/best-months", "label": "Best Months to Fly"}, {"href": "/pilot-services", "label": "Pilot Services"}]}, "tr": {"sections": [{"h2": "Babadağ'da XC Sezonu Ne Zaman?", "ps": ["Pratik XC penceresi, sahanın yedi aylık sezonu içinde Nisan sonundan Ekim'e uzanır. Ama 'XC sezonu' aslında her biri kendi karakterine sahip üç farklı sezondur — ve hedeflerinize doğru olanı seçmek, tarih seçmekten daha önemlidir."]}, {"h2": "Üç XC Sezonu", "ps": ["Yılın cross-country için dökümü:"], "bullets": ["İlkbahar (Nisan sonu–Haziran) — taze hava kütleleri, iyi yapılandırılmış termikler, daha yeşil vadiler; birçok yerel, Mayıs–Haziran'ı yılın en iyi XC haftaları sayar", "Yaz zirvesi (Temmuz–Ağustos) — en yüksek bulut tabanları ve en güçlü döngüler; büyük rakam potansiyeli, ama talepkar öğle havası ve güçlü vadi meltemleri", "Sonbahar (Eylül–Ekim) — yumuşak ışıkla istikrarlı, affedici koşullar; rahat XC ve güvenilir retrieval isteyen pilotlara ideal"]}, {"h2": "Sezonu XC Hedefinizle Eşleştirmek", "ps": ["Kişisel mesafe rekoru mu kovalıyorsunuz? Yaz zirvesini hedefleyin ve sert öğle havasına hazır olun. XC deneyimi mi inşa ediyorsunuz? İlkbahar ve sonbahar en dost öğrenme koşullarını verir.", "Ne zaman gelirseniz gelin; ekibimiz o haftanın görünümüne dair tavsiye verebilir, brifing, telsiz ve retrieval'ı buna göre kurar."]}], "faqTitle": "SSS – XC Sezonları", "faqs": [{"q": "Babadağ'da ilk XC için en iyi ay hangisi?", "a": "Mayıs, Haziran veya Eylül — düzenli termikler, ılımlı vadi rüzgarları ve bol gün ışığı; yaz zirvesinin sert öğle döngüsü olmadan."}, {"q": "Yaz zirvesinde burada XC uçulur mu?", "a": "Kesinlikle — Temmuz ve Ağustos yılın en yüksek bulut tabanlarını verir. Güçlü öğle döngüsüne göre planlayın: geç sabah kalkın, zirve saatlerine saygı gösterin, daha yumuşak akşam havasında bitirin."}, {"q": "Ekim XC için çok mu geç?", "a": "Hayır — Ekim, daha nazik döngülerle istikrarlı, uçulabilir XC günleri sunar. Mesafeler gün ışığıyla kısalır ama uçuş kalitesi yüksek kalır."}], "relatedTitle": "Daha Fazlasını Keşfedin", "related": [{"href": "/cross-country-flights", "label": "Cross Country XC"}, {"href": "/cross-country-flights/routes", "label": "XC Rotaları"}, {"href": "/weather-guide/best-months", "label": "Uçmak İçin En İyi Aylar"}, {"href": "/pilot-services", "label": "Pilot Hizmetleri"}]}, "de": {"sections": [{"h2": "Wann ist XC-Saison am Babadağ?", "ps": ["Das praktische XC-Fenster läuft von Ende April bis Oktober, innerhalb der siebenmonatigen Saison des Geländes. Aber 'XC-Saison' sind eigentlich drei verschiedene Saisons mit eigenem Charakter — und die richtige für die eigenen Ziele zu wählen zählt mehr als ein Datum."]}, {"h2": "Die drei XC-Saisons", "ps": ["So teilt sich das Jahr fürs Streckenfliegen auf:"], "bullets": ["Frühjahr (Ende April–Juni) — frische Luftmassen, gut strukturierte Thermik, grünere Täler; viele Einheimische nennen Mai–Juni die feinsten XC-Wochen des Jahres", "Hochsommer (Juli–August) — höchste Basen und stärkste Zyklen; Potenzial für große Zahlen, aber fordernde Mittagsluft und kräftige Talwinde", "Herbst (September–Oktober) — stabile, verzeihende Bedingungen mit weichem Licht; ideal für entspanntes XC und zuverlässige Rückholungen"]}, {"h2": "Saison und XC-Ziele abstimmen", "ps": ["Auf Rekordjagd? Hochsommer anpeilen und auf würzige Mittagsluft vorbereitet sein. XC-Erfahrung aufbauen? Frühjahr und Herbst bieten die freundlichsten Lernbedingungen.", "Wann immer Sie kommen — unser Team berät zur konkreten Wochenlage und organisiert Briefings, Funk und Rückholung passend dazu."]}], "faqTitle": "FAQ – XC-Saisons", "faqs": [{"q": "Welcher Monat ist der beste für den ersten XC am Babadağ?", "a": "Mai, Juni oder September — organisierte Thermik, moderate Talwinde und viel Tageslicht, ohne den bissigen Mittagszyklus des Hochsommers."}, {"q": "Kann man hier im Hochsommer XC fliegen?", "a": "Unbedingt — Juli und August liefern die höchsten Basen des Jahres. Um den starken Mittagszyklus herum planen: am späten Vormittag starten, die Spitzenstunden respektieren, in der weicheren Abendluft abschließen."}, {"q": "Ist der Oktober zu spät für XC?", "a": "Nein — der Oktober liefert regelmäßig stabile, fliegbare XC-Tage mit sanfteren Zyklen. Die Distanzen schrumpfen mit dem Tageslicht, die Flugqualität bleibt hoch."}], "relatedTitle": "Mehr entdecken", "related": [{"href": "/cross-country-flights", "label": "Cross Country XC"}, {"href": "/cross-country-flights/routes", "label": "XC-Routen"}, {"href": "/weather-guide/best-months", "label": "Beste Monate zum Fliegen"}, {"href": "/pilot-services", "label": "Pilotenservices"}]}, "ru": {"sections": [{"h2": "Когда сезон XC на Бабадаге?", "ps": ["Практическое окно XC — с конца апреля по октябрь, внутри семимесячного сезона места. Но «сезон XC» — это на самом деле три разных сезона, каждый со своим характером, и выбрать правильный под свои цели важнее, чем выбрать дату."]}, {"h2": "Три сезона XC", "ps": ["Как год делится для маршрутных полётов:"], "bullets": ["Весна (конец апреля–июнь) — свежие воздушные массы, хорошо структурированные термики, зелёные долины; многие местные называют май–июнь лучшими XC-неделями года", "Разгар лета (июль–август) — самые высокие кромки и сильнейшие циклы; потенциал больших цифр, но требовательный полуденный воздух и сильные долинные бризы", "Осень (сентябрь–октябрь) — стабильные, прощающие условия с мягким светом; идеально для спокойного XC и надёжных подборов"]}, {"h2": "Сезон под ваши цели XC", "ps": ["Гонитесь за личным рекордом дистанции? Цельтесь в разгар лета и будьте готовы к «перчёному» полуденному воздуху. Набираете опыт XC? Весна и осень дают самые дружелюбные условия для обучения.", "Когда бы вы ни приехали, наша команда подскажет прогноз на конкретную неделю и подготовит брифинги, рации и подбор."]}], "faqTitle": "FAQ – сезоны XC", "faqs": [{"q": "Какой месяц лучший для первого XC на Бабадаге?", "a": "Май, июнь или сентябрь — организованные термики, умеренные долинные ветра и много светового дня, без резкого полуденного цикла разгара лета."}, {"q": "Можно ли летать XC здесь в разгар лета?", "a": "Безусловно — июль и август дают самые высокие кромки года. Планируйте вокруг сильного полуденного цикла: старт поздним утром, уважение к пиковым часам, финиш в мягком вечернем воздухе."}, {"q": "Октябрь — слишком поздно для XC?", "a": "Нет — октябрь регулярно дарит стабильные лётные XC-дни с более мягкими циклами. Дистанции укорачиваются вместе со световым днём, но качество полётов остаётся высоким."}], "relatedTitle": "Узнайте больше", "related": [{"href": "/cross-country-flights", "label": "Cross Country XC"}, {"href": "/cross-country-flights/routes", "label": "Маршруты XC"}, {"href": "/weather-guide/best-months", "label": "Лучшие месяцы для полётов"}, {"href": "/pilot-services", "label": "Услуги для пилотов"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'crossCountry' })
  const titles = {en:"XC Flying Seasons Oludeniz",tr:"Oludeniz XC Uçuş Mevsimleri",de:"XC-Flugsaisons Oludeniz",ru:"Сезоны XC Олюдениз"}
  const subs = {en:"Detailed information for licensed paragliding pilots.",tr:"Lisanslı paraşütçüler için ayrıntılı bilgi.",de:"Detaillierte Informationen für lizenzierte Paragliding-Piloten.",ru:"Подробная информация для лицензированных пилотов."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"XC Paragliding Seasons Oludeniz\", \"description\": \"Best seasons for cross-country paragliding from Oludeniz and Babada\\u011f Mountain.\", \"url\": \"https://www.atmosparagliding.com/cross-country-flights/seasons\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://www.atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://www.atmosparagliding.com\"}}" }} />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7bd4/rtDjiycQ-CNoCYjmlrN3-.jpg" />
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
