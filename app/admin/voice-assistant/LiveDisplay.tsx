'use client'

import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Display } from '@/lib/neslihan/tools'
import WeatherDisplay from './WeatherDisplay'

const TONE: Record<string, string> = {
  good: 'text-[#2DD4BF]',
  warn: 'text-[#FBBF24]',
  bad: 'text-[#F87171]',
}

// Renders one tool result on Neslihan's live screen.
export default function LiveDisplay({ display, compact = false }: { display: Display; compact?: boolean }) {
  const { title, subtitle, stats, chart, table, embed, weather, note } = display
  return (
    <section className={`rounded-2xl border border-[#1E3654] bg-[#0F2238] ${compact ? 'p-4' : 'p-5 md:p-6'}`}>
      <header className="mb-4">
        <h3 className={`font-semibold text-[#E7EEF6] ${compact ? 'text-sm' : 'text-lg'}`}>{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-[#8098B3]">{subtitle}</p>}
      </header>

      {stats && stats.length > 0 && (
        <div className={`grid gap-3 ${stats.length >= 4 ? 'grid-cols-2 md:grid-cols-4' : stats.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2'}`}>
          {stats.map((s, i) => (
            <div key={i} className="rounded-xl bg-[#0B1A2C] px-3 py-2.5">
              <p className="truncate text-[11px] uppercase tracking-wide text-[#5F7894]">{s.label}</p>
              <p className={`mt-1 font-semibold tabular-nums ${compact ? 'text-base' : 'text-xl'} ${s.tone ? TONE[s.tone] : 'text-[#E7EEF6]'}`}>{s.value}</p>
              {s.hint && <p className="mt-0.5 truncate text-[11px] text-[#8098B3]">{s.hint}</p>}
            </div>
          ))}
        </div>
      )}

      {weather && (compact
        ? <p className="text-sm text-[#C9D6E4]">{weather.mode === 'now' ? weather.spots?.map(s => `${s.label}: ${s.speed ?? '—'} km/s`).join(' · ') : `En uygun: ${weather.bestWindow || 'yok'}`}</p>
        : <WeatherDisplay w={weather} />)}

      {!compact && chart && chart.points.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-xs text-[#8098B3]">{chart.label}</p>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chart.kind === 'line' ? (
                <LineChart data={chart.points} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <XAxis dataKey="x" tick={{ fill: '#5F7894', fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={24} />
                  <YAxis tick={{ fill: '#5F7894', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: '#0B1A2C', border: '1px solid #1E3654', borderRadius: 8, color: '#E7EEF6' }} />
                  <Line type="monotone" dataKey="y" name={chart.label} stroke="#F97316" strokeWidth={2} dot={false} />
                </LineChart>
              ) : (
                <BarChart data={chart.points} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <XAxis dataKey="x" tick={{ fill: '#5F7894', fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={8} />
                  <YAxis tick={{ fill: '#5F7894', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip cursor={{ fill: '#1E3654' }} contentStyle={{ background: '#0B1A2C', border: '1px solid #1E3654', borderRadius: 8, color: '#E7EEF6' }} />
                  <Bar dataKey="y" name={chart.label} fill="#F97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {!compact && table && table.rows.length > 0 && (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            {table.columns.some(Boolean) && <thead>
              <tr className="border-b border-[#1E3654] text-[11px] uppercase tracking-wide text-[#5F7894]">
                {table.columns.map((c, i) => <th key={i} className="py-2 pr-4 font-medium">{c}</th>)}
              </tr>
            </thead>}
            <tbody>
              {table.rows.map((r, i) => (
                <tr key={i} className="border-b border-[#1E3654]/60 last:border-0">
                  {r.map((cell, j) => <td key={j} className="whitespace-pre-wrap py-2 pr-4 align-top text-[#C9D6E4]">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!compact && embed && (
        <div className="mt-5 overflow-hidden rounded-xl border border-[#1E3654]">
          <iframe src={embed.url} title={embed.title} className="h-[420px] w-full" loading="lazy" />
        </div>
      )}

      {note && <p className={`mt-4 whitespace-pre-wrap break-words text-sm text-[#C9D6E4] ${compact ? 'line-clamp-3' : 'max-h-[60vh] overflow-y-auto'}`}>{note}</p>}
    </section>
  )
}
