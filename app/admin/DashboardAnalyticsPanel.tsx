"use client"

import { useEffect, useState } from "react"
import { BarChart3, Users, UserPlus, MousePointerClick, TrendingUp, Eye, AlertTriangle, Loader2 } from "lucide-react"

interface Overview {
  activeUsers: number
  newUsers: number
  sessions: number
  engagementRate: number
  screenPageViews: number
}

interface Channel {
  channel: string
  sessions: number
}

const CHANNEL_COLORS: Record<string, string> = {
  "Direct": "bg-slate-400",
  "Organic Search": "bg-green-500",
  "Organic Social": "bg-pink-500",
  "Referral": "bg-blue-500",
  "AI Assistant": "bg-purple-500",
  "Paid Search": "bg-amber-500",
  "Email": "bg-teal-500",
  "Unassigned": "bg-slate-300",
}

export default function DashboardAnalyticsPanel() {
  const [overview, setOverview] = useState<Overview | null>(null)
  const [channels, setChannels] = useState<Channel[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch("/api/admin/seo-data?type=ga4-overview", { credentials: "include" })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || "GA4 verisi alinamadi")
        if (!cancelled) {
          setOverview(data.overview)
          setChannels(Array.isArray(data.channels) ? data.channels : [])
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || String(e))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const totalChannelSessions = channels.reduce((s, c) => s + c.sessions, 0) || 1

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 px-5 py-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-base">Google Analytics</h2>
            <p className="text-xs text-white/80">Site trafigi — son 7 gun</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {loading && (
          <div className="flex items-center justify-center gap-2 py-8 text-slate-400 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Yukleniyor...
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900 text-sm">GA4 verisi cekilemedi</p>
              <p className="text-xs text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && overview && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-xs text-blue-700 mb-1">
                  <Users className="w-3 h-3" /> Aktif Kullanici
                </div>
                <p className="text-xl font-bold text-blue-900">{overview.activeUsers}</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 mb-1">
                  <UserPlus className="w-3 h-3" /> Yeni Kullanici
                </div>
                <p className="text-xl font-bold text-emerald-900">{overview.newUsers}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-xs text-purple-700 mb-1">
                  <MousePointerClick className="w-3 h-3" /> Oturum
                </div>
                <p className="text-xl font-bold text-purple-900">{overview.sessions}</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-xs text-amber-700 mb-1">
                  <TrendingUp className="w-3 h-3" /> Etkilesim Orani
                </div>
                <p className="text-xl font-bold text-amber-900">{(overview.engagementRate * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-3 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1">
                  <Eye className="w-3 h-3" /> Sayfa Goruntuleme
                </div>
                <p className="text-xl font-bold text-slate-900">{overview.screenPageViews}</p>
              </div>
            </div>

            {channels.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Trafik Kaynagi — Son 28 Gun
                </p>
                <div className="flex h-2 rounded-full overflow-hidden bg-slate-100">
                  {channels.map((c) => (
                    <div
                      key={c.channel}
                      className={CHANNEL_COLORS[c.channel] || "bg-indigo-400"}
                      style={{ width: `${(c.sessions / totalChannelSessions) * 100}%` }}
                      title={`${c.channel}: ${c.sessions}`}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 mt-2">
                  {channels.map((c) => (
                    <div key={c.channel} className="flex items-center gap-1.5 text-xs">
                      <span className={`w-2 h-2 rounded-full ${CHANNEL_COLORS[c.channel] || "bg-indigo-400"}`} />
                      <span className="text-slate-600">{c.channel}</span>
                      <span className="font-bold text-slate-900">{c.sessions}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
