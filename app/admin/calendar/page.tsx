'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, X, Phone, Mail, MessageCircle, CalendarCheck } from 'lucide-react'

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
  total_price: number
  notes: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
}

const FLIGHT_LABELS: Record<string, string> = {
  standard: 'Standard (2000m)',
  high: 'Yüksek İrtifa (2000m)',
  sunset: 'Gün Batımı Uçuşu (2000m)',
}

const STATUS_DOT: Record<string, string> = {
  pending: 'bg-amber-500',
  confirmed: 'bg-green-500',
  cancelled: 'bg-red-400',
  completed: 'bg-slate-400',
}

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-slate-100 text-slate-700',
}

const STATUS_LABEL_TR: Record<string, string> = {
  pending: 'Bekliyor',
  confirmed: 'Onaylı',
  cancelled: 'İptal',
  completed: 'Tamamlandı',
}

const DAY_NAMES = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
const MONTH_NAMES = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function CalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [cursor, setCursor] = useState(() => {
    const n = new Date()
    return new Date(n.getFullYear(), n.getMonth(), 1)
  })
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [hideCancelled, setHideCancelled] = useState(false)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/bookings?limit=500')
    const data = await res.json()
    setBookings(data.bookings || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const byDay = useMemo(() => {
    const map: Record<string, Booking[]> = {}
    for (const b of bookings) {
      if (!b.flight_date) continue
      if (hideCancelled && b.status === 'cancelled') continue
      const key = b.flight_date.slice(0, 10)
      if (!map[key]) map[key] = []
      map[key].push(b)
    }
    return map
  }, [bookings, hideCancelled])

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  const startOffset = (firstOfMonth.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayKey = ymd(new Date())

  const cells: (Date | null)[] = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

  const activeCount = bookings.filter(b => b.status !== 'cancelled').length
  const selectedBookings = selectedDay ? (byDay[selectedDay] || []) : []

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-orange-500" /> Rezervasyon Takvimi
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {loading ? 'Yükleniyor...' : `${activeCount} aktif rezervasyon`}
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={hideCancelled} onChange={e => setHideCancelled(e.target.checked)} />
          İptalleri gizle
        </label>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCursor(new Date(year, month - 1, 1))} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h2 className="text-lg font-bold text-slate-900">{MONTH_NAMES[month]} {year}</h2>
        <button onClick={() => setCursor(new Date(year, month + 1, 1))} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-4 text-xs text-slate-500">
        {Object.entries(STATUS_LABEL_TR).map(([k, label]) => (
          <span key={k} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${STATUS_DOT[k]}`} /> {label}
          </span>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
          {DAY_NAMES.map(d => (
            <div key={d} className="p-2 text-center text-xs font-semibold text-slate-500">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((date, i) => {
            if (!date) return <div key={i} className="min-h-[100px] border-b border-r border-slate-100 bg-slate-50/50" />
            const key = ymd(date)
            const dayBookings = byDay[key] || []
            const isToday = key === todayKey
            return (
              <button
                key={i}
                onClick={() => dayBookings.length > 0 && setSelectedDay(key)}
                className={`min-h-[100px] border-b border-r border-slate-100 p-1.5 text-left align-top flex flex-col gap-1 hover:bg-slate-50 transition-colors ${dayBookings.length === 0 ? 'cursor-default' : ''}`}
              >
                <span className={`text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full ${isToday ? 'bg-orange-500 text-white' : 'text-slate-500'}`}>
                  {date.getDate()}
                </span>
                <div className="flex flex-col gap-0.5">
                  {dayBookings.slice(0, 3).map(b => (
                    <span key={b.id} className={`text-[10px] leading-tight px-1.5 py-0.5 rounded truncate ${STATUS_BADGE[b.status]}`}>
                      {b.first_name} {b.last_name} · {b.guests}k
                    </span>
                  ))}
                  {dayBookings.length > 3 && (
                    <span className="text-[10px] text-slate-400">+{dayBookings.length - 3} daha</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {selectedDay && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setSelectedDay(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {new Date(selectedDay).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </h3>
              <button onClick={() => setSelectedDay(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {selectedBookings.map(b => (
                <div key={b.id} className="border border-slate-200 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-900">{b.first_name} {b.last_name}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_BADGE[b.status]}`}>{STATUS_LABEL_TR[b.status]}</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-2">
                    {FLIGHT_LABELS[b.flight_type] || b.flight_type} · {b.guests} misafir · ${b.total_price}
                  </p>
                  {b.notes && <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2 mb-2">{b.notes}</p>}
                  <div className="flex gap-2">
                    {b.phone && (
                      <a href={`https://wa.me/${b.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg">
                        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                    )}
                    <a href={`mailto:${b.email}`} className="flex items-center gap-1 text-xs bg-slate-50 text-slate-700 px-2 py-1 rounded-lg">
                      <Mail className="w-3.5 h-3.5" /> Email
                    </a>
                    {b.phone && (
                      <a href={`tel:${b.phone}`} className="flex items-center gap-1 text-xs bg-sky-50 text-sky-700 px-2 py-1 rounded-lg">
                        <Phone className="w-3.5 h-3.5" /> Ara
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
