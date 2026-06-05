'use client'

import { Mountain, Wind, Camera, Award, Clock, MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function WhyOludeniz() {
  const t = useTranslations('whyOludeniz')

  const reasons = [
    {
      icon: Mountain,
      title: t('altitude'),
      description: t('altitudeDesc'),
      color: 'text-sky-600',
      bg: 'bg-sky-50',
    },
    {
      icon: Clock,
      title: t('flight'),
      description: t('flightDesc'),
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: MapPin,
      title: t('landing'),
      description: t('landingDesc'),
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      icon: Wind,
      title: t('weather'),
      description: t('weatherDesc'),
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
    {
      icon: Award,
      title: t('safety'),
      description: t('safetyDesc'),
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
    {
      icon: Camera,
      title: t('views'),
      description: t('viewsDesc'),
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block bg-orange-100 text-orange-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t('badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">{t('title')}</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((r) => (
            <div key={r.title} className="flex gap-4 p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${r.bg} flex items-center justify-center`}>
                <r.icon className={`w-6 h-6 ${r.color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">{r.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{r.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
