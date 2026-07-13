'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, Phone } from 'lucide-react'
import { navigation } from '@/lib/navigation'
import LanguageSwitcher from './LanguageSwitcher'

const BOOK_NOW: Record<string, string> = { en: 'Book Now', tr: 'Rezervasyon', de: 'Jetzt Buchen', ru: '\u0417\u0430\u0431\u0440\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u0442\u044c' }
const TOGGLE_MENU: Record<string, string> = { en: 'Toggle menu', tr: 'Men\u00fcy\u00fc a\u00e7/kapat', de: 'Men\u00fc umschalten', ru: '\u041f\u0435\u0440\u0435\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u043c\u0435\u043d\u044e' }

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  const firstSeg = pathname.split('/')[1]
  const curLocale = ['tr', 'de', 'ru'].includes(firstSeg) ? firstSeg : 'en'
  const lp = (href: string) =>
    curLocale === 'en' ? href : href === '/' ? `/${curLocale}` : `/${curLocale}${href}`
  const bookNowLabel = BOOK_NOW[curLocale] || BOOK_NOW.en
  const toggleMenuLabel = TOGGLE_MENU[curLocale] || TOGGLE_MENU.en

  // Pages without a full-bleed dark hero need an opaque header from the start
  const needsOpaqueHeader = pathname.startsWith('/blog')

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isDark = !needsOpaqueHeader && !isScrolled

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || needsOpaqueHeader
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href={lp('/')} className="flex items-center gap-2 z-10">
            <Image
              src="/images/logo.jpg"
              alt="Atmos Paragliding"
              width={40}
              height={40}
              priority
              className="rounded-full h-9 w-9 md:h-10 md:w-10 object-cover"
            />
            <span
              className={`text-xl md:text-2xl font-bold transition-colors ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              <span className="text-orange-500">Atmos</span>{' '}
              <span className={isDark ? 'text-white' : 'text-slate-900'}>Paragliding</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => {
              const label = item.label[curLocale] || item.label.en
              return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={lp(item.href)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDark
                      ? 'text-white/90 hover:text-white hover:bg-white/10'
                      : 'text-slate-700 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  {label}
                  {item.children && <ChevronDown className="w-3.5 h-3.5" />}
                </Link>

                {/* Dropdown */}
                {item.children && activeDropdown === label && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={lp(child.href)}
                        className="block px-4 py-2.5 text-sm text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                      >
                        {child.label[curLocale] || child.label.en}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              )
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher isDark={isDark} />
            <a
              href="tel:+905364616674"
              className={`hidden md:flex items-center gap-1.5 text-sm font-medium transition-colors ${
                isDark ? 'text-white/90 hover:text-white' : 'text-slate-700 hover:text-orange-600'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>+90 536 461 6674</span>
            </a>
            <Link
              href={lp('/book-now')}
              className="btn-primary text-sm px-4 py-2"
            >
              {bookNowLabel}
            </Link>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isDark
                  ? 'text-white hover:bg-white/10'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              aria-label={toggleMenuLabel}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <div key={item.href}>
                <Link
                  href={lp(item.href)}
                  className="block px-4 py-3 text-slate-700 font-medium hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label[curLocale] || item.label.en}
                </Link>
                {item.children && (
                  <div className="pl-4 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={lp(child.href)}
                        className="block px-4 py-2 text-sm text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label[curLocale] || child.label.en}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <a
                href="tel:+905364616674"
                className="flex items-center gap-2 px-4 py-3 text-slate-700 font-medium"
              >
                <Phone className="w-4 h-4 text-orange-500" />
                +90 536 461 6674
              </a>
              <Link
                href={lp('/book-now')}
                className="btn-primary justify-center"
                onClick={() => setMobileOpen(false)}
              >
                {bookNowLabel}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
