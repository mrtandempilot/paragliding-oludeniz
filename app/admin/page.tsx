import { createClient } from '@supabase/supabase-js'
import DashboardPilotControl from './DashboardPilotControl'
import DashboardSocialPanel from './DashboardSocialPanel'
import DashboardCronPanel from './DashboardCronPanel'
import DashboardActivityPanel from './DashboardActivityPanel'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export default async function AdminDashboardPage() {
  const supabase = getSupabase()
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [settingsRes, lastRunRes, todayCostRes, pendingTopicsRes, articlesRes, recentLogsRes, recentArticlesRes] =
    await Promise.allSettled([
      supabase.from('settings').select('key,value').in('key', ['pilot_enabled', 'pilot_slots']),
      supabase.from('agent_logs').select('*').eq('agent', 'orchestrator').order('created_at', { ascending: false }).limit(1).single(),
      supabase.from('usage_logs').select('cost_usd').gte('created_at', todayStart),
      supabase.from('topics').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('articles').select('id', { count: 'exact', head: true }).gte('created_at', weekAgo),
      supabase.from('agent_logs').select('id,agent,action,status,created_at').order('created_at', { ascending: false }).limit(8),
      supabase.from('articles').select('id,title,slug,hero_image_url,created_at,status').eq('status', 'published').order('created_at', { ascending: false }).limit(4),
    ])

  const settings: Record<string, string> = {}
  if (settingsRes.status === 'fulfilled' && settingsRes.value.data) {
    for (const row of settingsRes.value.data) settings[row.key] = row.value
  }
  const pilotEnabled = settings['pilot_enabled'] === 'true'
  const pilotSlots = settings['pilot_slots']
    ? settings['pilot_slots'].split(',').map(s => s.trim()).filter(Boolean)
    : ['06:00', '12:00', '18:00']

  const lastRun = lastRunRes.status === 'fulfilled' ? lastRunRes.value.data : null
  const todayCost = todayCostRes.status === 'fulfilled' && todayCostRes.value.data
    ? (todayCostRes.value.data as any[]).reduce((sum, r) => sum + (r.cost_usd || 0), 0)
    : 0
  const pendingTopics = pendingTopicsRes.status === 'fulfilled' ? (pendingTopicsRes.value.count || 0) : 0
  const articlesThisWeek = articlesRes.status === 'fulfilled' ? (articlesRes.value.count || 0) : 0
  const recentLogs = recentLogsRes.status === 'fulfilled' && recentLogsRes.value.data
    ? recentLogsRes.value.data : []
  const recentArticlesRaw = recentArticlesRes.status === 'fulfilled' && recentArticlesRes.value.data
    ? recentArticlesRes.value.data : []
  const recentArticles = recentArticlesRaw.map((a: any) => ({
    ...a,
    image_url: a.hero_image_url,
  }))

  // ── Instagram / Social stats ────────────────────────────────────────────
  const [
    postedWeekRes, postedMonthRes, draftsRes, scheduledRes,
    failedRes, recentPostedRes, nextScheduledRes, typeBreakdownRes, lastPostedRes,
  ] = await Promise.allSettled([
    supabase.from('instagram_posts').select('id', { count: 'exact', head: true }).eq('status', 'posted').gte('posted_at', weekAgo),
    supabase.from('instagram_posts').select('id', { count: 'exact', head: true }).eq('status', 'posted').gte('posted_at', monthAgo),
    supabase.from('instagram_posts').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('instagram_posts').select('id', { count: 'exact', head: true }).eq('status', 'scheduled'),
    supabase.from('instagram_posts').select('id,caption,post_type,notes').eq('status', 'failed').order('created_at', { ascending: false }).limit(5),
    supabase.from('instagram_posts').select('id,image_url,caption,post_type,posted_at,instagram_id').eq('status', 'posted').order('posted_at', { ascending: false }).limit(4),
    supabase.from('instagram_posts').select('id,caption,image_url,scheduled_at').eq('status', 'scheduled').gte('scheduled_at', now.toISOString()).order('scheduled_at', { ascending: true }).limit(1).single(),
    supabase.from('instagram_posts').select('post_type').eq('status', 'posted').gte('posted_at', monthAgo),
    supabase.from('instagram_posts').select('posted_at').eq('status', 'posted').order('posted_at', { ascending: false }).limit(1).single(),
  ])

  const postedThisWeek = postedWeekRes.status === 'fulfilled' ? (postedWeekRes.value.count || 0) : 0
  const postedThisMonth = postedMonthRes.status === 'fulfilled' ? (postedMonthRes.value.count || 0) : 0
  const draftsCount = draftsRes.status === 'fulfilled' ? (draftsRes.value.count || 0) : 0
  const scheduledCount = scheduledRes.status === 'fulfilled' ? (scheduledRes.value.count || 0) : 0
  const failedPosts = failedRes.status === 'fulfilled' && failedRes.value.data ? failedRes.value.data : []
  const recentPosted = recentPostedRes.status === 'fulfilled' && recentPostedRes.value.data ? recentPostedRes.value.data : []
  const nextScheduled = nextScheduledRes.status === 'fulfilled' ? nextScheduledRes.value.data : null

  const typeBreakdown: Record<string, number> = {}
  if (typeBreakdownRes.status === 'fulfilled' && typeBreakdownRes.value.data) {
    for (const row of typeBreakdownRes.value.data as any[]) {
      const t = row.post_type || 'image'
      typeBreakdown[t] = (typeBreakdown[t] || 0) + 1
    }
  }

  let postingGapDays = 0
  if (lastPostedRes.status === 'fulfilled' && lastPostedRes.value.data) {
    const lastPostedAt = (lastPostedRes.value.data as any).posted_at
    if (lastPostedAt) postingGapDays = Math.floor((Date.now() - new Date(lastPostedAt).getTime()) / 86400000)
  }

  const postStats = {
    postedThisWeek, postedThisMonth, draftsCount, scheduledCount,
    failedPosts, recentPosted, nextScheduled, typeBreakdown, postingGapDays,
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Merhaba Ceyhun 👋</h1>
        <p className="text-slate-500 mt-1">İşte bugünün özeti</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <DashboardPilotControl
          initialEnabled={pilotEnabled}
          initialSlots={pilotSlots}
          lastRun={lastRun}
          todayCost={todayCost}
          pendingTopics={pendingTopics}
          articlesThisWeek={articlesThisWeek}
          recentLogs={recentLogs}
        />
        <DashboardSocialPanel stats={postStats} />
        <DashboardActivityPanel
          articles={recentArticles as any[]}
          instaPosts={recentPosted as any[]}
        />
      </div>

      <DashboardCronPanel />
    </div>
  )
}
