// Live weather via Open-Meteo (free, no API key required)
// https://open-meteo.com/en/docs

export interface StationWeather {
  label: string
  elevation: string
  temperatureC: number | null
  windSpeedKmh: number | null
  windGustKmh: number | null
  windDirectionDeg: number | null
  weatherCode: number | null
  humidity: number | null
}

const STATIONS = [
  { key: 'beach', label: 'Ölüdeniz Beach (Landing)', elevation: '5 m ASL', lat: 36.5497, lon: 29.1198 },
  { key: 'launch1200', label: 'Babadağ 1200m Take-off', elevation: '1200 m ASL', lat: 36.5602, lon: 29.0795 },
  { key: 'summit', label: 'Babadağ Summit', elevation: '1969 m ASL', lat: 36.5717, lon: 29.0578 },
] as const

const WMO_LABELS: Record<number, { en: string; tr: string }> = {
  0: { en: 'Clear sky', tr: 'Açık' },
  1: { en: 'Mainly clear', tr: 'Çoğunlukla açık' },
  2: { en: 'Partly cloudy', tr: 'Parçalı bulutlu' },
  3: { en: 'Overcast', tr: 'Kapalı' },
  45: { en: 'Fog', tr: 'Sis' },
  48: { en: 'Depositing rime fog', tr: 'Kırağı sisi' },
  51: { en: 'Light drizzle', tr: 'Hafif çiseleme' },
  53: { en: 'Moderate drizzle', tr: 'Orta çiseleme' },
  55: { en: 'Dense drizzle', tr: 'Yoğun çiseleme' },
  61: { en: 'Slight rain', tr: 'Hafif yağmur' },
  63: { en: 'Moderate rain', tr: 'Orta yağmur' },
  65: { en: 'Heavy rain', tr: 'Şiddetli yağmur' },
  71: { en: 'Slight snow', tr: 'Hafif kar' },
  80: { en: 'Rain showers', tr: 'Sağanak yağmur' },
  95: { en: 'Thunderstorm', tr: 'Gök gürültülü fırtına' },
}

export function weatherCodeLabel(code: number | null, locale: string): string {
  if (code === null) return '—'
  const entry = WMO_LABELS[code]
  if (!entry) return '—'
  return locale === 'tr' ? entry.tr : entry.en
}

export function windDirectionCompass(deg: number | null): string {
  if (deg === null) return '—'
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  return dirs[Math.round(deg / 22.5) % 16]
}

export async function getOludenizWeather(): Promise<{ stations: StationWeather[]; fetchedAt: string } | null> {
  try {
    const results = await Promise.all(
      STATIONS.map(async (s) => {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${s.lat}&longitude=${s.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,weather_code&wind_speed_unit=kmh&timezone=auto`
        const res = await fetch(url, { next: { revalidate: 900 } }) // 15 min cache
        if (!res.ok) throw new Error(`weather fetch failed: ${res.status}`)
        const data = await res.json()
        const c = data.current || {}
        const station: StationWeather = {
          label: s.label,
          elevation: s.elevation,
          temperatureC: c.temperature_2m ?? null,
          windSpeedKmh: c.wind_speed_10m ?? null,
          windGustKmh: c.wind_gusts_10m ?? null,
          windDirectionDeg: c.wind_direction_10m ?? null,
          weatherCode: c.weather_code ?? null,
          humidity: c.relative_humidity_2m ?? null,
        }
        return station
      })
    )
    return { stations: results, fetchedAt: new Date().toISOString() }
  } catch {
    return null
  }
}
