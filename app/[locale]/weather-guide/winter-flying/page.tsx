import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Winter Flying Oludeniz",tr:"Oludeniz Kış Uçuşu",de:"Winterfliegen Oludeniz",ru:"Зимние полёты в Олюдениз"}
  const d = {en:"November to March: what to expect for pilots visiting off-season.",tr:"Kasım'dan Mart'a: sezon dışı ziyaret eden pilotlar için beklentiler.",de:"November bis März: Was Piloten außerhalb der Saison erwartet.",ru:"С ноября по март: чего ожидать пилотам вне сезона."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/weather-guide/winter-flying'),
    openGraph: { url: localeUrl(locale, '/weather-guide/winter-flying'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "Can You Paraglide in Ölüdeniz in Winter?", "ps": ["Yes — on the right days. Between November and March, flights operate only when conditions allow: calm, dry days with clear launches. There is no fixed daily schedule like in summer, but winter flying in Ölüdeniz is real and can be spectacular.", "Winter air is often the smoothest of the whole year: cool, stable and crystal clear, with visibility stretching far along the Turquoise Coast."]}, {"h2": "What Makes Winter Flying Different", "ps": ["A few honest differences to plan around:"], "bullets": ["Fewer flyable days — weather systems pass through and can pause flying for days", "Smoother air — little thermal activity means calm, glide-focused flights", "Shorter flights — without thermals, expect the pure glide time from your launch height", "Cold at altitude — dress warmly; we provide flight suits and gloves on cold days", "Empty skies and beaches — you often share the air with only a handful of gliders"]}, {"h2": "How to Plan a Winter Flight", "ps": ["Flexibility is the key. Contact us with your travel dates, and we track the forecast together — when a flyable window appears, we confirm your slot quickly.", "Winter visitors with 3–4 days in the area almost always find at least one good flying day."]}], "faqTitle": "FAQ – Winter Flying", "faqs": [{"q": "Is winter paragliding in Ölüdeniz safe?", "a": "Yes — the same pilots, equipment and SHGM safety limits apply year-round. Flights simply launch only on days that meet those limits, which happens less frequently in winter."}, {"q": "How cold is it during a winter flight?", "a": "Noticeably colder than the beach — expect winter-jacket conditions at altitude. Dress in layers; we provide additional gear on cold days."}, {"q": "Should I book a winter flight in advance?", "a": "Share your dates with us in advance, but the final go/no-go is decided close to the day based on weather. Flexible mornings give the best chance."}], "relatedTitle": "Explore More", "related": [{"href": "/weather-guide", "label": "Ölüdeniz Weather Guide"}, {"href": "/weather-guide/best-months", "label": "Best Months to Fly"}, {"href": "/contact", "label": "Contact Us"}, {"href": "/book-now", "label": "Book Your Flight"}]}, "tr": {"sections": [{"h2": "Ölüdeniz'de Kışın Yamaç Paraşütü Yapılır mı?", "ps": ["Evet — doğru günlerde. Kasım ile Mart arasında uçuşlar yalnızca koşullar izin verdiğinde yapılır: sakin, kuru ve kalkışları açık günlerde. Yazdaki gibi sabit bir günlük program yoktur; ama Ölüdeniz'de kış uçuşu gerçektir ve muhteşem olabilir.", "Kış havası çoğu zaman yılın en pürüzsüz havasıdır: serin, istikrarlı ve kristal berraklığında; görüş Turkuaz Kıyı boyunca uzanır."]}, {"h2": "Kış Uçuşunu Farklı Kılan Ne?", "ps": ["Planlarken bilmeniz gereken birkaç dürüst fark:"], "bullets": ["Daha az uçulabilir gün — hava sistemleri geçerken uçuşlar günlerce durabilir", "Daha pürüzsüz hava — az termik aktivite, sakin ve süzülüş odaklı uçuşlar demek", "Daha kısa uçuşlar — termik olmadan kalkış yüksekliğinizin saf süzülüş süresini bekleyin", "Yüksekte soğuk — kalın giyinin; soğuk günlerde uçuş tulumu ve eldiven veriyoruz", "Boş gökyüzü ve plajlar — havayı çoğu zaman yalnızca birkaç kanatla paylaşırsınız"]}, {"h2": "Kış Uçuşu Nasıl Planlanır?", "ps": ["Anahtar esnekliktir. Seyahat tarihlerinizle bize ulaşın; tahmini birlikte takip ederiz — uçulabilir bir pencere göründüğünde seansınızı hızla onaylarız.", "Bölgede 3–4 günü olan kış ziyaretçileri neredeyse her zaman en az bir iyi uçuş günü bulur."]}], "faqTitle": "SSS – Kış Uçuşları", "faqs": [{"q": "Ölüdeniz'de kış yamaç paraşütü güvenli mi?", "a": "Evet — aynı pilotlar, ekipman ve SHGM güvenlik limitleri tüm yıl geçerlidir. Uçuşlar yalnızca bu limitleri karşılayan günlerde kalkar; kışın bu daha seyrek olur."}, {"q": "Kış uçuşunda hava ne kadar soğuk?", "a": "Plajdan belirgin şekilde soğuk — yüksekte kışlık mont koşulları bekleyin. Katmanlı giyinin; soğuk günlerde ek ekipman sağlıyoruz."}, {"q": "Kış uçuşunu önceden mi ayırtmalıyım?", "a": "Tarihlerinizi önceden paylaşın; ama son karar hava durumuna göre güne yakın verilir. Esnek sabahlar en iyi şansı verir."}], "relatedTitle": "Daha Fazlasını Keşfedin", "related": [{"href": "/weather-guide", "label": "Ölüdeniz Hava Rehberi"}, {"href": "/weather-guide/best-months", "label": "Uçmak İçin En İyi Aylar"}, {"href": "/contact", "label": "Bize Ulaşın"}, {"href": "/book-now", "label": "Uçuşunuzu Ayırtın"}]}, "de": {"sections": [{"h2": "Kann man in Ölüdeniz im Winter Gleitschirmfliegen?", "ps": ["Ja — an den richtigen Tagen. Zwischen November und März wird nur geflogen, wenn die Bedingungen es zulassen: ruhige, trockene Tage mit freien Startplätzen. Es gibt keinen festen Tagesplan wie im Sommer, aber Winterfliegen in Ölüdeniz ist real und kann spektakulär sein.", "Winterluft ist oft die glatteste des ganzen Jahres: kühl, stabil und glasklar, mit Fernsicht weit entlang der Türkisküste."]}, {"h2": "Was Winterfliegen anders macht", "ps": ["Ein paar ehrliche Unterschiede für Ihre Planung:"], "bullets": ["Weniger fliegbare Tage — durchziehende Wetterlagen können den Betrieb tagelang pausieren", "Glattere Luft — kaum Thermik bedeutet ruhige, gleitorientierte Flüge", "Kürzere Flüge — ohne Thermik zählt die reine Gleitzeit aus der Starthöhe", "Kälte in der Höhe — warm anziehen; an kalten Tagen stellen wir Fluganzüge und Handschuhe", "Leerer Himmel und Strände — oft teilen Sie die Luft mit nur einer Handvoll Schirme"]}, {"h2": "So planen Sie einen Winterflug", "ps": ["Flexibilität ist der Schlüssel. Nennen Sie uns Ihre Reisedaten, und wir beobachten die Vorhersage gemeinsam — sobald sich ein fliegbares Fenster zeigt, bestätigen wir Ihren Slot kurzfristig.", "Winterbesucher mit 3–4 Tagen vor Ort finden fast immer mindestens einen guten Flugtag."]}], "faqTitle": "FAQ – Winterfliegen", "faqs": [{"q": "Ist Winter-Gleitschirmfliegen in Ölüdeniz sicher?", "a": "Ja — dieselben Piloten, dieselbe Ausrüstung und dieselben SHGM-Sicherheitslimits gelten das ganze Jahr. Geflogen wird nur an Tagen, die diese Limits erfüllen — im Winter seltener."}, {"q": "Wie kalt ist es bei einem Winterflug?", "a": "Deutlich kälter als am Strand — rechnen Sie in der Höhe mit Winterjacken-Bedingungen. Ziehen Sie sich in Schichten an; an kalten Tagen stellen wir zusätzliche Ausrüstung."}, {"q": "Sollte ich einen Winterflug im Voraus buchen?", "a": "Teilen Sie uns Ihre Daten vorab mit, aber die endgültige Entscheidung fällt wetterbedingt kurz vor dem Tag. Flexible Vormittage bieten die besten Chancen."}], "relatedTitle": "Mehr entdecken", "related": [{"href": "/weather-guide", "label": "Ölüdeniz Wetterguide"}, {"href": "/weather-guide/best-months", "label": "Beste Monate zum Fliegen"}, {"href": "/contact", "label": "Kontakt"}, {"href": "/book-now", "label": "Flug buchen"}]}, "ru": {"sections": [{"h2": "Можно ли летать на параплане в Олюденизе зимой?", "ps": ["Да — в подходящие дни. С ноября по март полёты выполняются только тогда, когда позволяют условия: в тихие, сухие дни с открытыми стартами. Фиксированного ежедневного расписания, как летом, нет, но зимние полёты в Олюденизе реальны и могут быть великолепны.", "Зимний воздух часто самый гладкий за весь год: прохладный, стабильный и кристально чистый, с видимостью далеко вдоль Бирюзового побережья."]}, {"h2": "Чем зимние полёты отличаются", "ps": ["Несколько честных отличий для планирования:"], "bullets": ["Меньше лётных дней — проходящие фронты могут останавливать полёты на несколько дней", "Более гладкий воздух — почти нет термиков, полёты спокойные, планирующие", "Более короткие полёты — без термиков остаётся чистое время планирования с высоты старта", "Холод на высоте — одевайтесь тепло; в холодные дни выдаём комбинезоны и перчатки", "Пустое небо и пляжи — воздух вы делите с считаными крыльями"]}, {"h2": "Как спланировать зимний полёт", "ps": ["Ключ — гибкость. Сообщите нам даты поездки, и мы вместе следим за прогнозом: как только появляется лётное окно, быстро подтверждаем ваш слот.", "Зимние гости, у которых есть 3–4 дня в регионе, почти всегда находят хотя бы один хороший лётный день."]}], "faqTitle": "FAQ – зимние полёты", "faqs": [{"q": "Безопасен ли зимний парапланеризм в Олюденизе?", "a": "Да — те же пилоты, снаряжение и лимиты безопасности SHGM действуют круглый год. Полёты стартуют только в дни, отвечающие этим лимитам, — зимой такие дни реже."}, {"q": "Насколько холодно во время зимнего полёта?", "a": "Заметно холоднее, чем на пляже — на высоте рассчитывайте на условия «зимней куртки». Одевайтесь слоями; в холодные дни мы выдаём дополнительное снаряжение."}, {"q": "Нужно ли бронировать зимний полёт заранее?", "a": "Сообщите даты заранее, но финальное решение принимается ближе к дню по погоде. Гибкие утренние часы дают лучший шанс."}], "relatedTitle": "Узнайте больше", "related": [{"href": "/weather-guide", "label": "Гид по погоде Олюдениза"}, {"href": "/weather-guide/best-months", "label": "Лучшие месяцы для полётов"}, {"href": "/contact", "label": "Связаться с нами"}, {"href": "/book-now", "label": "Забронировать полёт"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'weatherGuide' })
  const titles = {en:"Winter Flying Oludeniz",tr:"Oludeniz Kış Uçuşu",de:"Winterfliegen Oludeniz",ru:"Зимние полёты в Олюдениз"}
  const subs = {en:"November to March: what to expect for pilots visiting off-season.",tr:"Kasım'dan Mart'a: sezon dışı ziyaret eden pilotlar için beklentiler.",de:"November bis März: Was Piloten außerhalb der Saison erwartet.",ru:"С ноября по март: чего ожидать пилотам вне сезона."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Winter Flying Paragliding Oludeniz\", \"description\": \"Guide to paragliding in Oludeniz during winter months \\u2014 conditions, risks and opportunities.\", \"url\": \"https://www.atmosparagliding.com/weather-guide/winter-flying\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://www.atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://www.atmosparagliding.com\"}}" }} />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0a/3Aur6SnimoW0BlFJ4cq8J.jpg" />
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
