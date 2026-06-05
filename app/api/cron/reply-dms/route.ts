export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const IG_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN!
const IG_ID = (process.env.INSTAGRAM_ACCOUNT_ID || process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID)!
const BASE = 'https://graph.facebook.com/v19.0'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(request: Request) {
  if (!IG_TOKEN || !IG_ID) {
    return NextResponse.json({ error: 'Missing IG credentials' }, { status: 500 })
  }

  const supabase = getSupabase()

  // Get auto-reply message from settings
  const { data: msgRow } = await supabase
    .from('settings').select('value').eq('key', 'ig_dm_message').single()

  const replyMessage = msgRow?.value ||
    'Merhaba! 🪂 Fiyat ve rezervasyon için: https://wa.me/905364616674 veya https://paragliding-oludeniz.com'

  // Get conversations (DM inbox)
  const convsRes = await fetch(
    `${BASE}/${IG_ID}/conversations?fields=id,participants,messages{id,from,message,created_time}&access_token=${IG_TOKEN}`
  )
  const convsData = await convsRes.json()

  if (convsData.error) {
    return NextResponse.json({ error: convsData.error.message }, { status: 400 })
  }

  const conversations = convsData.data || []
  let totalReplied = 0
  const results: string[] = []

  for (const conv of conversations) {
    const messages = conv.messages?.data || []
    if (messages.length === 0) continue

    // Get the latest message
    const lastMsg = messages[0]

    // Skip if WE sent the last message (don't reply to ourselves)
    if (lastMsg.from?.id === IG_ID) continue

    // Skip if we already replied to this conversation recently
    const { data: alreadyReplied } = await supabase
      .from('instagram_dm_log')
      .select('id')
      .eq('comment_id', conv.id)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .single()

    if (alreadyReplied) continue

    // Send auto-reply
    const sendRes = await fetch(`${BASE}/${IG_ID}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: { id: lastMsg.from?.id },
        message: { text: replyMessage },
        access_token: IG_TOKEN,
      }),
    })
    const sendData = await sendRes.json()

    if (sendData.error) {
      results.push(`❌ ${lastMsg.from?.id}: ${sendData.error.message}`)
      continue
    }

    // Log it
    await supabase.from('instagram_dm_log').insert({
      trigger_type: 'dm',
      comment_id: conv.id,
      comment_text: lastMsg.message || '',
      sender_id: lastMsg.from?.id,
      dm_sent: replyMessage,
    })

    totalReplied++
    results.push(`✅ ${lastMsg.from?.id}: "${lastMsg.message}"`)
  }

  return NextResponse.json({ replied: totalReplied, results })
}
