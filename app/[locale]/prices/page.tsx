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
      price: '150',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: 'https://atmosparagliding.com/book-now',
    },
    {
      '@type': 'Offer',
      name: 'High Altitude Tandem Paragliding Flight',
      price: '150',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: 'https://atmosparagliding.com/book-now',
    },
    {
      '@type': 'Offer',
      name: 'Sunset Tandem Paragliding Flight',
      price: '150',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: 'https://atmosparagliding.com/book-now',
    },
  ],
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const lp = (href: string) => locale === 'en' ? href : `/${locale}${href}`
  const t = await getTranslations({ locale, namespace: 'prices' })
  const d: Record<string, string> = {"en": "Tandem paragliding prices in Oludeniz: standard, sunset and VIP flight packages with photo & video options. Transparent pricing, no hidden fees.", "tr": "Ölüdeniz tandem yamaç paraşütü fiyatları: standart, gün batımı ve VIP uçuş paketleri, foto & video seçenekleri. Şeffaf fiyat, gizli ücret yok.", "de": "Preise für Tandem-Paragliding in Ölüdeniz: Standard-, Sunset- und VIP-Pakete mit Foto- und Videooptionen. Transparente Preise.", "ru": "Цены на тандемные полёты в Олюденизе: стандартные, закатные и VIP-пакеты с фото и видео. Прозрачные цены без скрытых платежей.", "zh": "厄卢代尼兹双人滑翔伞价格：标准、日落和 VIP 飞行套餐，可选照片和视频。价格透明，无隐藏费用。"}
  return {
    description: d[locale] || d.en,
    title: t('title'),
    alternates: localeAlternates(locale, '/prices'),
    openGraph: { url: localeUrl(locale, '/prices'), title: t('title'), description: d[locale] || d.en },
    twitter: { card: 'summary_large_image', description: d[locale] || d.en },
  }
}

const PRICE_FAQ: any = {"en": {"faqTitle": "FAQ – Prices & Packages", "faqs": [{"q": "Is the price per person or per group?", "a": "All prices are per person. $150 per person for every flight — standard, high altitude, or sunset."}, {"q": "What's included in the price?", "a": "A certified tandem pilot, full safety equipment, transfer to the launch point, beach landing, third-party insurance and a professional photo & video package are included in every flight."}, {"q": "What if the weather is bad on my flight day?", "a": "If we cancel due to weather, you receive a full refund or free rescheduling — no exceptions."}, {"q": "Do you offer group discounts?", "a": "No. Every flight is one fixed $150 all-inclusive price per person — no group discounts, no add-ons, no hidden fees."}, {"q": "Are photos and videos included?", "a": "Yes — a professional photo & video package of your flight is included in the $150 price at no extra cost."}]}, "tr": {"faqTitle": "SSS – Fiyatlar ve Paketler", "faqs": [{"q": "Fiyat kişi başına mı yoksa grup başına mı?", "a": "Tüm fiyatlar kişi başınadır. Standart, yüksek irtifa veya gün batımı — her uçuş $150'dır."}, {"q": "Fiyata neler dahil?", "a": "Her uçuşa sertifikalı bir tandem pilot, tam güvenlik ekipmanı, kalkış noktasına transfer, plaj inişi, üçüncü şahıs sigortası ve profesyonel foto & video paketi dahildir."}, {"q": "Uçuş gününde hava kötü olursa ne olur?", "a": "Hava nedeniyle iptal edersek, tam iade veya ücretsiz yeniden planlama alırsınız — istisnasız."}, {"q": "Grup indirimi var mı?", "a": "Hayır. Her uçuş kişi başı sabit $150, her şey dahil — grup indirimi, ek ücret ya da gizli ücret yoktur."}, {"q": "Fotoğraf ve video dahil mi?", "a": "Evet — uçuşunuzun profesyonel foto & video paketi $150 fiyata ücretsiz dahildir."}]}, "de": {"faqTitle": "FAQ – Preise & Pakete", "faqs": [{"q": "Ist der Preis pro Person oder pro Gruppe?", "a": "Alle Preise sind pro Person. $150 pro Person für jeden Flug — Standard, Höhenflug oder Sonnenuntergang."}, {"q": "Was ist im Preis enthalten?", "a": "Ein zertifizierter Tandempilot, vollständige Sicherheitsausrüstung, Transfer zum Startplatz, Strandlandung, Haftpflichtversicherung und ein professionelles Foto- & Videopaket sind in jedem Flug enthalten."}, {"q": "Was passiert bei schlechtem Wetter am Flugtag?", "a": "Bei witterungsbedingter Absage erhalten Sie eine volle Rückerstattung oder kostenlose Umbuchung — ohne Ausnahme."}, {"q": "Bieten Sie Gruppenrabatte an?", "a": "Nein. Jeder Flug kostet einen Festpreis von $150 pro Person, alles inklusive — keine Gruppenrabatte, keine Zusatzkosten, keine versteckten Gebühren."}, {"q": "Sind Fotos und Videos enthalten?", "a": "Ja — ein professionelles Foto- & Videopaket Ihres Flugs ist im Preis von $150 ohne Aufpreis enthalten."}]}, "ru": {"faqTitle": "FAQ – цены и пакеты", "faqs": [{"q": "Цена за человека или за группу?", "a": "Все цены указаны за человека. $150 с человека за любой полёт — стандартный, высотный или закатный."}, {"q": "Что входит в цену?", "a": "В каждый полёт входит сертифицированный тандем-пилот, полное защитное снаряжение, трансфер к месту старта, посадка на пляже, страхование гражданской ответственности и профессиональный фото- и видеопакет."}, {"q": "Что если погода плохая в день полёта?", "a": "При отмене из-за погоды вы получаете полный возврат средств или бесплатный перенос — без исключений."}, {"q": "Есть ли групповые скидки?", "a": "Нет. Каждый полёт — фиксированная цена $150 с человека, всё включено — без групповых скидок, доплат и скрытых платежей."}, {"q": "Включены ли фото и видео?", "a": "Да — профессиональный фото- и видеопакет вашего полёта включён в цену $150 без доплаты."}]}, "zh": {"faqTitle": "常见问题 – 价格与套餐", "faqs": [{"q": "价格是按人还是按团体计算？", "a": "所有价格均按人计算。每次飞行每人 150 美元——标准、高空或日落飞行均相同。"}, {"q": "价格包含哪些内容？", "a": "每个套餐都包含认证双人飞行员、全套安全装备、前往起飞点的接送、海滩降落、第三方责任险，以及专业照片和视频套餐。"}, {"q": "如果飞行当天天气不好怎么办？", "a": "如果我们因天气原因取消飞行，您将获得全额退款或免费改期——没有例外。"}, {"q": "你们提供团体折扣吗？", "a": "不提供。每次飞行都是每人 150 美元的全包一口价——没有团体折扣、没有附加费用，也没有隐藏费用。"}, {"q": "包含照片和视频吗？", "a": "包含——您飞行的专业照片和视频套餐已包含在 150 美元的价格中，无需额外付费。"}]}}

export default async function PricesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const lp = (href: string) => locale === 'en' ? href : `/${locale}${href}`
  const t = await getTranslations({ locale, namespace: 'prices' })

  const packages = [
    {
      name: t('standard'),
      launch: t('standardLaunch'),
      price: '$150',
      duration: t('standardDuration'),
      highlight: false,
      badge: '',
      features: [t('feat1'), t('feat2'), t('feat3'), t('feat4'), t('feat5')],
    },
    {
      name: t('high'),
      launch: t('highLaunch'),
      price: '$150',
      duration: t('highDuration'),
      highlight: true,
      badge: t('highBadge'),
      features: [t('feat1'), t('feat2'), t('feat3'), t('feat4'), t('feat5'), t('featHigh'), t('featHigher')],
    },
    {
      name: t('sunset'),
      launch: t('sunsetLaunch'),
      price: '$150',
      duration: t('sunsetDuration'),
      highlight: false,
      badge: t('sunsetBadge'),
      features: [t('feat1'), t('feat2'), t('feat3'), t('feat4'), t('feat5'), t('featSunset'), t('featSunset2')],
    },
  ]

  const addOns = [
    { name: 'Professional Photo & Video Package', price: 'Included', desc: 'Professional photos and HD video of your entire flight — no extra charge' },
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
