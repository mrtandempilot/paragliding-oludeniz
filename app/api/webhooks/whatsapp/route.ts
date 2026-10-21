// Meta WhatsApp Cloud API webhook.
// Meta App > WhatsApp > Configuration > Webhook:
//   Callback URL: https://www.atmosparagliding.com/api/webhooks/whatsapp
//   Verify token: WHATSAPP_VERIFY_TOKEN ile aynı — "messages" alanına abone ol.
// Her gelen mesaj + teslim/okundu durumu whatsapp_messages tablosuna yazılır,
// sonra sohbetten rezervasyon yakalanır. Otomatik cevap botu VARSAYILAN KAPALI
// (WHATSAPP_BOT_ENABLED=true ile açılır) — müşterilere Ceyhun panelden cevap verir.
export const dynamic = 'force-dynamic'
export const maxDuration = 60

import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { handleIncomingWhatsApp } from '@/lib/agents/whatsapp-agent'
import { saveIncoming, updateStatus, captureBooking } from '@/lib/whatsapp/inbox'
import { logAgent } from '@/lib/agents/core'

export async function GET(request: Request) {
  const u = new URL(request.url)
  if (u.searchParams.get('hub.mode') === 'subscribe' && u.searchParams.get('hub.verify_token') === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(u.searchParams.get('hub.challenge') || '', { status: 200 })
  }
  return new Response('Forbidden', { status: 403 })
}

function signatureOk(raw: string, header: string | null) {
  const secret = process.env.WHATSAPP_APP_SECRET || process.env.META_APP_SECRET
  if (!secret) return true // secret tanımlı değilse doğrulama atlanır
  if (!header?.startsWith('sha256=')) return false
  const mac = crypto.createHmac('sha256', secret).update(raw).digest('hex')
  try { return crypto.timingSafeEqual(Buffer.from(header.slice(7)), Buffer.from(mac)) } catch { return false }
}

export async function POST(request: Request) {
  const raw = await request.text()
  if (!signatureOk(raw, request.headers.get('x-hub-signature-256'))) return new Response('bad signature', { status: 401 })
  let body: any = {}
  try { body = JSON.parse(raw) } catch { return NextResponse.json({ ok: true }) }

  const owner = (process.env.WHATSAPP_NOTIFY_PHONE || '').replace(/\D/g, '')
  const botOn = process.env.WHATSAPP_BOT_ENABLED === 'true'
  const toCapture = new Map<string, string>()
  const replies: Promise<any>[] = []

  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      const v = change.value || {}
      const names: Record<string, string> = {}
      for (const c of v.contacts || []) names[c.wa_id] = c.profile?.name || ''
      for (const s of v.statuses || []) await updateStatus(s).catch(() => {})
      for (const m of v.messages || []) {
        try {
          const row = await saveIncoming(m, names[m.from])
          if (m.from === owner) continue
          toCapture.set(String(m.from), names[m.from] || '')
          if (botOn && row.body) replies.push(handleIncomingWhatsApp(m.from, names[m.from], row.body))
        } catch (e: any) {
          await logAgent('whatsapp', 'mesaj kaydedilemedi', 'error', { from: m.from }, 0, e.message)
        }
      }
    }
  }
  await Promise.allSettled([...replies, ...Array.from(toCapture, ([wa, name]) => captureBooking(wa, name))])
  return NextResponse.json({ ok: true })
}
