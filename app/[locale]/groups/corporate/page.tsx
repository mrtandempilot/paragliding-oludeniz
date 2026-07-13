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
  const t = {en:"Corporate Group Paragliding",tr:"Kurumsal Grup Paraşütü",de:"Firmengruppenparagliding",ru:"Корпоративный парапланеризм"}
  const d = {en:"Team-building and corporate events with paragliding at Oludeniz.",tr:"Oludeniz'de paraşütle ekip oluşturma ve kurumsal etkinlikler.",de:"Teambuilding und Firmenevents mit Paragliding in Oludeniz.",ru:"Тимбилдинг и корпоративные мероприятия с парапланеризмом в Олюдениз."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/groups/corporate'),
    openGraph: { url: localeUrl(locale, '/groups/corporate'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "Why Is Paragliding a Great Corporate Team-Building Activity?", "ps": ["Watching your colleagues conquer their fear of heights and land safely on the beach creates shared memories that no boardroom exercise can replicate. It's a genuine shared challenge that breaks down hierarchy fast."]}, {"h2": "What Do You Handle for Corporate Groups?", "ps": ["We handle all logistics: hotel pick-up, transfer to launch, individual flight slots, a group photography package, and a debrief session on the beach afterward."]}, {"h2": "What's Included in a Corporate Package?", "ps": ["Priority booking, a dedicated group coordinator, professional photography and video package, branded merchandise options, and catering arrangements on request."]}, {"h2": "What Group Sizes and Notice Do You Need?", "ps": ["We work with groups of 4–50. Minimum 48 hours' notice is required. Contact us for a custom corporate quote."]}], "faqTitle": "FAQ – Corporate Group Paragliding", "faqs": [{"q": "How many people can join a corporate flight day?", "a": "We handle groups from 4 up to 50 people, coordinated by a dedicated group coordinator."}, {"q": "How much notice do you need?", "a": "A minimum of 48 hours — earlier is better, especially in peak season."}, {"q": "Can you brand the experience for our company?", "a": "Yes, branded merchandise options and co-branded materials are available on request."}], "relatedTitle": "Group Options", "related": [{"href": "/groups/hen-stag", "label": "Hen & Stag Parties"}, {"href": "/groups/schools", "label": "School Groups"}, {"href": "/groups/tour-operators", "label": "Tour Operators"}, {"href": "/contact", "label": "Contact Us"}]}, "tr": {"sections": [{"h2": "Paraşüt Neden Harika Bir Kurumsal Ekip Oluşturma Aktivitesi?", "ps": ["Meslektaşlarınızın yükseklik korkusunu yenip plaja güvenle iniş yapmasını izlemek, hiçbir toplantı odası egzersizinin yeniden yaratamayacağı ortak anılar oluşturur. Hiyerarşiyi hızla ortadan kaldıran gerçek bir ortak meydan okumadır."]}, {"h2": "Kurumsal Gruplar İçin Neleri Hallediyoruz?", "ps": ["Tüm lojistiği hallediyoruz: otel alımı, kalkışa transfer, bireysel uçuş slotları, grup fotoğrafçılık paketi ve sonrasında plajda bir değerlendirme oturumu."]}, {"h2": "Kurumsal Pakete Neler Dahil?", "ps": ["Öncelikli rezervasyon, özel grup koordinatörü, profesyonel fotoğraf ve video paketi, markalı ürün seçenekleri ve talep üzerine catering düzenlemeleri."]}, {"h2": "Hangi Grup Büyüklüğü ve Ne Kadar Önceden Bildirim Gerekli?", "ps": ["4-50 kişilik gruplarla çalışıyoruz. Minimum 48 saat önceden bildirim gereklidir. Özel kurumsal teklif için bize ulaşın."]}], "faqTitle": "SSS – Kurumsal Grup Paraşütü", "faqs": [{"q": "Kurumsal uçuş gününe kaç kişi katılabilir?", "a": "Özel bir grup koordinatörü tarafından koordine edilen 4 ile 50 kişi arasındaki grupları yönetiyoruz."}, {"q": "Ne kadar önceden haber vermeliyim?", "a": "Minimum 48 saat — özellikle yoğun sezonda daha erken olması iyidir."}, {"q": "Deneyimi şirketimiz için markalayabilir misiniz?", "a": "Evet, talep üzerine markalı ürün seçenekleri ve ortak markalı materyaller mevcuttur."}], "relatedTitle": "Grup Seçenekleri", "related": [{"href": "/groups/hen-stag", "label": "Bekarlığa Veda Partileri"}, {"href": "/groups/schools", "label": "Okul Grupları"}, {"href": "/groups/tour-operators", "label": "Tur Operatörleri"}, {"href": "/contact", "label": "Bize Ulaşın"}]}, "de": {"sections": [{"h2": "Warum ist Paragliding eine großartige Teambuilding-Aktivität für Unternehmen?", "ps": ["Zu sehen, wie Kollegen ihre Höhenangst überwinden und sicher am Strand landen, schafft gemeinsame Erinnerungen, die keine Übung im Sitzungssaal reproduzieren kann. Es ist eine echte gemeinsame Herausforderung, die Hierarchien schnell abbaut."]}, {"h2": "Was übernehmen wir für Firmengruppen?", "ps": ["Wir kümmern uns um die gesamte Logistik: Hotelabholung, Transfer zum Startplatz, individuelle Flugslots, ein Gruppenfotopaket und eine Nachbesprechung am Strand danach."]}, {"h2": "Was ist in einem Firmenpaket enthalten?", "ps": ["Vorrangige Buchung, ein eigener Gruppenkoordinator, professionelles Foto- und Videopaket, Optionen für Markenartikel und Catering-Arrangements auf Anfrage."]}, {"h2": "Welche Gruppengröße und Vorlaufzeit benötigen Sie?", "ps": ["Wir arbeiten mit Gruppen von 4–50 Personen. Mindestens 48 Stunden Vorlaufzeit erforderlich. Kontaktieren Sie uns für ein individuelles Firmenangebot."]}], "faqTitle": "FAQ – Firmengruppen-Paragliding", "faqs": [{"q": "Wie viele Personen können an einem Firmenflugtag teilnehmen?", "a": "Wir betreuen Gruppen von 4 bis 50 Personen, koordiniert von einem eigenen Gruppenkoordinator."}, {"q": "Wie viel Vorlauf brauchen Sie?", "a": "Mindestens 48 Stunden — früher ist besser, besonders in der Hochsaison."}, {"q": "Können Sie das Erlebnis für unser Unternehmen brandmarken?", "a": "Ja, Optionen für Markenartikel und gemeinsam gebrandete Materialien sind auf Anfrage verfügbar."}], "relatedTitle": "Gruppenoptionen", "related": [{"href": "/groups/hen-stag", "label": "Junggesellenabschiede"}, {"href": "/groups/schools", "label": "Schulgruppen"}, {"href": "/groups/tour-operators", "label": "Reiseveranstalter"}, {"href": "/contact", "label": "Kontakt"}]}, "ru": {"sections": [{"h2": "Почему парапланеризм — отличная корпоративная тимбилдинговая активность?", "ps": ["Наблюдать, как коллеги преодолевают страх высоты и благополучно приземляются на пляж, создаёт общие воспоминания, которые не воспроизведёт ни одно упражнение в переговорной. Это настоящий общий вызов, который быстро стирает иерархию."]}, {"h2": "Что мы организуем для корпоративных групп?", "ps": ["Мы берём на себя всю логистику: трансфер из отеля, трансфер на старт, индивидуальные слоты для полётов, групповой фотопакет и сессию подведения итогов на пляже после полётов."]}, {"h2": "Что входит в корпоративный пакет?", "ps": ["Приоритетное бронирование, выделенный координатор группы, профессиональный фото- и видеопакет, варианты брендированной продукции и организация кейтеринга по запросу."]}, {"h2": "Какой размер группы и срок уведомления нужны?", "ps": ["Мы работаем с группами от 4 до 50 человек. Требуется минимум 48 часов предварительного уведомления. Свяжитесь с нами для индивидуального корпоративного предложения."]}], "faqTitle": "FAQ – корпоративный групповой парапланеризм", "faqs": [{"q": "Сколько человек может участвовать в корпоративном дне полётов?", "a": "Мы работаем с группами от 4 до 50 человек, координируемыми выделенным координатором группы."}, {"q": "За сколько нужно предупредить?", "a": "Минимум за 48 часов — раньше лучше, особенно в высокий сезон."}, {"q": "Можете ли вы брендировать мероприятие под нашу компанию?", "a": "Да, варианты брендированной продукции и совместно брендированные материалы доступны по запросу."}], "relatedTitle": "Групповые варианты", "related": [{"href": "/groups/hen-stag", "label": "Девичники и мальчишники"}, {"href": "/groups/schools", "label": "Школьные группы"}, {"href": "/groups/tour-operators", "label": "Туроператоры"}, {"href": "/contact", "label": "Связаться с нами"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'groups' })
  const titles = {en:"Corporate Group Paragliding",tr:"Kurumsal Grup Paraşütü",de:"Firmengruppenparagliding",ru:"Корпоративный парапланеризм"}
  const subs = {en:"Team-building and corporate events with paragliding at Oludeniz.",tr:"Oludeniz'de paraşütle ekip oluşturma ve kurumsal etkinlikler.",de:"Teambuilding und Firmenevents mit Paragliding in Oludeniz.",ru:"Тимбилдинг и корпоративные мероприятия с парапланеризмом в Олюдениз."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="Corporate Paragliding Events Oludeniz" description="Corporate group paragliding flights and team-building experiences in Oludeniz." path="/groups/corporate" serviceType="Tandem Paragliding Flight" />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c09/2htlcwkJ6pcLBY7gPtf7z.jpg" />
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
