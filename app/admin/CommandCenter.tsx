'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sora } from 'next/font/google'
import {
  ArrowUp, RefreshCw, Play, Loader2, AlertTriangle, Phone, CalendarDays,
  Search, Megaphone, Instagram, Bot, Sparkles, Globe2, ArrowUpRight, Ticket,
  MessageCircle, FileText, LineChart, Radar, ListChecks, Plus,
} from 'lucide-react'

const sora = Sora({ subsets: ['latin', 'latin-ext'], weight: ['300', '400', '600', '700'], display: 'swap' })

/* ── palette ───────────────────────────────────────────────────────────── */
// night #0B1A2C · panel #10233A · line #1E3654 · ink #E7EEF6 · mute #8098B3
// brand orange #F97316 · lagoon #2DD4BF · warn #FBBF24 · bad #F87171

type Station = {
  label: string; elevation: string; temperatureC: number | null; windSpeedKmh: number | null
  windGustKmh: number | null; windDirectionDeg: number | null; weatherCode: number | null; humidity: number | null
}
type Booking = {
  id: string; first_name?: string; last_name?: string; flight_date: string; flight_type?: string
  guests?: number; total_price?: number; status: string; phone?: string
}
type Props = {
  today: string
  weather: { stations: Station[]; fetchedAt: string } | null
  bookings: {
    todayFlights: Booking[]; upcoming: Booking[]; newToday: number; newWeek: number; newMonth: number
    guestsMonth: number; revenueMonth: number; pending: number; stalePending: number
    statusCounts: Record<string, number>; typeCounts: Record<string, number>
    recent: (Booking & { created_at: string })[]
  }
  calendar: { start: string; end: string; days: Record<string, { bookings: number; guests: number; pending: number }> }
  pilot: {
    enabled: boolean; slots: string[]; costToday: number; cost7: number; cost30: number; pendingTopics: number
    articlesWeek: number; articlesTotal: number; blogPosts: number
    latestArticles: { title: string; slug: string; created_at: string }[]
    runs7: Record<string, number>
  }
  dm: { general: boolean; keyword: boolean; keywords: string[] }
  instagram: { postedWeek: number; drafts: number; scheduled: number; failed: number; gapDays: number | null }
  gsc: {
    daily: { date: string; clicks: number; impressions: number }[]
    queries: { key: string; clicks: number; impressions: number; position: number }[]
    pages: { key: string; clicks: number; impressions: number; position: number }[]
    error: string | null
  }
  agents: { agent: string; action: string; status: string; error?: string; created_at: string }[]
}

const WMO: Record<number, string> = {
  0: 'Açık', 1: 'Çoğunlukla açık', 2: 'Parçalı bulutlu', 3: 'Kapalı', 45: 'Sis', 48: 'Kırağı sisi',
  51: 'Hafif çiseleme', 53: 'Çiseleme', 55: 'Yoğun çiseleme', 61: 'Hafif yağmur', 63: 'Yağmur',
  65: 'Şiddetli yağmur', 71: 'Kar', 80: 'Sağanak', 95: 'Fırtına',
}
const STATION_TR: Record<string, string> = {
  'Babadağ Summit': 'Babadağ zirve', 'Babadağ 1200m Take-off': 'Kalkış 1200', 'Ölüdeniz Beach (Landing)': 'İniş, plaj',
}
const META_STATUS: Record<number, { label: string; tone: 'ok' | 'warn' | 'bad' }> = {
  1: { label: 'Aktif', tone: 'ok' }, 2: { label: 'Devre dışı', tone: 'bad' }, 3: { label: 'Ödenmemiş bakiye', tone: 'bad' },
  7: { label: 'Risk incelemesinde', tone: 'warn' }, 8: { label: 'Ödeme bekleniyor', tone: 'warn' },
  9: { label: 'Ek süre', tone: 'warn' }, 100: { label: 'Kapanıyor', tone: 'bad' }, 101: { label: 'Kapalı', tone: 'bad' },
}
const GADS_STATUS: Record<string, string> = {
  ELIGIBLE: 'Yayında', LIMITED: 'Yayında, sınırlı', LEARNING: 'Öğreniyor', PENDING: 'İncelemede',
  NOT_ELIGIBLE: 'Yayında değil', PAUSED: 'Durduruldu', ENDED: 'Bitti', MISCONFIGURED: 'Ayar hatası',
}

const nf = (n: number, d = 0) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: d, minimumFractionDigits: d }).format(n)
const ago = (iso?: string | null) => {
  if (!iso) return '—'
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (m < 1) return 'şimdi'
  if (m < 60) return `${m} dk önce`
  const h = Math.round(m / 60)
  if (h < 48) return `${h} sa önce`
  return `${Math.round(h / 24)} gün önce`
}
const dayLabel = (iso: string, today: string) => {
  const d = iso.slice(0, 10)
  if (d === today) return 'Bugün'
  const t = new Date(today + 'T12:00:00'); t.setDate(t.getDate() + 1)
  if (d === t.toISOString().slice(0, 10)) return 'Yarın'
  return new Intl.DateTimeFormat('tr-TR', { weekday: 'long', day: 'numeric', month: 'short' }).format(new Date(d + 'T12:00:00'))
}

async function getJson(url: string) {
  const r = await fetch(url, { credentials: 'include', cache: 'no-store' })
  const j = await r.json().catch(() => ({ error: `HTTP ${r.status}` }))
  if (!r.ok && !j.error) j.error = `HTTP ${r.status}`
  return j
}

/* ── small building blocks ─────────────────────────────────────────────── */
function Panel({ title, icon: Icon, href, children, className = '', right }: {
  title: string; icon?: any; href?: string; children: React.ReactNode; className?: string; right?: React.ReactNode
}) {
  return (
    <section className={`rounded-xl border border-[#1E3654] bg-[#10233A]/70 p-5 ${className}`}>
      <header className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-[13px] font-medium text-[#8098B3]">
          {Icon && <Icon className="h-4 w-4" aria-hidden />}{title}
        </h2>
        <div className="flex items-center gap-3">
          {right}
          {href && (
            <Link href={href} className="rounded text-[#8098B3] hover:text-[#E7EEF6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2DD4BF]" aria-label={`${title} sayfasını aç`}>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </header>
      {children}
    </section>
  )
}

function Stat({ value, label, sub, tone }: { value: React.ReactNode; label: string; sub?: React.ReactNode; tone?: 'ok' | 'warn' | 'bad' }) {
  const color = tone === 'bad' ? 'text-[#F87171]' : tone === 'warn' ? 'text-[#FBBF24]' : 'text-[#E7EEF6]'
  return (
    <div className="min-w-0">
      <div className={`${sora.className} text-[28px] font-light leading-none tabular-nums ${color}`}>{value}</div>
      <div className="mt-2 text-[13px] text-[#8098B3]">{label}</div>
      {sub && <div className="mt-0.5 text-[12px] text-[#5F7894]">{sub}</div>}
    </div>
  )
}

function Skeleton({ h = 'h-16' }: { h?: string }) {
  return <div className={`${h} animate-pulse rounded-lg bg-[#1E3654]/40`} />
}

function ErrorLine({ msg }: { msg: string }) {
  return (
    <p className="flex items-start gap-2 text-[13px] text-[#FBBF24]">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <span className="break-words">{msg}</span>
    </p>
  )
}

function Bars({ values, labels, accent = '#F97316' }: { values: number[]; labels: string[]; accent?: string }) {
  const max = Math.max(1, ...values)
  return (
    <div className="flex h-16 items-end gap-[3px]" role="img" aria-label="Son 14 gün tıklama grafiği">
      {values.map((v, i) => (
        <div key={i} className="group relative flex-1">
          <div
            className="w-full rounded-sm"
            style={{ height: `${Math.max(3, (v / max) * 64)}px`, background: v > 0 ? accent : '#1E3654' }}
          />
          <span className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-[#E7EEF6] px-1.5 py-0.5 text-[11px] text-[#0B1A2C] group-hover:block">
            {labels[i]}: {v}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ── section heading ───────────────────────────────────────────────────── */
function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 pt-4">
      <div className="flex items-baseline justify-between gap-4 border-b border-[#1E3654] pb-2">
        <h2 className={`${sora.className} text-[18px] font-semibold tracking-tight text-[#E7EEF6]`}>{title}</h2>
        {note && <span className="text-[12px] text-[#5F7894]">{note}</span>}
      </div>
      {children}
    </section>
  )
}

/* ── two-month flight calendar ─────────────────────────────────────────── */
const TR_MONTH = new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric', timeZone: 'UTC' })
function MonthGrid({ year, month, days, today }: {
  year: number; month: number; days: Props['calendar']['days']; today: string
}) {
  const first = new Date(Date.UTC(year, month - 1, 1))
  const daysIn = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const lead = (first.getUTCDay() + 6) % 7 // Monday first
  const maxGuests = Math.max(1, ...Object.values(days).map(d => d.guests))
  const cells: (number | null)[] = [...Array(lead).fill(null), ...Array.from({ length: daysIn }, (_, i) => i + 1)]
  return (
    <div>
      <div className="mb-1.5 text-[13px] capitalize text-[#C9D6E4]">{TR_MONTH.format(first)}</div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] text-[#5F7894]">
        {['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'].map(d => <div key={d} className="pb-0.5">{d}</div>)}
        {cells.map((d, i) => {
          if (d == null) return <div key={i} />
          const key = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
          const info = days[key]
          const past = key < today
          const isToday = key === today
          const alpha = info ? 0.25 + 0.75 * (info.guests / maxGuests) : 0
          return (
            <div
              key={i}
              title={info ? `${info.bookings} rezervasyon, ${info.guests} yolcu${info.pending ? `, ${info.pending} bekliyor` : ''}` : undefined}
              className={`relative flex h-6 items-center justify-center rounded text-[11px] tabular-nums ${isToday ? 'ring-1 ring-[#2DD4BF]' : ''} ${past && !info ? 'text-[#35506F]' : 'text-[#C9D6E4]'}`}
              style={info ? { background: `rgba(249,115,22,${alpha})`, color: '#fff' } : { background: '#10233A' }}
            >
              {d}
              {info?.pending ? <span className="absolute right-0.5 top-0.5 h-1 w-1 rounded-full bg-[#FBBF24]" aria-hidden /> : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── search trend (Search Console, 90 days) ────────────────────────────── */
function TrendLine({ rows }: { rows: Props['gsc']['daily'] }) {
  if (rows.length < 2) return <p className="text-[13px] text-[#5F7894]">Grafik için yeterli veri yok.</p>
  const W = 600, H = 140
  const maxC = Math.max(1, ...rows.map(r => r.clicks))
  const maxI = Math.max(1, ...rows.map(r => r.impressions))
  const x = (i: number) => (i / (rows.length - 1)) * W
  const lineC = rows.map((r, i) => `${x(i).toFixed(1)},${(H - (r.clicks / maxC) * (H - 8)).toFixed(1)}`).join(' ')
  const areaI = `0,${H} ` + rows.map((r, i) => `${x(i).toFixed(1)},${(H - (r.impressions / maxI) * (H - 8)).toFixed(1)}`).join(' ') + ` ${W},${H}`
  const first = rows[0].date, last = rows[rows.length - 1].date
  const fmtD = (d: string) => new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short' }).format(new Date(d + 'T12:00:00'))
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-36 w-full" role="img" aria-label="Son 90 gün Google arama tıklama ve gösterim grafiği">
        <polygon points={areaI} fill="#2DD4BF" opacity="0.12" />
        <polyline points={lineC} fill="none" stroke="#F97316" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-2 flex justify-between text-[12px] text-[#5F7894]">
        <span>{fmtD(first)}</span>
        <span className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-[#F97316]" />tıklama</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-4 bg-[#2DD4BF]/30" />gösterim</span>
        </span>
        <span>{fmtD(last)}</span>
      </div>
    </div>
  )
}

const STATUS_TR: Record<string, string> = { pending: 'bekliyor', confirmed: 'onaylı', completed: 'tamamlandı', cancelled: 'iptal' }
const STATUS_COLOR: Record<string, string> = { pending: '#FBBF24', confirmed: '#2DD4BF', completed: '#7DD3FC', cancelled: '#F87171' }
const TYPE_TR: Record<string, string> = { standard: 'Standart', high: 'Yüksek irtifa', sunset: 'Gün batımı', acro: 'Akro' }

/* ── main ──────────────────────────────────────────────────────────────── */
export default function CommandCenter(p: Props) {
  const router = useRouter()
  const [now, setNow] = useState<Date | null>(null)
  const [gads, setGads] = useState<any>(null)
  const [meta, setMeta] = useState<any>(null)
  const [gscStats, setGscStats] = useState<any>(null)
  const [ga4, setGa4] = useState<any>(null)
  const [aiv, setAiv] = useState<any>(null)
  const [ig, setIg] = useState<any>(null)
  const [pilotOn, setPilotOn] = useState(p.pilot.enabled)
  const [savingPilot, setSavingPilot] = useState(false)
  const [runState, setRunState] = useState<'idle' | 'running' | 'ok' | 'err'>('idle')
  const [refreshing, setRefreshing] = useState(false)

  async function loadExternal() {
    const r = await Promise.allSettled([
      getJson('/api/admin/google-ads?type=overview'),
      getJson('/api/admin/meta-ads?type=account'),
      getJson('/api/admin/meta-ads?type=insights&date_preset=last_7d'),
      getJson('/api/admin/meta-ads?type=campaigns'),
      getJson('/api/admin/seo-stats'),
      getJson('/api/admin/seo-data?type=ga4-overview'),
      getJson('/api/admin/ai-visibility'),
      getJson('/api/admin/instagram/token-status'),
      getJson('/api/admin/instagram/insights'),
    ])
    const v = (i: number) => (r[i].status === 'fulfilled' ? (r[i] as PromiseFulfilledResult<any>).value : { error: String((r[i] as PromiseRejectedResult).reason) })
    setGads(v(0))
    setMeta({ account: v(1), insights: v(2), campaigns: v(3) })
    setGscStats(v(4))
    setGa4(v(5))
    setAiv(v(6))
    setIg({ token: v(7), insights: v(8) })
  }

  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 30000)
    loadExternal()
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function refreshAll() {
    setRefreshing(true)
    setGads(null); setMeta(null); setGscStats(null); setGa4(null); setAiv(null); setIg(null)
    router.refresh()
    await loadExternal()
    setRefreshing(false)
  }

  async function togglePilot() {
    const next = !pilotOn
    setPilotOn(next); setSavingPilot(true)
    try {
      const r = await fetch('/api/admin/settings', {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pilot_enabled: String(next) }),
      })
      if (!r.ok) throw new Error()
    } catch { setPilotOn(!next) }
    setSavingPilot(false)
  }

  async function runPilot() {
    if (runState === 'running') return
    setRunState('running')
    try {
      const r = await fetch('/api/agents/orchestrator', { method: 'POST', credentials: 'include' })
      const j = await r.json()
      setRunState(j.success ? 'ok' : 'err')
      if (j.success) setTimeout(() => router.refresh(), 2500)
    } catch { setRunState('err') }
    setTimeout(() => setRunState('idle'), 6000)
  }

  /* derived */
  const g7 = useMemo(() => {
    const days: any[] = gads?.days || []
    const last7 = days.slice(-7)
    const sum = (k: string) => last7.reduce((s, d) => s + (d[k] || 0), 0)
    return {
      cost: sum('cost'), clicks: sum('clicks'), impressions: sum('impressions'), conversions: sum('conversions'),
      todayCost: days.length ? days[days.length - 1].cost : 0,
      series: days.map(d => d.clicks), labels: days.map(d => (d.date || '').slice(5)),
    }
  }, [gads])

  const metaStatus = META_STATUS[Number(meta?.account?.account_status)] || null
  const metaSpend7 = (meta?.insights?.data || []).reduce((s: number, r: any) => s + Number(r.spend || 0), 0)
  const metaCampaigns: any[] = (meta?.campaigns?.data || []).filter((c: any) => c.status === 'ACTIVE')

  const flightsByDay = useMemo(() => {
    const m: Record<string, Booking[]> = {}
    for (const b of p.bookings.upcoming) {
      const d = (b.flight_date || '').slice(0, 10)
      ;(m[d] ||= []).push(b)
    }
    return Object.entries(m)
  }, [p.bookings.upcoming])

  const todayGuests = p.bookings.todayFlights.reduce((s, b) => s + (b.guests || 1), 0)
  const channels: { channel: string; sessions: number }[] = ga4?.channels || []
  const chMax = Math.max(1, ...channels.map(c => c.sessions))
  const chTotal = channels.reduce((s, c) => s + c.sessions, 0)
  const aiSummary = aiv?.summary
  const aiRate = aiSummary && aiSummary.mentioned + aiSummary.missed > 0
    ? Math.round((aiSummary.mentioned / (aiSummary.mentioned + aiSummary.missed)) * 100) : null
  const aiSources = Object.entries((aiSummary?.bySource || {}) as Record<string, { mentioned: number; missed: number }>)

  const igPosts: any[] = ig?.insights?.insights || []
  const igTop = [...igPosts].sort((a, b) => (b.reach || 0) - (a.reach || 0))[0]
  const igReach30 = igPosts
    .filter(x => x.posted_at && Date.now() - new Date(x.posted_at).getTime() < 30 * 86400000)
    .reduce((s, x) => s + (x.reach || 0), 0)

  const gscTotals90 = p.gsc.daily.reduce((a, r) => ({ c: a.c + r.clicks, i: a.i + r.impressions }), { c: 0, i: 0 })
  const statusTotal = Object.values(p.bookings.statusCounts).reduce((a, b) => a + b, 0)
  const typeTotal = Object.values(p.bookings.typeCounts).reduce((a, b) => a + b, 0)
  const runsTotal = Object.values(p.pilot.runs7).reduce((a, b) => a + b, 0)
  const [cy, cm] = p.calendar.start.split('-').map(Number)
  const nextMonth = cm === 12 ? { y: cy + 1, m: 1 } : { y: cy, m: cm + 1 }

  const alerts: { tone: 'warn' | 'bad'; text: string; href?: string }[] = []
  if (metaStatus && metaStatus.tone !== 'ok') alerts.push({ tone: metaStatus.tone, text: `Meta reklam hesabı: ${metaStatus.label}${meta?.account?.balance ? ` (₺${nf(Number(meta.account.balance))})` : ''}`, href: '/admin/meta-ads' })
  if (gads?.error) alerts.push({ tone: 'warn', text: `Google Ads verisi alınamadı: ${gads.error}`, href: '/admin/google-ads' })
  if (p.bookings.pending > 0) alerts.push({ tone: 'warn', text: `${p.bookings.pending} yaklaşan rezervasyon onay bekliyor`, href: '/admin/bookings' })
  if (p.bookings.stalePending > 0) alerts.push({ tone: 'warn', text: `${p.bookings.stalePending} rezervasyonun uçuş tarihi geçmiş ama hâlâ "bekliyor" görünüyor. Tamamlandı ya da iptal olarak işaretle.`, href: '/admin/bookings' })
  if (p.instagram.failed > 0) alerts.push({ tone: 'warn', text: `${p.instagram.failed} Instagram gönderisi başarısız`, href: '/admin/instagram' })
  if (p.instagram.gapDays != null && p.instagram.gapDays >= 3) alerts.push({ tone: 'warn', text: `Instagram'a ${p.instagram.gapDays} gündür paylaşım yapılmadı`, href: '/admin/instagram' })
  if (ig?.token && ig.token.valid === false) alerts.push({ tone: 'bad', text: 'Instagram bağlantısının süresi dolmuş, yeniden bağlanmalı', href: '/admin/instagram' })
  if (ig?.token?.daysLeft != null && ig.token.daysLeft < 10) alerts.push({ tone: 'warn', text: `Instagram bağlantısı ${ig.token.daysLeft} gün sonra sona eriyor`, href: '/admin/instagram' })
  if (p.gsc.error) alerts.push({ tone: 'warn', text: `Search Console: ${p.gsc.error}`, href: '/admin/analyze' })
  for (const a of p.agents) if (a.status === 'error') alerts.push({ tone: 'bad', text: `${a.agent} ajanı son çalışmasında hata verdi (${ago(a.created_at)}): ${(a.error || a.action || '').slice(0, 90)}`, href: '/admin/mission-control' })

  const dateTitle = now
    ? new Intl.DateTimeFormat('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Istanbul' }).format(now)
    : ''
  const clock = now
    ? new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' }).format(now)
    : ''

  const shortcuts = [
    { href: '/admin/ticket', label: 'Bilet bas', icon: Ticket },
    { href: '/admin/bookings', label: 'Rezervasyonlar', icon: ListChecks },
    { href: '/admin/calendar', label: 'Takvim', icon: CalendarDays },
    { href: '/admin/google-ads/create', label: 'Google kampanyası', icon: Plus },
    { href: '/admin/meta-ads/create', label: 'Meta kampanyası', icon: Plus },
    { href: '/admin/instagram', label: 'Instagram gönderisi', icon: Instagram },
    { href: '/admin/blog', label: 'Blog yazısı', icon: FileText },
    { href: '/admin/seo-intelligence', label: 'Sayfa SEO analizi', icon: LineChart },
    { href: '/admin/mission-control', label: 'Mission Control', icon: Radar },
  ]

  return (
    <div className="-m-8 min-h-screen bg-[#0B1A2C] px-4 py-6 text-[#E7EEF6] sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1400px] space-y-5">

        {/* header */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[13px] capitalize text-[#8098B3]">{dateTitle}</p>
            <h1 className={`${sora.className} mt-1 text-[26px] font-semibold tracking-tight`}>Atmos uçuş masası</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className={`${sora.className} text-[26px] font-light tabular-nums text-[#8098B3]`} aria-label="Saat (İstanbul)">{clock}</span>
            <button
              onClick={refreshAll}
              className="flex items-center gap-2 rounded-lg border border-[#1E3654] px-3 py-2 text-[13px] text-[#8098B3] hover:border-[#2DD4BF] hover:text-[#E7EEF6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2DD4BF]"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} aria-hidden /> Yenile
            </button>
          </div>
        </header>

        {/* shortcuts */}
        <nav aria-label="Kısayollar" className="flex flex-wrap gap-2">
          {shortcuts.map(s => (
            <Link key={s.href} href={s.href} className="flex items-center gap-1.5 rounded-lg border border-[#1E3654] px-3 py-1.5 text-[13px] text-[#C9D6E4] hover:border-[#F97316] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2DD4BF]">
              <s.icon className="h-3.5 w-3.5 text-[#8098B3]" aria-hidden />{s.label}
            </Link>
          ))}
        </nav>

        {/* alerts */}
        {alerts.length > 0 && (
          <ul className="space-y-1.5" aria-label="Dikkat gerektirenler">
            {alerts.map((a, i) => (
              <li key={i}>
                <Link
                  href={a.href || '#'}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2DD4BF] ${a.tone === 'bad' ? 'border-[#F87171]/40 bg-[#F87171]/10 text-[#FCA5A5]' : 'border-[#FBBF24]/30 bg-[#FBBF24]/5 text-[#FDE68A]'}`}
                >
                  <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />{a.text}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* ───────── BUGÜN: slim strip ───────── */}
        <section aria-label="Bugün" className="flex flex-col gap-px overflow-hidden rounded-xl border border-[#1E3654] bg-[#1E3654] lg:flex-row">
          <div className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-2 bg-[#0F2136] px-4 py-3">
            <Link href="/live-weather" className="text-[12px] text-[#5F7894] hover:text-[#E7EEF6]">Babadağ rüzgarı</Link>
            {!p.weather ? <span className="text-[13px] text-[#FBBF24]">Hava durumu alınamadı</span> : (
              [...p.weather.stations]
                .sort((x, y) => ['Babadağ Summit', 'Babadağ 1200m Take-off', 'Ölüdeniz Beach (Landing)'].indexOf(x.label) - ['Babadağ Summit', 'Babadağ 1200m Take-off', 'Ölüdeniz Beach (Landing)'].indexOf(y.label))
                .map(st => (
                  <div key={st.label} className="flex items-center gap-2 text-[13px]" title={`${STATION_TR[st.label] || st.label}${st.weatherCode != null ? `, ${WMO[st.weatherCode] || ''}` : ''}`}>
                    <span className="text-[#8098B3]">{st.elevation.replace(' ASL', '')}</span>
                    <span className={`${sora.className} tabular-nums text-[16px] text-[#E7EEF6]`}>{st.windSpeedKmh != null ? Math.round(st.windSpeedKmh) : '—'}</span>
                    <span className="text-[#5F7894]">km/s</span>
                    <ArrowUp
                      className="h-3.5 w-3.5 text-[#2DD4BF]"
                      style={{ transform: `rotate(${((st.windDirectionDeg ?? 0) + 180) % 360}deg)` }}
                      aria-label={`Rüzgar yönü ${st.windDirectionDeg != null ? Math.round(st.windDirectionDeg) : '—'} derece`}
                    />
                    {st.windGustKmh != null && <span className="tabular-nums text-[#8098B3]">hamle {Math.round(st.windGustKmh)}</span>}
                    <span className="tabular-nums text-[#5F7894]">{st.temperatureC != null ? `${Math.round(st.temperatureC)}°` : ''}</span>
                  </div>
                ))
            )}
          </div>
          <Link href="/admin/bookings" className="flex items-center gap-5 bg-[#0F2136] px-4 py-3 text-[13px] hover:bg-[#13294A] lg:w-auto">
            <span className="text-[12px] text-[#5F7894]">Bugün</span>
            <span><span className={`${sora.className} text-[16px] tabular-nums`}>{p.bookings.todayFlights.length}</span> <span className="text-[#8098B3]">uçuş</span></span>
            <span><span className={`${sora.className} text-[16px] tabular-nums`}>{todayGuests}</span> <span className="text-[#8098B3]">yolcu</span></span>
            <span className={p.bookings.pending ? 'text-[#FBBF24]' : ''}><span className={`${sora.className} text-[16px] tabular-nums`}>{p.bookings.pending}</span> <span className={p.bookings.pending ? '' : 'text-[#8098B3]'}>onay bekleyen</span></span>
          </Link>
        </section>

        {p.bookings.todayFlights.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Bugünkü yolcular">
            {p.bookings.todayFlights.map(b => (
              <li key={b.id} className="flex items-center gap-2 rounded-lg border border-[#1E3654] px-3 py-1.5 text-[13px]">
                <span>{[b.first_name, b.last_name].filter(Boolean).join(' ') || 'İsimsiz'}</span>
                <span className="tabular-nums text-[#8098B3]">{b.guests || 1} kişi</span>
                <span style={{ color: STATUS_COLOR[b.status] || '#8098B3' }}>{STATUS_TR[b.status] || b.status}</span>
                {b.phone && (
                  <a href={`https://wa.me/${b.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-[#8098B3] hover:text-[#2DD4BF]" aria-label={`${b.first_name || ''} WhatsApp`}>
                    <Phone className="h-3.5 w-3.5" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* KPI strip */}
        <section aria-label="Özet rakamlar" className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#1E3654] bg-[#1E3654] md:grid-cols-3 xl:grid-cols-6">
          {[
            { v: p.bookings.newWeek, l: 'Yeni rezervasyon, 7 gün', s: `Bugün ${p.bookings.newToday}, 30 günde ${p.bookings.newMonth}` },
            { v: `$${nf(p.bookings.revenueMonth)}`, l: 'Rezervasyon tutarı, 30 gün', s: `${p.bookings.guestsMonth} yolcu, iptaller hariç` },
            { v: gads ? `₺${nf(g7.cost)}` : '…', l: 'Google Ads harcama, 7 gün', s: gads ? `${nf(g7.clicks)} tıklama, ${nf(g7.conversions, 0)} dönüşüm` : 'yükleniyor' },
            { v: metaStatus ? (metaStatus.tone === 'ok' ? `₺${nf(metaSpend7)}` : 'Durdu') : '…', l: 'Meta reklam, 7 gün', s: metaStatus ? (metaStatus.tone === 'ok' ? 'harcama' : metaStatus.label) : 'yükleniyor', tone: metaStatus && metaStatus.tone !== 'ok' ? metaStatus.tone : undefined },
            { v: ga4?.overview ? nf(ga4.overview.activeUsers) : '…', l: 'Site ziyaretçisi, 7 gün', s: ga4?.overview ? `${nf(ga4.overview.sessions)} oturum` : ga4?.error ? 'alınamadı' : 'yükleniyor' },
            { v: gscStats?.gsc7d ? nf(gscStats.gsc7d.clicks) : '…', l: 'Google arama tıklaması, 7 gün', s: gscStats?.gsc7d ? `ort. sıra ${nf(gscStats.gsc7d.position, 1)}` : gscStats?.error ? 'alınamadı' : 'yükleniyor' },
          ].map((k, i) => (
            <div key={i} className="bg-[#0F2136] p-5">
              <Stat value={k.v} label={k.l} sub={k.s} tone={(k as any).tone} />
            </div>
          ))}
        </section>

        {/* ───────── REZERVASYONLAR ───────── */}
        <Section title="Rezervasyonlar" note="Takvim, yaklaşan uçuşlar, son 30 gün">
          <div className="grid gap-5 lg:grid-cols-12">
            <Panel title="Uçuş takvimi" icon={CalendarDays} href="/admin/calendar" className="lg:col-span-5" right={
              <span className="flex items-center gap-3 text-[12px] text-[#5F7894]">
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-[#F97316]" />yolcu</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#FBBF24]" />bekleyen</span>
              </span>
            }>
              <div className="grid gap-4 sm:grid-cols-2">
                <MonthGrid year={cy} month={cm} days={p.calendar.days} today={p.today} />
                <MonthGrid year={nextMonth.y} month={nextMonth.m} days={p.calendar.days} today={p.today} />
              </div>
            </Panel>

            <Panel title="Önümüzdeki 7 gün" icon={ListChecks} href="/admin/bookings" className="lg:col-span-7">
              {flightsByDay.length === 0 ? (
                <p className="text-[13px] text-[#5F7894]">Önümüzdeki 7 günde kayıtlı uçuş yok.</p>
              ) : (
                <div className="space-y-4">
                  {flightsByDay.map(([day, list]) => (
                    <div key={day} className="grid grid-cols-[96px_1fr] gap-3">
                      <div>
                        <div className="text-[14px] capitalize text-[#E7EEF6]">{dayLabel(day, p.today)}</div>
                        <div className="text-[12px] tabular-nums text-[#5F7894]">{list.reduce((s, b) => s + (b.guests || 1), 0)} yolcu</div>
                      </div>
                      <ul className="flex flex-wrap gap-2">
                        {list.map(b => (
                          <li key={b.id} className={`rounded-md border px-2.5 py-1 text-[13px] ${b.status === 'pending' ? 'border-[#FBBF24]/40 text-[#FDE68A]' : 'border-[#1E3654] text-[#C9D6E4]'}`}>
                            {b.first_name || 'İsimsiz'}{(b.guests || 1) > 1 ? ` +${(b.guests || 1) - 1}` : ''}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </div>

          <div className="grid gap-5 lg:grid-cols-12">
            <Panel title="Son 30 gün, durum" className="lg:col-span-4">
              {statusTotal === 0 ? <p className="text-[13px] text-[#5F7894]">Son 30 günde rezervasyon yok.</p> : (
                <>
                  <div className="flex h-2.5 overflow-hidden rounded-full bg-[#1E3654]">
                    {Object.entries(p.bookings.statusCounts).map(([st, n]) => (
                      <div key={st} style={{ width: `${(n / statusTotal) * 100}%`, background: STATUS_COLOR[st] || '#8098B3' }} />
                    ))}
                  </div>
                  <ul className="mt-4 grid grid-cols-2 gap-y-2 text-[13px]">
                    {Object.entries(p.bookings.statusCounts).map(([st, n]) => (
                      <li key={st} className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ background: STATUS_COLOR[st] || '#8098B3' }} />
                        <span className="text-[#C9D6E4]">{STATUS_TR[st] || st}</span>
                        <span className="tabular-nums text-[#8098B3]">{n}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 border-t border-[#1E3654] pt-4">
                    <div className="mb-2 text-[12px] text-[#5F7894]">Uçuş tipi, yolcu sayısı</div>
                    <ul className="space-y-2">
                      {Object.entries(p.bookings.typeCounts).sort((a, b) => b[1] - a[1]).map(([t, n]) => (
                        <li key={t}>
                          <div className="mb-1 flex justify-between text-[13px]"><span className="text-[#C9D6E4]">{TYPE_TR[t] || t}</span><span className="tabular-nums text-[#8098B3]">{n}</span></div>
                          <div className="h-1.5 rounded-full bg-[#1E3654]"><div className="h-1.5 rounded-full bg-[#F97316]" style={{ width: `${(n / Math.max(1, typeTotal)) * 100}%` }} /></div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </Panel>

            <Panel title="Son gelen rezervasyonlar" href="/admin/bookings" className="lg:col-span-8">
              {p.bookings.recent.length === 0 ? <p className="text-[13px] text-[#5F7894]">Son 30 günde rezervasyon yok.</p> : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-[13px]">
                    <thead className="text-[12px] text-[#5F7894]">
                      <tr><th className="pb-2 font-normal">Geldiği</th><th className="pb-2 font-normal">Müşteri</th><th className="pb-2 font-normal">Uçuş</th><th className="pb-2 font-normal">Kişi</th><th className="pb-2 font-normal">Tutar</th><th className="pb-2 font-normal">Durum</th></tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E3654]">
                      {p.bookings.recent.map(b => (
                        <tr key={b.id}>
                          <td className="py-2 text-[#8098B3]">{ago(b.created_at)}</td>
                          <td className="py-2 text-[#E7EEF6]">{[b.first_name, b.last_name].filter(Boolean).join(' ') || 'İsimsiz'}</td>
                          <td className="py-2 tabular-nums text-[#C9D6E4]">{(b.flight_date || '').slice(0, 10)}</td>
                          <td className="py-2 tabular-nums text-[#C9D6E4]">{b.guests || 1}</td>
                          <td className="py-2 tabular-nums text-[#C9D6E4]">${nf(Number(b.total_price) || 0)}</td>
                          <td className="py-2" style={{ color: STATUS_COLOR[b.status] || '#8098B3' }}>{STATUS_TR[b.status] || b.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Panel>
          </div>
        </Section>

        {/* ───────── REKLAM VE SOSYAL ───────── */}
        <Section title="Reklam ve sosyal medya" note="Google Ads, Meta, Instagram, otomatik DM">
          <div className="grid gap-5 lg:grid-cols-12">
            <Panel title="Google Ads" icon={Search} href="/admin/google-ads" className="lg:col-span-6">
              {!gads ? <Skeleton h="h-40" /> : gads.error ? <ErrorLine msg={gads.error} /> : (
                <>
                  {(gads.campaigns || []).map((c: any) => (
                    <div key={c.id} className="mb-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-[14px]">{c.name}</div>
                        <div className="text-[12px] text-[#5F7894]">Günlük bütçe ₺{nf(c.budget)}</div>
                      </div>
                      <span className={`shrink-0 rounded-md px-2 py-0.5 text-[12px] ${['ELIGIBLE', 'LIMITED', 'LEARNING'].includes(c.status) ? 'bg-[#2DD4BF]/10 text-[#2DD4BF]' : 'bg-[#FBBF24]/10 text-[#FBBF24]'}`}>
                        {GADS_STATUS[c.status] || c.status}
                      </span>
                    </div>
                  ))}
                  {(gads.campaigns || []).length === 0 && <p className="mb-4 text-[13px] text-[#5F7894]">Aktif kampanya yok.</p>}
                  <div className="grid grid-cols-4 gap-3 border-t border-[#1E3654] pt-4">
                    <Stat value={nf(g7.impressions)} label="gösterim, 7g" />
                    <Stat value={nf(g7.clicks)} label="tıklama" />
                    <Stat value={g7.clicks ? `₺${nf(g7.cost / g7.clicks, 1)}` : '—'} label="tık başı" />
                    <Stat value={nf(g7.conversions, 0)} label="dönüşüm" />
                  </div>
                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-[12px] text-[#5F7894]">
                      <span>Tıklamalar, son 14 gün</span><span>Bugün ₺{nf(g7.todayCost)}</span>
                    </div>
                    <Bars values={g7.series} labels={g7.labels} />
                  </div>
                </>
              )}
            </Panel>

            <Panel title="Meta reklamları" icon={Megaphone} href="/admin/meta-ads" className="lg:col-span-6">
              {!meta ? <Skeleton h="h-40" /> : meta.account?.error ? <ErrorLine msg={meta.account.error} /> : (
                <>
                  <div className="flex items-end justify-between gap-4">
                    <Stat
                      value={metaStatus?.label || '—'}
                      label={meta.account?.name || 'Reklam hesabı'}
                      tone={metaStatus?.tone === 'ok' ? undefined : metaStatus?.tone}
                      sub={metaStatus?.tone !== 'ok' && meta.account?.balance ? `Ödenmemiş ₺${nf(Number(meta.account.balance))}` : undefined}
                    />
                    <Stat value={`₺${nf(metaSpend7)}`} label="harcama, 7 gün" />
                  </div>
                  <div className="mt-5 border-t border-[#1E3654] pt-4">
                    <div className="mb-2 text-[12px] text-[#5F7894]">Aktif kampanyalar</div>
                    {metaCampaigns.length === 0 ? <p className="text-[13px] text-[#5F7894]">Aktif kampanya yok.</p> : (
                      <ul className="space-y-2">
                        {metaCampaigns.map(c => (
                          <li key={c.id} className="flex items-center justify-between gap-3 text-[13px]">
                            <span className="truncate text-[#E7EEF6]">{c.name}</span>
                            <span className="shrink-0 tabular-nums text-[#8098B3]">{c.daily_budget ? `₺${nf(Number(c.daily_budget) / 100)}/gün` : ''}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {metaStatus && metaStatus.tone !== 'ok' && metaCampaigns.length > 0 && (
                      <p className="mt-3 text-[12px] text-[#FDE68A]">Hesap ödeme beklediği için bu kampanyalar şu an yayında değil.</p>
                    )}
                  </div>
                </>
              )}
            </Panel>
          </div>

          <div className="grid gap-5 lg:grid-cols-12">
            <Panel title="Instagram" icon={Instagram} href="/admin/instagram" className="lg:col-span-8" right={
              ig?.token?.username ? <span className="text-[12px] text-[#8098B3]">@{ig.token.username}</span> : null
            }>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                <Stat value={ig?.token?.followersCount != null ? nf(ig.token.followersCount) : '…'} label="takipçi" sub={ig?.token?.mediaCount != null ? `${nf(ig.token.mediaCount)} gönderi` : undefined} />
                <Stat value={ig ? nf(igReach30) : '…'} label="erişim, 30 gün" />
                <Stat
                  value={p.instagram.gapDays == null ? '—' : p.instagram.gapDays === 0 ? 'Bugün' : `${p.instagram.gapDays} gün`}
                  label="son paylaşımdan beri"
                  tone={p.instagram.gapDays != null && p.instagram.gapDays >= 3 ? 'warn' : undefined}
                />
                <Stat value={`${p.instagram.scheduled} / ${p.instagram.drafts}`} label="planlı / taslak" sub={p.instagram.failed ? `${p.instagram.failed} başarısız` : undefined} />
              </div>
              {igTop && (
                <div className="mt-5 flex gap-4 border-t border-[#1E3654] pt-4">
                  {igTop.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={igTop.image_url} alt="" className="h-16 w-16 shrink-0 rounded-md object-cover" loading="lazy" />
                  )}
                  <div className="min-w-0 text-[13px]">
                    <div className="text-[12px] text-[#5F7894]">En çok erişen gönderi</div>
                    <p className="mt-0.5 line-clamp-2 text-[#C9D6E4]">{igTop.caption}</p>
                    <div className="mt-1 tabular-nums text-[#8098B3]">{nf(igTop.reach || 0)} erişim, {nf(igTop.likes || 0)} beğeni, {nf(igTop.saved || 0)} kayıt</div>
                  </div>
                </div>
              )}
            </Panel>

            <Panel title="Otomatik DM" icon={MessageCircle} href="/admin/dm-automation" className="lg:col-span-4">
              <ul className="space-y-3 text-[13px]">
                {[{ l: 'Her yoruma DM', on: p.dm.general }, { l: 'Anahtar kelimeye DM', on: p.dm.keyword }].map(x => (
                  <li key={x.l} className="flex items-center justify-between">
                    <span className="text-[#C9D6E4]">{x.l}</span>
                    <span className={x.on ? 'text-[#2DD4BF]' : 'text-[#5F7894]'}>{x.on ? 'açık' : 'kapalı'}</span>
                  </li>
                ))}
              </ul>
              {p.dm.keywords.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.dm.keywords.slice(0, 10).map(k => <span key={k} className="rounded border border-[#1E3654] px-2 py-0.5 text-[12px] text-[#8098B3]">{k}</span>)}
                </div>
              )}
            </Panel>
          </div>
        </Section>

        {/* ───────── GÖRÜNÜRLÜK ───────── */}
        <Section title="Görünürlük" note="Google arama, ziyaretçi kaynakları, yapay zeka cevapları">
          <div className="grid gap-5 lg:grid-cols-12">
            <Panel title="Google arama, son 90 gün" icon={LineChart} href="/admin/analyze" className="lg:col-span-8" right={
              p.gsc.daily.length ? <span className="text-[12px] tabular-nums text-[#8098B3]">{nf(gscTotals90.c)} tıklama, {nf(gscTotals90.i)} gösterim</span> : null
            }>
              {p.gsc.error ? <ErrorLine msg={p.gsc.error} /> : <TrendLine rows={p.gsc.daily} />}
              <div className="mt-5 grid gap-6 border-t border-[#1E3654] pt-4 md:grid-cols-2">
                {[{ t: 'En çok tıklanan aramalar, 30 gün', rows: p.gsc.queries }, { t: 'En çok tıklanan sayfalar, 30 gün', rows: p.gsc.pages }].map(block => (
                  <div key={block.t}>
                    <div className="mb-2 text-[12px] text-[#5F7894]">{block.t}</div>
                    {block.rows.length === 0 ? <p className="text-[13px] text-[#5F7894]">Veri yok.</p> : (
                      <ul className="space-y-1.5 text-[13px]">
                        {block.rows.map(r => (
                          <li key={r.key} className="flex items-center justify-between gap-3">
                            <span className="truncate text-[#C9D6E4]" title={r.key}>{r.key}</span>
                            <span className="flex shrink-0 gap-3 tabular-nums text-[#8098B3]">
                              <span>{nf(r.clicks)}</span><span className="w-10 text-right text-[#5F7894]">#{nf(r.position, 1)}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </Panel>

            <div className="space-y-5 lg:col-span-4">
              <Panel title="Ziyaretçi kaynakları, 7 gün" icon={Globe2} href="/admin/analyze">
                {!ga4 ? <Skeleton h="h-32" /> : ga4.error ? <ErrorLine msg={ga4.error} /> : (
                  <ul className="space-y-2.5">
                    {channels.slice(0, 6).map(c => (
                      <li key={c.channel}>
                        <div className="mb-1 flex justify-between text-[13px]">
                          <span className="text-[#C9D6E4]">{c.channel}</span>
                          <span className="tabular-nums text-[#8098B3]">{chTotal ? Math.round((c.sessions / chTotal) * 100) : 0}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[#1E3654]">
                          <div className="h-1.5 rounded-full" style={{ width: `${(c.sessions / chMax) * 100}%`, background: c.channel === 'AI Assistant' ? '#A78BFA' : c.channel === 'Paid Search' ? '#F97316' : '#2DD4BF' }} />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>

              <Panel title="Yapay zeka cevapları" icon={Sparkles} href="/admin/ai-visibility">
                {!aiv ? <Skeleton h="h-20" /> : aiv.error ? <ErrorLine msg={aiv.error} /> : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <Stat value={aiRate != null ? `%${aiRate}` : '—'} label="görünme oranı" sub={aiv.latestCheckedAt ? `kontrol ${ago(aiv.latestCheckedAt)}` : undefined} />
                      <Stat value={(aiv.suggestions || []).filter((s: any) => s.status === 'pending').length} label="kaçırılan konu" />
                    </div>
                    {aiSources.length > 0 && (
                      <ul className="mt-4 space-y-1.5 border-t border-[#1E3654] pt-3 text-[13px]">
                        {aiSources.map(([src, v]) => (
                          <li key={src} className="flex justify-between">
                            <span className="capitalize text-[#C9D6E4]">{src}</span>
                            <span className="tabular-nums text-[#8098B3]">{v.mentioned}/{v.mentioned + v.missed}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </Panel>
            </div>
          </div>
        </Section>

        {/* ───────── İÇERİK VE OTOMASYON ───────── */}
        <Section title="İçerik ve otomasyon" note="ContentPilot, blog, yapay zeka ajanları">
          <div className="grid gap-5 lg:grid-cols-12">
            <Panel title="ContentPilot" icon={Bot} href="/admin/content-pilot" className="lg:col-span-4" right={
              <button
                role="switch" aria-checked={pilotOn} onClick={togglePilot} disabled={savingPilot}
                className={`relative h-5 w-9 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2DD4BF] ${pilotOn ? 'bg-[#2DD4BF]' : 'bg-[#1E3654]'}`}
                aria-label="ContentPilot otomatik çalışma"
              >
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${pilotOn ? 'left-[18px]' : 'left-0.5'}`} />
              </button>
            }>
              <div className="grid grid-cols-2 gap-4">
                <Stat value={p.pilot.articlesWeek} label="makale, 7 gün" sub={`toplam ${nf(p.pilot.articlesTotal)}`} />
                <Stat value={p.pilot.pendingTopics} label="bekleyen konu" tone={p.pilot.pendingTopics === 0 ? 'warn' : undefined} />
              </div>
              <p className="mt-4 text-[12px] text-[#5F7894]">
                {pilotOn ? `Otomatik çalışma açık: ${p.pilot.slots.join(', ')} UTC` : 'Otomatik çalışma kapalı'}
              </p>
              {p.pilot.latestArticles[0] && (
                <a href={`/blog/${p.pilot.latestArticles[0].slug}`} target="_blank" rel="noopener noreferrer" className="mt-2 block truncate text-[13px] text-[#C9D6E4] hover:text-[#2DD4BF]">
                  Son makale: {p.pilot.latestArticles[0].title}
                </a>
              )}
              <button
                onClick={runPilot} disabled={runState === 'running'}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#F97316] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#EA6A0F] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316]"
              >
                {runState === 'running' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                {runState === 'running' ? 'Makale yazılıyor…' : runState === 'ok' ? 'Makale yazıldı' : runState === 'err' ? 'Çalışmadı, tekrar dene' : 'Şimdi makale yaz'}
              </button>
            </Panel>

            <Panel title="Yapay zeka maliyeti" icon={Radar} href="/admin/mission-control" className="lg:col-span-3">
              <div className="space-y-4">
                <Stat value={`$${nf(p.pilot.costToday, 2)}`} label="bugün" />
                <div className="grid grid-cols-2 gap-4">
                  <Stat value={`$${nf(p.pilot.cost7, 2)}`} label="7 gün" />
                  <Stat value={`$${nf(p.pilot.cost30, 2)}`} label="30 gün" />
                </div>
                <div className="border-t border-[#1E3654] pt-3 text-[13px] text-[#8098B3]">
                  Son 7 günde {runsTotal} ajan kaydı
                  {Object.entries(p.pilot.runs7).length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {Object.entries(p.pilot.runs7).sort((a, b) => b[1] - a[1]).map(([st, n]) => (
                        <li key={st} className="flex justify-between">
                          <span className={st === 'error' ? 'text-[#F87171]' : 'text-[#C9D6E4]'}>{st}</span>
                          <span className="tabular-nums">{n}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </Panel>

            <Panel title="Ajanların son durumu" icon={Bot} href="/admin/mission-control" className="lg:col-span-5" right={
              <Link href="/admin/blog" className="text-[12px] text-[#8098B3] hover:text-[#E7EEF6]">Blog: {nf(p.pilot.blogPosts)} yazı</Link>
            }>
              {p.agents.length === 0 ? <p className="text-[13px] text-[#5F7894]">Kayıtlı ajan çalışması yok.</p> : (
                <ul className="divide-y divide-[#1E3654]">
                  {p.agents.map(a => (
                    <li key={a.agent} className="flex items-center justify-between gap-3 py-2.5 text-[13px]">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className={`h-2 w-2 shrink-0 rounded-full ${a.status === 'error' ? 'bg-[#F87171]' : a.status === 'running' || a.status === 'start' ? 'bg-[#FBBF24]' : 'bg-[#2DD4BF]'}`} aria-hidden />
                        <span className="capitalize text-[#E7EEF6]">{a.agent}</span>
                        <span className="truncate text-[#5F7894]">{a.action}</span>
                      </span>
                      <span className="shrink-0 tabular-nums text-[#8098B3]">{ago(a.created_at)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>
        </Section>

      </div>
    </div>
  )
}
