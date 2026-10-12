// Meta WhatsApp Cloud API webhook.
// Meta App > WhatsApp > Configuration > Webhook:
//   Callback URL: https://www.atmosparagliding.com/api/webhooks/whatsapp
//   Verify token: same value as WHATSAPP_VERIFY_TOKEN, subscribe to "messages".
export const dynamic = 'force-dynamic'
export const maxDuration = 60

import { NextResponse } from 'next/server'
import { handleIncomingWhatsApp } from '@/lib/agents/whatsapp-agent'

export async function GET(request: Request) {
  const u = new URL(request.url)
  if (u.searchParams.get('hub.mode') === 'subscribe' && u.searchParams.get('hub.verify_token') === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(u.searchParams.get('hub.challenge') || '', { status: 200 })
  }
  return new Response('Forbidden', { status: 403 })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const tasks: Promise<any>[] = []
  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      const v = change.value || {}
      const names: Record<string, string> = {}
      for (const c of v.contacts || []) names[c.wa_id] = c.profile?.name || ''
      for (const m of v.messages || []) {
        if (m.from === (process.env.WHATSAPP_NOTIFY_PHONE || '').replace(/\D/g, '')) continue // don't answer the owner
        const text = m.type === 'text' ? m.text?.body
          : m.type === 'button' ? m.button?.text
          : m.type === 'interactive' ? (m.interactive?.button_reply?.title || m.interactive?.list_reply?.title)
          : `[${m.type} message]`
        if (text) tasks.push(handleIncomingWhatsApp(m.from, names[m.from], text))
      }
    }
  }
  await Promise.allSettled(tasks)
  return NextResponse.json({ ok: true })
}
