'use client'

import { useState } from 'react'
import { MapPin, Loader2, CheckCircle, AlertCircle, Navigation, Phone, Globe, TrendingUp } from 'lucide-react'

interface MapsAdForm {
  campaignName: string
  dailyBudget: string
  businessName: string
  phone: string
  website: string
  address: string
}

const DEFAULT_FORM: MapsAdForm = {
  campaignName: 'Atmos Paragliding — Maps',
  dailyBudget: '200',
  businessName: 'Atmos Paragliding',
  phone: '+905364616674',
  website: 'https://atmosparagliding.com',
  address: 'Belcekız, Ölüdeniz, Fethiye, Muğla',
}

export default function MapsAds() {
  const [form, setForm] = useState<MapsAdForm>(DEFAULT_FORM)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; error?: string; campaign_id?: string } | null>(null)

  function update(field: keyof MapsAdForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function createMapsCampaign() {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/admin/google-ads', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_maps_campaign',
          campaign_name: form.campaignName,
          daily_budget_try: Number(form.dailyBudget),
          business_name: form.businessName,
          phone: form.phone,
          website: form.website,
          address: form.address,
        }),
      })
      const data = await res.json()
      setResult(data)
    } catch (err: any) {
      setResult({ error: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">

      {/* Bilgi kartı */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 rounded-xl p-3">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">Google Maps-Only Ads (Beta 2026)</h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              "Atmos Paragliding" arayan turistler haritada seni görür — rakiplerden önce.
              Sadece Maps içinde gösterilir, satın almaya hazır kitleye ulaşırsın.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              {[
                { icon: Navigation, text: 'Haritada pin olarak çıkar' },
                { icon: Phone, text: 'Direkt arama butonu' },
                { icon: TrendingUp, text: '%23 yüksek dönüşüm' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-1.5 text-xs bg-white/15 rounded-lg px-3 py-1.5">
                  <item.icon className="w-3.5 h-3.5" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          Haritada Nasıl Görünür
        </h3>
        <div className="bg-slate-100 rounded-xl p-4 relative overflow-hidden">
          {/* Fake map background */}
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg,#94a3b8,#94a3b8 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#94a3b8,#94a3b8 1px,transparent 1px,transparent 40px)' }}
          />
          {/* Map pin mockup */}
          <div className="relative z-10 flex justify-center">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-4 max-w-xs w-full">
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 rounded-lg p-2 shrink-0">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900 text-sm truncate">{form.businessName}</p>
                    <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium shrink-0">Sponsorlu</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{form.address}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-500 text-xs">★★★★★</span>
                    <span className="text-xs text-slate-500">4.9 (2.4k)</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <a href={`tel:${form.phone}`} className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 text-white text-xs font-semibold py-2 rounded-lg">
                      <Phone className="w-3 h-3" /> Ara
                    </a>
                    <a href={form.website} className="flex-1 flex items-center justify-center gap-1.5 border border-slate-200 text-slate-700 text-xs font-semibold py-2 rounded-lg">
                      <Globe className="w-3 h-3" /> Website
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-semibold text-slate-900 mb-5">Kampanya Oluştur</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Kampanya Adı</label>
            <input
              value={form.campaignName}
              onChange={e => update('campaignName', e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Günlük Bütçe (₺)</label>
            <input
              type="number"
              value={form.dailyBudget}
              onChange={e => update('dailyBudget', e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-400 mt-1">Tavsiye: ₺150–₺300/gün</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">İşletme Adı</label>
            <input
              value={form.businessName}
              onChange={e => update('businessName', e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Telefon</label>
            <input
              value={form.phone}
              onChange={e => update('phone', e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Website</label>
            <input
              value={form.website}
              onChange={e => update('website', e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Adres</label>
            <input
              value={form.address}
              onChange={e => update('address', e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {result?.success && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-800">Maps kampanyası oluşturuldu!</p>
              <p className="text-xs text-green-700 mt-0.5">Kampanya ID: {result.campaign_id} — onay bekleniyor (genelde 24s)</p>
            </div>
          </div>
        )}

        {result?.error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="text-sm text-red-700">{result.error}</p>
          </div>
        )}

        <button
          onClick={createMapsCampaign}
          disabled={loading}
          className="mt-5 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
          {loading ? 'Oluşturuluyor...' : 'Maps Kampanyası Oluştur'}
        </button>
      </div>
    </div>
  )
}
