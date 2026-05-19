import Link from 'next/link'
import { Search, Plus } from 'lucide-react'
import GoogleAdsDashboardClient from './GoogleAdsDashboardClient'

export default function GoogleAdsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Search className="w-6 h-6 text-green-600" />
            Google Ads
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Search & Display kampanya yönetimi</p>
        </div>
        <Link
          href="/admin/google-ads/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Kampanya
        </Link>
      </div>

      <GoogleAdsDashboardClient />
    </div>
  )
}
