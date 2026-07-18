export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { generateWhatsAppReply } from '../../../../agents/whatsapp'

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'oludeniz_paragliding_wa_2026'
const BOT_ENABLED = process.env.WHATSAPP_BOT_ENABLED !== 'false'

// Meta webhook verification handshake (GET)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }
  return new NextResponse('Forbidden', { status: 403 })
}

// Incoming WhatsApp customer messages (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value

        // Meta also sends "statuses" webhooks (sent/delivered/read) on the same
        // field -- only "messages" contains actual inbound customer text.
        if (!value?.messages) continue

        for (const msg of value.messages) {
          if (msg.type !== 'text') continue // images/audio/location handled later if needed

          const from: string | undefined = msg.from
          const text: string = msg.text?.body || ''

          if (!from || !text) continue

          if (!BOT_ENABLED) {
            console.log('[WhatsApp] Bot disabled via WHATSAPP_BOT_ENABLED -- skipping auto-reply for', from)
            continue
          }

          try {
            const result = await generateWhatsAppReply(text)
            await sendWhatsAppMessage(from, result.reply)

            if (result.needsHuman) {
              await notifyPilot(from, text, result.reply)
            }
          } catch (err) {
            console.error('[WhatsApp] Failed to generate/send reply for', from, err)
          }
        }
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (err) {
    console.error('[WhatsApp] Webhook error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

async function sendWhatsAppMessage(to: string, text: string) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const token = process.env.WHATSAPP_ACCESS_TOKEN

  if (!phoneNumberId || !token) {
    console.error('[WhatsApp] Missing WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_ACCESS_TOKEN -- cannot send reply')
    return
  }

  const res = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text },
    }),
  })

  if (!res.ok) {
    console.error('[WhatsApp] Send failed:', res.status, await res.text())
  }
}

// Escalation ping to the pilot's own WhatsApp so a human follows up personally
// on anything the bot flagged as needing a real answer (booking confirmation,
// payment, refunds, complaints, edge cases not covered by the knowledge base).
async function notifyPilot(customerNumber: string, customerMessage: string, botReply: string) {
  const notifyPhone = process.env.WHATSAPP_NOTIFY_PHONE
  if (!notifyPhone) return

  const text =
    `WhatsApp bot escalation\n` +
    `From: ${customerNumber}\n` +
    `Message: ${customerMessage}\n` +
    `Bot replied: ${botReply}\n` +
    `Please follow up personally.`

  await sendWhatsAppMessage(notifyPhone, text)
}
