'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Megaphone, Loader2, CheckCircle } from 'lucide-react'

const OBJECTIVES = [
  { value: 'OUTCOME_TRAFFIC', label: 'Trafik', desc: 'Web sitene ziyaretçi çek' },
  { value: 'OUTCOME_AWARENESS', label: 'Farkındalık', desc: 'Marka bilinirliği artır' },
  { value: 'OUTCOME_ENGAGEMENT', label: 'Etkileşim', desc: 'Beğeni, yorum, paylaşım' },
  { value: 'OUTCOME_LEADS', label: 'Lead', desc: 'İletişim formu dolduranlar' },
]

export default function CreateCampaignPage() {
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: campaign, 2: adset, 3: ad
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Step 1 — Campaign
  const [campaignName, setCampaignName] = useState('Atmos Paragliding — ')
  const [objective, setObjective] = useState('OUTCOME_TRAFFIC')
  const [campaignId, setCampaignId] = useState('')

  // Step 2 — Ad Set
  const [adsetName, setAdsetName] = useState('Instagram — Uluslararası')
  const [dailyBudget, setDailyBudget] = useState('150')
  const [includeFacebook, setIncludeFacebook] = useState(false)
  const [adsetId, setAdsetId] = useState('')

  // Step 3 — Ad Creative
  const [adName, setAdName] = useState('Tandem Paragliding Ad')
  const [imageUrl, setImageUrl] = useState('')
  const [caption, setCaption] = useState('🪂 Ölüdeniz\'de hayatının uçuşunu yap! Babadağ\'dan Blue Lagoon\'a süzül. Hemen rezervasyon yap.')
  const [link, setLink] = useState(process.env.NEXT_PUBLIC_SITE_URL || 'https://atmosparagliding.com')

  async function createCampaign() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/meta-ads', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_campaign', name: campaignName, objective }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setCampaignId(data.campaign_id)
      setStep(2)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function createAdSet() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/meta-ads', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_adset',
          name: adsetName,
          campaign_id: campaignId,
          daily_budget_try: parseInt(dailyBudget),
          optimization_goal: 'LINK_CLICKS',
          include_facebook: includeFacebook,
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setAdsetId(data.adset_id)
      setStep(3)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function createAd() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/meta-ads', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_ad',
          name: adName,
          adset_id: adsetId,
          image_url: imageUrl,
          caption,
          link: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://atmosparagliding.com'}`,
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setSuccess(true)
      setTimeout(() => router.push('/admin/meta-ads'), 3000)
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
        <p className="text-slate-500">Kampanya PAUSED durumunda oluşturuldu. Ödeme yöntemi ekledikten sonra başlatabilirsin.</p>
        <p className="text-slate-400 text-sm mt-2">Yönlendiriliyor...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/meta-ads" className="text-slate-400 hover:text-slate-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Megaphone className="w-6 h-6 text-blue-600" />
            Yeni Kampanya
          </h1>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2">
        {['Kampanya', 'Reklam Seti', 'Reklam'].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
              step === i + 1
                ? 'bg-blue-600 text-white'
                : step > i + 1
                ? 'bg-green-100 text-green-700'
                : 'bg-slate-100 text-slate-400'
            }`}>
              <span>{step > i + 1 ? '✓' : i + 1}</span>
              <span>{label}</span>
            </div>
            {i < 2 && <div className="w-6 h-px bg-slate-200" />}
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          ❌ {error}
        </div>
      )}

      {/* Step 1: Campaign */}
      {step === 1 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
          <h2 className="font-bold text-slate-900">1. Kampanya Ayarları</h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Kampanya Adı</label>
            <input
              type="text"
              value={campaignName}
              onChange={e => setCampaignName(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Kampanya Amacı</label>
            <div className="grid grid-cols-2 gap-3">
              {OBJECTIVES.map(obj => (
                <button
                  key={obj.value}
                  onClick={() => setObjective(obj.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    objective === obj.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-semibold text-slate-900 text-sm">{obj.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{obj.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={createCampaign}
            disabled={loading || !campaignName.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Devam Et →
          </button>
        </div>
      )}

      {/* Step 2: Ad Set */}
      {step === 2 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
          <h2 className="font-bold text-slate-900">2. Reklam Seti Ayarları</h2>
          <p className="text-sm text-slate-500">
            Hedef: TR, UK, DE, NL, FR, US · Yaş: 22-55
          </p>

          {/* Platform seçimi */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <p className="text-sm font-medium text-slate-700">Platform</p>

            {/* Instagram — her zaman açık */}
            <div className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border-2 border-pink-400">
              <div className="flex items-center gap-3">
                <span className="text-lg">📸</span>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Instagram</p>
                  <p className="text-xs text-slate-500">Feed · Story · Reels</p>
                </div>
              </div>
              <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full font-medium">Varsayılan</span>
            </div>

            {/* Facebook — toggle */}
            <button
              onClick={() => setIncludeFacebook(!includeFacebook)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                includeFacebook
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">📘</span>
                <div className="text-left">
                  <p className="font-semibold text-slate-900 text-sm">Facebook</p>
                  <p className="text-xs text-slate-500">Feed · Story · Reels</p>
                </div>
              </div>
              <div className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors ${
                includeFacebook ? 'bg-blue-500' : 'bg-slate-300'
              }`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  includeFacebook ? 'translate-x-5' : 'translate-x-1'
                }`} />
              </div>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Reklam Seti Adı</label>
            <input
              type="text"
              value={adsetName}
              onChange={e => setAdsetName(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Günlük Bütçe (₺) — Minimum: ₺45
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₺</span>
              <input
                type="number"
                min="46"
                value={dailyBudget}
                onChange={e => setDailyBudget(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Tahmini günlük erişim: {Math.round(parseInt(dailyBudget || '0') * 8).toLocaleString('tr-TR')}–{Math.round(parseInt(dailyBudget || '0') * 15).toLocaleString('tr-TR')} kişi
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-medium text-sm transition-colors"
            >
              ← Geri
            </button>
            <button
              onClick={createAdSet}
              disabled={loading || !adsetName.trim() || parseInt(dailyBudget) < 46}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Devam Et →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Ad Creative */}
      {step === 3 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
          <h2 className="font-bold text-slate-900">3. Reklam Görseli & Metni</h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Reklam Adı</label>
            <input
              type="text"
              value={adName}
              onChange={e => setAdName(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Görsel URL <span className="text-slate-400">(Cloudinary veya public HTTPS)</span>
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/dnpeh6kut/..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {imageUrl && (
              <img src={imageUrl} alt="Preview" className="mt-2 w-full max-h-48 object-cover rounded-xl border border-slate-200" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Reklam Metni</label>
            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-xs text-slate-400 mt-1">{caption.length} karakter</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-medium text-sm transition-colors"
            >
              ← Geri
            </button>
            <button
              onClick={createAd}
              disabled={loading || !imageUrl || !caption.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Kampanyayı Oluştur ✓
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
