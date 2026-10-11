export const dynamic = 'force-dynamic'
export const maxDuration = 120

import { NextResponse } from 'next/server'
import { runNeslihanTool } from '@/lib/neslihan/tools'
import { prepareAction } from '@/lib/neslihan/actions'

// POST /api/admin/neslihan/tool  { name, args }
// Runs one of Neslihan's data tools, or prepares (never executes) an action.
// Admin auth comes from middleware; the cookie is forwarded so tools can reuse
// the existing /api/admin routes.
export async function POST(request: Request) {
  let name = ''
  try {
    const body = await request.json()
    name = String(body?.name || '')
    const args = body?.args || {}

    if (name.startsWith('prepare_')) {
      const p = await prepareAction(name, args)
      // The token goes to the browser only; the model just learns it must ask.
      return NextResponse.json({
        result: { status: 'awaiting_confirmation', summary: p.summary, next: 'Özeti Ceyhun Bey\'e söyle ve "Onaylıyor musunuz?" diye sor. Açık bir evet gelirse confirm_action çağır.' },
        display: p.display,
        proposal: { token: p.token, summary: p.summary },
      })
    }

    const out = await runNeslihanTool(name, args, {
      origin: new URL(request.url).origin,
      cookie: request.headers.get('cookie') || '',
    })
    return NextResponse.json(out)
  } catch (err: any) {
    const message = err?.message || String(err)
    return NextResponse.json({
      result: { error: message },
      display: { title: 'İşlem yapılamadı', subtitle: name, note: message },
    })
  }
}
