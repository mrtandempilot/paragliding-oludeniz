'use client'

import { useMemo, useState } from 'react'
import { Search, TrendingUp, TrendingDown } from 'lucide-react'

interface DailyRow {
  date: string
  impressions: number
  clicks: number
}

type Period = 'day' | 'week' | 'month'

const PERIOD_LABELS: Record<Period, string> = {
  day: 'Günlük',
  week: 'Haftalık',
  month: 'Aylık',
}

const PERIOD_TITLES: Record<Period, string> = {
  day: 'Son Gün (önceki güne göre)',
  week: 'Son 7 Gün (önceki 7 güne göre)',
  month: 'Son 28 Gün (önceki 28 güne göre)',
}

const PERIOD_DAYS: Record<Period, number> = { day: 1, week: 7, month: 28 }

function fmt(n: number) {
  return n.toLocaleString('tr-TR', { maximumFractionDigits: 0 })
}

function sumRange(rows: DailyRow[], fromEnd: number, span: number) {
  // rows sorted ascending by date; fromEnd=0 means the most recent `span` rows,
  // fromEnd=span means the `span` rows before that
  const end = rows.length - fromEnd
  const start = end - span
  const slice = rows.slice(Math.max(0, start), Math.max(0, end))
  return slice.reduce(
    (acc, r) => ({ impressions: acc.impressions + r.impressions, clicks: acc.clicks + r.clicks }),
    { impressions: 0, clicks: 0 }
  )
}

function Delta({ current, previous }: { current: number; previous: number }) {
  if (previous === 0) return null
  const pct = ((current - previous) / previous) * 100
  const up = pct >= 0
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${up ? 'text-green-600' : 'text-red-600'}`}>
      {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {Math.abs(pct).toFixed(0)}%
    </span>
  )
}

export default function PeriodSummary({ rows }: { rows: DailyRow[] }) {
  const [period, setPeriod] = useState<Period>('week')

  const { current, previous } = useMemo(() => {
    const span = PERIOD_DAYS[period]
    return {
      current: sumRange(rows, 0, span),
      previous: sumRange(rows, span, span),
    }
  }, [rows, period])

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wide">
          <Search className="w-3.5 h-3.5" /> {PERIOD_TITLES[period]}
        </div>
        <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5">
          {(['day', 'week', 'month'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                period === p ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">{fmt(current.impressions)}</span>
            <Delta current={current.impressions} previous={previous.impressions} />
          </div>
          <div className="text-xs text-slate-500">Gösterim</div>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900">{fmt(current.clicks)}</span>
            <Delta current={current.clicks} previous={previous.clicks} />
          </div>
          <div className="text-xs text-slate-500">Tıklama</div>
        </div>
      </div>
    </div>
  )
}
