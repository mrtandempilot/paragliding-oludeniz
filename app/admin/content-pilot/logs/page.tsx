export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Activity, ArrowLeft, DollarSign } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const agentColors: Record<string, string> = {
  orchestrator: 'bg-purple-100 text-purple-700',
  seo: 'bg-blue-100 text-blue-700',
  writer: 'bg-sky-100 text-sky-700',
  image: 'bg-green-100 text-green-700',
  social: 'bg-pink-100 text-pink-700',
  analytics: 'bg-amber-100 text-amber-700',
}

export default async function LogsPage() {
  const [logsRes, usageRes] = await Promise.all([
    supabase
      .from('agent_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100),
    supabase
      .from('usage_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  const logs = logsRes.data || []
  const usage = usageRes.data || []
  const totalCost = usage.reduce((sum, row) => sum + (row.cost_usd || 0), 0)
  const totalTokensIn = usage.reduce((sum, row) => sum + (row.tokens_input || 0), 0)
  const totalTokensOut = usage.reduce((sum, row) => sum + (row.tokens_output || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/content-pilot" className="text-slate-400 hover:text-slate-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Activity className="w-6 h-6 text-orange-600" />
            Agent Logs
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{logs.length} log entries</p>
        </div>
      </div>

      {/* Cost summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-1">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-slate-500">Total AI Cost</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">${totalCost.toFixed(4)}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-sm font-medium text-slate-500 mb-1">Input Tokens</div>
          <div className="text-2xl font-bold text-slate-900">{totalTokensIn.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-sm font-medium text-slate-500 mb-1">Output Tokens</div>
          <div className="text-2xl font-bold text-slate-900">{totalTokensOut.toLocaleString()}</div>
        </div>
      </div>

      {/* Usage per agent */}
      {usage.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-sm">Token Usage Log</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Agent</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Task</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tokens In</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tokens Out</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cost</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usage.map((row: any) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${agentColors[row.agent] || 'bg-slate-100 text-slate-700'}`}>
                        {row.agent}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-600 max-w-xs truncate">{row.task}</td>
                    <td className="px-6 py-3 text-slate-600">{(row.tokens_input || 0).toLocaleString()}</td>
                    <td className="px-6 py-3 text-slate-600">{(row.tokens_output || 0).toLocaleString()}</td>
                    <td className="px-6 py-3 text-green-700 font-medium">${(row.cost_usd || 0).toFixed(4)}</td>
                    <td className="px-6 py-3 text-slate-400 text-xs whitespace-nowrap">
                      {new Date(row.created_at).toLocaleString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Agent execution logs */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 text-sm">Agent Execution Log</h2>
        </div>

        {logs.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-sm">No logs yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {logs.map((log: any) => (
              <div key={log.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      log.status === 'done' ? 'bg-green-500' :
                      log.status === 'error' ? 'bg-red-500' :
                      log.status === 'running' ? 'bg-amber-500 animate-pulse' :
                      'bg-slate-400'
                    }`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${agentColors[log.agent] || 'bg-slate-100 text-slate-700'}`}>
                          {log.agent}
                        </span>
                        <span className="text-sm text-slate-600">{log.action}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          log.status === 'done' ? 'bg-green-100 text-green-700' :
                          log.status === 'error' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                      {log.duration_ms > 0 && (
                        <p className="text-xs text-slate-400 mt-0.5">{(log.duration_ms / 1000).toFixed(1)}s</p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">
                    {new Date(log.created_at).toLocaleString('tr-TR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
