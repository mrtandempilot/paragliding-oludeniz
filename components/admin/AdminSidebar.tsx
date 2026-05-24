import Link from 'next/link'
import {
  LayoutDashboard,
  CalendarCheck,
  Instagram,
  MessageCircle,
  FileText,
  Mountain,
  Bot,
  Megaphone,
  Search,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Rezervasyonlar', icon: CalendarCheck },
  { href: '/admin/content-pilot', label: 'ContentPilot AI', icon: Bot },
  { href: '/admin/instagram', label: 'Instagram', icon: Instagram },
  { href: '/admin/dm-automation', label: 'Otomatik DM', icon: MessageCircle },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/meta-ads', label: 'Meta Reklamlar', icon: Megaphone },
  { href: '/admin/google-ads', label: 'Google Ads', icon: Search },
]

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-slate-900 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
        <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
          <Mountain className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-white text-sm">Ölüdeniz</p>
          <p className="text-slate-400 text-xs">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-150"
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-700">
        <p className="text-slate-500 text-xs">Ceyhun · Pilot</p>
        <Link href="/" className="text-orange-400 text-xs hover:text-orange-300 mt-1 inline-block">
          ← Siteye Dön
        </Link>
      </div>
    </aside>
  )
}
