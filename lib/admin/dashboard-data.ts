import { createClient } from '@supabase/supabase-js'
import { getOludenizWeather } from '@/lib/weather'

// Shared data loaders for the admin dashboard and the Neslihan voice assistant.

export function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export function istanbulDate(offsetDays = 0) {
  const d = new Date(Date.now() + offsetDays * 86400000)
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul' }).format(d) // YYYY-MM-DD
}

const GSC_SITE_URL = 'sc-domain:atmosparagliding.com'
export async function getSearchConsole() {
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
const LEVELS = [1000, 925, 900, 850, 800, 700]
const UPPER_VARS = LEVELS.flatMap(l => [`wind_speed_${l}hPa`, `wind_direction_${l}hPa`, `geopotential_height_${l}hPa`, `temperature_${l}hPa`]).join(',')

// Wind/temperature at altitude z (m) for hour index i of an Open-Meteo pressure-level response.
function windAloft(hourly: any, i: number) {
  const pts = LEVELS.map(l => {
    const spd = hourly[`wind_speed_${l}hPa`][i], dir = hourly[`wind_direction_${l}hPa`][i]
    const rad = (dir * Math.PI) / 180
    return { z: hourly[`geopotential_height_${l}hPa`][i], u: -spd * Math.sin(rad), v: -spd * Math.cos(rad), t: hourly[`temperature_${l}hPa`][i] }
  }).filter(p => [p.z, p.u, p.v, p.t].every(x => typeof x === 'number' && !Number.isNaN(x))).sort((a, b) => a.z - b.z)
  return (z: number) => {
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
}

export async function getBabadagWindLadder() {
  const upperUrl = `https://api.open-meteo.com/v1/forecast?latitude=36.565&longitude=29.07&hourly=${UPPER_VARS}&wind_speed_unit=kmh&timezone=Europe%2FIstanbul&forecast_days=1`
  const beachUrl = `https://api.open-meteo.com/v1/forecast?latitude=36.5497&longitude=29.1198&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,weather_code&wind_speed_unit=kmh&timezone=Europe%2FIstanbul`
  try {
    const [up, beach] = await Promise.all([
      fetch(upperUrl, { next: { revalidate: 900 } }).then(r => r.json()),
      fetch(beachUrl, { next: { revalidate: 900 } }).then(r => r.json()),
    ])
    const hourKey = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Istanbul' }).slice(0, 13).replace(' ', 'T')
    const i = Math.max(0, (up.hourly?.time || []).findIndex((t: string) => t.startsWith(hourKey)))
    const at = windAloft(up.hourly, i)
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

// Hour-by-hour forecast for one day (up to 7 days ahead): summit, 1200 m
// take-off (pressure-level winds interpolated like the live ladder) and the
// Ölüdeniz beach landing (10 m wind + gusts), plus rain chance and cloud cover.
export async function getBabadagForecast(date: string, fromHour = 7, toHour = 19) {
  const upperUrl = `https://api.open-meteo.com/v1/forecast?latitude=36.565&longitude=29.07&hourly=${UPPER_VARS}&wind_speed_unit=kmh&timezone=Europe%2FIstanbul&start_date=${date}&end_date=${date}`
  const beachUrl = `https://api.open-meteo.com/v1/forecast?latitude=36.5497&longitude=29.1198&hourly=wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation_probability,cloud_cover,temperature_2m,weather_code&wind_speed_unit=kmh&timezone=Europe%2FIstanbul&start_date=${date}&end_date=${date}`
  const [up, beach] = await Promise.all([
    fetch(upperUrl, { next: { revalidate: 1800 } }).then(r => r.json()),
    fetch(beachUrl, { next: { revalidate: 1800 } }).then(r => r.json()),
  ])
  if (up?.error || beach?.error) throw new Error(up?.reason || beach?.reason || 'Hava tahmini alınamadı')
  const times: string[] = up.hourly?.time || []
  const b = beach.hourly || {}
  const hours = []
  for (let i = 0; i < times.length; i++) {
    const hour = Number(times[i].slice(11, 13))
    if (hour < fromHour || hour > toHour) continue
    const at = windAloft(up.hourly, i)
    const s1969 = at(1969), s1200 = at(1200)
    hours.push({
      hour,
      summit: { speed: s1969.speed, dir: s1969.dir, temp: s1969.temp },
      takeoff: { speed: s1200.speed, dir: s1200.dir, temp: s1200.temp },
      beach: { speed: b.wind_speed_10m?.[i] ?? null, gust: b.wind_gusts_10m?.[i] ?? null, dir: b.wind_direction_10m?.[i] ?? null, temp: b.temperature_2m?.[i] ?? null },
      rainChance: b.precipitation_probability?.[i] ?? null,
      cloudCover: b.cloud_cover?.[i] ?? null,
      weatherCode: b.weather_code?.[i] ?? null,
    })
  }
  return { date, hours }
}
