'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bot, Loader2, CheckCircle, XCircle, Play, Pause, Settings, Clock, Activity, DollarSign, Zap } from 'lucide-react'

const ALL_SLOTS = [
  { value: '06:00', label: '09:00', desc: 'Sabah' },
  { value: '12:00', label: '15:00', desc: 'Öğleden sonra' },
  { value: '18:00', label: '21:00', desc: 'Akşam' },
]

type LastRun = {
  status: 'done' | 'error' | 'running' | null
  created_at?: string
  duration_ms?: number
  output?: any
  error?: string
} | null

interface Props {
  initialEnabled: boolean
  initialSlots: string[]
  lastRun: LastRun
  todayCost: number
  pendingTopics: number
  articlesThisWeek: number
  recentLogs: any[]
}

function getNextRunTime(activeSlots: string[]): { slot: string; in: string } | null {
  if (activeSlots.length === 0) return null
  const now = new Date()
  const nowMin = now.getUTCHours() * 60 + now.getUTCMinutes()

  // Convert slots to UTC minutes
  const slotMins = activeSlots.map(s => {
    const [h, m] = s.split(':').map(Number)
    return { slot: s, mins: h * 60 + m }
  }).sort((a, b) => a.mins - b.mins)

  // Find next slot today
  const next = slotMins.find(s => s.mins > nowMin)
  if (next) {
    const diff = next.mins - nowMin
    const h = Math.floor(diff / 60)
    const m = diff % 60
    return { slot: next.slot, in: h > 0 ? `${h}sa ${m}dk` : `${m}dk` }
  }
  // Else first slot tomorrow
  const first = slotMins[0]
  const diff = (24 * 60 - nowMin) + first.mins
  const h = Math.floor(diff / 60)
  const m = diff % 60
  return { slot: first.slot, in: h > 0 ? `${h}sa ${m}dk` : `${m}dk` }
}

export default function DashboardPilotControl({
  initialEnabled, initialSlots, lastRun, todayCost, pendingTopics, articlesThisWeek, recentLogs
}: Props) {
  const router = useRouter()
  const [enabled, setEnabled] = useState(initialEnabled)
  const [savingToggle, setSavingToggle] = useState(false)
  const [runState, setRunState] = useState<'idle' | 'running' | 'success' | 'error'>('idle')
  const [runResult, setRunResult] = useState<any>(null)

  const nextRun = getNextRunTime(initialSlots)

  async function toggleEnabled() {
    setSavingToggle(true)
    const newVal = !enabled
    setEnabled(newVal)
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pilot_enabled: String(newVal) }),
      })
    } catch (e) {
      setEnabled(!newVal) // revert on error
    }
    setSavingToggle(false)
  }

  async function runNow() {
    if (runState === 'running') return
    setRunState('running')
    setRunResult(null)
    try {
      const res = await fetch('/api/agents/orchestrator', {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) {
        setRunState('success')
        setRunResult(data)
        setTimeout(() => { router.refresh(); setRunState('idle') }, 4000)
      } else {
        setRunState('error')
        setRunResult(data)
        setTimeout(() => setRunState('idle'), 6000)
      }
    } catch (err: any) {
      setRunState('error')
      setRunResult({ error: err.message })
      setTimeout(() => setRunState('idle'), 6000)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-5 py-4 text-white">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-base flex items-center gap-2">
                ContentPilot AI
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  enabled ? 'bg-green-400 text-green-900' : 'bg-slate-300 text-slate-700'
                }`}>
                  {enabled ? '● AKTİF' : '⏸ DURDU'}
                </span>
              </h2>
              <p className="text-xs text-white/80">7 ajan: SEO → Yazar → Görsel → Instagram</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runNow}
              disabled={runState === 'running' || !enabled}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition-all ${
                runState === 'running' ? 'bg-white/30 text-white cursor-not-allowed' :
                runState === 'success' ? 'bg-green-400 text-green-900' :
                runState === 'error' ? 'bg-red-400 text-red-900' :
                'bg-white text-purple-700 hover:bg-purple-50'
              } ${!enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {runState === 'running' ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Çalışıyor</> :
               runState === 'success' ? <><CheckCircle className="w-3.5 h-3.5" /> Başarılı</> :
               runState === 'error' ? <><XCircle className="w-3.5 h-3.5" /> Hata</> :
               <><Zap className="w-3.5 h-3.5" /> Hemen Çalıştır</>}
            </button>

            <button
              onClick={toggleEnabled}
              disabled={savingToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                enabled ? 'bg-green-400' : 'bg-slate-400'
              }`}
              title={enabled ? 'Duraklat' : 'Başlat'}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                enabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {/* Run feedback */}
        {runState === 'running' && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-purple-600 animate-spin shrink-0" />
            <p className="text-sm text-purple-900">
              <strong>Pipeline çalışıyor</strong> — SEO → Yazı → Görsel → Instagram (~2 dakika)
            </p>
          </div>
        )}
        {runState === 'success' && runResult && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <p className="text-sm text-green-900 font-semibold">✅ Pipeline başarıyla tamamlandı</p>
            {runResult.article?.title && (
              <p className="text-xs text-green-700 mt-1">📝 {runResult.article.title}</p>
            )}
            {runResult.social?.instagram_post_id && (
              <p className="text-xs text-pink-700">📸 Instagram'a paylaşıldı</p>
            )}
            {runResult.total_cost_usd && (
              <p className="text-xs text-slate-500 mt-1">${Number(runResult.total_cost_usd).toFixed(4)}</p>
            )}
          </div>
        )}
        {runState === 'error' && runResult && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-sm text-red-900 font-semibold">❌ Pipeline başarısız</p>
            <p className="text-xs text-red-700 mt-1">{runResult.error || 'Bilinmeyen hata'}</p>
          </div>
        )}

        {/* Mini stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
              <Clock className="w-3 h-3" /> Sonraki run
            </div>
            <p className="text-sm font-bold text-slate-900">
              {enabled && nextRun ? nextRun.in : '—'}
            </p>
            {enabled && nextRun && (
              <p className="text-[10px] text-slate-400">{nextRun.slot} UTC</p>
            )}
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
              <DollarSign className="w-3 h-3" /> Bugün
            </div>
            <p className="text-sm font-bold text-slate-900">${todayCost.toFixed(3)}</p>
            <p className="text-[10px] text-slate-400">AI maliyeti</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="text-xs text-slate-500 mb-1">Bekleyen</div>
            <p className="text-sm font-bold text-slate-900">{pendingTopics}</p>
            <p className="text-[10px] text-slate-400">SEO konu</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="text-xs text-slate-500 mb-1">Bu hafta</div>
            <p className="text-sm font-bold text-slate-900">{articlesThisWeek}</p>
            <p className="text-[10px] text-slate-400">makale</p>
          </div>
        </div>

        {/* Active slots */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Günlük Slotlar</p>
            <Link href="/admin/content-pilot/settings" className="text-xs text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1">
              <Settings className="w-3 h-3" /> Ayarlar
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {ALL_SLOTS.map(s => {
              const active = initialSlots.includes(s.value)
              const isNext = nextRun?.slot === s.value && enabled
              return (
                <div
                  key={s.value}
                  className={`px-3 py-2 rounded-lg text-center border ${
                    active
                      ? isNext
                        ? 'bg-purple-100 border-purple-400 text-purple-900'
                        : 'bg-purple-50 border-purple-200 text-purple-800'
                      : 'bg-slate-50 border-slate-100 text-slate-400'
                  }`}
                >
                  <p className="text-sm font-bold">
                    {s.label}
                    {isNext && <span className="ml-1 text-[10px]">●</span>}
                  </p>
                  <p className="text-[10px] opacity-70">{s.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Last run + Recent logs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          {/* Last run */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Son Otomatik Run</p>
            {lastRun ? (
              <div className={`rounded-lg border p-3 ${
                lastRun.status === 'done' ? 'bg-green-50 border-green-200' :
                lastRun.status === 'error' ? 'bg-red-50 border-red-200' :
                'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {lastRun.status === 'done' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                   lastRun.status === 'error' ? <XCircle className="w-4 h-4 text-red-600" /> :
                   <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />}
                  <span className="text-sm font-semibold text-slate-900">
                    {lastRun.status === 'done' ? 'Başarılı' :
                     lastRun.status === 'error' ? 'Hata' : 'Çalışıyor'}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  {lastRun.created_at && new Date(lastRun.created_at).toLocaleString('tr-TR', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                  })}
                  {lastRun.duration_ms ? ` · ${(lastRun.duration_ms / 1000).toFixed(0)}s` : ''}
                </p>
                {lastRun.output?.slug && (
                  <a href={`/blog/${lastRun.output.slug}`} target="_blank"
                    className="text-xs text-purple-600 hover:underline truncate block mt-1">
                    /blog/{lastRun.output.slug} →
                  </a>
                )}
                {lastRun.status === 'error' && lastRun.error && (
                  <p className="text-xs text-red-700 mt-1 truncate">{lastRun.error}</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic px-3 py-2">Henüz run yok</p>
            )}
          </div>

          {/* Recent agent activity */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Son Aktivite</p>
              <Link href="/admin/content-pilot/logs" className="text-xs text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1">
                <Activity className="w-3 h-3" /> Loglar
              </Link>
            </div>
            {recentLogs.length === 0 ? (
              <p className="text-xs text-slate-400 italic px-3 py-2">Log yok</p>
            ) : (
              <div className="space-y-1">
                {recentLogs.slice(0, 4).map((log: any) => (
                  <div key={log.id} className="flex items-center gap-2 text-xs">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      log.status === 'done' ? 'bg-green-500' :
                      log.status === 'error' ? 'bg-red-500' :
                      'bg-amber-500'
                    }`} />
                    <span className={`font-semibold px-1.5 py-0.5 rounded text-[10px] ${
                      log.agent === 'orchestrator' ? 'bg-purple-100 text-purple-700' :
                      log.agent === 'seo' ? 'bg-blue-100 text-blue-700' :
                      log.agent === 'writer' ? 'bg-sky-100 text-sky-700' :
                      log.agent === 'image' ? 'bg-green-100 text-green-700' :
                      log.agent === 'social' ? 'bg-pink-100 text-pink-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>{log.agent}</span>
                    <span className="text-slate-600 truncate flex-1">{log.action}</span>
                    <span className="text-slate-400 shrink-0">
                      {new Date(log.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
