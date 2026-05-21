import Link from 'next/link'
import {
  CalendarCheck, Instagram, FileText, Megaphone,
  Search, Bot, Clock, Image as ImageIcon, Film, BookImage, Tv2
} from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

async function getPendingCount() {
  const supabase = getSupabase()
  const { count } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')
  return count || 0
}

async function getScheduledPosts() {
  const supabase = getSupabase()
  const now = new Date()
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  const { data } = await supabase
    .from('instagram_posts')
    .select('id, caption, scheduled_at, post_type, image_url, status')
    .eq('status', 'scheduled')
    .gte('scheduled_at', now.toISOString())
    .lte('scheduled_at', in30Days.toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(20)

  return data || []
}

const sections = [
  {
    href: '/admin/bookings',
    label: 'Bookings',
    description: 'Rezervasyonları gör ve yönet',
    icon: CalendarCheck,
    color: 'bg-orange-50 text-orange-500',
    border: 'border-orange-100 hover:border-orange-300',
  },
  {
    href: '/admin/instagram',
    label: 'Instagram',
    description: 'Post, Reel, Story ve Carousel paylaş',
    icon: Instagram,
    color: 'bg-pink-50 text-pink-500',
    border: 'border-pink-100 hover:border-pink-300',
  },
  {
    href: '/admin/blog',
    label: 'Blog',
    description: 'Makale yaz ve yayınla',
    icon: FileText,
    color: 'bg-sky-50 text-sky-500',
    border: 'border-sky-100 hover:border-sky-300',
  },
  {
    href: '/admin/meta-ads',
    label: 'Meta Ads',
    description: 'Facebook ve Instagram reklamları',
    icon: Megaphone,
    color: 'bg-blue-50 text-blue-500',
    border: 'border-blue-100 hover:border-blue-300',
  },
  {
    href: '/admin/google-ads',
    label: 'Google Ads',
    description: 'Google arama ve görüntülü reklamlar',
    icon: Search,
    color: 'bg-green-50 text-green-500',
    border: 'border-green-100 hover:border-green-300',
  },
  {
    href: '/admin/content-pilot',
    label: 'ContentPilot AI',
    description: 'Yapay zeka ile içerik üret',
    icon: Bot,
    color: 'bg-purple-50 text-purple-500',
    border: 'border-purple-100 hover:border-purple-300',
  },
]

const POST_TYPE_ICON: Record<string, React.ReactNode> = {
  image:    <ImageIcon className="w-3.5 h-3.5" />,
  reel:     <Film className="w-3.5 h-3.5" />,
  story:    <Tv2 className="w-3.5 h-3.5" />,
  carousel: <BookImage className="w-3.5 h-3.5" />,
}

const POST_TYPE_COLOR: Record<string, string> = {
  image:    'bg-orange-100 text-orange-700',
  reel:     'bg-purple-100 text-purple-700',
  story:    'bg-sky-100 text-sky-700',
  carousel: 'bg-green-100 text-green-700',
}

function groupByDay(posts: any[]) {
  const groups: Record<string, any[]> = {}
  for (const post of posts) {
    const day = new Date(post.scheduled_at).toLocaleDateString('tr-TR', {
      weekday: 'long', day: 'numeric', month: 'long'
    })
    if (!groups[day]) groups[day] = []
    groups[day].push(post)
  }
  return groups
}

export default async function AdminDashboard() {
  const [pending, scheduledPosts] = await Promise.all([
    getPendingCount(),
    getScheduledPosts(),
  ])

  const grouped = groupByDay(scheduledPosts)
  const days = Object.keys(grouped)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Pending alert */}
      {pending > 0 && (
        <Link href="/admin/bookings?status=pending"
          className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-6 hover:bg-amber-100 transition-colors">
          <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="font-semibold text-amber-800">
              {pending} bekleyen rezervasyon var
            </p>
            <p className="text-sm text-amber-600">Onay için tıkla →</p>
          </div>
        </Link>
      )}

      {/* Section cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {sections.map(({ href, label, description, icon: Icon, color, border }) => (
          <Link
            key={href}
            href={href}
            className={`bg-white rounded-2xl border-2 ${border} p-6 flex flex-col gap-4 transition-all hover:shadow-md`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-lg">{label}</p>
              <p className="text-sm text-slate-500 mt-0.5">{description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Scheduled Posts Calendar */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <h2 className="font-bold text-slate-900">Zamanlanmış Postlar</h2>
            {scheduledPosts.length > 0 && (
              <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                {scheduledPosts.length}
              </span>
            )}
          </div>
          <Link href="/admin/instagram" className="text-sm text-orange-500 hover:text-orange-600 font-semibold transition-colors">
            + Yeni post →
          </Link>
        </div>

        {days.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Instagram className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-slate-400 text-sm">Henüz zamanlanmış post yok</p>
            <Link href="/admin/instagram" className="text-orange-500 text-sm font-semibold hover:underline mt-1 inline-block">
              Instagram'a git ve bir post zamanla →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {days.map(day => (
              <div key={day} className="px-6 py-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 capitalize">{day}</p>
                <div className="space-y-2">
                  {grouped[day].map((post: any) => {
                    const time = new Date(post.scheduled_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
                    const type = post.post_type || 'image'
                    return (
                      <Link
                        key={post.id}
                        href="/admin/instagram"
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        {/* Thumbnail */}
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                          {post.image_url ? (
                            <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              {POST_TYPE_ICON[type]}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-700 truncate group-hover:text-slate-900">
                            {post.caption || '(caption yok)'}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded-md ${POST_TYPE_COLOR[type]}`}>
                              {POST_TYPE_ICON[type]}
                              <span className="capitalize">{type}</span>
                            </span>
                          </div>
                        </div>

                        {/* Time */}
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-slate-700">{time}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
