import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'

interface BookingCTAProps {
  title?: string
  subtitle?: string
  variant?: 'orange' | 'dark' | 'light'
}

export default function BookingCTA({
  title = 'Ready to Book Your Flight?',
  subtitle = 'Tandem flights available daily April – October. Book online or contact us directly.',
  variant = 'orange',
}: BookingCTAProps) {
  const bgClass = {
    orange: 'bg-orange-500',
    dark: 'bg-slate-900',
    light: 'bg-slate-50 border border-slate-200',
  }[variant]

  const textClass = {
    orange: 'text-white',
    dark: 'text-white',
    light: 'text-slate-900',
  }[variant]

  const subtitleClass = {
    orange: 'text-orange-100',
    dark: 'text-slate-400',
    light: 'text-slate-600',
  }[variant]

  return (
    <div className={`${bgClass} rounded-2xl p-8 text-center`}>
      <h3 className={`text-2xl font-bold ${textClass} mb-2`}>{title}</h3>
      <p className={`${subtitleClass} mb-6 text-sm`}>{subtitle}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/book-now"
          className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 font-bold px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors text-sm"
        >
          Book Online
          <ArrowRight className="w-4 h-4" />
        </Link>
        <a
          href="tel:+905364616674"
          className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm"
        >
          <Phone className="w-4 h-4" />
          Call Us
        </a>
      </div>
    </div>
  )
}
