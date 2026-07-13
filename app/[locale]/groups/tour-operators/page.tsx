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
  const t = {en:"Tour Operator Packages",tr:"Tur Operatörü Paketleri",de:"Reiseveranstalter-Pakete",ru:"Пакеты для туроператоров"}
  const d = {en:"We are the preferred paragliding partner for tour operators in the Fethiye region.",tr:"Fethiye bölgesindeki tur operatörlerinin tercih ettiği paraşüt ortağıyız.",de:"Wir sind der bevorzugte Paragliding-Partner für Reiseveranstalter in der Fethiye-Region.",ru:"Мы являемся предпочтительным партнёром по парапланеризму для туроператоров региона Фетхие."}
  return {
    description: (d as any)[locale] || d.en,
    alternates: localeAlternates(locale, '/groups/tour-operators'),
    openGraph: { url: localeUrl(locale, '/groups/tour-operators'), description: (d as any)[locale] || d.en },
    twitter: { card: 'summary_large_image', description: (d as any)[locale] || d.en }, title: `${(t as any)[locale]||t.en}` }
}

const CONTENT: any = {"en": {"sections": [{"h2": "Why Partner with Us as a Tour Operator?", "ps": ["We have established relationships with tour operators, travel agents and hotel concierges throughout the Fethiye and Ölüdeniz region, offering competitive trade rates, reliable operations and a seamless guest experience."]}, {"h2": "What Do We Provide for Trade Partners?", "ps": ["A confirmed booking system with same-day slots available, dedicated trade pricing, co-branded materials, emergency contact protocols, and a 99%+ reliability record."]}, {"h2": "How Do You Set Up a Partnership Account?", "ps": ["Contact our trade desk to establish a partnership account: trade@atmosparagliding.com or WhatsApp +90 536 461 6674."]}], "faqTitle": "FAQ – Tour Operator Partnerships", "faqs": [{"q": "Do you offer trade rates for tour operators?", "a": "Yes, dedicated trade pricing is available once you set up a partnership account."}, {"q": "Can guests book same-day slots?", "a": "Yes, our confirmed booking system has same-day slots available in most conditions."}, {"q": "How reliable is your operation for guest itineraries?", "a": "We maintain a 99%+ reliability record, which is why hotels and agents throughout the region trust us with their guests."}], "relatedTitle": "Group Options", "related": [{"href": "/groups/corporate", "label": "Corporate Groups"}, {"href": "/groups/schools", "label": "School Groups"}, {"href": "/prices", "label": "Prices & Packages"}, {"href": "/contact", "label": "Contact Us"}]}, "tr": {"sections": [{"h2": "Tur Operatörü Olarak Neden Bizimle Ortak Olmalısınız?", "ps": ["Fethiye ve Ölüdeniz bölgesindeki tur operatörleri, seyahat acentaları ve otel conciergeleriyle köklü ilişkilerimiz bulunmaktadır; rekabetçi ticari fiyatlar, güvenilir operasyonlar ve sorunsuz misafir deneyimi sunuyoruz."]}, {"h2": "Ticari Ortaklar İçin Neler Sağlıyoruz?", "ps": ["Aynı gün slot imkanı sunan onaylı rezervasyon sistemi, özel ticari fiyatlandırma, ortak markalı materyaller, acil durum iletişim protokolleri ve %99+ güvenilirlik kaydı."]}, {"h2": "Ortaklık Hesabı Nasıl Kurulur?", "ps": ["Ortaklık hesabı kurmak için ticari masamızla iletişime geçin: trade@atmosparagliding.com veya WhatsApp +90 536 461 6674."]}], "faqTitle": "SSS – Tur Operatörü Ortaklıkları", "faqs": [{"q": "Tur operatörleri için ticari fiyatlar sunuyor musunuz?", "a": "Evet, bir ortaklık hesabı kurduktan sonra özel ticari fiyatlandırma mevcuttur."}, {"q": "Misafirler aynı gün slot ayırtabilir mi?", "a": "Evet, onaylı rezervasyon sistemimizde çoğu koşulda aynı gün slot mevcuttur."}, {"q": "Misafir gezi programları için operasyonunuz ne kadar güvenilir?", "a": "%99+ güvenilirlik kaydı sürdürüyoruz; bu yüzden bölgedeki oteller ve acentalar misafirlerini bize emanet ediyor."}], "relatedTitle": "Grup Seçenekleri", "related": [{"href": "/groups/corporate", "label": "Kurumsal Gruplar"}, {"href": "/groups/schools", "label": "Okul Grupları"}, {"href": "/prices", "label": "Fiyatlar ve Paketler"}, {"href": "/contact", "label": "Bize Ulaşın"}]}, "de": {"sections": [{"h2": "Warum als Reiseveranstalter mit uns zusammenarbeiten?", "ps": ["Wir haben etablierte Beziehungen zu Reiseveranstaltern, Reisebüros und Hotelconcierges in der gesamten Region Fethiye und Ölüdeniz und bieten wettbewerbsfähige Handelspreise, zuverlässigen Betrieb und ein reibungsloses Gästeerlebnis."]}, {"h2": "Was bieten wir Handelspartnern?", "ps": ["Ein bestätigtes Buchungssystem mit Slots am selben Tag, spezielle Handelspreise, gemeinsam gebrandete Materialien, Notfallkontaktprotokolle und eine Zuverlässigkeitsquote von über 99%."]}, {"h2": "Wie richten Sie ein Partnerschaftskonto ein?", "ps": ["Kontaktieren Sie unseren Handelsdesk, um ein Partnerschaftskonto einzurichten: trade@atmosparagliding.com oder WhatsApp +90 536 461 6674."]}], "faqTitle": "FAQ – Reiseveranstalter-Partnerschaften", "faqs": [{"q": "Bieten Sie Handelspreise für Reiseveranstalter an?", "a": "Ja, spezielle Handelspreise sind verfügbar, sobald Sie ein Partnerschaftskonto eingerichtet haben."}, {"q": "Können Gäste Slots am selben Tag buchen?", "a": "Ja, unser bestätigtes Buchungssystem bietet unter den meisten Bedingungen Slots am selben Tag."}, {"q": "Wie zuverlässig ist Ihr Betrieb für Gästereiseprogramme?", "a": "Wir halten eine Zuverlässigkeitsquote von über 99% — deshalb vertrauen uns Hotels und Agenturen in der ganzen Region ihre Gäste an."}], "relatedTitle": "Gruppenoptionen", "related": [{"href": "/groups/corporate", "label": "Firmengruppen"}, {"href": "/groups/schools", "label": "Schulgruppen"}, {"href": "/prices", "label": "Preise & Pakete"}, {"href": "/contact", "label": "Kontakt"}]}, "ru": {"sections": [{"h2": "Почему стоит сотрудничать с нами как туроператору?", "ps": ["У нас налаженные отношения с туроператорами, турагентами и консьержами отелей по всему региону Фетхие и Олюдениз — мы предлагаем конкурентные партнёрские тарифы, надёжную работу и безупречный опыт для гостей."]}, {"h2": "Что мы предоставляем торговым партнёрам?", "ps": ["Систему подтверждённого бронирования с доступными слотами в тот же день, специальные партнёрские тарифы, совместно брендированные материалы, протоколы связи на случай ЧС и репутацию надёжности свыше 99%."]}, {"h2": "Как открыть партнёрский аккаунт?", "ps": ["Свяжитесь с нашим торговым отделом, чтобы открыть партнёрский аккаунт: trade@atmosparagliding.com или WhatsApp +90 536 461 6674."]}], "faqTitle": "FAQ – партнёрство с туроператорами", "faqs": [{"q": "Предлагаете ли вы партнёрские тарифы туроператорам?", "a": "Да, специальные партнёрские тарифы доступны после открытия партнёрского аккаунта."}, {"q": "Могут ли гости бронировать слоты в тот же день?", "a": "Да, наша система подтверждённого бронирования предлагает слоты в тот же день в большинстве случаев."}, {"q": "Насколько надёжна ваша работа для маршрутов гостей?", "a": "Мы поддерживаем репутацию надёжности свыше 99% — поэтому отели и агентства по всему региону доверяют нам своих гостей."}], "relatedTitle": "Групповые варианты", "related": [{"href": "/groups/corporate", "label": "Корпоративные группы"}, {"href": "/groups/schools", "label": "Школьные группы"}, {"href": "/prices", "label": "Цены и пакеты"}, {"href": "/contact", "label": "Связаться с нами"}]}}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'groups' })
  const titles = {en:"Tour Operator Packages",tr:"Tur Operatörü Paketleri",de:"Reiseveranstalter-Pakete",ru:"Пакеты для туроператоров"}
  const subs = {en:"We are the preferred paragliding partner for tour operators in the Fethiye region.",tr:"Fethiye bölgesindeki tur operatörlerinin tercih ettiği paraşüt ortağıyız.",de:"Wir sind der bevorzugte Paragliding-Partner für Reiseveranstalter in der Fethiye-Region.",ru:"Мы являемся предпочтительным партнёром по парапланеризму для туроператоров региона Фетхие."}
  const title = (titles as any)[locale]||titles.en
  const sub = (subs as any)[locale]||subs.en
  const c: any = (CONTENT as any)[locale] || CONTENT.en
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  return (
    <>
      <ServiceSchema name="Tour Operator Paragliding Oludeniz" description="Paragliding packages for tour operators in Oludeniz. Competitive trade rates." path="/groups/tour-operators" serviceType="Tandem Paragliding Flight" />
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
