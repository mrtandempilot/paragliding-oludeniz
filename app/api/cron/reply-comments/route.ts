export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const IG_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN!
const IG_ID = (process.env.INSTAGRAM_ACCOUNT_ID || process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID)!
const BASE = 'https://graph.facebook.com/v19.0'

const TRIGGER_WORDS = [
  'fiyat', 'price', 'ücret', 'ucret', 'cost',
  'ne kadar', 'how much', 'booking', 'rezervasyon',
  'book', 'kaç', 'kac', 'para', 'uçuş', 'ucus', 'flight'
]

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function hasTriggerWord(text: string): boolean {
  const lower = text.toLowerCase()
  return TRIGGER_WORDS.some(w => lower.includes(w))
}

async function ig(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE}/${path}`)
  url.searchParams.set('access_token', IG_TOKEN)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  const res = await fetch(url.toString())
  return res.json()
}

export async function GET(request: Request) {
  // Auth
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  if (!IG_TOKEN || !IG_ID) {
    return NextResponse.json({ error: 'Missing IG credentials' }, { status: 500 })
  }

  const supabase = getSupabase()

  // Get reply message from settings
  const { data: msgRow } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'ig_dm_message')
    .single()

  const replyTemplate = msgRow?.value ||
    'Merhaba! 🪂 Fiyat ve rezervasyon için: https://wa.me/905364616674 veya https://atmosparagliding.com'

  // Get DM enabled setting
  const { data: enabledRow } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'ig_dm_enabled')
    .single()

  if (enabledRow?.value !== 'true') {
    return NextResponse.json({ message: 'Auto-reply disabled' })
  }

  // Fetch last 10 posts
  const mediaData = await ig(`${IG_ID}/media`, {
    fields: 'id,timestamp',
    limit: '10'
  })

  const posts: { id: string }[] = mediaData.data || []
  if (posts.length === 0) {
    return NextResponse.json({ replied: 0, message: 'No posts found' })
  }

  let totalReplied = 0
  const results: string[] = []

  for (const post of posts) {
    // Fetch comments on this post
    const commentsData = await ig(`${post.id}/comments`, {
      fields: 'id,text,username,timestamp',
      limit: '50'
    })

    const comments: { id: string; text: string; username: string; timestamp: string }[] =
      commentsData.data || []

    for (const comment of comments) {
      // Skip if no trigger word
      if (!hasTriggerWord(comment.text)) continue

      // Skip if already replied
      const { data: existing } = await supabase
        .from('instagram_replied_comments')
        .select('comment_id')
        .eq('comment_id', comment.id)
        .single()

      if (existing) continue

      // Build reply — mention the user
      const reply = `@${comment.username} ${replyTemplate}`

      // Post reply
      const replyRes = await fetch(`${BASE}/${comment.id}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: reply, access_token: IG_TOKEN }),
      })
      const replyData = await replyRes.json()

      if (replyData.error) {
        console.error(`[ReplyBot] Failed on ${comment.id}:`, replyData.error.message)
        results.push(`❌ ${comment.username}: ${replyData.error.message}`)
        continue
      }

      // Save to DB so we don't reply twice
      await supabase.from('instagram_replied_comments').insert({
        comment_id: comment.id,
        media_id: post.id,
        comment_text: comment.text,
        username: comment.username,
        reply_sent: reply,
      })

      totalReplied++
      results.push(`✅ @${comment.username}: "${comment.text}"`)
      console.log(`[ReplyBot] Replied to @${comment.username}: "${comment.text}"`)
    }
  }

  return NextResponse.json({
    replied: totalReplied,
    results,
    postsChecked: posts.length,
  })
}
