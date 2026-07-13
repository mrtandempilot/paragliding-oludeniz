import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Teleferik QR Ticket Guide",tr:"Teleferik QR Bilet Rehberi",de:"Teleferik QR-Ticket Leitfaden",ru:"Гид по QR-билету телеферика"}
  const d = {en:"How to buy and use the Babadağ teleferik QR ticket.",tr:"Babadag teleferik QR bilet nasil satin alinir ve kullanilir.",de:"Wie man das Babadağ-Teleferik QR-Ticket kauft und nutzt.",ru:"Как купить и использовать QR-билет телеферика Бабадаг."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/babadag-guide/babadag-teleferik/qr-ticket-guide'),
    openGraph: { url: localeUrl(locale, '/babadag-guide/babadag-teleferik/qr-ticket-guide'), description: (d as any)[locale] || d.en, images: ['https://www.atmosparagliding.com/opengraph-image'] },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "How Do You Buy a Teleferik QR Ticket?", "ps": ["Babadağ teleferik tickets can be bought at the base station ticket office in person, or online in advance via the official teleferik website, which issues a QR code instead of a paper ticket for faster boarding."]}, {"h2": "How Do You Use the QR Ticket on the Day?", "ps": ["Download or screenshot your ticket to your phone before you travel — mobile signal and wifi can be limited around the station and on the mountain. At the turnstile, simply scan the QR code to enter; both single and return tickets work the same way."], "bullets": ["Buy online in advance for the fastest entry", "Save the QR code offline (screenshot) in case of poor signal", "Scan at the turnstile — no printing required", "Keep your return QR ready if you bought a round trip"]}, {"h2": "What Should You Know About Pricing and Children?", "ps": ["Current ticket prices are published at the ticket office and on the official teleferik website, since they can change seasonally. Children under a certain height typically travel free — check the latest policy at the station or online before you go."]}], "faqTitle": "FAQ – Teleferik QR Ticket", "faqs": [{"q": "Do I need internet access to use my QR ticket?", "a": "You need it to download the ticket beforehand, but once saved to your phone (as a screenshot or in the confirmation email) you can scan it even with weak signal at the station."}, {"q": "Can I buy a ticket on the spot instead of online?", "a": "Yes, tickets are also sold at the base station ticket office, though buying online in advance is usually faster, especially in high season."}, {"q": "Is the QR ticket different for tandem passengers flying with Atmos Paragliding?", "a": "If your transfer uses the teleferik, your pilot or our team handles this as part of your flight package — you generally won't need to buy a separate ticket yourself."}], "relatedTitle": "More on the Teleferik", "related": [{"href": "/babadag-guide/babadag-teleferik", "label": "Cable Car Guide"}, {"href": "/babadag-guide", "label": "Babadağ Mountain Guide"}, {"href": "/babadag-guide/babadag-road-guide", "label": "Mountain Road Guide"}, {"href": "/tandem-paragliding", "label": "Tandem Flights"}, {"href": "/book-now", "label": "Book Your Flight"}]}, "tr": {"sections": [{"h2": "Teleferik QR Bileti Nasıl Satın Alınır?", "ps": ["Babadağ teleferik biletleri alt istasyon gişesinden yüz yüze veya resmi teleferik web sitesinden önceden online satın alınabilir; online alımda kağıt bilet yerine daha hızlı biniş için QR kod verilir."]}, {"h2": "Gün İçinde QR Bileti Nasıl Kullanılır?", "ps": ["Yola çıkmadan önce biletinizi telefonunuza indirin veya ekran görüntüsü alın — istasyon çevresinde ve dağda mobil sinyal ve wifi sınırlı olabilir. Turnikede QR kodu okutmanız yeterlidir; tek yön ve gidiş-dönüş biletler aynı şekilde çalışır."], "bullets": ["En hızlı giriş için önceden online satın alın", "Sinyal zayıf olabileceği için QR kodu ekran görüntüsü olarak kaydedin", "Turnikede okutun — yazdırmaya gerek yok", "Gidiş-dönüş aldıysanız dönüş QR kodunu hazır tutun"]}, {"h2": "Fiyatlandırma ve Çocuklar Hakkında Ne Bilmelisiniz?", "ps": ["Güncel bilet fiyatları gişede ve resmi teleferik web sitesinde yayınlanır, sezona göre değişebilir. Belirli bir boyun altındaki çocuklar genellikle ücretsiz seyahat eder — gitmeden önce istasyonda veya online güncel politikayı kontrol edin."]}], "faqTitle": "SSS – Teleferik QR Bilet", "faqs": [{"q": "QR biletimi kullanmak için internete ihtiyacım var mı?", "a": "Bileti önceden indirmek için internete ihtiyacınız var, ancak telefonunuza kaydettikten sonra (ekran görüntüsü veya onay e-postası olarak) zayıf sinyalde bile okutabilirsiniz."}, {"q": "Online yerine yerinde bilet alabilir miyim?", "a": "Evet, biletler alt istasyon gişesinden de satılır; ancak özellikle yüksek sezonda önceden online almak genellikle daha hızlıdır."}, {"q": "Atmos Paragliding ile tandem uçacaksam QR bilet farklı mı?", "a": "Transferiniz teleferik ile yapılıyorsa bu, pilotunuz veya ekibimiz tarafından uçuş paketinizin bir parçası olarak halledilir — genellikle ayrıca bilet almanıza gerek kalmaz."}], "relatedTitle": "Teleferik Hakkında Daha Fazlası", "related": [{"href": "/babadag-guide/babadag-teleferik", "label": "Teleferik Rehberi"}, {"href": "/babadag-guide", "label": "Babadağ Dağ Rehberi"}, {"href": "/babadag-guide/babadag-road-guide", "label": "Dağ Yolu Rehberi"}, {"href": "/tandem-paragliding", "label": "Tandem Uçuşlar"}, {"href": "/book-now", "label": "Uçuşunuzu Ayırtın"}]}, "de": {"sections": [{"h2": "Wie kauft man ein Teleferik-QR-Ticket?", "ps": ["Babadağ-Teleferik-Tickets können persönlich an der Talstation gekauft werden oder im Voraus online über die offizielle Teleferik-Website, die statt eines Papiertickets einen QR-Code für schnelleres Einsteigen ausstellt."]}, {"h2": "Wie nutzt man das QR-Ticket am Tag selbst?", "ps": ["Laden Sie Ihr Ticket vor der Anreise herunter oder machen Sie einen Screenshot — Mobilfunk und WLAN können rund um die Station und am Berg eingeschränkt sein. Am Drehkreuz scannen Sie einfach den QR-Code; Einzel- und Rückfahrtickets funktionieren gleich."], "bullets": ["Für den schnellsten Einlass im Voraus online kaufen", "QR-Code offline speichern (Screenshot) für den Fall schlechten Empfangs", "Am Drehkreuz scannen — kein Ausdruck nötig", "Bei Hin- und Rückfahrt den Rück-QR-Code bereithalten"]}, {"h2": "Was sollten Sie über Preise und Kinder wissen?", "ps": ["Aktuelle Ticketpreise werden an der Gläserstation und auf der offiziellen Teleferik-Website veröffentlicht, da sie sich saisonal ändern können. Kinder unter einer bestimmten Körpergröße fahren meist kostenlos — prüfen Sie die aktuelle Regelung vor Ort oder online."]}], "faqTitle": "FAQ – Teleferik-QR-Ticket", "faqs": [{"q": "Brauche ich Internet, um mein QR-Ticket zu nutzen?", "a": "Sie brauchen es, um das Ticket vorab herunterzuladen, aber sobald es auf Ihrem Handy gespeichert ist (als Screenshot oder Bestätigungs-E-Mail), können Sie es auch bei schwachem Empfang scannen lassen."}, {"q": "Kann ich das Ticket vor Ort statt online kaufen?", "a": "Ja, Tickets werden auch an der Talstation verkauft, aber der Online-Kauf im Voraus ist meist schneller, besonders in der Hochsaison."}, {"q": "Ist das QR-Ticket für Tandempassagiere bei Atmos Paragliding anders?", "a": "Wenn Ihr Transfer über die Seilbahn läuft, übernimmt dies Ihr Pilot oder unser Team im Rahmen Ihres Flugpakets — Sie müssen in der Regel kein separates Ticket kaufen."}], "relatedTitle": "Mehr zur Seilbahn", "related": [{"href": "/babadag-guide/babadag-teleferik", "label": "Seilbahn-Leitfaden"}, {"href": "/babadag-guide", "label": "Babadağ Bergführer"}, {"href": "/babadag-guide/babadag-road-guide", "label": "Bergstraßen-Leitfaden"}, {"href": "/tandem-paragliding", "label": "Tandemflüge"}, {"href": "/book-now", "label": "Flug buchen"}]}, "ru": {"sections": [{"h2": "Как купить QR-билет на телеферик?", "ps": ["Билеты на телеферик Бабадага можно купить в кассе нижней станции лично или заранее онлайн на официальном сайте телеферика, который выдаёт QR-код вместо бумажного билета для более быстрой посадки."]}, {"h2": "Как использовать QR-билет в день поездки?", "ps": ["Скачайте билет на телефон или сделайте скриншот перед поездкой — мобильная связь и wifi около станции и на горе могут быть ограничены. На турникете просто отсканируйте QR-код; билеты в одну сторону и туда-обратно работают одинаково."], "bullets": ["Покупайте онлайн заранее для самого быстрого входа", "Сохраните QR-код офлайн (скриншот) на случай слабого сигнала", "Сканируйте на турникете — печать не нужна", "Держите обратный QR-код наготове, если купили билет туда-обратно"]}, {"h2": "Что нужно знать о ценах и детях?", "ps": ["Актуальные цены на билеты публикуются в кассе и на официальном сайте телеферика, так как они могут меняться по сезонам. Дети ниже определённого роста обычно едут бесплатно — уточните актуальные условия на станции или онлайн перед поездкой."]}], "faqTitle": "FAQ – QR-билет на телеферик", "faqs": [{"q": "Нужен ли мне интернет для использования QR-билета?", "a": "Он нужен, чтобы скачать билет заранее, но после сохранения на телефоне (скриншот или письмо с подтверждением) вы сможете отсканировать его даже при слабом сигнале."}, {"q": "Могу ли я купить билет на месте, а не онлайн?", "a": "Да, билеты также продаются в кассе нижней станции, но покупка онлайн заранее обычно быстрее, особенно в высокий сезон."}, {"q": "Отличается ли QR-билет для тандемных пассажиров Atmos Paragliding?", "a": "Если ваш трансфер идёт через телеферик, это организует пилот или наша команда в рамках вашего пакета полёта — обычно покупать отдельный билет самому не нужно."}], "relatedTitle": "Больше о телеферике", "related": [{"href": "/babadag-guide/babadag-teleferik", "label": "Гид по канатной дороге"}, {"href": "/babadag-guide", "label": "Гид по горе Бабадаг"}, {"href": "/babadag-guide/babadag-road-guide", "label": "Гид по горной дороге"}, {"href": "/tandem-paragliding", "label": "Тандемные полёты"}, {"href": "/book-now", "label": "Забронировать полёт"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'babadagGuide' })
  const titles = {en:"Teleferik QR Ticket Guide",tr:"Teleferik QR Bilet Rehberi",de:"Teleferik QR-Ticket Leitfaden",ru:"Гид по QR-билету телеферика"}
  const subs = {en:"How to buy and use the Babadağ teleferik QR ticket.",tr:"Babadag teleferik QR bilet nasil satin alinir ve kullanilir.",de:"Wie man das Babadağ-Teleferik QR-Ticket kauft und nutzt.",ru:"Как купить и использовать QR-билет телеферика Бабадаг."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Babada\\u011f Teleferik QR Ticket Guide\", \"description\": \"How to buy and use QR tickets for the Babada\\u011f cable car.\", \"url\": \"https://www.atmosparagliding.com/babadag-guide/babadag-teleferik/qr-ticket-guide\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://www.atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://www.atmosparagliding.com\"}}" }} />
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
