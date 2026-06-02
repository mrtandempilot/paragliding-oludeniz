export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// ─── Webhook Verification (GET) ─────────────────────────────────────────────
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  const verifyToken = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('[IG Webhook] Verification successful')
    return new Response(challenge, { status: 200 })
  }

  console.warn('[IG Webhook] Verification failed', { mode, token })
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

// ─── Event Handler (POST) ───────────────────────────────────────────────────
export async function POST(request: Request) {
  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  console.log('[IG Webhook] Received:', JSON.stringify(body).slice(0, 500))

  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      // Instagram comment event
      if (change.field === 'comments') {
        await handleComment(change.value)
      }
      // Facebook Page feed event (also captures Instagram comments via Page)
      if (change.field === 'feed' && change.value?.item === 'comment') {
        await handlePageComment(change.value)
      }
      // Instagram DM event
      if (change.field === 'messages') {
        await handleIncomingDM(change.value)
      }
    }

    // Messenger-format DM events
    for (const msg of entry.messaging || []) {
      if (msg.message && !msg.message.is_echo) {
        await handleIncomingDM(msg)
      }
    }
  }

  return NextResponse.json({ status: 'ok' })
}

// ─── Handle Instagram comment (reply to comment) ─────────────────────────────
async function handleComment(value: any) {
  const commentId: string = value.id
  const commentText: string = value.text || ''
  const senderUsername: string = value.from?.username || ''

  console.log(`[IG Webhook] Comment from @${senderUsername}: "${commentText}"`)

  if (!await isDMEnabled()) return
  if (!isTriggerWord(commentText)) return

  const replyText = await getReplyMessage(senderUsername)
  await replyToComment(commentId, replyText)
  await logActivity('comment', commentId, commentText, senderUsername, replyText)
}

// ─── Handle Facebook Page feed comment ───────────────────────────────────────
async function handlePageComment(value: any) {
  const commentId: string = value.comment_id
  const commentText: string = value.message || ''
  const senderName: string = value.from?.name || ''

  console.log(`[IG Webhook] Page comment from ${senderName}: "${commentText}"`)

  if (!await isDMEnabled()) return
  if (!isTriggerWord(commentText)) return

  const replyText = await getReplyMessage(senderName)
  await replyToComment(commentId, replyText)
  await logActivity('comment', commentId, commentText, senderName, replyText)
}

// ─── Reply to a comment ───────────────────────────────────────────────────────
async function replyToComment(commentId: string, message: string) {
  const igToken = process.env.INSTAGRAM_ACCESS_TOKEN

  if (!igToken || !commentId) {
    console.error('[IG Webhook] Missing token or commentId')
    return
  }

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${commentId}/replies`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        access_token: igToken,
      }),
    }
  )

  const data = await res.json()
  if (data.error) {
    console.error('[IG Webhook] Reply failed:', data.error.message)
  } else {
    console.log(`[IG Webhook] ✅ Replied to comment ${commentId}`)
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
async function isDMEnabled(): Promise<boolean> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'ig_dm_enabled')
    .single()
  return data?.value === 'true'
}

async function getReplyMessage(username: string): Promise<string> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'ig_dm_message')
    .single()

  const template = data?.value || 'Merhaba! 🪂 Fiyat ve rezervasyon için: https://wa.me/905364616674 veya https://paragliding-oludeniz.com'
  return username ? `@${username} ${template}` : template
}

function isTriggerWord(text: string): boolean {
  const triggers = ['fiyat', 'price', 'ücret', 'ucret', 'cost', 'ne kadar', 'how much', 'booking', 'rezervasyon', 'book', 'kaç', 'kac', 'para']
  const lower = text.toLowerCase()
  return triggers.some(t => lower.includes(t))
}

// ─── Handle incoming DM (auto-reply bot) ────────────────────────────────────
async function handleIncomingDM(messaging: any) {
  const senderId: string = messaging.sender?.id || messaging.from?.id
  const messageText: string = messaging.message?.text || messaging.text || ''
  if (!senderId || !messageText) return
  console.log(`[IG Webhook] DM from ${senderId}: "${messageText}"`)
  if (!await isDMEnabled()) return
  const replyText = await getReplyMessage('')
  await sendDM(senderId, replyText)
  await logActivity('dm', senderId, messageText, senderId, replyText)
}

// ─── Send DM via Instagram Graph API ────────────────────────────────────────
async function sendDM(recipientId: string, message: string) {
  const igAccountId = process.env.INSTAGRAM_ACCOUNT_ID || process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID
  const igToken = process.env.INSTAGRAM_ACCESS_TOKEN
  if (!igAccountId || !igToken) return
  const res = await fetch(
    `https://graph.facebook.com/v19.0/${igAccountId}/messages`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: message },
        access_token: igToken,
      }),
    }
  )
  const data = await res.json()
  if (data.error) {
    console.error('[IG Webhook] DM send failed:', data.error.message)
  } else {
    console.log(`[IG Webhook] ✅ DM sent to ${recipientId}`)
  }
}

async function logActivity(type: string, commentId: string, text: string, username: string, reply: string) {
  const supabase = getSupabase()
  await supabase.from('instagram_dm_log').insert({
    trigger_type: type,
    comment_id: commentId,
    comment_text: text,
    sender_username: username,
    dm_sent: reply,
    created_at: new Date().toISOString(),
  })
}
