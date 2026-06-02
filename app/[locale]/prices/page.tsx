import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Star } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'prices' })
  return {
    title: t('title'),
    alternates: { canonical: 'https://paragliding-oludeniz.com/prices' },
  }
}

export default async function PricesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'prices' })

  const packages = [
    {
      name: t('standard'),
      launch: t('standardLaunch'),
      price: '€80',
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
    { name: 'Professional Photo Package', price: '€25', desc: 'Photos taken by your pilot during flight' },
    { name: 'Professional Video Package', price: '€30', desc: 'HD video of your entire flight' },
    { name: 'Photo + Video Bundle', price: '€45', desc: 'Best value — both photo and video' },
    { name: 'GoPro Mount', price: '€10', desc: 'Mount for your own GoPro or phone' },
  ]

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} badge={t('badge')} size="sm" />
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
                  <Link href="/book-now" className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold transition-colors ${pkg.highlight ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>
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
            <Link href="/contact" className="btn-primary">
              {t('bookNow')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
