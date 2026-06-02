'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const languages = [
  { code: 'en', label: 'EN', flag: '🇬🇧', name: 'English' },
  { code: 'tr', label: 'TR', flag: '🇹🇷', name: 'Türkçe' },
  { code: 'de', label: 'DE', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'ru', label: 'RU', flag: '🇷🇺', name: 'Русский' },
]

export default function LanguageSwitcher({ isDark }: { isDark: boolean }) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = languages.find((l) => l.code === locale) || languages[0]

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function switchLocale(newLocale: string) {
    setOpen(false)
    // Strip current locale prefix from pathname
    let newPath = pathname
    for (const lang of languages) {
      if (pathname.startsWith(`/${lang.code}/`)) {
        newPath = pathname.slice(lang.code.length + 1)
        break
      } else if (pathname === `/${lang.code}`) {
        newPath = '/'
        break
      }
    }
    // Add new locale prefix (except for English which is default)
    const prefix = newLocale === 'en' ? '' : `/${newLocale}`
    router.push(`${prefix}${newPath === '/' && newLocale !== 'en' ? '' : newPath}`)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          isDark
            ? 'text-white/90 hover:text-white hover:bg-white/10'
            : 'text-slate-700 hover:text-orange-600 hover:bg-orange-50'
        }`}
      >
        <span>{current.flag}</span>
        <span>{current.label}</span>
        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLocale(lang.code)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-orange-50 hover:text-orange-600 ${
                lang.code === locale ? 'text-orange-600 font-semibold' : 'text-slate-700'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
