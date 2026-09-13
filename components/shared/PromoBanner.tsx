'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useLocale } from 'next-intl'

const STORAGE_KEY = 'promoBannerDismissed_v1'

export default function PromoBanner() {
  const locale = useLocale()
  const bookHref = locale === 'en' ? '/book-now' : `/${locale}/book-now`
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== '1') {
        setVisible(true)
      }
    } catch {
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  const dismiss = () => {
    setVisible(false)
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {}
  }

  return (
    <div className="relative max-w-5xl mx-auto px-4 pt-4">
      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200">
        <Link href={bookHref} aria-label="Book your paragliding flight — $150 all-inclusive">
          <Image
            src="/images/promo-banner.jpg"
            alt="$150 all-inclusive paragliding flight in Ölüdeniz — free video & photo included"
            width={1671}
            height={941}
            className="w-full h-auto"
            priority={false}
            sizes="(max-width: 768px) 100vw, 1024px"
          />
        </Link>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
