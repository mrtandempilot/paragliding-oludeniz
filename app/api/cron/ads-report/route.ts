// Google Ads ajanı — her sabah 07:00 (TR) Vercel cron. Raporu üretir,
// güvenli düzeltmeleri yapar, Telegram'a özet yollar.
export const dynamic = 'force-dynamic'
export const maxDuration = 120

import { NextResponse } from 'next/server'
import { runAdsAgent } from '@/lib/agents/ads-agent'
import { cronAuthorized } from '@/lib/agents/core'

export async function GET(request: Request) {
  if (!cronAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    return NextResponse.json({ ok: true, ...(await runAdsAgent()) })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
