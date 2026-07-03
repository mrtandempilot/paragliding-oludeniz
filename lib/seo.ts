import type { Metadata } from 'next'

const BASE_URL = 'https://www.atmosparagliding.com'
const LOCALES = ['en', 'tr', 'de', 'ru'] as const

/** Returns the absolute URL for a given locale + path ('/x' or '/'). */
export function localeUrl(locale: string, path: string): string {
  const p = path === '/' ? '' : path
  return locale === 'en' ? `${BASE_URL}${p}` : `${BASE_URL}/${locale}${p}`
}

/**
 * Builds canonical + hreflang alternates for a page.
 * Canonical points to the CURRENT locale's URL (self-canonical),
 * languages list all 4 locale versions + x-default (en).
 */
export function localeAlternates(locale: string, path: string): Metadata['alternates'] {
  const languages: Record<string, string> = {}
  for (const l of LOCALES) {
    languages[l] = localeUrl(l, path)
  }
  languages['x-default'] = localeUrl('en', path)
  return {
    canonical: localeUrl(locale, path),
    languages,
  }
}
