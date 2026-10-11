export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { runNeslihanTool } from '@/lib/neslihan/tools'

// POST /api/admin/neslihan/tool  { name, args }
// Runs one of Neslihan's read-only data tools. Admin auth comes from middleware;
// the cookie is forwarded so tools can reuse the existing /api/admin routes.
export async function POST(request: Request) {
  let name = ''
  try {
    const body = await request.json()
    name = String(body?.name || '')
    const out = await runNeslihanTool(name, body?.args || {}, {
      origin: new URL(request.url).origin,
      cookie: request.headers.get('cookie') || '',
    })
    return NextResponse.json(out)
  } catch (err: any) {
    const message = err?.message || String(err)
    return NextResponse.json({
      result: { error: message },
      display: { title: 'Veri alınamadı', subtitle: name, note: message },
    })
  }
}
