'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sora } from 'next/font/google'
import {
  ArrowUp, RefreshCw, Play, Loader2, AlertTriangle, Phone, CalendarDays,
  Search, Megaphone, Instagram, Bot, Sparkles, Globe2, ArrowUpRight, Ticket,
  MessageCircle, FileText, LineChart, Radar, ListChecks, Plus, Check, X,
  Camera, Video, Users, Wind, ChevronDown, Clock3, CircleDollarSign,
} from 'lucide-react'
import TicketModal, { type Booking as TicketBooking } from './bookings/TicketModal'

const sora = Sora({ subsets: ['latin', 'latin-ext'], weight: ['300', '400', '600', '700'], display: 'swap' })

/* ── palette ───────────────────────────────────────────────────────────── */
// night #0B1A2C · panel #10233A · line #1E3654 · ink #E7EEF6 · mute #8098B3
// brand orange #F97316 · lagoon #2DD4BF · warn #FBBF24 · bad #F87171

type Station = {
  label: string; elevation: string; temperatureC: number | null; windSpeedKmh: number | null
  windGustKmh: number | null; windDirectionDeg: number | null; weatherCode: number | null; humidity: number | null
}
type Booking = {
  id: string; first_name?: string; last_name?: string; email?: string; flight_date: string; flight_type?: string
  guests?: number; total_price?: number; base_price?: number; addon_price?: number; status: string; phone?: string
  addon_photo?: boolean; addon_video?: boolean; addon_bundle?: boolean; notes?: string; admin_notes?: string
  created_at?: string
}
type Props = {
  today: string
  weather: { stations: Station[]; fetchedAt: string } | null
  bookings: {
    todayFlights: Booking[]; upcoming: Booking[]; pendingList: Booking[]; newToday: number; newWeek: number; newMonth: number
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
const STATION_ORDER = ['Babadağ Summit', 'Babadağ 1200m Take-off', 'Ölüdeniz Beach (Landing)']
const STATION_TR: Record<string, string> = {
  'Babadağ Summit': 'Zirve kalkış', 'Babadağ 1200m Take-off': '1200 kalkış', 'Ölüdeniz Beach (Landing)': 'İniş, plaj',
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
const STATUS_TR: Record<string, string> = { pending: 'bekliyor', confirmed: 'onaylı', completed: 'uçtu', cancelled: 'iptal' }
const STATUS_COLOR: Record<string, string> = { pending: '#FBBF24', confirmed: '#2DD4BF', completed: '#7DD3FC', cancelled: '#F87171' }
const TYPE_TR: Record<string, string> = { standard: 'Standart', high: 'Yüksek irtifa', sunset: 'Gün batımı', acro: 'Akro' }
const CARDINAL = ['K', 'KD', 'D', 'GD', 'G', 'GB', 'B', 'KB']

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
const addDays = (iso: string, n: number) => {
  const t = new Date(iso + 'T12:00:00Z'); t.setUTCDate(t.getUTCDate() + n)
  return t.toISOString().slice(0, 10)
}
const dayLabel = (iso: string, today: string) => {
  const d = iso.slice(0, 10)
  if (d === today) return 'Bugün'
  if (d === addDays(today, 1)) return 'Yarın'
  return new Intl.DateTimeFormat('tr-TR', { weekday: 'long', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(d + 'T12:00:00Z'))
}
const fullName = (b: Booking) => [b.first_name, b.last_name].filter(Boolean).join(' ') || 'İsimsiz'
const waLink = (phone: string) => `https://wa.me/${phone.replace(/\D/g, '')}`
const media = (b: Booking) => (b.addon_bundle ? 'bundle' : b.addon_photo && b.addon_video ? 'bundle' : b.addon_video ? 'video' : b.addon_photo ? 'photo' : null)

// Rough colour hint for wind strength. Pilot judgement always decides.
function windTone(st: Station): 'ok' | 'warn' | 'bad' | 'none' {
  if (st.windSpeedKmh == null) return 'none'
  const s = Math.max(st.windSpeedKmh, st.windGustKmh ?? 0)
  return s >= 30 ? 'bad' : s >= 20 ? 'warn' : 'ok'
}
const TONE_TEXT = { ok: 'text-[#2DD4BF]', warn: 'text-[#FBBF24]', bad: 'text-[#F87171]', none: 'text-[#8098B3]' }

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
    <section className={`rounded-2xl border border-[#1E3654] bg-[#10233A]/70 p-4 sm:p-5 ${className}`}>
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

function Stat({ value, label, sub, tone, size = 28 }: { value: React.ReactNode; label: string; sub?: React.ReactNode; tone?: 'ok' | 'warn' | 'bad'; size?: number }) {
  const color = tone === 'bad' ? 'text-[#F87171]' : tone === 'warn' ? 'text-[#FBBF24]' : tone === 'ok' ? 'text-[#2DD4BF]' : 'text-[#E7EEF6]'
  return (
    <div className="min-w-0">
      <div className={`${sora.className} font-light leading-none tabular-nums ${color}`} style={{ fontSize: size }}>{value}</div>
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
          <div className="w-full rounded-sm" style={{ height: `${Math.max(3, (v / max) * 64)}px`, background: v > 0 ? accent : '#1E3654' }} />
          <span className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-[#E7EEF6] px-1.5 py-0.5 text-[11px] text-[#0B1A2C] group-hover:block">
            {labels[i]}: {v}
          </span>
        </div>
      ))}
    </div>
  )
}

function MediaBadge({ b }: { b: Booking }) {
  const m = media(b)
  if (!m) return null
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-[#A78BFA]/15 px-1.5 py-0.5 text-[11px] text-[#C4B5FD]">
      {m !== 'video' && <Camera className="h-3 w-3" aria-hidden />}
      {m !== 'photo' && <Video className="h-3 w-3" aria-hidden />}
      {m === 'bundle' ? 'foto+video' : m === 'video' ? 'video' : 'foto'}
    </span>
  )
}

/* ── wind ──────────────────────────────────────────────────────────────── */
function WindStation({ st }: { st: Station }) {
  const tone = windTone(st)
  const dir = st.windDirectionDeg
  return (
    <div className="min-w-0 rounded-xl bg-[#0B1A2C]/60 p-3 sm:p-4" title={st.weatherCode != null ? WMO[st.weatherCode] : undefined}>
      <div className="flex items-baseline justify-between gap-2 text-[12px]">
        <span className="truncate text-[#C9D6E4]">{STATION_TR[st.label] || st.label}</span>
        <span className="shrink-0 tabular-nums text-[#5F7894]">{st.elevation.replace(' ASL', '')}</span>
      </div>
      <div className="mt-2 flex items-end gap-2">
        <span className={`${sora.className} text-[34px] font-light leading-none tabular-nums sm:text-[40px] ${TONE_TEXT[tone]}`}>
          {st.windSpeedKmh != null ? Math.round(st.windSpeedKmh) : '—'}
        </span>
        <span className="pb-1 text-[12px] text-[#5F7894]">km/s</span>
        <span className="ml-auto flex flex-col items-center pb-0.5">
          <ArrowUp
            className="h-5 w-5 text-[#E7EEF6]"
            style={{ transform: `rotate(${((dir ?? 0) + 180) % 360}deg)` }}
            aria-label={`Rüzgar ${dir != null ? Math.round(dir) : '—'} dereceden esiyor`}
          />
          <span className="text-[11px] text-[#8098B3]">{dir != null ? CARDINAL[Math.round(dir / 45) % 8] : '—'}</span>
        </span>
      </div>
      <div className="mt-2 flex gap-3 text-[12px] tabular-nums text-[#8098B3]">
        {st.windGustKmh != null && <span>hamle {Math.round(st.windGustKmh)}</span>}
        {st.temperatureC != null && <span>{Math.round(st.temperatureC)}°C</span>}
        {st.humidity != null && <span>nem %{Math.round(st.humidity)}</span>}
      </div>
    </div>
  )
}

/* ── two-month flight calendar ─────────────────────────────────────────── */
const TR_MONTH = new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric', timeZone: 'UTC' })
function MonthGrid({ year, month, days, today, onPick }: {
  year: number; month: number; days: Props['calendar']['days']; today: string; onPick?: (d: string) => void
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
            <button
              type="button"
              key={i}
              onClick={() => onPick?.(key)}
              title={info ? `${info.bookings} rezervasyon, ${info.guests} yolcu${info.pending ? `, ${info.pending} bekliyor` : ''}` : undefined}
              className={`relative flex h-7 items-center justify-center rounded text-[11px] tabular-nums ${isToday ? 'ring-1 ring-[#2DD4BF]' : ''} ${past && !info ? 'text-[#35506F]' : 'text-[#C9D6E4]'}`}
              style={info ? { background: `rgba(249,115,22,${alpha})`, color: '#fff' } : { background: '#0F2136' }}
            >
              {d}
              {info?.pending ? <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-[#FBBF24]" aria-hidden /> : null}
            </button>
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
  const fmtD = (d: string) => new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short' }).format(new Date(d + 'T12:00:00'))
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-36 w-full" role="img" aria-label="Son 90 gün Google arama tıklama ve gösterim grafiği">
        <polygon points={areaI} fill="#2DD4BF" opacity="0.12" />
        <polyline points={lineC} fill="none" stroke="#F97316" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-2 flex justify-between text-[12px] text-[#5F7894]">
        <span>{fmtD(rows[0].date)}</span>
        <span className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-[#F97316]" />tıklama</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-4 bg-[#2DD4BF]/30" />gösterim</span>
        </span>
        <span>{fmtD(rows[rows.length - 1].date)}</span>
      </div>
    </div>
  )
}

/* ── main ──────────────────────────────────────────────────────────────── */
type TabKey = 'ads' | 'visibility' | 'content' | 'bookings'
const TABS: { key: TabKey; label: string; icon: any }[] = [
  { key: 'ads', label: 'Reklam & sosyal', icon: Megaphone },
  { key: 'visibility', label: 'Görünürlük', icon: LineChart },
  { key: 'content', label: 'İçerik & AI', icon: Bot },
  { key: 'bookings', label: 'Rezervasyon analizi', icon: ListChecks },
]

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

  // operations state
  const [day, setDay] = useState<string>(p.today)
  const [statusOverride, setStatusOverride] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null)
  const [ticketFor, setTicketFor] = useState<Booking | null>(null)
  const [showAllAlerts, setShowAllAlerts] = useState(false)
  const [tab, setTab] = useState<TabKey>('ads')

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
    try {
      const saved = localStorage.getItem('atmos-admin-tab') as TabKey | null
      if (saved && TABS.some(x => x.key === saved)) setTab(saved)
    } catch {}
    loadExternal()
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function pickTab(k: TabKey) {
    setTab(k)
    try { localStorage.setItem('atmos-admin-tab', k) } catch {}
  }

  async function refreshAll() {
    setRefreshing(true)
    setGads(null); setMeta(null); setGscStats(null); setGa4(null); setAiv(null); setIg(null)
    setStatusOverride({})
    router.refresh()
    await loadExternal()
    setRefreshing(false)
  }

  async function setStatus(b: Booking, status: string) {
    setBusy(b.id); setActionError(null); setConfirmCancel(null)
    setStatusOverride(s => ({ ...s, [b.id]: status }))
    try {
      const r = await fetch('/api/bookings', {
        method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: b.id, status }),
      })
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || `HTTP ${r.status}`)
      router.refresh()
    } catch (e: any) {
      setStatusOverride(s => { const n = { ...s }; delete n[b.id]; return n })
      setActionError(`${fullName(b)} güncellenemedi: ${e?.message || 'hata'}`)
    }
    setBusy(null)
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
  const st = (b: Booking) => statusOverride[b.id] || b.status

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

  // next 7 days, grouped
  const week = useMemo(() => Array.from({ length: 8 }, (_, i) => addDays(p.today, i)), [p.today])
  const byDay = useMemo(() => {
    const m: Record<string, Booking[]> = {}
    for (const b of p.bookings.upcoming) (m[(b.flight_date || '').slice(0, 10)] ||= []).push(b)
    return m
  }, [p.bookings.upcoming])
  const dayList = (byDay[day] || []).filter(b => st(b) !== 'cancelled')
  const dayGuests = dayList.reduce((s, b) => s + (b.guests || 1), 0)
  const dayMedia = dayList.filter(b => media(b)).length
  const dayPending = dayList.filter(b => st(b) === 'pending').length

  const todayLive = p.bookings.todayFlights.filter(b => st(b) !== 'cancelled')
  const todayGuests = todayLive.reduce((s, b) => s + (b.guests || 1), 0)
  const todayDone = todayLive.filter(b => st(b) === 'completed').length
  const todayMedia = todayLive.filter(b => media(b)).length

  const pendingOpen = p.bookings.pendingList.filter(b => st(b) === 'pending')

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

  const stations = p.weather ? [...p.weather.stations].sort((x, y) => STATION_ORDER.indexOf(x.label) - STATION_ORDER.indexOf(y.label)) : []

  const alerts: { tone: 'warn' | 'bad'; text: string; href?: string }[] = []
  if (ig?.token && ig.token.valid === false) alerts.push({ tone: 'bad', text: 'Instagram bağlantısının süresi dolmuş, yeniden bağlanmalı', href: '/admin/instagram' })
  for (const a of p.agents) if (a.status === 'error') alerts.push({ tone: 'bad', text: `${a.agent} ajanı son çalışmasında hata verdi (${ago(a.created_at)}): ${(a.error || a.action || '').slice(0, 90)}`, href: '/admin/mission-control' })
  if (metaStatus && metaStatus.tone !== 'ok') alerts.push({ tone: metaStatus.tone, text: `Meta reklam hesabı: ${metaStatus.label}${meta?.account?.balance ? ` (₺${nf(Number(meta.account.balance))})` : ''}`, href: '/admin/meta-ads' })
  if (p.bookings.stalePending > 0) alerts.push({ tone: 'warn', text: `${p.bookings.stalePending} geçmiş rezervasyon hâlâ "bekliyor". Uçtu ya da iptal olarak işaretle.`, href: '/admin/bookings' })
  if (gads?.error) alerts.push({ tone: 'warn', text: `Google Ads verisi alınamadı: ${gads.error}`, href: '/admin/google-ads' })
  if (p.instagram.failed > 0) alerts.push({ tone: 'warn', text: `${p.instagram.failed} Instagram gönderisi başarısız`, href: '/admin/instagram' })
  if (p.instagram.gapDays != null && p.instagram.gapDays >= 3) alerts.push({ tone: 'warn', text: `Instagram'a ${p.instagram.gapDays} gündür paylaşım yapılmadı`, href: '/admin/instagram' })
  if (ig?.token?.daysLeft != null && ig.token.daysLeft < 10) alerts.push({ tone: 'warn', text: `Instagram bağlantısı ${ig.token.daysLeft} gün sonra sona eriyor`, href: '/admin/instagram' })
  if (p.gsc.error) alerts.push({ tone: 'warn', text: `Search Console: ${p.gsc.error}`, href: '/admin/analyze' })
  const shownAlerts = showAllAlerts ? alerts : alerts.slice(0, 2)

  const dateTitle = now ? new Intl.DateTimeFormat('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Istanbul' }).format(now) : ''
  const clock = now ? new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' }).format(now) : ''

  const shortcuts = [
    { href: '/admin/ticket', label: 'Bilet bas', icon: Ticket },
    { href: '/admin/bookings', label: 'Rezervasyonlar', icon: ListChecks },
    { href: '/admin/calendar', label: 'Takvim', icon: CalendarDays },
    { href: '/live-weather', label: 'Canlı hava', icon: Wind },
    { href: '/admin/instagram', label: 'Instagram', icon: Instagram },
    { href: '/admin/google-ads/create', label: 'Google kampanyası', icon: Plus },
    { href: '/admin/meta-ads/create', label: 'Meta kampanyası', icon: Plus },
    { href: '/admin/blog', label: 'Blog', icon: FileText },
    { href: '/admin/mission-control', label: 'Mission Control', icon: Radar },
  ]

  const btn = 'inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[12px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2DD4BF] disabled:opacity-50'

  /* booking row with actions */
  const FlightRow = ({ b, showDate = false }: { b: Booking; showDate?: boolean }) => {
    const s = st(b)
    const isBusy = busy === b.id
    const flightDay = (b.flight_date || '').slice(0, 10)
    return (
      <li className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: STATUS_COLOR[s] || '#8098B3' }} aria-hidden />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="truncate text-[15px] text-[#E7EEF6]">{fullName(b)}</span>
              <span className="inline-flex items-center gap-1 text-[12px] tabular-nums text-[#8098B3]"><Users className="h-3 w-3" aria-hidden />{b.guests || 1}</span>
              <MediaBadge b={b} />
            </div>
            <div className="mt-0.5 flex flex-wrap gap-x-3 text-[12px] text-[#5F7894]">
              {showDate && <span className="capitalize text-[#8098B3]">{dayLabel(flightDay, p.today)}</span>}
              <span>{TYPE_TR[b.flight_type || 'standard'] || b.flight_type}</span>
              {b.total_price ? <span className="tabular-nums">${nf(Number(b.total_price))}</span> : null}
              <span style={{ color: STATUS_COLOR[s] || '#8098B3' }}>{STATUS_TR[s] || s}</span>
            </div>
            {b.notes && <p className="mt-1 line-clamp-2 text-[12px] italic text-[#8098B3]">“{b.notes}”</p>}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 pl-5 sm:pl-0">
          {s === 'pending' && (
            <button disabled={isBusy} onClick={() => setStatus(b, 'confirmed')} className={`${btn} bg-[#2DD4BF] text-[#0B1A2C] hover:bg-[#5EEAD4]`}>
              {isBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}Onayla
            </button>
          )}
          {s === 'confirmed' && flightDay <= p.today && (
            <button disabled={isBusy} onClick={() => setStatus(b, 'completed')} className={`${btn} border border-[#7DD3FC]/40 text-[#7DD3FC] hover:bg-[#7DD3FC]/10`}>
              {isBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}Uçtu
            </button>
          )}
          {b.phone && (
            <>
              <a href={waLink(b.phone)} target="_blank" rel="noopener noreferrer" className={`${btn} border border-[#1E3654] text-[#C9D6E4] hover:border-[#25D366] hover:text-[#25D366]`} aria-label={`${fullName(b)} WhatsApp`}>
                <MessageCircle className="h-3.5 w-3.5" />WA
              </a>
              <a href={`tel:${b.phone.replace(/[^\d+]/g, '')}`} className={`${btn} border border-[#1E3654] text-[#C9D6E4] hover:border-[#2DD4BF]`} aria-label={`${fullName(b)} ara`}>
                <Phone className="h-3.5 w-3.5" />
              </a>
            </>
          )}
          <button onClick={() => setTicketFor(b)} className={`${btn} border border-[#1E3654] text-[#C9D6E4] hover:border-[#F97316] hover:text-white`} aria-label={`${fullName(b)} bilet`}>
            <Ticket className="h-3.5 w-3.5" />Bilet
          </button>
        </div>
      </li>
    )
  }

  return (
    <div className="-m-4 min-h-screen bg-[#0B1A2C] px-3 py-5 text-[#E7EEF6] sm:px-6 md:-m-8 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1400px] space-y-5">

        {/* ── header ── */}
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[13px] capitalize text-[#8098B3]">{dateTitle}</p>
            <h1 className={`${sora.className} mt-1 text-[24px] font-semibold tracking-tight sm:text-[28px]`}>Uçuş masası</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className={`${sora.className} text-[24px] font-light tabular-nums text-[#8098B3]`} aria-label="Saat (İstanbul)">{clock}</span>
            <button
              onClick={refreshAll}
              className="flex items-center gap-2 rounded-lg border border-[#1E3654] px-3 py-2 text-[13px] text-[#8098B3] hover:border-[#2DD4BF] hover:text-[#E7EEF6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2DD4BF]"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} aria-hidden /><span className="hidden sm:inline">Yenile</span>
            </button>
          </div>
        </header>

        {/* ── alerts (compact) ── */}
        {alerts.length > 0 && (
          <div className="space-y-1.5" aria-label="Dikkat gerektirenler">
            {shownAlerts.map((a, i) => (
              <Link
                key={i}
                href={a.href || '#'}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2DD4BF] ${a.tone === 'bad' ? 'border-[#F87171]/40 bg-[#F87171]/10 text-[#FCA5A5]' : 'border-[#FBBF24]/30 bg-[#FBBF24]/5 text-[#FDE68A]'}`}
              >
                <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden /><span className="min-w-0">{a.text}</span>
              </Link>
            ))}
            {alerts.length > 2 && (
              <button onClick={() => setShowAllAlerts(v => !v)} className="flex items-center gap-1 px-1 text-[12px] text-[#8098B3] hover:text-[#E7EEF6]">
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAllAlerts ? 'rotate-180' : ''}`} />
                {showAllAlerts ? 'Daha az göster' : `${alerts.length - 2} uyarı daha`}
              </button>
            )}
          </div>
        )}

        {/* ── HERO: wind + today ── */}
        <div className="grid gap-4 lg:grid-cols-12">
          <section className="rounded-2xl border border-[#1E3654] bg-gradient-to-br from-[#10233A] to-[#0F2136] p-4 sm:p-5 lg:col-span-8" aria-label="Babadağ rüzgarı">
            <header className="mb-3 flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-[13px] font-medium text-[#8098B3]"><Wind className="h-4 w-4" aria-hidden />Babadağ rüzgarı, şu an</h2>
              <span className="flex items-center gap-3 text-[11px] text-[#5F7894]">
                <span className="hidden items-center gap-2 sm:flex">
                  <span className="text-[#2DD4BF]">● &lt;20</span><span className="text-[#FBBF24]">● 20–30</span><span className="text-[#F87171]">● 30+</span>
                </span>
                {p.weather?.fetchedAt && <span>{ago(p.weather.fetchedAt)}</span>}
                <Link href="/live-weather" className="text-[#8098B3] hover:text-[#E7EEF6]" aria-label="Canlı hava sayfası"><ArrowUpRight className="h-4 w-4" /></Link>
              </span>
            </header>
            {!p.weather ? <ErrorLine msg="Hava durumu alınamadı" /> : (
              <div className="grid grid-cols-1 gap-2 min-[480px]:grid-cols-3 sm:gap-3">
                {stations.map(s => <WindStation key={s.label} st={s} />)}
              </div>
            )}
          </section>

          <Link href="/admin/bookings" className="group rounded-2xl border border-[#F97316]/30 bg-[#F97316]/[0.07] p-4 hover:border-[#F97316]/60 sm:p-5 lg:col-span-4" aria-label="Bugünün özeti">
            <div className="mb-3 flex items-center justify-between text-[13px] font-medium text-[#FDBA74]">
              <span>Bugün</span><ArrowUpRight className="h-4 w-4 opacity-60 group-hover:opacity-100" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Stat value={todayLive.length} label="uçuş" sub={todayDone ? `${todayDone} tamamlandı` : undefined} size={36} />
              <Stat value={todayGuests} label="yolcu" size={36} />
              <Stat value={pendingOpen.length} label="onay bekleyen" tone={pendingOpen.length ? 'warn' : undefined} size={24} />
              <Stat value={todayMedia} label="foto/video paketi" size={24} />
            </div>
          </Link>
        </div>

        {/* ── OPERATIONS: flights + pending/calendar ── */}
        <div className="grid gap-4 lg:grid-cols-12">
          <section className="rounded-2xl border border-[#1E3654] bg-[#10233A]/70 lg:col-span-8" aria-label="Uçuş listesi">
            {/* day picker */}
            <div className="flex gap-1.5 overflow-x-auto border-b border-[#1E3654] p-3 [scrollbar-width:none]" role="tablist" aria-label="Gün seç">
              {week.map(d => {
                const list = (byDay[d] || []).filter(b => st(b) !== 'cancelled')
                const g = list.reduce((s, b) => s + (b.guests || 1), 0)
                const pend = list.some(b => st(b) === 'pending')
                const active = d === day
                const lbl = d === p.today ? 'Bugün' : d === addDays(p.today, 1) ? 'Yarın'
                  : new Intl.DateTimeFormat('tr-TR', { weekday: 'short', timeZone: 'UTC' }).format(new Date(d + 'T12:00:00Z'))
                return (
                  <button
                    key={d}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setDay(d)}
                    className={`relative flex min-w-[64px] shrink-0 flex-col items-center rounded-xl px-3 py-2 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2DD4BF] ${active ? 'bg-[#F97316] text-white' : 'bg-[#0B1A2C]/60 text-[#C9D6E4] hover:bg-[#13294A]'}`}
                  >
                    <span className="text-[12px] capitalize">{lbl}</span>
                    <span className={`text-[11px] tabular-nums ${active ? 'text-white/80' : 'text-[#5F7894]'}`}>{Number(d.slice(8))}</span>
                    <span className={`${sora.className} mt-0.5 text-[16px] tabular-nums ${!g && !active ? 'text-[#35506F]' : ''}`}>{g || '·'}</span>
                    {pend && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#FBBF24]" aria-label="onay bekleyen var" />}
                  </button>
                )
              })}
            </div>
            <div className="p-4 sm:p-5">
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className={`${sora.className} text-[18px] font-semibold capitalize`}>{dayLabel(day, p.today)}</h2>
                <span className="text-[12px] tabular-nums text-[#8098B3]">
                  {dayList.length} rezervasyon · {dayGuests} yolcu{dayMedia ? ` · ${dayMedia} medya` : ''}{dayPending ? ` · ${dayPending} bekliyor` : ''}
                </span>
              </div>
              {actionError && <div className="my-2"><ErrorLine msg={actionError} /></div>}
              {dayList.length === 0 ? (
                <p className="py-6 text-center text-[13px] text-[#5F7894]">Bu gün için kayıtlı uçuş yok.</p>
              ) : (
                <ul className="divide-y divide-[#1E3654]">
                  {dayList.map(b => <FlightRow key={b.id} b={b} />)}
                </ul>
              )}
            </div>
          </section>

          <div className="space-y-4 lg:col-span-4">
            <Panel title="Onay bekleyenler" icon={Clock3} href="/admin/bookings" right={pendingOpen.length ? <span className="rounded-full bg-[#FBBF24]/15 px-2 text-[12px] tabular-nums text-[#FBBF24]">{pendingOpen.length}</span> : null}>
              {pendingOpen.length === 0 ? (
                <p className="text-[13px] text-[#5F7894]">Bekleyen rezervasyon yok.</p>
              ) : (
                <ul className="divide-y divide-[#1E3654]">
                  {pendingOpen.slice(0, 8).map(b => (
                    <li key={b.id} className="py-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate text-[14px]">{fullName(b)} <span className="text-[12px] text-[#8098B3]">· {b.guests || 1} kişi</span></div>
                          <div className="text-[12px] capitalize text-[#5F7894]">{dayLabel(b.flight_date, p.today)}{b.created_at ? ` · geldi ${ago(b.created_at)}` : ''}</div>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          {b.phone && (
                            <a href={waLink(b.phone)} target="_blank" rel="noopener noreferrer" className={`${btn} border border-[#1E3654] text-[#C9D6E4] hover:text-[#25D366]`} aria-label="WhatsApp"><MessageCircle className="h-3.5 w-3.5" /></a>
                          )}
                          <button disabled={busy === b.id} onClick={() => setStatus(b, 'confirmed')} className={`${btn} bg-[#2DD4BF] text-[#0B1A2C] hover:bg-[#5EEAD4]`} aria-label={`${fullName(b)} onayla`}>
                            {busy === b.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                          </button>
                          {confirmCancel === b.id ? (
                            <button disabled={busy === b.id} onClick={() => setStatus(b, 'cancelled')} className={`${btn} bg-[#F87171] text-[#0B1A2C]`}>İptal et?</button>
                          ) : (
                            <button onClick={() => setConfirmCancel(b.id)} className={`${btn} border border-[#1E3654] text-[#8098B3] hover:border-[#F87171] hover:text-[#F87171]`} aria-label={`${fullName(b)} iptal`}><X className="h-3.5 w-3.5" /></button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel title="Uçuş takvimi" icon={CalendarDays} href="/admin/calendar" right={
              <span className="flex items-center gap-3 text-[11px] text-[#5F7894]">
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-[#F97316]" />yolcu</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#FBBF24]" />bekleyen</span>
              </span>
            }>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <MonthGrid year={cy} month={cm} days={p.calendar.days} today={p.today} onPick={d => { if (week.includes(d)) setDay(d) }} />
                <MonthGrid year={nextMonth.y} month={nextMonth.m} days={p.calendar.days} today={p.today} onPick={d => { if (week.includes(d)) setDay(d) }} />
              </div>
            </Panel>
          </div>
        </div>

        {/* ── business pulse ── */}
        <section aria-label="İşletme nabzı">
          <h2 className="mb-2 flex items-center gap-2 text-[13px] font-medium text-[#8098B3]"><CircleDollarSign className="h-4 w-4" aria-hidden />İşletme nabzı</h2>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#1E3654] bg-[#1E3654] md:grid-cols-3 xl:grid-cols-6">
            {[
              { v: p.bookings.newWeek, l: 'Yeni rezervasyon, 7 gün', s: `Bugün ${p.bookings.newToday}, 30 günde ${p.bookings.newMonth}` },
              { v: `$${nf(p.bookings.revenueMonth)}`, l: 'Rezervasyon tutarı, 30 gün', s: `${p.bookings.guestsMonth} yolcu, iptaller hariç` },
              { v: gads ? `₺${nf(g7.cost)}` : '…', l: 'Google Ads, 7 gün', s: gads ? `${nf(g7.clicks)} tıklama, ${nf(g7.conversions, 0)} dönüşüm` : 'yükleniyor' },
              { v: metaStatus ? (metaStatus.tone === 'ok' ? `₺${nf(metaSpend7)}` : 'Durdu') : '…', l: 'Meta reklam, 7 gün', s: metaStatus ? (metaStatus.tone === 'ok' ? 'harcama' : metaStatus.label) : 'yükleniyor', tone: metaStatus && metaStatus.tone !== 'ok' ? metaStatus.tone : undefined },
              { v: ga4?.overview ? nf(ga4.overview.activeUsers) : '…', l: 'Site ziyaretçisi, 7 gün', s: ga4?.overview ? `${nf(ga4.overview.sessions)} oturum` : ga4?.error ? 'alınamadı' : 'yükleniyor' },
              { v: gscStats?.gsc7d ? nf(gscStats.gsc7d.clicks) : '…', l: 'Google arama, 7 gün', s: gscStats?.gsc7d ? `ort. sıra ${nf(gscStats.gsc7d.position, 1)}` : gscStats?.error ? 'alınamadı' : 'yükleniyor' },
            ].map((k, i) => (
              <div key={i} className="bg-[#0F2136] p-4 sm:p-5">
                <Stat value={k.v} label={k.l} sub={k.s} tone={(k as any).tone} size={26} />
              </div>
            ))}
          </div>
        </section>

        {/* ── shortcuts ── */}
        <nav aria-label="Kısayollar" className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {shortcuts.map(s => (
            <Link key={s.href} href={s.href} className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#1E3654] px-3 py-1.5 text-[13px] text-[#C9D6E4] hover:border-[#F97316] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2DD4BF]">
              <s.icon className="h-3.5 w-3.5 text-[#8098B3]" aria-hidden />{s.label}
            </Link>
          ))}
        </nav>

        {/* ── TABS: everything else ── */}
        <section className="space-y-4" aria-label="Detaylar">
          <div className="-mx-3 flex gap-1 overflow-x-auto border-b border-[#1E3654] px-3 [scrollbar-width:none] sm:mx-0 sm:px-0" role="tablist">
            {TABS.map(t => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => pickTab(t.key)}
                className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-[14px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2DD4BF] ${tab === t.key ? 'border-[#F97316] text-[#E7EEF6]' : 'border-transparent text-[#8098B3] hover:text-[#E7EEF6]'}`}
              >
                <t.icon className="h-4 w-4" aria-hidden />{t.label}
              </button>
            ))}
          </div>

          {tab === 'ads' && (
            <div className="grid gap-4 lg:grid-cols-12">
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
                    <div className="grid grid-cols-2 gap-4 border-t border-[#1E3654] pt-4 sm:grid-cols-4">
                      <Stat value={nf(g7.impressions)} label="gösterim, 7g" size={22} />
                      <Stat value={nf(g7.clicks)} label="tıklama" size={22} />
                      <Stat value={g7.clicks ? `₺${nf(g7.cost / g7.clicks, 1)}` : '—'} label="tık başı" size={22} />
                      <Stat value={nf(g7.conversions, 0)} label="dönüşüm" size={22} />
                    </div>
                    <div className="mt-5">
                      <div className="mb-2 flex justify-between text-[12px] text-[#5F7894]"><span>Tıklamalar, son 14 gün</span><span>Bugün ₺{nf(g7.todayCost)}</span></div>
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
                        size={22}
                      />
                      <Stat value={`₺${nf(metaSpend7)}`} label="harcama, 7 gün" size={22} />
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

              <Panel title="Instagram" icon={Instagram} href="/admin/instagram" className="lg:col-span-8" right={ig?.token?.username ? <span className="text-[12px] text-[#8098B3]">@{ig.token.username}</span> : null}>
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                  <Stat value={ig?.token?.followersCount != null ? nf(ig.token.followersCount) : '…'} label="takipçi" sub={ig?.token?.mediaCount != null ? `${nf(ig.token.mediaCount)} gönderi` : undefined} size={24} />
                  <Stat value={ig ? nf(igReach30) : '…'} label="erişim, 30 gün" size={24} />
                  <Stat value={p.instagram.gapDays == null ? '—' : p.instagram.gapDays === 0 ? 'Bugün' : `${p.instagram.gapDays} gün`} label="son paylaşımdan beri" tone={p.instagram.gapDays != null && p.instagram.gapDays >= 3 ? 'warn' : undefined} size={24} />
                  <Stat value={`${p.instagram.scheduled} / ${p.instagram.drafts}`} label="planlı / taslak" sub={p.instagram.failed ? `${p.instagram.failed} başarısız` : undefined} size={24} />
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

              <Panel title="Otomatik DM" icon={MessageCircle} href="/admin/instagram#dm" className="lg:col-span-4">
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
          )}

          {tab === 'visibility' && (
            <div className="grid gap-4 lg:grid-cols-12">
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

              <div className="space-y-4 lg:col-span-4">
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
                        <Stat value={aiRate != null ? `%${aiRate}` : '—'} label="görünme oranı" sub={aiv.latestCheckedAt ? `kontrol ${ago(aiv.latestCheckedAt)}` : undefined} size={24} />
                        <Stat value={(aiv.suggestions || []).filter((s: any) => s.status === 'pending').length} label="kaçırılan konu" size={24} />
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
          )}

          {tab === 'content' && (
            <div className="grid gap-4 lg:grid-cols-12">
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
                  <Stat value={p.pilot.articlesWeek} label="makale, 7 gün" sub={`toplam ${nf(p.pilot.articlesTotal)}`} size={24} />
                  <Stat value={p.pilot.pendingTopics} label="bekleyen konu" tone={p.pilot.pendingTopics === 0 ? 'warn' : undefined} size={24} />
                </div>
                <p className="mt-4 text-[12px] text-[#5F7894]">{pilotOn ? `Otomatik çalışma açık: ${p.pilot.slots.join(', ')} UTC` : 'Otomatik çalışma kapalı'}</p>
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
                  <Stat value={`$${nf(p.pilot.costToday, 2)}`} label="bugün" size={24} />
                  <div className="grid grid-cols-2 gap-4">
                    <Stat value={`$${nf(p.pilot.cost7, 2)}`} label="7 gün" size={20} />
                    <Stat value={`$${nf(p.pilot.cost30, 2)}`} label="30 gün" size={20} />
                  </div>
                  <div className="border-t border-[#1E3654] pt-3 text-[13px] text-[#8098B3]">
                    Son 7 günde {runsTotal} ajan kaydı
                    {Object.entries(p.pilot.runs7).length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {Object.entries(p.pilot.runs7).sort((a, b) => b[1] - a[1]).map(([s, n]) => (
                          <li key={s} className="flex justify-between">
                            <span className={s === 'error' ? 'text-[#F87171]' : 'text-[#C9D6E4]'}>{s}</span>
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
          )}

          {tab === 'bookings' && (
            <div className="grid gap-4 lg:grid-cols-12">
              <Panel title="Son 30 gün, durum" className="lg:col-span-4">
                {statusTotal === 0 ? <p className="text-[13px] text-[#5F7894]">Son 30 günde rezervasyon yok.</p> : (
                  <>
                    <div className="flex h-2.5 overflow-hidden rounded-full bg-[#1E3654]">
                      {Object.entries(p.bookings.statusCounts).map(([s, n]) => (
                        <div key={s} style={{ width: `${(n / statusTotal) * 100}%`, background: STATUS_COLOR[s] || '#8098B3' }} />
                      ))}
                    </div>
                    <ul className="mt-4 grid grid-cols-2 gap-y-2 text-[13px]">
                      {Object.entries(p.bookings.statusCounts).map(([s, n]) => (
                        <li key={s} className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full" style={{ background: STATUS_COLOR[s] || '#8098B3' }} />
                          <span className="text-[#C9D6E4]">{STATUS_TR[s] || s}</span>
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
                            <td className="py-2 text-[#E7EEF6]">{fullName(b)}</td>
                            <td className="py-2 tabular-nums text-[#C9D6E4]">{(b.flight_date || '').slice(0, 10)}</td>
                            <td className="py-2 tabular-nums text-[#C9D6E4]">{b.guests || 1}</td>
                            <td className="py-2 tabular-nums text-[#C9D6E4]">${nf(Number(b.total_price) || 0)}</td>
                            <td className="py-2" style={{ color: STATUS_COLOR[st(b)] || '#8098B3' }}>{STATUS_TR[st(b)] || st(b)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Panel>
            </div>
          )}
        </section>
      </div>

      {ticketFor && (
        <TicketModal
          booking={{
            id: ticketFor.id, created_at: ticketFor.created_at || '', first_name: ticketFor.first_name || '', last_name: ticketFor.last_name || '',
            email: ticketFor.email || '', phone: ticketFor.phone || '', flight_type: ticketFor.flight_type || 'standard',
            flight_date: ticketFor.flight_date, guests: ticketFor.guests || 1, addon_photo: !!ticketFor.addon_photo,
            addon_video: !!ticketFor.addon_video, addon_bundle: !!ticketFor.addon_bundle, base_price: Number(ticketFor.base_price) || 0,
            addon_price: Number(ticketFor.addon_price) || 0, total_price: Number(ticketFor.total_price) || 0, notes: ticketFor.notes || '',
            status: ticketFor.status,
          } satisfies TicketBooking}
          onClose={() => setTicketFor(null)}
        />
      )}
    </div>
  )
}
