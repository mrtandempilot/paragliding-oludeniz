'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, MousePointerClick, Eye, DollarSign, Users, RefreshCw, Play, Pause, Megaphone, BarChart3 } from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts'

interface Campaign {
  id: string
  name: string
  status: string
  objective: string
  daily_budget?: string
  lifetime_budget?: string
}

interface Insights {
  spend?: string
  impressions?: string
  clicks?: string
  ctr?: string
  cpc?: string
  cpm?: string
  reach?: string
}

interface DailyPoint {
  date_start: string
  spend?: string
  impressions?: string
  clicks?: string
}

interface CampaignInsight {
  campaign_id: string
  campaign_name: string
  spend?: string
  impressions?: string
  clicks?: string
}

const BAR_COLORS = ['#2563eb', '#7c3aed', '#f97316', '#0ea5e9', '#16a34a', '#db2777', '#f59e0b', '#0891b2']

function trDate(d: string) {
  try {
    return new Date(d).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })
  } catch {
    return d
  }
}

export default function MetaAdsDashboardClient() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [insights, setInsights] = useState<Insights>({})
  const [dailyInsights, setDailyInsights] = useState<DailyPoint[]>([])
  const [campaignInsights, setCampaignInsights] = useState<CampaignInsight[]>([])
  const [datePreset, setDatePreset] = useState('last_30d')
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)
  const [hasPayment, setHasPayment] = useState<boolean | null>(null)

  async function fetchData() {
    setLoading(true)
    try {
      const [camRes, insRes, billingRes, dailyRes, byCampaignRes] = await Promise.all([
        fetch('/api/admin/meta-ads?type=campaigns', { credentials: 'include' }),
        fetch(`/api/admin/meta-ads?type=insights&date_preset=${datePreset}`, { credentials: 'include' }),
        fetch('/api/admin/meta-ads?type=billing', { credentials: 'include' }),
        fetch(`/api/admin/meta-ads?type=insights_daily&date_preset=${datePreset}`, { credentials: 'include' }),
        fetch(`/api/admin/meta-ads?type=insights_by_campaign&date_preset=${datePreset}`, { credentials: 'include' }),
      ])
      const camData = await camRes.json()
      const insData = await insRes.json()
      const billingData = await billingRes.json()
      const dailyData = await dailyRes.json()
      const byCampaignData = await byCampaignRes.json()

      setCampaigns(camData.data || [])
      setInsights(insData.data?.[0] || {})
      setDailyInsights(Array.isArray(dailyData.data) ? dailyData.data : [])
      setCampaignInsights(Array.isArray(byCampaignData.data) ? byCampaignData.data : [])

      // funding_source_details varsa ödeme yöntemi eklenmiş demektir
      const hasFunding = !!billingData.funding_source_details?.id
      setHasPayment(hasFunding)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [datePreset])

  async function toggleCampaign(id: string, currentStatus: string) {
    setToggling(id)
    const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
    try {
      await fetch('/api/admin/meta-ads', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_campaign', campaign_id: id, status: newStatus }),
      })
      await fetchData()
    } finally {
      setToggling(null)
    }
  }

  const statCards = [
    {
      label: 'Harcama',
      value: insights.spend ? `₺${parseFloat(insights.spend).toFixed(2)}` : '₺0',
      icon: DollarSign,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Gösterim',
      value: insights.impressions ? parseInt(insights.impressions).toLocaleString('tr-TR') : '0',
      icon: Eye,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Tıklama',
      value: insights.clicks ? parseInt(insights.clicks).toLocaleString('tr-TR') : '0',
      icon: MousePointerClick,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'CTR',
      value: insights.ctr ? `%${parseFloat(insights.ctr).toFixed(2)}` : '%0',
      icon: TrendingUp,
      color: 'bg-orange-50 text-orange-600',
    },
    {
      label: 'Tıklama Başı Maliyet',
      value: insights.cpc ? `₺${parseFloat(insights.cpc).toFixed(2)}` : '—',
      icon: DollarSign,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Erişim',
      value: insights.reach ? parseInt(insights.reach).toLocaleString('tr-TR') : '0',
      icon: Users,
      color: 'bg-sky-50 text-sky-600',
    },
  ]

  const dateOptions = [
    { value: 'today', label: 'Bugün' },
    { value: 'last_7d', label: 'Son 7 gün' },
    { value: 'last_30d', label: 'Son 30 gün' },
    { value: 'this_month', label: 'Bu ay' },
    { value: 'last_month', label: 'Geçen ay' },
  ]

  const chartData = dailyInsights
    .map(d => ({
      date: trDate(d.date_start),
      Harcama: d.spend ? Number(parseFloat(d.spend).toFixed(2)) : 0,
      Gösterim: d.impressions ? parseInt(d.impressions) : 0,
      Tıklama: d.clicks ? parseInt(d.clicks) : 0,
    }))

  const campaignChartData = [...campaignInsights]
    .map(c => ({
      name: c.campaign_name?.length > 18 ? `${c.campaign_name.slice(0, 18)}…` : c.campaign_name,
      Harcama: c.spend ? Number(parseFloat(c.spend).toFixed(2)) : 0,
    }))
    .sort((a, b) => b.Harcama - a.Harcama)
    .slice(0, 8)

  const hasChartData = chartData.some(d => d.Harcama > 0 || d.Gösterim > 0 || d.Tıklama > 0)
  const hasCampaignChartData = campaignChartData.some(c => c.Harcama > 0)

  return (
    <div className="space-y-6">
      {/* Date filter + refresh */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
          {dateOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setDatePreset(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                datePreset === opt.value
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
          title="Yenile"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map(card => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-xl font-bold text-slate-900">{loading ? '...' : card.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{card.label}</div>
            </div>
          )
        })}
      </div>

      {/* Payment method status */}
      {hasPayment === false && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <div className="text-amber-500 text-xl shrink-0">⚠️</div>
          <div>
            <p className="font-semibold text-amber-800 text-sm">Ödeme yöntemi eklenmemiş</p>
            <p className="text-amber-700 text-xs mt-0.5">
              Reklam yayınlamak için{' '}
              <a
                href="https://www.facebook.com/ads/manager/billing"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium"
              >
                Meta Business Manager → Faturalandırma
              </a>
              {' '}sayfasından ödeme yöntemi ekle.
            </p>
          </div>
        </div>
      )}
      {hasPayment === true && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="text-green-500 text-xl shrink-0">✅</div>
          <p className="font-semibold text-green-800 text-sm">Ödeme yöntemi aktif — reklam yayınlamaya hazır</p>
        </div>
      )}

      {/* Charts: daily trend + campaign comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-green-600" />
            <h2 className="font-bold text-slate-900 text-sm">Harcama Trendi (₺)</h2>
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm animate-pulse">Yükleniyor...</div>
          ) : !hasChartData ? (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm text-center px-4">
              Bu tarih aralığında grafik için yeterli veri yok
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={45} />
                <Tooltip
                  formatter={(value: any) => [`₺${value}`, 'Harcama']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                />
                <Area type="monotone" dataKey="Harcama" stroke="#16a34a" strokeWidth={2} fill="url(#spendGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-slate-900 text-sm">Gösterim &amp; Tıklama Trendi</h2>
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm animate-pulse">Yükleniyor...</div>
          ) : !hasChartData ? (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm text-center px-4">
              Bu tarih aralığında grafik için yeterli veri yok
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={45} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={45} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line yAxisId="left" type="monotone" dataKey="Gösterim" stroke="#2563eb" strokeWidth={2} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="Tıklama" stroke="#7c3aed" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {campaignInsights.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone className="w-4 h-4 text-orange-600" />
            <h2 className="font-bold text-slate-900 text-sm">Kampanya Bazında Harcama (₺)</h2>
          </div>
          {!hasCampaignChartData ? (
            <div className="h-56 flex items-center justify-center text-slate-400 text-sm">
              Bu tarih aralığında kampanya harcaması yok
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(56 * campaignChartData.length, 180)}>
              <BarChart data={campaignChartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} width={140} />
                <Tooltip
                  formatter={(value: any) => [`₺${value}`, 'Harcama']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                />
                <Bar dataKey="Harcama" radius={[0, 6, 6, 0]}>
                  {campaignChartData.map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {/* Campaigns table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Kampanyalar</h2>
          <span className="text-sm text-slate-400">{campaigns.length} kampanya</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm animate-pulse">Yükleniyor...</div>
        ) : campaigns.length === 0 ? (
          <div className="p-16 text-center">
            <Megaphone className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500 font-medium">Henüz kampanya yok</p>
            <p className="text-slate-400 text-sm mt-1">
              İlk Instagram reklam kampanyanı oluşturmak için "Yeni Kampanya" butonuna tıkla.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kampanya</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amaç</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Bütçe</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campaigns.map(campaign => (
                  <tr key={campaign.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{campaign.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{campaign.id}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs">
                      {campaign.objective?.replace('OUTCOME_', '')}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {campaign.daily_budget
                        ? `₺${(parseInt(campaign.daily_budget) / 100).toFixed(0)}/gün`
                        : campaign.lifetime_budget
                        ? `₺${(parseInt(campaign.lifetime_budget) / 100).toFixed(0)} toplam`
                        : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        campaign.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-700'
                          : campaign.status === 'PAUSED'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {campaign.status === 'ACTIVE' ? 'Aktif' : campaign.status === 'PAUSED' ? 'Duraklatıldı' : campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleCampaign(campaign.id, campaign.status)}
                        disabled={toggling === campaign.id}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          campaign.status === 'ACTIVE'
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                        title={campaign.status === 'ACTIVE' ? 'Duraklat' : 'Başlat'}
                      >
                        {campaign.status === 'ACTIVE'
                          ? <><Pause className="w-3 h-3" /> Duraklat</>
                          : <><Play className="w-3 h-3" /> Başlat</>
                        }
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
