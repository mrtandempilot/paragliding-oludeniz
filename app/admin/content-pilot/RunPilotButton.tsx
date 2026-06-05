'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bot, Loader2, CheckCircle, XCircle } from 'lucide-react'

export default function RunPilotButton() {
  const router = useRouter()
  const [state, setState] = useState<'idle' | 'running' | 'success' | 'error'>('idle')
  const [result, setResult] = useState<any>(null)

  async function handleRun() {
    if (state === 'running') return
    setState('running')
    setResult(null)

    try {
      const res = await fetch('/api/agents/orchestrator', {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json()

      if (data.success) {
        setState('success')
        setResult(data)
        // Refresh page data after 2s
        setTimeout(() => {
          router.refresh()
          setState('idle')
        }, 4000)
      } else {
        setState('error')
        setResult(data)
        setTimeout(() => setState('idle'), 5000)
      }
    } catch (err: any) {
      setState('error')
      setResult({ error: err.message })
      setTimeout(() => setState('idle'), 5000)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleRun}
        disabled={state === 'running'}
        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm ${
          state === 'running'
            ? 'bg-purple-400 text-white cursor-not-allowed'
            : state === 'success'
            ? 'bg-green-500 text-white'
            : state === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
      >
        {state === 'running' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Running pipeline...
          </>
        ) : state === 'success' ? (
          <>
            <CheckCircle className="w-4 h-4" />
            Success!
          </>
        ) : state === 'error' ? (
          <>
            <XCircle className="w-4 h-4" />
            Failed
          </>
        ) : (
          <>
            <Bot className="w-4 h-4" />
            Run Now
          </>
        )}
      </button>

      {state === 'running' && (
        <p className="text-xs text-slate-500 animate-pulse">
          SEO → Writing → Image → Instagram (~2 min)
        </p>
      )}

      {state === 'success' && result && (
        <div className="text-right">
          {result.article?.title && (
            <p className="text-xs text-green-600 font-medium">✅ {result.article.title}</p>
          )}
          {result.social?.instagram_post_id && (
            <p className="text-xs text-pink-600">📸 Posted to Instagram</p>
          )}
          {result.total_cost_usd && (
            <p className="text-xs text-slate-400">${Number(result.total_cost_usd).toFixed(4)} cost</p>
          )}
        </div>
      )}

      {state === 'error' && result && (
        <p className="text-xs text-red-500 max-w-xs text-right">
          {result.error || 'Unknown error'}
        </p>
      )}
    </div>
  )
}
