import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Star } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import { getTranslations } from 'next-intl/server'
import { localeAlternates, localeUrl } from '@/lib/seo'
import ServiceSchema from '@/components/shared/ServiceSchema'


const PRICE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Tandem Paragliding Ölüdeniz',
  url: 'https://www.atmosparagliding.com/prices',
  provider: {
    '@type': 'LocalBusiness',
    name: 'Atmos Paragliding',
    url: 'https://www.atmosparagliding.com',
  },
  areaServed: { '@type': 'Place', name: 'Ölüdeniz, Fethiye, Turkey' },
  offers: [
    {
      '@type': 'Offer',
      name: 'Standard Tandem Paragliding Flight',
      price: '100',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: 'https://www.atmosparagliding.com/book-now',
      validFrom: '2026-04-01',
      validThrough: '2026-10-31',
    },
    {
      '@type': 'Offer',
      name: 'High Altitude Tandem Paragliding Flight',
      price: '100',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: 'https://www.atmosparagliding.com/book-now',
      validFrom: '2026-04-01',
      validThrough: '2026-10-31',
    },
    {
      '@type': 'Offer',
      name: 'Sunset Tandem Paragliding Flight',
      price: '110',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: 'https://www.atmosparagliding.com/book-now',
      validFrom: '2026-04-01',
      validThrough: '2026-10-31',
    },
  ],
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const lp = (href: string) => locale === 'en' ? href : `/${locale}${href}`
  const t = await getTranslations({ locale, namespace: 'prices' })
  const d: Record<string, string> = {"en": "Tandem paragliding prices in Oludeniz: standard, sunset and VIP flight packages with photo & video options. Transparent pricing, no hidden fees.", "tr": "Ölüdeniz tandem yamaç paraşütü fiyatları: standart, gün batımı ve VIP uçuş paketleri, foto & video seçenekleri. Şeffaf fiyat, gizli ücret yok.", "de": "Preise für Tandem-Paragliding in Ölüdeniz: Standard-, Sunset- und VIP-Pakete mit Foto- und Videooptionen. Transparente Preise.", "ru": "Цены на тандемные полёты в Олюденизе: стандартные, закатные и VIP-пакеты с фото и видео. Прозрачные цены без скрытых платежей."}
  return {
    description: d[locale] || d.en,
    title: t('title'),
    alternates: localeAlternates(locale, '/prices'),
    openGraph: { url: localeUrl(locale, '/prices'), title: t('title'), description: d[locale] || d.en },
    twitter: { card: 'summary_large_image', description: d[locale] || d.en },
  }
}

const PRICE_FAQ: any = {"en": {"faqTitle": "FAQ – Prices & Packages", "faqs": [{"q": "Is the price per person or per group?", "a": "All prices are per person. €100 for standard or high altitude flights, €110 for sunset flights."}, {"q": "What's included in the price?", "a": "A certified tandem pilot, full safety equipment, transfer to the launch point, beach landing, and third-party insurance are included in every package."}, {"q": "What if the weather is bad on my flight day?", "a": "If we cancel due to weather, you receive a full refund or free rescheduling — no exceptions."}, {"q": "Do you offer group discounts?", "a": "Yes. Groups of 4 or more get 10% off, and groups of 8 or more get 15% off."}, {"q": "Are photos and videos included?", "a": "Yes, professional photo and video packages are included free with every flight. A GoPro mount for your own device is available for €10."}]}, "tr": {"faqTitle": "SSS – Fiyatlar ve Paketler", "faqs": [{"q": "Fiyat kişi başına mı yoksa grup başına mı?", "a": "Tüm fiyatlar kişi başınadır. Standart veya yüksek irtifa uçuşları için 100€, gün batımı uçuşları için 110€."}, {"q": "Fiyata neler dahil?", "a": "Her pakete sertifikalı bir tandem pilot, tam güvenlik ekipmanı, kalkış noktasına transfer, plaj inişi ve üçüncü şahıs sigortası dahildir."}, {"q": "Uçuş gününde hava kötü olursa ne olur?", "a": "Hava nedeniyle iptal edersek, tam iade veya ücretsiz yeniden planlama alırsınız — istisnasız."}, {"q": "Grup indirimi var mı?", "a": "Evet. 4 veya daha fazla kişilik gruplara %10, 8 veya daha fazla kişilik gruplara %15 indirim uygulanır."}, {"q": "Fotoğraf ve video dahil mi?", "a": "Evet, profesyonel fotoğraf ve video paketleri her uçuşta ücretsiz dahildir. Kendi cihazınız için GoPro montajı 10€ karşılığında mevcuttur."}]}, "de": {"faqTitle": "FAQ – Preise & Pakete", "faqs": [{"q": "Ist der Preis pro Person oder pro Gruppe?", "a": "Alle Preise sind pro Person. €100 für Standard- oder Höhenflüge, €110 für Sonnenuntergangsflüge."}, {"q": "Was ist im Preis enthalten?", "a": "Ein zertifizierter Tandempilot, vollständige Sicherheitsausrüstung, Transfer zum Startplatz, Strandlandung und Haftpflichtversicherung sind in jedem Paket enthalten."}, {"q": "Was passiert bei schlechtem Wetter am Flugtag?", "a": "Bei witterungsbedingter Absage erhalten Sie eine volle Rückerstattung oder kostenlose Umbuchung — ohne Ausnahme."}, {"q": "Bieten Sie Gruppenrabatte an?", "a": "Ja. Gruppen ab 4 Personen erhalten 10% Rabatt, ab 8 Personen 15% Rabatt."}, {"q": "Sind Fotos und Videos enthalten?", "a": "Ja, professionelle Foto- und Videopakete sind bei jedem Flug kostenlos enthalten. Eine GoPro-Halterung für Ihr eigenes Gerät ist für €10 erhältlich."}]}, "ru": {"faqTitle": "FAQ – цены и пакеты", "faqs": [{"q": "Цена за человека или за группу?", "a": "Все цены указаны за человека. €100 за стандартные или высотные полёты, €110 за закатные полёты."}, {"q": "Что входит в цену?", "a": "В каждый пакет входит сертифицированный тандем-пилот, полное защитное снаряжение, трансфер к месту старта, посадка на пляже и страхование гражданской ответственности."}, {"q": "Что если погода плохая в день полёта?", "a": "При отмене из-за погоды вы получаете полный возврат средств или бесплатный перенос — без исключений."}, {"q": "Есть ли групповые скидки?", "a": "Да. Группы от 4 человек получают скидку 10%, от 8 человек — 15%."}, {"q": "Включены ли фото и видео?", "a": "Да, профессиональные фото- и видеопакеты включены бесплатно в каждый полёт. Крепление GoPro для вашего устройства доступно за €10."}]}}

export default async function PricesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const lp = (href: string) => locale === 'en' ? href : `/${locale}${href}`
  const t = await getTranslations({ locale, namespace: 'prices' })

  const packages = [
    {
      name: t('standard'),
      launch: t('standardLaunch'),
      price: '€100',
      duration: t('standardDuration'),
      highlight: false,
      badge: '',
      features: [t('feat1'), t('feat2'), t('feat3'), t('feat4'), t('feat5')],
    },
    {
      name: t('high'),
      launch: t('highLaunch'),
      price: '€100',
      duration: t('highDuration'),
      highlight: true,
      badge: t('highBadge'),
      features: [t('feat1'), t('feat2'), t('feat3'), t('feat4'), t('feat5'), t('featHigh'), t('featHigher')],
    },
    {
      name: t('sunset'),
      launch: t('sunsetLaunch'),
      price: '€110',
      duration: t('sunsetDuration'),
      highlight: false,
      badge: t('sunsetBadge'),
      features: [t('feat1'), t('feat2'), t('feat3'), t('feat4'), t('feat5'), t('featSunset'), t('featSunset2')],
    },
  ]

  const addOns = [
    { name: 'Professional Photo Package', price: 'Free', desc: 'Photos taken by your pilot during flight' },
    { name: 'Professional Video Package', price: 'Free', desc: 'HD video of your entire flight' },
    { name: 'Photo + Video Bundle', price: 'Free', desc: 'Best value — both photo and video' },
    { name: 'GoPro Mount', price: '€10', desc: 'Mount for your own GoPro or phone' },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PRICE_SCHEMA) }}
      />
      <ServiceSchema name="Paragliding Oludeniz Prices & Packages" description="Transparent pricing for tandem paragliding flights in Oludeniz. Standard, sunset and VIP packages from Babadağ with certified pilots." path="/prices" serviceType="Tandem Paragliding Flight" />
      <PageHero title={t('title')} subtitle={t('subtitle')} badge={t('badge')} size="sm" bgImage="https://v3b.fal.media/files/b/0a9d7c0d/dOEuj7ebfM-MdyvUcunPD.jpg" />
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: t('title') }]} />
        </div>
      </div>

      <section className="section-padding bg-white">
        <div className="container-default">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {packages.map((pkg) => (
              <div key={pkg.name} className={`rounded-2xl border-2 overflow-hidden flex flex-col ${pkg.highlight ? 'border-orange-500 shadow-xl shadow-orange-100' : 'border-slate-200'}`}>
                {pkg.badge && (
                  <div className={`px-4 py-2 text-center text-sm font-bold ${pkg.highlight ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-700'}`}>
                    {pkg.badge}
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{pkg.name}</h3>
                  <p className="text-sm text-slate-500 mb-4">{pkg.launch} · {pkg.duration}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-orange-500">{pkg.price}</span>
                    <span className="text-slate-500 ml-2 text-sm">/ person</span>
                  </div>
                  <div className="mb-6 flex-1">
                    <p className="text-sm font-semibold text-slate-700 mb-3">{t('included')}</p>
                    <ul className="space-y-2">
                      {pkg.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link href={lp("/book-now")} className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold transition-colors ${pkg.highlight ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>
                    {t('bookNow')} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Add-ons */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('addOns')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {addOns.map((a) => (
                <div key={a.name} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-slate-900 text-sm">{a.name}</p>
                    <span className="text-orange-500 font-bold">{a.price}</span>
                  </div>
                  <p className="text-slate-500 text-xs">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Group discount */}
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 text-center">
            <Star className="w-8 h-8 text-orange-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">{t('groupDiscount')}</h3>
            <p className="text-slate-600 mb-6">{t('groupDesc')}</p>
            <Link href={lp("/contact")} className="btn-primary">
              {t('bookNow')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-default max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{(PRICE_FAQ as any)[locale]?.faqTitle || PRICE_FAQ.en.faqTitle}</h2>
          <div className="space-y-6">
            {((PRICE_FAQ as any)[locale]?.faqs || PRICE_FAQ.en.faqs).map((f: any, i: number) => (
              <div key={i}>
                <h3 className="font-semibold text-slate-900 mb-1">{f.q}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
