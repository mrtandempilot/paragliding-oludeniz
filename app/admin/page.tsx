import { createClient } from '@supabase/supabase-js'
import { getOludenizWeather } from '@/lib/weather'
import CommandCenter from './CommandCenter'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

function istanbulDate(offsetDays = 0) {
  const d = new Date(Date.now() + offsetDays * 86400000)
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul' }).format(d) // YYYY-MM-DD
}

const GSC_SITE_URL = 'sc-domain:atmosparagliding.com'
async function getSearchConsole() {
  try {
    const tr = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_ADS_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET || '',
        refresh_token: process.env.GOOGLE_SEO_REFRESH_TOKEN || '',
        grant_type: 'refresh_token',
      }),
      cache: 'no-store',
    })
    const tj = await tr.json()
    if (!tj.access_token) throw new Error(tj.error_description || tj.error || 'Search Console token alınamadı')
    const ago = (d: number) => new Date(Date.now() - d * 86400000).toISOString().slice(0, 10)
    const q = async (startDate: string, dimensions: string[], rowLimit: number) => {
      const r = await fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE_URL)}/searchAnalytics/query`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tj.access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate: ago(2), dimensions, rowLimit }),
        cache: 'no-store',
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d?.error?.message || `HTTP ${r.status}`)
      return (d.rows || []) as any[]
    }
    const [daily, queries, pages] = await Promise.all([
      q(ago(92), ['date'], 500),
      q(ago(30), ['query'], 8),
      q(ago(30), ['page'], 6),
    ])
    return {
      daily: daily.map(r => ({ date: r.keys[0], clicks: r.clicks || 0, impressions: r.impressions || 0 })).sort((a, b) => a.date.localeCompare(b.date)),
      queries: queries.map(r => ({ key: r.keys[0], clicks: r.clicks || 0, impressions: r.impressions || 0, position: r.position || 0 })),
      pages: pages.map(r => ({ key: String(r.keys[0]).replace(/^https?:\/\/(www\.)?atmosparagliding\.com/, '') || '/', clicks: r.clicks || 0, impressions: r.impressions || 0, position: r.position || 0 })),
      error: null as string | null,
    }
  } catch (e: any) {
    return { daily: [], queries: [], pages: [], error: e?.message || 'Search Console verisi alınamadı' }
  }
}

// Wind aloft for Babadağ: surface stations share one model cell, so for the
// take-off (1200 m) and summit (1969 m) we interpolate Open-Meteo pressure-level
// winds to those altitudes (vector interpolation on geopotential height).
async function getBabadagWindLadder() {
  const levels = [1000, 925, 900, 850, 800, 700]
  const vars = levels.flatMap(l => [`wind_speed_${l}hPa`, `wind_direction_${l}hPa`, `geopotential_height_${l}hPa`, `temperature_${l}hPa`]).join(',')
  const upperUrl = `https://api.open-meteo.com/v1/forecast?latitude=36.565&longitude=29.07&hourly=${vars}&wind_speed_unit=kmh&timezone=Europe%2FIstanbul&forecast_days=1`
  const beachUrl = `https://api.open-meteo.com/v1/forecast?latitude=36.5497&longitude=29.1198&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,weather_code&wind_speed_unit=kmh&timezone=Europe%2FIstanbul`
  try {
    const [up, beach] = await Promise.all([
      fetch(upperUrl, { next: { revalidate: 900 } }).then(r => r.json()),
      fetch(beachUrl, { next: { revalidate: 900 } }).then(r => r.json()),
    ])
    const hourKey = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Istanbul' }).slice(0, 13).replace(' ', 'T')
    const i = Math.max(0, (up.hourly?.time || []).findIndex((t: string) => t.startsWith(hourKey)))
    const pts = levels.map(l => {
      const spd = up.hourly[`wind_speed_${l}hPa`][i], dir = up.hourly[`wind_direction_${l}hPa`][i]
      const rad = (dir * Math.PI) / 180
      return { z: up.hourly[`geopotential_height_${l}hPa`][i], u: -spd * Math.sin(rad), v: -spd * Math.cos(rad), t: up.hourly[`temperature_${l}hPa`][i] }
    }).filter(p => [p.z, p.u, p.v, p.t].every(x => typeof x === 'number' && !Number.isNaN(x))).sort((a, b) => a.z - b.z)
    const at = (z: number) => {
      let a = pts[0], b = pts[pts.length - 1]
      for (let k = 0; k < pts.length - 1; k++) if (pts[k].z <= z && pts[k + 1].z >= z) { a = pts[k]; b = pts[k + 1]; break }
      const w = b.z === a.z ? 0 : Math.min(1, Math.max(0, (z - a.z) / (b.z - a.z)))
      const u = a.u + (b.u - a.u) * w, v = a.v + (b.v - a.v) * w
      return {
        speed: Math.sqrt(u * u + v * v),
        dir: ((Math.atan2(-u, -v) * 180) / Math.PI + 360) % 360,
        temp: a.t + (b.t - a.t) * w,
      }
    }
    const c = beach.current || {}
    const s1969 = at(1969), s1200 = at(1200)
    return {
      fetchedAt: new Date().toISOString(),
      stations: [
        { label: 'Babadağ Summit', elevation: '1969 m ASL', temperatureC: s1969.temp, windSpeedKmh: s1969.speed, windGustKmh: null, windDirectionDeg: s1969.dir, weatherCode: c.weather_code ?? null, humidity: null },
        { label: 'Babadağ 1200m Take-off', elevation: '1200 m ASL', temperatureC: s1200.temp, windSpeedKmh: s1200.speed, windGustKmh: null, windDirectionDeg: s1200.dir, weatherCode: c.weather_code ?? null, humidity: null },
        { label: 'Ölüdeniz Beach (Landing)', elevation: '5 m ASL', temperatureC: c.temperature_2m ?? null, windSpeedKmh: c.wind_speed_10m ?? null, windGustKmh: c.wind_gusts_10m ?? null, windDirectionDeg: c.wind_direction_10m ?? null, weatherCode: c.weather_code ?? null, humidity: c.relative_humidity_2m ?? null },
      ],
    }
  } catch {
    return getOludenizWeather()
  }
}

export default async function AdminDashboardPage() {
  const supabase = getSupabase()
  const today = istanbulDate(0)
  const in7 = istanbulDate(7)
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()
  const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString()
  const todayStartIso = new Date(`${today}T00:00:00+03:00`).toISOString()
  const [y, m] = today.split('-').map(Number)
  const calStart = `${y}-${String(m).padStart(2, '0')}-01`
  const calEndDate = new Date(Date.UTC(y, m + 1, 0)) // last day of next month
  const calEnd = calEndDate.toISOString().slice(0, 10)

  const q = await Promise.allSettled([
    /* 0 */ supabase.from('bookings').select('id,first_name,last_name,flight_date,flight_type,guests,total_price,status,phone').gte('flight_date', today).lte('flight_date', in7).neq('status', 'cancelled').order('flight_date', { ascending: true }).limit(40),
    /* 1 */ supabase.from('bookings').select('id,first_name,last_name,flight_date,flight_type,guests,total_price,status,created_at').gte('created_at', monthAgo).order('created_at', { ascending: false }),
    /* 2 */ supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'pending').lt('flight_date', today),
    /* 3 */ supabase.from('settings').select('key,value').in('key', ['pilot_enabled', 'pilot_slots', 'dm_general_enabled', 'dm_keyword_enabled', 'dm_keywords']),
    /* 4 */ supabase.from('agent_logs').select('agent,action,status,error,created_at').order('created_at', { ascending: false }).limit(60),
    /* 5 */ supabase.from('usage_logs').select('cost_usd,created_at').gte('created_at', monthAgo),
    /* 6 */ supabase.from('topics').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    /* 7 */ supabase.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'published').gte('created_at', weekAgo),
    /* 8 */ supabase.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    /* 9 */ supabase.from('instagram_posts').select('id', { count: 'exact', head: true }).eq('status', 'posted').gte('posted_at', weekAgo),
    /* 10 */ supabase.from('instagram_posts').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
    /* 11 */ supabase.from('instagram_posts').select('id', { count: 'exact', head: true }).eq('status', 'scheduled'),
    /* 12 */ supabase.from('instagram_posts').select('id', { count: 'exact', head: true }).eq('status', 'failed'),
    /* 13 */ supabase.from('instagram_posts').select('posted_at').eq('status', 'posted').order('posted_at', { ascending: false }).limit(1),
    /* 14 */ supabase.from('articles').select('title,slug,created_at').eq('status', 'published').order('created_at', { ascending: false }).limit(3),
    /* 15 */ getBabadagWindLadder(),
    /* 16 */ supabase.from('bookings').select('flight_date,guests,status').gte('flight_date', calStart).lte('flight_date', calEnd).neq('status', 'cancelled').limit(1000),
    /* 17 */ supabase.from('agent_logs').select('status').gte('created_at', weekAgo).limit(2000),
    /* 18 */ supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
    /* 19 */ getSearchConsole(),
  ])
  const val = (i: number): any => (q[i].status === 'fulfilled' ? (q[i] as PromiseFulfilledResult<any>).value : null)
  const data = (i: number): any[] => val(i)?.data || []
  const count = (i: number): number => val(i)?.count || 0

  const upcoming = data(0)
  const month = data(1)
  const live = month.filter((b: any) => b.status !== 'cancelled')
  const weekStart = Date.now() - 7 * 86400000
  const statusCounts: Record<string, number> = {}
  for (const b of month) statusCounts[b.status] = (statusCounts[b.status] || 0) + 1
  const typeCounts: Record<string, number> = {}
  for (const b of live) typeCounts[b.flight_type || 'standard'] = (typeCounts[b.flight_type || 'standard'] || 0) + (b.guests || 1)

  const bookings = {
    todayFlights: upcoming.filter((b: any) => (b.flight_date || '').slice(0, 10) === today),
    upcoming,
    newToday: live.filter((b: any) => new Date(b.created_at) >= new Date(todayStartIso)).length,
    newWeek: live.filter((b: any) => new Date(b.created_at).getTime() >= weekStart).length,
    newMonth: live.length,
    guestsMonth: live.reduce((s: number, b: any) => s + (b.guests || 1), 0),
    revenueMonth: live.reduce((s: number, b: any) => s + (Number(b.total_price) || 0), 0),
    pending: upcoming.filter((x: any) => x.status === 'pending').length,
    stalePending: count(2),
    statusCounts,
    typeCounts,
    recent: month.slice(0, 6),
  }

  const calendar: Record<string, { bookings: number; guests: number; pending: number }> = {}
  for (const b of data(16)) {
    const d = String(b.flight_date || '').slice(0, 10)
    if (!d) continue
    const c = (calendar[d] ||= { bookings: 0, guests: 0, pending: 0 })
    c.bookings++; c.guests += b.guests || 1; if (b.status === 'pending') c.pending++
  }

  const settings: Record<string, string> = {}
  for (const r of data(3)) settings[r.key] = r.value

  const agentMap: Record<string, any> = {}
  for (const l of data(4)) if (!agentMap[l.agent]) agentMap[l.agent] = l
  const runs7: Record<string, number> = {}
  for (const l of data(17)) runs7[l.status || 'unknown'] = (runs7[l.status || 'unknown'] || 0) + 1

  const usage = data(5)
  const cost = (since: number) => usage.filter((u: any) => new Date(u.created_at).getTime() >= since).reduce((s: number, u: any) => s + (u.cost_usd || 0), 0)

  const lastPosted = data(13)[0]?.posted_at || null

  return (
    <CommandCenter
      today={today}
      weather={val(15)}
      bookings={bookings}
      calendar={{ start: calStart, end: calEnd, days: calendar }}
      pilot={{
        enabled: settings['pilot_enabled'] === 'true',
        slots: (settings['pilot_slots'] || '06:00,12:00,18:00').split(',').map(s => s.trim()).filter(Boolean),
        costToday: cost(new Date(todayStartIso).getTime()),
        cost7: cost(weekStart),
        cost30: cost(Date.now() - 30 * 86400000),
        pendingTopics: count(6),
        articlesWeek: count(7),
        articlesTotal: count(8),
        blogPosts: count(18),
        latestArticles: data(14),
        runs7,
      }}
      dm={{
        general: settings['dm_general_enabled'] === 'true',
        keyword: settings['dm_keyword_enabled'] === 'true',
        keywords: (settings['dm_keywords'] || '').split(',').map(s => s.trim()).filter(Boolean),
      }}
      instagram={{
        postedWeek: count(9), drafts: count(10), scheduled: count(11), failed: count(12),
        gapDays: lastPosted ? Math.floor((Date.now() - new Date(lastPosted).getTime()) / 86400000) : null,
      }}
      gsc={val(19) || { daily: [], queries: [], pages: [], error: 'Search Console verisi alınamadı' }}
      agents={Object.values(agentMap)}
    />
  )
}
