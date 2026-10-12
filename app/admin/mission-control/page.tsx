export const dynamic = 'force-dynamic'
export const revalidate = 0

// Mission Control = Ajan Ofisi (piksel ofis) + zamanlama + son aktivite.
import { createClient } from '@supabase/supabase-js'
import { Clock, RefreshCw, Radar } from 'lucide-react'
import AgentOffice from '../agent-office/AgentOffice'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

function timeAgo(dateStr: string): string {
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
  if (mins < 1) return 'şimdi'
  if (mins < 60) return `${mins} dk önce`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} sa önce`
  return `${Math.floor(hrs / 24)} gün önce`
}

// Vercel cron (vercel.json) — saatler Türkiye saati
const SCHEDULE = [
  { time: '07:00', who: 'Reklamcı', what: 'Google Ads raporu + otomatik düzeltme + Telegram özeti' },
  { time: '08:00', who: 'Rezervasyon', what: 'Bugün/yarın uçuşları, hatırlatma e-postaları, bekleyenler, hava' },
  { time: '09:00', who: 'İçerik ekibi', what: '1 blog yazısı + görsel + Instagram taslağı + 4 dil çeviri' },
  { time: 'Anlık', who: 'WhatsApp', what: 'Müşteri yazınca cevap verir, gerekirse sana haber verir' },
]

const AGENT_BADGE: Record<string, string> = {
  orchestrator: 'bg-purple-50 text-purple-700', seo: 'bg-blue-50 text-blue-700', writer: 'bg-green-50 text-green-700',
  image: 'bg-orange-50 text-orange-700', social: 'bg-pink-50 text-pink-700', 'google-ads': 'bg-sky-50 text-sky-700',
  rezervasyon: 'bg-amber-50 text-amber-700', whatsapp: 'bg-emerald-50 text-emerald-700',
}

export default async function MissionControlPage() {
  const supabase = getSupabase()
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()
  const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString()

  const [flowRes, articlesRes, costRes, errRes] = await Promise.allSettled([
    supabase.from('agent_logs').select('id,agent,action,status,created_at').neq('status', 'running').order('created_at', { ascending: false }).limit(15),
    supabase.from('articles').select('id', { count: 'exact', head: true }).gte('created_at', weekAgo).not('slug', 'like', 'i18n-%'),
    supabase.from('usage_logs').select('cost_usd').gte('created_at', monthAgo),
    supabase.from('agent_logs').select('id', { count: 'exact', head: true }).eq('status', 'error').gte('created_at', weekAgo),
  ])
  const flowLogs: any[] = flowRes.status === 'fulfilled' ? (flowRes.value.data ?? []) : []
  const articlesThisWeek = articlesRes.status === 'fulfilled' ? (articlesRes.value.count ?? 0) : 0
  const monthCost = costRes.status === 'fulfilled' && costRes.value.data ? (costRes.value.data as any[]).reduce((s, r) => s + (r.cost_usd || 0), 0) : 0
  const errorsWeek = errRes.status === 'fulfilled' ? (errRes.value.count ?? 0) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3"><Radar className="w-6 h-6 text-violet-600" /> Mission Control</h1>
          <p className="text-slate-500 text-sm mt-0.5">Ajan ofisi · tüm otomatik ajanlar canlı · 15 saniyede bir güncellenir</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Ajan', value: '9', sub: 'içerik 6 · satış 3' },
          { label: 'Bu hafta yazı', value: String(articlesThisWeek), sub: 'yayınlandı' },
          { label: 'Hata (7 gün)', value: String(errorsWeek), sub: 'ajan çalışması' },
          { label: 'AI maliyeti (30 gün)', value: `$${monthCost.toFixed(2)}`, sub: 'Gemini ücretsiz' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl ring-1 ring-black/10 px-5 py-4">
            <p className="text-2xl font-semibold text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            <p className="text-xs text-slate-400">{s.sub}</p>
          </div>
        ))}
      </div>

      <AgentOffice />

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl ring-1 ring-black/10 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <h2 className="font-bold text-slate-900 text-sm">Günlük program</h2>
          </div>
          <ul className="divide-y divide-slate-50">
            {SCHEDULE.map(s => (
              <li key={s.who} className="flex items-start gap-4 px-5 py-3">
                <span className="text-sm font-semibold text-slate-900 tabular-nums min-w-[52px]">{s.time}</span>
                <div>
                  <p className="text-sm font-medium text-slate-800">{s.who}</p>
                  <p className="text-xs text-slate-500">{s.what}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="px-5 py-3 text-xs text-slate-500 bg-slate-50">Raporlar Telegram'a gelir. Hermes (VPS) de içerik ekibini tetikleyebilir; aynı gün ikinci kez çalışmaz.</p>
        </section>

        <section className="bg-white rounded-2xl ring-1 ring-black/10 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-slate-500" />
            <h2 className="font-bold text-slate-900 text-sm">Son ajan aktivitesi</h2>
          </div>
          {flowLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">Henüz kayıt yok</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {flowLogs.map((log: any) => (
                <div key={log.id} className="flex items-center gap-3 px-5 py-2.5">
                  <span className="text-xs text-slate-400 min-w-[72px] tabular-nums">{timeAgo(log.created_at)}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full min-w-[84px] text-center ${AGENT_BADGE[log.agent] || 'bg-slate-100 text-slate-600'}`}>{log.agent}</span>
                  <span className="text-xs text-slate-600 flex-1 truncate">{log.action}</span>
                  <span className={`text-xs font-medium ${log.status === 'done' || log.status === 'success' ? 'text-green-600' : log.status === 'error' ? 'text-red-500' : 'text-slate-400'}`}>{log.status === 'done' ? 'tamam' : log.status === 'error' ? 'hata' : log.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
