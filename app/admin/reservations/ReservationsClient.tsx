'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Trash2, MessageSquare, Phone, Mail, ChevronDown } from 'lucide-react'
import type { Reservation, ReservationStatus } from '@/lib/supabase'

const STATUS_COLORS: Record<ReservationStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-slate-100 text-slate-600',
}

const FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Completed', value: 'completed' },
]

export default function ReservationsClient({ reservations: initial }: { reservations: Reservation[] }) {
  const [reservations, setReservations] = useState(initial)
  const [filter, setFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const filtered = filter === 'all' ? reservations : reservations.filter(r => r.status === filter)

  async function updateStatus(id: string, status: ReservationStatus) {
    setLoading(id)
    await fetch('/api/admin/reservations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, notes: notes[id] }),
    })
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    setLoading(null)
    router.refresh()
  }

  async function saveNotes(id: string) {
    setLoading(id + '_notes')
    const res = reservations.find(r => r.id === id)
    await fetch('/api/admin/reservations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: res?.status, notes: notes[id] }),
    })
    setReservations(prev => prev.map(r => r.id === id ? { ...r, notes: notes[id] } : r))
    setLoading(null)
  }

  async function deleteReservation(id: string) {
    if (!confirm('Delete this reservation?')) return
    setLoading(id + '_delete')
    await fetch('/api/admin/reservations', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setReservations(prev => prev.filter(r => r.id !== id))
    setLoading(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Reservations</h1>
        <span className="text-sm text-slate-500">{filtered.length} total</span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-orange-500 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {f.label}
            <span className="ml-1.5 text-xs opacity-70">
              {f.value === 'all' ? reservations.length : reservations.filter(r => r.status === f.value).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          No reservations found
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {/* Main row */}
              <div className="px-5 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-bold text-slate-900">{r.name}</p>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${STATUS_COLORS[r.status]}`}>
                      {r.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                    <span>📅 {r.date}</span>
                    <span>🪂 {r.flight_type}</span>
                    <span>👥 {r.passengers} pax</span>
                    {r.weight_kg && <span>⚖️ {r.weight_kg}kg</span>}
                    <span className="text-xs text-slate-400">{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {r.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(r.id, 'confirmed')}
                        disabled={loading === r.id}
                        className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                        title="Confirm"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateStatus(r.id, 'cancelled')}
                        disabled={loading === r.id}
                        className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {r.status === 'confirmed' && (
                    <button
                      onClick={() => updateStatus(r.id, 'completed')}
                      disabled={loading === r.id}
                      className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium"
                    >
                      Mark done
                    </button>
                  )}
                  <button
                    onClick={() => deleteReservation(r.id)}
                    disabled={!!loading}
                    className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                    className="p-2 hover:bg-slate-100 text-slate-400 rounded-lg transition-colors"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedId === r.id ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Expanded detail */}
              {expandedId === r.id && (
                <div className="border-t border-slate-100 px-5 py-4 bg-slate-50 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <a href={`mailto:${r.email}`} className="hover:text-orange-500">{r.email}</a>
                    </div>
                    {r.phone && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <a href={`tel:${r.phone}`} className="hover:text-orange-500">{r.phone}</a>
                      </div>
                    )}
                  </div>

                  {r.message && (
                    <div className="bg-white rounded-xl p-4 text-sm text-slate-600 border border-slate-200">
                      <p className="font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" /> Customer message
                      </p>
                      {r.message}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Internal notes</label>
                    <textarea
                      rows={3}
                      defaultValue={r.notes || ''}
                      onChange={e => setNotes(prev => ({ ...prev, [r.id]: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                      placeholder="Add internal notes..."
                    />
                    <button
                      onClick={() => saveNotes(r.id)}
                      disabled={loading === r.id + '_notes'}
                      className="mt-2 text-sm px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {loading === r.id + '_notes' ? 'Saving...' : 'Save notes'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
