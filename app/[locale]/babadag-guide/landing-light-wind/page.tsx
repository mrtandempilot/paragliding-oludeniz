import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Light Wind Landing Guide",tr:"Hafif Rüzgar İnişi",de:"Leichtwind-Landung",ru:"Посадка при слабом ветре"}
  const d = {en:"Detailed guide for pilots flying into Oludeniz.",tr:"Oludeniz'e inen pilotlar için ayrıntılı rehber.",de:"Detaillierter Leitfaden für Piloten, die in Oludeniz landen.",ru:"Подробный гид для пилотов, приземляющихся в Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/babadag-guide/landing-light-wind'),
    openGraph: { url: localeUrl(locale, '/babadag-guide/landing-light-wind'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${t[locale as keyof typeof t]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "What Changes When the Wind Is Light?", "ps": ["In light or nil wind, the glider keeps more speed over the ground on final approach. Landings are still safe and routine — they simply need more space and a longer, flatter final glide.", "Ölüdeniz's long beach landing zone is ideal for this: pilots use the extra length to bleed off speed gradually before a running or sliding touchdown."]}, {"h2": "The Technique Pilots Use", "ps": ["Pilots set up a longer final, hold the glider in ground effect to wash off speed, then apply a strong, progressive flare at exactly the right moment. Timing replaces headwind as the tool that makes the landing soft.", "For tandem landings in light wind, passengers are usually briefed to be ready for a few running steps — or to slide in on the harness seat, which is just as safe."]}, {"h2": "When Does Light Wind Happen in Ölüdeniz?", "ps": ["Typically in the early morning and around sunset, when the daily sea-breeze cycle is at its weakest. These are also the smoothest, most scenic times to fly.", "Light-wind evenings are the classic setting for sunset flights — glassy air, golden light and a calm, floaty landing on the beach."]}], "faqTitle": "FAQ – Light Wind Landings", "faqs": [{"q": "Do I need to run during a light-wind landing?", "a": "Sometimes a few steps, yes. Your pilot briefs you in advance; many light-wind tandem landings finish with a gentle slide on the harness instead — both are completely normal."}, {"q": "Is light wind better for first-time flyers?", "a": "Light-wind mornings and evenings offer the smoothest air, which many first-timers prefer. The landing needs slightly more space, but the beach zone has plenty."}, {"q": "Are sunset flights light-wind flights?", "a": "Usually yes — by sunset the sea breeze has faded, giving calm air and soft light. It is one of the most popular flight slots we offer."}], "relatedTitle": "Explore More", "related": [{"href": "/babadag-guide/landing-main-beach", "label": "Main Beach Landing Zone"}, {"href": "/babadag-guide/landing-strong-wind", "label": "Strong Wind Landings"}, {"href": "/tandem-paragliding/sunset-flight", "label": "Sunset Flights"}, {"href": "/book-now", "label": "Book Your Flight"}]}, "tr": {"sections": [{"h2": "Rüzgar Hafifken Ne Değişir?", "ps": ["Hafif veya sıfır rüzgarda kanat, son yaklaşmada yere göre daha fazla hız taşır. İnişler yine güvenli ve rutindir — sadece daha fazla alan ve daha uzun, daha düz bir son süzülüş gerektirir.", "Ölüdeniz'in uzun plaj iniş alanı bunun için idealdir: pilotlar fazladan uzunluğu, koşarak veya kayarak temastan önce hızı kademeli azaltmak için kullanır."]}, {"h2": "Pilotların Kullandığı Teknik", "ps": ["Pilotlar daha uzun bir final kurar, hızı kesmek için kanadı yer etkisinde tutar ve tam doğru anda güçlü, kademeli bir flare uygular. İnişi yumuşatan araç olarak rüzgarın yerini zamanlama alır.", "Hafif rüzgarda tandem inişlerde yolculara genellikle birkaç adım koşmaya hazır olmaları söylenir — ya da eşit derecede güvenli olan harness üzerinde kayarak iniş yaptırılır."]}, {"h2": "Ölüdeniz'de Hafif Rüzgar Ne Zaman Görülür?", "ps": ["Genellikle sabah erken saatlerde ve gün batımı civarında, günlük deniz meltemi döngüsünün en zayıf olduğu anlarda. Bunlar aynı zamanda uçuş için en pürüzsüz, en manzaralı zamanlardır.", "Hafif rüzgarlı akşamlar, gün batımı uçuşlarının klasik sahnesidir — cam gibi hava, altın ışık ve plaja sakin, süzülen bir iniş."]}], "faqTitle": "SSS – Hafif Rüzgarda İniş", "faqs": [{"q": "Hafif rüzgarda inişte koşmam gerekir mi?", "a": "Bazen birkaç adım, evet. Pilotunuz önceden brifing verir; hafif rüzgardaki birçok tandem iniş, bunun yerine harness üzerinde nazik bir kaymayla biter — ikisi de tamamen normaldir."}, {"q": "Hafif rüzgar ilk kez uçacaklar için daha mı iyi?", "a": "Hafif rüzgarlı sabahlar ve akşamlar en pürüzsüz havayı sunar; birçok yeni uçucu bunu tercih eder. İniş biraz daha fazla alan ister ama plaj alanında bolca yer vardır."}, {"q": "Gün batımı uçuşları hafif rüzgar uçuşları mıdır?", "a": "Genellikle evet — gün batımına doğru deniz meltemi zayıflar; sakin hava ve yumuşak ışık kalır. Sunduğumuz en popüler seanslardan biridir."}], "relatedTitle": "Daha Fazlasını Keşfedin", "related": [{"href": "/babadag-guide/landing-main-beach", "label": "Ana Plaj İniş Alanı"}, {"href": "/babadag-guide/landing-strong-wind", "label": "Güçlü Rüzgarda İniş"}, {"href": "/tandem-paragliding/sunset-flight", "label": "Gün Batımı Uçuşları"}, {"href": "/book-now", "label": "Uçuşunuzu Ayırtın"}]}, "de": {"sections": [{"h2": "Was ändert sich bei leichtem Wind?", "ps": ["Bei leichtem oder keinem Wind behält der Schirm im Endanflug mehr Geschwindigkeit über Grund. Die Landungen sind trotzdem sicher und Routine — sie brauchen nur mehr Raum und einen längeren, flacheren Endanflug.", "Die lange Strandlandezone von Ölüdeniz ist dafür ideal: Die Piloten nutzen die zusätzliche Länge, um die Geschwindigkeit allmählich abzubauen, bevor sie laufend oder rutschend aufsetzen."]}, {"h2": "Die Technik der Piloten", "ps": ["Die Piloten planen einen längeren Endanflug, halten den Schirm im Bodeneffekt, um Fahrt abzubauen, und flaren kräftig und progressiv im genau richtigen Moment. Timing ersetzt den Gegenwind als Werkzeug für eine sanfte Landung.", "Bei Tandemlandungen mit wenig Wind werden Passagiere meist auf ein paar Laufschritte vorbereitet — oder auf ein Hineinrutschen auf dem Gurtzeug, das genauso sicher ist."]}, {"h2": "Wann gibt es in Ölüdeniz leichten Wind?", "ps": ["Typischerweise am frühen Morgen und um den Sonnenuntergang, wenn der tägliche Seebrisen-Zyklus am schwächsten ist. Das sind zugleich die ruhigsten, schönsten Flugzeiten.", "Windstille Abende sind die klassische Kulisse für Sunset-Flüge — glasklare Luft, goldenes Licht und eine ruhige, schwebende Landung am Strand."]}], "faqTitle": "FAQ – Landungen bei leichtem Wind", "faqs": [{"q": "Muss ich bei einer Landung mit wenig Wind laufen?", "a": "Manchmal ein paar Schritte, ja. Ihr Pilot brieft Sie vorher; viele Tandemlandungen bei wenig Wind enden stattdessen mit einem sanften Rutschen auf dem Gurtzeug — beides ist völlig normal."}, {"q": "Ist leichter Wind besser für Erstflieger?", "a": "Morgen und Abende mit wenig Wind bieten die ruhigste Luft, was viele Erstflieger bevorzugen. Die Landung braucht etwas mehr Raum, aber die Strandzone hat reichlich davon."}, {"q": "Sind Sunset-Flüge Leichtwind-Flüge?", "a": "Meistens ja — bis zum Sonnenuntergang hat die Seebrise nachgelassen; es bleiben ruhige Luft und weiches Licht. Einer unserer beliebtesten Flugslots."}], "relatedTitle": "Mehr entdecken", "related": [{"href": "/babadag-guide/landing-main-beach", "label": "Hauptlandeplatz am Strand"}, {"href": "/babadag-guide/landing-strong-wind", "label": "Landungen bei starkem Wind"}, {"href": "/tandem-paragliding/sunset-flight", "label": "Sunset-Flüge"}, {"href": "/book-now", "label": "Flug buchen"}]}, "ru": {"sections": [{"h2": "Что меняется при слабом ветре?", "ps": ["При слабом или нулевом ветре крыло сохраняет большую скорость относительно земли на посадочной прямой. Посадки всё так же безопасны и рутинны — им просто нужно больше пространства и более длинное, пологое финальное скольжение.", "Длинная пляжная зона посадки Олюдениза идеальна для этого: пилоты используют запас длины, чтобы плавно погасить скорость перед касанием с пробежкой или скольжением."]}, {"h2": "Техника пилотов", "ps": ["Пилоты выстраивают более длинную посадочную прямую, удерживают крыло в экране, гася скорость, и выполняют сильный прогрессивный подрыв точно в нужный момент. Вместо встречного ветра мягкость посадки обеспечивает тайминг.", "На тандемных посадках при слабом ветре пассажиров обычно готовят к нескольким шагам пробежки — или к скольжению на сиденье подвески, что так же безопасно."]}, {"h2": "Когда в Олюденизе бывает слабый ветер?", "ps": ["Как правило, ранним утром и на закате, когда суточный цикл морского бриза слабее всего. Это же — самое гладкое и живописное время для полётов.", "Тихие вечера — классика закатных полётов: зеркальный воздух, золотой свет и спокойная, парящая посадка на пляж."]}], "faqTitle": "FAQ – посадка при слабом ветре", "faqs": [{"q": "Придётся ли бежать при посадке в слабый ветер?", "a": "Иногда несколько шагов — да. Пилот предупредит заранее; многие тандемные посадки при слабом ветре заканчиваются мягким скольжением на подвеске — оба варианта совершенно нормальны."}, {"q": "Слабый ветер лучше для первого полёта?", "a": "Утро и вечер со слабым ветром дают самый спокойный воздух — многие новички предпочитают именно это время. Посадке нужно чуть больше места, но на пляже его достаточно."}, {"q": "Закатные полёты — это полёты в слабый ветер?", "a": "Обычно да — к закату морской бриз стихает, оставляя спокойный воздух и мягкий свет. Это один из самых популярных наших слотов."}], "relatedTitle": "Узнайте больше", "related": [{"href": "/babadag-guide/landing-main-beach", "label": "Основная зона посадки"}, {"href": "/babadag-guide/landing-strong-wind", "label": "Посадка при сильном ветре"}, {"href": "/tandem-paragliding/sunset-flight", "label": "Закатные полёты"}, {"href": "/book-now", "label": "Забронировать полёт"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'babadagGuide' })
  const titles = {en:"Light Wind Landing Guide",tr:"Hafif Rüzgar İnişi",de:"Leichtwind-Landung",ru:"Посадка при слабом ветре"}
  const subs = {en:"Detailed guide for pilots flying into Oludeniz.",tr:"Oludeniz'e inen pilotlar için ayrıntılı rehber.",de:"Detaillierter Leitfaden für Piloten, die in Oludeniz landen.",ru:"Подробный гид для пилотов, приземляющихся в Олюдениз."}
  type L = keyof typeof titles
  const title = titles[locale as L]||titles.en
  const sub = subs[locale as L]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Light Wind Landing Paragliding Oludeniz\", \"description\": \"Techniques for landing in light wind conditions when paragliding in Oludeniz.\", \"url\": \"https://www.atmosparagliding.com/babadag-guide/landing-light-wind\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://www.atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://www.atmosparagliding.com\"}}" }} />
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
