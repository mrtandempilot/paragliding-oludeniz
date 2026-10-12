'use client'

// Uçuş Masası — admin ana sayfası.
// 1) Uçulur mu?  2) Kimi nereden kaçta alıyoruz?  3) Şimdi ne yapmam lazım?
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sora } from 'next/font/google'
import {
  ArrowUp, RefreshCw, Loader2, AlertTriangle, Phone, CalendarDays, MessageCircle, Ticket, Check, X,
  Users, Wind, Sunrise, Sunset, ListChecks, Radar, Search, Megaphone, Instagram, FileText, BarChart3,
  CircleDollarSign, Clock3, CheckCircle2, ChevronDown, CloudRain, Hotel, UserRound, Banknote,
} from 'lucide-react'
import TicketModal, { type Booking as TicketBooking } from './bookings/TicketModal'
import { langOf, waMessage, waUrl, LANG_LABEL, TEMPLATE_LABEL, type Template } from './flightDeskText'

const sora = Sora({ subsets: ['latin', 'latin-ext'], weight: ['300', '400', '600', '700'], display: 'swap' })

/* palette: night #0B1A2C · panel #10233A · line #1E3654 · ink #E7EEF6 · mute #8098B3
   brand #F97316 · ok #2DD4BF · warn #FBBF24 · bad #F87171 */
type Tone = 'ok' | 'warn' | 'bad'
const TONE_COLOR: Record<Tone, string> = { ok: '#2DD4BF', warn: '#FBBF24', bad: '#F87171' }
const VERDICT: Record<Tone, string> = { ok: 'Uçulur', warn: 'Dikkatli', bad: 'Zor görünüyor' }

type Booking = {
  id: string; first_name?: string; last_name?: string; email?: string; phone?: string; flight_date: string; flight_type?: string
  guests?: number; total_price?: number; base_price?: number; addon_price?: number; status: string; notes?: string
  addon_photo?: boolean; addon_video?: boolean; addon_bundle?: boolean; created_at?: string
}
type Ops = { pickup?: string; hotel?: string; pilot?: string; paid?: boolean; note?: string }
type Hour = { hour: number; tone: Tone; why: string[]; t1200: number; d1200: number; t1900: number; head: number; beach: number | null; gust: number | null; rain: number | null }
type Day = { date: string; verdict: Tone; okHours: number; warnHours: number; window: { from: number; to: number } | null; sunrise: string | null; sunset: string | null; maxGust: number | null; maxRain: number | null; hours: Hour[] }
type Station = { label: string; elevation: string; temperatureC: number | null; windSpeedKmh: number | null; windGustKmh: number | null; windDirectionDeg: number | null }

type Props = {
  today: string
  upcoming: Booking[]; laterPending: Booking[]; unclosed: Booking[]
  ops: Record<string, Ops>
  outlook: { days: Day[]; model: string; fetchedAt: string; error: string | null }
  live: { stations: Station[]; fetchedAt: string } | null
  waInbox: { id: string; from: string; summary: string; at: string }[]
  agents: { total: number; errors: { agent: string; action: string; error?: string; at: string }[] }
  pulse: {
    week: { bookings: number; guests: number }; prevWeek: { bookings: number; guests: number }
    flown30: { guests: number; revenue: number }
    ads: { spend7: number | null; clicks7: number | null; conv7: number | null; generatedAt: string | null; issues: string[] } | null
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
  const [ext, setExt] = useState<{ ga4?: any; meta?: any; ig?: any }>({})
  const [showAllUnclosed, setShowAllUnclosed] = useState(false)

  useEffect(() => { setOps(p.ops) }, [p.ops])
  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 30000)
    ;(async () => {
      const [ga4, meta, ig] = await Promise.all([
        getJson('/api/admin/seo-data?type=ga4-overview'),
        getJson('/api/admin/meta-ads?type=account'),
        getJson('/api/admin/instagram/token-status'),
      ])
      setExt({ ga4, meta, ig })
    })()
    return () => clearInterval(t)
  }, [])

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
    const [ga4, meta, ig] = await Promise.all([getJson('/api/admin/seo-data?type=ga4-overview'), getJson('/api/admin/meta-ads?type=account'), getJson('/api/admin/instagram/token-status')])
    setExt({ ga4, meta, ig }); setRefreshing(false)
  }

  /* selected day */
  const sel = outlookBy[day]
  const dayList = live(day).slice().sort((a, b) => (ops[a.id]?.pickup || '99').localeCompare(ops[b.id]?.pickup || '99') || fullName(a).localeCompare(fullName(b)))
  const dayGuests = dayList.reduce((s, b) => s + guestsOf(b), 0)
  const dayExpected = dayList.reduce((s, b) => s + (Number(b.total_price) || PRICE * guestsOf(b)), 0)
  const dayPaid = dayList.filter(b => ops[b.id]?.paid).reduce((s, b) => s + (Number(b.total_price) || PRICE * guestsOf(b)), 0)
  const noPickup = dayList.filter(b => !ops[b.id]?.pickup).length
  const noPilot = dayList.filter(b => !ops[b.id]?.pilot).length
  const pilots = useMemo(() => Array.from(new Set(Object.values(ops).map(o => o.pilot).filter(Boolean) as string[])).sort(), [ops])
  const stations = p.live ? [...p.live.stations].sort((a, b) => STATION_ORDER.indexOf(a.label) - STATION_ORDER.indexOf(b.label)) : []

  /* to-do inbox */
  type Item = { key: string; tone: Tone; title: string; sub?: string; body?: React.ReactNode }
  const items: Item[] = []
  const unclosed = p.unclosed.filter(b => !['completed', 'cancelled'].includes(st(b)))
  if (unclosed.length) {
    const shown = showAllUnclosed ? unclosed : unclosed.slice(0, 3)
    items.push({
      key: 'unclosed', tone: 'warn', title: `${unclosed.length} geçmiş uçuş kapatılmadı`, sub: 'Uçtu mu, iptal mi? İşaretle ki ciro ve istatistik doğru olsun.',
      body: (
        <ul className="mt-2 space-y-1.5">
          {shown.map(b => (
            <li key={b.id} className="flex items-center justify-between gap-2 text-[13px]">
              <span className="min-w-0 truncate">{fullName(b)} <span className="text-[#5F7894]">· {b.flight_date.slice(5)} · {guestsOf(b)} kişi</span></span>
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
  const pendings = [...p.upcoming, ...p.laterPending].filter(b => st(b) === 'pending')
  for (const b of pendings.slice(0, 6)) {
    const hrs = b.created_at ? (Date.now() - new Date(b.created_at).getTime()) / 3600000 : 0
    items.push({
      key: 'p' + b.id, tone: hrs > 2 ? 'bad' : 'warn',
      title: `Onay bekliyor: ${fullName(b)}`, sub: `${dayFull(b.flight_date.slice(0, 10), p.today)} · ${guestsOf(b)} kişi · geldi ${ago(b.created_at)}${hrs > 2 ? ' (2 saat sözü geçti)' : ''}`,
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
      key: 'wa' + w.id, tone: 'warn', title: `WhatsApp: +${w.from} cevap bekliyor`, sub: `${w.summary} · ${ago(w.at)}`,
      body: (
        <div className="mt-2 flex gap-1.5">
          <a href={waUrl(w.from)} target="_blank" rel="noopener noreferrer" className={`${btn} bg-[#25D366] text-[#0B1A2C]`}><MessageCircle className="h-3.5 w-3.5" />Konuşmayı aç</a>
          <button onClick={() => markHandled(w.id)} className={ghost}><Check className="h-3.5 w-3.5" />İlgilendim</button>
        </div>
      ),
    })
  }
  for (const d of week.slice(0, 3)) {
    const o = outlookBy[d], g = guestsOn(d)
    if (o && o.verdict !== 'ok' && g > 0) {
      const reason = o.hours.flatMap(h => h.why)[0]
      items.push({
        key: 'wx' + d, tone: o.verdict === 'bad' ? 'bad' : 'warn',
        title: `${dayName(d, p.today)} hava ${o.verdict === 'bad' ? 'uçuşa uygun görünmüyor' : 'riskli'}, ${g} yolcu var`,
        sub: `${reason ? reason + ' · ' : ''}${o.window ? `en iyi aralık ${hh(o.window.from)}–${hh(o.window.to + 1)}` : 'uygun saat yok'}. Gerekirse müşterilere haber ver.`,
        body: <button onClick={() => setDay(d)} className={`${ghost} mt-2`}>Listeyi aç</button>,
      })
    }
  }
  for (const d of week.slice(0, 2)) {
    const miss = live(d).filter(b => st(b) === 'confirmed' && !ops[b.id]?.pickup)
    if (miss.length) items.push({
      key: 'pk' + d, tone: d === p.today ? 'bad' : 'warn',
      title: `${dayName(d, p.today)} ${miss.length} rezervasyonun alış saati yok`, sub: 'Saati ve oteli yaz, müşteriye tek tuşla gönder.',
      body: <button onClick={() => setDay(d)} className={`${ghost} mt-2`}>Listeyi aç</button>,
    })
  }
  for (const a of p.agents.errors) items.push({ key: 'ag' + a.agent, tone: 'warn', title: `${a.agent} ajanı hata verdi`, sub: `${(a.error || a.action || '').slice(0, 110)} · ${ago(a.at)}`, body: <Link href="/admin/mission-control" className="mt-1 inline-block text-[12px] text-[#8098B3] underline">Mission Control</Link> })
  const metaBad = ext.meta && !ext.meta.error && Number(ext.meta.account_status) !== 1
  if (metaBad) items.push({ key: 'meta', tone: 'warn', title: 'Meta reklam hesabı yayında değil', sub: Number(ext.meta.account_status) === 3 ? `Ödenmemiş bakiye${ext.meta.balance ? ` ₺${nf(Number(ext.meta.balance))}` : ''}` : `Durum kodu ${ext.meta.account_status}`, body: <Link href="/admin/meta-ads" className="mt-1 inline-block text-[12px] text-[#8098B3] underline">Meta reklamları</Link> })
  for (const t of p.pulse.ads?.issues || []) items.push({ key: 'ads' + t, tone: 'warn', title: `Google Ads: ${t}`, body: <Link href="/admin/google-ads" className="mt-1 inline-block text-[12px] text-[#8098B3] underline">Günlük rapor</Link> })
  if (ext.ig?.valid === false) items.push({ key: 'ig', tone: 'bad', title: 'Instagram bağlantısı kopmuş', sub: 'Otomatik paylaşım ve DM çalışmaz.', body: <Link href="/admin/instagram" className="mt-1 inline-block text-[12px] text-[#8098B3] underline">Instagram</Link> })
  else if (ext.ig?.daysLeft != null && ext.ig.daysLeft < 10) items.push({ key: 'ig2', tone: 'warn', title: `Instagram bağlantısı ${ext.ig.daysLeft} gün sonra bitiyor`, body: <Link href="/admin/instagram" className="mt-1 inline-block text-[12px] text-[#8098B3] underline">Yenile</Link> })
  const order: Record<Tone, number> = { bad: 0, warn: 1, ok: 2 }
  items.sort((a, b) => order[a.tone] - order[b.tone])

  /* pulse */
  const pw = p.pulse
  const delta = pw.week.bookings - pw.prevWeek.bookings
  const cpb = pw.ads?.spend7 != null && pw.week.bookings > 0 ? pw.ads.spend7 / pw.week.bookings : null
  const visitors = ext.ga4?.overview?.activeUsers
  const healthy = p.agents.total - p.agents.errors.length

  const dateTitle = now ? new Intl.DateTimeFormat('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Istanbul' }).format(now) : ''
  const clock = now ? new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' }).format(now) : ''

  const shortcuts = [
    { href: '/admin/ticket', label: 'Bilet bas', icon: Ticket },
    { href: '/admin/bookings', label: 'Rezervasyonlar', icon: ListChecks },
    { href: '/admin/calendar', label: 'Takvim', icon: CalendarDays },
    { href: '/live-weather', label: 'Canlı hava', icon: Wind },
    { href: '/admin/google-ads', label: 'Google Ads', icon: Search },
    { href: '/admin/meta-ads', label: 'Meta', icon: Megaphone },
    { href: '/admin/instagram', label: 'Instagram', icon: Instagram },
    { href: '/admin/blog', label: 'Blog', icon: FileText },
    { href: '/admin/analyze', label: 'Analiz', icon: BarChart3 },
    { href: '/admin/mission-control', label: 'Ajanlar', icon: Radar },
  ]

  return (
    <div className="-m-4 min-h-screen bg-[#0B1A2C] px-3 py-5 text-[#E7EEF6] sm:px-6 md:-m-8 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1400px] space-y-4">

        {/* header */}
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[13px] capitalize text-[#8098B3]">{dateTitle}</p>
            <h1 className={`${sora.className} mt-1 text-[24px] font-semibold tracking-tight sm:text-[28px]`}>Uçuş Masası</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className={`${sora.className} text-[24px] font-light tabular-nums text-[#8098B3]`} aria-label="Saat (İstanbul)">{clock}</span>
            <button onClick={refreshAll} className="flex items-center gap-2 rounded-lg border border-[#1E3654] px-3 py-2 text-[13px] text-[#8098B3] hover:border-[#2DD4BF] hover:text-[#E7EEF6]">
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} aria-hidden /><span className="hidden sm:inline">Yenile</span>
            </button>
          </div>
        </header>

        {/* 7-day strip: demand × weather — drives everything below */}
        <nav className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-7 sm:px-0" aria-label="Gün seç">
          {week.map(d => {
            const o = outlookBy[d], g = guestsOn(d), active = d === day
            const pend = live(d).some(b => st(b) === 'pending')
            return (
              <button
                key={d} onClick={() => setDay(d)} aria-pressed={active}
                className={`relative flex min-w-[88px] shrink-0 flex-col rounded-2xl border px-3 py-2.5 text-left transition-colors ${active ? 'border-[#F97316] bg-[#F97316]/10' : 'border-[#1E3654] bg-[#10233A]/70 hover:border-[#35506F]'}`}
              >
                <span className="flex items-center justify-between gap-2 text-[12px] capitalize text-[#C9D6E4]">
                  {dayName(d, p.today, 'short')}<span className="tabular-nums text-[#5F7894]">{Number(d.slice(8))}</span>
                </span>
                <span className="mt-1.5 flex items-end gap-1.5">
                  <span className={`${sora.className} text-[22px] leading-none tabular-nums ${g ? 'text-white' : 'text-[#35506F]'}`}>{g || '0'}</span>
                  <span className="pb-0.5 text-[11px] text-[#5F7894]">yolcu</span>
                </span>
                <span className="mt-2 flex items-center gap-1.5 text-[11px]" style={{ color: o ? TONE_COLOR[o.verdict] : '#5F7894' }}>
                  <span className="h-2 w-2 rounded-full" style={{ background: o ? TONE_COLOR[o.verdict] : '#35506F' }} aria-hidden />
                  {o ? VERDICT[o.verdict] : 'tahmin yok'}
                </span>
                {pend && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#FBBF24]" aria-label="onay bekleyen var" />}
              </button>
            )
          })}
        </nav>

        <div className="grid gap-4 lg:grid-cols-12">
          {/* LEFT: weather + manifest */}
          <div className="order-2 space-y-4 lg:order-1 lg:col-span-8">

            {/* flyability */}
            <section className="rounded-2xl border border-[#1E3654] bg-gradient-to-br from-[#10233A] to-[#0F2136] p-4 sm:p-5" aria-label="Uçulur mu">
              {!sel ? (
                <p className="flex items-center gap-2 text-[13px] text-[#FBBF24]"><AlertTriangle className="h-4 w-4" />{p.outlook.error || 'Bu gün için tahmin yok.'}</p>
              ) : (
                <>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-[13px] text-[#8098B3]">{(n => n.charAt(0).toLocaleUpperCase('tr-TR') + n.slice(1))(dayName(day, p.today))} uçulur mu?</p>
                      <p className={`${sora.className} mt-1 text-[30px] font-semibold leading-none sm:text-[36px]`} style={{ color: TONE_COLOR[sel.verdict] }}>{VERDICT[sel.verdict]}</p>
                      <p className="mt-2 text-[13px] text-[#C9D6E4]">
                        {sel.window ? <>En iyi aralık <b className="tabular-nums">{hh(sel.window.from)}–{hh(sel.window.to + 1)}</b></> : 'Uygun saat görünmüyor'}
                        <span className="text-[#5F7894]"> · {sel.okHours} saat uygun, {sel.warnHours} saat dikkat</span>
                      </p>
                    </div>
                    <div className="flex gap-4 text-[13px] text-[#C9D6E4]">
                      {sel.sunrise && <span className="flex items-center gap-1.5"><Sunrise className="h-4 w-4 text-[#FBBF24]" aria-hidden /><span className="tabular-nums">{sel.sunrise}</span></span>}
                      {sel.sunset && <span className="flex items-center gap-1.5" title="Gün batımı uçuşu için"><Sunset className="h-4 w-4 text-[#F97316]" aria-hidden /><span className="tabular-nums">{sel.sunset}</span></span>}
                      {sel.maxRain != null && sel.maxRain >= 30 && <span className="flex items-center gap-1.5 text-[#7DD3FC]"><CloudRain className="h-4 w-4" aria-hidden />%{Math.round(sel.maxRain)}</span>}
                    </div>
                  </div>
                  <div className="mt-4"><HourStrip day={sel} isToday={day === p.today} /></div>
                  {day === p.today && stations.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#1E3654] pt-3">
                      {stations.map(s => (
                        <div key={s.label} className="min-w-0">
                          <div className="text-[11px] text-[#5F7894]">{STATION_TR[s.label] || s.label}, şu an</div>
                          <div className="mt-0.5 flex items-center gap-1.5">
                            <span className={`${sora.className} text-[18px] tabular-nums`}>{s.windSpeedKmh != null ? Math.round(s.windSpeedKmh) : '—'}</span>
                            <span className="text-[11px] text-[#5F7894]">km/s</span>
                            {s.windDirectionDeg != null && <ArrowUp className="h-3.5 w-3.5 text-[#C9D6E4]" style={{ transform: `rotate(${(s.windDirectionDeg + 180) % 360}deg)` }} aria-hidden />}
                            {s.windGustKmh != null && <span className="text-[11px] text-[#8098B3]">hamle {Math.round(s.windGustKmh)}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="mt-3 text-[11px] text-[#5F7894]">{p.outlook.model} modeli tahmini, {ago(p.outlook.fetchedAt)} güncellendi. Son karar her zaman pilotun.</p>
                </>
              )}
            </section>

            {/* manifest */}
            <section className="rounded-2xl border border-[#1E3654] bg-[#10233A]/70" aria-label="Uçuş listesi">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#1E3654] px-4 py-3 sm:px-5">
                <h2 className={`${sora.className} text-[18px] font-semibold capitalize`}>{dayFull(day, p.today)}</h2>
                <span className="flex flex-wrap gap-x-3 text-[12px] tabular-nums text-[#8098B3]">
                  <span>{dayList.length} rezervasyon · {dayGuests} yolcu</span>
                  {dayList.length > 0 && <span className={dayPaid >= dayExpected ? 'text-[#2DD4BF]' : ''}><Banknote className="mr-1 inline h-3.5 w-3.5" aria-hidden />${nf(dayPaid)} / ${nf(dayExpected)} tahsil</span>}
                  {noPickup > 0 && <span className="text-[#FBBF24]">{noPickup} alış saati yok</span>}
                  {noPilot > 0 && <span className="text-[#FBBF24]">{noPilot} pilot atanmadı</span>}
                </span>
              </div>
              {err && <p className="flex items-center gap-2 px-4 pt-3 text-[13px] text-[#FBBF24] sm:px-5"><AlertTriangle className="h-4 w-4" />{err}</p>}
              {dayList.length === 0 ? (
                <p className="px-4 py-8 text-center text-[13px] text-[#5F7894] sm:px-5">Bu gün için kayıtlı uçuş yok.</p>
              ) : (
                <ul className="divide-y divide-[#1E3654]">
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
                                <span className="text-[12px] text-[#5F7894]">{TYPE_TR[b.flight_type || 'standard'] || b.flight_type}</span>
                                <span className="text-[12px]" style={{ color: STATUS_COLOR[s] || '#8098B3' }}>{STATUS_TR[s] || s}</span>
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
                        {/* ops fields */}
                        <div className="mt-2.5 grid grid-cols-2 gap-2 pl-[18px] sm:grid-cols-[96px_1fr_150px_auto]">
                          <label className="flex items-center gap-1.5 rounded-lg border border-[#1E3654] bg-[#0B1A2C]/60 px-2 py-1.5 focus-within:border-[#2DD4BF]">
                            <Clock3 className="h-3.5 w-3.5 shrink-0 text-[#5F7894]" aria-hidden />
                            <input type="time" aria-label="Alış saati" defaultValue={o.pickup || ''} key={'t' + b.id + (o.pickup || '')}
                              onBlur={e => { if (e.target.value !== (o.pickup || '')) saveOps(b.id, { pickup: e.target.value }) }}
                              className="w-full min-w-0 bg-transparent text-[13px] tabular-nums text-white outline-none [color-scheme:dark]" />
                          </label>
                          <label className="col-span-1 flex items-center gap-1.5 rounded-lg border border-[#1E3654] bg-[#0B1A2C]/60 px-2 py-1.5 focus-within:border-[#2DD4BF]">
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
                          <button
                            onClick={() => saveOps(b.id, { paid: !o.paid })} aria-pressed={!!o.paid}
                            className={`${btn} ${o.paid ? 'bg-[#2DD4BF]/15 text-[#2DD4BF] ring-1 ring-[#2DD4BF]/40' : 'border border-[#1E3654] text-[#8098B3] hover:text-white'}`}
                          >
                            <CircleDollarSign className="h-3.5 w-3.5" />{o.paid ? 'Ödendi' : `$${nf(Number(b.total_price) || PRICE * guestsOf(b))} al`}
                          </button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
              <datalist id="desk-pilots">{pilots.map(x => <option key={x} value={x} />)}</datalist>
            </section>
          </div>

          {/* RIGHT: to-do + pulse */}
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

            <Card title="Nabız" icon={CircleDollarSign}>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
                <div>
                  <dt className="text-[12px] text-[#8098B3]">Yeni rezervasyon, 7 gün</dt>
                  <dd className={`${sora.className} mt-1 text-[24px] font-light tabular-nums`}>{pw.week.bookings}</dd>
                  <dd className="text-[11px] text-[#5F7894]">{pw.week.guests} yolcu · geçen hafta {pw.prevWeek.bookings}{delta !== 0 && <span className={delta > 0 ? 'text-[#2DD4BF]' : 'text-[#F87171]'}> ({delta > 0 ? '+' : ''}{delta})</span>}</dd>
                </div>
                <div>
                  <dt className="text-[12px] text-[#8098B3]">Uçan yolcu, 30 gün</dt>
                  <dd className={`${sora.className} mt-1 text-[24px] font-light tabular-nums`}>{pw.flown30.guests}</dd>
                  <dd className="text-[11px] text-[#5F7894]">${nf(pw.flown30.revenue)} ciro</dd>
                </div>
                <div>
                  <dt className="text-[12px] text-[#8098B3]">Google Ads, 7 gün</dt>
                  <dd className={`${sora.className} mt-1 text-[24px] font-light tabular-nums`}>{pw.ads?.spend7 != null ? `₺${nf(pw.ads.spend7)}` : '—'}</dd>
                  <dd className="text-[11px] text-[#5F7894]">{cpb != null ? `rezervasyon başı ₺${nf(cpb)}` : pw.ads?.spend7 ? 'bu hafta rezervasyon yok' : ''}{pw.ads?.conv7 != null ? ` · ${nf(pw.ads.conv7)} dönüşüm` : ''}</dd>
                </div>
                <div>
                  <dt className="text-[12px] text-[#8098B3]">Site ziyaretçisi, 7 gün</dt>
                  <dd className={`${sora.className} mt-1 text-[24px] font-light tabular-nums`}>{visitors != null ? nf(visitors) : ext.ga4 ? '—' : '…'}</dd>
                  <dd className="text-[11px] text-[#5F7894]">{ext.ga4?.overview?.sessions != null ? `${nf(ext.ga4.overview.sessions)} oturum` : ext.ga4?.error ? 'alınamadı' : ''}</dd>
                </div>
              </dl>
              <Link href="/admin/mission-control" className="mt-4 flex items-center justify-between rounded-xl border border-[#1E3654] px-3 py-2 text-[13px] hover:border-[#2DD4BF]">
                <span className="flex items-center gap-2 text-[#C9D6E4]"><Radar className="h-4 w-4 text-[#8098B3]" />Ajanlar</span>
                <span className={healthy === p.agents.total ? 'text-[#2DD4BF]' : 'text-[#FBBF24]'}>{healthy}/{p.agents.total} sağlıklı</span>
              </Link>
            </Card>

            <nav aria-label="Kısayollar" className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-2">
              {shortcuts.map(s => (
                <Link key={s.href} href={s.href} className="flex items-center gap-2 rounded-xl border border-[#1E3654] px-3 py-2 text-[13px] text-[#C9D6E4] hover:border-[#F97316] hover:text-white">
                  <s.icon className="h-4 w-4 text-[#8098B3]" aria-hidden />{s.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
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
