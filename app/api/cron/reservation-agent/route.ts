// Rezervasyon ajanı — her sabah 08:00 (TR) Vercel cron.
export const dynamic = 'force-dynamic'
export const maxDuration = 60

import { NextResponse } from 'next/server'
import { runReservationAgent } from '@/lib/agents/reservation-agent'
import { cronAuthorized } from '@/lib/agents/core'

export async function GET(request: Request) {
  if (!cronAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    return NextResponse.json({ ok: true, ...(await runReservationAgent()) })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
