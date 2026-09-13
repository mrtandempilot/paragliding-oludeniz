export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const GSC_SITE_URL = 'sc-domain:atmosparagliding.com'

async function authCheck() {
  try {
    const cookieStore = cookies()
    const session = cookieStore.get('admin_session')
    return session?.value === process.env.ADMIN_PASSWORD
  } catch {
    return false
  }
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
    throw new Error(`OAuth yanıtı JSON değil (HTTP ${res.status}): ${text.slice(0, 300)}`)
  }
  if (!data.access_token) {
    const reason = data.error_description || data.error || JSON.stringify(data)
    throw new Error(`Google OAuth2 token hatası (Search Console): ${reason}`)
  }
  return data.access_token
}

function isoDaysAgo(days: number) {
  const d = new Date(Date.now() - days * 86400000)
  return d.toISOString().slice(0, 10)
}

async function queryGSC(accessToken: string, days: number) {
  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE_URL)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // GSC data has ~2-3 day lag; end 3 days ago for complete data
        startDate: isoDaysAgo(days + 3),
        endDate: isoDaysAgo(3),
        dimensions: [],
      }),
    }
  )
  const text = await res.text()
  let data: any
  try { data = JSON.parse(text) } catch {
    throw new Error(`Search Console yanıtı JSON değil (HTTP ${res.status}): ${text.slice(0, 300)}`)
  }
  if (!res.ok) {
    const reason = data?.error?.message || JSON.stringify(data)
    throw new Error(`Search Console API hatası (HTTP ${res.status}): ${reason}`)
  }
  const row = (data.rows && data.rows[0]) || { clicks: 0, impressions: 0, ctr: 0, position: 0 }
  return {
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: row.ctr || 0,
    position: row.position || 0,
  }
}

export async function GET() {
  try {
    if (!(await authCheck())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    let gsc7d = null
    let gsc28d = null
    let gscError: string | null = null

    try {
      const accessToken = await getAccessToken()
      const [d7, d28] = await Promise.all([queryGSC(accessToken, 7), queryGSC(accessToken, 28)])
      gsc7d = d7
      gsc28d = d28
    } catch (err: any) {
      gscError = err.message || 'Bilinmeyen Search Console hatası'
    }

    return NextResponse.json({ gsc7d, gsc28d, gscError, siteUrl: GSC_SITE_URL })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Sunucu hatası' }, { status: 500 })
  }
}
