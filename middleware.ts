import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const intlMiddleware = createMiddleware(routing)

export function middleware(request: NextRequest) {
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

  // Handle i18n routing for all other routes
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|opengraph-image|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
}
