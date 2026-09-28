'use client'

import { Link } from '@/i18n/navigation'
import { ArrowRight, Mountain } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function BabadagIntro() {
  const t = useTranslations('babadag')

  const stats = [
    { value: '1960m', label: t('stat1') },
    { value: '4', label: t('stat2') },
    { value: '300+', label: t('stat3') },
    { value: '60+', label: t('stat4') },
  ]

  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="container-default">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85')",
                }}
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-orange-500 text-slate-900 rounded-2xl p-4 shadow-xl">
              <Mountain className="w-6 h-6 mb-1" />
              <p className="font-bold text-lg leading-none">1960m</p>
              <p className="text-xs text-slate-800">{t('floatingLabel')}</p>
            </div>
          </div>

          <div>
            <span className="text-orange-700 font-semibold text-sm uppercase tracking-widest">
              {t('badge')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-6">
              {t('title')}
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">{t('desc1')}</p>
            <p className="text-slate-600 leading-relaxed mb-8">{t('desc2')}</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-orange-700">{stat.value}</p>
                  <p className="text-sm text-slate-600 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <Link href="/babadag-guide" className="btn-primary">
              {t('cta')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
