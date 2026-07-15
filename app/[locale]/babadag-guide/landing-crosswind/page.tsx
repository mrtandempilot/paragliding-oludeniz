import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Crosswind Landing Guide",tr:"Çapraz Rüzgar İnişi Rehberi",de:"Seitenwind-Landung",ru:"Посадка при боковом ветре"}
  const d = {en:"Detailed guide for pilots flying into Oludeniz.",tr:"Oludeniz'e inen pilotlar için ayrıntılı rehber.",de:"Detaillierter Leitfaden für Piloten, die in Oludeniz landen.",ru:"Подробный гид для пилотов, приземляющихся в Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/babadag-guide/landing-crosswind'),
    openGraph: { url: localeUrl(locale, '/babadag-guide/landing-crosswind'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/babadag-guide/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${t[locale as keyof typeof t]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "What Is a Crosswind Landing?", "ps": ["A crosswind landing happens when the wind blows across the landing direction instead of straight down it. On the Ölüdeniz beachfront this occurs mainly when the breeze runs along the shoreline while the approach is flown over the sea.", "For trained pilots this is routine: the technique is part of every professional tandem pilot's core skill set, practised thousands of times."]}, {"h2": "How Pilots Handle Crosswind at Ölüdeniz Beach", "ps": ["The key is a controlled 'crab' approach: the glider is pointed slightly into the wind while tracking straight along the landing line. Just before touchdown the pilot aligns the wing, flares, and the landing finishes into wind as much as space allows.", "Pilots also adjust where they land along the beach — the zone is long, so there is always room to choose the segment with the cleanest wind."]}, {"h2": "What Passengers Should Do", "ps": ["Exactly what you do in every landing: keep your legs lifted until the flare, then stand or slide as instructed. The pilot handles all the directional work.", "If conditions exceed safe crosswind limits, the flight simply lands at an alternative area with better wind alignment — decided well in advance, never at the last second."]}], "faqTitle": "FAQ – Crosswind Landings", "faqs": [{"q": "Are crosswind landings dangerous?", "a": "Within limits, no — they are a standard technique every professional pilot masters. When crosswind exceeds safe limits, pilots move to an alternative landing area instead."}, {"q": "Will I feel the difference as a passenger?", "a": "Possibly a slight sideways drift in the final seconds, corrected smoothly by the pilot just before touchdown. Most passengers do not notice at all."}, {"q": "How windy is too windy to fly?", "a": "Takeoffs are suspended when wind at launch or landing exceeds safe operational limits. See our wind guide — conditions are assessed continuously through the day."}], "relatedTitle": "Explore More", "related": [{"href": "/babadag-guide/landing-main-beach", "label": "Main Beach Landing Zone"}, {"href": "/babadag-guide/landing-strong-wind", "label": "Strong Wind Landings"}, {"href": "/weather-guide/wind-directions", "label": "Wind Directions Guide"}, {"href": "/book-now", "label": "Book Your Flight"}]}, "tr": {"sections": [{"h2": "Yan Rüzgar İnişi Nedir?", "ps": ["Yan rüzgar inişi, rüzgarın iniş yönü boyunca değil, iniş hattına çapraz estiği durumdur. Ölüdeniz sahilinde bu, esinti kıyı boyunca akarken yaklaşmanın deniz üzerinden yapıldığı zamanlarda görülür.", "Eğitimli pilotlar için bu rutindir: teknik, her profesyonel tandem pilotunun temel beceri setinin parçasıdır ve binlerce kez çalışılmıştır."]}, {"h2": "Pilotlar Ölüdeniz Plajında Yan Rüzgarı Nasıl Yönetir?", "ps": ["Anahtar, kontrollü bir 'yengeç' yaklaşmasıdır: kanat hafifçe rüzgara doğru tutulurken iniş hattı boyunca düz bir iz sürülür. Temastan hemen önce pilot kanadı hizalar, flare yapar ve iniş, alanın izin verdiği ölçüde rüzgara karşı tamamlanır.", "Pilotlar iniş noktasını da plaj boyunca ayarlar — alan uzundur; en temiz rüzgara sahip bölümü seçmek için her zaman yer vardır."]}, {"h2": "Yolcular Ne Yapmalı?", "ps": ["Her inişte yaptığınızın aynısını: flare'e kadar bacaklarınızı kaldırın, sonra söylendiği gibi ayağa kalkın ya da kayarak inin. Tüm yön işini pilot halleder.", "Koşullar güvenli yan rüzgar limitlerini aşarsa uçuş, rüzgar hizası daha iyi olan alternatif bir alana iner — bu karar son saniyede değil, çok önceden verilir."]}], "faqTitle": "SSS – Yan Rüzgar İnişleri", "faqs": [{"q": "Yan rüzgar inişleri tehlikeli mi?", "a": "Limitler dahilinde hayır — her profesyonel pilotun ustalaştığı standart bir tekniktir. Yan rüzgar güvenli limitleri aşarsa pilotlar alternatif iniş alanına yönelir."}, {"q": "Yolcu olarak farkı hisseder miyim?", "a": "Son saniyelerde hafif bir yana kayma hissedebilirsiniz; pilot temastan hemen önce bunu yumuşakça düzeltir. Çoğu yolcu hiç fark etmez."}, {"q": "Ne kadar rüzgar 'çok' sayılır?", "a": "Kalkış veya inişteki rüzgar güvenli operasyon limitlerini aştığında uçuşlar durdurulur. Rüzgar rehberimize bakın — koşullar gün boyu sürekli değerlendirilir."}], "relatedTitle": "Daha Fazlasını Keşfedin", "related": [{"href": "/babadag-guide/landing-main-beach", "label": "Ana Plaj İniş Alanı"}, {"href": "/babadag-guide/landing-strong-wind", "label": "Güçlü Rüzgarda İniş"}, {"href": "/weather-guide/wind-directions", "label": "Rüzgar Yönleri Rehberi"}, {"href": "/book-now", "label": "Uçuşunuzu Ayırtın"}]}, "de": {"sections": [{"h2": "Was ist eine Seitenwindlandung?", "ps": ["Eine Seitenwindlandung liegt vor, wenn der Wind quer zur Landerichtung weht statt direkt von vorn. An der Strandpromenade von Ölüdeniz passiert das vor allem, wenn die Brise die Küste entlang läuft, während der Anflug über dem Meer erfolgt.", "Für ausgebildete Piloten ist das Routine: Die Technik gehört zum Kernrepertoire jedes professionellen Tandempiloten und wurde tausendfach geübt."]}, {"h2": "So meistern Piloten Seitenwind am Strand von Ölüdeniz", "ps": ["Der Schlüssel ist ein kontrollierter 'Krebsgang'-Anflug: Der Schirm zeigt leicht in den Wind, während er gerade der Landelinie folgt. Kurz vor dem Aufsetzen richtet der Pilot den Schirm aus, flart und beendet die Landung so weit wie möglich gegen den Wind.", "Die Piloten wählen zudem den Landeabschnitt entlang des Strandes — die Zone ist lang, es gibt immer Raum für das Segment mit dem saubersten Wind."]}, {"h2": "Was Passagiere tun sollten", "ps": ["Genau das, was Sie bei jeder Landung tun: Beine bis zum Flare oben halten, dann wie angewiesen aufstehen oder hineinrutschen. Die gesamte Richtungsarbeit übernimmt der Pilot.", "Überschreiten die Bedingungen sichere Seitenwindlimits, landet der Flug einfach auf einer Ausweichfläche mit besserer Windausrichtung — lange im Voraus entschieden, nie in letzter Sekunde."]}], "faqTitle": "FAQ – Seitenwindlandungen", "faqs": [{"q": "Sind Seitenwindlandungen gefährlich?", "a": "Innerhalb der Limits nein — sie sind eine Standardtechnik, die jeder Profi beherrscht. Übersteigt der Seitenwind sichere Grenzen, weichen die Piloten auf eine Ausweichfläche aus."}, {"q": "Merke ich als Passagier den Unterschied?", "a": "Eventuell eine leichte seitliche Drift in den letzten Sekunden, die der Pilot kurz vor dem Aufsetzen sanft korrigiert. Die meisten Passagiere bemerken nichts."}, {"q": "Ab wann ist es zu windig zum Fliegen?", "a": "Starts werden ausgesetzt, wenn der Wind an Start- oder Landeplatz die sicheren Betriebsgrenzen überschreitet. Siehe unseren Windguide — die Bedingungen werden den ganzen Tag über laufend bewertet."}], "relatedTitle": "Mehr entdecken", "related": [{"href": "/babadag-guide/landing-main-beach", "label": "Hauptlandeplatz am Strand"}, {"href": "/babadag-guide/landing-strong-wind", "label": "Landungen bei starkem Wind"}, {"href": "/weather-guide/wind-directions", "label": "Windrichtungen-Guide"}, {"href": "/book-now", "label": "Flug buchen"}]}, "ru": {"sections": [{"h2": "Что такое посадка с боковым ветром?", "ps": ["Посадка с боковым ветром — это когда ветер дует поперёк посадочного курса, а не строго навстречу. На набережной Олюдениза это случается в основном тогда, когда бриз идёт вдоль берега, а заход выполняется над морем.", "Для обученных пилотов это рутина: техника входит в базовый набор навыков каждого профессионального тандем-пилота и отработана тысячи раз."]}, {"h2": "Как пилоты справляются с боковым ветром на пляже Олюдениза", "ps": ["Ключ — контролируемый заход «крабом»: крыло направлено чуть против ветра, при этом движется точно вдоль посадочной линии. Перед самым касанием пилот выравнивает крыло, выполняет подрыв, и посадка завершается против ветра настолько, насколько позволяет пространство.", "Пилоты также выбирают место вдоль пляжа — зона длинная, всегда есть участок с самым чистым ветром."]}, {"h2": "Что делать пассажиру", "ps": ["Ровно то же, что и при любой посадке: держите ноги поднятыми до подрыва, затем встаньте или скользните по команде. Всю работу с направлением выполняет пилот.", "Если условия превышают безопасные пределы бокового ветра, полёт просто завершается на запасной площадке с лучшим ветром — решение принимается заранее, а не в последнюю секунду."]}], "faqTitle": "FAQ – посадка с боковым ветром", "faqs": [{"q": "Опасны ли посадки с боковым ветром?", "a": "В пределах лимитов — нет, это стандартная техника, которой владеет каждый профессионал. Если боковой ветер превышает безопасные пределы, пилоты уходят на запасную площадку."}, {"q": "Почувствую ли я разницу как пассажир?", "a": "Возможно, лёгкий боковой снос в последние секунды, который пилот мягко исправляет перед касанием. Большинство пассажиров вообще ничего не замечают."}, {"q": "Какой ветер считается слишком сильным для полёта?", "a": "Старты приостанавливаются, когда ветер на старте или посадке превышает безопасные рабочие пределы. Смотрите наш гид по ветрам — условия оцениваются непрерывно в течение дня."}], "relatedTitle": "Узнайте больше", "related": [{"href": "/babadag-guide/landing-main-beach", "label": "Основная зона посадки"}, {"href": "/babadag-guide/landing-strong-wind", "label": "Посадка при сильном ветре"}, {"href": "/weather-guide/wind-directions", "label": "Гид по направлениям ветра"}, {"href": "/book-now", "label": "Забронировать полёт"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'babadagGuide' })
  const titles = {en:"Crosswind Landing Guide",tr:"Çapraz Rüzgar İnişi Rehberi",de:"Seitenwind-Landung",ru:"Посадка при боковом ветре"}
  const subs = {en:"Detailed guide for pilots flying into Oludeniz.",tr:"Oludeniz'e inen pilotlar için ayrıntılı rehber.",de:"Detaillierter Leitfaden für Piloten, die in Oludeniz landen.",ru:"Подробный гид для пилотов, приземляющихся в Олюдениз."}
  type L = keyof typeof titles
  const title = titles[locale as L]||titles.en
  const sub = subs[locale as L]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Crosswind Landing Guide Oludeniz Paragliding\", \"description\": \"How to handle crosswind landings when paragliding in Oludeniz.\", \"url\": \"https://www.atmosparagliding.com/babadag-guide/landing-crosswind\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://www.atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://www.atmosparagliding.com\"}}" }} />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c08/BbYEw0ihhZaLcaN29vTrs.jpg" />
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
