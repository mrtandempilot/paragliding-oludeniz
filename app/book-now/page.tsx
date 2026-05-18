import type { Metadata } from 'next'
import Link from 'next/link'
import { Phone, Mail, MessageCircle, CheckCircle, Clock, Shield } from 'lucide-react'
import PageHero from '@/components/shared/PageHero'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'

export const metadata: Metadata = {
  title: 'Book Paragliding Ölüdeniz | Reserve Your Tandem Flight',
  description:
    'Book your tandem paragliding flight in Ölüdeniz online. Instant confirmation. Free cancellation. Flights daily April to October from Babadağ Mountain.',
  alternates: { canonical: 'https://paragliding-oludeniz.com/book-now' },
}

export default function BookNowPage() {
  return (
    <>
      <PageHero
        title="Book Your Paragliding Flight"
        subtitle="Reserve your spot in minutes. Free cancellation up to 24 hours before your flight."
        badge="Book Online"
        size="sm"
      />

      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container-default py-3">
          <BreadcrumbNav items={[{ label: 'Book Now' }]} />
        </div>
      </div>

      <section className="section-padding bg-white">
        <div className="container-default">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Booking Form — Left */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Reserve Your Flight</h2>

              <form className="space-y-5">
                {/* Flight Type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Flight Type *
                  </label>
                  <select className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                    <option value="">Select flight type...</option>
                    <option value="standard">Standard Tandem — 1200m — €80</option>
                    <option value="high">High Altitude — 1700m — €100</option>
                    <option value="sunset">Sunset Flight — 1200m — €110</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Number of Guests *
                  </label>
                  <select className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}{n >= 4 ? ' (group discount applies)' : ''}</option>
                    ))}
                    <option value="9+">9+ guests (please contact us)</option>
                  </select>
                </div>

                {/* Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">First Name *</label>
                    <input type="text" placeholder="Your first name" className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name *</label>
                    <input type="text" placeholder="Your last name" className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                    <input type="email" placeholder="your@email.com" className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone / WhatsApp</label>
                    <input type="tel" placeholder="+1 234 567 8900" className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                </div>

                {/* Add-ons */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Add-ons</label>
                  <div className="space-y-2">
                    {[
                      { id: 'photo', label: 'Professional Photo Package', price: '+€25' },
                      { id: 'video', label: 'Professional Video Package', price: '+€30' },
                      { id: 'both', label: 'Photo + Video Bundle', price: '+€45' },
                    ].map((addon) => (
                      <label key={addon.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 accent-orange-500" />
                        <span className="text-slate-700 text-sm flex-1">{addon.label}</span>
                        <span className="text-orange-500 font-semibold text-sm">{addon.price}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Special Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Any medical conditions, special requests, or questions for us..."
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full justify-center text-base py-4"
                >
                  Send Booking Request
                </button>

                <p className="text-xs text-slate-500 text-center">
                  We&apos;ll confirm your booking within 2 hours by email or WhatsApp. No payment required upfront.
                </p>
              </form>
            </div>

            {/* Sidebar — Right */}
            <div className="space-y-6">
              {/* Trust */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="font-bold text-slate-900 mb-4">Why Book With Us?</h3>
                <ul className="space-y-3">
                  {[
                    { icon: CheckCircle, text: 'Free cancellation up to 24h before', color: 'text-green-500' },
                    { icon: Shield, text: 'Fully certified & insured pilots', color: 'text-sky-500' },
                    { icon: Clock, text: 'Confirmation within 2 hours', color: 'text-purple-500' },
                    { icon: CheckCircle, text: 'No upfront payment required', color: 'text-green-500' },
                  ].map((item) => {
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

              {/* Contact Options */}
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

              {/* Price Summary */}
              <div className="card p-6">
                <h3 className="font-bold text-slate-900 mb-4">Quick Price Guide</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { name: 'Standard (1200m)', price: '€80' },
                    { name: 'High Altitude (1700m)', price: '€100' },
                    { name: 'Sunset Flight', price: '€110' },
                  ].map((p) => (
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
    </>
  )
}
