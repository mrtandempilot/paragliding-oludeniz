'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Instagram, AlertTriangle, RefreshCw, Send, Edit3, Image as ImageIcon, Film, BookImage, Tv2,
  Sparkles, Calendar, TrendingUp, CheckCircle, XCircle, Clock, ExternalLink, Loader2, Plus, Zap
} from 'lucide-react'

interface PostStats {
  postedThisWeek: number
  postedThisMonth: number
  draftsCount: number
  scheduledCount: number
  failedPosts: any[]
  recentPosted: any[]
  nextScheduled: any | null
  typeBreakdown: Record<string, number>
  postingGapDays: number
}

const POST_TYPE_META: Record<string, { icon: any; color: string; label: string }> = {
  image:    { icon: ImageIcon, color: 'bg-orange-100 text-orange-700', label: 'Photo' },
  reel:     { icon: Film,      color: 'bg-purple-100 text-purple-700', label: 'Reel' },
  story:    { icon: Tv2,       color: 'bg-sky-100 text-sky-700',       label: 'Story' },
  carousel: { icon: BookImage, color: 'bg-green-100 text-green-700',   label: 'Carousel' },
}

function timeUntil(dateStr: string): string {
  const target = new Date(dateStr).getTime()
  const now = Date.now()
  const diff = target - now
  if (diff < 0) return 'gecikti'
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} dk sonra`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}sa ${mins % 60}dk`
  const days = Math.floor(hours / 24)
  return `${days} gün sonra`
}

export default function DashboardSocialPanel({ stats }: { stats: PostStats }) {
  const router = useRouter()
  const [retrying, setRetrying] = useState<string | null>(null)

  async function retryPublish(id: string) {
    setRetrying(id)
    try {
      const res = await fetch('/api/admin/instagram/publish', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (data.success) {
        router.refresh()
      } else {
        alert('Yeniden yayınlama başarısız: ' + (data.error || 'Bilinmeyen hata'))
      }
    } catch (e: any) {
      alert('Hata: ' + e.message)
    }
    setRetrying(null)
  }

  const typeEntries = Object.entries(stats.typeBreakdown).sort((a, b) => b[1] - a[1])
  const totalThisMonth = stats.postedThisMonth || 1
  const hasGap = stats.postingGapDays >= 3 && stats.scheduledCount === 0
  const hasFailed = stats.failedPosts.length > 0

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-orange-500 to-amber-500 px-5 py-4 text-white">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Instagram className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-base">Sosyal Medya Kontrol</h2>
              <p className="text-xs text-white/80">Instagram yayın merkezi</p>
            </div>
          </div>
          <Link href="/admin/instagram"
            className="flex items-center gap-1.5 bg-white text-pink-600 hover:bg-pink-50 text-xs font-bold px-3 py-2 rounded-lg transition-colors">
            <Plus className="w-3.5 h-3.5" /> Yeni Post
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {/* Critical alerts */}
        {hasFailed && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-red-900 text-sm">
                  {stats.failedPosts.length} post yayınlanamadı
                </p>
                <p className="text-xs text-red-700">Cron başarısız oldu — kontrol et</p>
              </div>
            </div>
            <div className="space-y-1.5 ml-7">
              {stats.failedPosts.slice(0, 3).map((p: any) => {
                const Meta = POST_TYPE_META[p.post_type || 'image']
                const Icon = Meta?.icon || ImageIcon
                return (
                  <div key={p.id} className="flex items-center gap-2 text-xs bg-white rounded-lg px-2.5 py-1.5">
                    <Icon className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span className="text-slate-700 truncate flex-1">{p.caption || '(caption yok)'}</span>
                    <button
                      onClick={() => retryPublish(p.id)}
                      disabled={retrying === p.id}
                      className="flex items-center gap-1 text-red-700 hover:text-red-900 font-semibold"
                    >
                      {retrying === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                      Yeniden dene
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {hasGap && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-amber-900 text-sm">
                {stats.postingGapDays} gündür post yayınlanmadı
              </p>
              <p className="text-xs text-amber-700">
                Zamanlanmış post da yok — engagement düşebilir.
                <Link href="/admin/instagram" className="ml-1 text-amber-800 font-semibold hover:underline">
                  Hemen bir post oluştur →
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* Mini KPI row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-green-700 mb-1">
              <CheckCircle className="w-3 h-3" /> Yayınlandı
            </div>
            <p className="text-xl font-bold text-green-900">{stats.postedThisWeek}</p>
            <p className="text-[10px] text-green-600">son 7 gün</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-blue-700 mb-1">
              <Calendar className="w-3 h-3" /> Zamanlandı
            </div>
            <p className="text-xl font-bold text-blue-900">{stats.scheduledCount}</p>
            <p className="text-[10px] text-blue-600">bekleyen</p>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1">
              <Edit3 className="w-3 h-3" /> Draft
            </div>
            <p className="text-xl font-bold text-slate-900">{stats.draftsCount}</p>
            <p className="text-[10px] text-slate-500">taslak</p>
          </div>
          <div className={`rounded-xl p-3 border ${
            hasFailed ? 'bg-red-50 border-red-100' : 'bg-purple-50 border-purple-100'
          }`}>
            <div className={`flex items-center gap-1.5 text-xs mb-1 ${
              hasFailed ? 'text-red-700' : 'text-purple-700'
            }`}>
              {hasFailed ? <XCircle className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />} Bu ay
            </div>
            <p className={`text-xl font-bold ${hasFailed ? 'text-red-900' : 'text-purple-900'}`}>
              {stats.postedThisMonth}
            </p>
            <p className={`text-[10px] ${hasFailed ? 'text-red-600' : 'text-purple-600'}`}>
              toplam post
            </p>
          </div>
        </div>

        {/* Next scheduled post countdown */}
        {stats.nextScheduled && (
          <Link href="/admin/instagram"
            className="block bg-gradient-to-r from-pink-50 to-orange-50 border border-pink-200 rounded-xl p-3 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              {stats.nextScheduled.image_url ? (
                <img src={stats.nextScheduled.image_url} alt=""
                  className="w-12 h-12 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center shrink-0">
                  <Instagram className="w-5 h-5 text-pink-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <Clock className="w-3 h-3 text-pink-600" />
                  <span className="text-xs font-bold text-pink-700 uppercase">Sonraki Post</span>
                  <span className="text-xs font-semibold text-pink-900">
                    · {timeUntil(stats.nextScheduled.scheduled_at)}
                  </span>
                </div>
                <p className="text-sm text-slate-800 truncate font-medium">
                  {stats.nextScheduled.caption || '(caption yok)'}
                </p>
              </div>
              <div className="text-right text-xs text-slate-600 shrink-0">
                <p className="font-bold">
                  {new Date(stats.nextScheduled.scheduled_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                </p>
                <p>
                  {new Date(stats.nextScheduled.scheduled_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </Link>
        )}

        {/* Post type breakdown */}
        {typeEntries.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Son 30 Gün — Tip Dağılımı</p>
            <div className="flex h-2 rounded-full overflow-hidden bg-slate-100">
              {typeEntries.map(([type, count]) => {
                const pct = (count / totalThisMonth) * 100
                const meta = POST_TYPE_META[type]
                const bg = type === 'image' ? 'bg-orange-500' :
                          type === 'reel' ? 'bg-purple-500' :
                          type === 'story' ? 'bg-sky-500' : 'bg-green-500'
                return <div key={type} className={bg} style={{ width: `${pct}%` }} title={`${meta?.label}: ${count}`} />
              })}
            </div>
            <div className="flex flex-wrap gap-3 mt-2">
              {typeEntries.map(([type, count]) => {
                const meta = POST_TYPE_META[type]
                const Icon = meta?.icon || ImageIcon
                const dot = type === 'image' ? 'bg-orange-500' :
                           type === 'reel' ? 'bg-purple-500' :
                           type === 'story' ? 'bg-sky-500' : 'bg-green-500'
                return (
                  <div key={type} className="flex items-center gap-1.5 text-xs">
                    <span className={`w-2 h-2 rounded-full ${dot}`} />
                    <Icon className="w-3 h-3 text-slate-500" />
                    <span className="text-slate-600 capitalize">{meta?.label || type}</span>
                    <span className="font-bold text-slate-900">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Recently published */}
        {stats.recentPosted.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Son Yayınlananlar</p>
              <Link href="/admin/instagram" className="text-xs text-pink-600 hover:text-pink-700 font-semibold">
                Hepsi →
              </Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {stats.recentPosted.slice(0, 6).map((p: any) => {
                const Meta = POST_TYPE_META[p.post_type || 'image']
                const Icon = Meta?.icon || ImageIcon
                const igUrl = p.instagram_id
                  ? `https://www.instagram.com/p/${p.instagram_id}/`
                  : null
                return (
                  <div key={p.id} className="relative group aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                    {p.image_url ? (
                      <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon className="w-6 h-6 text-slate-300" />
                      </div>
                    )}
                    <div className="absolute top-1 left-1">
                      <span className={`flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded ${Meta?.color}`}>
                        <Icon className="w-2.5 h-2.5" />
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-end justify-center opacity-0 group-hover:opacity-100">
                      <p className="text-[10px] text-white p-1 text-center">
                        {p.posted_at && new Date(p.posted_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <Link href="/admin/instagram"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-slate-50 hover:bg-pink-50 text-slate-700 hover:text-pink-700 text-sm font-semibold transition-colors">
            <Sparkles className="w-4 h-4" />
            AI ile Post Oluştur
          </Link>
          <Link href="/admin/instagram"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 text-sm font-semibold transition-colors">
            <Calendar className="w-4 h-4" />
            Yayın Takvimi
          </Link>
        </div>
      </div>
    </div>
  )
}
