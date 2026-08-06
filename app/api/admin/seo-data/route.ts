export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const SITE_URL = (process.env.GSC_SITE_URL || 'https://www.paragliding-oludeniz.com/').trim()
const SITE_ORIGIN = SITE_URL.replace(/\/$/, '')
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || ''

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

async function getAccessToken(): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID || '',
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET || '',
      refresh_token: process.env.GOOGLE_SEO_REFRESH_TOKEN || '',
      grant_type: 'refresh_token',
    }),
  })
  const text = await res.text()
  let data: any
  try { data = JSON.parse(text) } catch {
    throw new Error(`OAuth yaniti JSON degil (HTTP ${res.status}): ${text.slice(0, 200)}`)
  }
  if (!data.access_token) {
    const reason = data.error_description || data.error || JSON.stringify(data)
    throw new Error(`Google OAuth2 token hatasi: ${reason}`)
  }
  return data.access_token
}

function headersFor(accessToken: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }
}

async function authCheck() {
  try {
    const cookieStore = cookies()
    const session = cookieStore.get('admin_session')
    return session?.value === process.env.ADMIN_PASSWORD
  } catch {
    return false
  }
}

// ─── POST ────────────────────────────────────────────────────────────────────
// Google OAuth2 refresh token'i yenilemek icin: authorization code'u refresh token'a cevirir.
export async function POST(request: Request) {
  try {
    if (!(await authCheck())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json().catch(() => ({}))
    if (body.action !== 'oauth-exchange') {
      return NextResponse.json({ error: 'Bilinmeyen action' }, { status: 400 })
    }

    const { code, redirectUri } = body
    if (!code || !redirectUri) {
      return NextResponse.json({ error: 'code ve redirectUri gerekli' }, { status: 400 })
    }

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_ADS_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET || '',
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })
    const text = await res.text()
    let data: any
    try { data = JSON.parse(text) } catch {
      return NextResponse.json({ error: `Google yaniti JSON degil (HTTP ${res.status}): ${text.slice(0, 300)}` }, { status: 502 })
    }
    if (!res.ok) {
      return NextResponse.json({ error: data?.error_description || data?.error || JSON.stringify(data) }, { status: res.status })
    }

    return NextResponse.json({
      refresh_token: data.refresh_token || null,
      access_token_present: Boolean(data.access_token),
      scope: data.scope,
      expires_in: data.expires_in,
    })
  } catch (err: any) {
    console.error('[seo-data POST error]', err)
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}

// ─── GET ─────────────────────────────────────────────────────────────────────
export async function GET(request: Request) {
  try {
    if (!(await authCheck())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'sites'
    const accessToken = await getAccessToken()
    const headers = headersFor(accessToken)

    // 1) Search Console: hangi sitelere erisimimiz var + permission level
    if (type === 'sites') {
      const res = await fetch('https://www.googleapis.com/webmasters/v3/sites', { headers })
      const data = await res.json()
      if (!res.ok) return NextResponse.json({ error: data?.error?.message || JSON.stringify(data) }, { status: res.status })
      return NextResponse.json(data)
    }

    // 2) Search Console: arama performansi (clicks/impressions per page)
    if (type === 'search-performance') {
      const days = Number(searchParams.get('days') || 28)
      const end = new Date()
      const start = new Date(end.getTime() - days * 86400000)
      const fmt = (d: Date) => d.toISOString().slice(0, 10)
      const res = await fetch(
        `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            startDate: fmt(start),
            endDate: fmt(end),
            dimensions: ['page'],
            rowLimit: 250,
          }),
        }
      )
      const data = await res.json()
      if (!res.ok) return NextResponse.json({ error: data?.error?.message || JSON.stringify(data) }, { status: res.status })
      return NextResponse.json(data)
    }

    // 3) GA4: sayfa basina goruntulenme (son N gun)
    if (type === 'ga4-pages') {
      if (!GA4_PROPERTY_ID) return NextResponse.json({ error: 'GA4_PROPERTY_ID tanimli degil' }, { status: 400 })
      const days = searchParams.get('days') || '30'
      const res = await fetch(
        `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
            dimensions: [{ name: 'pagePath' }],
            metrics: [{ name: 'screenPageViews' }],
            limit: 250,
          }),
        }
      )
      const data = await res.json()
      if (!res.ok) return NextResponse.json({ error: data?.error?.message || JSON.stringify(data) }, { status: res.status })
      return NextResponse.json(data)
    }

    // 3b) GA4: genel bakis - son 7 gun toplam metrikler + kanal dagilimi (son 28 gun)
    if (type === 'ga4-overview') {
      if (!GA4_PROPERTY_ID) return NextResponse.json({ error: 'GA4_PROPERTY_ID tanimli degil' }, { status: 400 })

      const [overviewRes, channelsRes] = await Promise.all([
        fetch(
          `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify({
              dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
              metrics: [
                { name: 'activeUsers' },
                { name: 'newUsers' },
                { name: 'sessions' },
                { name: 'engagementRate' },
                { name: 'screenPageViews' },
              ],
            }),
          }
        ),
        fetch(
          `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify({
              dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
              dimensions: [{ name: 'sessionDefaultChannelGroup' }],
              metrics: [{ name: 'sessions' }],
              orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
              limit: 8,
            }),
          }
        ),
      ])

      const overviewData = await overviewRes.json()
      const channelsData = await channelsRes.json()

      if (!overviewRes.ok) {
        return NextResponse.json(
          { error: overviewData?.error?.message || JSON.stringify(overviewData) },
          { status: overviewRes.status }
        )
      }

      const row = overviewData.rows?.[0]?.metricValues
      const overview = {
        activeUsers: Number(row?.[0]?.value || 0),
        newUsers: Number(row?.[1]?.value || 0),
        sessions: Number(row?.[2]?.value || 0),
        engagementRate: Number(row?.[3]?.value || 0),
        screenPageViews: Number(row?.[4]?.value || 0),
      }

      const channels = (channelsData.rows || []).map((r: any) => ({
        channel: r.dimensionValues?.[0]?.value || 'Unknown',
        sessions: Number(r.metricValues?.[0]?.value || 0),
      }))

      return NextResponse.json({ overview, channels })
    }

    // 4) Search Console URL Inspection: yayindaki tum makalelerin indexlenme durumu
    if (type === 'indexing') {
      const supabase = getSupabase()
      const { data: articles, error: dbErr } = await supabase
        .from('articles')
        .select('slug, title, status, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: true })

      if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })

      const results: any[] = []
      for (const article of articles || []) {
        const inspectionUrl = `${SITE_ORIGIN}/blog/${article.slug}`
        try {
          const res = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
            method: 'POST',
            headers,
            body: JSON.stringify({ inspectionUrl, siteUrl: SITE_URL }),
          })
          const data = await res.json()
          if (!res.ok) {
            results.push({ slug: article.slug, url: inspectionUrl, error: data?.error?.message || JSON.stringify(data) })
            continue
          }
          const result = data.inspectionResult?.indexStatusResult
          results.push({
            slug: article.slug,
            title: article.title,
            url: inspectionUrl,
            verdict: result?.verdict,
            coverageState: result?.coverageState,
            lastCrawlTime: result?.lastCrawlTime,
            indexingState: result?.indexingState,
            pageFetchState: result?.pageFetchState,
            googleCanonical: result?.googleCanonical,
            robotsTxtState: result?.robotsTxtState,
          })
        } catch (e: any) {
          results.push({ slug: article.slug, url: inspectionUrl, error: e?.message || String(e) })
        }
      }

      const indexed = results.filter((r) => r.verdict === 'PASS').length
      const notIndexed = results.filter((r) => r.verdict && r.verdict !== 'PASS').length
      const errored = results.filter((r) => r.error).length

      return NextResponse.json({
        total: results.length,
        indexed,
        notIndexed,
        errored,
        results,
      })
    }

    // 4b) Debug: gelen code/redirectUri parametrelerini oldugu gibi geri gonderir (Google'a hic gitmez)
    if (type === 'oauth-debug') {
      const code = searchParams.get('code') || ''
      const redirectUri = searchParams.get('redirectUri') || ''
      return NextResponse.json({
        codeLength: code.length,
        codeFirst10: code.slice(0, 10),
        codeLast10: code.slice(-10),
        codeHasSlash: code.includes('/'),
        redirectUri,
        clientIdSet: Boolean(process.env.GOOGLE_ADS_CLIENT_ID),
        clientIdFirst10: (process.env.GOOGLE_ADS_CLIENT_ID || '').slice(0, 10),
        clientSecretSet: Boolean(process.env.GOOGLE_ADS_CLIENT_SECRET),
        clientSecretLength: (process.env.GOOGLE_ADS_CLIENT_SECRET || '').length,
        clientSecretFirst6: (process.env.GOOGLE_ADS_CLIENT_SECRET || '').slice(0, 6),
        clientSecretLast4: (process.env.GOOGLE_ADS_CLIENT_SECRET || '').slice(-4),
      })
    }

    // 5) OAuth re-auth: authorization code'u refresh token'a cevirir (GET ile de calisir, tarayicidan direkt cagirmak icin)
    if (type === 'oauth-exchange') {
      const code = searchParams.get('code')
      const redirectUri = searchParams.get('redirectUri')
      if (!code || !redirectUri) {
        return NextResponse.json({ error: 'code ve redirectUri gerekli' }, { status: 400 })
      }

      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_ADS_CLIENT_ID || '',
          client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET || '',
          code,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      })
      const text = await tokenRes.text()
      let data: any
      try { data = JSON.parse(text) } catch {
        return NextResponse.json({ error: `Google yaniti JSON degil (HTTP ${tokenRes.status}): ${text.slice(0, 300)}` }, { status: 502 })
      }
      if (!tokenRes.ok) {
        return NextResponse.json({ error: data?.error_description || data?.error || JSON.stringify(data) }, { status: tokenRes.status })
      }

      return NextResponse.json({
        refresh_token: data.refresh_token || null,
        access_token_present: Boolean(data.access_token),
        scope: data.scope,
        expires_in: data.expires_in,
      })
    }

    return NextResponse.json({ error: 'Unknown type' }, { status: 400 })
  } catch (err: any) {
    console.error('[seo-data GET error]', err)
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}
