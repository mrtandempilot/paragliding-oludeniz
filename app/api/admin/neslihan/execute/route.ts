export const dynamic = 'force-dynamic'
export const maxDuration = 120

import { NextResponse } from 'next/server'
import { executeAction } from '@/lib/neslihan/actions'

// POST /api/admin/neslihan/execute  { token }
// Runs an action prepared by a prepare_* tool, after the browser has seen
// Ceyhun Bey's spoken "evet" (or an Onayla click). The signed token makes sure
// only the exact previewed action can run, and only for 10 minutes.
export async function POST(request: Request) {
  try {
    const { token } = await request.json()
    const out = await executeAction(String(token || ''), {
      origin: new URL(request.url).origin,
      cookie: request.headers.get('cookie') || '',
    })
    return NextResponse.json(out)
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message || String(err) })
  }
}
