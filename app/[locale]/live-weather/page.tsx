import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { getOludenizWeather, weatherCodeLabel, windDirectionCompass } from '@/lib/weather'
import { localeAlternates, localeUrl } from '@/lib/seo'

export const revalidate = 900 // 15 minutes

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Live Weather Oludeniz",tr:"Oludeniz Canli Hava",de:"Live-Wetter Oludeniz",ru:"Погода Олюдениз онлайн"}
  const d = {en:"Current conditions at Babadağ and Oludeniz beach.",tr:"Babadağ ve Oludeniz plajındaki güncel koşullar.",de:"Aktuelle Bedingungen am Babadağ und Oludeniz-Strand.",ru:"Текущие условия на Бабадаге и пляже Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/live-weather'),
    openGraph: { url: localeUrl(locale, '/live-weather'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "How Do You Read These Numbers Before a Flight?", "ps": ["Wind speed and direction at the beach, 1200m launch, and Babadağ summit tell us whether conditions are building, steady, or deteriorating. A wide spread between the three altitudes often signals thermal activity; tight agreement usually means calmer, more stable air."]}, {"h2": "What Counts as Flyable at Babadağ?", "ps": ["Our go/no-go call factors in crosswind, gust spread, cloudbase and any frontal activity — not just a single wind speed number. That's why the same reading can mean \"fly\" on one day and \"wait\" on another, depending on the full picture."], "bullets": ["Crosswind above roughly 8km/h — flights are reassessed or delayed", "Gusts above roughly 25km/h — flights are paused", "Any frontal activity nearby — flights are grounded until it clears"]}, {"h2": "Where Can You Get the Daily Flying Call?", "ps": ["We post the day's go/no-go status on our WhatsApp status and Instagram every morning by 08:00, with updates through the day as conditions change. Visiting pilots are also welcome at our 07:30 office briefing for a full weather analysis."]}], "faqTitle": "FAQ – Live Weather at Babadağ", "faqs": [{"q": "How often is this weather data updated?", "a": "Every 15 minutes, pulled directly from open weather models for the beach, 1200m launch and Babadağ summit."}, {"q": "Where can I see today's flight go/no-go decision?", "a": "We post it on our WhatsApp status and Instagram every morning by 08:00, with updates as conditions change through the day."}, {"q": "What if the numbers look flyable but my flight is delayed?", "a": "Our decision considers gusts, crosswind, cloudbase and frontal activity together, not one single reading — a pilot's on-the-ground assessment can override a borderline number."}], "relatedTitle": "More Weather Resources", "related": [{"href": "/weather-guide", "label": "Weather Guide"}, {"href": "/weather-guide/wind-directions", "label": "Wind Directions"}, {"href": "/weather-guide/best-months", "label": "Best Months to Fly"}, {"href": "/thermals-guide", "label": "Thermals Guide"}]}, "tr": {"sections": [{"h2": "Uçuş Öncesi Bu Sayılar Nasıl Okunur?", "ps": ["Plajdaki, 1200m kalkıştaki ve Babadağ zirvesindeki rüzgar hızı ve yönü, koşulların artıp artmadığını, sabit mi yoksa kötüleşmekte mi olduğunu gösterir. Üç irtifa arasında geniş bir fark genellikle termik aktivitesine işaret ederken, birbirine yakın değerler genellikle daha sakin, kararlı havayı gösterir."]}, {"h2": "Babadağ'da Uçuşa Elverişli Ne Sayılır?", "ps": ["Go/no-go kararımız yalnızca tek bir rüzgar hızı değil, yan rüzgar, hamle farkı, bulut tabanı ve cephe aktivitesini birlikte değerlendirir. Bu yüzden aynı okuma bir gün 'uçulur', başka bir gün 'beklenir' anlamına gelebilir."], "bullets": ["Yaklaşık 8km/s üzeri yan rüzgar — uçuşlar yeniden değerlendirilir veya ertelenir", "Yaklaşık 25km/s üzeri hamle — uçuşlar duraklatılır", "Yakınlarda cephe aktivitesi — açılana kadar uçuşlar durdurulur"]}, {"h2": "Günlük Uçuş Kararını Nereden Öğrenebilirsiniz?", "ps": ["Günün go/no-go durumunu her sabah 08:00'a kadar WhatsApp durumumuzda ve Instagram'da paylaşıyoruz; koşullar değiştikçe gün boyunca güncelliyoruz. Ziyaretçi pilotlar da tam hava analizi için 07:30 ofis brifingimize katılabilir."]}], "faqTitle": "SSS – Babadağ'da Canlı Hava Durumu", "faqs": [{"q": "Bu hava verileri ne sıklıkla güncelleniyor?", "a": "Plaj, 1200m kalkış ve Babadağ zirvesi için açık hava durumu modellerinden alınarak her 15 dakikada bir güncellenir."}, {"q": "Bugünün uçuş go/no-go kararını nereden görebilirim?", "a": "Her sabah 08:00'a kadar WhatsApp durumumuzda ve Instagram'da paylaşıyoruz; koşullar değiştikçe gün boyunca güncelliyoruz."}, {"q": "Sayılar uçuşa uygun görünüyor ama uçuşum ertelendiyse ne olur?", "a": "Kararımız tek bir okumayı değil, hamle, yan rüzgar, bulut tabanı ve cephe aktivitesini birlikte değerlendirir — pilotun sahadaki değerlendirmesi sınırda bir sayıyı geçersiz kılabilir."}], "relatedTitle": "Diğer Hava Durumu Kaynakları", "related": [{"href": "/weather-guide", "label": "Hava Durumu Rehberi"}, {"href": "/weather-guide/wind-directions", "label": "Rüzgar Yönleri"}, {"href": "/weather-guide/best-months", "label": "Uçmak İçin En İyi Aylar"}, {"href": "/thermals-guide", "label": "Termik Rehberi"}]}, "de": {"sections": [{"h2": "Wie liest man diese Werte vor einem Flug?", "ps": ["Windgeschwindigkeit und -richtung am Strand, am 1200-m-Startplatz und am Babadağ-Gipfel zeigen, ob sich die Bedingungen aufbauen, stabil bleiben oder verschlechtern. Eine große Spanne zwischen den drei Höhen deutet oft auf Thermik hin; eng beieinanderliegende Werte bedeuten meist ruhigere, stabilere Luft."]}, {"h2": "Was gilt am Babadağ als flugtauglich?", "ps": ["Unsere Go/No-Go-Entscheidung berücksichtigt Seitenwind, Böenspanne, Wolkenbasis und Frontaktivität — nicht nur eine einzelne Windgeschwindigkeit. Deshalb kann derselbe Wert an einem Tag „fliegen\" und an einem anderen „warten\" bedeuten, je nach Gesamtbild."], "bullets": ["Seitenwind über etwa 8km/h — Flüge werden neu bewertet oder verschoben", "Böen über etwa 25km/h — Flüge werden pausiert", "Frontaktivität in der Nähe — Flüge werden bis zum Abziehen ausgesetzt"]}, {"h2": "Wo finden Sie die tägliche Flugentscheidung?", "ps": ["Wir veröffentlichen den Go/No-Go-Status jeden Morgen bis 08:00 Uhr auf unserem WhatsApp-Status und Instagram, mit Updates im Laufe des Tages bei sich ändernden Bedingungen. Besuchende Piloten sind auch bei unserem 07:30-Uhr-Briefing im Büro für eine vollständige Wetteranalyse willkommen."]}], "faqTitle": "FAQ – Live-Wetter am Babadağ", "faqs": [{"q": "Wie oft werden diese Wetterdaten aktualisiert?", "a": "Alle 15 Minuten, direkt aus offenen Wettermodellen für Strand, 1200-m-Startplatz und Babadağ-Gipfel."}, {"q": "Wo sehe ich die heutige Go/No-Go-Entscheidung?", "a": "Wir posten sie jeden Morgen bis 08:00 Uhr auf unserem WhatsApp-Status und Instagram, mit Updates im Tagesverlauf."}, {"q": "Was, wenn die Zahlen flugtauglich aussehen, mein Flug aber verschoben wird?", "a": "Unsere Entscheidung berücksichtigt Böen, Seitenwind, Wolkenbasis und Frontaktivität zusammen, nicht nur einen Wert — die Einschätzung des Piloten vor Ort kann einen Grenzwert übersteuern."}], "relatedTitle": "Weitere Wetter-Ressourcen", "related": [{"href": "/weather-guide", "label": "Wetterleitfaden"}, {"href": "/weather-guide/wind-directions", "label": "Windrichtungen"}, {"href": "/weather-guide/best-months", "label": "Beste Flugmonate"}, {"href": "/thermals-guide", "label": "Thermik-Leitfaden"}]}, "ru": {"sections": [{"h2": "Как читать эти показатели перед полётом?", "ps": ["Скорость и направление ветра на пляже, на старте 1200м и на вершине Бабадага показывают, нарастают ли условия, стабильны или ухудшаются. Большой разброс между тремя высотами часто говорит о термической активности; близкие значения обычно означают более спокойный, стабильный воздух."]}, {"h2": "Что считается лётной погодой на Бабадаге?", "ps": ["Наше решение go/no-go учитывает боковой ветер, разброс порывов, высоту облачности и фронтальную активность — а не только одну цифру скорости ветра. Поэтому одно и то же значение может означать «летим» в один день и «ждём» в другой, в зависимости от полной картины."], "bullets": ["Боковой ветер свыше примерно 8 км/ч — полёты пересматриваются или откладываются", "Порывы свыше примерно 25 км/ч — полёты приостанавливаются", "Фронтальная активность поблизости — полёты не проводятся до прояснения"]}, {"h2": "Где узнать решение о полётах на сегодня?", "ps": ["Мы публикуем статус go/no-go каждое утро до 08:00 в нашем статусе WhatsApp и в Instagram, с обновлениями в течение дня по мере изменения условий. Приезжие пилоты также могут присоединиться к нашему брифингу в офисе в 07:30 для полного анализа погоды."]}], "faqTitle": "FAQ – погода на Бабадаге в реальном времени", "faqs": [{"q": "Как часто обновляются эти данные о погоде?", "a": "Каждые 15 минут, напрямую из открытых погодных моделей для пляжа, старта 1200м и вершины Бабадага."}, {"q": "Где посмотреть сегодняшнее решение go/no-go?", "a": "Мы публикуем его каждое утро до 08:00 в нашем статусе WhatsApp и в Instagram, с обновлениями по мере изменения условий в течение дня."}, {"q": "Что если цифры выглядят лётными, а мой полёт откладывают?", "a": "Наше решение учитывает порывы, боковой ветер, облачность и фронтальную активность вместе, а не одну цифру — оценка пилота на месте может изменить пограничное решение."}], "relatedTitle": "Другие ресурсы о погоде", "related": [{"href": "/weather-guide", "label": "Гид по погоде"}, {"href": "/weather-guide/wind-directions", "label": "Направления ветра"}, {"href": "/weather-guide/best-months", "label": "Лучшие месяцы для полётов"}, {"href": "/thermals-guide", "label": "Гид по термикам"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'liveWeather' })
  const titles = {en:"Live Weather Oludeniz",tr:"Oludeniz Canli Hava",de:"Live-Wetter Oludeniz",ru:"Погода Олюдениз онлайн"}
  const subs = {en:"Current conditions at Babadağ and Oludeniz beach.",tr:"Babadağ ve Oludeniz plajındaki güncel koşullar.",de:"Aktuelle Bedingungen am Babadağ und Oludeniz-Strand.",ru:"Текущие условия на Бабадаге и пляже Олюдениз."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  const weather = await getOludenizWeather()

  const labels = {
    en: { wind: 'Wind', gusts: 'Gusts', humidity: 'Humidity', updated: 'Updated', unavailable: 'Live weather data is temporarily unavailable — please check back shortly.' },
    tr: { wind: 'Rüzgar', gusts: 'Hamle', humidity: 'Nem', updated: 'Güncellendi', unavailable: 'Canlı hava verileri geçici olarak alınamıyor — lütfen kısa süre sonra tekrar kontrol edin.' },
    de: { wind: 'Wind', gusts: 'Böen', humidity: 'Luftfeuchtigkeit', updated: 'Aktualisiert', unavailable: 'Live-Wetterdaten sind vorübergehend nicht verfügbar — bitte später erneut prüfen.' },
    ru: { wind: 'Ветер', gusts: 'Порывы', humidity: 'Влажность', updated: 'Обновлено', unavailable: 'Данные о погоде временно недоступны — проверьте позже.' },
  } as const
  const L = (labels as any)[locale] || labels.en

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Live Weather for Paragliding Oludeniz\", \"description\": \"Live weather conditions and forecast for paragliding in Oludeniz and Babada\\u011f.\", \"url\": \"https://www.atmosparagliding.com/live-weather\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://www.atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://www.atmosparagliding.com\"}}" }} />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0a/3Aur6SnimoW0BlFJ4cq8J.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3"><BreadcrumbNav items={[{ label: title }]} /></div>
      </div>

      <section className="section-padding bg-white">
        <div className="container-default max-w-5xl">
          {weather ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {weather.stations.map((s) => (
                  <div key={s.label} className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
                    <div className="text-sm font-semibold text-orange-500 uppercase tracking-wider">{s.label}</div>
                    <div className="text-xs text-slate-400 mb-4">{s.elevation}</div>
                    <div className="text-4xl font-bold text-slate-900 mb-1">
                      {s.temperatureC !== null ? `${Math.round(s.temperatureC)}°C` : '—'}
                    </div>
                    <div className="text-sm text-slate-500 mb-4">{weatherCodeLabel(s.weatherCode, locale)}</div>
                    <div className="space-y-1.5 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>{L.wind}</span>
                        <span className="font-medium text-slate-900">
                          {s.windSpeedKmh !== null ? `${Math.round(s.windSpeedKmh)} km/h ${windDirectionCompass(s.windDirectionDeg)}` : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{L.gusts}</span>
                        <span className="font-medium text-slate-900">
                          {s.windGustKmh !== null ? `${Math.round(s.windGustKmh)} km/h` : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{L.humidity}</span>
                        <span className="font-medium text-slate-900">
                          {s.humidity !== null ? `${Math.round(s.humidity)}%` : '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-4">
                {L.updated}: {new Date(weather.fetchedAt).toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' })} · Open-Meteo
              </p>
            </>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-slate-500 text-sm">
              {L.unavailable}
            </div>
          )}

          <div className="mt-12">
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
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
