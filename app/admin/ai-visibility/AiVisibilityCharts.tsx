'use client'

import { BarChart3, LineChart as LineChartIcon } from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

interface BySource {
  [source: string]: { mentioned: number; missed: number }
}

interface TrendPoint {
  date: string
  perplexity?: number | null
  chatgpt?: number | null
  google?: number | null
}

const SOURCE_LABELS: Record<string, string> = {
  perplexity: 'Perplexity',
  chatgpt: 'ChatGPT',
  google: 'Google (Canlı)',
}

const SOURCE_COLORS: Record<string, string> = {
  perplexity: '#7c3aed',
  chatgpt: '#16a34a',
  google: '#2563eb',
}

function trDate(d: string) {
  try {
    return new Date(d).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })
  } catch {
    return d
  }
}

export default function AiVisibilityCharts({ bySource, trend }: { bySource: BySource; trend: TrendPoint[] }) {
  const sources = ['perplexity', 'chatgpt', 'google'] as const

  const barData = sources
    .filter(s => bySource[s])
    .map(s => ({
      name: SOURCE_LABELS[s],
      Görünüyor: bySource[s].mentioned,
      Görünmüyor: bySource[s].missed,
    }))

  const trendData = trend.map(t => ({ ...t, date: trDate(t.date) }))
  const hasTrend = trendData.length > 1

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-violet-600" />
          <h2 className="font-bold text-slate-900 text-sm">Kaynak Bazında Görünürlük</h2>
        </div>
        {barData.length === 0 ? (
          <div className="h-56 flex items-center justify-center text-slate-400 text-sm text-center px-4">
            Henüz kontrol verisi yok
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={35} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Görünüyor" fill="#16a34a" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Görünmüyor" fill="#e11d48" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <LineChartIcon className="w-4 h-4 text-blue-600" />
          <h2 className="font-bold text-slate-900 text-sm">Görünürlük Trendi (%)</h2>
        </div>
        {!hasTrend ? (
          <div className="h-56 flex items-center justify-center text-slate-400 text-sm text-center px-4">
            Trend grafiği için birden fazla günün kontrol verisi gerekiyor
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                width={35}
                domain={[0, 100]}
                tickFormatter={(v) => `%${v}`}
              />
              <Tooltip
                formatter={(value: any, name: any) => [value === null || value === undefined ? '—' : `%${value}`, SOURCE_LABELS[name] || name]}
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                formatter={(value: string) => SOURCE_LABELS[value] || value}
              />
              {sources.map(s => (
                <Line
                  key={s}
                  type="monotone"
                  dataKey={s}
                  name={s}
                  stroke={SOURCE_COLORS[s]}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
