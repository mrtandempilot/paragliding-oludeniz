import Link from 'next/link'
import {
  CalendarCheck, Instagram, FileText, Megaphone,
  Search, Bot, Clock
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

export default async function AdminDashboard() {
  const pending = await getPendingCount()

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
          className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-8 hover:bg-amber-100 transition-colors">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </div>
  )
}
