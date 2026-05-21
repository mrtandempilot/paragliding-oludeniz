import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Vercel Cron — every 30 minutes — auto-publishes scheduled Instagram posts
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabase()

  // Fetch all scheduled posts whose time has come
  const { data: posts, error } = await supabase
    .from('instagram_posts')
    .select('*')
    .eq('status', 'scheduled')
    .lte('scheduled_at', new Date().toISOString())
    .limit(5) // max 5 per run to avoid timeout

  if (error) {
    console.error('[Cron] Supabase error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!posts || posts.length === 0) {
    return NextResponse.json({ published: 0, message: 'No scheduled posts due' })
  }

  const results: { id: string; status: 'published' | 'failed'; error?: string }[] = []
  const igAccountId = process.env.INSTAGRAM_ACCOUNT_ID!
  const igToken = process.env.INSTAGRAM_ACCESS_TOKEN!

  for (const post of posts) {
    try {
      console.log(`[Cron] Publishing scheduled post: ${post.id} (${post.post_type})`)

      // Mark as 'posting' to avoid double-publishing
      await supabase.from('instagram_posts').update({ status: 'failed', notes: (post.notes || '') + '\n[cron: publishing...]' }).eq('id', post.id)

      let mediaId: string | null = null

      if (post.post_type === 'image' || !post.post_type) {
        // Single image
        const containerRes = await fetch(
          `https://graph.facebook.com/v19.0/${igAccountId}/media`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image_url: post.image_url,
              caption: `${post.caption || ''}\n\n${post.hashtags || ''}`.trim(),
              access_token: igToken,
            }),
          }
        )
        const containerData = await containerRes.json()
        if (containerData.error) throw new Error(containerData.error.message)
        mediaId = containerData.id

      } else if (post.post_type === 'reel') {
        // Reel — create container + poll
        const containerRes = await fetch(
          `https://graph.facebook.com/v19.0/${igAccountId}/media`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              media_type: 'REELS',
              video_url: post.video_url,
              caption: `${post.caption || ''}\n\n${post.hashtags || ''}`.trim(),
              cover_url: post.cover_url || undefined,
              access_token: igToken,
            }),
          }
        )
        const containerData = await containerRes.json()
        if (containerData.error) throw new Error(containerData.error.message)
        const containerId = containerData.id

        // Poll until FINISHED (max 90s)
        for (let i = 0; i < 18; i++) {
          await sleep(5000)
          const statusRes = await fetch(
            `https://graph.facebook.com/v19.0/${containerId}?fields=status_code&access_token=${igToken}`
          )
          const statusData = await statusRes.json()
          if (statusData.status_code === 'FINISHED') { mediaId = containerId; break }
          if (statusData.status_code === 'ERROR') throw new Error('Reel processing failed')
        }
        if (!mediaId) throw new Error('Reel processing timeout')

      } else if (post.post_type === 'story') {
        const isVideo = !!post.video_url
        const containerRes = await fetch(
          `https://graph.facebook.com/v19.0/${igAccountId}/media`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              media_type: 'STORIES',
              ...(isVideo ? { video_url: post.video_url } : { image_url: post.image_url }),
              access_token: igToken,
            }),
          }
        )
        const containerData = await containerRes.json()
        if (containerData.error) throw new Error(containerData.error.message)
        mediaId = containerData.id

      } else if (post.post_type === 'carousel') {
        const urls: string[] = post.carousel_urls || []
        const childIds: string[] = []
        for (const url of urls.slice(0, 10)) {
          const childRes = await fetch(
            `https://graph.facebook.com/v19.0/${igAccountId}/media`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image_url: url, is_carousel_item: true, access_token: igToken }),
            }
          )
          const childData = await childRes.json()
          if (childData.error) throw new Error(childData.error.message)
          childIds.push(childData.id)
        }
        const containerRes = await fetch(
          `https://graph.facebook.com/v19.0/${igAccountId}/media`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              media_type: 'CAROUSEL',
              children: childIds.join(','),
              caption: `${post.caption || ''}\n\n${post.hashtags || ''}`.trim(),
              access_token: igToken,
            }),
          }
        )
        const containerData = await containerRes.json()
        if (containerData.error) throw new Error(containerData.error.message)
        mediaId = containerData.id
      }

      if (!mediaId) throw new Error('No media container created')

      // Publish
      const publishRes = await fetch(
        `https://graph.facebook.com/v19.0/${igAccountId}/media_publish`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ creation_id: mediaId, access_token: igToken }),
        }
      )
      const publishData = await publishRes.json()
      if (publishData.error) throw new Error(publishData.error.message)

      // Mark as posted
      await supabase.from('instagram_posts').update({
        status: 'posted',
        posted_at: new Date().toISOString(),
        instagram_id: publishData.id,
      }).eq('id', post.id)

      results.push({ id: post.id, status: 'published' })
      console.log(`[Cron] ✅ Published: ${post.id} → Instagram ID: ${publishData.id}`)

    } catch (err: any) {
      console.error(`[Cron] ❌ Failed: ${post.id}`, err.message)
      await supabase.from('instagram_posts').update({
        status: 'failed',
        notes: (post.notes || '') + `\n[cron error: ${err.message}]`,
      }).eq('id', post.id)
      results.push({ id: post.id, status: 'failed', error: err.message })
    }
  }

  return NextResponse.json({
    published: results.filter(r => r.status === 'published').length,
    failed: results.filter(r => r.status === 'failed').length,
    results,
  })
}
