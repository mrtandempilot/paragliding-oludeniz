// Panel her 30 sn'de buraya sorar: son 72 saatte gelen rezervasyonlar + "gördüm" listesi.
// /api/admin altında olduğu için middleware admin oturumu ister.
export const dynamic = 'force-dynamic'
export const revalidate = 0

import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/admin/dashboard-data'
import { BOOKING_SEEN_KEY } from '@/lib/admin/flight-ops'

export async function GET() {
  const s = getSupabase()
  const since = new Date(Date.now() - 72 * 3600000).toISOString()
  const [b, seen] = await Promise.all([
    s.from('bookings').select('*').gte('created_at', since).neq('status', 'cancelled').order('created_at', { ascending: false }).limit(30),
    s.from('settings').select('value').eq('key', BOOKING_SEEN_KEY).maybeSingle(),
  ])
  let seenIds: string[] = []
  try { seenIds = JSON.parse(seen.data?.value || '[]') } catch {}
  return NextResponse.json(
    { bookings: b.data || [], seen: seenIds, error: b.error?.message || null },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
