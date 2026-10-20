import { getSupabase, istanbulDate, getBabadagWindLadder } from '@/lib/admin/dashboard-data'
import { getFlightOutlook } from '@/lib/admin/flight-outlook'
import { OPS_KEY, WA_HANDLED_KEY, BOOKING_SEEN_KEY } from '@/lib/admin/flight-ops'
import { SOURCES_KEY } from '@/lib/admin/booking-source'
import { loadAdsReport } from '@/lib/ads-report/build'
import { AGENTS } from '@/lib/agents/registry'
import FlightDesk from './FlightDesk'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const EARNED = ['completed', 'confirmed']

async function usdTry(): Promise<number | null> {
  try {
    const j = await fetch('https://open.er-api.com/v6/latest/USD', { next: { revalidate: 43200 } }).then(r => r.json())
    return typeof j?.rates?.TRY === 'number' ? j.rates.TRY : null
  } catch { return null }
}

// Dış servisler (hava durumu, kur, reklam raporu) yavaşlarsa paneli bekletmesin:
// 3 sn içinde gelmezse o kart boş kalır, sayfa yine hemen açılır.
function within<T>(p: Promise<T>, ms = 3000): Promise<T | null> {
  return Promise.race([p, new Promise<null>(r => setTimeout(() => r(null), ms))])
}

// Admin ana sayfası. Önce para (ciro, rezervasyon, reklam), sonra operasyon.
export default async function AdminDashboardPage() {
  const supabase = getSupabase()
  const today = istanbulDate(0)
  const in6 = istanbulDate(6)
  const in30 = istanbulDate(30)
  const now = Date.now()
  const [y, m, d] = today.split('-').map(Number)
  const monthStart = `${y}-${String(m).padStart(2, '0')}-01`
  const lm = m === 1 ? { y: y - 1, m: 12 } : { y, m: m - 1 }
  const lastMonthStart = `${lm.y}-${String(lm.m).padStart(2, '0')}-01`
  const lastMonthDays = new Date(Date.UTC(lm.y, lm.m, 0)).getUTCDate()
  const lastMonthSameDay = `${lm.y}-${String(lm.m).padStart(2, '0')}-${String(Math.min(d, lastMonthDays)).padStart(2, '0')}`
  const d60 = new Date(now - 60 * 86400000).toISOString()
  const h72 = new Date(now - 72 * 3600000).toISOString()

  const q = await Promise.allSettled([
    /* 0 */ supabase.from('bookings').select('*').gte('flight_date', today).lte('flight_date', in6).neq('status', 'cancelled').order('flight_date').limit(200),
    /* 1 */ supabase.from('bookings').select('*').eq('status', 'pending').gt('flight_date', in6).order('flight_date').limit(20),
    /* 2 */ supabase.from('bookings').select('*').lt('flight_date', today).in('status', ['pending', 'confirmed']).order('flight_date', { ascending: false }).limit(60),
    /* 3 */ supabase.from('bookings').select('id,created_at,flight_date,guests,total_price,status').gte('created_at', d60).limit(2000),
    /* 4 */ supabase.from('bookings').select('id,flight_date,guests,total_price,status').gte('flight_date', lastMonthStart).lte('flight_date', in30).neq('status', 'cancelled').limit(2000),
    /* 5 */ supabase.from('settings').select('key,value').in('key', [OPS_KEY, WA_HANDLED_KEY, SOURCES_KEY, BOOKING_SEEN_KEY]),
    /* 6 */ supabase.from('agent_logs').select('id,agent,action,status,error,created_at').neq('status', 'running').order('created_at', { ascending: false }).limit(150),
    /* 7 */ supabase.from('agent_logs').select('id,output,created_at').eq('agent', 'whatsapp').gte('created_at', h72).order('created_at', { ascending: false }).limit(50),
    /* 8 */ within(getFlightOutlook(7)),
    /* 9 */ within(getBabadagWindLadder()),
    /* 10 */ within(loadAdsReport()),
    /* 11 */ within(usdTry()),
    /* 12 */ supabase.from('bookings').select('*').gte('created_at', h72).neq('status', 'cancelled').order('created_at', { ascending: false }).limit(30),
  ])
  const val = (i: number): any => (q[i].status === 'fulfilled' ? (q[i] as PromiseFulfilledResult<any>).value : null)
  const rows = (i: number): any[] => val(i)?.data || []

  const settings: Record<string, any> = {}
  for (const r of rows(5)) { try { settings[r.key] = JSON.parse(r.value) } catch { settings[r.key] = r.value } }
  const handled: string[] = Array.isArray(settings[WA_HANDLED_KEY]) ? settings[WA_HANDLED_KEY] : []
  const sources: Record<string, { channel: string }> = settings[SOURCES_KEY] && typeof settings[SOURCES_KEY] === 'object' ? settings[SOURCES_KEY] : {}

  const latest: Record<string, any> = {}
  for (const l of rows(6)) if (!latest[l.agent]) latest[l.agent] = l
  const agentErrors = Object.values(latest).filter((l: any) => l.status === 'error')

  const seen = new Set<string>()
  const waInbox = rows(7)
    .filter(l => l.output?.needsHuman && !handled.includes(String(l.id)))
    .filter(l => { const f = String(l.output?.from || ''); if (!f || seen.has(f)) return false; seen.add(f); return true })
    .map(l => ({ id: String(l.id), from: String(l.output.from), summary: String(l.output.summary || ''), at: l.created_at }))

  /* ── money ── */
  const price = (b: any) => Number(b.total_price) || 150 * (b.guests || 1)
  const byFlight = rows(4)
  const sumOf = (list: any[]) => ({ revenue: list.reduce((s, b) => s + price(b), 0), guests: list.reduce((s, b) => s + (b.guests || 1), 0), count: list.length })
  const earnedMonth = sumOf(byFlight.filter(b => b.flight_date >= monthStart && b.flight_date <= today && EARNED.includes(b.status)))
  const earnedLastSame = sumOf(byFlight.filter(b => b.flight_date >= lastMonthStart && b.flight_date <= lastMonthSameDay && EARNED.includes(b.status)))
  const earnedLastFull = sumOf(byFlight.filter(b => b.flight_date >= lastMonthStart && b.flight_date < monthStart && EARNED.includes(b.status)))
  const ahead = byFlight.filter(b => b.flight_date > today && b.flight_date <= in30)
  const aheadConfirmed = sumOf(ahead.filter(b => b.status === 'confirmed'))
  const aheadPending = sumOf(ahead.filter(b => b.status === 'pending'))

  // new bookings per day (by created date, Istanbul), last 30 days + previous 30 total
  const created = rows(3)
  const trDate = (iso: string) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul' }).format(new Date(iso))
  const days30 = Array.from({ length: 30 }, (_, i) => istanbulDate(i - 29))
  const ads = val(10)?.report
  const adsDaily: Record<string, number> = {}
  for (const x of ads?.daily || []) adsDaily[x.date] = x.cost || 0
  const trend = days30.map(date => {
    const list = created.filter(b => b.status !== 'cancelled' && trDate(b.created_at) === date)
    return { date, bookings: list.length, guests: list.reduce((s, b) => s + (b.guests || 1), 0), value: list.reduce((s, b) => s + price(b), 0), adCost: adsDaily[date] ?? null }
  })
  const cutoff = now - 30 * 86400000
  const last30 = created.filter(b => b.status !== 'cancelled' && new Date(b.created_at).getTime() >= cutoff)
  const prev30 = created.filter(b => b.status !== 'cancelled' && new Date(b.created_at).getTime() < cutoff)
  const cancelled30 = created.filter(b => b.status === 'cancelled' && new Date(b.created_at).getTime() >= cutoff)

  // channel mix of last-30-day bookings
  const channels: Record<string, { bookings: number; value: number }> = {}
  let tracked = 0
  for (const b of last30) {
    const ch = sources[b.id]?.channel
    if (ch) tracked++
    const k = ch || 'Takip yok (eski kayıt)'
    channels[k] ||= { bookings: 0, value: 0 }
    channels[k].bookings++; channels[k].value += price(b)
  }
  const thisWeek = created.filter(b => b.status !== 'cancelled' && new Date(b.created_at).getTime() >= now - 7 * 86400000)
  const prevWeek = created.filter(b => { const t = new Date(b.created_at).getTime(); return b.status !== 'cancelled' && t < now - 7 * 86400000 && t >= now - 14 * 86400000 })
  const googleAds30 = last30.filter(b => sources[b.id]?.channel === 'Google Ads')

  return (
    <FlightDesk
      today={today}
      upcoming={rows(0)}
      fresh={rows(12)}
      seen={Array.isArray(settings[BOOKING_SEEN_KEY]) ? settings[BOOKING_SEEN_KEY].map(String) : []}
      laterPending={rows(1)}
      unclosed={rows(2)}
      ops={settings[OPS_KEY] && typeof settings[OPS_KEY] === 'object' ? settings[OPS_KEY] : {}}
      sources={Object.fromEntries(Object.entries(sources).map(([k, v]) => [k, v.channel]))}
      outlook={val(8) || { days: [], model: 'ICON', fetchedAt: new Date().toISOString(), error: 'Hava tahmini alınamadı' }}
      live={val(9)}
      waInbox={waInbox}
      agents={{ total: AGENTS.length, errors: agentErrors.map((l: any) => ({ agent: l.agent, action: l.action, error: l.error, at: l.created_at })) }}
      money={{
        usdTry: val(11),
        earnedMonth, earnedLastSame, earnedLastFull,
        aheadConfirmed, aheadPending,
        week: { bookings: thisWeek.length, guests: thisWeek.reduce((s, b) => s + (b.guests || 1), 0) },
        prevWeek: { bookings: prevWeek.length },
        last30: { bookings: last30.length, value: last30.reduce((s, b) => s + price(b), 0), cancelled: cancelled30.length },
        prev30: { bookings: prev30.length },
        trend,
        channels: Object.entries(channels).map(([channel, v]) => ({ channel, ...v })).sort((a, b) => b.value - a.value),
        tracked,
        ads: ads ? {
          spend7: ads.kpis?.spend7 ?? null, spendPrev7: ads.kpis?.spendPrev7 ?? null, clicks7: ads.kpis?.clicks7 ?? null, conv7: ads.kpis?.conv7 ?? null,
          spend30: (ads.daily || []).reduce((s: number, x: any) => s + (x.cost || 0), 0),
          clicks30: (ads.daily || []).reduce((s: number, x: any) => s + (x.clicks || 0), 0),
          budgetDaily: ads.kpis?.budgetDaily ?? null,
          googleBookings30: googleAds30.length, googleValue30: googleAds30.reduce((s, b) => s + price(b), 0),
          generatedAt: ads.generatedAt || null,
          issues: (ads.findings || []).filter((f: any) => f.severity === 'critical').slice(0, 2).map((f: any) => f.title),
          actions: (ads.agentActions || []).slice(0, 3),
        } : null,
      }}
    />
  )
}
