import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Paramotor Launch Sites Oludeniz",tr:"Oludeniz Paramotor Kalkış Noktaları",de:"Paramotor Launch Sites Oludeniz",ru:"Paramotor Launch Sites Oludeniz"}
  const d = {en:"Powered paragliding information for Oludeniz.",tr:"Oludeniz için motorlu paraşüt bilgileri.",de:"Motorisiertes Paragliding-Informationen für Oludeniz.",ru:"Информация о моторизованном парапланеризме для Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/paramotor/launch-sites'),
    openGraph: { url: localeUrl(locale, '/paramotor/launch-sites'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "Where Do Paramotors Launch Around Ölüdeniz?", "ps": ["Unlike free-flight paragliders, paramotors need flat ground and a clear run — so their world is the plains, not the mountain. The Ölüdeniz–Ovacık plain and agricultural flats toward Fethiye offer the workable sites, used with landowner consent and local coordination.", "The reward for the humble takeoff is total freedom: with power, the whole coastline becomes your playground at whatever altitude the rules allow."]}, {"h2": "What Makes a Good Local Launch Site", "ps": ["The checklist for a paramotor field here:"], "bullets": ["A flat 50m+ run clear of stones, ditches and crops", "Open approaches without powerlines or trees on climb-out", "Distance from houses — engine noise carries at dawn", "Agreed with the landowner and known to local operations", "An escape route over open ground for the first low minute"]}, {"h2": "Getting Site Access as a Visitor", "ps": ["Do not guess — ask. Field access changes with seasons and crops, and the sensitive spots are local knowledge. Contact us before your trip and we will connect you with the current paramotor picture: which fields are in use, whom to ask and how mornings are organised."]}], "faqTitle": "FAQ – Paramotor Launch Sites", "faqs": [{"q": "Can I take off from the beach with a paramotor?", "a": "No — the beach is the managed tandem landing zone. Paramotor launches happen from agreed field sites on the plains nearby."}, {"q": "Are there official paramotor airfields in the area?", "a": "There are established, informally agreed field sites rather than marked airfields. Local coordination tells you which are current — arrangements shift with crops and seasons."}, {"q": "Can I fly along the Blue Lagoon with a paramotor?", "a": "Coastal routing is possible within the rules — respecting altitude limits, the tandem corridor and noise courtesy over the protected lagoon area. Get the local briefing first."}], "relatedTitle": "Explore More", "related": [{"href": "/paramotor", "label": "Paramotor Guide"}, {"href": "/paramotor/rules", "label": "Paramotor Rules"}, {"href": "/paramotor/training", "label": "Paramotor Training"}, {"href": "/contact", "label": "Contact Us"}]}, "tr": {"sections": [{"h2": "Ölüdeniz Çevresinde Paramotorlar Nereden Kalkar?", "ps": ["Serbest uçuş yamaç paraşütlerinin aksine paramotorlar düz zemin ve temiz bir koşu ister — bu yüzden dünyaları dağ değil, ovalardır. Ölüdeniz–Ovacık ovası ve Fethiye yönündeki tarım düzlükleri; arazi sahibi rızası ve yerel koordinasyonla kullanılan uygun alanları sunar.", "Mütevazı kalkışın ödülü tam özgürlüktür: motorla, kuralların izin verdiği irtifada tüm sahil şeridi oyun alanınız olur."]}, {"h2": "İyi Bir Yerel Kalkış Alanını Ne Yapar?", "ps": ["Buradaki bir paramotor arazisinin kontrol listesi:"], "bullets": ["Taş, hendek ve ekinden arınmış 50m+ düz koşu", "Tırmanışta elektrik hattı veya ağaç olmayan açık yaklaşmalar", "Evlerden uzaklık — motor sesi şafakta uzağa taşınır", "Arazi sahibiyle anlaşılmış ve yerel operasyonlarca bilinen", "İlk alçak dakika için açık zemin üzerinde bir kaçış rotası"]}, {"h2": "Misafir Olarak Alan Erişimi", "ps": ["Tahmin etmeyin — sorun. Arazi erişimi mevsimle ve ekinle değişir; hassas noktalar yerel bilgidir. Gezinizden önce bize ulaşın; sizi güncel paramotor tablosuyla buluşturalım: hangi tarlalar kullanımda, kime sorulur, sabahlar nasıl organize edilir."]}], "faqTitle": "SSS – Paramotor Kalkış Alanları", "faqs": [{"q": "Paramotorla plajdan kalkabilir miyim?", "a": "Hayır — plaj, yönetilen tandem iniş alanıdır. Paramotor kalkışları yakındaki ovalarda anlaşılmış arazi alanlarından yapılır."}, {"q": "Bölgede resmi paramotor pisti var mı?", "a": "İşaretli pistlerden çok, yerleşik ve gayriresmî anlaşılmış arazi alanları vardır. Hangilerinin güncel olduğunu yerel koordinasyon söyler — düzenlemeler ekin ve mevsimle değişir."}, {"q": "Paramotorla Mavi Lagün boyunca uçabilir miyim?", "a": "Kurallar dahilinde kıyı rotası mümkündür — irtifa limitlerine, tandem koridoruna ve korunan lagün bölgesi üzerinde gürültü nezaketine uyarak. Önce yerel brifingi alın."}], "relatedTitle": "Daha Fazlasını Keşfedin", "related": [{"href": "/paramotor", "label": "Paramotor Rehberi"}, {"href": "/paramotor/rules", "label": "Paramotor Kuralları"}, {"href": "/paramotor/training", "label": "Paramotor Eğitimi"}, {"href": "/contact", "label": "Bize Ulaşın"}]}, "de": {"sections": [{"h2": "Wo starten Paramotoren rund um Ölüdeniz?", "ps": ["Anders als Gleitschirme brauchen Paramotoren ebenen Boden und freien Anlauf — ihre Welt sind die Ebenen, nicht der Berg. Die Ebene Ölüdeniz–Ovacık und die Agrarflächen Richtung Fethiye bieten die nutzbaren Plätze, verwendet mit Zustimmung der Eigentümer und lokaler Abstimmung.", "Die Belohnung für den bescheidenen Start ist totale Freiheit: Mit Motor wird die ganze Küste zum Spielplatz — in der Höhe, die die Regeln erlauben."]}, {"h2": "Was einen guten lokalen Startplatz ausmacht", "ps": ["Die Checkliste für ein Paramotor-Feld hier:"], "bullets": ["Ein ebener Anlauf von 50m+ ohne Steine, Gräben und Feldfrüchte", "Freie Abflugsektoren ohne Stromleitungen oder Bäume im Steigflug", "Abstand zu Häusern — Motorlärm trägt in der Morgendämmerung weit", "Mit dem Landbesitzer vereinbart und dem lokalen Betrieb bekannt", "Eine Ausweichroute über offenem Gelände für die erste tiefe Minute"]}, {"h2": "Platzzugang als Besucher", "ps": ["Nicht raten — fragen. Der Feldzugang wechselt mit Jahreszeiten und Anbau, und die sensiblen Stellen sind Lokalwissen. Kontaktieren Sie uns vor der Reise — wir verbinden Sie mit dem aktuellen Paramotor-Bild: welche Felder in Nutzung sind, wen man fragt und wie die Morgen organisiert sind."]}], "faqTitle": "FAQ – Paramotor-Startplätze", "faqs": [{"q": "Kann ich mit dem Paramotor vom Strand starten?", "a": "Nein — der Strand ist die gemanagte Tandemlandezone. Paramotor-Starts erfolgen von vereinbarten Feldplätzen in den nahen Ebenen."}, {"q": "Gibt es offizielle Paramotor-Flugplätze in der Gegend?", "a": "Es gibt etablierte, informell vereinbarte Feldplätze statt markierter Flugplätze. Die lokale Abstimmung sagt Ihnen, welche aktuell sind — die Arrangements wechseln mit Anbau und Saison."}, {"q": "Kann ich mit dem Paramotor an der Blauen Lagune entlangfliegen?", "a": "Küstenrouten sind im Rahmen der Regeln möglich — unter Beachtung der Höhenlimits, des Tandemkorridors und der Lärmrücksicht über dem geschützten Lagunengebiet. Vorher das lokale Briefing einholen."}], "relatedTitle": "Mehr entdecken", "related": [{"href": "/paramotor", "label": "Paramotor-Guide"}, {"href": "/paramotor/rules", "label": "Paramotor-Regeln"}, {"href": "/paramotor/training", "label": "Paramotor-Training"}, {"href": "/contact", "label": "Kontakt"}]}, "ru": {"sections": [{"h2": "Откуда стартуют паромоторы вокруг Олюдениза?", "ps": ["В отличие от свободных парапланов, паромоторам нужна ровная земля и чистый разбег — их мир это равнины, а не гора. Равнина Олюдениз–Оваджик и сельхозугодья в сторону Фетхие дают рабочие площадки, используемые с согласия владельцев и при местной координации.", "Награда за скромный старт — полная свобода: с мотором всё побережье становится вашей площадкой на той высоте, которую разрешают правила."]}, {"h2": "Что делает местную площадку хорошей", "ps": ["Чек-лист паромоторного поля здесь:"], "bullets": ["Ровный разбег 50м+ без камней, канав и посевов", "Открытые подходы без ЛЭП и деревьев на наборе", "Дистанция от домов — звук мотора на рассвете разносится далеко", "Согласована с владельцем земли и известна местным операциям", "Запасной путь над открытой землёй на первую низкую минуту"]}, {"h2": "Доступ к площадкам для гостей", "ps": ["Не гадайте — спрашивайте. Доступ к полям меняется с сезонами и посевами, а чувствительные места — местное знание. Свяжитесь с нами до поездки — соединим вас с актуальной паромоторной картиной: какие поля в работе, кого спрашивать и как организованы утра."]}], "faqTitle": "FAQ – площадки паромотора", "faqs": [{"q": "Можно ли взлететь на паромоторе с пляжа?", "a": "Нет — пляж это управляемая зона посадки тандемов. Паромоторные старты — с согласованных полевых площадок на ближних равнинах."}, {"q": "Есть ли в районе официальные паромоторные аэродромы?", "a": "Есть устоявшиеся, неформально согласованные полевые площадки, а не размеченные аэродромы. Какие актуальны — подскажет местная координация: договорённости меняются с посевами и сезонами."}, {"q": "Можно ли пролететь на паромоторе вдоль Голубой лагуны?", "a": "Прибрежные маршруты возможны в рамках правил — с учётом лимитов высоты, тандемного коридора и шумовой вежливости над охраняемой лагуной. Сначала получите местный брифинг."}], "relatedTitle": "Узнайте больше", "related": [{"href": "/paramotor", "label": "Гид по паромотору"}, {"href": "/paramotor/rules", "label": "Правила паромотора"}, {"href": "/paramotor/training", "label": "Обучение паромотору"}, {"href": "/contact", "label": "Связаться с нами"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'paramotor' })
  const titles = {en:"Paramotor Launch Sites Oludeniz",tr:"Oludeniz Paramotor Kalkış Noktaları",de:"Paramotor Launch Sites Oludeniz",ru:"Paramotor Launch Sites Oludeniz"}
  const subs = {en:"Powered paragliding information for Oludeniz.",tr:"Oludeniz için motorlu paraşüt bilgileri.",de:"Motorisiertes Paragliding-Informationen für Oludeniz.",ru:"Информация о моторизованном парапланеризме для Олюдениз."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Paramotor Launch Sites Oludeniz\", \"description\": \"Paramotor launch sites near Oludeniz and Fethiye, Turkey.\", \"url\": \"https://www.atmosparagliding.com/paramotor/launch-sites\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://www.atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://www.atmosparagliding.com\"}}" }} />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0d/dOEuj7ebfM-MdyvUcunPD.jpg" />
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
