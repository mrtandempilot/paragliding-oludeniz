'use client'

import { useMemo, useState } from 'react'
import { TrendingUp } from 'lucide-react'

interface DailyRow {
  date: string
  impressions: number
}

type Granularity = 'day' | 'week' | 'month'

const GRANULARITY_LABELS: Record<Granularity, string> = {
  day: 'Günlük',
  week: 'Haftalık',
  month: 'Aylık',
}

function fmt(n: number) {
  return n.toLocaleString('tr-TR', { maximumFractionDigits: 0 })
}

function bucketRows(rows: DailyRow[], granularity: Granularity) {
  if (granularity === 'day') {
    // last 45 days of raw daily data, otherwise the bars get unreadably thin
    return rows.slice(-45).map(r => ({ key: r.date, impressions: r.impressions }))
  }

  const buckets = new Map<string, number>()
  for (const row of rows) {
    const date = new Date(row.date)
    let key: string
    if (granularity === 'week') {
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      key = weekStart.toISOString().slice(0, 10)
    } else {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
    }
    buckets.set(key, (buckets.get(key) || 0) + (row.impressions || 0))
  }
  return Array.from(buckets.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, impressions]) => ({ key, impressions }))
}

function formatLabel(key: string, granularity: Granularity) {
  const date = new Date(key)
  if (granularity === 'month') {
    return date.toLocaleDateString('tr-TR', { month: 'short', year: '2-digit' })
  }
  return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })
}

export default function TrendChart({ rows }: { rows: DailyRow[] }) {
  const [granularity, setGranularity] = useState<Granularity>('week')
  const bucketed = useMemo(() => bucketRows(rows, granularity), [rows, granularity])
  const max = Math.max(1, ...bucketed.map(b => b.impressions))
  // thin daily view: skip every-Nth label so text doesn't overlap
  const labelEvery = granularity === 'day' ? 3 : 1

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-5">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wide">
          <TrendingUp className="w-3.5 h-3.5" /> Gösterim Trendi — domain migrasyonu sonrası toparlanma
        </div>
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          {(['day', 'week', 'month'] as Granularity[]).map(g => (
            <button
              key={g}
              onClick={() => setGranularity(g)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                granularity === g
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {GRANULARITY_LABELS[g]}
            </button>
          ))}
        </div>
      </div>

      {bucketed.length > 0 ? (
        <div className="flex items-stretch gap-1 h-32">
          {bucketed.map((b, i) => (
            <div key={b.key} className="flex-1 h-full flex flex-col items-center justify-end group relative">
              <div
                className="w-full bg-indigo-400 rounded-t-md hover:bg-indigo-500 transition-colors"
                style={{ height: `${(b.impressions / max) * 100}%`, minHeight: '2px' }}
                title={`${formatLabel(b.key, granularity)}: ${fmt(b.impressions)} gösterim`}
              />
              {i % labelEvery === 0 && (
                <span className="text-[9px] text-slate-400 mt-1 whitespace-nowrap">
                  {formatLabel(b.key, granularity)}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-slate-400 text-sm py-6 text-center">Veri yok</div>
      )}
    </div>
  )
}
