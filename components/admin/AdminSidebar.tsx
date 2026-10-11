'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  Instagram,
  MessageCircle,
  FileText,
  Mountain,
  Bot,
  Megaphone,
  Search,
  Radar,
  BarChart3,
  Sparkles,
  Ticket,
  AudioLines,
  Menu,
  X,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/voice-assistant', label: 'Voice Asistan', icon: AudioLines },
  { href: '/admin/mission-control', label: 'Mission Control', icon: Radar },
  { href: '/admin/bookings', label: 'Rezervasyonlar', icon: CalendarCheck },
  { href: '/admin/ticket', label: 'Bilet Bas', icon: Ticket },
  { href: '/admin/calendar', label: 'Takvim', icon: CalendarDays },
  { href: '/admin/content-pilot', label: 'ContentPilot AI', icon: Bot },
  { href: '/admin/instagram', label: 'Instagram', icon: Instagram },
  { href: '/admin/dm-automation', label: 'Otomatik DM', icon: MessageCircle },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/meta-ads', label: 'Meta Reklamlar', icon: Megaphone },
  { href: '/admin/google-ads', label: 'Google Ads', icon: Search },
  { href: '/admin/analyze', label: 'Analiz', icon: BarChart3 },
  { href: '/admin/ai-visibility', label: 'AI Görünürlük', icon: Sparkles },
]

export default function AdminSidebar() {
  const pathname = usePathname() || ''
  const [open, setOpen] = useState(false)

  // close the mobile menu after navigating
  useEffect(() => { setOpen(false) }, [pathname])

  const isActive = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href))

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
            <Mountain className="h-4 w-4 text-white" />
          </span>
          <span className="text-sm font-bold text-white">Atmos Admin</span>
        </Link>
        <button
          onClick={() => setOpen(v => !v)}
          className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
          aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile backdrop */}
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} aria-hidden />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-slate-700 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500">
            <Mountain className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Atmos Paragliding</p>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isMission = item.href === '/admin/mission-control'
            const isVoice = item.href === '/admin/voice-assistant'
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-orange-500/15 text-orange-300'
                    : isMission
                      ? 'text-violet-300 hover:bg-violet-900/40 hover:text-violet-100'
                      : isVoice
                        ? 'text-orange-300 hover:bg-orange-500/10 hover:text-orange-200'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{item.label}</span>
                {isMission && <span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-green-400" />}
                {isVoice && <span className="ml-auto text-[10px] font-normal text-orange-400/70">Neslihan</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-700 px-6 py-4">
          <p className="text-xs text-slate-500">Ceyhun · Pilot</p>
          <Link href="/" className="mt-1 inline-block text-xs text-orange-400 hover:text-orange-300">
            ← Siteye Dön
          </Link>
        </div>
      </aside>
    </>
  )
}
