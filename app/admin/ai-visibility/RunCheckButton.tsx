'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw, Loader2, CheckCircle, XCircle } from 'lucide-react'

export default function RunCheckButton() {
  const router = useRouter()
  const [state, setState] = useState<'idle' | 'running' | 'success' | 'error'>('idle')
  const [result, setResult] = useState<any>(null)

  async function handleRun() {
    if (state === 'running') return
    setState('running')
    setResult(null)

    try {
      const res = await fetch('/api/cron/ai-visibility-check', {
        method: 'GET',
        credentials: 'include',
      })
      const data = await res.json()

      if (res.ok) {
        setState('success')
        setResult(data)
        setTimeout(() => {
          router.refresh()
          setState('idle')
        }, 4000)
      } else {
        setState('error')
        setResult(data)
        setTimeout(() => setState('idle'), 6000)
      }
    } catch (err: any) {
      setState('error')
      setResult({ error: err.message })
      setTimeout(() => setState('idle'), 6000)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleRun}
        disabled={state === 'running'}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm ${
          state === 'running'
            ? 'bg-violet-400 text-white cursor-not-allowed'
            : state === 'success'
            ? 'bg-emerald-500 text-white'
            : state === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-violet-600 hover:bg-violet-700 text-white'
        }`}
      >
        {state === 'running' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Kontrol ediliyor...
          </>
        ) : state === 'success' ? (
          <>
            <CheckCircle className="w-4 h-4" />
            Tamamlandı
          </>
        ) : state === 'error' ? (
          <>
            <XCircle className="w-4 h-4" />
            Hata
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4" />
            Şimdi Kontrol Et
          </>
        )}
      </button>

      {state === 'success' && result && (
        <p className="text-xs text-slate-500 max-w-xs text-right">
          {result.checkedQueries} sorgu kontrol edildi · {result.gapsFound} gap bulundu · {result.suggestionsAdded} yeni öneri
        </p>
      )}

      {state === 'error' && result && (
        <p className="text-xs text-red-500 max-w-xs text-right">
          {result.error || 'Bilinmeyen hata'}
        </p>
      )}
    </div>
  )
}
