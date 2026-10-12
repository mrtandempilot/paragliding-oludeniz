import { getSupabase, istanbulDate, getBabadagWindLadder } from '@/lib/admin/dashboard-data'
import { getFlightOutlook } from '@/lib/admin/flight-outlook'
import { OPS_KEY, WA_HANDLED_KEY } from '@/lib/admin/flight-ops'
import { loadAdsReport } from '@/lib/ads-report/build'
import { AGENTS } from '@/lib/agents/registry'
import FlightDesk from './FlightDesk'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Uçuş Masası — admin ana sayfası. Üç soruya cevap verir:
// bugün/yarın uçulur mu, kimi nereden kaçta alıyoruz, şimdi ne yapmam lazım.
export default async function AdminDashboardPage() {
  const supabase = getSupabase()
  const today = istanbulDate(0)
  const in6 = istanbulDate(6)
  const now = Date.now()
  const d30 = new Date(now - 30 * 86400000).toISOString()
  const h72 = new Date(now - 72 * 3600000).toISOString()

  const q = await Promise.allSettled([
    /* 0 */ supabase.from('bookings').select('*').gte('flight_date', today).lte('flight_date', in6).neq('status', 'cancelled').order('flight_date').limit(200),
    /* 1 */ supabase.from('bookings').select('*').eq('status', 'pending').gt('flight_date', in6).order('flight_date').limit(20),
    /* 2 */ supabase.from('bookings').select('*').lt('flight_date', today).in('status', ['pending', 'confirmed']).order('flight_date', { ascending: false }).limit(30),
    /* 3 */ supabase.from('bookings').select('id,created_at,flight_date,guests,total_price,status').gte('created_at', d30).neq('status', 'cancelled').limit(1000),
    /* 4 */ supabase.from('bookings').select('id,flight_date,guests,total_price,status').gte('flight_date', d30.slice(0, 10)).lt('flight_date', today).in('status', ['completed', 'confirmed']).limit(1000),
    /* 5 */ supabase.from('settings').select('key,value').in('key', [OPS_KEY, WA_HANDLED_KEY]),
    /* 6 */ supabase.from('agent_logs').select('id,agent,action,status,error,created_at').neq('status', 'running').order('created_at', { ascending: false }).limit(150),
    /* 7 */ supabase.from('agent_logs').select('id,output,created_at').eq('agent', 'whatsapp').gte('created_at', h72).order('created_at', { ascending: false }).limit(50),
    /* 8 */ getFlightOutlook(7),
    /* 9 */ getBabadagWindLadder(),
    /* 10 */ loadAdsReport(),
  ])
  const val = (i: number): any => (q[i].status === 'fulfilled' ? (q[i] as PromiseFulfilledResult<any>).value : null)
  const rows = (i: number): any[] => val(i)?.data || []

  const settings: Record<string, any> = {}
  for (const r of rows(5)) { try { settings[r.key] = JSON.parse(r.value) } catch { settings[r.key] = r.value } }
  const handled: string[] = Array.isArray(settings[WA_HANDLED_KEY]) ? settings[WA_HANDLED_KEY] : []

  // ajanların son durumu (her ajan için en yeni kayıt)
  const latest: Record<string, any> = {}
  for (const l of rows(6)) if (!latest[l.agent]) latest[l.agent] = l
  const agentErrors = Object.values(latest).filter((l: any) => l.status === 'error')

  // insan bekleyen WhatsApp konuşmaları (aynı numaradan en yenisi)
  const seen = new Set<string>()
  const waInbox = rows(7)
    .filter(l => l.output?.needsHuman && !handled.includes(String(l.id)))
    .filter(l => { const f = String(l.output?.from || ''); if (!f || seen.has(f)) return false; seen.add(f); return true })
    .map(l => ({ id: String(l.id), from: String(l.output.from), summary: String(l.output.summary || ''), at: l.created_at }))

  // nabız
  const created = rows(3)
  const weekAgo = now - 7 * 86400000
  const thisWeek = created.filter(b => new Date(b.created_at).getTime() >= weekAgo)
  const prevWeek = created.filter(b => { const t = new Date(b.created_at).getTime(); return t < weekAgo && t >= now - 14 * 86400000 })
  const flown = rows(4)
  const ads = val(10)?.report

  return (
    <FlightDesk
      today={today}
      upcoming={rows(0)}
      laterPending={rows(1)}
      unclosed={rows(2)}
      ops={settings[OPS_KEY] && typeof settings[OPS_KEY] === 'object' ? settings[OPS_KEY] : {}}
      outlook={val(8) || { days: [], model: 'ICON', fetchedAt: new Date().toISOString(), error: 'Hava tahmini alınamadı' }}
      live={val(9)}
      waInbox={waInbox}
      agents={{ total: AGENTS.length, errors: agentErrors.map((l: any) => ({ agent: l.agent, action: l.action, error: l.error, at: l.created_at })) }}
      pulse={{
        week: { bookings: thisWeek.length, guests: thisWeek.reduce((s, b) => s + (b.guests || 1), 0) },
        prevWeek: { bookings: prevWeek.length, guests: prevWeek.reduce((s, b) => s + (b.guests || 1), 0) },
        flown30: { guests: flown.reduce((s, b) => s + (b.guests || 1), 0), revenue: flown.reduce((s, b) => s + (Number(b.total_price) || 0), 0) },
        ads: ads ? {
          spend7: ads.kpis?.spend7 ?? null, clicks7: ads.kpis?.clicks7 ?? null, conv7: ads.kpis?.conv7 ?? null,
          generatedAt: ads.generatedAt || null,
          issues: (ads.findings || []).filter((f: any) => f.severity === 'critical').slice(0, 2).map((f: any) => f.title),
        } : null,
      }}
    />
  )
}
