import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// ─── Webhook Verification (GET) ─────────────────────────────────────────────
// Facebook calls this when you register the webhook in the App Dashboard.
// It sends hub.challenge that you must echo back.
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

  // Each entry can contain multiple changes
  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      // ── Comment on a post ──────────────────────────────────────────────
      if (change.field === 'comments') {
        await handleComment(change.value)
      }
      // ── DM / Messaging ─────────────────────────────────────────────────
      if (change.field === 'messages') {
        await handleMessage(change.value)
      }
    }

    // Also handle messaging events at top level (Messenger format)
    for (const messaging of entry.messaging || []) {
      if (messaging.message && !messaging.message.is_echo) {
        await handleIncomingDM(messaging)
      }
    }
  }

  // Always return 200 quickly — Facebook will retry if you don't
  return NextResponse.json({ status: 'ok' })
}

// ─── Handle a new comment ────────────────────────────────────────────────────
async function handleComment(value: any) {
  const supabase = getSupabase()
  const commentId: string = value.id
  const commentText: string = value.text || ''
  const senderId: string = value.from?.id
  const senderName: string = value.from?.username || value.from?.name || ''
  const mediaId: string = value.media?.id

  console.log(`[IG Webhook] New comment on ${mediaId} from @${senderName}: "${commentText}"`)

  // Check if DM automation is enabled in settings
  const { data: settingsRows } = await supabase
    .from('settings')
    .select('key,value')
    .in('key', ['ig_dm_enabled', 'ig_dm_trigger_words', 'ig_dm_message'])

  const settings: Record<string, string> = {}
  for (const row of (settingsRows || [])) settings[row.key] = row.value

  if (settings['ig_dm_enabled'] !== 'true') return

  // Check trigger words
  const triggerWords: string[] = settings['ig_dm_trigger_words']
    ? settings['ig_dm_trigger_words'].split(',').map(w => w.trim().toLowerCase()).filter(Boolean)
    : []

  const lowerComment = commentText.toLowerCase()
  const triggered = triggerWords.length === 0
    || triggerWords.some(word => lowerComment.includes(word))

  if (!triggered) return

  const dmMessage = settings['ig_dm_message'] || 'Merhaba! Yazan için teşekkürler. Size özel teklifimizi görmek ister misiniz? 🪂'

  // Send DM via Instagram Graph API
  await sendDM(senderId, dmMessage)

  // Log to DB
  await supabase.from('instagram_dm_log').insert({
    trigger_type: 'comment',
    comment_id: commentId,
    comment_text: commentText,
    sender_id: senderId,
    sender_username: senderName,
    media_id: mediaId,
    dm_sent: dmMessage,
    created_at: new Date().toISOString(),
  }).select()
}

// ─── Handle incoming DM ──────────────────────────────────────────────────────
async function handleMessage(value: any) {
  console.log('[IG Webhook] Message event:', JSON.stringify(value).slice(0, 200))
}

async function handleIncomingDM(messaging: any) {
  const senderId: string = messaging.sender?.id
  const messageText: string = messaging.message?.text || ''
  console.log(`[IG Webhook] DM from ${senderId}: "${messageText}"`)
  // Future: auto-reply logic can go here
}

// ─── Send DM via Instagram Graph API ────────────────────────────────────────
async function sendDM(recipientId: string, message: string) {
  const igAccountId = process.env.INSTAGRAM_ACCOUNT_ID || process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID
  const igToken = process.env.INSTAGRAM_ACCESS_TOKEN

  if (!igAccountId || !igToken) {
    console.error('[IG Webhook] Missing INSTAGRAM_ACCOUNT_ID or INSTAGRAM_ACCESS_TOKEN')
    return
  }

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
