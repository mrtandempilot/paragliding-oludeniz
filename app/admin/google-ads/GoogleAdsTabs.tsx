'use client'

import { useState } from 'react'
import { BarChart2, Users } from 'lucide-react'
import GoogleAdsDashboardClient from './GoogleAdsDashboardClient'
import CompetitorAnalysis from './CompetitorAnalysis'

const TABS = [
  { id: 'campaigns', label: 'Kampanyalarım', icon: BarChart2 },
  { id: 'competitors', label: 'Rakip Analizi', icon: Users },
]

export default function GoogleAdsTabs() {
  const [active, setActive] = useState('campaigns')

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {TABS.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {active === 'campaigns' && <GoogleAdsDashboardClient />}
      {active === 'competitors' && <CompetitorAnalysis />}
    </div>
  )
}
