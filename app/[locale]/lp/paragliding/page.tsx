import type { Metadata } from 'next'
import Image from 'next/image'
import { CheckCircle, XCircle, MessageCircle, ArrowDown, ShieldCheck, CalendarCheck, Camera, Bus, Mountain } from 'lucide-react'
import BookingForm from '../../book-now/BookingForm'

// Google Ads landing page. Deliberately noindex (and not in sitemap) so it never
// competes with the organic / AI-cited pages (/prices, /book-now, /oludeniz-paragliding).
export const revalidate = 3600

type L = 'en' | 'tr' | 'de' | 'ru'

const WA = 'https://wa.me/905364616674?text='

const C: Record<L, any> = {
  en: {
    meta: 'Tandem paragliding in Ölüdeniz for $150, all-inclusive: flight from 2000m, photo & video, mountain fee and hotel transfer.',
    badge: 'Official Atmos Paragliding · TÜRSAB licensed',
    h1: 'Paragliding Ölüdeniz — $150, Everything Included',
    sub: 'One fixed price. Flight from 2000m Babadağ, HD photo & video, mountain fee and hotel transfer. No add-ons, no surprises.',
    book: 'Book your flight', wa: 'Book on WhatsApp', waText: "Hi! I'd like to book a paragliding flight in Ölüdeniz ($150 all-inclusive).",
    incTitle: 'What your $150 includes',
    inc: ['Tandem flight from 2000m Babadağ (25–30 min)', 'HD photo & video of your flight', 'Babadağ mountain entrance fee', 'Hotel pickup & drop-off', 'All equipment & safety briefing', 'Licensed, experienced tandem pilot'],
    cmpTitle: 'Why "from €85" usually costs more',
    cmpThem: 'Typical "from" offers', cmpUs: 'Atmos Paragliding',
    cmpRows: [['Headline price', 'Low "from" price, real flight costs more', '$150 — the final price'], ['Photo & video', 'Extra (drone, editing, landing video sold separately)', 'Included'], ['Mountain fee & transfer', 'Sometimes extra', 'Included'], ['Weather cancellation', 'Often unclear', 'Free reschedule or full refund']],
    stepsTitle: 'How it works',
    steps: [['Book in 1 minute', 'Online form or WhatsApp — pick your date.'], ['We pick you up', 'From your hotel to the Babadağ launch.'], ['Fly & get your video', 'Land on Ölüdeniz beach, get your photos & video the same day.']],
    trust: ['Free cancellation up to 24h before', 'Bad weather? Free reschedule or full refund', 'Max passenger weight 110 kg'],
    formTitle: 'Reserve your flight',
  },
  tr: {
    meta: "Ölüdeniz'de tandem yamaç paraşütü $150, her şey dahil: 2000m'den uçuş, foto & video, dağ giriş ücreti ve otel transferi.",
    badge: 'Resmi Atmos Paragliding · TÜRSAB belgeli',
    h1: 'Ölüdeniz Yamaç Paraşütü — $150, Her Şey Dahil',
    sub: "Tek sabit fiyat. Babadağ 2000m'den uçuş, HD foto & video, dağ giriş ücreti ve otel transferi. Ekstra yok, sürpriz yok.",
    book: 'Uçuşunu ayırt', wa: 'WhatsApp ile rezervasyon', waText: "Merhaba! Ölüdeniz'de yamaç paraşütü uçuşu ayırtmak istiyorum ($150 her şey dahil).",
    incTitle: "$150'a neler dahil",
    inc: ["Babadağ 2000m'den tandem uçuş (25–30 dk)", 'Uçuşunun HD foto & videosu', 'Babadağ dağ giriş ücreti', 'Otelden alış & bırakış', 'Tüm ekipman & güvenlik brifingi', 'Lisanslı, deneyimli tandem pilot'],
    cmpTitle: '"€85\'ten başlayan" neden daha pahalıya gelir',
    cmpThem: 'Tipik "başlayan" teklifler', cmpUs: 'Atmos Paragliding',
    cmpRows: [['Reklam fiyatı', 'Düşük "başlayan" fiyat, gerçek uçuş daha pahalı', '$150 — son fiyat'], ['Foto & video', 'Ekstra (drone, montaj, iniş videosu ayrı)', 'Dahil'], ['Dağ ücreti & transfer', 'Bazen ekstra', 'Dahil'], ['Hava iptali', 'Genelde belirsiz', 'Ücretsiz erteleme veya tam iade']],
    stepsTitle: 'Nasıl çalışır',
    steps: [['1 dakikada rezervasyon', 'Online form veya WhatsApp — tarihini seç.'], ['Seni otelden alıyoruz', "Otelinden Babadağ kalkış noktasına."], ['Uç & videonu al', 'Ölüdeniz plajına in, foto ve videon aynı gün elinde.']],
    trust: ['24 saat öncesine kadar ücretsiz iptal', 'Kötü hava? Ücretsiz erteleme veya tam iade', 'Maks. yolcu kilosu 110 kg'],
    formTitle: 'Uçuşunu ayırt',
  },
  de: {
    meta: 'Tandem-Paragliding in Ölüdeniz für $150 all-inclusive: Flug ab 2000m, Foto & Video, Berggebühr und Hoteltransfer.',
    badge: 'Offiziell Atmos Paragliding · TÜRSAB-lizenziert',
    h1: 'Paragliding Ölüdeniz — $150, alles inklusive',
    sub: 'Ein Festpreis. Flug ab 2000m Babadağ, HD-Foto & Video, Berggebühr und Hoteltransfer. Keine Extras, keine Überraschungen.',
    book: 'Flug buchen', wa: 'Per WhatsApp buchen', waText: 'Hallo! Ich möchte einen Paragliding-Flug in Ölüdeniz buchen ($150 all-inclusive).',
    incTitle: 'Das ist in $150 enthalten',
    inc: ['Tandemflug ab 2000m Babadağ (25–30 Min.)', 'HD-Foto & Video deines Flugs', 'Babadağ Berg-Eintrittsgebühr', 'Hotelabholung & Rücktransfer', 'Komplette Ausrüstung & Sicherheitsbriefing', 'Lizenzierter, erfahrener Tandempilot'],
    cmpTitle: 'Warum „ab 85 €" meist mehr kostet',
    cmpThem: 'Typische „ab"-Angebote', cmpUs: 'Atmos Paragliding',
    cmpRows: [['Werbepreis', 'Niedriger „ab"-Preis, echter Flug teurer', '$150 — Endpreis'], ['Foto & Video', 'Extra (Drohne, Schnitt, Landevideo separat)', 'Inklusive'], ['Berggebühr & Transfer', 'Teilweise extra', 'Inklusive'], ['Wetterabsage', 'Oft unklar', 'Kostenlos verschieben oder volle Erstattung']],
    stepsTitle: 'So funktioniert es',
    steps: [['In 1 Minute buchen', 'Online-Formular oder WhatsApp — Datum wählen.'], ['Wir holen dich ab', 'Vom Hotel zum Startplatz Babadağ.'], ['Fliegen & Video erhalten', 'Landung am Strand von Ölüdeniz, Fotos & Video am selben Tag.']],
    trust: ['Kostenlose Stornierung bis 24h vorher', 'Schlechtes Wetter? Kostenlos verschieben oder volle Erstattung', 'Max. Passagiergewicht 110 kg'],
    formTitle: 'Flug reservieren',
  },
  ru: {
    meta: 'Тандемный полёт на параплане в Олюденизе за $150 всё включено: старт с 2000 м, фото и видео, сбор за гору и трансфер из отеля.',
    badge: 'Официально Atmos Paragliding · лицензия TÜRSAB',
    h1: 'Параплан в Олюденизе — $150, всё включено',
    sub: 'Одна фиксированная цена. Полёт с 2000 м Бабадаг, HD фото и видео, сбор за гору и трансфер из отеля. Без доплат и сюрпризов.',
    book: 'Забронировать полёт', wa: 'Бронь в WhatsApp', waText: 'Здравствуйте! Хочу забронировать полёт на параплане в Олюденизе ($150 всё включено).',
    incTitle: 'Что входит в $150',
    inc: ['Тандемный полёт с 2000 м Бабадаг (25–30 мин)', 'HD фото и видео вашего полёта', 'Сбор за въезд на гору Бабадаг', 'Трансфер из отеля и обратно', 'Всё снаряжение и инструктаж', 'Лицензированный опытный пилот'],
    cmpTitle: 'Почему «от 85 €» обычно выходит дороже',
    cmpThem: 'Типичные предложения «от»', cmpUs: 'Atmos Paragliding',
    cmpRows: [['Цена в рекламе', 'Низкая цена «от», реальный полёт дороже', '$150 — итоговая цена'], ['Фото и видео', 'Доплата (дрон, монтаж, видео посадки отдельно)', 'Включено'], ['Сбор за гору и трансфер', 'Иногда доплата', 'Включено'], ['Отмена из-за погоды', 'Часто неясно', 'Бесплатный перенос или полный возврат']],
    stepsTitle: 'Как это работает',
    steps: [['Бронь за 1 минуту', 'Онлайн-форма или WhatsApp — выберите дату.'], ['Заберём из отеля', 'От отеля до старта на Бабадаге.'], ['Летите и получите видео', 'Посадка на пляже Олюдениза, фото и видео в тот же день.']],
    trust: ['Бесплатная отмена за 24 ч', 'Плохая погода? Бесплатный перенос или полный возврат', 'Макс. вес пассажира 110 кг'],
    formTitle: 'Забронируйте полёт',
  },
}

const INC_ICONS = [Mountain, Camera, Mountain, Bus, ShieldCheck, ShieldCheck]

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const c = C[(locale as L)] || C.en
  return {
    title: { absolute: `${c.h1} | Atmos Paragliding` },
    description: c.meta,
    robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
  }
}

export default async function AdsLandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const c = C[(locale as L)] || C.en
  const waHref = WA + encodeURIComponent(c.waText)

  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <Image src="https://v3b.fal.media/files/b/0a9d7c0d/dOEuj7ebfM-MdyvUcunPD.jpg" alt="Tandem paragliding over the Blue Lagoon, Ölüdeniz" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/55 to-slate-900/80" />
        <div className="relative container-default py-20 md:py-28 text-center text-white">
          <span className="inline-block text-xs md:text-sm font-semibold bg-white/15 backdrop-blur px-4 py-1.5 rounded-full mb-5">{c.badge}</span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-3xl mx-auto">{c.h1}</h1>
          <p className="mt-5 text-base md:text-xl text-white/90 max-w-2xl mx-auto">{c.sub}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#book" className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-7 py-4 rounded-xl text-lg transition">
              {c.book} <ArrowDown className="w-5 h-5" />
            </a>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold px-7 py-4 rounded-xl text-lg transition">
              <MessageCircle className="w-5 h-5" /> {c.wa}
            </a>
          </div>
          <ul className="mt-8 flex flex-col md:flex-row gap-2 md:gap-6 justify-center text-sm text-white/90">
            {c.trust.map((t: string) => (
              <li key={t} className="inline-flex items-center justify-center gap-1.5"><CalendarCheck className="w-4 h-4 text-orange-300" />{t}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* INCLUDED */}
      <section className="container-default py-14 md:py-20">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center">{c.incTitle}</h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {c.inc.map((item: string, i: number) => {
            const Icon = INC_ICONS[i] || CheckCircle
            return (
              <div key={item} className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-5">
                <Icon className="w-6 h-6 text-orange-500 flex-shrink-0" />
                <span className="text-slate-800 font-medium">{item}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* COMPARISON */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="container-default py-14 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center">{c.cmpTitle}</h2>
          <div className="mt-10 max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full text-left bg-white rounded-xl border border-slate-200 text-sm md:text-base">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="p-4"></th>
                  <th className="p-4 text-slate-500 font-semibold">{c.cmpThem}</th>
                  <th className="p-4 text-orange-600 font-bold">{c.cmpUs}</th>
                </tr>
              </thead>
              <tbody>
                {c.cmpRows.map((r: string[]) => (
                  <tr key={r[0]} className="border-b border-slate-100 last:border-0">
                    <td className="p-4 font-semibold text-slate-800">{r[0]}</td>
                    <td className="p-4 text-slate-600"><span className="inline-flex gap-2"><XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />{r[1]}</span></td>
                    <td className="p-4 text-slate-900 font-medium"><span className="inline-flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />{r[2]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="container-default py-14 md:py-20">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center">{c.stepsTitle}</h2>
        <ol className="mt-10 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {c.steps.map((s: string[], i: number) => (
            <li key={s[0]} className="text-center p-6">
              <div className="w-12 h-12 mx-auto rounded-full bg-orange-500 text-white font-bold text-xl flex items-center justify-center">{i + 1}</div>
              <h3 className="mt-4 font-bold text-lg text-slate-900">{s[0]}</h3>
              <p className="mt-2 text-slate-600">{s[1]}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* BOOKING FORM (fires Google Ads + GA4 conversion on submit) */}
      <section id="book" className="scroll-mt-20 bg-slate-50 border-t border-slate-200 pt-12">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center">{c.formTitle}</h2>
        <BookingForm />
      </section>
    </main>
  )
}
