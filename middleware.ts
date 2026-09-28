import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const intlMiddleware = createMiddleware(routing)

export function middleware(request: NextRequest) {
  const host = request.headers.get('host')
  if (host === 'atmosparagliding.com') {
    const url = request.nextUrl.clone()
    url.host = 'www.atmosparagliding.com'
    url.protocol = 'https:'
    return NextResponse.redirect(url, 301)
  }

  const { pathname } = request.nextUrl

  // Allow login page through
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Allow login API through
  if (pathname === '/api/admin/login') {
    return NextResponse.next()
  }

  // Protect all /admin and /api/admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const session = request.cookies.get('admin_session')

    if (!session || session.value !== process.env.ADMIN_PASSWORD) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return NextResponse.next()
  }

  // Don't run i18n middleware on any other API routes — they return JSON,
  // not localized pages, and intl rewriting breaks them (returns HTML 404s).
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Translated blog articles live in the DB as "i18n-<loc>-<slug>" but their
  // real public URL is /<loc>/blog/<slug>. The EN blog route used to serve
  // /blog/i18n-<loc>-<slug> as a second (duplicate) URL with lang="en", which
  // Google indexed and flagged as duplicate content. 301 every variant of
  // that path (with or without a locale prefix) to the one real URL.
  const i18nBlog = pathname.match(/^\/(?:(?:en|tr|de|ru|zh)\/)?blog\/i18n-(tr|de|ru|zh)-(.+)$/)
  if (i18nBlog) {
    const url = request.nextUrl.clone()
    url.pathname = `/${i18nBlog[1]}/blog/${i18nBlog[2]}`
    return NextResponse.redirect(url, 301)
  }

  // English is the default locale with no URL prefix. next-intl redirects
  // /en/... to /... with a temporary 307; make it permanent (308) so Google
  // consolidates the many legacy /en/ links it still crawls.
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(3) || '/'
    return NextResponse.redirect(url, 308)
  }

  // Handle i18n routing for all other routes
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|opengraph-image|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
}
