'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useLocale } from 'next-intl'

export default function PromoBanner({ page }: { page: 'home' | 'booking' }) {
  const locale = useLocale()
  const bookHref = locale === 'en' ? '/book-now' : `/${locale}/book-now`
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  const dismiss = () => setVisible(false)

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onClick={dismiss}>
      <div
        className="relative w-[320px] sm:w-[650px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
          <Link
            href={bookHref}
            aria-label="Book your paragliding flight — $150 all-inclusive"
          >
            <Image
              src="/images/promo-banner.jpg"
              alt="$150 all-inclusive paragliding flight in Ölüdeniz — free video & photo included"
              width={1671}
              height={941}
              className="w-full h-auto block"
              priority={false}
              sizes="650px"
            />
          </Link>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close"
            className="absolute -top-2.5 -right-2.5 w-7 h-7 flex items-center justify-center rounded-full bg-slate-900 hover:bg-black text-white shadow-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
