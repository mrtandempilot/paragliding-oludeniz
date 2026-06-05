'use client'

import { useState } from 'react'
import { Search, Loader2, Trophy, ExternalLink, Megaphone, Globe } from 'lucide-react'

interface SerpResult {
  position: number
  title: string
  domain: string
  description: string
  link: string
  isMine: boolean
}

interface SerpData {
  ads: SerpResult[]
  organic: SerpResult[]
  keyword: string
  configured?: boolean
  error?: string
}

const QUICK_KEYWORDS = [
  'paragliding oludeniz',
  'tandem paragliding oludeniz',
  'babadag paragliding',
  'paragliding fethiye',
  'oludeniz paragliding price',
]

export default function CompetitorAnalysis() {
  const [keyword, setKeyword] = useState('paragliding oludeniz')
  const [data, setData] = useState<SerpData | null>(null)
  const [loading, setLoading] = useState(false)

  async function search(kw?: string) {
    const q = kw || keyword
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/serp-check?keyword=${encodeURIComponent(q)}`, {
        credentials: 'include',
      })
      const json = await res.json()
      setData(json)
    } finally {
      setLoading(false)
    }
  }

  function handleQuick(kw: string) {
    setKeyword(kw)
    search(kw)
  }

  if (data?.configured === false) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">🔑</div>
        <h3 className="font-bold text-amber-900 mb-2">SerpAPI bağlı değil</h3>
        <p className="text-amber-700 text-sm mb-4">
          Canlı rakip analizi için ücretsiz bir API key al:
        </p>
        <a
          href="https://serpapi.com/users/sign_up"
          target="_blank"
          className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors mb-4"
        >
          SerpAPI'ye kaydol (100 arama/ay ücretsiz) →
        </a>
        <p className="text-amber-600 text-xs">Sonra Vercel'e <code>SERP_API_KEY=xxx</code> ekle</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Search className="w-4 h-4 text-green-600" />
          Keyword Ara — Kim Reklam Veriyor?
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            placeholder="paragliding oludeniz"
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={() => search()}
            disabled={loading}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Ara
          </button>
        </div>

        {/* Quick keywords */}
        <div className="flex flex-wrap gap-2 mt-3">
          {QUICK_KEYWORDS.map(kw => (
            <button
              key={kw}
              onClick={() => handleQuick(kw)}
              className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-green-100 hover:text-green-700 text-slate-600 rounded-lg transition-colors"
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {data?.error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">
          ❌ {data.error}
        </div>
      )}

      {data && !data.error && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Paid Ads */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-500" />
                Google Ads Sıralaması
              </h3>
              <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">
                {data.ads.length} reklam
              </span>
            </div>

            {data.ads.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                Bu keyword için şu an aktif reklam yok
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {data.ads.map(ad => (
                  <div
                    key={ad.position}
                    className={`px-6 py-4 ${ad.isMine ? 'bg-green-50 border-l-4 border-green-500' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                            ad.position === 1 ? 'bg-amber-400 text-white' :
                            ad.position === 2 ? 'bg-slate-300 text-slate-700' :
                            'bg-slate-200 text-slate-600'
                          }`}>
                            {ad.position}
                          </span>
                          {ad.isMine && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                              <Trophy className="w-3 h-3" /> Senin siten
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-blue-700 truncate">{ad.title}</p>
                        <p className="text-xs text-green-700 truncate">{ad.domain}</p>
                        {ad.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ad.description}</p>
                        )}
                      </div>
                      <a href={ad.link} target="_blank" className="text-slate-400 hover:text-slate-600 flex-shrink-0">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Organic */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" />
                Organik Sıralama
              </h3>
              <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                İlk 10 sonuç
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {data.organic.map(r => (
                <div
                  key={r.position}
                  className={`px-6 py-4 ${r.isMine ? 'bg-green-50 border-l-4 border-green-500' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                          r.position === 1 ? 'bg-amber-400 text-white' :
                          r.position <= 3 ? 'bg-green-400 text-white' :
                          'bg-slate-200 text-slate-600'
                        }`}>
                          {r.position}
                        </span>
                        {r.isMine && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                            <Trophy className="w-3 h-3" /> Senin siten
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-blue-700 truncate">{r.title}</p>
                      <p className="text-xs text-green-700 truncate">{r.domain}</p>
                      {r.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{r.description}</p>
                      )}
                    </div>
                    <a href={r.link} target="_blank" className="text-slate-400 hover:text-slate-600 flex-shrink-0">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
