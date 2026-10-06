'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sora } from 'next/font/google'
import {
  ArrowUp, RefreshCw, Play, Loader2, AlertTriangle, Phone, CalendarDays,
  Search, Megaphone, Instagram, Bot, Sparkles, Globe2, ArrowUpRight,
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
    revenueMonth: number; pending: number; stalePending: number
  }
  pilot: {
    enabled: boolean; slots: string[]; costToday: number; pendingTopics: number
    articlesWeek: number; articlesTotal: number; latestArticles: { title: string; slug: string; created_at: string }[]
  }
  instagram: { postedWeek: number; drafts: number; scheduled: number; failed: number; gapDays: number | null }
  agents: { agent: string; action: string; status: string; error?: string; created_at: string }[]
  recentLogs: { agent: string; action: string; status: string; error?: string; created_at: string }[]
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

/* ── wind ladder (hero) ────────────────────────────────────────────────── */
function WindLadder({ weather }: { weather: Props['weather'] }) {
  if (!weather) return <ErrorLine msg="Hava durumu alınamadı (Open-Meteo yanıt vermedi)." />
  const order = ['Babadağ Summit', 'Babadağ 1200m Take-off', 'Ölüdeniz Beach (Landing)']
  const stations = [...weather.stations].sort((a, b) => order.indexOf(a.label) - order.indexOf(b.label))
  return (
    <ol className="relative space-y-0">
      {stations.map((s, i) => (
        <li key={s.label} className="relative grid grid-cols-[88px_1fr_auto] items-center gap-4 py-3">
          {/* altitude rail */}
          <div className="text-right">
            <div className={`${sora.className} text-[15px] tabular-nums text-[#E7EEF6]`}>{s.elevation.replace(' ASL', '')}</div>
            <div className="text-[12px] text-[#5F7894]">{STATION_TR[s.label] || s.label}</div>
          </div>
          <div className="relative flex items-center gap-4 border-l border-[#1E3654] pl-5">
            <span className={`absolute -left-[5px] h-[9px] w-[9px] rounded-full ${i === 1 ? 'bg-[#F97316]' : 'bg-[#2DD4BF]'}`} aria-hidden />
            <div className={`${sora.className} text-[34px] font-light leading-none tabular-nums text-[#E7EEF6]`}>
              {s.windSpeedKmh != null ? Math.round(s.windSpeedKmh) : '—'}
              <span className="ml-1 text-[13px] text-[#8098B3]">km/s</span>
            </div>
            <div className="text-[13px] leading-snug text-[#8098B3]">
              <div>{s.windGustKmh != null ? <>Hamle <span className="tabular-nums text-[#E7EEF6]">{Math.round(s.windGustKmh)}</span> km/s</> : 'İrtifa rüzgarı'}</div>
              <div className="flex items-center gap-1.5">
                <ArrowUp
                  className="h-3.5 w-3.5 text-[#2DD4BF]"
                  style={{ transform: `rotate(${((s.windDirectionDeg ?? 0) + 180) % 360}deg)` }}
                  aria-label={`Rüzgar yönü ${s.windDirectionDeg ?? '—'} derece`}
                />
                <span className="tabular-nums">{s.windDirectionDeg != null ? `${Math.round(s.windDirectionDeg)}°` : '—'}</span>
              </div>
            </div>
          </div>
          <div className="text-right text-[13px] text-[#8098B3]">
            <div className={`${sora.className} text-[18px] tabular-nums text-[#E7EEF6]`}>{s.temperatureC != null ? `${Math.round(s.temperatureC)}°` : '—'}</div>
            <div>{s.weatherCode != null ? WMO[s.weatherCode] || '—' : '—'}</div>
          </div>
        </li>
      ))}
    </ol>
  )
}

/* ── main ──────────────────────────────────────────────────────────────── */
export default function CommandCenter(p: Props) {
  const router = useRouter()
  const [now, setNow] = useState<Date | null>(null)
  const [gads, setGads] = useState<any>(null)
  const [meta, setMeta] = useState<any>(null)
  const [gsc, setGsc] = useState<any>(null)
  const [ga4, setGa4] = useState<any>(null)
  const [aiv, setAiv] = useState<any>(null)
  const [pilotOn, setPilotOn] = useState(p.pilot.enabled)
  const [savingPilot, setSavingPilot] = useState(false)
  const [runState, setRunState] = useState<'idle' | 'running' | 'ok' | 'err'>('idle')
  const [refreshing, setRefreshing] = useState(false)

  async function loadExternal() {
    const [g, m, mi, s, a, v] = await Promise.allSettled([
      getJson('/api/admin/google-ads?type=overview'),
      getJson('/api/admin/meta-ads?type=account'),
      getJson('/api/admin/meta-ads?type=insights&date_preset=last_7d'),
      getJson('/api/admin/seo-stats'),
      getJson('/api/admin/seo-data?type=ga4-overview'),
      getJson('/api/admin/ai-visibility'),
    ])
    const v_ = (r: PromiseSettledResult<any>) => (r.status === 'fulfilled' ? r.value : { error: String((r as any).reason) })
    setGads(v_(g))
    setMeta({ account: v_(m), insights: v_(mi) })
    setGsc(v_(s))
    setGa4(v_(a))
    setAiv(v_(v))
  }

  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 30000)
    loadExternal()
    return () => clearInterval(t)
  }, [])

  async function refreshAll() {
    setRefreshing(true)
    setGads(null); setMeta(null); setGsc(null); setGa4(null); setAiv(null)
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
    const sum = (k: string, arr = last7) => arr.reduce((s, d) => s + (d[k] || 0), 0)
    return {
      cost: sum('cost'), clicks: sum('clicks'), impressions: sum('impressions'), conversions: sum('conversions'),
      todayCost: days.length ? days[days.length - 1].cost : 0,
      series: days.map(d => d.clicks), labels: days.map(d => (d.date || '').slice(5)),
    }
  }, [gads])

  const metaStatus = META_STATUS[Number(meta?.account?.account_status)] || null
  const metaSpend7 = (meta?.insights?.data || []).reduce((s: number, r: any) => s + Number(r.spend || 0), 0)

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

  const alerts: { tone: 'warn' | 'bad'; text: string; href?: string }[] = []
  if (metaStatus && metaStatus.tone !== 'ok') alerts.push({ tone: metaStatus.tone, text: `Meta reklam hesabı: ${metaStatus.label}${meta?.account?.balance ? ` (₺${nf(Number(meta.account.balance))})` : ''}`, href: '/admin/meta-ads' })
  if (gads?.error) alerts.push({ tone: 'warn', text: `Google Ads verisi alınamadı: ${gads.error}`, href: '/admin/google-ads' })
  if (p.bookings.pending > 0) alerts.push({ tone: 'warn', text: `${p.bookings.pending} yaklaşan rezervasyon onay bekliyor`, href: '/admin/bookings' })
  if (p.bookings.stalePending > 0) alerts.push({ tone: 'warn', text: `${p.bookings.stalePending} rezervasyonun uçuş tarihi geçmiş ama hâlâ "bekliyor" görünüyor. Tamamlandı ya da iptal olarak işaretle.`, href: '/admin/bookings' })
  if (p.instagram.failed > 0) alerts.push({ tone: 'warn', text: `${p.instagram.failed} Instagram gönderisi başarısız`, href: '/admin/instagram' })
  if (p.instagram.gapDays != null && p.instagram.gapDays >= 3) alerts.push({ tone: 'warn', text: `Instagram'a ${p.instagram.gapDays} gündür paylaşım yapılmadı`, href: '/admin/instagram' })
  for (const a of p.agents) if (a.status === 'error') alerts.push({ tone: 'bad', text: `${a.agent} ajanı son çalışmasında hata verdi (${ago(a.created_at)}): ${(a.error || a.action || '').slice(0, 90)}`, href: '/admin/mission-control' })

  const dateTitle = now
    ? new Intl.DateTimeFormat('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Istanbul' }).format(now)
    : ''
  const clock = now
    ? new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' }).format(now)
    : ''

  return (
    <div className="-m-8 min-h-screen bg-[#0B1A2C] px-4 py-6 text-[#E7EEF6] sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1400px] space-y-5">

        {/* header */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[13px] text-[#8098B3]">{dateTitle}</p>
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

        {/* hero: wind ladder + today */}
        <div className="grid gap-5 lg:grid-cols-12">
          <Panel title="Babadağ rüzgarı, şu an" className="lg:col-span-7" right={
            p.weather ? <span className="text-[12px] text-[#5F7894]">Open-Meteo, {ago(p.weather.fetchedAt)}</span> : null
          } href="/live-weather">
            <WindLadder weather={p.weather} />
          </Panel>

          <Panel title="Bugünkü uçuşlar" icon={CalendarDays} href="/admin/bookings" className="lg:col-span-5">
            <div className="flex items-end gap-8">
              <Stat value={p.bookings.todayFlights.length} label="rezervasyon" />
              <Stat value={todayGuests} label="yolcu" />
              <Stat value={p.bookings.pending} label="onay bekleyen" tone={p.bookings.pending ? 'warn' : undefined} />
            </div>
            <ul className="mt-5 divide-y divide-[#1E3654] border-t border-[#1E3654]">
              {p.bookings.todayFlights.length === 0 && (
                <li className="py-3 text-[13px] text-[#5F7894]">Bugün için kayıtlı uçuş yok.</li>
              )}
              {p.bookings.todayFlights.slice(0, 6).map(b => (
                <li key={b.id} className="flex items-center justify-between gap-3 py-2.5 text-[14px]">
                  <span className="truncate">{[b.first_name, b.last_name].filter(Boolean).join(' ') || 'İsimsiz'}</span>
                  <span className="flex shrink-0 items-center gap-3 text-[13px] text-[#8098B3]">
                    <span className="tabular-nums">{b.guests || 1} kişi</span>
                    <span className={b.status === 'pending' ? 'text-[#FBBF24]' : 'text-[#2DD4BF]'}>{b.status === 'pending' ? 'bekliyor' : b.status === 'confirmed' ? 'onaylı' : b.status}</span>
                    {b.phone && (
                      <a href={`https://wa.me/${b.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#2DD4BF]" aria-label={`${b.first_name || ''} WhatsApp`}>
                        <Phone className="h-4 w-4" />
                      </a>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        {/* KPI strip */}
        <section aria-label="Özet rakamlar" className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#1E3654] bg-[#1E3654] md:grid-cols-3 xl:grid-cols-6">
          {[
            { v: p.bookings.newWeek, l: 'Yeni rezervasyon, 7 gün', s: `Bugün ${p.bookings.newToday}, 30 günde ${p.bookings.newMonth}` },
            { v: `$${nf(p.bookings.revenueMonth)}`, l: 'Rezervasyon tutarı, 30 gün', s: 'İptaller hariç' },
            { v: gads ? `₺${nf(g7.cost)}` : '…', l: 'Google Ads harcama, 7 gün', s: gads ? `${nf(g7.clicks)} tıklama, ${nf(g7.conversions, 0)} dönüşüm` : 'yükleniyor' },
            { v: metaStatus ? (metaStatus.tone === 'ok' ? `₺${nf(metaSpend7)}` : 'Durdu') : '…', l: 'Meta reklam, 7 gün', s: metaStatus?.tone === 'ok' ? 'harcama' : metaStatus?.label, tone: metaStatus && metaStatus.tone !== 'ok' ? metaStatus.tone : undefined },
            { v: ga4?.overview ? nf(ga4.overview.activeUsers) : '…', l: 'Site ziyaretçisi, 7 gün', s: ga4?.overview ? `${nf(ga4.overview.sessions)} oturum` : ga4?.error ? 'alınamadı' : 'yükleniyor' },
            { v: gsc?.gsc7d ? nf(gsc.gsc7d.clicks) : '…', l: 'Google arama tıklaması, 7 gün', s: gsc?.gsc7d ? `ort. sıra ${nf(gsc.gsc7d.position, 1)}` : gsc?.error ? 'alınamadı' : 'yükleniyor' },
          ].map((k, i) => (
            <div key={i} className="bg-[#0F2136] p-5">
              <Stat value={k.v} label={k.l} sub={k.s} tone={(k as any).tone} />
            </div>
          ))}
        </section>

        {/* upcoming + ads */}
        <div className="grid gap-5 lg:grid-cols-12">
          <Panel title="Önümüzdeki 7 gün" icon={CalendarDays} href="/admin/calendar" className="lg:col-span-7">
            {flightsByDay.length === 0 ? (
              <p className="text-[13px] text-[#5F7894]">Önümüzdeki 7 günde kayıtlı uçuş yok.</p>
            ) : (
              <div className="space-y-4">
                {flightsByDay.map(([day, list]) => (
                  <div key={day} className="grid grid-cols-[110px_1fr] gap-4">
                    <div>
                      <div className="text-[14px] text-[#E7EEF6]">{dayLabel(day, p.today)}</div>
                      <div className="text-[12px] tabular-nums text-[#5F7894]">{list.reduce((s, b) => s + (b.guests || 1), 0)} yolcu</div>
                    </div>
                    <ul className="flex flex-wrap gap-2">
                      {list.map(b => (
                        <li key={b.id} className={`rounded-md border px-2.5 py-1 text-[13px] ${b.status === 'pending' ? 'border-[#FBBF24]/40 text-[#FDE68A]' : 'border-[#1E3654] text-[#C9D6E4]'}`}>
                          {b.first_name || 'İsimsiz'}{(b.guests || 1) > 1 ? ` +${(b.guests || 1) - 1}` : ''}
                          {b.flight_type && b.flight_type !== 'standard' ? <span className="ml-1.5 text-[#5F7894]">{b.flight_type}</span> : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <div className="space-y-5 lg:col-span-5">
            <Panel title="Google Ads" icon={Search} href="/admin/google-ads">
              {!gads ? <Skeleton h="h-28" /> : gads.error ? <ErrorLine msg={gads.error} /> : (
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
                    <Stat value={nf(g7.impressions)} label="gösterim" />
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

            <Panel title="Meta reklamları" icon={Megaphone} href="/admin/meta-ads">
              {!meta ? <Skeleton h="h-14" /> : meta.account?.error ? <ErrorLine msg={meta.account.error} /> : (
                <div className="flex items-end justify-between gap-4">
                  <Stat
                    value={metaStatus?.label || '—'}
                    label={meta.account?.name || 'Reklam hesabı'}
                    tone={metaStatus?.tone === 'ok' ? undefined : metaStatus?.tone}
                    sub={metaStatus?.tone !== 'ok' && meta.account?.balance ? `Bakiye ₺${nf(Number(meta.account.balance))}` : undefined}
                  />
                  <Stat value={`₺${nf(metaSpend7)}`} label="harcama, 7 gün" />
                </div>
              )}
            </Panel>
          </div>
        </div>

        {/* channels / seo / pilot / instagram */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <Panel title="Ziyaretçi kaynakları, 7 gün" icon={Globe2} href="/admin/analyze">
            {!ga4 ? <Skeleton h="h-32" /> : ga4.error ? <ErrorLine msg={ga4.error} /> : (
              <ul className="space-y-2.5">
                {channels.slice(0, 7).map(c => (
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

          <Panel title="Arama ve yapay zeka" icon={Sparkles} href="/admin/ai-visibility">
            {!gsc ? <Skeleton h="h-32" /> : (
              <div className="space-y-5">
                {gsc.error || !gsc.gsc28d ? <ErrorLine msg={gsc.error || 'Search Console verisi yok'} /> : (
                  <div className="grid grid-cols-2 gap-4">
                    <Stat value={nf(gsc.gsc28d.clicks)} label="tıklama, 28 gün" sub={`${nf(gsc.gsc28d.impressions)} gösterim`} />
                    <Stat value={nf(gsc.gsc28d.position, 1)} label="ortalama sıra" sub={`TO %${nf(gsc.gsc28d.ctr * 100, 1)}`} />
                  </div>
                )}
                <div className="border-t border-[#1E3654] pt-4">
                  {!aiv ? <Skeleton h="h-10" /> : aiv.error ? <ErrorLine msg={aiv.error} /> : (
                    <div className="grid grid-cols-2 gap-4">
                      <Stat value={aiRate != null ? `%${aiRate}` : '—'} label="AI cevaplarında görünme" sub={aiv.latestCheckedAt ? ago(aiv.latestCheckedAt) : undefined} />
                      <Stat value={(aiv.suggestions || []).filter((s: any) => s.status === 'pending').length} label="kaçırılan konu" sub="makale önerisi" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </Panel>

          <Panel title="ContentPilot" icon={Bot} href="/admin/content-pilot" right={
            <button
              role="switch" aria-checked={pilotOn} onClick={togglePilot} disabled={savingPilot}
              className={`relative h-5 w-9 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2DD4BF] ${pilotOn ? 'bg-[#2DD4BF]' : 'bg-[#1E3654]'}`}
              aria-label="ContentPilot otomatik çalışma"
            >
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${pilotOn ? 'left-[18px]' : 'left-0.5'}`} />
            </button>
          }>
            <div className="grid grid-cols-2 gap-4">
              <Stat value={p.pilot.articlesWeek} label="makale, 7 gün" sub={`toplam ${p.pilot.articlesTotal}`} />
              <Stat value={p.pilot.pendingTopics} label="bekleyen konu" tone={p.pilot.pendingTopics === 0 ? 'warn' : undefined} />
            </div>
            <p className="mt-4 text-[12px] text-[#5F7894]">
              {pilotOn ? `Otomatik: ${p.pilot.slots.join(', ')} UTC` : 'Otomatik çalışma kapalı'}. Bugünkü maliyet ${nf(p.pilot.costToday, 2)}.
            </p>
            {p.pilot.latestArticles[0] && (
              <a href={`/blog/${p.pilot.latestArticles[0].slug}`} target="_blank" rel="noopener noreferrer" className="mt-3 block truncate text-[13px] text-[#C9D6E4] hover:text-[#2DD4BF]">
                Son: {p.pilot.latestArticles[0].title}
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

          <Panel title="Instagram" icon={Instagram} href="/admin/instagram">
            <div className="grid grid-cols-2 gap-4">
              <Stat value={p.instagram.postedWeek} label="paylaşım, 7 gün" />
              <Stat
                value={p.instagram.gapDays == null ? '—' : p.instagram.gapDays === 0 ? 'Bugün' : `${p.instagram.gapDays} gün`}
                label="son paylaşımdan beri"
                tone={p.instagram.gapDays != null && p.instagram.gapDays >= 3 ? 'warn' : undefined}
              />
              <Stat value={p.instagram.scheduled} label="planlanmış" />
              <Stat value={p.instagram.drafts} label="taslak" sub={p.instagram.failed ? `${p.instagram.failed} başarısız` : undefined} />
            </div>
          </Panel>
        </div>

        {/* agents */}
        <Panel title="Otomasyon ajanları" icon={Bot} href="/admin/mission-control">
          {p.agents.length === 0 ? <p className="text-[13px] text-[#5F7894]">Kayıtlı ajan çalışması yok.</p> : (
            <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {p.agents.map(a => (
                <div key={a.agent} className="flex items-center justify-between gap-3 border-b border-[#1E3654] pb-2.5 text-[13px]">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${a.status === 'error' ? 'bg-[#F87171]' : a.status === 'running' ? 'bg-[#FBBF24]' : 'bg-[#2DD4BF]'}`} aria-hidden />
                    <span className="capitalize text-[#E7EEF6]">{a.agent}</span>
                    <span className="truncate text-[#5F7894]">{a.action}</span>
                  </span>
                  <span className="shrink-0 tabular-nums text-[#8098B3]">{ago(a.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </Panel>

      </div>
    </div>
  )
}
