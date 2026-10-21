import type { Metadata, Viewport } from 'next'
import { getSupabase, istanbulDate, getSearchConsole } from '@/lib/admin/dashboard-data'
import { OPS_KEY, WA_HANDLED_KEY } from '@/lib/admin/flight-ops'
import { SOURCES_KEY } from '@/lib/admin/booking-source'
import { loadAdsReport } from '@/lib/ads-report/build'
import MobileApp, { type AppData } from './MobileApp'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Telefona "uygulama" olarak eklenen admin paneli (PWA). Manifest ve service
// worker sadece /admin/ kapsamında çalışır; public siteye ve SEO'ya dokunmaz.
export const metadata: Metadata = {
  title: { absolute: 'Atmos Admin' },
  manifest: '/admin-app.webmanifest',
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: 'Atmos', statusBarStyle: 'black-translucent' },
  icons: { icon: '/admin-icon-192.png', apple: '/admin-icon-180.png' },
}

export const viewport: Viewport = {
  themeColor: '#0B1220',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

const EARNED = ['completed', 'confirmed']

function withTimeout<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([p, new Promise<T>(r => setTimeout(() => r(fallback), ms))])
}

async function usdTry(): Promise<number | null> {
  try {
    const j = await fetch('https://open.er-api.com/v6/latest/USD', { next: { revalidate: 43200 } }).then(r => r.json())
    return typeof j?.rates?.TRY === 'number' ? j.rates.TRY : null
  } catch { return null }
}

export default async function MobileAppPage() {
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
  const d29 = istanbulDate(-29)
  const from4 = d29 < lastMonthStart ? d29 : lastMonthStart

  const q = await Promise.allSettled([
    /* 0 */ supabase.from('bookings').select('*').gte('flight_date', today).lte('flight_date', in6).neq('status', 'cancelled').order('flight_date').limit(200),
    /* 1 */ supabase.from('bookings').select('*').eq('status', 'pending').gt('flight_date', in6).order('flight_date').limit(30),
    /* 2 */ supabase.from('bookings').select('*').lt('flight_date', today).in('status', ['pending', 'confirmed']).order('flight_date', { ascending: false }).limit(60),
    /* 3 */ supabase.from('bookings').select('id,created_at,flight_date,guests,total_price,status').gte('created_at', d60).limit(2000),
    /* 4 */ supabase.from('bookings').select('id,flight_date,guests,total_price,status').gte('flight_date', from4).lte('flight_date', in30).neq('status', 'cancelled').limit(2000),
    /* 5 */ supabase.from('settings').select('key,value').in('key', [OPS_KEY, WA_HANDLED_KEY, SOURCES_KEY]),
    /* 6 */ supabase.from('agent_logs').select('id,output,created_at').eq('agent', 'whatsapp').gte('created_at', h72).order('created_at', { ascending: false }).limit(50),
    /* 7 */ loadAdsReport(),
    /* 8 */ usdTry(),
    /* 9 */ withTimeout(getSearchConsole(), 8000, { daily: [], queries: [], pages: [], error: 'Search Console zaman aşımı' } as any),
  ])
  const val = (i: number): any => (q[i].status === 'fulfilled' ? (q[i] as PromiseFulfilledResult<any>).value : null)
  const rows = (i: number): any[] => val(i)?.data || []

  const settings: Record<string, any> = {}
  for (const r of rows(5)) { try { settings[r.key] = JSON.parse(r.value) } catch { settings[r.key] = r.value } }
  const handled: string[] = Array.isArray(settings[WA_HANDLED_KEY]) ? settings[WA_HANDLED_KEY] : []
  const sources: Record<string, { channel: string }> = settings[SOURCES_KEY] && typeof settings[SOURCES_KEY] === 'object' ? settings[SOURCES_KEY] : {}
  const ops = settings[OPS_KEY] && typeof settings[OPS_KEY] === 'object' ? settings[OPS_KEY] : {}

  const seen = new Set<string>()
  const waInbox = rows(6)
    .filter(l => l.output?.needsHuman && !handled.includes(String(l.id)))
    .filter(l => { const f = String(l.output?.from || ''); if (!f || seen.has(f)) return false; seen.add(f); return true })
    .map(l => ({ id: String(l.id), from: String(l.output.from), summary: String(l.output.summary || ''), at: l.created_at as string }))

  /* ── money ── */
  const price = (b: any) => Number(b.total_price) || 150 * (b.guests || 1)
  const byFlight = rows(4)
  const sumOf = (list: any[]) => ({ revenue: list.reduce((s, b) => s + price(b), 0), guests: list.reduce((s, b) => s + (b.guests || 1), 0), count: list.length })
  const earnedMonth = sumOf(byFlight.filter(b => b.flight_date >= monthStart && b.flight_date <= today && EARNED.includes(b.status)))
  const earnedLastSame = sumOf(byFlight.filter(b => b.flight_date >= lastMonthStart && b.flight_date <= lastMonthSameDay && EARNED.includes(b.status)))
  const earned30 = sumOf(byFlight.filter(b => b.flight_date >= d29 && b.flight_date <= today && EARNED.includes(b.status)))
  const ahead = byFlight.filter(b => b.flight_date > today && b.flight_date <= in30)
  const aheadConfirmed = sumOf(ahead.filter(b => b.status === 'confirmed'))
  const aheadPending = sumOf(ahead.filter(b => b.status === 'pending'))

  const created = rows(3)
  const trDate = (iso: string) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul' }).format(new Date(iso))
  const days30 = Array.from({ length: 30 }, (_, i) => istanbulDate(i - 29))
  const adsRep = val(7)?.report
  const adsDaily: Record<string, any> = {}
  for (const x of adsRep?.daily || []) adsDaily[x.date] = x
  const trend = days30.map(date => {
    const list = created.filter(b => b.status !== 'cancelled' && trDate(b.created_at) === date)
    return { date, bookings: list.length, value: list.reduce((s, b) => s + price(b), 0), adCost: adsDaily[date]?.cost ?? null }
  })
  const cutoff = now - 30 * 86400000
  const last30 = created.filter(b => b.status !== 'cancelled' && new Date(b.created_at).getTime() >= cutoff)
  const prev30 = created.filter(b => b.status !== 'cancelled' && new Date(b.created_at).getTime() < cutoff)

  const channels: Record<string, { bookings: number; value: number }> = {}
  for (const b of last30) {
    const k = sources[b.id]?.channel || 'Takip yok'
    channels[k] ||= { bookings: 0, value: 0 }
    channels[k].bookings++; channels[k].value += price(b)
  }
  const googleAds30 = last30.filter(b => sources[b.id]?.channel === 'Google Ads')

  /* ── ads ── */
  const ads = adsRep ? {
    generatedAt: adsRep.generatedAt || null,
    kpis: adsRep.kpis || {},
    daily: (adsRep.daily || []).slice(-30).map((x: any) => ({ date: x.date, cost: x.cost || 0, clicks: x.clicks || 0, conversions: x.conversions || 0, impressions: x.impressions || 0 })),
    spend30: (adsRep.daily || []).slice(-30).reduce((s: number, x: any) => s + (x.cost || 0), 0),
    googleBookings30: googleAds30.length,
    googleValue30: googleAds30.reduce((s, b) => s + price(b), 0),
    findings: (adsRep.findings || []).slice(0, 6).map((f: any) => ({ severity: f.severity, title: f.title, detail: f.detail, action: f.action || null })),
    summary: typeof adsRep.summary === 'string' ? adsRep.summary : null,
    campaigns: (adsRep.campaigns || []).map((c: any) => ({ name: c.name, status: c.status, budget: c.budget })),
  } : null

  /* ── seo ── */
  const gsc = val(9) || { daily: [], queries: [], pages: [], error: 'Search Console verisi alınamadı' }

  const data: AppData = {
    today,
    generatedAt: new Date().toISOString(),
    usdTry: val(8),
    upcoming: rows(0),
    laterPending: rows(1),
    unclosed: rows(2),
    ops,
    sources: Object.fromEntries(Object.entries(sources).map(([k, v]) => [k, v.channel])),
    waInbox,
    money: {
      earnedMonth, earnedLastSame, earned30, aheadConfirmed, aheadPending,
      last30: { bookings: last30.length, value: last30.reduce((s, b) => s + price(b), 0) },
      prev30: { bookings: prev30.length, value: prev30.reduce((s, b) => s + price(b), 0) },
      trend,
      channels: Object.entries(channels).map(([channel, v]) => ({ channel, ...v })).sort((a, b) => b.value - a.value),
    },
    ads,
    seo: { daily: gsc.daily || [], queries: gsc.queries || [], pages: gsc.pages || [], error: gsc.error || null },
  }

  return <MobileApp data={data} />
}
