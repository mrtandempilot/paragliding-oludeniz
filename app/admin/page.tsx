export const dynamic = 'force-dynamic'

import Link from 'next/link'
import {
  CalendarCheck, Instagram, FileText, Megaphone,
  Search, Bot,
  TrendingUp, TrendingDown, Users, Euro, CalendarDays, AlertCircle,
  CheckCircle2, Wind, CloudSun, Phone, MessageCircle,
  PlusCircle, ExternalLink, BarChart3, Sparkles, MapPin, Sunrise,
  Sunset, ArrowUpRight, Plane
} from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import DashboardPilotControl from './DashboardPilotControl'
import DashboardSocialPanel from './DashboardSocialPanel'
import DashboardCronPanel from './DashboardCronPanel'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// ----- DATE HELPERS -----
function startOfDay(d: Date) {
  const r = new Date(d); r.setHours(0,0,0,0); return r
}
function endOfDay(d: Date) {
  const r = new Date(d); r.setHours(23,59,59,999); return r
}
function addDays(d: Date, n: number) {
  const r = new Date(d); r.setDate(r.getDate() + n); return r
}
function fmtDate(d: Date) {
  return d.toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' })
}
function fmtTime(s: string) {
  return new Date(s).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
}

// ----- DATA FETCHERS -----
async function getDashboardData() {
  const supabase = getSupabase()
  const now = new Date()
  const today = startOfDay(now)
  const tomorrow = addDays(today, 1)
  const weekStart = startOfDay(addDays(now, -7))
  const monthStart = startOfDay(addDays(now, -30))
  const prevMonthStart = startOfDay(addDays(now, -60))
  const next7Days = endOfDay(addDays(now, 7))
  const in30Days = addDays(now, 30)

  const [
    allBookings,
    todayBookings,
    upcomingBookings,
    scheduledPosts,
    recentBookings,
    articlesCount,
    pendingTopics,
    // Social media stats
    monthPosts,           // All posts in last 30 days for breakdown
    failedPosts,          // Failed in last 7 days
    draftsCount,
    scheduledCount,
    recentPosted,         // Last 6 posted
    nextScheduled,        // Next single scheduled
    // Top posts by engagement
    topPostsRaw,
    // Agent / ContentPilot stats
    settings,
    lastOrchestratorRun,
    recentAgentLogs,
    todayUsage,
  ] = await Promise.all([
    // All bookings in last 60 days for trend & status counts
    supabase
      .from('bookings')
      .select('id, created_at, flight_date, flight_type, guests, total_price, status, first_name, last_name')
      .gte('created_at', prevMonthStart.toISOString()),
    // Today's confirmed/pending bookings
    supabase
      .from('bookings')
      .select('id, first_name, last_name, flight_type, flight_date, guests, total_price, status, phone, email')
      .gte('flight_date', today.toISOString())
      .lt('flight_date', tomorrow.toISOString())
      .neq('status', 'cancelled')
      .order('flight_date', { ascending: true }),
    // Next 7 days bookings (excluding today)
    supabase
      .from('bookings')
      .select('id, first_name, last_name, flight_type, flight_date, guests, total_price, status')
      .gte('flight_date', tomorrow.toISOString())
      .lte('flight_date', next7Days.toISOString())
      .neq('status', 'cancelled')
      .order('flight_date', { ascending: true }),
    // Scheduled Instagram posts
    supabase
      .from('instagram_posts')
      .select('id, caption, scheduled_at, post_type, image_url, status')
      .eq('status', 'scheduled')
      .gte('scheduled_at', now.toISOString())
      .lte('scheduled_at', in30Days.toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(10),
    // Recent bookings (newest 6)
    supabase
      .from('bookings')
      .select('id, created_at, first_name, last_name, flight_type, flight_date, guests, total_price, status')
      .order('created_at', { ascending: false })
      .limit(6),
    // Articles count (last 7 days)
    supabase
      .from('articles')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', weekStart.toISOString()),
    // Pending topics
    supabase
      .from('topics')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),
    // Posts in last 30 days (for type breakdown + last posted)
    supabase
      .from('instagram_posts')
      .select('id, post_type, status, posted_at')
      .eq('status', 'posted')
      .gte('posted_at', monthStart.toISOString()),
    // Failed posts in last 7 days
    supabase
      .from('instagram_posts')
      .select('id, caption, post_type, image_url, scheduled_at, notes')
      .eq('status', 'failed')
      .gte('created_at', weekStart.toISOString())
      .order('created_at', { ascending: false })
      .limit(5),
    // Draft count
    supabase
      .from('instagram_posts')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'draft'),
    // Scheduled count (all future)
    supabase
      .from('instagram_posts')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'scheduled')
      .gte('scheduled_at', now.toISOString()),
    // Last 6 posted (for thumbnail strip)
    supabase
      .from('instagram_posts')
      .select('id, caption, post_type, image_url, posted_at, instagram_id')
      .eq('status', 'posted')
      .order('posted_at', { ascending: false })
      .limit(6),
    // Top posts by likes (analytics)
    supabase
      .from('instagram_posts')
      .select('id, caption, image_url, post_type, posted_at, instagram_id, likes, comments, reach, impressions, saves')
      .eq('status', 'posted')
      .gt('likes', 0)
      .order('likes', { ascending: false })
      .limit(5),
    // Next scheduled (single)
    supabase
      .from('instagram_posts')
      .select('id, caption, post_type, image_url, scheduled_at')
      .eq('status', 'scheduled')
      .gte('scheduled_at', now.toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(1)
      .maybeSingle(),
    // Top 5 posts by likes
    supabase
      .from('instagram_posts')
      .select('id, caption, image_url, post_type, posted_at, instagram_id, likes, comments, reach, impressions, saves')
      .eq('status', 'posted')
      .order('likes', { ascending: false })
      .limit(5),
    // Settings (pilot_enabled, slots)
    supabase
      .from('settings')
      .select('key, value')
      .in('key', ['pilot_enabled', 'pilot_active_slots']),
    // Last orchestrator run
    supabase
      .from('agent_logs')
      .select('*')
      .eq('agent', 'orchestrator')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    // Last 5 agent logs
    supabase
      .from('agent_logs')
      .select('id, agent, action, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    // Today's AI usage cost
    supabase
      .from('usage_logs')
      .select('cost_usd')
      .gte('created_at', today.toISOString()),
  ])

  return {
    allBookings: allBookings.data || [],
    todayBookings: todayBookings.data || [],
    upcomingBookings: upcomingBookings.data || [],
    scheduledPosts: scheduledPosts.data || [],
    recentBookings: recentBookings.data || [],
    articlesCount: articlesCount.count || 0,
    pendingTopics: pendingTopics.count || 0,
    // Social
    monthPosts: monthPosts.data || [],
    failedPosts: failedPosts.data || [],
    draftsCount: draftsCount.count || 0,
    scheduledCount: scheduledCount.count || 0,
    recentPosted: recentPosted.data || [],
    nextScheduled: nextScheduled.data || null,
    topPosts: topPostsRaw.data || [],
    // Agent
    settings: settings.data || [],
    lastOrchestratorRun: lastOrchestratorRun.data || null,
    recentAgentLogs: recentAgentLogs.data || [],
    todayUsage: todayUsage.data || [],
  }
}

// Calculate posting gap (days since last post)
function calcPostingGap(monthPosts: any[]): number {
  if (!monthPosts.length) return 999
  const lastPost = monthPosts
    .filter(p => p.posted_at)
    .sort((a, b) => new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime())[0]
  if (!lastPost) return 999
  const diff = Date.now() - new Date(lastPost.posted_at).getTime()
  return Math.floor(diff / (24 * 60 * 60 * 1000))
}

// ----- COMPUTED METRICS -----
function calcMetrics(allBookings: any[]) {
  const now = new Date()
  const today = startOfDay(now)
  const tomorrow = addDays(today, 1)
  const weekStart = startOfDay(addDays(now, -7))
  const monthStart = startOfDay(addDays(now, -30))
  const prevMonthStart = startOfDay(addDays(now, -60))

  const inRange = (b: any, start: Date, end: Date, field: string = 'created_at') => {
    const d = new Date(b[field])
    return d >= start && d < end
  }

  const todayBookings = allBookings.filter(b => inRange(b, today, tomorrow, 'created_at'))
  const weekBookings = allBookings.filter(b => inRange(b, weekStart, now, 'created_at'))
  const monthBookings = allBookings.filter(b => inRange(b, monthStart, now, 'created_at'))
  const prevMonthBookings = allBookings.filter(b => inRange(b, prevMonthStart, monthStart, 'created_at'))

  const sum = (arr: any[], field: string = 'total_price') => arr.reduce((s, x) => s + (Number(x[field]) || 0), 0)

  const monthRevenue = sum(monthBookings.filter(b => b.status !== 'cancelled'))
  const prevMonthRevenue = sum(prevMonthBookings.filter(b => b.status !== 'cancelled'))
  const revenueChange = prevMonthRevenue > 0
    ? Math.round(((monthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100)
    : (monthRevenue > 0 ? 100 : 0)

  const totalGuests = monthBookings.filter(b => b.status !== 'cancelled')
    .reduce((s, b) => s + (Number(b.guests) || 0), 0)

  const avgValue = monthBookings.length > 0
    ? Math.round(monthRevenue / monthBookings.filter(b => b.status !== 'cancelled').length || 0)
    : 0

  const statusCounts = {
    pending: allBookings.filter(b => b.status === 'pending').length,
    confirmed: allBookings.filter(b => b.status === 'confirmed').length,
    completed: allBookings.filter(b => b.status === 'completed').length,
    cancelled: allBookings.filter(b => b.status === 'cancelled').length,
  }

  // Flight type distribution (this month)
  const flightTypes: Record<string, number> = {}
  monthBookings.forEach(b => {
    const t = b.flight_type || 'standard'
    flightTypes[t] = (flightTypes[t] || 0) + 1
  })

  // Last 14 days daily revenue for sparkline
  const dailyRevenue: { date: string; revenue: number; bookings: number }[] = []
  for (let i = 13; i >= 0; i--) {
    const day = startOfDay(addDays(now, -i))
    const dayEnd = addDays(day, 1)
    const dayBookings = allBookings.filter(b => inRange(b, day, dayEnd, 'created_at') && b.status !== 'cancelled')
    dailyRevenue.push({
      date: day.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }),
      revenue: sum(dayBookings),
      bookings: dayBookings.length,
    })
  }

  return {
    todayBookingsCount: todayBookings.length,
    weekBookingsCount: weekBookings.length,
    monthBookingsCount: monthBookings.length,
    monthRevenue,
    revenueChange,
    totalGuests,
    avgValue,
    statusCounts,
    flightTypes,
    dailyRevenue,
  }
}

// ----- CONSTANTS -----
const FLIGHT_LABELS: Record<string, string> = {
  standard: 'Standard 1200m',
  high: 'High 1700m',
  sunset: 'Sunset Flight',
}

const FLIGHT_COLORS: Record<string, string> = {
  standard: 'bg-sky-100 text-sky-700 border-sky-200',
  high: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  sunset: 'bg-orange-100 text-orange-700 border-orange-200',
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-slate-100 text-slate-700',
}

const sections = [
  { href: '/admin/bookings', label: 'Bookings', description: 'Rezervasyonları gör ve yönet', icon: CalendarCheck, color: 'bg-orange-50 text-orange-500', border: 'border-orange-100 hover:border-orange-300' },
  { href: '/admin/instagram', label: 'Instagram', description: 'Post, Reel, Story ve Carousel paylaş', icon: Instagram, color: 'bg-pink-50 text-pink-500', border: 'border-pink-100 hover:border-pink-300' },
  { href: '/admin/blog', label: 'Blog', description: 'Makale yaz ve yayınla', icon: FileText, color: 'bg-sky-50 text-sky-500', border: 'border-sky-100 hover:border-sky-300' },
  { href: '/admin/meta-ads', label: 'Meta Ads', description: 'Facebook ve Instagram reklamları', icon: Megaphone, color: 'bg-blue-50 text-blue-500', border: 'border-blue-100 hover:border-blue-300' },
  { href: '/admin/google-ads', label: 'Google Ads', description: 'Google arama ve görüntülü reklamlar', icon: Search, color: 'bg-green-50 text-green-500', border: 'border-green-100 hover:border-green-300' },
  { href: '/admin/content-pilot', label: 'ContentPilot AI', description: 'Yapay zeka ile içerik üret', icon: Bot, color: 'bg-purple-50 text-purple-500', border: 'border-purple-100 hover:border-purple-300' },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 6) return { text: 'İyi geceler', icon: '🌙' }
  if (h < 12) return { text: 'Günaydın', icon: '☀️' }
  if (h < 18) return { text: 'İyi günler', icon: '🪂' }
  if (h < 22) return { text: 'İyi akşamlar', icon: '🌅' }
  return { text: 'İyi geceler', icon: '🌙' }
}

// ----- MAIN COMPONENT -----
export default async function AdminDashboard() {
  let data
  try {
    data = await getDashboardData()
  } catch (e) {
    console.error('Dashboard data error:', e)
    data = {
      allBookings: [], todayBookings: [], upcomingBookings: [], scheduledPosts: [],
      recentBookings: [], articlesCount: 0, pendingTopics: 0, monthPosts: [],
      failedPosts: [], draftsCount: 0, scheduledCount: 0, recentPosted: [],
      nextScheduled: null, topPosts: [], settings: [], lastOrchestratorRun: null,
      recentAgentLogs: [], todayUsage: [],
    }
  }
  const metrics = calcMetrics(data.allBookings)
  const greeting = getGreeting()

  // ----- SOCIAL MEDIA STATS -----
  const postedThisWeek = data.monthPosts.filter(p => {
    if (!p.posted_at) return false
    return new Date(p.posted_at) >= startOfDay(addDays(new Date(), -7))
  }).length

  const typeBreakdown: Record<string, number> = {}
  data.monthPosts.forEach(p => {
    const t = p.post_type || 'image'
    typeBreakdown[t] = (typeBreakdown[t] || 0) + 1
  })

  const socialStats = {
    postedThisWeek,
    postedThisMonth: data.monthPosts.length,
    draftsCount: data.draftsCount,
    scheduledCount: data.scheduledCount,
    failedPosts: data.failedPosts,
    recentPosted: data.recentPosted,
    nextScheduled: data.nextScheduled,
    typeBreakdown,
    postingGapDays: calcPostingGap(data.monthPosts),
  }

  // ----- AGENT / PILOT STATS -----
  const settingsMap: Record<string, string> = {}
  for (const s of data.settings) settingsMap[(s as any).key] = (s as any).value
  const pilotEnabled = settingsMap['pilot_enabled'] !== 'false'
  const activeSlots = (settingsMap['pilot_active_slots'] || '06:00')
    .split(',').map(s => s.trim()).filter(Boolean)
  const todayCost = data.todayUsage.reduce((s: number, r: any) => s + (r.cost_usd || 0), 0)

  // Sun times (approximate for Ölüdeniz, varies seasonally — simple fixed estimate)
  const sunrise = '06:15'
  const sunset = '19:45'

  // Sparkline max
  const maxRevenue = Math.max(...metrics.dailyRevenue.map(d => d.revenue), 1)

  // Flight type distribution
  const totalFlightCount = Object.values(metrics.flightTypes).reduce((s, n) => s + n, 0) || 1
  const flightTypeData = Object.entries(metrics.flightTypes)
    .sort((a, b) => b[1] - a[1])

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span>{greeting.icon}</span>
            {greeting.text}, Mr Tan
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            <span className="mx-2">·</span>
            <Sunrise className="w-3.5 h-3.5 inline mb-0.5" /> {sunrise}
            <span className="mx-1.5 text-slate-300">|</span>
            <Sunset className="w-3.5 h-3.5 inline mb-0.5" /> {sunset}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/bookings"
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
            <PlusCircle className="w-4 h-4" /> Yeni Rezervasyon
          </Link>
          <a href="/" target="_blank"
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-xl border border-slate-200 transition-colors">
            <ExternalLink className="w-4 h-4" /> Site
          </a>
        </div>
      </div>

      {/* Pending alert */}
      {metrics.statusCounts.pending > 0 && (
        <Link href="/admin/bookings?status=pending"
          className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl px-5 py-4 hover:from-amber-100 hover:to-orange-100 transition-colors">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-amber-900">
              {metrics.statusCounts.pending} bekleyen rezervasyon onay bekliyor
            </p>
            <p className="text-sm text-amber-700">Müşterilere geri dönüş yap →</p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-amber-600" />
        </Link>
      )}

      {/* KPI CARDS - 4-column metric row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's bookings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
              <CalendarCheck className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-xs text-slate-400 font-medium">BUGÜN</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{data.todayBookings.length}</p>
          <p className="text-sm text-slate-500 mt-1">
            uçuş planlandı ·
            <span className="font-semibold text-slate-700"> {data.todayBookings.reduce((s, b) => s + (b.guests || 0), 0)}</span> kişi
          </p>
        </div>

        {/* This week's bookings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-sky-500" />
            </div>
            <span className="text-xs text-slate-400 font-medium">7 GÜN</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{metrics.weekBookingsCount}</p>
          <p className="text-sm text-slate-500 mt-1">yeni rezervasyon</p>
        </div>

        {/* Monthly revenue */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <Euro className="w-5 h-5 text-green-500" />
            </div>
            <span className={`text-xs font-semibold flex items-center gap-0.5 ${
              metrics.revenueChange >= 0 ? 'text-green-600' : 'text-red-500'
            }`}>
              {metrics.revenueChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {metrics.revenueChange >= 0 ? '+' : ''}{metrics.revenueChange}%
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900">€{metrics.monthRevenue.toLocaleString('tr-TR')}</p>
          <p className="text-sm text-slate-500 mt-1">son 30 gün ciro</p>
        </div>

        {/* Total guests */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <span className="text-xs text-slate-400 font-medium">30 GÜN</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{metrics.totalGuests}</p>
          <p className="text-sm text-slate-500 mt-1">
            misafir · ort.
            <span className="font-semibold text-slate-700"> €{metrics.avgValue}</span>
          </p>
        </div>
      </div>

      {/* Two columns: Revenue chart + Status breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Sparkline */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-slate-700" />
              <h2 className="font-bold text-slate-900">Son 14 Gün Ciro</h2>
            </div>
            <span className="text-sm font-semibold text-slate-700">
              €{metrics.dailyRevenue.reduce((s, d) => s + d.revenue, 0).toLocaleString('tr-TR')}
            </span>
          </div>

          <div className="flex items-end gap-1.5 h-32">
            {metrics.dailyRevenue.map((d, i) => {
              const h = maxRevenue > 0 ? (d.revenue / maxRevenue) * 100 : 0
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end group relative">
                  <div className="absolute -top-7 hidden group-hover:block bg-slate-900 text-white text-[10px] font-semibold px-2 py-1 rounded whitespace-nowrap z-10">
                    €{d.revenue} · {d.bookings} bk
                  </div>
                  <div
                    className={`w-full rounded-t-md transition-all ${
                      d.revenue > 0
                        ? 'bg-gradient-to-t from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500'
                        : 'bg-slate-100'
                    }`}
                    style={{ height: `${Math.max(h, 4)}%` }}
                  />
                </div>
              )
            })}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-slate-400">
            <span>{metrics.dailyRevenue[0]?.date}</span>
            <span>{metrics.dailyRevenue[Math.floor(metrics.dailyRevenue.length / 2)]?.date}</span>
            <span>{metrics.dailyRevenue[metrics.dailyRevenue.length - 1]?.date}</span>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-slate-700" />
            Rezervasyon Durumu
          </h2>
          <div className="space-y-3">
            {[
              { key: 'pending', label: 'Bekleyen', color: 'bg-amber-500', text: 'text-amber-700' },
              { key: 'confirmed', label: 'Onaylı', color: 'bg-green-500', text: 'text-green-700' },
              { key: 'completed', label: 'Tamamlandı', color: 'bg-slate-500', text: 'text-slate-700' },
              { key: 'cancelled', label: 'İptal', color: 'bg-red-500', text: 'text-red-700' },
            ].map(s => {
              const count = (metrics.statusCounts as any)[s.key]
              const total = Object.values(metrics.statusCounts).reduce((a, b) => a + b, 0) || 1
              const pct = Math.round((count / total) * 100)
              return (
                <Link
                  key={s.key}
                  href={`/admin/bookings?status=${s.key}`}
                  className="block hover:bg-slate-50 -mx-2 px-2 py-1 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${s.text}`}>{s.label}</span>
                    <span className="text-sm font-bold text-slate-900">{count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* ─── SOSYAL MEDYA + AGENT KONTROL ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardSocialPanel stats={socialStats} />
        <DashboardPilotControl
          initialEnabled={pilotEnabled}
          initialSlots={activeSlots}
          lastRun={data.lastOrchestratorRun as any}
          todayCost={todayCost}
          pendingTopics={data.pendingTopics}
          articlesThisWeek={data.articlesCount}
          recentLogs={data.recentAgentLogs}
        />
      </div>

      {/* ─── CRON JOB TAKVİMİ ─── */}
      <DashboardCronPanel />

      {/* Today's Schedule + Upcoming + Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's flights */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-50 rounded-xl flex items-center justify-center">
                <Plane className="w-4 h-4 text-orange-500" />
              </div>
              <h2 className="font-bold text-slate-900">Bugünün Uçuşları</h2>
              {data.todayBookings.length > 0 && (
                <span className="text-xs bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">
                  {data.todayBookings.length}
                </span>
              )}
            </div>
            <Link href="/admin/bookings" className="text-sm text-orange-500 hover:text-orange-600 font-semibold">
              Hepsi →
            </Link>
          </div>

          {data.todayBookings.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <CalendarCheck className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-slate-400 text-sm">Bugün için planlanmış uçuş yok</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {data.todayBookings.map((b: any) => {
                const type = b.flight_type || 'standard'
                const waMsg = encodeURIComponent(`Hi ${b.first_name}! Confirming your flight today. See you soon! — Atmos Paragliding`)
                return (
                  <div key={b.id} className="px-5 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors group">
                    <div className="text-center w-12 flex-shrink-0">
                      <p className="text-xs text-slate-400 font-medium">SAAT</p>
                      <p className="text-sm font-bold text-slate-700">{fmtTime(b.flight_date)}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate">
                        {b.first_name} {b.last_name}
                        <span className="ml-2 text-xs font-normal text-slate-500">· {b.guests} kişi</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${FLIGHT_COLORS[type]}`}>
                          {FLIGHT_LABELS[type] || type}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${STATUS_STYLES[b.status]}`}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-bold text-slate-900 mr-2">€{b.total_price}</p>
                      {b.phone && (
                        <a href={`https://wa.me/${b.phone.replace(/\D/g, '')}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 flex items-center justify-center transition-colors"
                          title="WhatsApp">
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      )}
                      {b.phone && (
                        <a href={`tel:${b.phone}`}
                          className="w-8 h-8 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-600 flex items-center justify-center transition-colors"
                          title="Call">
                          <Phone className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Weather widget */}
        <div className="bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700 rounded-2xl text-white p-5 shadow-sm relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -right-4 top-12 w-20 h-20 bg-white/10 rounded-full" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CloudSun className="w-5 h-5" />
                <h2 className="font-bold">Babadağ Hava</h2>
              </div>
              <Link href="/live-weather" target="_blank" className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg transition-colors">
                Canlı →
              </Link>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/80 mb-2">
              <MapPin className="w-3 h-3" />
              <span>Ölüdeniz · 1800m</span>
            </div>

            <p className="text-4xl font-bold mb-1">24°C</p>
            <p className="text-sm text-white/90 mb-4">Açık · Uçuş için ideal</p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/15 backdrop-blur rounded-lg px-3 py-2">
                <div className="flex items-center gap-1 text-white/70 mb-0.5">
                  <Wind className="w-3 h-3" /> Rüzgar
                </div>
                <p className="font-bold">12 km/h KB</p>
              </div>
              <div className="bg-white/15 backdrop-blur rounded-lg px-3 py-2">
                <div className="text-white/70 mb-0.5">Görüş</div>
                <p className="font-bold">10+ km</p>
              </div>
            </div>

            <Link href="/live-weather" target="_blank"
              className="block mt-3 text-center bg-white/20 hover:bg-white/30 rounded-lg py-2 text-xs font-semibold transition-colors">
              Detaylı tahmin & webcam
            </Link>
          </div>
        </div>
      </div>

      {/* Upcoming 7 days + Flight type chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming bookings (next 7 days) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-sky-50 rounded-xl flex items-center justify-center">
                <CalendarDays className="w-4 h-4 text-sky-500" />
              </div>
              <h2 className="font-bold text-slate-900">Önümüzdeki 7 Gün</h2>
              {data.upcomingBookings.length > 0 && (
                <span className="text-xs bg-sky-100 text-sky-700 font-bold px-2 py-0.5 rounded-full">
                  {data.upcomingBookings.length} uçuş
                </span>
              )}
            </div>
            <Link href="/admin/bookings" className="text-sm text-sky-500 hover:text-sky-600 font-semibold">
              Takvim →
            </Link>
          </div>

          {data.upcomingBookings.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-slate-400 text-sm">Önümüzdeki 7 gün için rezervasyon yok</p>
            </div>
          ) : (
            <div className="px-3 py-3">
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }).map((_, i) => {
                  const day = startOfDay(addDays(new Date(), i + 1))
                  const dayBookings = data.upcomingBookings.filter((b: any) => {
                    const bd = new Date(b.flight_date)
                    return startOfDay(bd).getTime() === day.getTime()
                  })
                  const total = dayBookings.reduce((s: number, b: any) => s + (b.guests || 0), 0)
                  return (
                    <Link
                      key={i}
                      href="/admin/bookings"
                      className={`rounded-xl border p-2.5 text-center transition-all hover:shadow ${
                        dayBookings.length > 0
                          ? 'bg-sky-50 border-sky-200 hover:border-sky-300'
                          : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <p className="text-[10px] font-semibold text-slate-500 uppercase">
                        {day.toLocaleDateString('tr-TR', { weekday: 'short' })}
                      </p>
                      <p className="text-lg font-bold text-slate-900 mt-0.5">
                        {day.getDate()}
                      </p>
                      <div className="mt-1.5 flex items-center justify-center gap-0.5">
                        {dayBookings.length > 0 ? (
                          <>
                            <span className="text-xs font-bold text-sky-700">{dayBookings.length}</span>
                            <Users className="w-2.5 h-2.5 text-slate-400" />
                            <span className="text-[10px] text-slate-500">{total}</span>
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-300">boş</span>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Flight Type Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Plane className="w-5 h-5 text-slate-700" />
            Uçuş Tipi (30 gün)
          </h2>
          {flightTypeData.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">Veri yok</p>
          ) : (
            <div className="space-y-3">
              {flightTypeData.map(([type, count]) => {
                const pct = Math.round((count / totalFlightCount) * 100)
                const colors: Record<string, string> = {
                  standard: 'bg-sky-500',
                  high: 'bg-indigo-500',
                  sunset: 'bg-orange-500',
                }
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">
                        {FLIGHT_LABELS[type] || type}
                      </span>
                      <span className="text-xs text-slate-500">
                        <span className="font-bold text-slate-900">{count}</span> · {pct}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${colors[type] || 'bg-slate-500'} transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ─── EN İYİ INSTAGRAM POSTLARI ─── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-100 to-orange-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-pink-600" />
            </div>
            <h2 className="font-bold text-slate-900">En İyi Instagram Postları</h2>
            <span className="text-xs bg-pink-100 text-pink-700 font-bold px-2 py-0.5 rounded-full">like sırası</span>
          </div>
          <Link href="/admin/instagram" className="text-sm text-pink-500 hover:text-pink-600 font-semibold">
            Hepsi →
          </Link>
        </div>

        {(data.topPosts as any[]).length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-slate-400 text-sm">Analytics verisi henüz yok — sistem her gün 13:00'da günceller.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {(data.topPosts as any[]).map((p: any, i: number) => {
              const engagement = (p.likes || 0) + (p.comments || 0) + (p.saves || 0)
              const reachRate = p.reach > 0 ? ((engagement / p.reach) * 100).toFixed(1) : '—'
              const medals = ['🥇', '🥈', '🥉', '4.', '5.']
              const igUrl = p.instagram_id ? `https://www.instagram.com/p/${p.instagram_id}/` : null
              return (
                <div key={p.id} className="px-5 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                  {/* Rank */}
                  <span className="text-base w-8 text-center flex-shrink-0 font-bold text-slate-500">
                    {medals[i]}
                  </span>

                  {/* Thumbnail */}
                  {p.image_url ? (
                    <img src={p.image_url} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-slate-100" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center">
                      <Instagram className="w-5 h-5 text-slate-300" />
                    </div>
                  )}

                  {/* Caption */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {p.caption || '(caption yok)'}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {p.posted_at && new Date(p.posted_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {' · '}
                      <span className="text-slate-500">Etkileşim {reachRate}%</span>
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-4 flex-shrink-0 text-xs">
                    <div className="text-center">
                      <p className="font-bold text-slate-900 text-base leading-none">
                        {(p.likes || 0).toLocaleString('tr-TR')}
                      </p>
                      <p className="text-slate-400 mt-0.5">like</p>
                    </div>
                    <div className="text-center hidden sm:block">
                      <p className="font-bold text-slate-900 text-base leading-none">
                        {(p.comments || 0).toLocaleString('tr-TR')}
                      </p>
                      <p className="text-slate-400 mt-0.5">yorum</p>
                    </div>
                    <div className="text-center hidden md:block">
                      <p className="font-bold text-slate-900 text-base leading-none">
                        {(p.reach || 0).toLocaleString('tr-TR')}
                      </p>
                      <p className="text-slate-400 mt-0.5">reach</p>
                    </div>
                    <div className="text-center hidden md:block">
                      <p className="font-bold text-slate-900 text-base leading-none">
                        {(p.saves || 0).toLocaleString('tr-TR')}
                      </p>
                      <p className="text-slate-400 mt-0.5">kaydet</p>
                    </div>
                    {igUrl && (
                      <a href={igUrl} target="_blank" rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg bg-pink-50 hover:bg-pink-100 flex items-center justify-center transition-colors"
                        title="Instagram'da gör">
                        <ExternalLink className="w-3.5 h-3.5 text-pink-500" />
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Recent activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent bookings feed */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Son Rezervasyonlar
            </h2>
            <Link href="/admin/bookings" className="text-sm text-orange-500 hover:text-orange-600 font-semibold">
              →
            </Link>
          </div>
          {data.recentBookings.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">Henüz rezervasyon yok</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {data.recentBookings.map((b: any) => (
                <div key={b.id} className="px-5 py-3 flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-orange-600">
                      {b.first_name?.[0]}{b.last_name?.[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">
                      {b.first_name} {b.last_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(b.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                      <span className="mx-1">·</span>
                      €{b.total_price}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${STATUS_STYLES[b.status]}`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 14-Day Publishing Calendar */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-pink-50 rounded-xl flex items-center justify-center">
                <Instagram className="w-4 h-4 text-pink-500" />
              </div>
              <h2 className="font-bold text-slate-900">14 Günlük Yayın Takvimi</h2>
              {data.scheduledPosts.length > 0 && (
                <span className="text-xs bg-pink-100 text-pink-700 font-bold px-2 py-0.5 rounded-full">
                  {data.scheduledPosts.length} planlandı
                </span>
              )}
            </div>
            <Link href="/admin/instagram" className="text-sm text-pink-500 hover:text-pink-600 font-semibold">
              + Yeni post →
            </Link>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: 14 }).map((_, i) => {
                const day = startOfDay(addDays(new Date(), i))
                const isToday = i === 0
                const dayPosts = data.scheduledPosts.filter((p: any) => {
                  const pd = new Date(p.scheduled_at)
                  return startOfDay(pd).getTime() === day.getTime()
                })
                return (
                  <Link
                    key={i}
                    href="/admin/instagram"
                    className={`group relative rounded-lg border p-2 min-h-[68px] transition-all hover:shadow ${
                      isToday
                        ? 'bg-pink-50 border-pink-300'
                        : dayPosts.length > 0
                          ? 'bg-white border-pink-100 hover:border-pink-200'
                          : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-baseline justify-between">
                      <p className={`text-[10px] font-semibold uppercase ${
                        isToday ? 'text-pink-700' : 'text-slate-500'
                      }`}>
                        {day.toLocaleDateString('tr-TR', { weekday: 'short' })}
                      </p>
                      <p className={`text-sm font-bold ${
                        isToday ? 'text-pink-900' : 'text-slate-700'
                      }`}>
                        {day.getDate()}
                      </p>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-0.5">
                      {(Array.isArray(dayPosts) ? dayPosts : []).slice(0, 4).map((p: any) => {
                        const type = p.post_type || 'image'
                        const bg = type === 'image' ? 'bg-orange-400' :
                                  type === 'reel' ? 'bg-purple-500' :
                                  type === 'story' ? 'bg-sky-500' : 'bg-green-500'
                        return (
                          <div key={p.id}
                            className={`w-3 h-3 rounded-sm ${bg}`}
                            title={`${type}: ${p.caption?.slice(0, 40) || ''}`}
                          />
                        )
                      })}
                      {dayPosts.length > 4 && (
                        <span className="text-[9px] font-bold text-slate-500">+{dayPosts.length - 4}</span>
                      )}
                    </div>
                    {dayPosts.length === 0 && !isToday && i < 7 && (
                      <p className="text-[9px] text-slate-300 mt-1">boş</p>
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-orange-400" /> Photo</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-purple-500" /> Reel</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-sky-500" /> Story</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-green-500" /> Carousel</span>
              <span className="ml-auto text-slate-400">
                {(() => {
                  const empty = Array.from({ length: 14 }).filter((_, i) => {
                    const day = startOfDay(addDays(new Date(), i))
                    return !data.scheduledPosts.some((p: any) => {
                      const pd = new Date(p.scheduled_at)
                      return startOfDay(pd).getTime() === day.getTime()
                    })
                  }).length
                  return `${14 - empty}/14 gün dolu`
                })()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section cards - quick navigation */}
      <div>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Hızlı Erişim</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {sections.map(({ href, label, icon: Icon, color, border }) => (
            <Link
              key={href}
              href={href}
              className={`bg-white rounded-xl border ${border} p-4 flex flex-col items-center text-center gap-2 transition-all hover:shadow-md`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="font-semibold text-slate-900 text-sm">{label}</p>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
