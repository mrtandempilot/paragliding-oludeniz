'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import {
  Home, CalendarDays, Megaphone, TrendingUp, LayoutGrid, Bell, RefreshCw, Phone, MessageCircle, Check, X,
  CheckCheck, Users, Clock, ChevronRight, AlertTriangle, Wallet, Plane, ArrowUpRight, ArrowDownRight, Sparkles,
  Download, ExternalLink, Building2, UserRound, Banknote, Ticket, AudioLines, Radar, Bot, Instagram, FileText,
  Search, BarChart3, Monitor, Share, PlusSquare, CircleDollarSign, Target, Inbox,
} from 'lucide-react'
import { MY_CUT_PER_GUEST } from '@/lib/admin/earnings'

/* ───────────────────────── types ───────────────────────── */

type Booking = {
  id: string; first_name?: string; last_name?: string; name?: string; phone?: string; email?: string
  flight_date: string; flight_time?: string | null; guests?: number; total_price?: number | string; status: string; notes?: string; created_at?: string
}
type Ops = { pickup?: string; hotel?: string; pilot?: string; paid?: boolean; note?: string }
type Sum = { revenue: number; guests: number; count: number }
type Finding = { severity: 'critical' | 'serious' | 'warning' | 'good'; title: string; detail: string; action: string | null }

export type AppData = {
  today: string
  generatedAt: string
  usdTry: number | null
  upcoming: Booking[]
  laterPending: Booking[]
  unclosed: Booking[]
  ops: Record<string, Ops>
  sources: Record<string, string>
  waInbox: { id: string; from: string; summary: string; at: string }[]
  money: {
    earnedMonth: Sum; earnedLastSame: Sum; earned30: Sum; aheadConfirmed: Sum; aheadPending: Sum
    last30: { bookings: number; value: number }; prev30: { bookings: number; value: number }
    trend: { date: string; bookings: number; value: number; adCost: number | null }[]
    channels: { channel: string; bookings: number; value: number }[]
  }
  ads: null | {
    generatedAt: string | null
    kpis: Record<string, any>
    daily: { date: string; cost: number; clicks: number; conversions: number; impressions: number }[]
    spend30: number; googleBookings30: number; googleValue30: number
    findings: Finding[]; summary: string | null
    campaigns: { name: string; status: string; budget: number }[]
  }
  seo: {
    daily: { date: string; clicks: number; impressions: number; position?: number }[]
    queries: { key: string; clicks: number; impressions: number; position: number }[]
    pages: { key: string; clicks: number; impressions: number; position: number }[]
    error: string | null
  }
}

type Tab = 'home' | 'flights' | 'ads' | 'seo' | 'more'
const TABS: Tab[] = ['home', 'flights', 'ads', 'seo', 'more']

/* ───────────────────────── helpers ───────────────────────── */

const C = {
  bg: '#0B1220', card: '#111A2E', card2: '#0D1526', line: '#1E2A44', text: '#E8EEF7', muted: '#8A9BB8', dim: '#5E6F8C',
  orange: '#F97316', green: '#22C55E', amber: '#F59E0B', red: '#EF4444', blue: '#3B82F6', violet: '#8B5CF6', sky: '#38BDF8',
}
const nf = (n: number, digits = 0) => (Number.isFinite(n) ? n.toLocaleString('tr-TR', { maximumFractionDigits: digits, minimumFractionDigits: digits }) : '–')
const usd = (n: number) => '$' + nf(n)
const tl = (n: number) => '₺' + nf(n)
const compact = (n: number) => (Math.abs(n) >= 10000 ? nf(n / 1000, 1) + 'B' : nf(n))
const delta = (cur: number, prev: number) => (prev > 0 ? ((cur - prev) / prev) * 100 : null)
const dateObj = (d: string) => new Date(`${d}T12:00:00Z`)
const dayShort = (d: string) => new Intl.DateTimeFormat('tr-TR', { weekday: 'short', timeZone: 'UTC' }).format(dateObj(d))
const dayLong = (d: string) => new Intl.DateTimeFormat('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(dateObj(d))
const dayNum = (d: string) => new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(dateObj(d))
const addDays = (d: string, n: number) => new Date(dateObj(d).getTime() + n * 86400000).toISOString().slice(0, 10)
const fullName = (b: Booking) => [b.first_name, b.last_name].filter(Boolean).join(' ').trim() || b.name || 'İsimsiz'
const guestsOf = (b: Booking) => Number(b.guests) || 1
const valueOf = (b: Booking) => Number(b.total_price) || 150 * guestsOf(b)
const slotOf = (b: Booking) => b.flight_time || (b.notes || '').match(/\[Saat (\d{2}:\d{2})\]/)?.[1] || ''
const digits = (p?: string) => (p || '').replace(/[^\d]/g, '')
const timeAgo = (iso: string) => {
  const m = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
  if (m < 60) return `${m} dk önce`
  const h = Math.round(m / 60)
  return h < 24 ? `${h} sa önce` : `${Math.round(h / 24)} gün önce`
}
const clock = (iso: string) => new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' }).format(new Date(iso))

const STATUS: Record<string, { label: string; fg: string; bg: string }> = {
  pending: { label: 'Bekliyor', fg: '#FBBF24', bg: 'rgba(245,158,11,.14)' },
  confirmed: { label: 'Onaylı', fg: '#4ADE80', bg: 'rgba(34,197,94,.14)' },
  completed: { label: 'Uçtu', fg: '#7DD3FC', bg: 'rgba(56,189,248,.14)' },
  cancelled: { label: 'İptal', fg: '#FDA4AF', bg: 'rgba(244,63,94,.14)' },
}
const SEV: Record<string, { c: string; l: string }> = {
  critical: { c: '#EF4444', l: 'Acil' }, serious: { c: '#F97316', l: 'Önemli' }, warning: { c: '#F59E0B', l: 'Uyarı' }, good: { c: '#22C55E', l: 'İyi' },
}

/* ───────────────────────── small UI pieces ───────────────────────── */

function Card({ children, className = '', style, onClick, id }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void; id?: string }) {
  const cls = `rounded-2xl border p-4 ${onClick ? 'flex w-full flex-col items-stretch justify-start text-left transition-transform active:scale-[.985]' : ''} ${className}`
  const st = { background: C.card, borderColor: C.line, ...style }
  return onClick
    ? <button type="button" id={id} onClick={onClick} className={cls} style={st}>{children}</button>
    : <section id={id} className={cls} style={st}>{children}</section>
}

function CardTitle({ icon: Icon, title, color = C.orange, right }: { icon: any; title: string; color?: string; right?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: color + '22' }}><Icon className="h-4 w-4" style={{ color }} /></span>
        <h2 className="truncate text-[15px] font-semibold" style={{ color: C.text }}>{title}</h2>
      </div>
      {right}
    </div>
  )
}

function Delta({ value, invert = false }: { value: number | null; invert?: boolean }) {
  if (value == null || !Number.isFinite(value)) return null
  const up = value >= 0
  const good = invert ? !up : up
  const Icon = up ? ArrowUpRight : ArrowDownRight
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums" style={{ color: good ? '#4ADE80' : '#FB7185', background: good ? 'rgba(34,197,94,.12)' : 'rgba(244,63,94,.12)' }}>
      <Icon className="h-3 w-3" />%{nf(Math.abs(value))}
    </span>
  )
}

function Spark({ values, color, height = 34 }: { values: number[]; color: string; height?: number }) {
  const id = useMemo(() => 'sp' + Math.random().toString(36).slice(2, 8), [])
  if (values.length < 2 || values.every(v => !v)) return <div style={{ height }} />
  const w = 120, h = height, max = Math.max(...values, 1)
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - 2 - (v / max) * (h - 6)])
  const path = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full" style={{ height }} aria-hidden>
      <defs><linearGradient id={id} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".35" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <path d={`${path} L${w} ${h} L0 ${h} Z`} fill={`url(#${id})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.8" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  )
}

function Kpi({ icon: Icon, color, label, value, sub, d, invert, spark, onClick }: {
  icon: any; color: string; label: string; value: string; sub?: React.ReactNode; d?: number | null; invert?: boolean; spark?: number[]; onClick?: () => void
}) {
  return (
    <Card onClick={onClick} className="!p-3.5">
      <div className="flex items-start justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: color + '22' }}><Icon className="h-[18px] w-[18px]" style={{ color }} /></span>
        <Delta value={d ?? null} invert={invert} />
      </div>
      <div className="mt-2.5 truncate text-[12px] font-medium" style={{ color: C.muted }}>{label}</div>
      <div className="mt-0.5 truncate text-[22px] font-bold leading-tight tracking-tight tabular-nums" style={{ color: C.text }}>{value}</div>
      {sub && <div className="mt-0.5 truncate text-[11.5px] tabular-nums" style={{ color: C.dim }}>{sub}</div>}
      {spark && <div className="-mx-1 mt-2"><Spark values={spark} color={color} /></div>}
    </Card>
  )
}

function StatusChip({ status }: { status: string }) {
  const s = STATUS[status] || { label: status, fg: C.muted, bg: 'rgba(148,163,184,.12)' }
  return <span className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ color: s.fg, background: s.bg }}>{s.label}</span>
}

function Segmented<T extends string>({ value, options, onChange }: { value: T; options: { v: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex shrink-0 rounded-xl p-0.5" style={{ background: C.card2, border: `1px solid ${C.line}` }}>
      {options.map(o => (
        <button key={o.v} type="button" onClick={() => onChange(o.v)} className="rounded-[10px] px-2.5 py-1 text-[12px] font-semibold transition-colors"
          style={o.v === value ? { background: C.orange, color: '#fff' } : { color: C.muted }}>{o.label}</button>
      ))}
    </div>
  )
}

function Empty({ icon: Icon, text }: { icon: any; text: string }) {
  return <div className="flex flex-col items-center gap-2 py-6 text-center text-[13px]" style={{ color: C.dim }}><Icon className="h-6 w-6" />{text}</div>
}

function Tag({ icon: Icon, children, color }: { icon: any; children: React.ReactNode; color?: string }) {
  return <span className="inline-flex items-center gap-1 rounded-lg px-2 py-1" style={{ background: C.card2, color: color || C.muted }}><Icon className="h-3 w-3" />{children}</span>
}

function ActionBtn({ color, onClick, icon: Icon, children, disabled }: { color: string; onClick: () => void; icon: any; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button type="button" disabled={disabled} onClick={onClick} className="flex h-10 items-center gap-1.5 rounded-xl px-3.5 text-[13px] font-semibold text-white disabled:opacity-50" style={{ background: color }}>
      <Icon className="h-4 w-4" />{children}
    </button>
  )
}

function TodoRow({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center justify-between gap-2 py-2.5 text-left text-[13.5px]">
      <span>{text}</span><ChevronRight className="h-4 w-4 shrink-0" style={{ color: '#F87171' }} />
    </button>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl p-2" style={{ background: C.card2 }}>
      <div className="text-[11px]" style={{ color: C.muted }}>{label}</div>
      <div className="truncate text-[16px] font-bold tabular-nums">{value}</div>
      {sub && <div className="text-[10.5px] tabular-nums" style={{ color: C.dim }}>{sub}</div>}
    </div>
  )
}

function MiniStat({ label, value, bad }: { label: string; value: string; bad?: boolean }) {
  return (
    <div className="rounded-xl border px-3 py-2.5" style={{ background: C.card, borderColor: C.line }}>
      <div className="text-[11px]" style={{ color: C.muted }}>{label}</div>
      <div className="text-[17px] font-bold tabular-nums" style={{ color: bad ? '#F87171' : C.text }}>{value}</div>
    </div>
  )
}

function DeltaText({ cur, prev }: { cur: number; prev: number }) {
  const d = delta(cur, prev)
  if (d == null) return <>önceki: {nf(prev)}</>
  return <>{d >= 0 ? '▲' : '▼'} %{nf(Math.abs(d))} · önceki {nf(prev)}</>
}

function SeoRow({ label, r }: { label: string; r: { clicks: number; impressions: number; position: number } }) {
  const pc = r.position <= 3 ? '#4ADE80' : r.position <= 10 ? '#FBBF24' : '#FB7185'
  return (
    <div className="flex items-center gap-3 border-b py-2.5 last:border-0" style={{ borderColor: C.line }}>
      <span className="flex h-8 w-11 shrink-0 items-center justify-center rounded-lg text-[12px] font-bold tabular-nums" style={{ color: pc, background: pc + '1F' }}>{nf(r.position, 1)}</span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13.5px]">{label}</div>
        <div className="text-[11.5px] tabular-nums" style={{ color: C.dim }}>{nf(r.clicks)} tık · {nf(r.impressions)} gösterim</div>
      </div>
    </div>
  )
}

/* Colored metric tile (Google Ads / Search Console style); tap toggles the series in the chart. */
function Tile({ color, label, value, sub, on, onToggle }: { color: string; label: string; value: string; sub?: React.ReactNode; on?: boolean; onToggle?: () => void }) {
  const active = on !== false
  return (
    <button type="button" onClick={onToggle} disabled={!onToggle} aria-pressed={onToggle ? active : undefined} className="min-w-0 rounded-xl p-2.5 text-left transition-colors"
      style={{ background: active ? color : C.card2, border: `1px solid ${active ? color : C.line}` }}>
      <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: active ? 'rgba(255,255,255,.92)' : C.muted }}>
        {onToggle && (
          <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[4px]" style={{ background: active ? 'rgba(255,255,255,.95)' : 'transparent', border: active ? 'none' : `1.5px solid ${C.dim}` }}>
            {active && <Check className="h-2.5 w-2.5" style={{ color }} strokeWidth={4} />}
          </span>
        )}
        <span className="truncate">{label}</span>
      </div>
      <div className="mt-1 truncate text-[19px] font-bold tabular-nums" style={{ color: active ? '#fff' : C.text }}>{value}</div>
      {sub && <div className="mt-0.5 truncate text-[10.5px] tabular-nums" style={{ color: active ? 'rgba(255,255,255,.82)' : C.dim }}>{sub}</div>}
    </button>
  )
}

/* Multi-series chart: each series is scaled to its own range (like Search Console),
   the tooltip shows the real values. */
type Series = { key: string; label: string; color: string; fmt: (n: number) => string; invert?: boolean }
function MultiChart({ rows, series, height = 190 }: { rows: Record<string, any>[]; series: Series[]; height?: number }) {
  const norm = useMemo(() => {
    const range: Record<string, [number, number]> = {}
    for (const s of series) {
      const vals = rows.map(r => Number(r[s.key])).filter(v => Number.isFinite(v) && v > 0)
      range[s.key] = [vals.length ? Math.min(...vals) : 0, vals.length ? Math.max(...vals) : 0]
    }
    return rows.map(r => {
      const o: Record<string, any> = { date: r.date, _raw: r }
      for (const s of series) {
        const v = Number(r[s.key]); const [mn, mx] = range[s.key]
        if (!Number.isFinite(v) || (s.invert && v <= 0)) { o[s.key] = null; continue }
        o[s.key] = s.invert ? (mx === mn ? 50 : ((mx - v) / (mx - mn)) * 90 + 5) : mx ? (v / mx) * 100 : 0
      }
      return o
    })
  }, [rows, series])
  if (!series.length) return <div className="flex items-center justify-center text-[12px]" style={{ height, color: C.dim }}>Yukarıdan bir metrik seç</div>
  if (!rows.length) return <div className="flex items-center justify-center text-[12px]" style={{ height, color: C.dim }}>Veri yok</div>
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={norm} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={C.line} strokeDasharray="3 4" />
          <XAxis dataKey="date" tickFormatter={dayNum} tick={{ fill: C.dim, fontSize: 10 }} axisLine={false} tickLine={false} minTickGap={28} />
          <YAxis hide domain={[0, 105]} />
          <Tooltip cursor={{ stroke: C.muted, strokeDasharray: '3 3' }} content={(p: any) => {
            const raw = p?.payload?.[0]?.payload?._raw
            if (!p?.active || !raw) return null
            return (
              <div className="rounded-xl border px-3 py-2 text-[12px] shadow-xl" style={{ background: '#0A101D', borderColor: C.line, color: C.text }}>
                <div className="mb-1 font-semibold">{dayLong(raw.date)}</div>
                {series.map(s => (
                  <div key={s.key} className="flex items-center justify-between gap-4 tabular-nums">
                    <span className="flex items-center gap-1.5" style={{ color: C.muted }}><i className="inline-block h-2 w-2 rounded-full" style={{ background: s.color }} />{s.label}</span>
                    <b>{raw[s.key] == null || (s.invert && !raw[s.key]) ? '–' : s.fmt(Number(raw[s.key]))}</b>
                  </div>
                ))}
              </div>
            )
          }} />
          {series.map(s => <Line key={s.key} type="linear" dataKey={s.key} stroke={s.color} strokeWidth={2.2} dot={false} connectNulls isAnimationActive={false} />)}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path d="M5 15 Q8 7 16 7 Q24 7 27 15" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <line x1="10.5" y1="8.5" x2="14.8" y2="20" stroke="currentColor" strokeWidth="1" />
      <line x1="21.5" y1="8.5" x2="17.2" y2="20" stroke="currentColor" strokeWidth="1" />
      <circle cx="16" cy="18" r="1.7" fill="currentColor" />
      <rect x="14.4" y="20" width="3.2" height="4.6" rx="1" fill="currentColor" />
    </svg>
  )
}

const ADS_SERIES: Series[] = [
  { key: 'clicks', label: 'Tıklama', color: '#4C8DF6', fmt: n => nf(n) },
  { key: 'cost', label: 'Harcama', color: '#EA4335', fmt: tl },
  { key: 'conversions', label: 'Dönüşüm', color: '#FBBC04', fmt: n => nf(n, 1) },
]
const SEO_SERIES: Series[] = [
  { key: 'clicks', label: 'Tıklama', color: '#4C8DF6', fmt: n => nf(n) },
  { key: 'impressions', label: 'Gösterim', color: '#9D6CF0', fmt: n => nf(n) },
  { key: 'ctr', label: 'Tıklanma oranı', color: '#2BB5A8', fmt: n => '%' + nf(n, 1) },
  { key: 'position', label: 'Pozisyon', color: '#F08C2E', fmt: n => nf(n, 1), invert: true },
]

/* ───────────────────────── main ───────────────────────── */

export default function MobileApp({ data }: { data: AppData }) {
  const router = useRouter()
  const [tab, setTabState] = useState<Tab>('home')
  const [refreshing, setRefreshing] = useState(false)
  const [statusOverride, setStatusOverride] = useState<Record<string, string>>({})
  const [handled, setHandled] = useState<string[]>([])
  const [busy, setBusy] = useState<string | null>(null)
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null)
  const [toast, setToast] = useState<{ text: string; bad?: boolean } | null>(null)
  const [installEvt, setInstallEvt] = useState<any>(null)
  const [standalone, setStandalone] = useState(true)
  const [isIos, setIsIos] = useState(false)
  const [online, setOnline] = useState(true)
  // per-tab view state lives here so it survives re-renders and tab switches
  const [revMode, setRevMode] = useState<'value' | 'bookings'>('value')
  // 'all' = every flight of the coming 7 days, grouped by day
  const [flightDay, setFlightDay] = useState<string>('all')
  const [adsOn, setAdsOn] = useState<Record<string, boolean>>({ clicks: true, cost: true, conversions: true })
  const [seoPeriod, setSeoPeriod] = useState<'7' | '28' | '90'>('28')
  const [seoOn, setSeoOn] = useState<Record<string, boolean>>({ clicks: true, impressions: true, ctr: false, position: true })

  const scroller = useRef<HTMLDivElement>(null)
  const loadedAt = useRef(Date.now())

  const setTab = useCallback((t: Tab) => {
    setTabState(t)
    try {
      const u = new URL(window.location.href)
      if (t === 'home') u.searchParams.delete('tab'); else u.searchParams.set('tab', t)
      window.history.replaceState(window.history.state, '', u.toString())
    } catch {}
    scroller.current?.scrollTo({ top: 0 })
  }, [])

  // manual refresh = full reload, so a newly deployed version of the app is loaded too
  const refresh = useCallback(() => { setRefreshing(true); window.location.reload() }, [])
  const softRefresh = useCallback(() => { router.refresh() }, [router])

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('tab') as Tab | null
    if (t && TABS.includes(t)) setTabState(t)
    setStandalone(window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true)
    setIsIos(/iphone|ipad|ipod/i.test(navigator.userAgent))
    setOnline(navigator.onLine)
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/admin-sw.js', { scope: '/admin/' }).catch(() => {})
    const onPrompt = (e: Event) => { e.preventDefault(); setInstallEvt(e) }
    const onVis = () => { if (document.visibilityState === 'visible' && Date.now() - loadedAt.current > 60000) softRefresh() }
    const onOn = () => setOnline(true)
    const onOff = () => setOnline(false)
    window.addEventListener('beforeinstallprompt', onPrompt)
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('online', onOn)
    window.addEventListener('offline', onOff)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('online', onOn)
      window.removeEventListener('offline', onOff)
    }
  }, [softRefresh])

  // fresh server data arrived
  useEffect(() => { setRefreshing(false); setStatusOverride({}); loadedAt.current = Date.now() }, [data.generatedAt])
  // never spin forever (offline etc.)
  useEffect(() => { if (!refreshing) return; const t = setTimeout(() => setRefreshing(false), 15000); return () => clearTimeout(t) }, [refreshing])
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2600); return () => clearTimeout(t) }, [toast])

  /* pull to refresh */
  const startY = useRef<number | null>(null)
  const [pull, setPull] = useState(0)
  const onTouchStart = (e: React.TouchEvent) => { startY.current = (scroller.current?.scrollTop || 0) <= 0 ? e.touches[0].clientY : null }
  const onTouchMove = (e: React.TouchEvent) => {
    if (startY.current == null) return
    const dy = e.touches[0].clientY - startY.current
    setPull(dy > 0 && (scroller.current?.scrollTop || 0) <= 0 ? Math.min(dy * 0.45, 80) : 0)
  }
  const onTouchEnd = () => { if (pull > 56) refresh(); setPull(0); startY.current = null }

  /* derived */
  const st = (b: Booking) => statusOverride[b.id] || b.status
  const today = data.today
  const tomorrow = addDays(today, 1)
  const live = (list: Booking[]) => list.filter(b => st(b) !== 'cancelled')
  const onDay = (d: string) => live(data.upcoming.filter(b => b.flight_date === d))
  const guestsOn = (d: string) => onDay(d).reduce((s, b) => s + guestsOf(b), 0)
  const pendingAll = [...data.upcoming, ...data.laterPending].filter(b => st(b) === 'pending')
  const unclosed = data.unclosed.filter(b => !['completed', 'cancelled'].includes(st(b)))
  const wa = data.waInbox.filter(w => !handled.includes(w.id))
  const critical = (data.ads?.findings || []).filter(f => f.severity === 'critical')
  const todoCount = pendingAll.length + wa.length + unclosed.length + critical.length
  const m = data.money

  /* actions */
  async function setStatus(b: Booking, status: string) {
    setBusy(b.id); setConfirmCancel(null)
    setStatusOverride(s => ({ ...s, [b.id]: status }))
    try {
      const r = await fetch('/api/bookings', { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: b.id, status }) })
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || `HTTP ${r.status}`)
      setToast({ text: `${fullName(b)} → ${STATUS[status]?.label || status}` })
      router.refresh()
    } catch (e: any) {
      setStatusOverride(s => { const n = { ...s }; delete n[b.id]; return n })
      setToast({ text: `Güncellenemedi: ${e?.message || 'hata'}`, bad: true })
    }
    setBusy(null)
  }
  async function markHandled(id: string) {
    setHandled(h => [...h, id])
    try { await fetch('/api/admin/flight-ops', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ waHandled: id }) }) } catch {}
  }
  async function install() {
    if (!installEvt) return
    installEvt.prompt()
    const r = await installEvt.userChoice.catch(() => null)
    if (r?.outcome === 'accepted') { setInstallEvt(null); setStandalone(true) }
  }

  const hour = Number(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone: 'Europe/Istanbul' }).format(new Date()))
  const greet = hour < 5 ? 'İyi geceler' : hour < 12 ? 'Günaydın' : hour < 18 ? 'İyi günler' : 'İyi akşamlar'
  const TITLES: Record<Tab, string> = { home: 'Özet', flights: 'Uçuşlar', ads: 'Reklamlar', seo: 'SEO', more: 'Diğer' }

  /* ───────── booking card ───────── */
  const renderBooking = (b: Booking, past = false) => {
    const s = st(b), o = data.ops[b.id] || {}, phone = digits(b.phone), src = data.sources[b.id]
    const isBusy = busy === b.id
    const canComplete = s === 'confirmed' && b.flight_date <= today
    return (
      <div key={b.id} className="rounded-2xl border p-3.5" style={{ background: C.card, borderColor: C.line, opacity: s === 'cancelled' ? 0.5 : 1 }}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold">{fullName(b)}</div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px]" style={{ color: C.muted }}>
              {slotOf(b) && <span className="flex items-center gap-1 font-semibold" style={{ color: C.orange }}><Plane className="h-3.5 w-3.5" />{slotOf(b)}</span>}
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{guestsOf(b)} kişi</span>
              <span className="tabular-nums">{usd(valueOf(b))}</span>
              {past && <span>{dayNum(b.flight_date)}</span>}
              {src && <span style={{ color: C.dim }}>· {src}</span>}
            </div>
          </div>
          <StatusChip status={s} />
        </div>
        {(o.pickup || o.hotel || o.pilot || o.paid) && (
          <div className="mt-2 flex flex-wrap gap-1.5 text-[11.5px]">
            {o.pickup && <Tag icon={Clock}>Alış {o.pickup}</Tag>}
            {o.hotel && <Tag icon={Building2}>{o.hotel}</Tag>}
            {o.pilot && <Tag icon={UserRound}>{o.pilot}</Tag>}
            {o.paid && <Tag icon={Check} color="#4ADE80">Ödendi</Tag>}
          </div>
        )}
        {(o.note || b.notes) && <p className="mt-2 line-clamp-2 text-[12px]" style={{ color: C.dim }}>{o.note || (b.notes || '').replace(/\[Saat \d{2}:\d{2}\]\s*/, '')}</p>}
        <div className="mt-3 flex gap-2">
          {phone && <a href={`tel:+${phone}`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: C.card2, border: `1px solid ${C.line}` }} aria-label="Ara"><Phone className="h-[18px] w-[18px]" style={{ color: C.sky }} /></a>}
          {phone && <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: C.card2, border: `1px solid ${C.line}` }} aria-label="WhatsApp"><MessageCircle className="h-[18px] w-[18px]" style={{ color: '#25D366' }} /></a>}
          <div className="flex flex-1 justify-end gap-2">
            {s === 'pending' && <ActionBtn color="#16A34A" disabled={isBusy} onClick={() => setStatus(b, 'confirmed')} icon={Check}>Onayla</ActionBtn>}
            {canComplete && <ActionBtn color="#0284C7" disabled={isBusy} onClick={() => setStatus(b, 'completed')} icon={CheckCheck}>Uçtu</ActionBtn>}
            {s !== 'cancelled' && s !== 'completed' && (
              confirmCancel === b.id
                ? <ActionBtn color="#DC2626" disabled={isBusy} onClick={() => setStatus(b, 'cancelled')} icon={X}>{past && b.flight_date < today ? 'Gelmedi' : 'İptal'}?</ActionBtn>
                : <button type="button" onClick={() => setConfirmCancel(b.id)} className="flex h-10 items-center rounded-xl px-3 text-[12.5px] font-semibold" style={{ color: '#FDA4AF', border: `1px solid ${C.line}` }}>{past && b.flight_date < today ? 'Gelmedi' : 'İptal'}</button>
            )}
          </div>
        </div>
      </div>
    )
  }

  /* ───────── tabs ───────── */

  const renderHome = () => {
    const byPickup = (a: Booking, b: Booking) => (slotOf(a) || data.ops[a.id]?.pickup || '99').localeCompare(slotOf(b) || data.ops[b.id]?.pickup || '99')
    const todayList = onDay(today).sort(byPickup), tomorrowList = onDay(tomorrow).sort(byPickup)
    // next flights across the coming 7 days (not only today/tomorrow)
    const next = live(data.upcoming).slice().sort((a, b) => a.flight_date.localeCompare(b.flight_date) || byPickup(a, b)).slice(0, 5).map(b => ({ b, d: b.flight_date }))
    const spend7: number | null = data.ads?.kpis?.spend7 ?? null
    const revTotal = m.trend.reduce((s, t) => s + (revMode === 'value' ? t.value : t.bookings), 0)
    const aheadTotal = m.aheadConfirmed.revenue + m.aheadPending.revenue
    return (
      <>
        {(() => {
          const cut = (g: number) => g * MY_CUT_PER_GUEST
          const mine = cut(m.earnedMonth.guests), mineLast = cut(m.earnedLastSame.guests)
          const aheadMine = cut(m.aheadConfirmed.guests + m.aheadPending.guests)
          const mine30 = cut(m.earned30.guests)
          const ad30 = (data.ads?.daily || []).reduce((s, x) => s + (x.cost || 0), 0)
          const ad30Usd = data.ads && data.usdTry ? ad30 / data.usdTry : null
          const net30 = ad30Usd != null ? mine30 - ad30Usd : null
          return (
            <Card style={{ background: 'linear-gradient(135deg, rgba(249,115,22,.22), rgba(249,115,22,.06))', borderColor: C.orange }}>
              <div className="flex items-start justify-between">
                <div className="text-[12px] font-bold tracking-wide" style={{ color: C.orange }}>SENİN KAZANCIN · BU AY</div>
                <Delta value={delta(mine, mineLast)} />
              </div>
              <div className="mt-1 text-[34px] font-extrabold leading-none tabular-nums" style={{ color: C.text }}>{usd(mine)}</div>
              <div className="mt-1 text-[12px] tabular-nums" style={{ color: C.muted }}>{m.earnedMonth.guests} yolcu × ${MY_CUT_PER_GUEST}{data.usdTry ? ` · ≈ ${tl(mine * data.usdTry)}` : ''}</div>
              <div className="mt-3 grid grid-cols-3 gap-2 border-t pt-3" style={{ borderColor: 'rgba(249,115,22,.35)' }}>
                <div><div className="text-[11px]" style={{ color: C.muted }}>Gelecek 30g</div><div className="text-[17px] font-bold tabular-nums" style={{ color: C.text }}>{usd(aheadMine)}</div></div>
                <div><div className="text-[11px]" style={{ color: C.muted }}>Son 30g</div><div className="text-[17px] font-bold tabular-nums" style={{ color: C.text }}>{usd(mine30)}</div></div>
                <div><div className="text-[11px]" style={{ color: C.muted }}>Reklam sonrası</div><div className="text-[17px] font-bold tabular-nums" style={{ color: net30 == null ? C.dim : net30 >= 0 ? C.green : C.red }}>{net30 == null ? '–' : `${net30 < 0 ? '−' : ''}${usd(Math.abs(net30))}`}</div></div>
              </div>
            </Card>
          )
        })()}

        <div className="grid grid-cols-2 gap-3">
          <Kpi icon={Wallet} color={C.green} label="Bu ay uçan" value={`${m.earnedMonth.guests} kişi`}
            d={delta(m.earnedMonth.guests, m.earnedLastSame.guests)}
            sub={`geçen ay aynı dönem ${m.earnedLastSame.guests}`} />
          <Kpi icon={Plane} color={C.orange} label="Bugün uçacak" value={`${guestsOn(today)} kişi`} onClick={() => { setFlightDay('all'); setTab('flights') }}
            sub={`${todayList.length} rez. · yarın ${guestsOn(tomorrow)} kişi`} spark={Array.from({ length: 7 }, (_, i) => guestsOn(addDays(today, i)))} />
          <Kpi icon={CalendarDays} color={C.blue} label="Yeni rezervasyon · 30g" value={nf(m.last30.bookings)}
            d={delta(m.last30.bookings, m.prev30.bookings)} sub="son 30 günde gelen" spark={m.trend.map(t => t.bookings)} />
          <Kpi icon={Megaphone} color={C.violet} label="Reklam · 7 gün" value={spend7 == null ? '–' : tl(spend7)} onClick={() => setTab('ads')}
            d={spend7 != null ? delta(spend7, data.ads?.kpis?.spendPrev7 || 0) : null} invert
            sub={data.ads ? `${nf(data.ads.kpis.conv7 || 0)} dönüşüm · ${nf(data.ads.kpis.clicks7 || 0)} tık` : 'rapor yok'}
            spark={(data.ads?.daily || []).map(x => x.cost)} />
        </div>

        {todoCount > 0 && (
          <section id="todo" className="scroll-mt-24 rounded-2xl border p-4" style={{ background: 'linear-gradient(180deg, rgba(239,68,68,.13), rgba(239,68,68,.04))', borderColor: 'rgba(239,68,68,.35)' }}>
            <div className="mb-1 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" style={{ color: '#F87171' }} />
              <h2 className="text-[15px] font-semibold">Yapılacaklar</h2>
              <span className="rounded-full px-2 text-[12px] font-bold text-white" style={{ background: C.red }}>{todoCount}</span>
            </div>
            <div className="divide-y divide-red-500/15">
              {pendingAll.length > 0 && <TodoRow text={`${pendingAll.length} rezervasyon onay bekliyor`} onClick={() => setTab('flights')} />}
              {wa.length > 0 && <TodoRow text={`WhatsApp'ta ${wa.length} kişi cevap bekliyor`} onClick={() => setTab('flights')} />}
              {unclosed.length > 0 && <TodoRow text={`${unclosed.length} geçmiş uçuş kapatılmadı (ciroya yazılmıyor)`} onClick={() => setTab('flights')} />}
              {critical.map((f, i) => <TodoRow key={i} text={`Reklam: ${f.title}`} onClick={() => setTab('ads')} />)}
            </div>
          </section>
        )}

        <Card>
          <CardTitle icon={Clock} title="Sıradaki uçuşlar" right={<button type="button" onClick={() => setTab('flights')} className="flex items-center text-[12.5px] font-semibold" style={{ color: C.orange }}>Tümü<ChevronRight className="h-4 w-4" /></button>} />
          {next.length === 0 ? <Empty icon={CalendarDays} text="Önümüzdeki 7 günde uçuş yok" /> : (
            <div className="-mx-2 space-y-0.5">
              {next.map(({ b, d }) => (
                <button key={b.id} type="button" onClick={() => { setFlightDay(d); setTab('flights') }} className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left active:bg-white/5">
                  <div className="w-12 shrink-0 text-center">
                    <div className="text-[13px] font-bold tabular-nums">{slotOf(b) || data.ops[b.id]?.pickup || '––:––'}</div>
                    <div className="text-[10px] font-semibold uppercase" style={{ color: d === today ? C.orange : d === tomorrow ? C.amber : C.dim }}>{d === today ? 'bugün' : d === tomorrow ? 'yarın' : `${dayShort(d)} ${dateObj(d).getUTCDate()}`}</div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-medium">{fullName(b)}</div>
                    <div className="flex items-center gap-1 truncate text-[11.5px]" style={{ color: C.dim }}><Users className="h-3 w-3 shrink-0" />{guestsOf(b)} kişi{data.ops[b.id]?.hotel ? ` · ${data.ops[b.id]?.hotel}` : ''}</div>
                  </div>
                  <StatusChip status={st(b)} />
                </button>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardTitle icon={Banknote} title="Gelen rezervasyonlar" color={C.green} right={<Segmented value={revMode} onChange={setRevMode} options={[{ v: 'value', label: 'Ciro' }, { v: 'bookings', label: 'Adet' }]} />} />
          <div className="mb-1 flex flex-wrap items-baseline gap-2">
            <span className="text-[24px] font-bold tabular-nums">{revMode === 'value' ? usd(revTotal) : nf(revTotal)}</span>
            <span className="text-[12px]" style={{ color: C.dim }}>son 30 gün</span>
            <Delta value={revMode === 'value' ? delta(m.last30.value, m.prev30.value) : delta(m.last30.bookings, m.prev30.bookings)} />
          </div>
          <div className="h-[170px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={m.trend} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                <defs><linearGradient id="revFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={C.green} stopOpacity={0.4} /><stop offset="1" stopColor={C.green} stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid vertical={false} stroke={C.line} strokeDasharray="3 4" />
                <XAxis dataKey="date" tickFormatter={dayNum} tick={{ fill: C.dim, fontSize: 10 }} axisLine={false} tickLine={false} minTickGap={28} />
                <YAxis tick={{ fill: C.dim, fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} tickFormatter={(v: number) => (revMode === 'value' ? compact(v) : String(v))} width={44} />
                <Tooltip cursor={{ stroke: C.muted, strokeDasharray: '3 3' }} content={(p: any) => {
                  const r = p?.payload?.[0]?.payload
                  if (!p?.active || !r) return null
                  return (
                    <div className="rounded-xl border px-3 py-2 text-[12px]" style={{ background: '#0A101D', borderColor: C.line, color: C.text }}>
                      <div className="font-semibold">{dayLong(r.date)}</div>
                      <div className="tabular-nums" style={{ color: C.muted }}>{r.bookings} rezervasyon · {usd(r.value)}</div>
                      {r.adCost != null && <div className="tabular-nums" style={{ color: C.muted }}>Reklam: {tl(r.adCost)}</div>}
                    </div>
                  )
                }} />
                <Area type="monotone" dataKey={revMode} stroke={C.green} strokeWidth={2.2} fill="url(#revFill)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardTitle icon={CircleDollarSign} title="Önümüzdeki 30 gün" color={C.sky} />
          <div className="grid grid-cols-2 gap-3">
            <div><div className="text-[11.5px]" style={{ color: C.muted }}>Onaylı</div><div className="text-[20px] font-bold tabular-nums" style={{ color: '#4ADE80' }}>{usd(m.aheadConfirmed.guests * MY_CUT_PER_GUEST)}</div><div className="text-[11px]" style={{ color: C.dim }}>{m.aheadConfirmed.guests} kişi · senin payın</div></div>
            <div><div className="text-[11.5px]" style={{ color: C.muted }}>Onay bekliyor</div><div className="text-[20px] font-bold tabular-nums" style={{ color: '#FBBF24' }}>{usd(m.aheadPending.guests * MY_CUT_PER_GUEST)}</div><div className="text-[11px]" style={{ color: C.dim }}>{m.aheadPending.guests} kişi · senin payın</div></div>
          </div>
          {aheadTotal > 0 && (
            <div className="mt-3 flex h-2 overflow-hidden rounded-full" style={{ background: C.card2 }}>
              <div style={{ width: `${(m.aheadConfirmed.revenue / aheadTotal) * 100}%`, background: C.green }} />
              <div className="flex-1" style={{ background: C.amber }} />
            </div>
          )}
        </Card>

        {m.channels.length > 0 && (
          <Card>
            <CardTitle icon={Target} title="Rezervasyonlar nereden geliyor" color={C.violet} right={<span className="shrink-0 text-[11px]" style={{ color: C.dim }}>30 gün</span>} />
            <div className="space-y-2.5">
              {m.channels.slice(0, 6).map(c => (
                <div key={c.channel}>
                  <div className="mb-1 flex justify-between text-[12.5px]"><span className="truncate pr-2">{c.channel}</span><span className="shrink-0 tabular-nums" style={{ color: C.muted }}>{c.bookings} · {usd(c.value)}</span></div>
                  <div className="h-1.5 overflow-hidden rounded-full" style={{ background: C.card2 }}><div className="h-full rounded-full" style={{ width: `${(c.value / (m.channels[0].value || 1)) * 100}%`, background: c.channel === 'Google Ads' ? C.blue : C.violet }} /></div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </>
    )
  }

  const renderFlights = () => {
    const days = Array.from({ length: 7 }, (_, i) => addDays(today, i))
    const day = days.includes(flightDay) ? flightDay : 'all'
    const sortDay = (list: Booking[]) => list.slice().sort((a, b) => (slotOf(a) || data.ops[a.id]?.pickup || '99').localeCompare(slotOf(b) || data.ops[b.id]?.pickup || '99'))
    const shownDays = day === 'all' ? days.filter(d => data.upcoming.some(b => b.flight_date === d)) : [day]
    const weekGuests = days.reduce((s, d) => s + guestsOn(d), 0)
    const later = data.laterPending.filter(b => st(b) === 'pending')
    return (
      <>
        {wa.length > 0 && (
          <Card style={{ borderColor: 'rgba(37,211,102,.35)' }}>
            <CardTitle icon={Inbox} title="WhatsApp'ta seni bekleyenler" color="#25D366" />
            <div className="space-y-2.5">
              {wa.map(w => (
                <div key={w.id} className="rounded-xl p-3" style={{ background: C.card2 }}>
                  <div className="flex items-center justify-between text-[12px]"><span className="font-semibold tabular-nums">+{digits(w.from)}</span><span style={{ color: C.dim }}>{timeAgo(w.at)}</span></div>
                  {w.summary && <p className="mt-1 text-[13px]" style={{ color: C.muted }}>{w.summary}</p>}
                  <div className="mt-2 flex gap-2">
                    <a href={`https://wa.me/${digits(w.from)}`} target="_blank" rel="noreferrer" className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg text-[13px] font-semibold text-white" style={{ background: '#1DA851' }}><MessageCircle className="h-4 w-4" />Cevap yaz</a>
                    <button type="button" onClick={() => markHandled(w.id)} className="flex h-9 items-center gap-1 rounded-lg px-3 text-[12.5px] font-semibold" style={{ color: C.muted, border: `1px solid ${C.line}` }}><Check className="h-4 w-4" />Hallettim</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button type="button" onClick={() => setFlightDay('all')} className="flex w-[62px] shrink-0 flex-col items-center justify-center rounded-2xl border py-2.5"
            style={day === 'all' ? { background: C.orange, borderColor: C.orange, color: '#fff' } : { background: C.card, borderColor: C.line }}>
            <span className="text-[11px] font-semibold uppercase" style={{ color: day === 'all' ? 'rgba(255,255,255,.85)' : C.dim }}>7 gün</span>
            <span className="text-[18px] font-bold">Tümü</span>
            <span className="text-[11px] font-semibold tabular-nums" style={{ color: day === 'all' ? '#fff' : weekGuests ? C.text : C.dim }}>{weekGuests ? `${weekGuests} kişi` : '—'}</span>
          </button>
          {days.map(d => {
            const on = d === day, g = guestsOn(d), pend = onDay(d).filter(b => st(b) === 'pending').length
            return (
              <button key={d} type="button" onClick={() => setFlightDay(d)} className="relative flex w-[62px] shrink-0 flex-col items-center rounded-2xl border py-2.5"
                style={on ? { background: C.orange, borderColor: C.orange, color: '#fff' } : { background: C.card, borderColor: g ? 'rgba(249,115,22,.45)' : C.line }}>
                <span className="text-[11px] font-semibold uppercase" style={{ color: on ? 'rgba(255,255,255,.85)' : C.dim }}>{d === today ? 'Bugün' : dayShort(d)}</span>
                <span className="text-[18px] font-bold tabular-nums">{dateObj(d).getUTCDate()}</span>
                <span className="text-[11px] font-semibold tabular-nums" style={{ color: on ? '#fff' : g ? C.orange : C.dim }}>{g ? `${g} kişi` : '—'}</span>
                {pend > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full" style={{ background: on ? '#fff' : C.amber }} />}
              </button>
            )
          })}
        </div>

        {shownDays.length === 0 && <Card><Empty icon={Plane} text={day === 'all' ? 'Önümüzdeki 7 günde uçuş yok' : 'Bu gün için rezervasyon yok'} /></Card>}
        {shownDays.map(d => {
          const list = sortDay(data.upcoming.filter(b => b.flight_date === d))
          return (
            <div key={d} className="space-y-3">
              <div className="flex items-baseline justify-between gap-2 px-1 pt-1">
                <h2 className="text-[15px] font-semibold capitalize">{d === today ? 'Bugün · ' : d === tomorrow ? 'Yarın · ' : ''}{dayLong(d)}</h2>
                <span className="shrink-0 text-[12px] tabular-nums" style={{ color: C.muted }}>{guestsOn(d)} kişi · {usd(live(list).reduce((s, b) => s + valueOf(b), 0))}</span>
              </div>
              {list.length === 0 ? <Card><Empty icon={Plane} text="Bu gün için rezervasyon yok" /></Card> : list.map(b => renderBooking(b))}
            </div>
          )
        })}

        {later.length > 0 && (
          <>
            <h2 className="px-1 pt-3 text-[15px] font-semibold">İleri tarihli, onay bekleyen <span style={{ color: C.amber }}>({later.length})</span></h2>
            {data.laterPending.map(b => renderBooking(b, true))}
          </>
        )}

        {data.unclosed.length > 0 && (
          <>
            <h2 className="px-1 pt-3 text-[15px] font-semibold">Kapatılmamış geçmiş uçuşlar <span style={{ color: '#F87171' }}>({unclosed.length})</span></h2>
            <p className="-mt-1 px-1 text-[12px]" style={{ color: C.dim }}>&quot;Uçtu&quot; ya da &quot;Gelmedi&quot; işaretle, ciro doğru hesaplansın.</p>
            {data.unclosed.map(b => renderBooking(b, true))}
          </>
        )}
        <Link href="/admin/bookings" className="flex items-center justify-center gap-1 py-3 text-[13px] font-semibold" style={{ color: C.orange }}>Tüm rezervasyonlar<ChevronRight className="h-4 w-4" /></Link>
      </>
    )
  }

  const renderAds = () => {
    const a = data.ads
    if (!a) return (
      <Card>
        <Empty icon={Megaphone} text="Google Ads raporu henüz yok" />
        <Link href="/admin/google-ads" className="block text-center text-[13px] font-semibold" style={{ color: C.orange }}>Google Ads paneli</Link>
      </Card>
    )
    const k = a.kpis
    const series = ADS_SERIES.filter(s => adsOn[s.key])
    const tg = (key: string) => () => setAdsOn(o => ({ ...o, [key]: !o[key] }))
    const perBooking = a.googleBookings30 ? a.spend30 / a.googleBookings30 : null
    const roas = a.spend30 && data.usdTry ? (a.googleValue30 * data.usdTry) / a.spend30 : null
    const pct = (v: number | null | undefined) => (v == null ? '–' : '%' + nf(v * 100))
    return (
      <>
        <div className="flex items-center gap-2 px-1 text-[12px]" style={{ color: C.dim }}>
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden><path fill="#FBBC04" d="M3.3 16.6 9.5 5.9l3.9 2.2-6.2 10.7z" /><path fill="#4285F4" d="m20.7 16.6-6.2-10.7-3.9 2.2 6.2 10.7z" /><circle cx="5.3" cy="17.8" r="2.3" fill="#34A853" /></svg>
          </span>
          Google Ads · son 7 gün{a.generatedAt ? ` · rapor ${timeAgo(a.generatedAt)}` : ''}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Tile color="#1A73E8" label="Tıklama" value={nf(k.clicks7 || 0)} sub={<DeltaText cur={k.clicks7 || 0} prev={k.clicksPrev7 || 0} />} on={adsOn.clicks} onToggle={tg('clicks')} />
          <Tile color="#D93025" label="Harcama" value={tl(k.spend7 || 0)} sub={<>önceki 7g: {tl(k.spendPrev7 || 0)}</>} on={adsOn.cost} onToggle={tg('cost')} />
          <Tile color="#E8A200" label="Dönüşüm" value={nf(k.conv7 || 0)} sub={<>önceki 7g: {nf(k.convPrev7 || 0)}</>} on={adsOn.conversions} onToggle={tg('conversions')} />
          <Tile color="#188038" label="Tık başı (TBM)" value={k.cpc7 ? '₺' + nf(k.cpc7, 2) : '–'} sub={<>dönüşüm başı: {k.cpa7 ? tl(k.cpa7) : '–'}</>} />
        </div>
        <Card className="!px-2 !pb-2">
          <div className="mb-1 px-2 text-[12px]" style={{ color: C.dim }}>Son 30 gün · grafiğe dokun, günlük değerleri gör</div>
          <MultiChart rows={a.daily} series={series} />
        </Card>

        <Card>
          <CardTitle icon={CircleDollarSign} title="Reklam para kazandırıyor mu?" color={C.green} right={<span className="shrink-0 text-[11px]" style={{ color: C.dim }}>30 gün</span>} />
          <div className="grid grid-cols-3 gap-2 text-center">
            <Stat label="Harcama" value={tl(a.spend30)} />
            <Stat label="Rezervasyon" value={nf(a.googleBookings30)} sub={usd(a.googleValue30)} />
            <Stat label="Rez. başı" value={perBooking ? tl(perBooking) : '–'} />
          </div>
          {roas != null && (
            <div className="mt-3 rounded-xl px-3 py-2.5 text-[13px]" style={{ background: roas >= 3 ? 'rgba(34,197,94,.12)' : roas >= 1 ? 'rgba(245,158,11,.12)' : 'rgba(239,68,68,.12)' }}>
              Reklama harcanan her <b>₺1</b> → <b className="tabular-nums">₺{nf(roas, 1)}</b> ciro getirdi.
            </div>
          )}
          <p className="mt-2 text-[11px]" style={{ color: C.dim }}>Sadece site formundan gelen ve Google Ads&apos;e bağlanabilen rezervasyonlar sayılır; WhatsApp&apos;tan gelenler dahil değil.</p>
        </Card>

        <div className="grid grid-cols-2 gap-2">
          <MiniStat label="Gösterim payı" value={pct(k.is7)} />
          <MiniStat label="Tıklanma oranı" value={k.ctr7 != null ? '%' + nf(k.ctr7 * 100, 1) : '–'} />
          <MiniStat label="Bütçe yüzünden kaçan" value={pct(k.lostBudget7)} bad={(k.lostBudget7 || 0) > 0.2} />
          <MiniStat label="Sıralama yüzünden kaçan" value={pct(k.lostRank7)} bad={(k.lostRank7 || 0) > 0.3} />
        </div>

        {a.summary && (
          <Card style={{ background: 'linear-gradient(160deg, rgba(139,92,246,.16), #111A2E 60%)' }}>
            <CardTitle icon={Sparkles} title="Danışman özeti" color={C.violet} />
            <p className="whitespace-pre-line text-[13.5px] leading-relaxed" style={{ color: '#CBD5E1' }}>{a.summary}</p>
          </Card>
        )}

        {a.findings.length > 0 && (
          <Card>
            <CardTitle icon={AlertTriangle} title="Bulgular" color={C.amber} />
            <div className="space-y-3">
              {a.findings.map((f, i) => (
                <div key={i} className="border-l-[3px] pl-3" style={{ borderColor: SEV[f.severity]?.c || C.muted }}>
                  <div className="text-[10px] font-bold uppercase tracking-wide" style={{ color: SEV[f.severity]?.c }}>{SEV[f.severity]?.l}</div>
                  <div className="text-[13.5px] font-semibold">{f.title}</div>
                  <div className="text-[12px]" style={{ color: C.muted }}>{f.detail}</div>
                  {f.action && <div className="mt-0.5 text-[12px]" style={{ color: '#FDBA74' }}>→ {f.action}</div>}
                </div>
              ))}
            </div>
          </Card>
        )}

        {a.campaigns.length > 0 && (
          <Card>
            <CardTitle icon={Megaphone} title="Kampanyalar" color={C.blue} />
            {a.campaigns.map(c => (
              <div key={c.name} className="flex items-center justify-between gap-2 border-b py-2 text-[13px] last:border-0" style={{ borderColor: C.line }}>
                <span className="flex min-w-0 items-center gap-2"><i className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ background: c.status === 'ELIGIBLE' ? C.green : C.amber }} /><span className="truncate">{c.name}</span></span>
                <span className="shrink-0 tabular-nums" style={{ color: C.muted }}>{tl(c.budget || 0)}/gün</span>
              </div>
            ))}
          </Card>
        )}
        <Link href="/admin/google-ads" className="flex items-center justify-center gap-1 py-3 text-[13px] font-semibold" style={{ color: C.orange }}>Detaylı reklam raporu<ChevronRight className="h-4 w-4" /></Link>
      </>
    )
  }

  const renderSeo = () => {
    const s = data.seo
    if (s.error && !s.daily.length) return <Card><Empty icon={Search} text={`Search Console: ${s.error}`} /></Card>
    const n = Number(seoPeriod)
    const all = s.daily.map(r => ({ ...r, ctr: r.impressions ? (r.clicks / r.impressions) * 100 : 0 }))
    const cur = all.slice(-n), prev = all.slice(-2 * n, -n)
    const agg = (list: typeof all) => {
      const clicks = list.reduce((a, r) => a + r.clicks, 0), impressions = list.reduce((a, r) => a + r.impressions, 0)
      const posW = list.reduce((a, r) => a + (r.position || 0) * r.impressions, 0)
      return { clicks, impressions, ctr: impressions ? (clicks / impressions) * 100 : 0, position: impressions ? posW / impressions : 0 }
    }
    const A = agg(cur), P = prev.length === n ? agg(prev) : null
    const series = SEO_SERIES.filter(x => seoOn[x.key])
    const tg = (key: string) => () => setSeoOn(o => ({ ...o, [key]: !o[key] }))
    return (
      <>
        <div className="flex items-center justify-between gap-2 px-1">
          <span className="text-[12px]" style={{ color: C.dim }}>Google arama · organik</span>
          <Segmented value={seoPeriod} onChange={setSeoPeriod} options={[{ v: '7', label: '7 gün' }, { v: '28', label: '28 gün' }, { v: '90', label: '3 ay' }]} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Tile color="#4285F4" label="Tıklama" value={nf(A.clicks)} sub={P ? <DeltaText cur={A.clicks} prev={P.clicks} /> : undefined} on={seoOn.clicks} onToggle={tg('clicks')} />
          <Tile color="#7E57C2" label="Gösterim" value={nf(A.impressions)} sub={P ? <DeltaText cur={A.impressions} prev={P.impressions} /> : undefined} on={seoOn.impressions} onToggle={tg('impressions')} />
          <Tile color="#139C8F" label="Tıklanma oranı" value={'%' + nf(A.ctr, 1)} sub={P ? <>önceki: %{nf(P.ctr, 1)}</> : undefined} on={seoOn.ctr} onToggle={tg('ctr')} />
          <Tile color="#E8710A" label="Ort. pozisyon" value={A.position ? nf(A.position, 1) : '–'} sub={P && P.position ? <>önceki: {nf(P.position, 1)}{A.position && A.position < P.position ? ' · yükseldi' : ''}</> : undefined} on={seoOn.position} onToggle={tg('position')} />
        </div>
        <Card className="!px-2 !pb-2">
          <div className="mb-1 px-2 text-[12px]" style={{ color: C.dim }}>Grafiğe dokun, günlük değerleri gör</div>
          <MultiChart rows={cur} series={series} height={200} />
        </Card>

        <Card>
          <CardTitle icon={Search} title="En çok tıklanan aramalar" color={C.blue} right={<span className="shrink-0 text-[11px]" style={{ color: C.dim }}>30 gün</span>} />
          {s.queries.length === 0 ? <Empty icon={Search} text="Veri yok" /> : s.queries.map(q => <SeoRow key={q.key} label={q.key} r={q} />)}
        </Card>
        <Card>
          <CardTitle icon={FileText} title="En iyi sayfalar" color={C.violet} right={<span className="shrink-0 text-[11px]" style={{ color: C.dim }}>30 gün</span>} />
          {s.pages.length === 0 ? <Empty icon={FileText} text="Veri yok" /> : s.pages.map(p => <SeoRow key={p.key} label={p.key} r={p} />)}
        </Card>
        <div className="grid grid-cols-2 gap-2">
          <Link href="/admin/ai-visibility" className="flex items-center justify-center gap-1.5 rounded-xl border py-3 text-[13px] font-semibold" style={{ background: C.card, borderColor: C.line }}><Sparkles className="h-4 w-4" style={{ color: C.violet }} />AI görünürlük</Link>
          <Link href="/admin/analyze" className="flex items-center justify-center gap-1.5 rounded-xl border py-3 text-[13px] font-semibold" style={{ background: C.card, borderColor: C.line }}><BarChart3 className="h-4 w-4" style={{ color: C.sky }} />Detaylı analiz</Link>
        </div>
      </>
    )
  }

  const renderMore = () => {
    const links: [string, string, any, string][] = [
      ['/admin/bookings', 'Rezervasyonlar', CalendarDays, C.green],
      ['/admin/calendar', 'Takvim', CalendarDays, C.sky],
      ['/admin/ticket', 'Bilet bas', Ticket, C.orange],
      ['/admin/voice-assistant', 'Neslihan', AudioLines, C.violet],
      ['/admin/google-ads', 'Google Ads', Search, C.blue],
      ['/admin/meta-ads', 'Meta reklam', Megaphone, '#60A5FA'],
      ['/admin/instagram', 'Instagram', Instagram, '#F472B6'],
      ['/admin/content-pilot', 'ContentPilot', Bot, C.amber],
      ['/admin/blog', 'Blog', FileText, '#A3E635'],
      ['/admin/mission-control', 'Mission Control', Radar, C.violet],
      ['/admin/agent-office', 'Ajan ofisi', Bot, C.orange],
      ['/admin/ai-visibility', 'AI görünürlük', Sparkles, '#C084FC'],
    ]
    return (
      <>
        {!standalone && (
          <Card style={{ background: 'linear-gradient(150deg, rgba(249,115,22,.22), #111A2E 65%)', borderColor: 'rgba(249,115,22,.4)' }}>
            <CardTitle icon={Download} title="Telefona uygulama olarak ekle" />
            {installEvt ? (
              <>
                <p className="mb-3 text-[13px]" style={{ color: '#CBD5E1' }}>Ana ekranda ikon olur, tam ekran açılır, tarayıcı çubuğu olmaz.</p>
                <button type="button" onClick={install} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl text-[14px] font-semibold text-white" style={{ background: C.orange }}><Download className="h-4 w-4" />Ana ekrana ekle</button>
              </>
            ) : isIos ? (
              <ol className="space-y-1.5 text-[13px]" style={{ color: '#CBD5E1' }}>
                <li className="flex items-center gap-1.5">1. Safari&apos;de <Share className="inline h-4 w-4" /> Paylaş&apos;a dokun</li>
                <li className="flex items-center gap-1.5">2. <PlusSquare className="inline h-4 w-4" /> &quot;Ana Ekrana Ekle&quot;yi seç</li>
              </ol>
            ) : (
              <p className="text-[13px]" style={{ color: '#CBD5E1' }}>Chrome menüsü (⋮) → &quot;Ana ekrana ekle&quot; veya &quot;Uygulamayı yükle&quot;.</p>
            )}
          </Card>
        )}
        <div className="grid grid-cols-3 gap-2">
          {links.map(([href, label, Icon, color]) => (
            <Link key={href} href={href} className="flex flex-col items-center gap-2 rounded-2xl border px-1 py-4 text-center transition-transform active:scale-95" style={{ background: C.card, borderColor: C.line }}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: color + '22' }}><Icon className="h-5 w-5" style={{ color }} /></span>
              <span className="text-[11.5px] font-medium leading-tight">{label}</span>
            </Link>
          ))}
        </div>
        <Link href="/admin" className="flex items-center justify-between rounded-2xl border px-4 py-3.5 text-[14px] font-medium" style={{ background: C.card, borderColor: C.line }}>
          <span className="flex items-center gap-2"><Monitor className="h-5 w-5" style={{ color: C.muted }} />Masaüstü panel</span><ChevronRight className="h-4 w-4" style={{ color: C.dim }} />
        </Link>
        <a href="https://www.atmosparagliding.com" target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border px-4 py-3.5 text-[14px] font-medium" style={{ background: C.card, borderColor: C.line }}>
          <span className="flex items-center gap-2"><ExternalLink className="h-5 w-5" style={{ color: C.muted }} />Siteyi aç</span><ChevronRight className="h-4 w-4" style={{ color: C.dim }} />
        </a>
        <p className="pt-2 text-center text-[11px]" style={{ color: C.dim }}>Atmos Admin · aşağı çekip bırak = yenile</p>
      </>
    )
  }

  /* ───────── layout ───────── */

  const NAV: [Tab, string, any, number][] = [
    ['home', 'Özet', Home, 0],
    ['flights', 'Uçuşlar', CalendarDays, pendingAll.length + wa.length + unclosed.length],
    ['ads', 'Reklam', Megaphone, critical.length],
    ['seo', 'SEO', TrendingUp, 0],
    ['more', 'Diğer', LayoutGrid, 0],
  ]

  return (
    <div ref={scroller} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
      className="fixed inset-0 z-[60] overflow-y-auto overscroll-y-contain antialiased"
      style={{ background: C.bg, color: C.text, WebkitTapHighlightColor: 'transparent' }}>

      {/* pull-to-refresh indicator */}
      {(pull > 0 || refreshing) && (
        <div className="pointer-events-none fixed left-0 right-0 z-[70] flex justify-center" style={{ top: `calc(env(safe-area-inset-top) + ${refreshing ? 12 : Math.max(pull - 30, -30)}px)`, opacity: refreshing ? 1 : Math.min(pull / 56, 1) }}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full shadow-lg" style={{ background: C.card, border: `1px solid ${C.line}` }}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} style={{ color: C.orange, transform: refreshing ? undefined : `rotate(${pull * 4}deg)` }} />
          </span>
        </div>
      )}

      <div className="mx-auto max-w-[560px]" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 92px)' }}>
        {tab === 'home' ? (
          <header className="relative overflow-hidden" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/hero-oludeniz-mobile.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,18,32,.55) 0%, rgba(11,18,32,.3) 45%, #0B1220 100%)' }} />
            <div className="relative px-5 pb-6 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <LogoMark className="h-8 w-8" />
                  <div className="leading-none">
                    <div className="text-[19px] font-extrabold tracking-[.18em]">ATMOS</div>
                    <div className="mt-0.5 text-[8.5px] font-semibold tracking-[.42em] text-white/80">PARAGLIDING</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={refresh} aria-label="Yenile" className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 backdrop-blur">
                    <RefreshCw className={`h-[18px] w-[18px] text-white ${refreshing ? 'animate-spin' : ''}`} />
                  </button>
                  <button type="button" onClick={() => document.getElementById('todo')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} aria-label="Yapılacaklar" className="relative flex h-10 w-10 items-center justify-center rounded-full bg-black/30 backdrop-blur">
                    <Bell className="h-[18px] w-[18px] text-white" />
                    {todoCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white" style={{ background: C.red }}>{todoCount}</span>}
                  </button>
                </div>
              </div>
              <h1 className="mt-8 text-[25px] font-bold text-white">{greet} Ceyhun</h1>
              <p className="mt-0.5 text-[13px] text-white/75">{dayLong(today)} · {clock(data.generatedAt)} itibarıyla{!online && ' · çevrimdışı'}</p>
            </div>
          </header>
        ) : (
          <header className="sticky top-0 z-30 border-b backdrop-blur-xl" style={{ paddingTop: 'env(safe-area-inset-top)', background: 'rgba(11,18,32,.86)', borderColor: C.line }}>
            <div className="flex items-center justify-between px-5 py-3">
              <div>
                <h1 className="text-[20px] font-bold">{TITLES[tab]}</h1>
                <p className="text-[11.5px]" style={{ color: C.dim }}>{clock(data.generatedAt)} itibarıyla{!online && ' · çevrimdışı'}</p>
              </div>
              <button type="button" onClick={refresh} aria-label="Yenile" className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                <RefreshCw className={`h-[18px] w-[18px] ${refreshing ? 'animate-spin' : ''}`} style={{ color: C.muted }} />
              </button>
            </div>
          </header>
        )}

        <main className={`space-y-3 px-4 ${tab === 'home' ? '' : 'pt-4'}`}>
          {tab === 'home' && renderHome()}
          {tab === 'flights' && renderFlights()}
          {tab === 'ads' && renderAds()}
          {tab === 'seo' && renderSeo()}
          {tab === 'more' && renderMore()}
        </main>
      </div>

      {toast && (
        <div role="status" className="fixed left-1/2 z-[80] max-w-[90vw] -translate-x-1/2 truncate rounded-xl px-4 py-2.5 text-[13px] font-medium text-white shadow-2xl" style={{ bottom: 'calc(env(safe-area-inset-bottom) + 84px)', background: toast.bad ? '#991B1B' : '#166534' }}>{toast.text}</div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-[65] border-t backdrop-blur-xl" style={{ background: 'rgba(10,16,29,.94)', borderColor: C.line, paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="mx-auto grid max-w-[560px] grid-cols-5">
          {NAV.map(([t, label, Icon, badge]) => {
            const on = tab === t
            return (
              <button key={t} type="button" onClick={() => setTab(t)} className="relative flex flex-col items-center gap-1 pb-2 pt-2.5" aria-current={on ? 'page' : undefined}>
                {on && <span className="absolute top-0 h-[3px] w-8 rounded-b-full" style={{ background: C.orange }} />}
                <span className="relative">
                  <Icon className="h-[22px] w-[22px]" style={{ color: on ? C.orange : C.muted }} strokeWidth={on ? 2.4 : 2} />
                  {badge > 0 && <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9.5px] font-bold text-white" style={{ background: C.red }}>{badge}</span>}
                </span>
                <span className="text-[10.5px] font-semibold" style={{ color: on ? C.orange : C.muted }}>{label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
