'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Loader2, RefreshCw, FileEdit } from 'lucide-react'

type QueryRow = {
  id: string
  query: string
  source: string
  active: boolean
  created_at: string
  last_checked_at: string | null
  latestChecks?: Record<string, any>
  gsc: { clicks: number; impressions: number; position: number } | null
}

function StatusPill({ check }: { check: any }) {
  if (!check) return <span className="text-xs text-slate-300">—</span>
  if (check.error) {
    return <span className="text-xs text-red-500" title={check.error}>hata</span>
  }
  if (check.mentioned) {
    return <span className="text-xs text-emerald-600 font-medium">görünüyor{check.position ? ` (#${check.position})` : ''}</span>
  }
  return <span className="text-xs text-slate-400">görünmüyor</span>
}

type GscDiagnostics = {
  error: string | null
  daysUsed: number
  totalDistinctQueries: number
  topRealQueries: { query: string; clicks: number; impressions: number; position: number }[]
}

export default function QueryList() {
  const router = useRouter()
  const [queries, setQueries] = useState<QueryRow[] | null>(null)
  const [gscDiag, setGscDiag] = useState<GscDiagnostics | null>(null)
  const [showGscPanel, setShowGscPanel] = useState(false)
  const [gscDays, setGscDays] = useState(28)
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(false)
  const [newKeywords, setNewKeywords] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [suggesting, setSuggesting] = useState<string | null>(null)

  async function handleSuggest(query: string, reason: string) {
    setSuggesting(query)
    try {
      const res = await fetch('/api/admin/ai-visibility', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'suggest_topic', query, reason }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Bilinmeyen hata')
      router.refresh()
      alert(`"${query}" için blog önerisi oluşturuldu — sayfanın üstündeki "Onay Bekleyen İçerik Önerileri" bölümünde onaylayabilirsin.`)
    } catch (err: any) {
      alert(`Hata: ${err.message}`)
    } finally {
      setSuggesting(null)
    }
  }

  const load = useCallback(async (days?: number) => {
    setLoading(true)
    try {
      const useDays = days ?? gscDays
      const res = await fetch(`/api/admin/ai-visibility?days=${useDays}`, { credentials: 'include' })
      const data = await res.json()
      setQueries(data.queries || [])
      setGscDiag(data.gscDiagnostics || null)
    } finally {
      setLoading(false)
    }
  }, [gscDays])

  useEffect(() => {
    load()
  }, [load])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const list = newKeywords.split('\n').map(k => k.trim()).filter(Boolean)
    if (list.length === 0) return
    setAdding(true)
    try {
      const res = await fetch('/api/admin/ai-visibility', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add_queries', queries: list }),
      })
      if (!res.ok) throw new Error(await res.text())
      setNewKeywords('')
      setShowAddForm(false)
      await load()
    } catch (err: any) {
      alert(`Hata: ${err.message}`)
    } finally {
      setAdding(false)
    }
  }

  // Gorunenler (Perplexity/ChatGPT'te mentioned=true) en usте, hic kontrol edilmeyenler en altta
  const sortedQueries = useMemo(() => {
    if (!queries) return queries
    const score = (q: QueryRow) => {
      const pplx = q.latestChecks?.perplexity
      const oai = q.latestChecks?.chatgpt
      let s = 0
      if (pplx?.mentioned) s += 2
      if (oai?.mentioned) s += 2
      if (!pplx && !oai) s -= 1 // hic kontrol edilmemis olanlar en alta
      return s
    }
    return [...queries].sort((a, b) => score(b) - score(a))
  }, [queries])

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
        <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full" />
          Takip Edilen Kelimeler ({queries?.length ?? '…'})
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => load()}
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors"
            title="Yenile"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowGscPanel(v => !v)}
            className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-xs font-medium transition-colors"
          >
            Google'da Gerçek Aramalar
          </button>
          <button
            onClick={() => setShowAddForm(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Kelime Ekle
          </button>
        </div>
      </div>

      {showGscPanel && (
        <div className="px-6 py-4 border-b border-slate-100 bg-teal-50/50">
          <div className="flex items-center justify-between gap-3 mb-2">
            <p className="text-xs text-slate-600">
              Search Console'da son <strong>{gscDiag?.daysUsed ?? gscDays} gün</strong>de sitemizin en az 1 kez gösterildiği
              gerçek arama terimleri (toplam {gscDiag?.totalDistinctQueries ?? 0} farklı sorgu — derinlik sınırı yok,
              sınır GSC'nin hangi sorguları rapor ettiği: sadece gerçekten gösterim almış olanlar).
            </p>
            <div className="flex items-center gap-1 shrink-0">
              {[28, 90, 180, 365].map(d => (
                <button
                  key={d}
                  onClick={() => { setGscDays(d); load(d) }}
                  className={`text-xs px-2 py-1 rounded-md transition-colors ${
                    (gscDiag?.daysUsed ?? gscDays) === d
                      ? 'bg-teal-600 text-white'
                      : 'bg-white border border-teal-200 text-teal-700 hover:bg-teal-100'
                  }`}
                >
                  {d}g
                </button>
              ))}
            </div>
          </div>
          {gscDiag?.error && (
            <p className="text-xs text-red-500 mb-2">GSC hatası: {gscDiag.error}</p>
          )}
          {gscDiag && gscDiag.topRealQueries.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {gscDiag.topRealQueries.map(q => (
                <span key={q.query} className="text-xs bg-white border border-teal-200 text-teal-800 px-2 py-1 rounded-lg">
                  {q.query} <span className="text-teal-400">· #{q.position.toFixed(1)} · {q.impressions} gösterim</span>
                </span>
              ))}
            </div>
          ) : !gscDiag?.error ? (
            <p className="text-xs text-slate-400">Bu aralıkta hiç sorgu verisi yok — site şu an çok az gösterim alıyor.</p>
          ) : null}
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleAdd} className="px-6 py-4 border-b border-slate-100 bg-blue-50/50 space-y-3">
          <label className="block text-xs font-medium text-slate-600">
            Her satıra bir anahtar kelime (örn. "paragliding oludeniz turkey")
          </label>
          <textarea
            value={newKeywords}
            onChange={e => setNewKeywords(e.target.value)}
            rows={5}
            placeholder={'paragliding oludeniz turkey\noludeniz paragliding\ntandem paragliding turkey'}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={adding}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg text-xs font-medium transition-colors"
            >
              {adding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Ekle
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-slate-500 hover:text-slate-700 text-xs font-medium"
            >
              İptal
            </button>
          </div>
        </form>
      )}

      {queries === null ? (
        <div className="p-8 text-center text-slate-400 text-sm">Yükleniyor…</div>
      ) : queries.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-sm">Henüz takip edilen kelime yok.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                <th className="px-6 py-2.5 font-medium">Kelime</th>
                <th className="px-4 py-2.5 font-medium">Perplexity</th>
                <th className="px-4 py-2.5 font-medium">ChatGPT</th>
                <th className="px-4 py-2.5 font-medium">Google (GSC)</th>
                <th className="px-4 py-2.5 font-medium">Son kontrol</th>
                <th className="px-4 py-2.5 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {(sortedQueries || []).map(q => {
                const pplx = q.latestChecks?.perplexity
                const oai = q.latestChecks?.chatgpt
                const isOpen = expanded === q.id
                return (
                  <>
                    <tr
                      key={q.id}
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => setExpanded(isOpen ? null : q.id)}
                    >
                      <td className="px-6 py-3">
                        <span className="font-medium text-slate-800">{q.query}</span>
                        {q.source === 'manual' && (
                          <span className="ml-2 text-[10px] uppercase tracking-wide text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">manuel</span>
                        )}
                        {q.source === 'gsc' && (
                          <span className="ml-2 text-[10px] uppercase tracking-wide text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">gsc</span>
                        )}
                      </td>
                      <td className="px-4 py-3"><StatusPill check={pplx} /></td>
                      <td className="px-4 py-3"><StatusPill check={oai} /></td>
                      <td className="px-4 py-3">
                        {q.gsc ? (
                          <span className="text-xs text-slate-600">
                            #{q.gsc.position.toFixed(1)} · {q.gsc.clicks} tık · {q.gsc.impressions} gösterim
                          </span>
                        ) : (
                          <span className="text-xs text-slate-300">gösterim yok</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">
                        {q.last_checked_at ? new Date(q.last_checked_at).toLocaleString('tr-TR') : 'henüz kontrol edilmedi'}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            const gscNote = q.gsc ? `Google'da #${q.gsc.position.toFixed(1)}. sırada` : 'Google\'da gösterim yok'
                            handleSuggest(q.query, `Manuel olarak işaretlendi — ${gscNote}.`)
                          }}
                          disabled={suggesting === q.query}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                          title="Bu kelime için blog önerisi oluştur"
                        >
                          {suggesting === q.query ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileEdit className="w-3.5 h-3.5" />}
                          Blog öner
                        </button>
                      </td>
                    </tr>
                    {isOpen && (pplx || oai) && (
                      <tr key={`${q.id}-detail`} className="bg-slate-50/70">
                        <td colSpan={6} className="px-6 py-4 space-y-3">
                          {pplx && (
                            <div>
                              <p className="text-xs font-semibold text-slate-600 mb-1">Perplexity cevabı{pplx.competitors?.length ? ` · rakipler: ${pplx.competitors.join(', ')}` : ''}</p>
                              <p className="text-xs text-slate-500 whitespace-pre-wrap leading-relaxed">
                                {pplx.error || pplx.raw_response || '—'}
                              </p>
                            </div>
                          )}
                          {oai && (
                            <div>
                              <p className="text-xs font-semibold text-slate-600 mb-1">ChatGPT cevabı{oai.competitors?.length ? ` · rakipler: ${oai.competitors.join(', ')}` : ''}</p>
                              <p className="text-xs text-slate-500 whitespace-pre-wrap leading-relaxed">
                                {oai.error || oai.raw_response || '—'}
                              </p>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
