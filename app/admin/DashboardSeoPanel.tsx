'use client'

import { useEffect, useState } from 'react'
import { Search, TrendingUp, CalendarCheck, Clock, AlertTriangle, Loader2 } from 'lucide-react'

interface ReservationStats {
  today: number
  thisWeek: number
  thisMonth: number
  pending: number
}

interface GscStats {
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export default function DashboardSeoPanel({ reservations }: { reservations: ReservationStats }) {
  const [gsc7d, setGsc7d] = useState<GscStats | null>(null)
  const [gsc28d, setGsc28d] = useState<GscStats | null>(null)
  const [gscError, setGscError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/seo-stats', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setGscError(data.error)
        } else {
          setGsc7d(data.gsc7d)
          setGsc28d(data.gsc28d)
          setGscError(data.gscError || null)
        }
      })
      .catch(err => setGscError(err.message || 'Yüklenemedi'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 px-5 py-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">Google & Rezervasyon</h3>
            <p className="text-white/80 text-xs">Search Console + canlı rezervasyonlar</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Reservations */}
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">
            <CalendarCheck className="w-3.5 h-3.5" />
            Rezervasyonlar
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-slate-50 rounded-xl py-2.5">
              <div className="text-xl font-bold text-slate-900">{reservations.today}</div>
              <div className="text-[11px] text-slate-500">Bugün</div>
            </div>
            <div className="bg-slate-50 rounded-xl py-2.5">
              <div className="text-xl font-bold text-slate-900">{reservations.thisWeek}</div>
              <div className="text-[11px] text-slate-500">Bu hafta</div>
            </div>
            <div className="bg-slate-50 rounded-xl py-2.5">
              <div className="text-xl font-bold text-slate-900">{reservations.thisMonth}</div>
              <div className="text-[11px] text-slate-500">Bu ay</div>
            </div>
            <div className="bg-amber-50 rounded-xl py-2.5">
              <div className="text-xl font-bold text-amber-700">{reservations.pending}</div>
              <div className="text-[11px] text-amber-600">Bekleyen</div>
            </div>
          </div>
        </div>

        {/* GSC */}
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            Google Arama (son 7 gün)
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-slate-400 text-sm py-4">
              <Loader2 className="w-4 h-4 animate-spin" /> Yükleniyor…
            </div>
          ) : gsc7d ? (
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-blue-50 rounded-xl py-2.5">
                <div className="text-xl font-bold text-blue-700">{gsc7d.impressions.toLocaleString('tr-TR')}</div>
                <div className="text-[11px] text-blue-600">Gösterim</div>
              </div>
              <div className="bg-blue-50 rounded-xl py-2.5">
                <div className="text-xl font-bold text-blue-700">{gsc7d.clicks.toLocaleString('tr-TR')}</div>
                <div className="text-[11px] text-blue-600">Tıklama</div>
              </div>
              <div className="bg-slate-50 rounded-xl py-2.5">
                <div className="text-xl font-bold text-slate-900">{(gsc7d.ctr * 100).toFixed(1)}%</div>
                <div className="text-[11px] text-slate-500">CTR</div>
              </div>
              <div className="bg-slate-50 rounded-xl py-2.5">
                <div className="text-xl font-bold text-slate-900">{gsc7d.position.toFixed(1)}</div>
                <div className="text-[11px] text-slate-500">Ort. sıra</div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 bg-red-50 text-red-700 text-xs rounded-xl p-3">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Search Console verisi alınamadı{gscError ? `: ${gscError}` : '.'}</span>
            </div>
          )}

          {gsc28d && (
            <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Son 28 gün: {gsc28d.impressions.toLocaleString('tr-TR')} gösterim, {gsc28d.clicks.toLocaleString('tr-TR')} tıklama
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
