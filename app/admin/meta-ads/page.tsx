import Link from 'next/link'
import { Megaphone, TrendingUp, MousePointerClick, Eye, DollarSign, Plus } from 'lucide-react'
import MetaAdsDashboardClient from './MetaAdsDashboardClient'

export default function MetaAdsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Megaphone className="w-7 h-7 text-blue-600" />
            Meta Ads
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Instagram reklam kampanyaları · Hesap: act_4388171234791606 · ₺ TRY
          </p>
        </div>
        <Link
          href="/admin/meta-ads/create"
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Yeni Kampanya
        </Link>
      </div>

      {/* Client component handles fetching + rendering */}
      <MetaAdsDashboardClient />
    </div>
  )
}
