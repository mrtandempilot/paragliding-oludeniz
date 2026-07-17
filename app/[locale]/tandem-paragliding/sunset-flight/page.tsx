import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'
import ServiceSchema from '@/components/shared/ServiceSchema'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const titles: Record<string,string> = {en:"Sunset Paragliding Oludeniz",tr:"Gün Batımı Paraşüt Uçuşu",de:"Sonnenuntergangs-Paragliding",ru:"Закатный полёт на параплане"}
  const d: Record<string, string> = {"en": "Sunset tandem paragliding over the Blue Lagoon — golden hour flights from Babadağ. The most magical way to experience Oludeniz.", "tr": "Mavi Lagün üzerinde gün batımı tandem uçuşu — Babadağ'dan altın saat uçuşları. Ölüdeniz'i deneyimlemenin en büyülü yolu.", "de": "Sunset-Tandemflug über der Blauen Lagune — Flüge zur goldenen Stunde vom Babadağ. Das magischste Erlebnis in Ölüdeniz.", "ru": "Закатный тандемный полёт над Голубой лагуной — полёты в золотой час с Бабадага. Самый волшебный способ увидеть Олюдениз."}
  return {
    description: d[locale] || d.en,
    alternates: localeAlternates(locale, '/tandem-paragliding/sunset-flight'),
    openGraph: { url: localeUrl(locale, '/tandem-paragliding/sunset-flight'), description: d[locale] || d.en, images: ['https://www.atmosparagliding.com/tandem-paragliding/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: d[locale] || d.en }, title: `${titles[locale]||titles.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "When Do Sunset Flights Launch?", "ps": ["Sunset flights launch from the 1200m takeoff point in the late afternoon (typically 17:00–18:30, depending on season). The air is calmer, the thermals are gentler, and the light is extraordinary."]}, {"h2": "What Makes the Sunset Flight Experience Special?", "ps": ["As you soar above the Blue Lagoon, the sky transforms from blue to gold to deep orange. The silhouette of Babadağ behind you, the islands in the distance, the turquoise water below — photographers agree this is one of the most beautiful paragliding experiences in the world."]}, {"h2": "How Long Does It Last and What's Included?", "ps": ["Sunset flights last approximately 20–30 minutes. A professional photo package is available for $35 extra. Slots are very limited — book at least 2–3 days in advance in peak season."]}, {"h2": "What Does a Sunset Flight Cost?", "ps": ["From $160 per person. Includes all equipment, transfer to launch, and pilot. A professional photo package is available for $35 extra."]}], "faqTitle": "FAQ – Sunset Flight", "faqs": [{"q": "How far in advance should I book a sunset flight?", "a": "At least 2–3 days in advance during peak season, as slots are very limited."}, {"q": "Is the sunset flight photo package included?", "a": "No, it's not included in the base price — a professional photo package is available for $35 extra."}, {"q": "How does the sunset flight differ from a standard flight?", "a": "It launches later in the day for golden-hour light, is slightly shorter at 20–30 minutes, and flies in typically calmer evening air."}], "relatedTitle": "More on Tandem Paragliding", "related": [{"href": "/tandem-paragliding/first-time", "label": "First Time Flying"}, {"href": "/tandem-paragliding/safety-guide", "label": "Safety Guide"}, {"href": "/tandem-paragliding/sunset-flight", "label": "Sunset Flight"}, {"href": "/tandem-paragliding/group-flights", "label": "Group Flights"}]}, "tr": {"sections": [{"h2": "Gün Batımı Uçuşları Ne Zaman Kalkıyor?", "ps": ["Gün batımı uçuşları öğleden sonra geç saatlerde 1200m kalkış noktasından yapılır (genellikle sezona bağlı olarak 17:00-18:30). Hava daha sakin, termikler daha yumuşak ve ışık olağanüstü."]}, {"h2": "Gün Batımı Uçuşunu Özel Yapan Nedir?", "ps": ["Mavi Lagün üzerinde süzülürken gökyüzü maviden altına ve derin turuncuya dönüşür. Arkanızda Babadağ'ın silüeti, uzakta adalar, aşağıda turkuaz sular — fotoğrafçılar bunun dünyanın en güzel paraşüt deneyimlerinden biri olduğu konusunda hemfikir."]}, {"h2": "Ne Kadar Sürer ve Nelere Dahil?", "ps": ["Gün batımı uçuşları yaklaşık 20-30 dakika sürer. Profesyonel fotoğraf paketi $35 ekstra ücretle mevcuttur. Yoğun sezonda en az 2-3 gün önceden rezervasyon yapın."]}, {"h2": "Gün Batımı Uçuşu Ne Kadar Tutuyor?", "ps": ["Kişi başı $160'dır. Tüm ekipman, kalkışa transfer ve pilot dahildir. Profesyonel fotoğraf paketi $35 ekstra ücretle mevcuttur."]}], "faqTitle": "SSS – Gün Batımı Uçuşu", "faqs": [{"q": "Gün batımı uçuşu için ne kadar önceden rezervasyon yapmalıyım?", "a": "Yoğun sezonda en az 2-3 gün önceden, çünkü yerler çok sınırlıdır."}, {"q": "Fotoğraf paketi dahil mi?", "a": "Hayır, fotoğraf paketi baz fiyata dahil değildir — $35 ekstra ücretle mevcuttur."}, {"q": "Gün batımı uçuşu standart uçuştan nasıl farklı?", "a": "Altın saat ışığı için günün daha geç saatinde kalkar, 20-30 dakikayla biraz daha kısadır ve genellikle daha sakin akşam havasında uçar."}], "relatedTitle": "Tandem Paraşüt Hakkında Daha Fazla", "related": [{"href": "/tandem-paragliding/first-time", "label": "İlk Kez Uçuş"}, {"href": "/tandem-paragliding/safety-guide", "label": "Güvenlik Rehberi"}, {"href": "/tandem-paragliding/sunset-flight", "label": "Gün Batımı Uçuşu"}, {"href": "/tandem-paragliding/group-flights", "label": "Grup Uçuşları"}]}, "de": {"sections": [{"h2": "Wann starten Sonnenuntergangsflüge?", "ps": ["Sonnenuntergangsflüge starten am späten Nachmittag vom 1200m-Startplatz (typischerweise 17:00-18:30, je nach Saison). Die Luft ist ruhiger, die Thermik sanfter und das Licht außergewöhnlich."]}, {"h2": "Was macht das Sonnenuntergangs-Erlebnis besonders?", "ps": ["Während Sie über die Blaue Lagune gleiten, verwandelt sich der Himmel von Blau in Gold und tiefes Orange. Die Silhouette des Babadağ hinter Ihnen, die Inseln in der Ferne, das türkisfarbene Wasser unten — Fotografen sind sich einig, dass dies eines der schönsten Paragliding-Erlebnisse der Welt ist."]}, {"h2": "Wie lange dauert es und was ist enthalten?", "ps": ["Sonnenuntergangsflüge dauern ca. 20-30 Minuten. Ein professionelles Fotopaket ist für $35 extra erhältlich. Plätze sind sehr begrenzt — buchen Sie in der Hochsaison mindestens 2-3 Tage im Voraus."]}, {"h2": "Was kostet ein Sonnenuntergangsflug?", "ps": ["Ab $160 pro Person. Inklusive Ausrüstung, Transfer zum Start und Pilot. Ein professionelles Fotopaket ist für $35 extra erhältlich."]}], "faqTitle": "FAQ – Sonnenuntergangsflug", "faqs": [{"q": "Wie weit im Voraus sollte ich einen Sonnenuntergangsflug buchen?", "a": "Mindestens 2-3 Tage im Voraus in der Hochsaison, da die Plätze sehr begrenzt sind."}, {"q": "Ist das Fotopaket beim Sonnenuntergangsflug enthalten?", "a": "Nein, das Fotopaket ist nicht im Grundpreis enthalten — es ist für $35 extra erhältlich."}, {"q": "Wie unterscheidet sich der Sonnenuntergangsflug von einem Standardflug?", "a": "Er startet später am Tag für goldenes Licht, ist mit 20-30 Minuten etwas kürzer und fliegt in typischerweise ruhigerer Abendluft."}], "relatedTitle": "Mehr zum Tandem-Paragliding", "related": [{"href": "/tandem-paragliding/first-time", "label": "Erster Flug"}, {"href": "/tandem-paragliding/safety-guide", "label": "Sicherheitsleitfaden"}, {"href": "/tandem-paragliding/sunset-flight", "label": "Sonnenuntergangsflug"}, {"href": "/tandem-paragliding/group-flights", "label": "Gruppenflüge"}]}, "ru": {"sections": [{"h2": "Когда стартуют закатные полёты?", "ps": ["Закатные полёты стартуют с площадки 1200м в конце дня (обычно 17:00-18:30, в зависимости от сезона). Воздух спокойнее, термики мягче, а освещение исключительное."]}, {"h2": "Что делает закатный полёт особенным?", "ps": ["Паря над Голубой Лагуной, небо меняется от синего к золотому и тёмно-оранжевому. Силуэт Бабадага позади вас, острова вдали, бирюзовая вода внизу — фотографы согласны, что это один из самых красивых парапланерных опытов в мире."]}, {"h2": "Сколько длится и что включено?", "ps": ["Закатные полёты длятся около 20-30 минут. Профессиональный фотопакет доступен за $35 дополнительно. Места очень ограничены — бронируйте за 2-3 дня в пик сезона."]}, {"h2": "Сколько стоит закатный полёт?", "ps": ["От $160 за человека. Включает всё снаряжение, трансфер к месту старта и пилота. Профессиональный фотопакет доступен за $35 дополнительно."]}], "faqTitle": "FAQ – закатный полёт", "faqs": [{"q": "За сколько нужно бронировать закатный полёт?", "a": "Минимум за 2-3 дня в пик сезона, так как места очень ограничены."}, {"q": "Включён ли фотопакет?", "a": "Нет, он не включён в базовую цену — фотопакет доступен за $35 дополнительно."}, {"q": "Чем закатный полёт отличается от стандартного?", "a": "Он стартует позже для золотого света, немного короче (20-30 минут) и проходит в обычно более спокойном вечернем воздухе."}], "relatedTitle": "Больше о тандемном парапланеризме", "related": [{"href": "/tandem-paragliding/first-time", "label": "Первый полёт"}, {"href": "/tandem-paragliding/safety-guide", "label": "Руководство по безопасности"}, {"href": "/tandem-paragliding/sunset-flight", "label": "Закатный полёт"}, {"href": "/tandem-paragliding/group-flights", "label": "Групповые полёты"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'tandem' })
  const titles: Record<string,string> = {en:"Sunset Paragliding Oludeniz",tr:"Gün Batımı Paraşüt Uçuşu",de:"Sonnenuntergangs-Paragliding",ru:"Закатный полёт на параплане"}
  const subtitles: Record<string,string> = {en:"The most magical flight in Oludeniz — golden hour over the Blue Lagoon.",tr:"Oludeniz'in en büyülü uçuşu — Mavi Lagün üzerinde altın saat.",de:"Der magischste Flug in Oludeniz — goldene Stunde über der Blauen Lagune.",ru:"Самый волшебный полёт в Олюдениз — золотой час над Голубой Лагуной."}
  const title = titles[locale]||titles.en
  const subtitle = subtitles[locale]||subtitles.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)

  return (
    <>
      <ServiceSchema name="Sunset Tandem Paragliding Flight" description="Golden hour tandem paragliding flight over the Blue Lagoon from Babadağ." path="/tandem-paragliding/sunset-flight" serviceType="Tandem Paragliding Flight" />
      <PageHero title={title} subtitle={subtitle} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c09/2htlcwkJ6pcLBY7gPtf7z.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: title }]} />
        </div>
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
