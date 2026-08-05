export const dynamic = 'force-dynamic'
export const revalidate = 0

import { createClient } from '@supabase/supabase-js'
import { Bot, Image as ImageIcon, Search, Share2, Cpu, Activity, Zap, Clock, CheckCircle2, AlertCircle, Circle, RefreshCw } from 'lucide-react'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'şimdi'
  if (mins < 60) return `${mins} dk önce`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} sa önce`
  return `${Math.floor(hrs / 24)} gün önce`
}

const CLAUDE_AGENTS = [
  { id: 'orchestrator', label: 'Orchestrator', role: 'Tüm ajanları yönetir', icon: Cpu, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  { id: 'seo', label: 'SEO Agent', role: 'Keyword araştırması', icon: Search, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { id: 'writer', label: 'Writer Agent', role: 'Blog makalesi yazar', icon: Bot, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  { id: 'image', label: 'Image Agent', role: 'Görsel bulur & yükler', icon: ImageIcon, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  { id: 'social', label: 'Social Agent', role: 'Instagram caption & post', icon: Share2, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-200' },
]

const HERMES_JOBS = [
  { label: 'Blog Pilot — 06:00', schedule: '0 3 * * *', utc: '03:00 UTC', last: '06:00', status: 'ok' },
  { label: 'Blog Pilot — 12:00', schedule: '0 9 * * *', utc: '09:00 UTC', last: 'bekliyor', status: 'pending' },
  { label: 'Blog Pilot — 18:00', schedule: '0 15 * * *', utc: '15:00 UTC', last: 'bekliyor', status: 'pending' },
]

export default async function MissionControlPage() {
  const supabase = getSupabase()
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const todayStart = new Date(new Date().setHours(0, 0, 0, 0)).toISOString()

  const [logsRes, flowRes, articlesRes, costRes] = await Promise.allSettled([
    supabase.from('agent_logs').select('*').order('created_at', { ascending: false }).limit(50),
    supabase.from('agent_logs').select('id,agent,action,status,created_at').order('created_at', { ascending: false }).limit(12),
    supabase.from('articles').select('id', { count: 'exact', head: true }).gte('created_at', weekAgo),
    supabase.from('usage_logs').select('cost_usd').gte('created_at', todayStart),
  ])

  const allLogs: any[] = logsRes.status === 'fulfilled' ? (logsRes.value.data ?? []) : []
  const flowLogs: any[] = flowRes.status === 'fulfilled' ? (flowRes.value.data ?? []) : []
  const articlesThisWeek = articlesRes.status === 'fulfilled' ? (articlesRes.value.count ?? 0) : 0
  const todayCost = costRes.status === 'fulfilled' && costRes.value.data
    ? (costRes.value.data as any[]).reduce((s: number, r: any) => s + (r.cost_usd || 0), 0)
    : 0

  // Agent status — son log'dan türet
  const agentStatus: Record<string, any> = {}
  for (const agent of CLAUDE_AGENTS) {
    const logs = allLogs.filter(l => l.agent === agent.id)
    const lastLog = logs[0]
    agentStatus[agent.id] = {
      status: lastLog?.status ?? 'idle',
      lastRun: lastLog?.created_at ? timeAgo(lastLog.created_at) : 'hiç çalışmadı',
      lastAction: lastLog?.action ?? '-',
    }
  }

  const activeCount = Object.values(agentStatus).filter((s: any) => s.status === 'running').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mission Control</h1>
          <p className="text-slate-500 text-sm mt-0.5">Tüm ajanlar — canlı durum</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
          <span className="text-green-700 text-sm font-medium">Sistem Aktif</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Claude Ajanı', value: '5', sub: 'tanım mevcut' },
          { label: 'Hermes Job', value: '3', sub: 'günlük cron' },
          { label: 'Bu hafta makale', value: String(articlesThisWeek), sub: 'yayınlandı' },
          { label: 'Bugün maliyet', value: `$${todayCost.toFixed(2)}`, sub: 'Claude API' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-4">
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            <p className="text-xs text-slate-400">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Claude Agents */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-slate-500" />
            <h2 className="font-bold text-slate-900 text-sm">Claude Ajanları</h2>
          </div>
          <div className="p-4 space-y-3">
            {CLAUDE_AGENTS.map(agent => {
              const s = agentStatus[agent.id]
              const isRunning = s?.status === 'running'
              const isError = s?.status === 'error' || s?.status === 'failed'
              const Icon = agent.icon
              return (
                <div key={agent.id} className={`flex items-center gap-3 rounded-xl border p-3 ${isRunning ? `${agent.bg} ${agent.border}` : 'border-slate-100'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isRunning ? agent.bg : 'bg-slate-50'}`}>
                    <Icon className={`w-4 h-4 ${isRunning ? agent.color : 'text-slate-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{agent.label}</p>
                    <p className="text-xs text-slate-400">{agent.role}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 justify-end">
                      {isRunning ? <Activity className={`w-3 h-3 ${agent.color} animate-pulse`} /> :
                       isError ? <AlertCircle className="w-3 h-3 text-red-400" /> :
                       <CheckCircle2 className="w-3 h-3 text-slate-300" />}
                      <span className={`text-xs font-medium ${isRunning ? agent.color : isError ? 'text-red-400' : 'text-slate-400'}`}>
                        {isRunning ? 'çalışıyor' : isError ? 'hata' : 'bekliyor'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{s?.lastRun}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Hermes */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-violet-500" />
              <h2 className="font-bold text-slate-900 text-sm">Hermes Agent — VPS</h2>
            </div>
            <span className="text-[10px] bg-violet-50 text-violet-600 border border-violet-200 px-2 py-0.5 rounded-full font-medium">OpenRouter · OWL</span>
          </div>
          <div className="p-4 space-y-3">
            {/* Gateway status */}
            <div className="flex items-center gap-3 rounded-xl bg-violet-50 border border-violet-200 p-3">
              <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                <Activity className="w-4 h-4 text-violet-600 animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">Gateway</p>
                <p className="text-xs text-slate-500">systemd servis · PID 82679</p>
              </div>
              <span className="text-xs font-semibold text-violet-600">Canlı</span>
            </div>

            {/* Cron jobs */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-1">Günlük Cron</p>
              {HERMES_JOBS.map(job => (
                <div key={job.label} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                  <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700">{job.label}</p>
                    <p className="text-xs text-slate-400">{job.utc}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {job.status === 'ok'
                      ? <><CheckCircle2 className="w-3 h-3 text-green-500" /><span className="text-xs text-green-600 font-medium">ok</span></>
                      : <><Circle className="w-3 h-3 text-slate-300" /><span className="text-xs text-slate-400">bekliyor</span></>}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
              <p className="text-xs text-slate-500">
                <span className="font-medium text-slate-700">Köprü:</span> Hermes → curl → Next.js API → Claude ajanları → Supabase
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Flow */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-slate-500" />
          <h2 className="font-bold text-slate-900 text-sm">Son Ajan Aktivitesi</h2>
        </div>
        {flowLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">Henüz log yok</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {flowLogs.map((log: any) => (
              <div key={log.id} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors">
                <span className="text-xs text-slate-400 min-w-[80px] tabular-nums">{timeAgo(log.created_at)}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full min-w-[90px] text-center ${
                  log.agent === 'orchestrator' ? 'bg-purple-50 text-purple-700' :
                  log.agent === 'seo' ? 'bg-blue-50 text-blue-700' :
                  log.agent === 'writer' ? 'bg-green-50 text-green-700' :
                  log.agent === 'image' ? 'bg-orange-50 text-orange-700' :
                  log.agent === 'social' ? 'bg-pink-50 text-pink-700' :
                  'bg-slate-100 text-slate-600'
                }`}>{log.agent}</span>
                <span className="text-xs text-slate-600 flex-1">{log.action}</span>
                <span className={`text-xs font-medium ${
                  log.status === 'success' || log.status === 'done' ? 'text-green-600' :
                  log.status === 'running' ? 'text-blue-600' :
                  log.status === 'error' ? 'text-red-500' : 'text-slate-400'
                }`}>{log.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
