
'use client'
import { useLocale } from 'next-intl'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone, Mail, MessageCircle, CheckCircle, Clock, Shield, ArrowRight, AlertCircle, Camera, Sparkles } from 'lucide-react'

// One flight, one fixed price.
const PRICE = 150
function calcTotal(_flightType: string, guests: number) {
  return PRICE * guests
}

export default function BookingForm() {
  const locale = useLocale()
  const lp = (href: string) => locale === 'en' ? href : `/${locale}${href}`
  const [form, setForm] = useState({
    flight_type: 'standard',
    flight_date: '',
    guests: '1',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<{ whatsapp_url: string; total: number } | null>(null)
  const [error, setError] = useState('')

  // Mobile: land straight on the offer card when the visitor opens /book-now
  // (or follows a #reserve link). Also handles tapping "Book Now" again while
  // already on this page, where Next.js would otherwise do nothing.
  useEffect(() => {
    const toCard = (smooth: boolean) =>
      document.getElementById('reserve')?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
    const onBookPage = /\/book-now\/?$/.test(window.location.pathname)
    if (window.location.hash === '#reserve' || (onBookPage && window.innerWidth < 1024)) {
      const t = setTimeout(() => toCard(false), 50)
      return () => clearTimeout(t)
    }
  }, [])
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const a = (e.target as HTMLElement | null)?.closest?.('a') as HTMLAnchorElement | null
      if (!a) return
      const url = new URL(a.href, window.location.href)
      if (url.origin === window.location.origin && url.pathname === window.location.pathname && /\/book-now\/?$/.test(url.pathname)) {
        e.preventDefault()
        document.getElementById('reserve')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const set = (field: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const totalPrice = form.flight_type
    ? calcTotal(form.flight_type, parseInt(form.guests))
    : 0

  const guestCount = parseInt(form.guests)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.flight_date) return setError('Please select your preferred date.')
    if (!form.first_name || !form.last_name) return setError('Please enter your full name.')
    if (!form.email) return setError('Please enter your email address.')

    setLoading(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      setSuccess({ whatsapp_url: data.whatsapp_url, total: data.total_price })

      // Analytics: booking conversion tracking (was missing on this page —
      // only the unused legacy /book-now copy had it)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'conversion', { send_to: 'AW-1048206545/h7tlCJzqnZMdENG56fMD', value: Number(data.total_price) || 150, currency: 'USD', transaction_id: String(data.id || data.booking_id || '') || undefined })
        ;(window as any).gtag('event', 'generate_lead', {
          currency: 'USD',
          value: data.total_price,
          flight_type: form.flight_type,
          guests: guestCount,
        })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit booking. Please try WhatsApp or email.')
    } finally {
      setLoading(false)
    }
  }

  // Success screen
  if (success) {
    return (
      <section className="section-padding bg-white">
        <div className="container-default max-w-2xl text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Booking Request Sent!</h2>
          <p className="text-slate-600 mb-2">
            We&apos;ve received your request and will confirm within 2 hours.
          </p>
          <p className="text-slate-500 text-sm mb-8">Check your email for a copy of your request.</p>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
            <p className="text-green-800 font-semibold mb-1">Total Price (all-inclusive)</p>
            <p className="text-4xl font-bold text-green-700 mb-3">${success.total}</p>
            <p className="text-green-700 text-sm">No payment required now — pay on the day.</p>
          </div>

          <p className="text-slate-600 mb-4">
            For instant confirmation, send us your booking details on WhatsApp:
          </p>
          <a
            href={success.whatsapp_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full justify-center text-base py-4 mb-4"
          >
            <MessageCircle className="w-5 h-5" />
            Confirm via WhatsApp
          </a>
          <Link href={lp("/")} className="text-sm text-slate-500 hover:text-slate-700">
            ← Back to home
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-default">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Form */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Reserve Your Flight</h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Flight: single product — eye-catching offer card */}
              <div id="reserve" className="scroll-mt-28 relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-500 to-pink-600 p-5 sm:p-6 text-white shadow-xl shadow-orange-500/30">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-yellow-300/30 blur-2xl" />
                <div className="pointer-events-none absolute -left-8 -bottom-12 h-36 w-36 rounded-full bg-sky-400/30 blur-2xl" />

                <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    {/* Banner-style badge: navy brush stroke, yellow FREE */}
                    <div className="relative inline-block -rotate-3 mt-1 ml-3">
                      <span className="absolute -left-4 top-1 h-1 w-3 rotate-[20deg] rounded-full bg-yellow-300" />
                      <span className="absolute -left-4 top-4 h-1 w-3 rounded-full bg-yellow-300" />
                      <span className="absolute -left-4 top-7 h-1 w-3 -rotate-[20deg] rounded-full bg-yellow-300" />
                      <span className="absolute -right-4 top-1 h-1 w-3 -rotate-[20deg] rounded-full bg-yellow-300" />
                      <span className="absolute -right-4 bottom-2 h-1 w-3 rotate-[20deg] rounded-full bg-yellow-300" />
                      <div
                        className="flex items-center gap-2.5 bg-[#0b1d4a] px-5 py-2.5 shadow-xl"
                        style={{ clipPath: 'polygon(2% 8%, 12% 0%, 35% 5%, 60% 0%, 88% 4%, 100% 0%, 97% 30%, 100% 62%, 96% 100%, 70% 95%, 42% 100%, 15% 94%, 0% 100%, 3% 66%, 0% 35%)' }}
                      >
                        <Camera className="w-8 h-8 sm:w-9 sm:h-9 text-white" strokeWidth={2.5} />
                        <div className="leading-none italic">
                          <p className="text-3xl sm:text-4xl font-black text-yellow-300 tracking-tight">FREE</p>
                          <p className="text-base sm:text-lg font-black text-white tracking-tight">VIDEO &amp; PHOTO</p>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-xl sm:text-2xl font-extrabold leading-tight">Tandem Paragliding Flight from Babadağ</p>
                    <p className="mt-1 text-sm text-white/90">Fly over the Blue Lagoon · 25–30 min with a licensed pilot</p>
                    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold">
                      <li className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-yellow-300" /> HD video &amp; photos</li>
                      <li className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-yellow-300" /> Hotel pickup</li>
                      <li className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-yellow-300" /> Mountain fee</li>
                    </ul>
                  </div>

                  <div className="shrink-0 rounded-2xl bg-white px-5 py-3 text-center shadow-lg">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">All inclusive</p>
                    <p className="text-4xl font-black text-orange-500 leading-none">${PRICE}</p>
                    <p className="text-xs font-medium text-slate-500">per person</p>
                  </div>
                </div>

                <p className="relative mt-4 flex items-center gap-2 text-sm font-bold">
                  <Sparkles className="w-4 h-4 text-yellow-300" /> No payment now: book in 1 minute, pay on flight day
                </p>
              </div>

              {/* Date + Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Preferred Date *</label>
                  <input
                    type="date"
                    value={form.flight_date}
                    onChange={e => set('flight_date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Guests *</label>
                  <select
                    value={form.guests}
                    onChange={e => set('guests', e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                  >
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'guest' : 'guests'}
                      </option>
                    ))}
                    <option value="9">9+ guests (contact us)</option>
                  </select>
                </div>
              </div>

              {/* Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    value={form.first_name}
                    onChange={e => set('first_name', e.target.value)}
                    placeholder="Your first name"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={form.last_name}
                    onChange={e => set('last_name', e.target.value)}
                    placeholder="Your last name"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder="your@email.com"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    placeholder="+1 234 567 8900"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              {/* What's included */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-green-800 mb-2">One fixed price — everything included, no add-ons, no discounts</p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>&#10003; Professional photo &amp; video package</li>
                  <li>&#10003; Mountain entrance fee</li>
                  <li>&#10003; Transfer to and from the mountain</li>
                  <li>&#10003; All equipment &amp; licensed pilot</li>
                </ul>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Special Notes</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  placeholder="Any medical conditions, special requests, or questions..."
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              {/* Price summary */}
              {totalPrice > 0 && (
                <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Total (all-inclusive)</p>
                    <p className="text-xs text-slate-500">$150 per person — no discounts, nothing extra</p>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">${totalPrice}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>Sending request...</span>
                ) : (
                  <>Book Now <ArrowRight className="w-5 h-5" /></>
                )}
              </button>

              <p className="text-xs text-slate-500 text-center">
                We&apos;ll confirm your booking within 2 hours by email or WhatsApp. No payment required upfront.
              </p>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-2xl p-6">
              <h3 className="font-bold text-slate-900 mb-4">Why Book With Us?</h3>
              <ul className="space-y-3">
                {[
                  { icon: CheckCircle, text: 'Free cancellation up to 24h before', color: 'text-green-500' },
                  { icon: Shield, text: 'Fully certified & insured pilots', color: 'text-sky-500' },
                  { icon: Clock, text: 'Confirmation within 2 hours', color: 'text-purple-500' },
                  { icon: CheckCircle, text: 'No upfront payment required', color: 'text-green-500' },
                ].map(item => {
                  const Icon = item.icon
                  return (
                    <li key={item.text} className="flex items-start gap-2 text-sm text-slate-700">
                      <Icon className={`w-4 h-4 ${item.color} flex-shrink-0 mt-0.5`} />
                      {item.text}
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="card p-6">
              <h3 className="font-bold text-slate-900 mb-4">Prefer to Contact Us Directly?</h3>
              <div className="space-y-3">
                <a href="https://wa.me/905364616674" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-800 text-sm">WhatsApp</p>
                    <p className="text-green-600 text-xs">+90 536 461 6674</p>
                  </div>
                </a>
                <a href="tel:+905364616674"
                  className="flex items-center gap-3 p-3 bg-sky-50 rounded-xl hover:bg-sky-100 transition-colors">
                  <Phone className="w-5 h-5 text-sky-600" />
                  <div>
                    <p className="font-semibold text-sky-800 text-sm">Phone Call</p>
                    <p className="text-sky-600 text-xs">+90 536 461 6674</p>
                  </div>
                </a>
                <a href="mailto:atmosparagliding@gmail.com"
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <Mail className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Email</p>
                    <p className="text-slate-600 text-xs">atmosparagliding@gmail.com</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-bold text-slate-900 mb-4">Quick Price Guide</h3>
              <div className="space-y-2 text-sm">
                {[
                  { name: 'Tandem flight, all-inclusive', price: '$150' },
                ].map(p => (
                  <div key={p.name} className="flex justify-between text-slate-700">
                    <span>{p.name}</span>
                    <span className="font-bold text-orange-500">{p.price}</span>
                  </div>
                ))}
              </div>
              <Link href={lp("/prices")} className="text-sm text-sky-600 hover:text-sky-700 mt-3 inline-block">
                Full price list →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
