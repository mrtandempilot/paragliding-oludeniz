export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Radar, ArrowLeft } from 'lucide-react'
import SuggestionCard from './SuggestionCard'
import RunCheckButton from './RunCheckButton'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function sourceLabel(source: string) {
  if (source === 'chatgpt') return 'ChatGPT'
  if (source === 'perplexity') return 'Perplexity'
  return source
}

export default async function AiVisibilityPage() {
  const [{ data: suggestions }, { data: checks }, { data: queries }] = await Promise.all([
    supabase.from('ai_topic_suggestions').select('*').order('created_at', { ascending: false }).limit(50),
    supabase.from('ai_visibility_checks').select('*').order('checked_at', { ascending: false }).limit(100),
    supabase.from('ai_visibility_queries').select('*').eq('active', true).order('created_at', { ascending: false }).limit(50),
  ])

  const allSuggestions = suggestions || []
  const pending = allSuggestions.filter(s => s.status === 'pending')
  const reviewed = allSuggestions.filter(s => s.status !== 'pending')

  const allChecks = checks || []
  const latestCheckedAt = allChecks[0]?.checked_at
  const bySource: Record<string, { mentioned: number; missed: number }> = {}
  for (const c of allChecks) {
    if (!c.source) continue
    if (!bySource[c.source]) bySource[c.source] = { mentioned: 0, missed: 0 }
    if (c.mentioned) bySource[c.source].mentioned++
    else bySource[c.source].missed++
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-slate-400 hover:text-slate-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <Radar className="w-6 h-6 text-violet-600" />
              AI Görünürlük
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Perplexity ve ChatGPT'te günlük marka görünürlük kontrolü — {pending.length} onay bekleyen öneri
            </p>
          </div>
        </div>
        <RunCheckButton />
      </div>

      {/* Ozet kartlari */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-xs text-slate-400 mb-1">Takip edilen sorgu</p>
          <p className="text-2xl font-bold text-slate-900">{(queries || []).length}</p>
        </div>
        {(['perplexity', 'chatgpt'] as const).map(src => (
          <div key={src} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <p className="text-xs text-slate-400 mb-1">{sourceLabel(src)}</p>
            {bySource[src] ? (
              <p className="text-2xl font-bold text-slate-900">
                {bySource[src].mentioned}<span className="text-slate-300"> / </span>{bySource[src].mentioned + bySource[src].missed}
                <span className="text-xs text-slate-400 font-normal ml-1.5">görünüyor</span>
              </p>
            ) : (
              <p className="text-sm text-slate-400">Henüz veri yok</p>
            )}
          </div>
        ))}
      </div>

      {latestCheckedAt && (
        <p className="text-xs text-slate-400">
          Son kontrol: {new Date(latestCheckedAt).toLocaleString('tr-TR')}
        </p>
      )}

      {/* Bekleyen oneriler */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-violet-50">
          <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-violet-500 rounded-full" />
            Onay Bekleyen İçerik Önerileri ({pending.length})
          </h2>
        </div>

        {pending.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-sm">
            Bekleyen öneri yok. Günlük kontrol AI cevaplarında görünmediğimiz sorguları bulunca burada listelenecek.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pending.map(s => (
              <SuggestionCard key={s.id} suggestion={s} />
            ))}
          </div>
        )}
      </div>

      {/* Gecmis kararlar */}
      {reviewed.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h2 className="font-bold text-slate-500 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-slate-400 rounded-full" />
              Geçmiş Kararlar ({reviewed.length})
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {reviewed.map(s => (
              <div key={s.id} className="px-6 py-4 flex items-center justify-between gap-4 opacity-70">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-700">{s.suggested_topic}</p>
                  <p className="text-xs text-slate-400 mt-0.5">“{s.query}”</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  s.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {s.status === 'approved' ? 'onaylandı' : 'reddedildi'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
