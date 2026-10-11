'use client'

import type { DisplayWeather, WeatherSpot } from '@/lib/neslihan/tools'

// Visual weather board for Neslihan: compass dials for "now", a
// windguru-style hourly strip for forecasts. Wind in km/h, direction = from.

const TONE_RING: Record<string, string> = { good: '#2DD4BF', warn: '#FBBF24', bad: '#F87171' }
const TONE_TEXT: Record<string, string> = { good: 'text-[#2DD4BF]', warn: 'text-[#FBBF24]', bad: 'text-[#F87171]' }
const TONE_LABEL: Record<string, string> = { good: 'Uygun', warn: 'Dikkat', bad: 'Uygun değil' }

// Wind colour scale (km/h), calm → strong
function windColor(kmh: number | null) {
  if (kmh == null) return { bg: '#1E3654', fg: '#8098B3' }
  if (kmh < 10) return { bg: '#1E4E6B', fg: '#CFE8F5' }
  if (kmh < 18) return { bg: '#167A5B', fg: '#E7FFF6' }
  if (kmh < 25) return { bg: '#A57A0B', fg: '#FFF7DB' }
  if (kmh < 32) return { bg: '#B4500F', fg: '#FFEBDD' }
  return { bg: '#A3242B', fg: '#FFE4E6' }
}

const COMPASS = ['K', 'KD', 'D', 'GD', 'G', 'GB', 'B', 'KB']
const dirName = (deg: number | null) => (deg == null ? '—' : COMPASS[Math.round(deg / 45) % 8])

// Arrow pointing where the wind blows TO (from + 180°), like Windy's arrows.
function Arrow({ deg, size = 14, color = 'currentColor' }: { deg: number | null; size?: number; color?: string }) {
  if (deg == null) return null
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ transform: `rotate(${deg + 180}deg)` }} aria-hidden>
      <path d="M12 2 L18 20 L12 15 L6 20 Z" fill={color} />
    </svg>
  )
}

function Dial({ spot }: { spot: WeatherSpot }) {
  const ring = TONE_RING[spot.tone] || '#5F7894'
  const ticks = Array.from({ length: 36 }, (_, i) => i * 10)
  return (
    <div className="flex flex-col items-center rounded-2xl bg-[#0B1A2C] p-2 sm:p-4">
      <p className="text-center text-[10px] font-semibold uppercase tracking-wide text-[#8098B3] sm:text-xs sm:tracking-[0.15em]">{spot.label}</p>
      <div className="relative mt-2 h-24 w-24 sm:mt-3 sm:h-40 sm:w-40">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <circle cx="100" cy="100" r="92" fill="none" stroke={ring} strokeWidth="6" opacity="0.9" />
          {ticks.map(t => (
            <line key={t} x1="100" y1={t % 90 === 0 ? 16 : 20} x2="100" y2="26" stroke="#5F7894" strokeWidth={t % 90 === 0 ? 2 : 1} transform={`rotate(${t} 100 100)`} />
          ))}
          {(['K', 'D', 'G', 'B'] as const).map((l, i) => {
            const a = (i * 90 * Math.PI) / 180
            return <text key={l} x={100 + 62 * Math.sin(a)} y={100 - 62 * Math.cos(a) + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="#C9D6E4">{l}</text>
          })}
          {spot.dir != null && (
            // marker on the ring where the wind comes FROM, arrow towards the centre
            <g transform={`rotate(${spot.dir} 100 100)`}>
              <path d="M100 54 L111 30 L100 36 L89 30 Z" fill={ring} />
            </g>
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="hidden text-[11px] text-[#8098B3] sm:block">{dirName(spot.dir)}{spot.dir != null ? ` ${Math.round(spot.dir)}°` : ''}</span>
          <span className="text-xl font-bold tabular-nums text-[#E7EEF6] sm:text-3xl">{spot.speed ?? '—'}</span>
          <span className="text-[9px] text-[#8098B3] sm:text-[11px]">km/s</span>
          {spot.gust != null && <span className="text-[9px] text-[#C9D6E4] sm:mt-0.5 sm:text-xs">hamle <b className="tabular-nums">{spot.gust}</b></span>}
        </div>
      </div>
      <p className={`mt-1 text-center text-[11px] font-semibold sm:mt-2 sm:text-sm ${TONE_TEXT[spot.tone] || 'text-[#8098B3]'}`}>{TONE_LABEL[spot.tone] || ''}</p>
      <p className="text-[10px] text-[#8098B3] sm:text-xs">{dirName(spot.dir)}{spot.temp != null ? ` · ${spot.temp}°C` : ''}</p>
    </div>
  )
}

function WindCell({ speed, gust, dir }: { speed: number | null; gust?: number | null; dir: number | null }) {
  const c = windColor(Math.max(speed ?? 0, gust ?? 0))
  return (
    <div className="flex h-12 flex-col items-center justify-center rounded-md" style={{ background: c.bg, color: c.fg }}>
      <div className="flex items-center gap-1 text-sm font-bold tabular-nums">
        <Arrow deg={dir} size={11} />
        {speed ?? '—'}
      </div>
      {gust != null && <div className="text-[10px] opacity-90 tabular-nums">↑{gust}</div>}
    </div>
  )
}

export default function WeatherDisplay({ w }: { w: DisplayWeather }) {
  if (w.mode === 'now' && w.spots) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {w.spots.map(s => <Dial key={s.label} spot={s} />)}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-[#0B1A2C] px-3 py-2.5">
            <p className="text-[11px] uppercase tracking-wide text-[#5F7894]">Genel durum</p>
            <p className={`mt-1 text-lg font-semibold ${TONE_TEXT[w.overall || ''] || ''}`}>{TONE_LABEL[w.overall || ''] || '—'}</p>
          </div>
          <div className="rounded-xl bg-[#0B1A2C] px-3 py-2.5">
            <p className="text-[11px] uppercase tracking-wide text-[#5F7894]">Yağmur ihtimali</p>
            <p className="mt-1 text-lg font-semibold text-[#E7EEF6]">{w.rain != null ? `%${w.rain}` : '—'}</p>
          </div>
          <div className="col-span-2 rounded-xl bg-[#0B1A2C] px-3 py-2.5 sm:col-span-1">
            <p className="text-[11px] uppercase tracking-wide text-[#5F7894]">Model</p>
            <p className="mt-1 text-lg font-semibold text-[#E7EEF6]">{w.model} · {w.time}</p>
          </div>
        </div>
      </div>
    )
  }

  const hours = w.hours || []
  const rows: { label: string; render: (h: (typeof hours)[number]) => JSX.Element }[] = [
    { label: 'Plaj', render: h => <WindCell speed={h.beach.speed} gust={h.beach.gust} dir={h.beach.dir} /> },
    { label: '1900 m', render: h => <WindCell speed={h.t1900.speed} dir={h.t1900.dir} /> },
    { label: '1200 m', render: h => <WindCell speed={h.t1200.speed} dir={h.t1200.dir} /> },
  ]
  return (
    <div className="space-y-4">
      <div className={`rounded-xl px-4 py-3 ${w.bestWindow ? 'bg-[#2DD4BF]/10 text-[#2DD4BF]' : 'bg-[#F87171]/10 text-[#F87171]'}`}>
        <p className="text-[11px] uppercase tracking-wide opacity-80">En uygun saatler (tahmini)</p>
        <p className="text-2xl font-bold">{w.bestWindow || 'Uygun saat görünmüyor'}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-1 text-center">
          <thead>
            <tr>
              <th className="w-16" />
              {hours.map(h => <th key={h.hour} className="text-xs font-medium text-[#8098B3]">{h.hour.slice(0, 2)}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.label}>
                <th className="pr-1 text-left text-xs font-semibold text-[#C9D6E4]">{r.label}</th>
                {hours.map(h => <td key={h.hour}>{r.render(h)}</td>)}
              </tr>
            ))}
            <tr>
              <th className="pr-1 text-left text-xs font-semibold text-[#C9D6E4]">Yağmur</th>
              {hours.map(h => (
                <td key={h.hour} className="text-xs tabular-nums" style={{ color: (h.rain ?? 0) >= 50 ? '#60A5FA' : (h.rain ?? 0) >= 20 ? '#93C5FD' : '#5F7894' }}>
                  {h.rain != null ? `%${h.rain}` : '—'}
                </td>
              ))}
            </tr>
            <tr>
              <th className="pr-1 text-left text-xs font-semibold text-[#C9D6E4]">Durum</th>
              {hours.map(h => (
                <td key={h.hour}>
                  <span className="mx-auto block h-3 w-3 rounded-full" style={{ background: TONE_RING[h.tone] }} title={TONE_LABEL[h.tone]} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#8098B3]">
        <span>km/s · ok rüzgârın gittiği yön · ↑ hamle</span>
        {[['<10', 5], ['10–18', 14], ['18–25', 20], ['25–32', 28], ['32+', 40]].map(([l, v]) => {
          const c = windColor(v as number)
          return <span key={l as string} className="rounded px-1.5 py-0.5" style={{ background: c.bg, color: c.fg }}>{l}</span>
        })}
        <span>· {w.model}</span>
      </div>
    </div>
  )
}
