'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Phone, Mail, MessageCircle, CheckCircle, Clock, Shield, ArrowRight, AlertCircle } from 'lucide-react'

const FLIGHT_OPTIONS = [
  { value: 'standard', label: 'Standard Tandem — 1200m', price: 150, duration: '25–35 min' },
  { value: 'high', label: 'High Altitude — 1700m', price: 150, duration: '35–50 min' },
  { value: 'sunset', label: 'Sunset Flight — 1200m', price: 150, duration: '20–30 min' },
]

const ADDONS = [
  { id: 'addon_bundle', label: 'Photo & Video Package', price: 35, highlight: true },
]

function calcTotal(flightType: string, guests: number, addons: Record<string, boolean>) {
  const flight = FLIGHT_OPTIONS.find(f => f.value === flightType)
  if (!flight) return 0

  let base = flight.price * guests
  if (guests >= 8) base = Math.round(base * 0.85)
  else if (guests >= 4) base = Math.round(base * 0.90)

  const addon = addons.addon_bundle ? 35 : 0

  return base + addon
}

export default function BookingForm() {
  const [form, setForm] = useState({
    flight_type: '',
    flight_date: '',
    guests: '1',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    notes: '',
    addon_photo: false,
    addon_video: false,
    addon_bundle: false,
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<{ whatsapp_url: string; total: number } | null>(null)
  const [error, setError] = useState('')

  const set = (field: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const totalPrice = form.flight_type
    ? calcTotal(form.flight_type, parseInt(form.guests), {
        addon_photo: form.addon_photo,
        addon_video: form.addon_video,
        addon_bundle: form.addon_bundle,
      })
    : 0

  const guestCount = parseInt(form.guests)
  const hasGroupDiscount = guestCount >= 4

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.flight_type) return setError('Please select a flight type.')
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
      // Google Ads conversion tracking
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'conversion', { send_to: 'AW-1048206545/cXNxCN20udQBENG56fMD' })
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
            <p className="text-green-800 font-semibold mb-1">Total Price</p>
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
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">
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

              {/* Flight Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Flight Type *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {FLIGHT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => set('flight_type', opt.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        form.flight_type === opt.value
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <p className="font-semibold text-slate-900 text-sm">{opt.label}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{opt.duration}</p>
                      <p className="text-orange-500 font-bold mt-1">${opt.price} / person</p>
                    </button>
                  ))}
                </div>
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
                        {n >= 4 ? ' (group discount)' : ''}
                      </option>
                    ))}
                    <option value="9">9+ guests (contact us)</option>
                  </select>
                  {hasGroupDiscount && (
                    <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {guestCount >= 8 ? '15%' : '10%'} group discount applied
                    </p>
                  )}
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

              {/* Add-ons */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Add-ons</label>
                <div className="space-y-2">
                  {ADDONS.map(addon => (
                    <label
                      key={addon.id}
                      className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                        form[addon.id as keyof typeof form]
                          ? 'border-orange-400 bg-orange-50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!!form[addon.id as keyof typeof form]}
                        onChange={e => set(addon.id, e.target.checked)}
                        className="w-4 h-4 accent-orange-500"
                      />
                      <span className="text-slate-700 text-sm flex-1">
                        {addon.label}
                        {addon.highlight && (
                          <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Best value</span>
                        )}
                      </span>
                      <span className="text-green-600 font-semibold text-sm">{addon.price > 0 ? `+$${addon.price}` : 'Free'}</span>
                    </label>
                  ))}
                </div>
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
                    <p className="text-sm text-slate-600">Estimated total</p>
                    {hasGroupDiscount && (
                      <p className="text-xs text-green-600">Group discount included</p>
                    )}
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
                  <>Send Booking Request <ArrowRight className="w-5 h-5" /></>
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
                <a href="mailto:info@paragliding-oludeniz.com"
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <Mail className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Email</p>
                    <p className="text-slate-600 text-xs">info@paragliding-oludeniz.com</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-bold text-slate-900 mb-4">Quick Price Guide</h3>
              <div className="space-y-2 text-sm">
                {[
                  { name: 'Standard (1200m)', price: '$150' },
                  { name: 'High Altitude (1700m)', price: '$150' },
                  { name: 'Sunset Flight', price: '$150' },
                ].map(p => (
                  <div key={p.name} className="flex justify-between text-slate-700">
                    <span>{p.name}</span>
                    <span className="font-bold text-orange-500">{p.price}</span>
                  </div>
                ))}
              </div>
              <Link href="/prices" className="text-sm text-sky-600 hover:text-sky-700 mt-3 inline-block">
                Full price list →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
