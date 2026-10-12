import { Building2 } from 'lucide-react'
import AgentOffice from './AgentOffice'

export const dynamic = 'force-dynamic'

export default function AgentOfficePage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3"><Building2 className="w-6 h-6 text-violet-600" /> Ajan Ofisi</h1>
        <p className="text-sm text-slate-500 mt-0.5">Otomatik ajanların canlı durumu · her 15 saniyede güncellenir</p>
      </div>
      <AgentOffice />
    </div>
  )
}
