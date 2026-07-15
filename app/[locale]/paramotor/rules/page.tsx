import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Paramotor Rules Turkey",tr:"Türkiye Paramotor Kuralları",de:"Paramotor Rules Turkey",ru:"Paramotor Rules Turkey"}
  const d = {en:"Powered paragliding information for Oludeniz.",tr:"Oludeniz için motorlu paraşüt bilgileri.",de:"Motorisiertes Paragliding-Informationen für Oludeniz.",ru:"Информация о моторизованном парапланеризме для Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/paramotor/rules'),
    openGraph: { url: localeUrl(locale, '/paramotor/rules'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/paramotor/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "The Rules for Paramotor Flying Around Ölüdeniz", "ps": ["Paramotors (powered paragliders) fall under Turkish civil aviation rules and the local site framework. The essentials: SHGM-recognised qualification, third-party insurance covering powered flight, and coordination with the local flying operations before you launch.", "The busy Babadağ tandem corridor and the beach landing zone are managed airspace in practice — paramotor pilots operate around them, not through them."]}, {"h2": "Where and When Paramotors Fly", "ps": ["The working framework locals follow:"], "bullets": ["Launch and land at agreed field sites away from the beach zone — not from the tandem landing area", "Keep clear of the Babadağ descent corridor during tandem operating hours", "Early morning is paramotor prime time: calm air and an empty sky", "Coastal noise-sensitivity is real — altitude and routing courtesy keep relations good"]}, {"h2": "Before You Fly: Coordinate", "ps": ["Bring your licence, insurance and equipment documents, and talk to us or the site authority before your first flight — we will brief you on current corridors, sensitivities and the day's traffic picture. Five minutes of coordination buys a season of easy flying."]}], "faqTitle": "FAQ – Paramotor Rules", "faqs": [{"q": "Can I fly my paramotor in Ölüdeniz?", "a": "Yes, with recognised qualification, powered-flight insurance and local coordination. The key constraint is staying clear of the tandem corridor and beach zone during operating hours."}, {"q": "Can paramotors launch from Babadağ?", "a": "Paramotor flying here is field-based — launches happen from agreed flat sites in the plain, not from the mountain takeoffs, which are reserved for free-flight operations."}, {"q": "What is the best time for paramotor flights?", "a": "Early morning: calm air before the sea breeze and thermals build, and minimal traffic. Late evening after tandem hours is the second window."}], "relatedTitle": "Explore More", "related": [{"href": "/paramotor", "label": "Paramotor Guide"}, {"href": "/paramotor/launch-sites", "label": "Paramotor Launch Sites"}, {"href": "/paramotor/equipment", "label": "Paramotor Equipment"}, {"href": "/contact", "label": "Contact Us"}]}, "tr": {"sections": [{"h2": "Ölüdeniz Çevresinde Paramotor Kuralları", "ps": ["Paramotorlar (motorlu yamaç paraşütleri) Türk sivil havacılık kurallarına ve yerel saha çerçevesine tabidir. Temeller: SHGM'ce tanınan yeterlilik, motorlu uçuşu kapsayan üçüncü şahıs sigortası ve kalkmadan önce yerel uçuş operasyonlarıyla koordinasyon.", "Yoğun Babadağ tandem koridoru ve plaj iniş alanı pratikte yönetilen hava sahasıdır — paramotor pilotları bunların içinden değil, çevresinden uçar."]}, {"h2": "Paramotorlar Nerede ve Ne Zaman Uçar?", "ps": ["Yerellerin izlediği çalışma çerçevesi:"], "bullets": ["Plaj bölgesinden uzak, anlaşılmış düz alanlardan kalkın ve inin — tandem iniş alanından değil", "Tandem çalışma saatlerinde Babadağ alçalma koridorundan uzak durun", "Sabah erken saatler paramotorun altın zamanıdır: sakin hava ve boş gökyüzü", "Kıyıda gürültü hassasiyeti gerçektir — irtifa ve rota nezaketi ilişkileri iyi tutar"]}, {"h2": "Uçmadan Önce: Koordine Olun", "ps": ["Lisans, sigorta ve ekipman belgelerinizi getirin; ilk uçuşunuzdan önce bizimle veya saha yönetimiyle konuşun — güncel koridorlar, hassasiyetler ve günün trafik tablosu hakkında brifing veririz. Beş dakikalık koordinasyon, bir sezonluk rahat uçuş kazandırır."]}], "faqTitle": "SSS – Paramotor Kuralları", "faqs": [{"q": "Ölüdeniz'de paramotorumu uçurabilir miyim?", "a": "Evet — tanınan yeterlilik, motorlu uçuş sigortası ve yerel koordinasyonla. Kilit kısıt, çalışma saatlerinde tandem koridorundan ve plaj bölgesinden uzak durmaktır."}, {"q": "Paramotorlar Babadağ'dan kalkabilir mi?", "a": "Burada paramotor uçuşu araziden yapılır — kalkışlar ovadaki anlaşılmış düz alanlardan olur; serbest uçuş operasyonlarına ayrılmış dağ pistlerinden değil."}, {"q": "Paramotor uçuşları için en iyi zaman?", "a": "Sabah erken: deniz meltemi ve termikler güçlenmeden sakin hava ve minimum trafik. Tandem saatleri sonrası geç akşam ikinci penceredir."}], "relatedTitle": "Daha Fazlasını Keşfedin", "related": [{"href": "/paramotor", "label": "Paramotor Rehberi"}, {"href": "/paramotor/launch-sites", "label": "Paramotor Kalkış Alanları"}, {"href": "/paramotor/equipment", "label": "Paramotor Ekipmanı"}, {"href": "/contact", "label": "Bize Ulaşın"}]}, "de": {"sections": [{"h2": "Die Regeln fürs Paramotor-Fliegen rund um Ölüdeniz", "ps": ["Paramotoren (motorisierte Gleitschirme) unterliegen den türkischen Zivilluftfahrtregeln und dem lokalen Gelände-Rahmen. Das Wesentliche: SHGM-anerkannte Qualifikation, Haftpflicht mit Motorflug-Deckung und Abstimmung mit dem lokalen Flugbetrieb vor dem Start.", "Der stark beflogene Babadağ-Tandemkorridor und die Strandlandezone sind praktisch gemanagter Luftraum — Paramotor-Piloten fliegen darum herum, nicht hindurch."]}, {"h2": "Wo und wann Paramotoren fliegen", "ps": ["Der Rahmen, dem die Einheimischen folgen:"], "bullets": ["Start und Landung auf vereinbarten Feldflächen abseits der Strandzone — nicht am Tandemlandeplatz", "Während der Tandem-Betriebszeiten den Babadağ-Abstiegskorridor meiden", "Der frühe Morgen ist Paramotor-Primetime: ruhige Luft und leerer Himmel", "Lärmsensibilität an der Küste ist real — Höhen- und Routenrücksicht hält die Beziehungen gut"]}, {"h2": "Vor dem Flug: abstimmen", "ps": ["Bringen Sie Lizenz-, Versicherungs- und Ausrüstungsnachweise mit und sprechen Sie vor dem ersten Flug mit uns oder der Geländeverwaltung — wir briefen Sie zu aktuellen Korridoren, Sensibilitäten und dem Verkehrsbild des Tages. Fünf Minuten Abstimmung kaufen eine Saison entspannten Fliegens."]}], "faqTitle": "FAQ – Paramotor-Regeln", "faqs": [{"q": "Darf ich meinen Paramotor in Ölüdeniz fliegen?", "a": "Ja — mit anerkannter Qualifikation, Motorflug-Versicherung und lokaler Abstimmung. Die zentrale Auflage: während der Betriebszeiten den Tandemkorridor und die Strandzone meiden."}, {"q": "Können Paramotoren vom Babadağ starten?", "a": "Paramotor-Fliegen ist hier feldbasiert — gestartet wird von vereinbarten flachen Plätzen in der Ebene, nicht von den Bergstartplätzen, die dem freien Fliegen vorbehalten sind."}, {"q": "Wann ist die beste Zeit für Paramotor-Flüge?", "a": "Früher Morgen: ruhige Luft, bevor Seebrise und Thermik aufbauen, und minimaler Verkehr. Der späte Abend nach den Tandemzeiten ist das zweite Fenster."}], "relatedTitle": "Mehr entdecken", "related": [{"href": "/paramotor", "label": "Paramotor-Guide"}, {"href": "/paramotor/launch-sites", "label": "Paramotor-Startplätze"}, {"href": "/paramotor/equipment", "label": "Paramotor-Ausrüstung"}, {"href": "/contact", "label": "Kontakt"}]}, "ru": {"sections": [{"h2": "Правила полётов на паромоторе вокруг Олюдениза", "ps": ["Паромоторы (моторные парапланы) подпадают под правила турецкой гражданской авиации и местные рамки. Главное: признанная SHGM квалификация, страховка ответственности с покрытием моторных полётов и координация с местными полётными операциями до взлёта.", "Загруженный тандемный коридор Бабадага и пляжная зона посадки — на практике управляемое пространство: паромоторы летают вокруг них, а не сквозь."]}, {"h2": "Где и когда летают паромоторы", "ps": ["Рабочие рамки, которым следуют местные:"], "bullets": ["Взлёт и посадка на согласованных полевых площадках вдали от пляжной зоны — не с тандемной посадки", "Держаться в стороне от коридора снижения Бабадага в часы тандемных полётов", "Раннее утро — золотое время паромотора: спокойный воздух и пустое небо", "Чувствительность к шуму на побережье реальна — вежливость в высоте и маршрутах сохраняет добрые отношения"]}, {"h2": "Перед полётом: скоординируйтесь", "ps": ["Возьмите лицензию, страховку и документы на технику и поговорите с нами или администрацией до первого полёта — мы расскажем про актуальные коридоры, чувствительные зоны и картину трафика дня. Пять минут координации покупают сезон лёгких полётов."]}], "faqTitle": "FAQ – правила паромотора", "faqs": [{"q": "Могу ли я летать на своём паромоторе в Олюденизе?", "a": "Да — с признанной квалификацией, страховкой моторных полётов и местной координацией. Ключевое ограничение: держаться вне тандемного коридора и пляжной зоны в рабочие часы."}, {"q": "Можно ли стартовать на паромоторе с Бабадага?", "a": "Паромоторные полёты здесь полевые — старты с согласованных ровных площадок на равнине, а не с горных стартов, зарезервированных за свободными полётами."}, {"q": "Какое время лучшее для паромоторных полётов?", "a": "Раннее утро: спокойный воздух до усиления бриза и термиков и минимальный трафик. Поздний вечер после тандемных часов — второе окно."}], "relatedTitle": "Узнайте больше", "related": [{"href": "/paramotor", "label": "Гид по паромотору"}, {"href": "/paramotor/launch-sites", "label": "Площадки паромотора"}, {"href": "/paramotor/equipment", "label": "Снаряжение паромотора"}, {"href": "/contact", "label": "Связаться с нами"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'paramotor' })
  const titles = {en:"Paramotor Rules Turkey",tr:"Türkiye Paramotor Kuralları",de:"Paramotor Rules Turkey",ru:"Paramotor Rules Turkey"}
  const subs = {en:"Powered paragliding information for Oludeniz.",tr:"Oludeniz için motorlu paraşüt bilgileri.",de:"Motorisiertes Paragliding-Informationen für Oludeniz.",ru:"Информация о моторизованном парапланеризме для Олюдениз."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Paramotor Rules and Regulations Turkey\", \"description\": \"Rules and regulations for paramotoring in Turkey and around Oludeniz.\", \"url\": \"https://www.atmosparagliding.com/paramotor/rules\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://www.atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://www.atmosparagliding.com\"}}" }} />
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
