'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Search, Loader2, CheckCircle, X } from 'lucide-react'

const SUGGESTED_KEYWORDS = [
  'paragliding oludeniz',
  'tandem paragliding turkey',
  'oludeniz paragliding price',
  'babadag paragliding',
  'paragliding fethiye',
  'blue lagoon paragliding',
  'paragliding turkey booking',
]

export default function CreateGoogleCampaignPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Campaign fields
  const [campaignName, setCampaignName] = useState('Atmos Paragliding — ')
  const [campaignType, setCampaignType] = useState<'SEARCH' | 'DISPLAY'>('SEARCH')
  const [dailyBudget, setDailyBudget] = useState('200')
  const [cpcBid, setCpcBid] = useState('8')
  const [keywords, setKeywords] = useState<string[]>(['paragliding oludeniz', 'tandem paragliding turkey'])
  const [kwInput, setKwInput] = useState('')

  function addKeyword(kw: string) {
    const trimmed = kw.trim()
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords(prev => [...prev, trimmed])
    }
    setKwInput('')
  }

  function removeKeyword(kw: string) {
    setKeywords(prev => prev.filter(k => k !== kw))
  }

  async function handleCreate() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/google-ads', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_campaign',
          name: campaignName,
          campaign_type: campaignType,
          daily_budget_try: parseInt(dailyBudget),
          cpc_bid_try: parseInt(cpcBid),
          keywords: campaignType === 'SEARCH' ? keywords : [],
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setSuccess(true)
      setTimeout(() => router.push('/admin/google-ads'), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto mt-16 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Kampanya Oluşturuldu!</h2>
        <p className="text-slate-500">PAUSED olarak oluşturuldu. Google Ads panelinden aktif edebilirsin.</p>
        <p className="text-slate-400 text-sm mt-2">Yönlendiriliyor...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/google-ads" className="text-slate-400 hover:text-slate-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Search className="w-6 h-6 text-green-600" />
            Yeni Google Kampanyası
          </h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          ❌ {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">

        {/* Kampanya adı */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Kampanya Adı</label>
          <input
            type="text"
            value={campaignName}
            onChange={e => setCampaignName(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Kampanya tipi */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Kampanya Tipi</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setCampaignType('SEARCH')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                campaignType === 'SEARCH' ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-xl mb-1">🔍</div>
              <div className="font-semibold text-slate-900 text-sm">Arama (Search)</div>
              <div className="text-xs text-slate-500 mt-0.5">Google'da arama yapanlara göster</div>
            </button>
            <button
              onClick={() => setCampaignType('DISPLAY')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                campaignType === 'DISPLAY' ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-xl mb-1">🖼️</div>
              <div className="font-semibold text-slate-900 text-sm">Görsel (Display)</div>
              <div className="text-xs text-slate-500 mt-0.5">Sitelerde banner olarak göster</div>
            </button>
          </div>
        </div>

        {/* Bütçe */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Günlük Bütçe (₺)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₺</span>
              <input
                type="number"
                min="50"
                value={dailyBudget}
                onChange={e => setDailyBudget(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              ~{Math.round(parseInt(dailyBudget || '0') * 30).toLocaleString('tr-TR')} ₺/ay
            </p>
          </div>
          {campaignType === 'SEARCH' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Maks. TBM (₺)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₺</span>
                <input
                  type="number"
                  min="1"
                  value={cpcBid}
                  onChange={e => setCpcBid(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Tıklama başına max ödeme</p>
            </div>
          )}
        </div>

        {/* Keywords — sadece Search */}
        {campaignType === 'SEARCH' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Anahtar Kelimeler
              <span className="text-slate-400 font-normal ml-1">({keywords.length} kelime)</span>
            </label>

            {/* Mevcut keywordler */}
            <div className="flex flex-wrap gap-2 mb-3">
              {keywords.map(kw => (
                <span
                  key={kw}
                  className="flex items-center gap-1.5 bg-green-100 text-green-800 text-xs font-medium px-3 py-1.5 rounded-full"
                >
                  {kw}
                  <button onClick={() => removeKeyword(kw)} className="hover:text-green-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={kwInput}
                onChange={e => setKwInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addKeyword(kwInput) } }}
                placeholder="Kelime yaz, Enter'a bas..."
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={() => addKeyword(kwInput)}
                className="px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Ekle
              </button>
            </div>

            {/* Önerilen keywordler */}
            <div className="mt-3">
              <p className="text-xs text-slate-400 mb-2">Önerilen kelimeler:</p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_KEYWORDS.filter(kw => !keywords.includes(kw)).map(kw => (
                  <button
                    key={kw}
                    onClick={() => addKeyword(kw)}
                    className="text-xs bg-slate-100 hover:bg-green-100 hover:text-green-700 text-slate-600 px-3 py-1 rounded-full transition-colors"
                  >
                    + {kw}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Display info */}
        {campaignType === 'DISPLAY' && (
          <div className="bg-purple-50 rounded-xl p-4 text-sm text-purple-700">
            <p className="font-medium mb-1">📍 Hedef Kitle</p>
            <p className="text-xs text-purple-600">
              Türkiye, İngiltere, Almanya, Hollanda, Fransa, ABD · Yaş 22-55 · Paragliding & Seyahat ilgisi
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleCreate}
          disabled={loading || !campaignName.trim() || parseInt(dailyBudget) < 50 || (campaignType === 'SEARCH' && keywords.length === 0)}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-xl font-semibold transition-colors"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Oluşturuluyor...</> : 'Kampanyayı Oluştur ✓'}
        </button>
      </div>
    </div>
  )
}
