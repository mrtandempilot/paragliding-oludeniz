'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, Clock, XCircle, RefreshCw, Phone, Mail, MessageCircle, Ticket } from 'lucide-react'
import TicketModal from './TicketModal'

interface Booking {
  id: string
  created_at: string
  first_name: string
  last_name: string
  email: string
  phone: string
  flight_type: string
  flight_date: string
  guests: number
  addon_photo: boolean
  addon_video: boolean
  addon_bundle: boolean
  base_price: number
  addon_price: number
  total_price: number
  notes: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  admin_notes: string
}

const FLIGHT_LABELS: Record<string, string> = {
  standard: 'Standard (1200m)',
  high: 'High Altitude (1700m)',
  sunset: 'Sunset Flight',
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-slate-100 text-slate-700',
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [updating, setUpdating] = useState<string | null>(null)
  const [ticketBooking, setTicketBooking] = useState<Booking | null>(null)

  async function load() {
    setLoading(true)
    const url = filter === 'all' ? '/api/bookings' : `/api/bookings?status=${filter}`
    const res = await fetch(url)
    const data = await res.json()
    setBookings(data.bookings || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [filter])

  async function updateStatus(id: string, status: string) {
    setUpdating(id)
    await fetch('/api/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    await load()
    setUpdating(null)
  }

  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reservations</h1>
          <p className="text-slate-500 text-sm mt-1">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg px-3 py-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'all', label: 'All' },
          { key: 'pending', label: 'Pending' },
          { key: 'confirmed', label: 'Confirmed' },
          { key: 'cancelled', label: 'Cancelled' },
          { key: 'completed', label: 'Completed' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-orange-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
            {tab.key === 'pending' && counts.pending > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5">{counts.pending}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 text-slate-400">No bookings found.</div>
      ) : (
        <div className="space-y-4">
          {bookings.map(b => {
            const addons = []
            if (b.addon_bundle) addons.push('Photo + Video Bundle')
            else {
              if (b.addon_photo) addons.push('Photo Package')
              if (b.addon_video) addons.push('Video Package')
            }

            const waMsg = encodeURIComponent(
              `Hi ${b.first_name}! Your paragliding booking for ${new Date(b.flight_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })} is confirmed. See you then! — Atmos Paragliding`
            )

            return (
              <div key={b.id} className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-slate-900 text-lg">
                        {b.first_name} {b.last_name}
                      </h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[b.status]}`}>
                        {b.status}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm">
                      {new Date(b.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">${b.total_price}</p>
                    <p className="text-xs text-slate-500">{b.guests} guest{b.guests !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-slate-500 text-xs mb-1">Flight</p>
                    <p className="font-semibold text-slate-900">{FLIGHT_LABELS[b.flight_type] || b.flight_type}</p>
                    {addons.length > 0 && (
                      <p className="text-slate-500 text-xs mt-1">{addons.join(' · ')}</p>
                    )}
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-slate-500 text-xs mb-1">Date</p>
                    <p className="font-semibold text-slate-900">
                      {new Date(b.flight_date).toLocaleDateString('en-GB', {
                        weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-slate-500 text-xs mb-1">Contact</p>
                    <p className="font-semibold text-slate-900 truncate">{b.email}</p>
                    {b.phone && <p className="text-slate-500 text-xs mt-0.5">{b.phone}</p>}
                  </div>
                </div>

                {b.notes && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800">
                    <span className="font-semibold">Note: </span>{b.notes}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {b.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(b.id, 'confirmed')}
                      disabled={updating === b.id}
                      className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" /> Confirm
                    </button>
                  )}
                  {b.status === 'confirmed' && (
                    <button
                      onClick={() => updateStatus(b.id, 'completed')}
                      disabled={updating === b.id}
                      className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" /> Mark Completed
                    </button>
                  )}
                  {b.status !== 'cancelled' && b.status !== 'completed' && (
                    <button
                      onClick={() => updateStatus(b.id, 'cancelled')}
                      disabled={updating === b.id}
                      className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" /> Cancel
                    </button>
                  )}

                  <div className="flex gap-2 ml-auto">
                    <button
                      onClick={() => setTicketBooking(b)}
                      className="flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 text-sm px-3 py-2 rounded-lg transition-colors"
                    >
                      <Ticket className="w-4 h-4" /> Bilet Bas
                    </button>
                    {b.phone && (
                      <a
                        href={`https://wa.me/${b.phone.replace(/\D/g, '')}?text=${waMsg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-sm px-3 py-2 rounded-lg transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                      </a>
                    )}
                    <a
                      href={`mailto:${b.email}`}
                      className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm px-3 py-2 rounded-lg transition-colors"
                    >
                      <Mail className="w-4 h-4" /> Email
                    </a>
                    {b.phone && (
                      <a
                        href={`tel:${b.phone}`}
                        className="flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 text-sm px-3 py-2 rounded-lg transition-colors"
                      >
                        <Phone className="w-4 h-4" /> Call
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {ticketBooking && (
        <TicketModal booking={ticketBooking} onClose={() => setTicketBooking(null)} />
      )}
    </div>
  )
}
