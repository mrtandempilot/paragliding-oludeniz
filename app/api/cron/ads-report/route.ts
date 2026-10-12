// Daily Google Ads report — runs every morning via Vercel cron (vercel.json),
// can also be triggered from the admin panel ("Şimdi yenile").
export const dynamic = 'force-dynamic'
export const maxDuration = 60

import { NextResponse } from 'next/server'
import { buildAdsReport, saveAdsReport } from '@/lib/ads-report/build'

function authorized(request: Request) {
  const auth = request.headers.get('authorization')
  if (process.env.CRON_SECRET && auth === `Bearer ${process.env.CRON_SECRET}`) return true
  const cookie = request.headers.get('cookie') || ''
  const m = cookie.match(/(?:^|;\s*)admin_session=([^;]+)/)
  return !!m && decodeURIComponent(m[1]) === process.env.ADMIN_PASSWORD
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const report = await buildAdsReport()
    await saveAdsReport(report)
    return NextResponse.json({ ok: true, generatedAt: report.generatedAt, findings: report.findings.length, errors: report.errors })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
