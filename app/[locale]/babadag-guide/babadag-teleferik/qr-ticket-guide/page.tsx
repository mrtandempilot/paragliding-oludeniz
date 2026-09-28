import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import BookingCTA from '@/components/shared/BookingCTA'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = {en:"Teleferik QR Ticket Guide",tr:"Teleferik QR Bilet Rehberi",de:"Teleferik QR-Ticket Leitfaden",ru:"Гид по QR-билету телеферика", zh: "缆车二维码门票指南"}
  const d = {en:"How to buy and use the Babadağ teleferik QR ticket.",tr:"Babadag teleferik QR bilet nasil satin alinir ve kullanilir.",de:"Wie man das Babadağ-Teleferik QR-Ticket kauft und nutzt.",ru:"Как купить и использовать QR-билет телеферика Бабадаг.", zh: "如何购买和使用巴巴达山缆车二维码门票。"}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/babadag-guide/babadag-teleferik/qr-ticket-guide'),
    openGraph: { url: localeUrl(locale, '/babadag-guide/babadag-teleferik/qr-ticket-guide'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'babadagGuide' })
  const titles = {en:"Teleferik QR Ticket Guide",tr:"Teleferik QR Bilet Rehberi",de:"Teleferik QR-Ticket Leitfaden",ru:"Гид по QR-билету телеферика", zh: "缆车二维码门票指南"}
  const subs = {en:"How to buy and use the Babadağ teleferik QR ticket.",tr:"Babadag teleferik QR bilet nasil satin alinir ve kullanilir.",de:"Wie man das Babadağ-Teleferik QR-Ticket kauft und nutzt.",ru:"Как купить и использовать QR-билет телеферика Бабадаг.", zh: "如何购买和使用巴巴达山缆车二维码门票。"}
  const bodies: Record<string,string[]> = {
    en: ["Babadağ teleferik tickets can be purchased at the base station ticket office or online via the official teleferik website. Online purchases provide a QR code for faster boarding.","To use your QR ticket: download the ticket to your phone before visiting (internet connection may be limited at the site). Scan the QR code at the turnstile. Both single and return tickets are available.","Price information: current prices are available at the ticket office or on the official website. Children under a certain height travel free. Contact us if you need help purchasing tickets in advance."],
    tr: ["Babadağ teleferik biletleri alt istasyon gişesinden veya resmi teleferik web sitesinden online satın alınabilir.","QR biletinizi kullanmak için: siteye gelmeden önce bileti telefonunuza indirin. Turnike kapısında QR kodu okutun.","Fiyat bilgisi için gişeye veya resmi web sitesine başvurun."],
    de: ["Babadağ teleferik tickets can be purchased at the base station ticket office or online via the official teleferik website. Online purchases provide a QR code for faster boarding.","To use your QR ticket: download the ticket to your phone before visiting (internet connection may be limited at the site). Scan the QR code at the turnstile. Both single and return tickets are available.","Price information: current prices are available at the ticket office or on the official website. Children under a certain height travel free. Contact us if you need help purchasing tickets in advance."],
    ru: ["Babadağ teleferik tickets can be purchased at the base station ticket office or online via the official teleferik website. Online purchases provide a QR code for faster boarding.","To use your QR ticket: download the ticket to your phone before visiting (internet connection may be limited at the site). Scan the QR code at the turnstile. Both single and return tickets are available.","Price information: current prices are available at the ticket office or on the official website. Children under a certain height travel free. Contact us if you need help purchasing tickets in advance."], zh: ["巴巴达山缆车门票可在山下站售票处购买，也可通过缆车官方网站在线购买。在线购票会提供二维码，登车更快捷。","使用二维码门票：请在出发前将门票下载到手机（现场网络信号可能有限）。在闸机处扫描二维码即可。提供单程票和往返票。","价格信息：最新价格请在售票处或官方网站查询。身高低于一定标准的儿童可免费乘坐。如需帮助提前购票，请联系我们。"],
  }
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const body = bodies[locale]||bodies.en
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"Article\", \"headline\": \"Babada\\u011f Teleferik QR Ticket Guide\", \"description\": \"How to buy and use QR tickets for the Babada\\u011f cable car.\", \"url\": \"https://atmosparagliding.com/babadag-guide/babadag-teleferik/qr-ticket-guide\", \"author\": {\"@type\": \"Person\", \"name\": \"Ceyhun\", \"url\": \"https://atmosparagliding.com/en/about-us\"}, \"publisher\": {\"@type\": \"Organization\", \"name\": \"Atmos Paragliding\", \"url\": \"https://atmosparagliding.com\"}}" }} />
      <PageHero title={title} subtitle={sub} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c08/BbYEw0ihhZaLcaN29vTrs.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3"><BreadcrumbNav items={[{ label: title }]} /></div>
      </div>
      <section className="section-padding bg-white">
        <div className="container-default max-w-3xl space-y-4">
          {body.map((p, i) => <p key={i} className="text-slate-600 leading-relaxed">{p}</p>)}
        </div>
      </section>
      <BookingCTA />
    </>
  )
}
