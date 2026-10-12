export const dynamic = 'force-dynamic'
export const maxDuration = 60

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { buildAdsReport, saveAdsReport, loadAdsReport } from '@/lib/ads-report/build'

function isAdmin() {
  try { return cookies().get('admin_session')?.value === process.env.ADMIN_PASSWORD } catch { return false }
}

// GET: latest saved report + history
export async function GET() {
  if (!isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    return NextResponse.json(await loadAdsReport())
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// POST: rebuild now
export async function POST() {
  if (!isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const report = await buildAdsReport()
    await saveAdsReport(report)
    return NextResponse.json(await loadAdsReport())
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
