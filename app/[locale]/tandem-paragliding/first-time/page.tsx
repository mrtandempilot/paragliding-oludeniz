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
  const titles: Record<string,string> = {en:"First Time Paragliding Oludeniz",tr:"İlk Kez Yamaç Paraşütü",de:"Erstmals Paragliding",ru:"Впервые на параплане"}
  const d: Record<string, string> = {"en": "First time paragliding? Complete beginner's guide for your tandem flight in Oludeniz: what to expect, what to wear and how to prepare.", "tr": "İlk kez mi uçacaksınız? Ölüdeniz'de tandem uçuşunuz için eksiksiz rehber: sizi neler bekliyor, ne giymeli, nasıl hazırlanmalı.", "de": "Zum ersten Mal Paragliding? Kompletter Einsteiger-Guide für Ihren Tandemflug in Ölüdeniz: was Sie erwartet und wie Sie sich vorbereiten.", "ru": "Первый полёт на параплане? Полный гид для новичков: чего ожидать, что надеть и как подготовиться к тандемному полёту."}
  return {
    description: d[locale] || d.en,
    alternates: localeAlternates(locale, '/tandem-paragliding/first-time'),
    openGraph: { url: localeUrl(locale, '/tandem-paragliding/first-time'), description: d[locale] || d.en, images: ['https://www.atmosparagliding.com/tandem-paragliding/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: d[locale] || d.en }, title: `${titles[locale]||titles.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "Do I Need Experience to Fly Tandem?", "ps": ["No experience is needed. You fly attached to a certified pilot who handles everything from launch to landing — you just enjoy the view."]}, {"h2": "What Happens on the Day of Your Flight?", "ps": ["Arrive at our office on Oludeniz beach, where we check your weight and confirm your booking. We then drive you up to the Babadağ launch point (about 20 minutes). Your pilot gives you a simple, friendly 5-minute safety briefing."]}, {"h2": "What Does the Launch and Flight Feel Like?", "ps": ["At launch you run 3–5 steps downhill and you're airborne — most people say the moment is pure magic. Your pilot flies you over the Blue Lagoon, Butterfly Valley and the turquoise Aegean for 25–45 minutes, then lands you gently on Oludeniz beach."]}, {"h2": "What Should I Wear?", "ps": ["Closed-toe shoes (trainers or hiking boots, no sandals), comfortable trousers, and a light jacket since it's 5–10°C cooler at altitude. Bring sunglasses with a strap."]}], "faqTitle": "FAQ – First-Time Flyers", "faqs": [{"q": "Will I feel scared?", "a": "Most first-timers feel a rush of nerves before launch that turns to pure excitement within seconds of being airborne."}, {"q": "How long before I'm in the air after arriving?", "a": "About 20–30 minutes, including the drive to launch and your safety briefing."}, {"q": "What if I'm afraid of heights?", "a": "Many passengers who are afraid of heights fly with us — the sensation is gentle and floating rather than a sudden drop."}], "relatedTitle": "More on Tandem Paragliding", "related": [{"href": "/tandem-paragliding/first-time", "label": "First Time Flying"}, {"href": "/tandem-paragliding/safety-guide", "label": "Safety Guide"}, {"href": "/tandem-paragliding/sunset-flight", "label": "Sunset Flight"}, {"href": "/tandem-paragliding/group-flights", "label": "Group Flights"}]}, "tr": {"sections": [{"h2": "Tandem Uçmak İçin Deneyime İhtiyacım Var mı?", "ps": ["Hiçbir deneyim gerekmez. Kalkıştan inişe kadar her şeyi kontrol eden sertifikalı bir pilota bağlı olarak uçarsınız — siz sadece manzaranın tadını çıkarırsınız."]}, {"h2": "Uçuş Gününde Neler Olur?", "ps": ["Oludeniz plajındaki ofisimize gelin, ağırlığınızı kontrol edip rezervasyonunuzu onaylıyoruz. Ardından sizi Babadağ kalkış noktasına götürüyoruz (yaklaşık 20 dakika). Pilotunuz basit ve samimi 5 dakikalık güvenlik brifingi verir."]}, {"h2": "Kalkış ve Uçuş Nasıl Hissettiriyor?", "ps": ["Kalkışta 3-5 adım aşağı doğru koşuyorsunuz ve havadasınız — çoğu kişi bu anı saf sihir olarak tanımlıyor. Pilotunuz sizi 25-45 dakika Mavi Lagün, Kelebek Vadisi ve turkuaz Ege üzerinde uçurur, sonra Oludeniz plajına yavaşça indirir."]}, {"h2": "Ne Giymeliyim?", "ps": ["Kapalı burunlu ayakkabılar (spor ayakkabı veya yürüyüş botu, sandal yok), rahat pantolon ve hafif bir ceket, çünkü yükseklikte 5-10 derece daha serin olabilir. Kayışlı güneş gözlüğü getirin."]}], "faqTitle": "SSS – İlk Kez Uçanlar", "faqs": [{"q": "Korkacak mıyım?", "a": "Çoğu ilk kez uçan kişi kalkış öncesi heyecan hisseder, bu heyecan havalandıktan saniyeler sonra saf keyfe dönüşür."}, {"q": "Vardıktan sonra havada olmam ne kadar sürer?", "a": "Kalkışa transfer ve güvenlik brifingi dahil yaklaşık 20-30 dakika."}, {"q": "Yükseklik korkum varsa ne olur?", "a": "Yükseklik korkusu olan birçok yolcu bizimle uçar — his ani bir düşüş değil, yumuşak bir süzülmedir."}], "relatedTitle": "Tandem Paraşüt Hakkında Daha Fazla", "related": [{"href": "/tandem-paragliding/first-time", "label": "İlk Kez Uçuş"}, {"href": "/tandem-paragliding/safety-guide", "label": "Güvenlik Rehberi"}, {"href": "/tandem-paragliding/sunset-flight", "label": "Gün Batımı Uçuşu"}, {"href": "/tandem-paragliding/group-flights", "label": "Grup Uçuşları"}]}, "de": {"sections": [{"h2": "Brauche ich Erfahrung für einen Tandemflug?", "ps": ["Keine Erfahrung nötig. Sie fliegen an einen zertifizierten Piloten gebunden, der alles vom Start bis zur Landung übernimmt — Sie genießen einfach die Aussicht."]}, {"h2": "Was passiert am Tag Ihres Fluges?", "ps": ["Kommen Sie zu unserem Büro am Oludeniz-Strand, wir prüfen Ihr Gewicht und bestätigen Ihre Buchung. Dann fahren wir Sie zum Babadağ-Startplatz (ca. 20 Minuten). Ihr Pilot gibt ein einfaches, freundliches 5-minütiges Sicherheitsbriefing."]}, {"h2": "Wie fühlt sich Start und Flug an?", "ps": ["Beim Start laufen Sie 3-5 Schritte den Hang hinunter und sind in der Luft — die meisten beschreiben diesen Moment als pure Magie. Ihr Pilot fliegt Sie 25-45 Minuten über die Blaue Lagune, das Schmetterlingstal und das türkisfarbene Ägäische Meer, dann landet er sanft am Oludeniz-Strand."]}, {"h2": "Was sollte ich anziehen?", "ps": ["Geschlossene Schuhe (Turnschuhe oder Wanderschuhe, keine Sandalen), bequeme Hose und eine leichte Jacke, da es in der Höhe 5-10°C kühler ist. Bringen Sie Sonnenbrille mit Band mit."]}], "faqTitle": "FAQ – Erstflieger", "faqs": [{"q": "Werde ich Angst haben?", "a": "Die meisten Erstflieger spüren vor dem Start Nervosität, die sich innerhalb von Sekunden nach dem Abheben in pure Begeisterung verwandelt."}, {"q": "Wie lange dauert es bis ich in der Luft bin?", "a": "Etwa 20-30 Minuten, einschließlich der Fahrt zum Startplatz und dem Sicherheitsbriefing."}, {"q": "Was, wenn ich Höhenangst habe?", "a": "Viele Passagiere mit Höhenangst fliegen bei uns — das Gefühl ist sanft und schwebend, kein plötzlicher Sturz."}], "relatedTitle": "Mehr zum Tandem-Paragliding", "related": [{"href": "/tandem-paragliding/first-time", "label": "Erster Flug"}, {"href": "/tandem-paragliding/safety-guide", "label": "Sicherheitsleitfaden"}, {"href": "/tandem-paragliding/sunset-flight", "label": "Sonnenuntergangsflug"}, {"href": "/tandem-paragliding/group-flights", "label": "Gruppenflüge"}]}, "ru": {"sections": [{"h2": "Нужен ли опыт для тандемного полёта?", "ps": ["Опыт не нужен. Вы летите пристёгнутым к сертифицированному пилоту, который управляет всем от взлёта до посадки — вы просто наслаждаетесь видом."]}, {"h2": "Что происходит в день полёта?", "ps": ["Приходите в наш офис на пляже Олюдениз, мы проверим ваш вес и подтвердим бронирование. Затем мы отвезём вас к стартовой площадке Бабадаг (около 20 минут). Пилот проведёт простой и дружелюбный 5-минутный инструктаж по безопасности."]}, {"h2": "Каково это — старт и полёт?", "ps": ["На старте вы пробегаете 3-5 шагов вниз по склону и взлетаете — большинство людей описывают этот момент как чистую магию. Пилот везёт вас 25-45 минут над Голубой Лагуной, Долиной Бабочек и бирюзовым Эгейским морем, затем мягко приземляет на пляже Олюдениз."]}, {"h2": "Что надеть?", "ps": ["Закрытая обувь (кроссовки или треккинговые ботинки, не сандалии), удобные брюки и лёгкая куртка, так как на высоте на 5-10°C прохладнее. Возьмите солнцезащитные очки с ремешком."]}], "faqTitle": "FAQ – для тех, кто летит впервые", "faqs": [{"q": "Будет ли мне страшно?", "a": "Большинство новичков испытывают волнение перед стартом, которое за секунды после взлёта превращается в чистый восторг."}, {"q": "Через сколько я окажусь в воздухе после прибытия?", "a": "Около 20-30 минут, включая поездку к месту старта и инструктаж по безопасности."}, {"q": "Что если у меня боязнь высоты?", "a": "Многие пассажиры с боязнью высоты летают с нами — ощущение мягкое и парящее, а не резкое падение."}], "relatedTitle": "Больше о тандемном парапланеризме", "related": [{"href": "/tandem-paragliding/first-time", "label": "Первый полёт"}, {"href": "/tandem-paragliding/safety-guide", "label": "Руководство по безопасности"}, {"href": "/tandem-paragliding/sunset-flight", "label": "Закатный полёт"}, {"href": "/tandem-paragliding/group-flights", "label": "Групповые полёты"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'tandem' })
  const titles: Record<string,string> = {en:"First Time Paragliding Oludeniz",tr:"İlk Kez Yamaç Paraşütü",de:"Erstmals Paragliding",ru:"Впервые на параплане"}
  const subtitles: Record<string,string> = {en:"Complete guide for first-time flyers.",tr:"İlk uçuş yapacaklar için eksiksiz rehber.",de:"Vollständiger Leitfaden für Erstflieger.",ru:"Полный гид для тех, кто летит впервые."}
  const title = titles[locale]||titles.en
  const subtitle = subtitles[locale]||subtitles.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)

  return (
    <>
      <ServiceSchema name="First Time Paragliding Oludeniz" description="Complete beginner's guide for your first tandem paragliding flight in Oludeniz from Babadağ." path="/tandem-paragliding/first-time" serviceType="Tandem Paragliding Flight" />
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
