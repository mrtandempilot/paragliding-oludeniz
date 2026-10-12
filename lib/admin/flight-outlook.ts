// Uçuş Masası hava tahmini: 7 gün, saat saat, tandem uçuşu için "uçulur mu" notu.
// 1200 m kalkış ve 1900 m rüzgârı basınç seviyelerinden irtifaya göre hesaplanır
// (ICON global — Windy'deki "ICON 13km" ile aynı koşu). Plaj rüzgârı/hamlesi ve
// yağmur olasılığı Open-Meteo'nun karma tahmininden gelir.
// Bu sadece model tahmini; son kararı her zaman pilot sahada verir.
import { BABADAG, UPPER_VARS, windAloft } from './dashboard-data'

export type Tone = 'ok' | 'warn' | 'bad'
export type HourRating = {
  hour: number
  tone: Tone
  why: string[]
  t1200: number; d1200: number; t1900: number
  head: number // + = kalkışa karşıdan (iyi), - = arkadan
  beach: number | null; gust: number | null
  rain: number | null; code: number | null
}
export type DayOutlook = {
  date: string
  verdict: Tone
  okHours: number; warnHours: number
  window: { from: number; to: number } | null // en uzun uygun aralık, saat (dahil)
  sunrise: string | null; sunset: string | null
  maxGust: number | null; maxRain: number | null
  hours: HourRating[]
}

// Babadağ kalkışları kabaca batıya (lagüne) bakar. Bu yönden esen rüzgâr karşıdan
// gelir (iyi), doğudan esen rüzgâr arkadan gelir (kalkış zor).
const LAUNCH_FACING = 285
// Sınırlar sitedeki "Babadağ'da uçuşa elverişli ne sayılır" sayfasıyla uyumlu:
// hamle ~25 km/s üstü uçuşlar durur, cephe/fırtına varsa uçulmaz.
const LIMIT = {
  gustWarn: 25, gustBad: 35,
  t1200Warn: 20, t1200Bad: 30,
  t1900Warn: 30, t1900Bad: 40,
  tailWarn: 8, tailBad: 15,
  rainWarn: 30, rainBad: 60,
}
export const DAY_FROM = 7, DAY_TO = 20
const RATE_FROM = 8, RATE_TO = 19 // gün notu için sayılan saatler

export function rateHour(x: Omit<HourRating, 'tone' | 'why' | 'head'> & { head?: number }): HourRating {
  const rad = ((x.d1200 - LAUNCH_FACING) * Math.PI) / 180
  const head = x.t1200 * Math.cos(rad)
  const why: string[] = []
  let tone: Tone = 'ok'
  const bad = (m: string) => { tone = 'bad'; why.push(m) }
  const warn = (m: string) => { if (tone === 'ok') tone = 'warn'; why.push(m) }
  if (x.code != null && x.code >= 95) bad('fırtına')
  if (x.rain != null) { if (x.rain >= LIMIT.rainBad) bad(`yağmur %${Math.round(x.rain)}`); else if (x.rain >= LIMIT.rainWarn) warn(`yağmur %${Math.round(x.rain)}`) }
  if (x.gust != null) { if (x.gust >= LIMIT.gustBad) bad(`plaj hamlesi ${Math.round(x.gust)}`); else if (x.gust >= LIMIT.gustWarn) warn(`plaj hamlesi ${Math.round(x.gust)}`) }
  if (x.t1200 >= LIMIT.t1200Bad) bad(`1200 m'de ${Math.round(x.t1200)} km/s`); else if (x.t1200 >= LIMIT.t1200Warn) warn(`1200 m'de ${Math.round(x.t1200)} km/s`)
  if (x.t1900 >= LIMIT.t1900Bad) bad(`1900 m'de ${Math.round(x.t1900)} km/s`); else if (x.t1900 >= LIMIT.t1900Warn) warn(`1900 m'de ${Math.round(x.t1900)} km/s`)
  if (-head >= LIMIT.tailBad) bad(`arkadan rüzgâr ${Math.round(-head)}`); else if (-head >= LIMIT.tailWarn) warn(`arkadan rüzgâr ${Math.round(-head)}`)
  return { ...x, head, tone, why }
}

function summarize(date: string, hours: HourRating[], sunrise: string | null, sunset: string | null): DayOutlook {
  const counted = hours.filter(h => h.hour >= RATE_FROM && h.hour <= RATE_TO)
  const okHours = counted.filter(h => h.tone === 'ok').length
  const warnHours = counted.filter(h => h.tone === 'warn').length
  // en uzun "ok" aralığı; yoksa en uzun "ok/warn" aralığı
  const longest = (pred: (h: HourRating) => boolean): { from: number; to: number } | null => {
    let best: { from: number; to: number } | null = null, start = -1
    counted.forEach((h, i) => {
      if (pred(h)) { if (start < 0) start = i } else start = -1
      if (start >= 0) {
        const cand = { from: counted[start].hour, to: h.hour }
        if (!best || cand.to - cand.from > best.to - best.from) best = cand
      }
    })
    return best as { from: number; to: number } | null
  }
  const window = longest(h => h.tone === 'ok') || longest(h => h.tone !== 'bad')
  const verdict: Tone = okHours >= 4 ? 'ok' : okHours + warnHours >= 4 ? 'warn' : 'bad'
  const nums = (a: (number | null)[]) => a.filter((v): v is number => typeof v === 'number')
  const g = nums(counted.map(h => h.gust)), r = nums(counted.map(h => h.rain))
  return {
    date, verdict, okHours, warnHours, window, sunrise, sunset,
    maxGust: g.length ? Math.max(...g) : null, maxRain: r.length ? Math.max(...r) : null,
    hours,
  }
}

export async function getFlightOutlook(days = 7): Promise<{ days: DayOutlook[]; model: string; fetchedAt: string; error: string | null }> {
  const tz = 'timezone=Europe%2FIstanbul&wind_speed_unit=kmh'
  const upperUrl = `https://api.open-meteo.com/v1/forecast?latitude=${BABADAG.lat}&longitude=${BABADAG.lon}&hourly=${UPPER_VARS}&models=icon_global&forecast_days=${days}&${tz}`
  const beachUrl = `https://api.open-meteo.com/v1/forecast?latitude=36.5497&longitude=29.1198&hourly=wind_speed_10m,wind_gusts_10m,precipitation_probability,weather_code&daily=sunrise,sunset&forecast_days=${days}&${tz}`
  try {
    const [up, beach] = await Promise.all([
      fetch(upperUrl, { next: { revalidate: 1800 } }).then(r => r.json()),
      fetch(beachUrl, { next: { revalidate: 1800 } }).then(r => r.json()),
    ])
    if (up?.error || beach?.error) throw new Error(up?.reason || beach?.reason || 'Open-Meteo hatası')
    const times: string[] = up.hourly?.time || []
    const bt: string[] = beach.hourly?.time || []
    const bh = beach.hourly || {}
    const byDay: Record<string, HourRating[]> = {}
    times.forEach((t, i) => {
      const hour = Number(t.slice(11, 13))
      if (hour < DAY_FROM || hour > DAY_TO) return
      const j = bt.indexOf(t)
      const at = windAloft(up.hourly, i)
      const s1200 = at(1200), s1900 = at(1900)
      if (!Number.isFinite(s1200.speed)) return
      const pick = (k: string) => (j >= 0 && typeof bh[k]?.[j] === 'number' ? bh[k][j] : null)
      ;(byDay[t.slice(0, 10)] ||= []).push(rateHour({
        hour, t1200: s1200.speed, d1200: s1200.dir, t1900: s1900.speed,
        beach: pick('wind_speed_10m'), gust: pick('wind_gusts_10m'), rain: pick('precipitation_probability'), code: pick('weather_code'),
      }))
    })
    const dd = beach.daily || {}
    const out = Object.keys(byDay).sort().map(date => {
      const k = (dd.time || []).indexOf(date)
      return summarize(date, byDay[date], k >= 0 ? String(dd.sunrise[k]).slice(11, 16) : null, k >= 0 ? String(dd.sunset[k]).slice(11, 16) : null)
    })
    return { days: out, model: 'ICON', fetchedAt: new Date().toISOString(), error: null }
  } catch (e: any) {
    return { days: [], model: 'ICON', fetchedAt: new Date().toISOString(), error: e?.message || 'Hava tahmini alınamadı' }
  }
}
