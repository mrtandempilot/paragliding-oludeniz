import { getSupabase, istanbulDate, getSearchConsole, getBabadagWindLadder } from '@/lib/admin/dashboard-data'
import CommandCenter from './CommandCenter'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminDashboardPage() {
  const supabase = getSupabase()
  const today = istanbulDate(0)
  const in7 = istanbulDate(7)
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()
  const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString()
  const todayStartIso = new Date(`${today}T00:00:00+03:00`).toISOString()
  const [y, m] = today.split('-').map(Number)
  const calStart = `${y}-${String(m).padStart(2, '0')}-01`
  const calEndDate = new Date(Date.UTC(y, m + 1, 0)) // last day of next month
  const calEnd = calEndDate.toISOString().slice(0, 10)

  const q = await Promise.allSettled([
    /* 0 */ supabase.from('bookings').select('*').gte('flight_date', today).lte('flight_date', in7).neq('status', 'cancelled').order('flight_date', { ascending: true }).limit(40),
    /* 1 */ supabase.from('bookings').select('id,first_name,last_name,flight_date,flight_type,guests,total_price,status,created_at').gte('created_at', monthAgo).order('created_at', { ascending: false }),
    /* 2 */ supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'pending').lt('flight_date', today),
    /* 3 */ supabase.from('settings').select('key,value').in('key', ['pilot_enabled', 'pilot_slots', 'dm_general_enabled', 'dm_keyword_enabled', 'dm_keywords']),
    /* 4 */ supabase.from('agent_logs').select('agent,action,status,error,created_at').order('created_at', { ascending: false }).limit(60),
    /* 5 */ supabase.from('usage_logs').select('cost_usd,created_at').gte('created_at', monthAgo),
    /* 6 */ supabase.from('topics').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    /* 7 */ supabase.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'published').gte('created_at', weekAgo),
    /* 8 */ supabase.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    /* 9 */ supabase.from('instagram_posts').select('id', { count: 'exact', head: true }).eq('status', 'posted').gte('posted_at', weekAgo),
    /* 10 */ supabase.from('instagram_posts').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
    /* 11 */ supabase.from('instagram_posts').select('id', { count: 'exact', head: true }).eq('status', 'scheduled'),
    /* 12 */ supabase.from('instagram_posts').select('id', { count: 'exact', head: true }).eq('status', 'failed'),
    /* 13 */ supabase.from('instagram_posts').select('posted_at').eq('status', 'posted').order('posted_at', { ascending: false }).limit(1),
    /* 14 */ supabase.from('articles').select('title,slug,created_at').eq('status', 'published').order('created_at', { ascending: false }).limit(3),
    /* 15 */ getBabadagWindLadder(),
    /* 16 */ supabase.from('bookings').select('flight_date,guests,status').gte('flight_date', calStart).lte('flight_date', calEnd).neq('status', 'cancelled').limit(1000),
    /* 17 */ supabase.from('agent_logs').select('status').gte('created_at', weekAgo).limit(2000),
    /* 18 */ supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
    /* 19 */ getSearchConsole(),
    /* 20 */ supabase.from('bookings').select('*').eq('status', 'pending').gte('flight_date', today).order('flight_date', { ascending: true }).limit(20),
  ])
  const val = (i: number): any => (q[i].status === 'fulfilled' ? (q[i] as PromiseFulfilledResult<any>).value : null)
  const data = (i: number): any[] => val(i)?.data || []
  const count = (i: number): number => val(i)?.count || 0

  const upcoming = data(0)
  const month = data(1)
  const live = month.filter((b: any) => b.status !== 'cancelled')
  const weekStart = Date.now() - 7 * 86400000
  const statusCounts: Record<string, number> = {}
  for (const b of month) statusCounts[b.status] = (statusCounts[b.status] || 0) + 1
  const typeCounts: Record<string, number> = {}
  for (const b of live) typeCounts[b.flight_type || 'standard'] = (typeCounts[b.flight_type || 'standard'] || 0) + (b.guests || 1)

  const bookings = {
    todayFlights: upcoming.filter((b: any) => (b.flight_date || '').slice(0, 10) === today),
    upcoming,
    pendingList: data(20),
    newToday: live.filter((b: any) => new Date(b.created_at) >= new Date(todayStartIso)).length,
    newWeek: live.filter((b: any) => new Date(b.created_at).getTime() >= weekStart).length,
    newMonth: live.length,
    guestsMonth: live.reduce((s: number, b: any) => s + (b.guests || 1), 0),
    revenueMonth: live.reduce((s: number, b: any) => s + (Number(b.total_price) || 0), 0),
    pending: upcoming.filter((x: any) => x.status === 'pending').length,
    stalePending: count(2),
    statusCounts,
    typeCounts,
    recent: month.slice(0, 6),
  }

  const calendar: Record<string, { bookings: number; guests: number; pending: number }> = {}
  for (const b of data(16)) {
    const d = String(b.flight_date || '').slice(0, 10)
    if (!d) continue
    const c = (calendar[d] ||= { bookings: 0, guests: 0, pending: 0 })
    c.bookings++; c.guests += b.guests || 1; if (b.status === 'pending') c.pending++
  }

  const settings: Record<string, string> = {}
  for (const r of data(3)) settings[r.key] = r.value

  const agentMap: Record<string, any> = {}
  for (const l of data(4)) if (!agentMap[l.agent]) agentMap[l.agent] = l
  const runs7: Record<string, number> = {}
  for (const l of data(17)) runs7[l.status || 'unknown'] = (runs7[l.status || 'unknown'] || 0) + 1

  const usage = data(5)
  const cost = (since: number) => usage.filter((u: any) => new Date(u.created_at).getTime() >= since).reduce((s: number, u: any) => s + (u.cost_usd || 0), 0)

  const lastPosted = data(13)[0]?.posted_at || null

  return (
    <CommandCenter
      today={today}
      weather={val(15)}
      bookings={bookings}
      calendar={{ start: calStart, end: calEnd, days: calendar }}
      pilot={{
        enabled: settings['pilot_enabled'] === 'true',
        slots: (settings['pilot_slots'] || '06:00,12:00,18:00').split(',').map(s => s.trim()).filter(Boolean),
        costToday: cost(new Date(todayStartIso).getTime()),
        cost7: cost(weekStart),
        cost30: cost(Date.now() - 30 * 86400000),
        pendingTopics: count(6),
        articlesWeek: count(7),
        articlesTotal: count(8),
        blogPosts: count(18),
        latestArticles: data(14),
        runs7,
      }}
      dm={{
        general: settings['dm_general_enabled'] === 'true',
        keyword: settings['dm_keyword_enabled'] === 'true',
        keywords: (settings['dm_keywords'] || '').split(',').map(s => s.trim()).filter(Boolean),
      }}
      instagram={{
        postedWeek: count(9), drafts: count(10), scheduled: count(11), failed: count(12),
        gapDays: lastPosted ? Math.floor((Date.now() - new Date(lastPosted).getTime()) / 86400000) : null,
      }}
      gsc={val(19) || { daily: [], queries: [], pages: [], error: 'Search Console verisi alınamadı' }}
      agents={Object.values(agentMap)}
    />
  )
}
