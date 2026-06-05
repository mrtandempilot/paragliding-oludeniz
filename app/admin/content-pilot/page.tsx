export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import RunPilotButton from './RunPilotButton'
import {
  Bot, BookOpen, Target, Activity, DollarSign,
  CheckCircle, XCircle, Clock, Instagram, ExternalLink
} from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getStats() {
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [articles, topics, usage, lastRun, recentLogs] = await Promise.all([
    supabase.from('articles').select('status, created_at').gte('created_at', weekAgo),
    supabase.from('topics').select('status'),
    supabase.from('usage_logs').select('cost_usd').gte('created_at', monthAgo),
    supabase
      .from('agent_logs')
      .select('*')
      .eq('agent', 'orchestrator')
      .order('created_at', { ascending: false })
      .limit(1),
    supabase
      .from('agent_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const totalCostMonth = (usage.data || []).reduce((sum, row) => sum + (row.cost_usd || 0), 0)
  const pendingTopics = (topics.data || []).filter(t => t.status === 'pending').length
  const articlesThisWeek = (articles.data || []).length
  const lastRunData = lastRun.data?.[0]

  return {
    articlesThisWeek,
    pendingTopics,
    totalCostMonth,
    lastRunData,
    recentLogs: recentLogs.data || [],
  }
}

async function getRecentArticles() {
  const { data } = await supabase
    .from('articles')
    .select('id, title, slug, status, word_count, created_at')
    .order('created_at', { ascending: false })
    .limit(5)
  return data || []
}

export default async function ContentPilotPage() {
  const [stats, articles] = await Promise.all([getStats(), getRecentArticles()])
  const lastRun = stats.lastRunData

  const statCards = [
    {
      label: 'Articles This Week',
      value: stats.articlesThisWeek,
      icon: BookOpen,
      color: 'bg-sky-50 text-sky-600',
      href: '/admin/content-pilot/articles',
    },
    {
      label: 'Topics Remaining',
      value: stats.pendingTopics,
      icon: Target,
      color: 'bg-purple-50 text-purple-600',
      href: '/admin/content-pilot/topics',
    },
    {
      label: 'AI Cost (30 days)',
      value: `$${stats.totalCostMonth.toFixed(3)}`,
      icon: DollarSign,
      color: 'bg-green-50 text-green-600',
      href: '/admin/content-pilot/logs',
    },
    {
      label: 'Agent Logs',
      value: stats.recentLogs.length,
      icon: Activity,
      color: 'bg-orange-50 text-orange-600',
      href: '/admin/content-pilot/logs',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Bot className="w-7 h-7 text-purple-600" />
            ContentPilot AI
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            7 AI agent pipeline — SEO research → article → image → Instagram
          </p>
        </div>
        <RunPilotButton />
      </div>

      {/* Last run banner */}
      {lastRun && (
        <div className={`rounded-2xl p-5 border flex items-center gap-4 ${
          lastRun.status === 'done'
            ? 'bg-green-50 border-green-200'
            : lastRun.status === 'error'
            ? 'bg-red-50 border-red-200'
            : 'bg-amber-50 border-amber-200'
        }`}>
          {lastRun.status === 'done' ? (
            <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
          ) : lastRun.status === 'error' ? (
            <XCircle className="w-6 h-6 text-red-600 shrink-0" />
          ) : (
            <Clock className="w-6 h-6 text-amber-600 shrink-0 animate-spin" />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 text-sm">
              Last run: {lastRun.status === 'done' ? '✅ Success' : lastRun.status === 'error' ? '❌ Failed' : '⏳ Running'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {new Date(lastRun.created_at).toLocaleString('tr-TR')}
              {lastRun.duration_ms > 0 && ` · ${(lastRun.duration_ms / 1000).toFixed(1)}s`}
              {lastRun.output?.total_cost_usd && ` · $${Number(lastRun.output.total_cost_usd).toFixed(4)}`}
            </p>
            {lastRun.output?.article_id && (
              <p className="text-xs text-purple-600 mt-0.5 truncate">
                Article: {lastRun.output?.slug}
                {lastRun.output?.instagram_post_id && (
                  <span className="ml-2 text-pink-600">
                    · Instagram: {lastRun.output.instagram_post_id}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map(card => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{card.value}</div>
              <div className="text-sm text-slate-500">{card.label}</div>
            </Link>
          )
        })}
      </div>

      {/* Two columns: recent articles + recent logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Articles */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-600" />
              Recent Articles
            </h2>
            <Link href="/admin/content-pilot/articles" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
              View all →
            </Link>
          </div>

          {articles.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No articles yet. Run ContentPilot to generate your first article.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {articles.map(a => (
                <div key={a.id} className="px-6 py-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">{a.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {a.word_count ? `${a.word_count} words · ` : ''}
                      {new Date(a.created_at).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      a.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {a.status}
                    </span>
                    {a.slug && (
                      <a
                        href={`/blog/${a.slug}`}
                        target="_blank"
                        className="text-slate-400 hover:text-purple-600 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Agent Logs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-600" />
              Recent Agent Logs
            </h2>
            <Link href="/admin/content-pilot/logs" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
              View all →
            </Link>
          </div>

          {stats.recentLogs.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              <Activity className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No agent runs yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats.recentLogs.map((log: any) => (
                <div key={log.id} className="px-6 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    log.status === 'done' ? 'bg-green-500' :
                    log.status === 'error' ? 'bg-red-500' :
                    'bg-amber-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        log.agent === 'orchestrator' ? 'bg-purple-100 text-purple-700' :
                        log.agent === 'seo' ? 'bg-blue-100 text-blue-700' :
                        log.agent === 'writer' ? 'bg-sky-100 text-sky-700' :
                        log.agent === 'image' ? 'bg-green-100 text-green-700' :
                        log.agent === 'social' ? 'bg-pink-100 text-pink-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {log.agent}
                      </span>
                      <span className="text-xs text-slate-500">{log.action}</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">
                    {new Date(log.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
