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

  const q = await Promise.allSettled([
    /* 0 */ supabase.from('bookings').select('id,first_name,last_name,flight_date,flight_type,guests,total_price,status,phone').gte('flight_date', today).lte('flight_date', in7).neq('status', 'cancelled').order('flight_date', { ascending: true }).limit(40),
    /* 1 */ supabase.from('bookings').select('id,total_price,status,created_at').gte('created_at', monthAgo),
    /* 2 */ supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'pending').lt('flight_date', today),
    /* 3 */ supabase.from('settings').select('key,value').in('key', ['pilot_enabled', 'pilot_slots']),
    /* 4 */ supabase.from('agent_logs').select('agent,action,status,error,created_at').order('created_at', { ascending: false }).limit(60),
    /* 5 */ supabase.from('usage_logs').select('cost_usd').gte('created_at', todayStartIso),
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
  ])
  const val = (i: number): any => (q[i].status === 'fulfilled' ? (q[i] as PromiseFulfilledResult<any>).value : null)
  const data = (i: number): any[] => val(i)?.data || []
  const count = (i: number): number => val(i)?.count || 0

  const upcoming = data(0)
  const month = data(1).filter((b: any) => b.status !== 'cancelled')
  const weekStart = Date.now() - 7 * 86400000
  const bookings = {
    todayFlights: upcoming.filter((b: any) => (b.flight_date || '').slice(0, 10) === today),
    upcoming,
    newToday: month.filter((b: any) => new Date(b.created_at) >= new Date(todayStartIso)).length,
    newWeek: month.filter((b: any) => new Date(b.created_at).getTime() >= weekStart).length,
    newMonth: month.length,
    revenueMonth: month.reduce((s: number, b: any) => s + (Number(b.total_price) || 0), 0),
    pending: upcoming.filter((x: any) => x.status === 'pending').length,
    stalePending: count(2),
  }

  const settings: Record<string, string> = {}
  for (const r of data(3)) settings[r.key] = r.value

  // latest log per agent
  const agentMap: Record<string, any> = {}
  for (const l of data(4)) if (!agentMap[l.agent]) agentMap[l.agent] = l

  const lastPosted = data(13)[0]?.posted_at || null

  return (
    <CommandCenter
      today={today}
      weather={val(15)}
      bookings={bookings}
      pilot={{
        enabled: settings['pilot_enabled'] === 'true',
        slots: (settings['pilot_slots'] || '06:00,12:00,18:00').split(',').map(s => s.trim()).filter(Boolean),
        costToday: data(5).reduce((s: number, r: any) => s + (r.cost_usd || 0), 0),
        pendingTopics: count(6),
        articlesWeek: count(7),
        articlesTotal: count(8),
        latestArticles: data(14),
      }}
      instagram={{
        postedWeek: count(9), drafts: count(10), scheduled: count(11), failed: count(12),
        gapDays: lastPosted ? Math.floor((Date.now() - new Date(lastPosted).getTime()) / 86400000) : null,
      }}
      agents={Object.values(agentMap)}
      recentLogs={data(4).slice(0, 10)}
    />
  )
}
