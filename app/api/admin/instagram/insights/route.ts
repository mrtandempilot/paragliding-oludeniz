import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  if (!token) return NextResponse.json({ error: 'No token' }, { status: 503 })

  const supabase = getSupabase()
  const { data: posts } = await supabase
    .from('instagram_posts')
    .select('id, instagram_id, post_type, caption, image_url, posted_at')
    .eq('status', 'posted')
    .not('instagram_id', 'is', null)
    .order('posted_at', { ascending: false })
    .limit(30)

  if (!posts || posts.length === 0) return NextResponse.json({ insights: [] })

  const results = await Promise.all(posts.map(async (post) => {
    try {
      const isReel = post.post_type === 'reel'
      const baseMetrics = 'views,reach,likes,comments,shares,saved,total_interactions'
      const reelMetrics = isReel ? ',ig_reels_avg_watch_time' : ''
      const res = await fetch(
        `https://graph.facebook.com/v19.0/${post.instagram_id}/insights?metric=${baseMetrics}${reelMetrics}&access_token=${token}`
      )
      const data = await res.json()
      if (data.error || !data.data) {
        return { ...post, error: data.error?.message || 'No data' }
      }
      const metrics: Record<string, number> = {}
      data.data.forEach((m: any) => { metrics[m.name] = m.values?.[0]?.value ?? 0 })
      return { ...post, ...metrics }
    } catch (e) {
      return { ...post, error: String(e) }
    }
  }))

  return NextResponse.json({ insights: results })
}
