'use client'

import { useEffect, useState } from 'react'
import { Loader2, TrendingUp, MousePointer, Eye, DollarSign, Target, Play, Pause } from 'lucide-react'

const DATE_RANGES = [
  { label: 'Bugün', value: 'TODAY' },
  { label: '7 Gün', value: 'LAST_7_DAYS' },
  { label: '30 Gün', value: 'LAST_30_DAYS' },
  { label: 'Bu Ay', value: 'THIS_MONTH' },
]

const CHANNEL_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  SEARCH: { label: 'Arama', color: 'bg-blue-100 text-blue-700', icon: '🔍' },
  DISPLAY: { label: 'Görsel', color: 'bg-purple-100 text-purple-700', icon: '🖼️' },
  VIDEO: { label: 'YouTube', color: 'bg-red-100 text-red-700', icon: '▶️' },
}

const STATUS_STYLES: Record<string, string> = {
  ENABLED: 'bg-green-100 text-green-700',
  PAUSED: 'bg-amber-100 text-amber-700',
  REMOVED: 'bg-slate-100 text-slate-400',
}

interface Metrics {
  impressions: number
  clicks: number
  cost_try: string
  ctr: string
  avg_cpc: string
  conversions: number
}

interface Campaign {
  campaign: {
    id: string
    name: string
    status: string
    advertisingChannelType: string
    resourceName: string
  }
  campaignBudget: { amountMicros: string }
  metrics: {
    impressions: string
    clicks: string
    costMicros: string
    ctr: string
    averageCpc: string
    conversions: string
  }
}

export default function GoogleAdsDashboardClient() {
  const [range, setRange] = useState('LAST_30_DAYS')
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [notConfigured, setNotConfigured] = useState(false)
  const [toggling, setToggling] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [range])

  async function loadData() {
    setLoading(true)
    setError('')
    try {
      const [metricsRes, campaignsRes] = await Promise.all([
        fetch(`/api/admin/google-ads?type=metrics&range=${range}`, { credentials: 'include' }),
        fetch(`/api/admin/google-ads?type=campaigns`, { credentials: 'include' }),
      ])
      const metricsData = await metricsRes.json()
      const campaignsData = await campaignsRes.json()

      if (metricsData.configured === false || campaignsData.configured === false) {
        setNotConfigured(true)
        return
      }
      if (metricsData.error) { setError(metricsData.error); return }
      if (campaignsData.error) { setError(campaignsData.error); return }

      setMetrics(metricsData)
      setCampaigns(campaignsData.campaigns || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function toggleCampaign(resourceName: string, currentStatus: string) {
    setToggling(resourceName)
    const newStatus = currentStatus === 'ENABLED' ? 'PAUSED' : 'ENABLED'
    try {
      await fetch('/api/admin/google-ads', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_campaign', resource_name: resourceName, status: newStatus }),
      })
      await loadData()
    } finally {
      setToggling(null)
    }
  }

  if (notConfigured) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">⚙️</div>
        <h3 className="font-bold text-amber-900 mb-2">Google Ads henüz yapılandırılmadı</h3>
        <p className="text-amber-700 text-sm mb-4">
          <code>.env.local</code> dosyasına aşağıdaki değişkenleri ekle:
        </p>
        <div className="bg-white rounded-xl border border-amber-200 p-4 text-left text-xs font-mono text-slate-700 space-y-1 max-w-md mx-auto">
          <div>GOOGLE_ADS_CUSTOMER_ID=123-456-7890</div>
          <div>GOOGLE_ADS_DEVELOPER_TOKEN=xxx</div>
          <div>GOOGLE_ADS_CLIENT_ID=xxx.apps.googleusercontent.com</div>
          <div>GOOGLE_ADS_CLIENT_SECRET=xxx</div>
          <div>GOOGLE_ADS_REFRESH_TOKEN=xxx</div>
        </div>
        <a
          href="https://developers.google.com/google-ads/api/docs/first-call/overview"
          target="_blank"
          className="inline-block mt-4 text-sm text-amber-700 underline"
        >
          Google Ads API kurulum rehberi →
        </a>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 text-sm">
        ❌ {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Date filter */}
      <div className="flex gap-2">
        {DATE_RANGES.map(dr => (
          <button
            key={dr.value}
            onClick={() => setRange(dr.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              range === dr.value
                ? 'bg-green-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {dr.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Yükleniyor...
        </div>
      ) : (
        <>
          {/* Metric cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {[
              { label: 'Gösterim', value: Number(metrics?.impressions || 0).toLocaleString('tr-TR'), icon: Eye, color: 'text-blue-600' },
              { label: 'Tıklama', value: Number(metrics?.clicks || 0).toLocaleString('tr-TR'), icon: MousePointer, color: 'text-green-600' },
              { label: 'Harcama', value: `₺${metrics?.cost_try || '0'}`, icon: DollarSign, color: 'text-red-600' },
              { label: 'CTR', value: `%${metrics?.ctr || '0'}`, icon: TrendingUp, color: 'text-purple-600' },
              { label: 'Ort. TBM', value: `₺${metrics?.avg_cpc || '0'}`, icon: Target, color: 'text-orange-600' },
              { label: 'Dönüşüm', value: Number(metrics?.conversions || 0).toFixed(1), icon: TrendingUp, color: 'text-teal-600' },
            ].map(card => {
              const Icon = card.icon
              return (
                <div key={card.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${card.color}`} />
                    <span className="text-xs text-slate-500 font-medium">{card.label}</span>
                  </div>
                  <p className="text-xl font-bold text-slate-900">{card.value}</p>
                </div>
              )
            })}
          </div>

          {/* Campaigns table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Kampanyalar</h3>
              <span className="text-sm text-slate-400">{campaigns.length} kampanya</span>
            </div>

            {campaigns.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <p className="font-medium">Henüz kampanya yok</p>
                <p className="text-sm mt-1">Yeni Kampanya butonuyla başla</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kampanya</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tür</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Bütçe/Gün</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Gösterim</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tıklama</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Harcama</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Durum</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {campaigns.map((row) => {
                      const c = row.campaign
                      const m = row.metrics || {}
                      const channelInfo = CHANNEL_LABELS[c.advertisingChannelType] || { label: c.advertisingChannelType, color: 'bg-slate-100 text-slate-600', icon: '📢' }
                      const budgetTry = row.campaignBudget?.amountMicros
                        ? (Number(row.campaignBudget.amountMicros) / 1_000_000).toFixed(0)
                        : '—'
                      const costTry = m.costMicros
                        ? (Number(m.costMicros) / 1_000_000).toFixed(2)
                        : '0'
                      const isToggling = toggling === c.resourceName

                      return (
                        <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900 max-w-xs">
                            <p className="truncate">{c.name}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${channelInfo.color}`}>
                              {channelInfo.icon} {channelInfo.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-600">₺{budgetTry}</td>
                          <td className="px-6 py-4 text-slate-600">{Number(m.impressions || 0).toLocaleString('tr-TR')}</td>
                          <td className="px-6 py-4 text-slate-600">{Number(m.clicks || 0).toLocaleString('tr-TR')}</td>
                          <td className="px-6 py-4 text-slate-600">₺{costTry}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[c.status] || 'bg-slate-100 text-slate-600'}`}>
                              {c.status === 'ENABLED' ? 'Aktif' : c.status === 'PAUSED' ? 'Duraklatıldı' : c.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {c.status !== 'REMOVED' && (
                              <button
                                onClick={() => toggleCampaign(c.resourceName, c.status)}
                                disabled={!!isToggling}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                  c.status === 'ENABLED'
                                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                              >
                                {isToggling
                                  ? <Loader2 className="w-3 h-3 animate-spin" />
                                  : c.status === 'ENABLED'
                                  ? <><Pause className="w-3 h-3" /> Duraklat</>
                                  : <><Play className="w-3 h-3" /> Başlat</>
                                }
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
