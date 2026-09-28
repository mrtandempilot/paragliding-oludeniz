'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Loader2 } from 'lucide-react'

export default function SuggestionCard({ suggestion }: { suggestion: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)

  async function act(action: 'approve' | 'reject') {
    setLoading(action)
    try {
      const res = await fetch('/api/admin/ai-visibility', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: suggestion.id, action }),
      })
      if (!res.ok) throw new Error(await res.text())
      router.refresh()
    } catch (err: any) {
      alert(`Hata: ${err.message}`)
      setLoading(null)
    }
  }

  return (
    <div className="px-6 py-4 flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-900">{suggestion.suggested_topic}</p>
        <p className="text-xs text-slate-500 mt-1">Sorgu: “{suggestion.query}”</p>
        {suggestion.gap_reason && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1 mt-1.5 inline-block">
            {suggestion.gap_reason}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => act('approve')}
          disabled={loading !== null}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white rounded-lg text-xs font-medium transition-colors"
        >
          {loading === 'approve' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          Onayla
        </button>
        <button
          onClick={() => act('reject')}
          disabled={loading !== null}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-600 rounded-lg text-xs font-medium transition-colors"
        >
          {loading === 'reject' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
          Reddet
        </button>
      </div>
    </div>
  )
}
