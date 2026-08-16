'use client'

import { Link } from '@/i18n/navigation'
import { ArrowRight, Star, Shield, Clock } from 'lucide-react'
import { useTranslations } from 'next-intl'

// Unsplash's own CDN (imgix-backed) serves pre-sized, pre-compressed WebP directly to the
// browser — this skips the extra Vercel image-optimizer round trip (fetch-from-origin +
// re-encode) that was dominating LCP (~7.2s). q=65 + fm=webp keeps quality visually identical
// while cutting payload well below the ~80KB the optimizer was serving.
const HERO_PHOTO_ID = 'photo-1544551763-46a013bb70d5'
function heroSrc(w: number) {
  return `https://images.unsplash.com/${HERO_PHOTO_ID}?w=${w}&q=65&fit=crop&auto=format&fm=webp`
}
const HERO_SRCSET = [480, 640, 828, 1080, 1920]
  .map((w) => `${heroSrc(w)} ${w}w`)
  .join(', ')

export default function Hero() {
  const t = useTranslations('hero')

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element -- deliberately bypassing next/image's
          server-side optimizer for the LCP hero image; see comment above */}
      <img
        src={heroSrc(1920)}
        srcSet={HERO_SRCSET}
        sizes="100vw"
        alt={t('heroAlt')}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-hero" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-2 mb-8">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-white text-sm font-medium">{t('badge')}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight text-balance">
          {t('title1')}{' '}
          <span className="text-orange-400">{t('titleHighlight')}</span>
          <br />
          {t('title2')}
        </h1>

        <p className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">
          {t('description')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
          <Link href="/book-now" className="btn-primary text-base px-8 py-4">
            {t('bookFlight')}
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/tandem-paragliding" className="btn-outline-white text-base px-8 py-4">
            {t('learnMore')}
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
          <div className="flex items-center gap-2 text-white/80">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium">{t('trust1')}</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium">{t('trust2')}</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Clock className="w-5 h-5 text-sky-400" />
            <span className="text-sm font-medium">{t('trust3')}</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center pt-2">
          <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}
