'use client'

import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { useLocale } from 'next-intl'

interface BookingCTAProps {
  title?: string
  subtitle?: string
  variant?: 'orange' | 'dark' | 'light'
}

const COPY: Record<string, { title: string; subtitle: string; book: string; call: string }> = {
  en: { title: 'Ready to Book Your Flight?', subtitle: 'Tandem flights all year round — daily in season (April–October), weather permitting in winter — one fixed $150 all-inclusive price. Book online or contact us directly.', book: 'Book Online', call: 'Call Us' },
  tr: { title: 'Uçuşunuzu Ayırtmaya Hazır mısınız?', subtitle: 'Yıl boyu tandem uçuş — sezonda (Nisan–Ekim) her gün, kışın hava uygun olduğunda — sabit $150, her şey dahil. Online rezervasyon yapın ya da bize doğrudan ulaşın.', book: 'Online Rezervasyon', call: 'Bizi Arayın' },
  de: { title: 'Bereit, Ihren Flug zu buchen?', subtitle: 'Tandemflüge das ganze Jahr — täglich in der Saison (April–Oktober), im Winter wetterabhängig — Festpreis $150, alles inklusive. Online buchen oder direkt Kontakt aufnehmen.', book: 'Online buchen', call: 'Anrufen' },
  ru: { title: 'Готовы забронировать полёт?', subtitle: 'Тандемные полёты круглый год — ежедневно в сезон (апрель–октябрь), зимой по погоде — фиксированная цена $150, всё включено. Бронируйте онлайн или свяжитесь с нами напрямую.', book: 'Забронировать онлайн', call: 'Позвонить' },
  zh: { title: '准备好预订您的飞行了吗？', subtitle: '全年提供双人飞行——旺季（4 月–10 月）每天飞行，冬季视天气而定——150 美元全包一口价。在线预订或直接联系我们。', book: '在线预订', call: '致电我们' },
}

export default function BookingCTA({
  title,
  subtitle,
  variant = 'orange',
}: BookingCTAProps) {
  const locale = useLocale()
  const copy = COPY[locale] || COPY.en
  title = title ?? copy.title
  subtitle = subtitle ?? copy.subtitle
  const bookHref = locale === 'en' ? '/book-now' : `/${locale}/book-now`

  const bgClass = { orange: 'bg-orange-500', dark: 'bg-slate-900', light: 'bg-slate-50 border border-slate-200' }[variant]
  const textClass = { orange: 'text-white', dark: 'text-white', light: 'text-slate-900' }[variant]
  const subtitleClass = { orange: 'text-orange-100', dark: 'text-slate-400', light: 'text-slate-600' }[variant]

  return (
    <div className={`${bgClass} rounded-2xl p-8 text-center`}>
      <h3 className={`text-2xl font-bold ${textClass} mb-2`}>{title}</h3>
      <p className={`${subtitleClass} mb-6 text-sm`}>{subtitle}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href={bookHref} className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 font-bold px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors text-sm">
          {copy.book} <ArrowRight className="w-4 h-4" />
        </Link>
        <a href="tel:+905364616674" className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm">
          <Phone className="w-4 h-4" /> {copy.call}
        </a>
      </div>
    </div>
  )
}
