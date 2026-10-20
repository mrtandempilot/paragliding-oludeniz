'use client'

// Uçuş Masası — admin ana sayfası. Önce para: ne kazandık, ne geliyor, reklam ne
// getiriyor. Sonra yapılacaklar ve günün uçuş listesi; hava sadece yardımcı bilgi.
import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sora } from 'next/font/google'
import {
  ArrowUp, RefreshCw, Loader2, AlertTriangle, Phone, CalendarDays, MessageCircle, Ticket, Check, X,
  Users, Wind, Sunrise, Sunset, ListChecks, Radar, Search, Megaphone, Instagram, FileText, BarChart3,
  CircleDollarSign, Clock3, CheckCircle2, ChevronDown, CloudRain, Hotel, UserRound, Banknote,
  Plus, TrendingUp, TrendingDown, Wallet, CalendarClock, Target, Bell, BellRing,
} from 'lucide-react'
import TicketModal, { type Booking as TicketBooking } from './bookings/TicketModal'
import { langOf, waMessage, waUrl, LANG_LABEL, TEMPLATE_LABEL, type Template } from './flightDeskText'
import Time24Select from './Time24Select'

const sora = Sora({ subsets: ['latin', 'latin-ext'], weight: ['300', '400', '600', '700'], display: 'swap' })

/* palette: night #0B1A2C · panel #10233A · line #1E3654 · ink #E7EEF6 · mute #8098B3
   brand #F97316 · ok #2DD4BF · warn #FBBF24 · bad #F87171 */
type Tone = 'ok' | 'warn' | 'bad'
const TONE_COLOR: Record<Tone, string> = { ok: '#2DD4BF', warn: '#FBBF24', bad: '#F87171' }
const VERDICT: Record<Tone, string> = { ok: 'Uçulur', warn: 'Dikkatli', bad: 'Zor görünüyor' }

type Booking = {
  id: string; first_name?: string; last_name?: string; email?: string; phone?: string; flight_date: string; flight_type?: string
  guests?: number; total_price?: number; base_price?: number; addon_price?: number; status: string; notes?: string
  addon_photo?: boolean; addon_video?: boolean; addon_bundle?: boolean; created_at?: string; flight_time?: string | null
}
type Ops = { pickup?: string; hotel?: string; pilot?: string; paid?: boolean; note?: string }
type Hour = { hour: number; tone: Tone; why: string[]; t1200: number; d1200: number; t1900: number; head: number; beach: number | null; gust: number | null; rain: number | null }
type Day = { date: string; verdict: Tone; okHours: number; warnHours: number; window: { from: number; to: number } | null; sunrise: string | null; sunset: string | null; maxGust: number | null; maxRain: number | null; hours: Hour[] }
type Station = { label: string; elevation: string; temperatureC: number | null; windSpeedKmh: number | null; windGustKmh: number | null; windDirectionDeg: number | null }

type Sum = { revenue: number; guests: number; count: number }

type Props = {
  today: string
  upcoming: Booking[]; laterPending: Booking[]; unclosed: Booking[]
  fresh: Booking[]; seen: string[]
  ops: Record<string, Ops>
  outlook: { days: Day[]; model: string; fetchedAt: string; error: string | null }
  live: { stations: Station[]; fetchedAt: string } | null
  waInbox: { id: string; from: string; summary: string; at: string }[]
  agents: { total: number; errors: { agent: string; action: string; error?: string; at: string }[] }
  sources: Record<string, string>
  money: {
    usdTry: number | null
    earnedMonth: Sum; earnedLastSame: Sum; earnedLastFull: Sum
    aheadConfirmed: Sum; aheadPending: Sum
    week: { bookings: number; guests: number }; prevWeek: { bookings: number }
    last30: { bookings: number; value: number; cancelled: number }; prev30: { bookings: number }
    trend: { date: string; bookings: number; guests: number; value: number; adCost: number | null }[]
    channels: { channel: string; bookings: number; value: number }[]
    tracked: number
    ads: {
      spend7: number | null; spendPrev7: number | null; clicks7: number | null; conv7: number | null
      spend30: number; clicks30: number; budgetDaily: number | null
      googleBookings30: number; googleValue30: number
      generatedAt: string | null; issues: string[]; actions: string[]
    } | null
  }
}

const STATUS_TR: Record<string, string> = { pending: 'bekliyor', confirmed: 'onaylı', completed: 'uçtu', cancelled: 'iptal' }
const STATUS_COLOR: Record<string, string> = { pending: '#FBBF24', confirmed: '#2DD4BF', completed: '#7DD3FC', cancelled: '#F87171' }
const TYPE_TR: Record<string, string> = { standard: 'Standart', high: 'Yüksek irtifa', sunset: 'Gün batımı', acro: 'Akro' }
const CARDINAL = ['K', 'KD', 'D', 'GD', 'G', 'GB', 'B', 'KB']
const STATION_TR: Record<string, string> = { 'Babadağ Summit': 'Zirve', 'Babadağ 1200m Take-off': '1200 kalkış', 'Ölüdeniz Beach (Landing)': 'Plaj' }
const STATION_ORDER = ['Babadağ 1200m Take-off', 'Babadağ Summit', 'Ölüdeniz Beach (Landing)']
const PRICE = 150 // kişi başı, USD

const nf = (n: number, d = 0) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: d, minimumFractionDigits: d }).format(n)
const ago = (iso?: string | null) => {
  if (!iso) return '—'
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (m < 1) return 'şimdi'
  if (m < 60) return `${m} dk önce`
  const h = Math.round(m / 60)
  return h < 48 ? `${h} sa önce` : `${Math.round(h / 24)} gün önce`
}
const addDays = (iso: string, n: number) => { const t = new Date(iso + 'T12:00:00Z'); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10) }
const dayName = (iso: string, today: string, style: 'long' | 'short' = 'long') => {
  if (iso === today) return 'Bugün'
  if (iso === addDays(today, 1)) return 'Yarın'
  return new Intl.DateTimeFormat('tr-TR', { weekday: style, timeZone: 'UTC' }).format(new Date(iso + 'T12:00:00Z'))
}
const dayFull = (iso: string, today: string) => {
  const d = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(iso + 'T12:00:00Z'))
  return `${dayName(iso, today)}, ${d}`
}
const fullName = (b: Booking) => [b.first_name, b.last_name].filter(Boolean).join(' ').trim() || 'İsimsiz'
const guestsOf = (b: Booking) => b.guests || 1
const hh = (h: number) => `${String(h).padStart(2, '0')}:00`

// Kısa üçlü "ding" — ses dosyası gerekmez.
function chime() {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext
    const ctx = new Ctx()
    ;[880, 1175, 1568].forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain()
      o.type = 'sine'; o.frequency.value = f
      const t = ctx.currentTime + i * 0.18
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.35, t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4)
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.45)
    })
    setTimeout(() => ctx.close().catch(() => {}), 1500)
  } catch {}
}

async function getJson(url: string) {
  try {
    const r = await fetch(url, { credentials: 'include', cache: 'no-store' })
    return await r.json()
  } catch (e: any) { return { error: e?.message || 'hata' } }
}

/* ── small pieces ──────────────────────────────────────────────────────── */
function Card({ title, icon: Icon, right, children, className = '' }: { title: string; icon?: any; right?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-[#1E3654] bg-[#10233A]/70 p-4 sm:p-5 ${className}`}>
      <header className="mb-3 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-[13px] font-medium text-[#8098B3]">{Icon && <Icon className="h-4 w-4" aria-hidden />}{title}</h2>
        {right}
      </header>
      {children}
    </section>
  )
}

const btn = 'inline-flex items-center justify-center gap-1 rounded-lg px-2.5 py-1.5 text-[12px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2DD4BF] disabled:opacity-50'
const ghost = `${btn} border border-[#1E3654] text-[#C9D6E4] hover:border-[#2DD4BF] hover:text-white`

function WaMenu({ b, ops, compact = false, only }: { b: Booking; ops?: Ops; compact?: boolean; only?: Template[] }) {
  const [open, setOpen] = useState(false)
  if (!b.phone) return null
  const lang = langOf(b.phone)
  const list: Template[] = only || ['confirm', 'pickup', 'weather', 'thanks']
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} className={`${btn} border border-[#1E3654] text-[#C9D6E4] hover:border-[#25D366] hover:text-[#25D366]`} aria-expanded={open} aria-label={`${fullName(b)} WhatsApp mesajı`}>
        <MessageCircle className="h-3.5 w-3.5" />{!compact && <>WA <span className="text-[10px] text-[#5F7894]">{LANG_LABEL[lang]}</span></>}<ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <>
          <button className="fixed inset-0 z-10 cursor-default" aria-label="Kapat" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-52 overflow-hidden rounded-xl border border-[#1E3654] bg-[#0B1A2C] shadow-2xl">
            {list.map(t => {
              const missing = t === 'pickup' && !ops?.pickup
              return (
                <a
                  key={t}
                  href={missing ? undefined : waUrl(b.phone!, waMessage(t, lang, { name: b.first_name || '', date: b.flight_date, guests: guestsOf(b), time: ops?.pickup, hotel: ops?.hotel }))}
                  target="_blank" rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  aria-disabled={missing}
                  className={`block px-3 py-2 text-[13px] ${missing ? 'cursor-not-allowed text-[#5F7894]' : 'text-[#E7EEF6] hover:bg-[#13294A]'}`}
                >
                  {TEMPLATE_LABEL[t]}{missing && <span className="block text-[11px]">önce alış saatini yaz</span>}
                </a>
              )
            })}
            <a href={waUrl(b.phone)} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="block border-t border-[#1E3654] px-3 py-2 text-[13px] text-[#8098B3] hover:bg-[#13294A]">Boş mesaj</a>
          </div>
        </>
      )}
    </div>
  )
}

/* ── hourly flight window ──────────────────────────────────────────────── */
function HourStrip({ day, isToday }: { day: Day; isToday: boolean }) {
  const nowH = Number(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hour12: false, timeZone: 'Europe/Istanbul' }).format(new Date()))
  return (
    <div className="-mx-1 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]">
      <div className="grid min-w-[520px] gap-1" style={{ gridTemplateColumns: `repeat(${day.hours.length}, minmax(0, 1fr))` }}>
        {day.hours.map(h => {
          const past = isToday && h.hour < nowH
          const current = isToday && h.hour === nowH
          return (
            <div
              key={h.hour}
              title={`${hh(h.hour)} · 1200 m: ${Math.round(h.t1200)} km/s ${CARDINAL[Math.round(h.d1200 / 45) % 8]} · 1900 m: ${Math.round(h.t1900)} km/s${h.gust != null ? ` · plaj hamlesi ${Math.round(h.gust)}` : ''}${h.rain != null ? ` · yağmur %${Math.round(h.rain)}` : ''}${h.why.length ? `\n${h.why.join(', ')}` : ''}`}
              className={`flex flex-col items-center rounded-lg pb-1.5 pt-1 ${current ? 'ring-2 ring-white/70' : ''} ${past ? 'opacity-40' : ''}`}
              style={{ background: `${TONE_COLOR[h.tone]}22` }}
            >
              <span className="text-[10px] tabular-nums text-[#8098B3]">{String(h.hour).padStart(2, '0')}</span>
              <span className="mt-1 h-1.5 w-full rounded-full" style={{ background: TONE_COLOR[h.tone] }} aria-hidden />
              <span className={`${sora.className} mt-1.5 text-[15px] leading-none tabular-nums text-[#E7EEF6]`}>{Math.round(h.t1200)}</span>
              <ArrowUp className="mt-1 h-3.5 w-3.5 text-[#C9D6E4]" style={{ transform: `rotate(${(h.d1200 + 180) % 360}deg)` }} aria-label={`rüzgâr ${CARDINAL[Math.round(h.d1200 / 45) % 8]} yönünden`} />
              <span className={`mt-1 text-[10px] tabular-nums ${h.gust != null && h.gust >= 25 ? 'text-[#FBBF24]' : 'text-[#5F7894]'}`}>{h.gust != null ? Math.round(h.gust) : '—'}</span>
              {h.rain != null && h.rain >= 30 && <span className="text-[9px] tabular-nums text-[#7DD3FC]">%{Math.round(h.rain)}</span>}
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex min-w-[520px] flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#5F7894]">
        <span>büyük sayı: 1200 m kalkış rüzgârı (km/s) · ok: rüzgârın gittiği yön · alt sayı: plaj hamlesi</span>
        <span className="ml-auto flex gap-3"><span style={{ color: TONE_COLOR.ok }}>● uygun</span><span style={{ color: TONE_COLOR.warn }}>● dikkat</span><span style={{ color: TONE_COLOR.bad }}>● zor</span></span>
      </div>
    </div>
  )
}

/* ── 30-day bookings vs ad spend (two aligned single-series bar charts, one shared hover) ── */
const C_BOOK = '#E5640C', C_ADS = '#3B8BE0' // validated against #10233A (dark), CVD ΔE 26
function TrendChart({ rows, today }: { rows: Props['money']['trend']; today: string }) {
  const [hover, setHover] = useState<number | null>(null)
  const maxB = Math.max(1, ...rows.map(r => r.bookings))
  const maxA = Math.max(1, ...rows.map(r => r.adCost || 0))
  const hasAds = rows.some(r => (r.adCost || 0) > 0)
  const fmt = (iso: string) => new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(iso + 'T12:00:00Z'))
  const h = hover != null ? rows[hover] : null
  const Bars = ({ val, max, color, height, label }: { val: (r: any) => number; max: number; color: string; height: number; label: string }) => (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-[11px] text-[#8098B3]"><span>{label}</span><span className="tabular-nums text-[#5F7894]">en yüksek {nf(max)}</span></div>
      <div className="flex items-end gap-[2px] border-b border-[#35506F]" style={{ height }}>
        {rows.map((r, i) => {
          const v = val(r)
          return (
            <div key={r.date} className="flex h-full flex-1 items-end" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onClick={() => setHover(i)}>
              <div className="w-full rounded-t-[3px]" style={{ height: v > 0 ? Math.max(3, (v / max) * (height - 4)) : 0, background: color, opacity: hover == null || hover === i ? 1 : 0.45 }} />
            </div>
          )
        })}
      </div>
    </div>
  )
  return (
    <div className="relative" role="img" aria-label="Son 30 gün: günlük yeni rezervasyon ve reklam harcaması">
      <div className="space-y-3">
        <Bars val={r => r.bookings} max={maxB} color={C_BOOK} height={84} label="Gelen rezervasyon / gün" />
        {hasAds && <Bars val={r => r.adCost || 0} max={maxA} color={C_ADS} height={52} label="Google Ads harcaması / gün (₺)" />}
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] tabular-nums text-[#5F7894]">
        <span>{fmt(rows[0].date)}</span><span>{fmt(rows[14].date)}</span><span>{rows[rows.length - 1].date === today ? 'bugün' : fmt(rows[rows.length - 1].date)}</span>
      </div>
      {h && (
        <div className="pointer-events-none absolute -top-2 z-10 w-44 -translate-x-1/2 rounded-lg border border-[#1E3654] bg-[#0B1A2C] px-3 py-2 text-[12px] shadow-xl" style={{ left: `${Math.min(88, Math.max(12, ((hover! + 0.5) / rows.length) * 100))}%` }}>
          <div className="mb-1 text-[#8098B3]">{fmt(h.date)}</div>
          <div className="flex items-center justify-between gap-2"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: C_BOOK }} />rezervasyon</span><span className="tabular-nums text-white">{h.bookings}{h.bookings ? ` · $${nf(h.value)}` : ''}</span></div>
          {hasAds && <div className="mt-0.5 flex items-center justify-between gap-2"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: C_ADS }} />reklam</span><span className="tabular-nums text-white">{h.adCost != null ? `₺${nf(h.adCost)}` : '—'}</span></div>}
        </div>
      )}
    </div>
  )
}

/* ── quick booking (WhatsApp / phone / agency / walk-in) ───────────────── */
const CHANNELS = ['WhatsApp', 'Telefon', 'Acenta / otel', 'Yürüyerek gelen', 'Instagram DM', 'Diğer']
function QuickAdd({ today, onClose, onSaved }: { today: string; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({ name: '', phone: '', flight_date: today, guests: '1', price_per_person: String(PRICE), channel: 'WhatsApp', notes: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const set = (k: keyof typeof f, v: string) => setF(x => ({ ...x, [k]: v }))
  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError(null)
    try {
      const r = await fetch('/api/admin/quick-booking', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`)
      onSaved()
    } catch (e: any) { setError(e?.message || 'Kaydedilemedi') }
    setSaving(false)
  }
  const input = 'w-full rounded-lg border border-[#1E3654] bg-[#0B1A2C] px-3 py-2 text-[14px] text-white outline-none focus:border-[#2DD4BF] [color-scheme:dark]'
  const total = (Number(f.price_per_person) || 0) * (parseInt(f.guests) || 1)
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <form onSubmit={save} onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-t-2xl border border-[#1E3654] bg-[#10233A] p-5 sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className={`${sora.className} text-[18px] font-semibold`}>Rezervasyon ekle</h2>
          <button type="button" onClick={onClose} className="text-[#8098B3] hover:text-white" aria-label="Kapat"><X className="h-5 w-5" /></button>
        </div>
        <p className="mb-4 text-[12px] text-[#8098B3]">WhatsApp, telefon, acenta ya da yürüyerek gelen müşteri. Kaydedince ciroya ve uçuş listesine girer, müşteriye e-posta gitmez.</p>
        <div className="grid grid-cols-2 gap-3">
          <label className="col-span-2 text-[12px] text-[#8098B3]">Ad soyad<input required autoFocus value={f.name} onChange={e => set('name', e.target.value)} className={`${input} mt-1`} /></label>
          <label className="text-[12px] text-[#8098B3]">Telefon<input value={f.phone} onChange={e => set('phone', e.target.value)} placeholder="+44…" className={`${input} mt-1`} /></label>
          <label className="text-[12px] text-[#8098B3]">Uçuş günü<input type="date" required value={f.flight_date} onChange={e => set('flight_date', e.target.value)} className={`${input} mt-1`} /></label>
          <label className="text-[12px] text-[#8098B3]">Kişi<input type="number" min={1} max={30} value={f.guests} onChange={e => set('guests', e.target.value)} className={`${input} mt-1`} /></label>
          <label className="text-[12px] text-[#8098B3]">Kişi başı $<input type="number" min={0} value={f.price_per_person} onChange={e => set('price_per_person', e.target.value)} className={`${input} mt-1`} /></label>
          <label className="col-span-2 text-[12px] text-[#8098B3]">Nereden geldi
            <div className="mt-1 flex flex-wrap gap-1.5">
              {CHANNELS.map(c => (
                <button type="button" key={c} onClick={() => set('channel', c)} className={`rounded-lg px-2.5 py-1.5 text-[12px] ${f.channel === c ? 'bg-[#F97316] text-white' : 'border border-[#1E3654] text-[#C9D6E4] hover:border-[#35506F]'}`}>{c}</button>
              ))}
            </div>
          </label>
          <label className="col-span-2 text-[12px] text-[#8098B3]">Not<input value={f.notes} onChange={e => set('notes', e.target.value)} placeholder="Otel, acenta adı…" className={`${input} mt-1`} /></label>
        </div>
        {error && <p className="mt-3 text-[13px] text-[#F87171]">{error}</p>}
        <button disabled={saving} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F97316] py-3 text-[14px] font-semibold text-white hover:bg-[#EA6A0F] disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}Kaydet · ${nf(total)}
        </button>
      </form>
    </div>
  )
}

/* ── main ──────────────────────────────────────────────────────────────── */
export default function FlightDesk(p: Props) {
  const router = useRouter()
  const [now, setNow] = useState<Date | null>(null)
  const [day, setDay] = useState(p.today)
  const [ops, setOps] = useState<Record<string, Ops>>(p.ops)
  const [statusOverride, setStatusOverride] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null)
  const [ticketFor, setTicketFor] = useState<Booking | null>(null)
  const [handled, setHandled] = useState<string[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [ext, setExt] = useState<{ ga4?: any; meta?: any; metaSpend?: any; ig?: any }>({})
  const [showAllUnclosed, setShowAllUnclosed] = useState(false)
  const [showWeather, setShowWeather] = useState(false)
  const [adding, setAdding] = useState(false)
  const [fresh, setFresh] = useState<Booking[]>(p.fresh)
  const [seenIds, setSeenIds] = useState<string[]>(p.seen)
  const [notifPerm, setNotifPerm] = useState<string>('unsupported')
  const knownRef = useRef<Set<string>>(new Set(p.fresh.map(b => b.id)))
  const titleRef = useRef<string>('')

  async function loadExt() {
    const [ga4, meta, metaSpend, ig] = await Promise.all([
      getJson('/api/admin/seo-data?type=ga4-overview'),
      getJson('/api/admin/meta-ads?type=account'),
      getJson('/api/admin/meta-ads?type=insights&date_preset=last_30d'),
      getJson('/api/admin/instagram/token-status'),
    ])
    setExt({ ga4, meta, metaSpend, ig })
  }
  useEffect(() => { setOps(p.ops) }, [p.ops])
  useEffect(() => { setFresh(p.fresh); p.fresh.forEach(b => knownRef.current.add(b.id)) }, [p.fresh])
  useEffect(() => { setSeenIds(s => Array.from(new Set([...s, ...p.seen]))) }, [p.seen])

  /* yeni rezervasyon sinyali: 30 sn'de bir kontrol, gelince ses + bildirim + sekme başlığı */
  useEffect(() => {
    try { setNotifPerm('Notification' in window ? Notification.permission : 'unsupported') } catch {}
    let alive = true
    async function tick() {
      const j = await getJson('/api/admin/new-bookings')
      if (!alive || !Array.isArray(j?.bookings)) return
      setFresh(j.bookings)
      if (Array.isArray(j.seen)) setSeenIds(s => Array.from(new Set([...s, ...j.seen.map(String)])))
      const added = (j.bookings as Booking[]).filter(b => !knownRef.current.has(b.id))
      added.forEach(b => knownRef.current.add(b.id))
      if (added.length) {
        chime()
        try {
          if ('Notification' in window && Notification.permission === 'granted') {
            for (const b of added.slice(0, 3)) {
              const n = new Notification(`🪂 Yeni rezervasyon: ${fullName(b)}`, {
                body: `${b.flight_date.slice(0, 10)}${b.flight_time ? ' · ' + b.flight_time : ''} · ${guestsOf(b)} kişi · $${nf(Number(b.total_price) || PRICE * guestsOf(b))}`,
                tag: 'booking-' + b.id, requireInteraction: true,
              })
              n.onclick = () => { window.focus(); n.close() }
            }
          }
        } catch {}
        router.refresh()
      }
    }
    const t = setInterval(tick, 30000)
    const onVis = () => { if (document.visibilityState === 'visible') tick() }
    document.addEventListener('visibilitychange', onVis)
    return () => { alive = false; clearInterval(t); document.removeEventListener('visibilitychange', onVis) }
  }, [])
  async function askNotif() {
    try {
      const r = await Notification.requestPermission()
      setNotifPerm(r)
      if (r === 'granted') { chime(); new Notification('Bildirimler açık', { body: 'Yeni rezervasyon gelince burada ve sesli haber vereceğim.' }) }
    } catch {}
  }
  async function markSeen(ids: string[]) {
    setSeenIds(s => Array.from(new Set([...s, ...ids])))
    await fetch('/api/admin/flight-ops', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ seen: ids }) }).catch(() => {})
  }
  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 30000)
    try { setShowWeather(localStorage.getItem('desk-weather') === '1') } catch {}
    loadExt()
    return () => clearInterval(t)
  }, [])
  function toggleWeather() {
    setShowWeather(v => { try { localStorage.setItem('desk-weather', v ? '0' : '1') } catch {} return !v })
  }

  const st = (b: Booking) => statusOverride[b.id] || b.status
  const week = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(p.today, i)), [p.today])
  const outlookBy = useMemo(() => Object.fromEntries(p.outlook.days.map(d => [d.date, d])), [p.outlook.days])
  const byDay = useMemo(() => {
    const m: Record<string, Booking[]> = {}
    for (const b of p.upcoming) (m[b.flight_date.slice(0, 10)] ||= []).push(b)
    return m
  }, [p.upcoming])
  const live = (d: string) => (byDay[d] || []).filter(b => st(b) !== 'cancelled')
  const guestsOn = (d: string) => live(d).reduce((s, b) => s + guestsOf(b), 0)
  const valueOf = (b: Booking) => Number(b.total_price) || PRICE * guestsOf(b)
  const unseen = fresh.filter(b => !seenIds.includes(b.id) && st(b) !== 'cancelled')
  useEffect(() => {
    if (!titleRef.current) titleRef.current = document.title.replace(/^\(\d+\) 🔔 [^|]*\| /, '')
    document.title = unseen.length ? `(${unseen.length}) 🔔 Yeni rezervasyon | ${titleRef.current}` : titleRef.current
  }, [unseen.length])

  /* actions */
  async function setStatus(b: Booking, status: string) {
    setBusy(b.id); setErr(null); setConfirmCancel(null)
    setStatusOverride(s => ({ ...s, [b.id]: status }))
    try {
      const r = await fetch('/api/bookings', { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: b.id, status }) })
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || `HTTP ${r.status}`)
      router.refresh()
    } catch (e: any) {
      setStatusOverride(s => { const n = { ...s }; delete n[b.id]; return n })
      setErr(`${fullName(b)} güncellenemedi: ${e?.message || 'hata'}`)
    }
    setBusy(null)
  }
  async function saveOps(id: string, patch: Ops) {
    setOps(o => ({ ...o, [id]: { ...(o[id] || {}), ...patch } }))
    try {
      const r = await fetch('/api/admin/flight-ops', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, patch }) })
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
    } catch (e: any) { setErr(`Kaydedilemedi: ${e?.message || 'hata'}`) }
  }
  async function markHandled(id: string) {
    setHandled(h => [...h, id])
    await fetch('/api/admin/flight-ops', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ waHandled: id }) }).catch(() => {})
  }
  async function refreshAll() {
    setRefreshing(true); setStatusOverride({}); router.refresh()
    await loadExt(); setRefreshing(false)
  }

  /* money */
  const M = p.money
  const pctChange = (a: number, b: number) => (b > 0 ? Math.round(((a - b) / b) * 100) : null)
  const monthDelta = pctChange(M.earnedMonth.revenue, M.earnedLastSame.revenue)
  const toUsd = (tl: number | null | undefined) => (tl != null && M.usdTry ? tl / M.usdTry : null)
  const ads = M.ads
  const spend30Usd = toUsd(ads?.spend30)
  const roas = spend30Usd && spend30Usd > 0 && ads ? ads.googleValue30 / spend30Usd : null
  const metaSpend30 = (ext.metaSpend?.data || []).reduce((s: number, r: any) => s + Number(r.spend || 0), 0)
  const metaStatus = ext.meta && !ext.meta.error ? Number(ext.meta.account_status) : null
  const visitors = ext.ga4?.overview?.activeUsers
  const monthName = new Intl.DateTimeFormat('tr-TR', { month: 'long', timeZone: 'UTC' }).format(new Date(p.today + 'T12:00:00Z'))

  /* selected day */
  const sel = outlookBy[day]
  const dayList = live(day).slice().sort((a, b) => (ops[a.id]?.pickup || '99').localeCompare(ops[b.id]?.pickup || '99') || fullName(a).localeCompare(fullName(b)))
  const dayGuests = dayList.reduce((s, b) => s + guestsOf(b), 0)
  const dayExpected = dayList.reduce((s, b) => s + valueOf(b), 0)
  const dayPaid = dayList.filter(b => ops[b.id]?.paid).reduce((s, b) => s + valueOf(b), 0)
  const noPickup = dayList.filter(b => !ops[b.id]?.pickup).length
  const noPilot = dayList.filter(b => !ops[b.id]?.pilot).length
  const pilots = useMemo(() => Array.from(new Set(Object.values(ops).map(o => o.pilot).filter(Boolean) as string[])).sort(), [ops])
  const stations = p.live ? [...p.live.stations].sort((a, b) => STATION_ORDER.indexOf(a.label) - STATION_ORDER.indexOf(b.label)) : []

  /* to-do inbox — money first */
  type Item = { key: string; tone: Tone; title: string; sub?: string; body?: React.ReactNode }
  const items: Item[] = []
  const pendings = [...p.upcoming, ...p.laterPending].filter(b => st(b) === 'pending')
  for (const b of pendings.slice(0, 6)) {
    const hrs = b.created_at ? (Date.now() - new Date(b.created_at).getTime()) / 3600000 : 0
    items.push({
      key: 'p' + b.id, tone: hrs > 2 ? 'bad' : 'warn',
      title: `$${nf(valueOf(b))} onay bekliyor: ${fullName(b)}`, sub: `${dayFull(b.flight_date.slice(0, 10), p.today)} · ${guestsOf(b)} kişi · geldi ${ago(b.created_at)}${hrs > 2 ? ' (2 saat sözü geçti)' : ''}`,
      body: (
        <div className="mt-2 flex flex-wrap gap-1.5">
          <button disabled={busy === b.id} onClick={() => setStatus(b, 'confirmed')} className={`${btn} bg-[#2DD4BF] text-[#0B1A2C] hover:bg-[#5EEAD4]`}>{busy === b.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}Onayla</button>
          <WaMenu b={b} ops={ops[b.id]} only={['confirm', 'weather']} />
          {b.phone && <a href={`tel:${b.phone.replace(/[^\d+]/g, '')}`} className={ghost} aria-label="Ara"><Phone className="h-3.5 w-3.5" /></a>}
          {confirmCancel === b.id
            ? <button onClick={() => setStatus(b, 'cancelled')} className={`${btn} bg-[#F87171] text-[#0B1A2C]`}>İptal et?</button>
            : <button onClick={() => setConfirmCancel(b.id)} className={`${btn} border border-[#1E3654] text-[#8098B3] hover:border-[#F87171] hover:text-[#F87171]`} aria-label="İptal"><X className="h-3.5 w-3.5" /></button>}
        </div>
      ),
    })
  }
  if (pendings.length > 6) items.push({ key: 'pmore', tone: 'warn', title: `${pendings.length - 6} rezervasyon daha onay bekliyor`, body: <Link href="/admin/bookings" className="mt-1 inline-block text-[12px] text-[#8098B3] underline">Rezervasyonlar</Link> })
  for (const w of p.waInbox.filter(w => !handled.includes(w.id))) {
    items.push({
      key: 'wa' + w.id, tone: 'bad', title: `Potansiyel müşteri: +${w.from} WhatsApp'ta cevap bekliyor`, sub: `${w.summary} · ${ago(w.at)}`,
      body: (
        <div className="mt-2 flex flex-wrap gap-1.5">
          <a href={waUrl(w.from)} target="_blank" rel="noopener noreferrer" className={`${btn} bg-[#25D366] text-[#0B1A2C]`}><MessageCircle className="h-3.5 w-3.5" />Konuşmayı aç</a>
          <button onClick={() => setAdding(true)} className={ghost}><Plus className="h-3.5 w-3.5" />Rezervasyona çevir</button>
          <button onClick={() => markHandled(w.id)} className={ghost}><Check className="h-3.5 w-3.5" />İlgilendim</button>
        </div>
      ),
    })
  }
  const unclosed = p.unclosed.filter(b => !['completed', 'cancelled'].includes(st(b)))
  if (unclosed.length) {
    const shown = showAllUnclosed ? unclosed : unclosed.slice(0, 3)
    items.push({
      key: 'unclosed', tone: 'warn', title: `${unclosed.length} geçmiş uçuş kapatılmadı`, sub: 'Uçtu mu, iptal mi? İşaretlemezsen ciro yanlış görünür.',
      body: (
        <ul className="mt-2 space-y-1.5">
          {shown.map(b => (
            <li key={b.id} className="flex items-center justify-between gap-2 text-[13px]">
              <span className="min-w-0 truncate">{fullName(b)} <span className="text-[#5F7894]">· {b.flight_date.slice(5)} · ${nf(valueOf(b))}</span></span>
              <span className="flex shrink-0 gap-1">
                <button disabled={busy === b.id} onClick={() => setStatus(b, 'completed')} className={`${btn} border border-[#7DD3FC]/40 text-[#7DD3FC] hover:bg-[#7DD3FC]/10`}>Uçtu</button>
                <button disabled={busy === b.id} onClick={() => setStatus(b, 'cancelled')} className={`${btn} border border-[#1E3654] text-[#8098B3] hover:border-[#F87171] hover:text-[#F87171]`}>İptal</button>
              </span>
            </li>
          ))}
          {unclosed.length > 3 && <li><button onClick={() => setShowAllUnclosed(v => !v)} className="text-[12px] text-[#8098B3] hover:text-white">{showAllUnclosed ? 'daha az' : `${unclosed.length - 3} tane daha`}</button></li>}
        </ul>
      ),
    })
  }
  for (const t of ads?.issues || []) items.push({ key: 'ads' + t, tone: 'bad', title: `Google Ads: ${t}`, sub: 'Para harcanıyor ama rezervasyon gelmiyor.', body: <Link href="/admin/google-ads" className="mt-1 inline-block text-[12px] text-[#8098B3] underline">Günlük rapor</Link> })
  if (metaStatus != null && metaStatus !== 1) items.push({ key: 'meta', tone: 'warn', title: 'Meta reklamları durmuş', sub: metaStatus === 3 ? `Ödenmemiş bakiye${ext.meta.balance ? ` ₺${nf(Number(ext.meta.balance))}` : ''}` : `Hesap durumu ${metaStatus}`, body: <Link href="/admin/meta-ads" className="mt-1 inline-block text-[12px] text-[#8098B3] underline">Meta reklamları</Link> })
  for (const d of week.slice(0, 3)) {
    const o = outlookBy[d], g = guestsOn(d)
    if (o && o.verdict !== 'ok' && g > 0) items.push({
      key: 'wx' + d, tone: o.verdict === 'bad' ? 'bad' : 'warn',
      title: `${dayName(d, p.today)} ${g} yolcu var, hava ${o.verdict === 'bad' ? 'uygun görünmüyor' : 'riskli'}`,
      sub: `${o.window ? `En iyi aralık ${hh(o.window.from)}–${hh(o.window.to + 1)}.` : 'Uygun saat yok.'} Gerekirse müşteriyi başka güne al, parayı kaçırma.`,
      body: <button onClick={() => setDay(d)} className={`${ghost} mt-2`}>Listeyi aç</button>,
    })
  }
  for (const d of week.slice(0, 2)) {
    const miss = live(d).filter(b => st(b) === 'confirmed' && !ops[b.id]?.pickup)
    if (miss.length) items.push({ key: 'pk' + d, tone: d === p.today ? 'bad' : 'warn', title: `${dayName(d, p.today)} ${miss.length} müşterinin alış saati yok`, sub: 'Saati ve oteli yaz, müşteriye tek tuşla gönder.', body: <button onClick={() => setDay(d)} className={`${ghost} mt-2`}>Listeyi aç</button> })
  }
  for (const a of p.agents.errors) items.push({ key: 'ag' + a.agent, tone: 'warn', title: `${a.agent} ajanı hata verdi`, sub: `${(a.error || a.action || '').slice(0, 110)} · ${ago(a.at)}`, body: <Link href="/admin/mission-control" className="mt-1 inline-block text-[12px] text-[#8098B3] underline">Mission Control</Link> })
  if (ext.ig?.valid === false) items.push({ key: 'ig', tone: 'warn', title: 'Instagram bağlantısı kopmuş', body: <Link href="/admin/instagram" className="mt-1 inline-block text-[12px] text-[#8098B3] underline">Instagram</Link> })
  const order: Record<Tone, number> = { bad: 0, warn: 1, ok: 2 }
  items.sort((a, b) => order[a.tone] - order[b.tone])

  const dateTitle = now ? new Intl.DateTimeFormat('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Istanbul' }).format(now) : ''
  const clock = now ? new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' }).format(now) : ''
  const shortcuts = [
    { href: '/admin/bookings', label: 'Rezervasyonlar', icon: ListChecks },
    { href: '/admin/ticket', label: 'Bilet bas', icon: Ticket },
    { href: '/admin/google-ads', label: 'Google Ads', icon: Search },
    { href: '/admin/meta-ads', label: 'Meta', icon: Megaphone },
    { href: '/admin/calendar', label: 'Takvim', icon: CalendarDays },
    { href: '/admin/analyze', label: 'Analiz', icon: BarChart3 },
    { href: '/admin/instagram', label: 'Instagram', icon: Instagram },
    { href: '/admin/mission-control', label: `Ajanlar ${p.agents.total - p.agents.errors.length}/${p.agents.total}`, icon: Radar },
  ]
  const Delta = ({ v }: { v: number | null }) => v == null ? null : (
    <span className={`inline-flex items-center gap-0.5 ${v >= 0 ? 'text-[#2DD4BF]' : 'text-[#F87171]'}`}>{v >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}%{Math.abs(v)}</span>
  )

  return (
    <div className="-m-4 min-h-screen bg-[#0B1A2C] px-3 py-5 text-[#E7EEF6] sm:px-6 md:-m-8 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1400px] space-y-4">

        {/* header */}
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[13px] capitalize text-[#8098B3]">{dateTitle}</p>
            <h1 className={`${sora.className} mt-1 text-[24px] font-semibold tracking-tight sm:text-[28px]`}>Uçuş Masası</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className={`${sora.className} hidden text-[24px] font-light tabular-nums text-[#8098B3] sm:inline`} aria-label="Saat (İstanbul)">{clock}</span>
            {notifPerm === 'default' && (
              <button onClick={askNotif} className="flex items-center gap-2 rounded-lg border border-[#F97316] px-3 py-2 text-[13px] text-[#F97316] hover:bg-[#F97316]/10">
                <Bell className="h-4 w-4" aria-hidden />Bildirim aç
              </button>
            )}
            {notifPerm === 'granted' && <span className="hidden items-center gap-1 text-[12px] text-[#2DD4BF] sm:flex" title="Yeni rezervasyon gelince sesli bildirim"><BellRing className="h-4 w-4" aria-hidden />açık</span>}
            {notifPerm === 'denied' && <span className="hidden text-[11px] text-[#5F7894] sm:inline" title="Tarayıcı ayarlarından bu site için bildirimlere izin ver">bildirim kapalı</span>}
            <button onClick={refreshAll} className="flex items-center gap-2 rounded-lg border border-[#1E3654] px-3 py-2 text-[13px] text-[#8098B3] hover:border-[#2DD4BF] hover:text-[#E7EEF6]" aria-label="Yenile">
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} aria-hidden />
            </button>
            <button onClick={() => setAdding(true)} className="flex items-center gap-2 rounded-lg bg-[#F97316] px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-[#EA6A0F]">
              <Plus className="h-4 w-4" aria-hidden />Rezervasyon ekle
            </button>
          </div>
        </header>

        {/* ── YENİ REZERVASYONLAR ── */}
        {unseen.length > 0 && (
          <section aria-label="Yeni rezervasyonlar" className="rounded-2xl border-2 border-[#F97316] bg-[#F97316]/10 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className={`${sora.className} flex items-center gap-2.5 text-[18px] font-semibold text-white`}>
                <span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F97316] opacity-75" /><span className="relative inline-flex h-3 w-3 rounded-full bg-[#F97316]" /></span>
                {unseen.length} yeni rezervasyon
              </h2>
              {unseen.length > 1 && <button onClick={() => markSeen(unseen.map(b => b.id))} className={ghost}><Check className="h-3.5 w-3.5" />Hepsini gördüm</button>}
            </div>
            <ul className="mt-3 grid gap-2 md:grid-cols-2">
              {unseen.map(b => {
                const d = b.flight_date.slice(0, 10)
                const time = b.flight_time || (b.notes || '').match(/\[Saat (\d{2}:\d{2})\]/)?.[1]
                const s = st(b)
                return (
                  <li key={b.id} className="rounded-xl border border-[#1E3654] bg-[#0B1A2C]/80 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-semibold text-white">{fullName(b)}</p>
                        <p className="mt-0.5 text-[13px] text-[#C9D6E4]"><span className="capitalize">{dayFull(d, p.today)}</span>{time ? ` · ${time}` : ''} · {guestsOf(b)} kişi</p>
                        <p className="mt-0.5 text-[12px] text-[#8098B3]">geldi {ago(b.created_at)}{p.sources[b.id] ? ` · ${p.sources[b.id]}` : ''}{b.notes ? ` · “${b.notes.replace(/\[Saat \d{2}:\d{2}\]\s*/, '').slice(0, 70)}”` : ''}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className={`${sora.className} text-[22px] leading-none tabular-nums text-white`}>${nf(valueOf(b))}</div>
                        <span className="mt-1 inline-block text-[11px]" style={{ color: STATUS_COLOR[s] }}>{STATUS_TR[s] || s}</span>
                      </div>
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {s === 'pending' && <button disabled={busy === b.id} onClick={() => setStatus(b, 'confirmed')} className={`${btn} bg-[#2DD4BF] text-[#0B1A2C] hover:bg-[#5EEAD4]`}>{busy === b.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}Onayla</button>}
                      <WaMenu b={b} ops={ops[b.id]} only={['confirm']} />
                      {b.phone && <a href={`tel:${b.phone.replace(/[^\d+]/g, '')}`} className={ghost} aria-label={`${fullName(b)} ara`}><Phone className="h-3.5 w-3.5" /></a>}
                      <button onClick={() => setTicketFor(b)} className={ghost}><Ticket className="h-3.5 w-3.5" />Bilet</button>
                      {week.includes(d) && <button onClick={() => { setDay(d); document.getElementById('ucus-listesi')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }} className={ghost}>Listede gör</button>}
                      <button onClick={() => markSeen([b.id])} className={`${btn} ml-auto bg-[#F97316] text-white hover:bg-[#EA6A0F]`}><Check className="h-3.5 w-3.5" />Gördüm</button>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {/* ── MONEY ── */}
        <section aria-label="Para" className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#1E3654] bg-[#1E3654] lg:grid-cols-4">
          <div className="col-span-2 bg-gradient-to-br from-[#1B2E22] to-[#10233A] p-4 sm:p-5 lg:col-span-1">
            <div className="flex items-center gap-2 text-[12px] text-[#8098B3]"><Wallet className="h-4 w-4" />{monthName} ayında kazanılan</div>
            <div className={`${sora.className} mt-2 text-[34px] font-light leading-none tabular-nums text-white sm:text-[40px]`}>${nf(M.earnedMonth.revenue)}</div>
            <div className="mt-2 flex flex-wrap gap-x-2 text-[12px] text-[#8098B3]">
              <span>{M.earnedMonth.guests} yolcu uçtu</span>
              <span>· geçen ay aynı dönem ${nf(M.earnedLastSame.revenue)} <Delta v={monthDelta} /></span>
            </div>
            <div className="text-[11px] text-[#5F7894]">geçen ay toplam ${nf(M.earnedLastFull.revenue)}</div>
          </div>
          <div className="bg-[#0F2136] p-4 sm:p-5">
            <div className="flex items-center gap-2 text-[12px] text-[#8098B3]"><CalendarClock className="h-4 w-4" />Önümüzdeki 30 gün</div>
            <div className={`${sora.className} mt-2 text-[26px] font-light leading-none tabular-nums`}>${nf(M.aheadConfirmed.revenue + M.aheadPending.revenue)}</div>
            <div className="mt-2 text-[12px] text-[#8098B3]">${nf(M.aheadConfirmed.revenue)} onaylı{M.aheadPending.revenue ? <span className="text-[#FBBF24]"> · ${nf(M.aheadPending.revenue)} onay bekliyor</span> : null}</div>
            <div className="text-[11px] text-[#5F7894]">{M.aheadConfirmed.guests + M.aheadPending.guests} yolcu</div>
          </div>
          <div className="bg-[#0F2136] p-4 sm:p-5">
            <div className="flex items-center gap-2 text-[12px] text-[#8098B3]"><Users className="h-4 w-4" />Yeni rezervasyon, 30 gün</div>
            <div className={`${sora.className} mt-2 text-[26px] font-light leading-none tabular-nums`}>{M.last30.bookings} <span className="text-[16px] text-[#8098B3]">· ${nf(M.last30.value)}</span></div>
            <div className="mt-2 text-[12px] text-[#8098B3]">önceki 30 gün {M.prev30.bookings} <Delta v={pctChange(M.last30.bookings, M.prev30.bookings)} /></div>
            <div className="text-[11px] text-[#5F7894]">bu hafta {M.week.bookings} (geçen hafta {M.prevWeek.bookings}){M.last30.cancelled ? ` · ${M.last30.cancelled} iptal` : ''}</div>
          </div>
          <div className="col-span-2 bg-[#0F2136] p-4 sm:p-5 lg:col-span-1">
            <div className="flex items-center gap-2 text-[12px] text-[#8098B3]"><Target className="h-4 w-4" />Reklam, 30 gün</div>
            <div className={`${sora.className} mt-2 text-[26px] font-light leading-none tabular-nums`}>{ads ? `₺${nf(ads.spend30 + metaSpend30)}` : '—'}{spend30Usd != null && <span className="text-[16px] text-[#8098B3]"> ≈ ${nf(toUsd((ads?.spend30 || 0) + metaSpend30) || 0)}</span>}</div>
            <div className="mt-2 text-[12px] text-[#8098B3]">
              {ads ? <>Google'dan {ads.googleBookings30} rezervasyon{ads.googleBookings30 ? ` · $${nf(ads.googleValue30)}` : ''}</> : 'rapor yok'}
              {roas != null && ads?.googleBookings30 ? <span className={roas >= 3 ? 'text-[#2DD4BF]' : 'text-[#FBBF24]'}> · her $1 → ${nf(roas, 1)}</span> : null}
            </div>
            <div className="text-[11px] text-[#5F7894]">{M.tracked < M.last30.bookings ? 'kaynak takibi 12 Ekim\'de başladı, eski kayıtlarda yok' : `${ads?.clicks30 ?? 0} tıklama`}</div>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-12">
          {/* LEFT */}
          <div className="order-2 space-y-4 lg:order-1 lg:col-span-8">
            {/* ops: 7 days + manifest (weather is secondary) */}
            <section id="ucus-listesi" className="scroll-mt-4 rounded-2xl border border-[#1E3654] bg-[#10233A]/70" aria-label="Uçuş listesi">
              <nav className="flex gap-1.5 overflow-x-auto border-b border-[#1E3654] p-3 [scrollbar-width:none]" aria-label="Gün seç">
                {week.map(d => {
                  const o = outlookBy[d], g = guestsOn(d), active = d === day
                  const v = live(d).reduce((s, b) => s + valueOf(b), 0)
                  const pend = live(d).some(b => st(b) === 'pending')
                  return (
                    <button key={d} onClick={() => setDay(d)} aria-pressed={active}
                      className={`relative flex min-w-[78px] flex-1 shrink-0 flex-col rounded-xl px-2.5 py-2 text-left ${active ? 'bg-[#F97316] text-white' : 'bg-[#0B1A2C]/60 text-[#C9D6E4] hover:bg-[#13294A]'}`}>
                      <span className="flex items-center justify-between text-[12px] capitalize">{dayName(d, p.today, 'short')}<span className={`h-2 w-2 rounded-full ${o ? '' : 'opacity-30'}`} style={{ background: o ? TONE_COLOR[o.verdict] : '#8098B3' }} title={o ? `Hava: ${VERDICT[o.verdict]}` : 'tahmin yok'} /></span>
                      <span className={`${sora.className} mt-1 text-[18px] leading-none tabular-nums ${!g && !active ? 'text-[#35506F]' : ''}`}>{g}<span className="ml-1 text-[11px] font-normal opacity-70">yolcu</span></span>
                      <span className={`mt-1 text-[11px] tabular-nums ${active ? 'text-white/80' : 'text-[#5F7894]'}`}>{v ? `$${nf(v)}` : '—'}</span>
                      {pend && <span className="absolute right-1.5 top-6 h-1.5 w-1.5 rounded-full bg-[#FBBF24]" aria-label="onay bekleyen var" />}
                    </button>
                  )
                })}
              </nav>
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-3 sm:px-5">
                <h2 className={`${sora.className} text-[18px] font-semibold capitalize`}>{dayFull(day, p.today)}</h2>
                <span className="flex flex-wrap gap-x-3 text-[12px] tabular-nums text-[#8098B3]">
                  <span>{dayList.length} rezervasyon · {dayGuests} yolcu</span>
                  {dayList.length > 0 && <span className={dayPaid >= dayExpected ? 'text-[#2DD4BF]' : ''}><Banknote className="mr-1 inline h-3.5 w-3.5" aria-hidden />${nf(dayPaid)} / ${nf(dayExpected)} tahsil</span>}
                  {noPickup > 0 && <span className="text-[#FBBF24]">{noPickup} alış saati yok</span>}
                  {noPilot > 0 && <span className="text-[#FBBF24]">{noPilot} pilot yok</span>}
                </span>
              </div>
              {/* compact weather line */}
              {sel && (
                <div className="px-4 pt-2 sm:px-5">
                  <button onClick={toggleWeather} className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-[#0B1A2C]/50 px-3 py-2 text-left text-[12px] text-[#8098B3] hover:bg-[#0B1A2C]" aria-expanded={showWeather}>
                    <Wind className="h-3.5 w-3.5" aria-hidden />
                    <span>Hava: <b style={{ color: TONE_COLOR[sel.verdict] }}>{VERDICT[sel.verdict]}</b></span>
                    {sel.window && <span className="tabular-nums">en iyi {hh(sel.window.from)}–{hh(sel.window.to + 1)}</span>}
                    {sel.sunset && <span className="flex items-center gap-1 tabular-nums"><Sunset className="h-3.5 w-3.5" aria-hidden />{sel.sunset}</span>}
                    <span className="ml-auto flex items-center gap-1">saat saat<ChevronDown className={`h-3.5 w-3.5 transition-transform ${showWeather ? 'rotate-180' : ''}`} /></span>
                  </button>
                  {showWeather && (
                    <div className="mt-2 rounded-lg bg-[#0B1A2C]/40 p-3">
                      <HourStrip day={sel} isToday={day === p.today} />
                      {day === p.today && stations.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-[#8098B3]">
                          {stations.map(s => <span key={s.label}>{STATION_TR[s.label] || s.label} şu an <b className="tabular-nums text-white">{s.windSpeedKmh != null ? Math.round(s.windSpeedKmh) : '—'}</b> km/s{s.windGustKmh != null ? `, hamle ${Math.round(s.windGustKmh)}` : ''}</span>)}
                        </div>
                      )}
                      <p className="mt-2 text-[11px] text-[#5F7894]">{p.outlook.model} modeli tahmini. Son karar pilotun.</p>
                    </div>
                  )}
                </div>
              )}
              {err && <p className="flex items-center gap-2 px-4 pt-3 text-[13px] text-[#FBBF24] sm:px-5"><AlertTriangle className="h-4 w-4" />{err}</p>}
              {dayList.length === 0 ? (
                <div className="px-4 py-8 text-center sm:px-5">
                  <p className="text-[13px] text-[#5F7894]">Bu gün için kayıtlı uçuş yok.</p>
                  <button onClick={() => setAdding(true)} className={`${ghost} mt-3`}><Plus className="h-3.5 w-3.5" />Rezervasyon ekle</button>
                </div>
              ) : (
                <ul className="mt-2 divide-y divide-[#1E3654] border-t border-[#1E3654]">
                  {dayList.map(b => {
                    const s = st(b), o = ops[b.id] || {}, isBusy = busy === b.id
                    return (
                      <li key={b.id} className="px-4 py-3 sm:px-5">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="flex min-w-0 items-start gap-2.5">
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: STATUS_COLOR[s] || '#8098B3' }} aria-hidden />
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                <span className="truncate text-[15px] text-white">{fullName(b)}</span>
                                <span className="inline-flex items-center gap-1 text-[12px] tabular-nums text-[#8098B3]"><Users className="h-3 w-3" aria-hidden />{guestsOf(b)}</span>
                                <span className="text-[12px] tabular-nums text-[#C9D6E4]">${nf(valueOf(b))}</span>
                                <span className="text-[12px]" style={{ color: STATUS_COLOR[s] || '#8098B3' }}>{STATUS_TR[s] || s}</span>
                                {p.sources[b.id] && <span className="rounded bg-[#1E3654] px-1.5 text-[11px] text-[#C9D6E4]">{p.sources[b.id]}</span>}
                                {b.phone && <span className="text-[11px] text-[#5F7894]">{LANG_LABEL[langOf(b.phone)]}</span>}
                              </div>
                              {b.notes && <p className="mt-0.5 line-clamp-2 text-[12px] italic text-[#8098B3]">“{b.notes}”</p>}
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {s === 'pending' && <button disabled={isBusy} onClick={() => setStatus(b, 'confirmed')} className={`${btn} bg-[#2DD4BF] text-[#0B1A2C] hover:bg-[#5EEAD4]`}>{isBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}Onayla</button>}
                            {s === 'confirmed' && day <= p.today && <button disabled={isBusy} onClick={() => setStatus(b, 'completed')} className={`${btn} border border-[#7DD3FC]/40 text-[#7DD3FC] hover:bg-[#7DD3FC]/10`}><CheckCircle2 className="h-3.5 w-3.5" />Uçtu</button>}
                            <WaMenu b={b} ops={o} />
                            {b.phone && <a href={`tel:${b.phone.replace(/[^\d+]/g, '')}`} className={ghost} aria-label={`${fullName(b)} ara`}><Phone className="h-3.5 w-3.5" /></a>}
                            <button onClick={() => setTicketFor(b)} className={ghost} aria-label="Bilet"><Ticket className="h-3.5 w-3.5" /></button>
                          </div>
                        </div>
                        <div className="mt-2.5 grid grid-cols-2 gap-2 pl-[18px] sm:grid-cols-[96px_1fr_150px_auto]">
                          <label className="flex items-center gap-1.5 rounded-lg border border-[#1E3654] bg-[#0B1A2C]/60 px-2 py-1.5 focus-within:border-[#2DD4BF]">
                            <Clock3 className="h-3.5 w-3.5 shrink-0 text-[#5F7894]" aria-hidden />
                            <Time24Select ariaLabel="Alış saati" allowEmpty value={o.pickup || ''}
                              onChange={v => { if (v !== (o.pickup || '')) saveOps(b.id, { pickup: v }) }}
                              selectClassName="min-w-0 flex-1 appearance-none bg-transparent text-[13px] tabular-nums text-white outline-none [color-scheme:dark] [&>option]:bg-[#0B1A2C]" />
                          </label>
                          <label className="flex items-center gap-1.5 rounded-lg border border-[#1E3654] bg-[#0B1A2C]/60 px-2 py-1.5 focus-within:border-[#2DD4BF]">
                            <Hotel className="h-3.5 w-3.5 shrink-0 text-[#5F7894]" aria-hidden />
                            <input type="text" placeholder="Otel" aria-label="Otel" defaultValue={o.hotel || ''} key={'h' + b.id + (o.hotel || '')}
                              onBlur={e => { if (e.target.value.trim() !== (o.hotel || '')) saveOps(b.id, { hotel: e.target.value.trim() }) }}
                              className="w-full min-w-0 bg-transparent text-[13px] text-white placeholder:text-[#35506F] outline-none" />
                          </label>
                          <label className="flex items-center gap-1.5 rounded-lg border border-[#1E3654] bg-[#0B1A2C]/60 px-2 py-1.5 focus-within:border-[#2DD4BF]">
                            <UserRound className="h-3.5 w-3.5 shrink-0 text-[#5F7894]" aria-hidden />
                            <input type="text" placeholder="Pilot" aria-label="Pilot" list="desk-pilots" defaultValue={o.pilot || ''} key={'pl' + b.id + (o.pilot || '')}
                              onBlur={e => { if (e.target.value.trim() !== (o.pilot || '')) saveOps(b.id, { pilot: e.target.value.trim() }) }}
                              className="w-full min-w-0 bg-transparent text-[13px] text-white placeholder:text-[#35506F] outline-none" />
                          </label>
                          <button onClick={() => saveOps(b.id, { paid: !o.paid })} aria-pressed={!!o.paid}
                            className={`${btn} ${o.paid ? 'bg-[#2DD4BF]/15 text-[#2DD4BF] ring-1 ring-[#2DD4BF]/40' : 'border border-[#1E3654] text-[#8098B3] hover:text-white'}`}>
                            <CircleDollarSign className="h-3.5 w-3.5" />{o.paid ? 'Ödendi' : `$${nf(valueOf(b))} al`}
                          </button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
              <datalist id="desk-pilots">{pilots.map(x => <option key={x} value={x} />)}</datalist>
            </section>

            <Card title="Son 30 gün: rezervasyon ve reklam" icon={TrendingUp} right={<Link href="/admin/google-ads" className="text-[12px] text-[#8098B3] hover:text-white">reklam raporu →</Link>}>
              <TrendChart rows={M.trend} today={p.today} />
              <div className="mt-5 grid gap-5 border-t border-[#1E3654] pt-4 sm:grid-cols-2">
                <div>
                  <div className="mb-2 text-[12px] text-[#8098B3]">Rezervasyonlar nereden geliyor (30 gün)</div>
                  {M.channels.length === 0 ? <p className="text-[13px] text-[#5F7894]">Henüz rezervasyon yok.</p> : (
                    <ul className="space-y-2">
                      {M.channels.map(c => {
                        const max = Math.max(1, ...M.channels.map(x => x.value))
                        return (
                          <li key={c.channel}>
                            <div className="mb-1 flex justify-between gap-2 text-[13px]"><span className={c.channel.startsWith('Takip yok') ? 'text-[#5F7894]' : 'text-[#E7EEF6]'}>{c.channel}</span><span className="tabular-nums text-[#8098B3]">{c.bookings} · ${nf(c.value)}</span></div>
                            <div className="h-1.5 rounded-full bg-[#1E3654]"><div className="h-1.5 rounded-full" style={{ width: `${(c.value / max) * 100}%`, background: c.channel.startsWith('Takip yok') ? '#35506F' : C_BOOK }} /></div>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
                <div>
                  <div className="mb-2 text-[12px] text-[#8098B3]">Reklamlar</div>
                  <ul className="space-y-2 text-[13px]">
                    <li className="flex justify-between gap-2"><span className="text-[#C9D6E4]">Google Ads, 7 gün</span><span className="tabular-nums">{ads?.spend7 != null ? `₺${nf(ads.spend7)}` : '—'}{ads?.spendPrev7 != null && ads.spend7 != null ? <span className="text-[#5F7894]"> (önceki ₺{nf(ads.spendPrev7)})</span> : null}</span></li>
                    <li className="flex justify-between gap-2"><span className="text-[#C9D6E4]">Tıklama / dönüşüm, 7 gün</span><span className="tabular-nums">{ads?.clicks7 ?? '—'} / <span className={ads?.conv7 ? 'text-[#2DD4BF]' : 'text-[#F87171]'}>{ads?.conv7 ?? '—'}</span></span></li>
                    <li className="flex justify-between gap-2"><span className="text-[#C9D6E4]">Günlük bütçe</span><span className="tabular-nums">{ads?.budgetDaily != null ? `₺${nf(ads.budgetDaily)}` : '—'}</span></li>
                    <li className="flex justify-between gap-2"><span className="text-[#C9D6E4]">Meta</span><span className={metaStatus === 1 ? 'text-[#2DD4BF]' : metaStatus != null ? 'text-[#F87171]' : 'text-[#5F7894]'}>{metaStatus === 1 ? `yayında · ₺${nf(metaSpend30)} / 30g` : metaStatus === 3 ? 'durdu, bakiye ödenmemiş' : metaStatus != null ? 'durdu' : '…'}</span></li>
                    <li className="flex justify-between gap-2"><span className="text-[#C9D6E4]">Site ziyaretçisi, 7 gün</span><span className="tabular-nums">{visitors != null ? nf(visitors) : '…'}</span></li>
                  </ul>
                  {ads?.actions?.length ? <p className="mt-3 text-[11px] leading-snug text-[#5F7894]">Reklam ajanı bugün: {ads.actions.join(' · ').slice(0, 220)}</p> : null}
                </div>
              </div>
            </Card>

          </div>

          {/* RIGHT */}
          <div className="order-1 space-y-4 lg:order-2 lg:col-span-4">
            <Card title="Yapılacaklar" icon={ListChecks} right={items.length ? <span className="rounded-full bg-[#FBBF24]/15 px-2 text-[12px] tabular-nums text-[#FBBF24]">{items.length}</span> : null}>
              {items.length === 0 ? (
                <p className="flex items-center gap-2 py-2 text-[14px] text-[#2DD4BF]"><CheckCircle2 className="h-5 w-5" />Her şey yolunda, bekleyen iş yok.</p>
              ) : (
                <ul className="divide-y divide-[#1E3654]">
                  {items.map(it => (
                    <li key={it.key} className="flex gap-2.5 py-3 first:pt-0 last:pb-0">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: TONE_COLOR[it.tone] }} aria-hidden />
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] leading-snug text-white">{it.title}</p>
                        {it.sub && <p className="mt-0.5 text-[12px] leading-snug text-[#8098B3]">{it.sub}</p>}
                        {it.body}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            <nav aria-label="Kısayollar" className="grid grid-cols-2 gap-2">
              {shortcuts.map(s => (
                <Link key={s.href} href={s.href} className="flex items-center gap-2 rounded-xl border border-[#1E3654] px-3 py-2 text-[13px] text-[#C9D6E4] hover:border-[#F97316] hover:text-white">
                  <s.icon className="h-4 w-4 text-[#8098B3]" aria-hidden />{s.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {adding && <QuickAdd today={day} onClose={() => setAdding(false)} onSaved={() => { setAdding(false); router.refresh() }} />}
      {ticketFor && (
        <TicketModal
          booking={{
            id: ticketFor.id, created_at: ticketFor.created_at || '', first_name: ticketFor.first_name || '', last_name: ticketFor.last_name || '',
            email: ticketFor.email || '', phone: ticketFor.phone || '', flight_type: ticketFor.flight_type || 'standard',
            flight_date: ticketFor.flight_date, guests: ticketFor.guests || 1, addon_photo: !!ticketFor.addon_photo,
            addon_video: !!ticketFor.addon_video, addon_bundle: !!ticketFor.addon_bundle, base_price: Number(ticketFor.base_price) || 0,
            addon_price: Number(ticketFor.addon_price) || 0, total_price: Number(ticketFor.total_price) || 0, notes: ticketFor.notes || '',
            status: ticketFor.status, flight_time: ticketFor.flight_time ?? null,
          } satisfies TicketBooking}
          onClose={() => setTicketFor(null)}
        />
      )}
    </div>
  )
}
