import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { CalendarCheck, FileText, Instagram, Clock, CheckCircle, XCircle } from 'lucide-react'

async function getStats() {
  const [reservations, blogs, instagram] = await Promise.all([
    supabase.from('reservations').select('status'),
    supabase.from('blog_posts').select('published'),
    supabase.from('instagram_posts').select('status'),
  ])

  const res = reservations.data || []
  const pending = res.filter(r => r.status === 'pending').length
  const confirmed = res.filter(r => r.status === 'confirmed').length
  const total = res.length

  const publishedBlogs = (blogs.data || []).filter(b => b.published).length
  const draftBlogs = (blogs.data || []).filter(b => !b.published).length

  const scheduledIG = (instagram.data || []).filter(i => i.status === 'scheduled').length
  const postedIG = (instagram.data || []).filter(i => i.status === 'posted').length

  return { pending, confirmed, total, publishedBlogs, draftBlogs, scheduledIG, postedIG }
}

async function getRecentReservations() {
  const { data } = await supabase
    .from('reservations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)
  return data || []
}

export default async function AdminDashboard() {
  const [stats, recent] = await Promise.all([getStats(), getRecentReservations()])

  const cards = [
    {
      label: 'Pending Reservations',
      value: stats.pending,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600',
      href: '/admin/reservations?status=pending',
    },
    {
      label: 'Confirmed Reservations',
      value: stats.confirmed,
      icon: CheckCircle,
      color: 'bg-green-50 text-green-600',
      href: '/admin/reservations?status=confirmed',
    },
    {
      label: 'Published Blog Posts',
      value: stats.publishedBlogs,
      icon: FileText,
      color: 'bg-sky-50 text-sky-600',
      href: '/admin/blog',
    },
    {
      label: 'Instagram Scheduled',
      value: stats.scheduledIG,
      icon: Instagram,
      color: 'bg-purple-50 text-purple-600',
      href: '/admin/instagram',
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map(card => {
          const Icon = card.icon
          return (
            <Link key={card.label} href={card.href} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{card.value}</div>
              <div className="text-sm text-slate-500">{card.label}</div>
            </Link>
          )
        })}
      </div>

      {/* Recent Reservations */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">Recent Reservations</h2>
          <Link href="/admin/reservations" className="text-sm text-orange-500 hover:text-orange-600 font-medium">
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <CalendarCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No reservations yet</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recent.map(r => (
              <div key={r.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-semibold text-slate-900">{r.name}</p>
                  <p className="text-sm text-slate-500">{r.date} · {r.flight_type} · {r.passengers} pax</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  r.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                  r.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                  r.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
