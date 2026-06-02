export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Vercel Cron — her gün 10:00 UTC (= 13:00 İstanbul)
// Yayınlanan tüm postların like / yorum / reach / impressions / saves verilerini çeker
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabase()
  const igToken = process.env.INSTAGRAM_ACCESS_TOKEN!

  if (!igToken) {
    return NextResponse.json({ error: 'INSTAGRAM_ACCESS_TOKEN not set' }, { status: 500 })
  }

  // Son 90 günde yayınlanmış ve instagram_id'si olan postları al
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  const { data: posts, error } = await supabase
    .from('instagram_posts')
    .select('id, instagram_id, caption')
    .eq('status', 'posted')
    .not('instagram_id', 'is', null)
    .gte('posted_at', ninetyDaysAgo)

  if (error || !posts || posts.length === 0) {
    console.log('[Analytics] No posts to sync:', error?.message)
    return NextResponse.json({ synced: 0, message: 'No posts to sync' })
  }

  console.log(`[Analytics] Syncing ${posts.length} posts`)

  let synced = 0
  let failed = 0

  for (const post of posts) {
    try {
      // Instagram Graph API — media insights
      const url = `https://graph.facebook.com/v19.0/${post.instagram_id}/insights?metric=likes,comments,reach,impressions,saved&access_token=${igToken}`
      const res = await fetch(url)
      const data = await res.json()

      if (data.error) {
        console.warn(`[Analytics] Post ${post.id} insights error:`, data.error.message)
        failed++
        continue
      }

      // Metrikleri parse et
      const metrics: Record<string, number> = {}
      for (const item of (data.data || [])) {
        metrics[item.name] = item.values?.[0]?.value ?? item.value ?? 0
      }

      // Like sayısı ayrı endpoint'ten gelir (insights'ta yok)
      let likes = metrics['likes'] ?? 0
      if (likes === 0) {
        const likeRes = await fetch(
          `https://graph.facebook.com/v19.0/${post.instagram_id}?fields=like_count,comments_count&access_token=${igToken}`
        )
        const likeData = await likeRes.json()
        if (!likeData.error) {
          likes = likeData.like_count ?? 0
          if (!metrics['comments']) metrics['comments'] = likeData.comments_count ?? 0
        }
      }

      await supabase
        .from('instagram_posts')
        .update({
          likes,
          comments:    metrics['comments']    ?? 0,
          reach:       metrics['reach']       ?? 0,
          impressions: metrics['impressions'] ?? 0,
          saves:       metrics['saved']       ?? 0,
          analytics_updated_at: new Date().toISOString(),
        })
        .eq('id', post.id)

      console.log(`[Analytics] ✅ ${post.id} — likes:${likes} reach:${metrics['reach'] ?? 0}`)
      synced++

    } catch (err: any) {
      console.error(`[Analytics] ❌ ${post.id}:`, err.message)
      failed++
    }
  }

  return NextResponse.json({ synced, failed, total: posts.length })
}
