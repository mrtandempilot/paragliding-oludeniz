import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Search Facebook Places for Ölüdeniz and return the place ID
async function getOludenizLocationId(accessToken: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/pages/search?q=Oludeniz&fields=id,name,location&type=place&access_token=${accessToken}`
    )
    const data = await res.json()
    if (data.data && data.data.length > 0) {
      // Find the best match — prefer entries with "ludeniz" in the name
      const match = data.data.find((p: any) =>
        p.name?.toLowerCase().includes('ludeniz') ||
        p.location?.city?.toLowerCase().includes('ludeniz')
      ) || data.data[0]
      console.log('[Instagram] Location found:', match.name, match.id)
      return match.id
    }
  } catch (e) {
    console.error('[Instagram] Location search failed:', e)
  }
  return null
}

export async function POST(request: Request) {
  const { id } = await request.json()
  const supabase = getSupabase()

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
  const igAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID

  if (!accessToken || !igAccountId) {
    return NextResponse.json(
      { error: 'Instagram not configured. Add INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID to env.' },
      { status: 503 }
    )
  }

  const { data: post, error: fetchErr } = await supabase
    .from('instagram_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchErr || !post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  const caption = [post.caption, post.hashtags].filter(Boolean).join('\n\n')
  const postType = post.post_type || 'image'

  // Get Ölüdeniz location ID
  const locationId = await getOludenizLocationId(accessToken)

  try {
    let containerId: string

    // ─── IMAGE ───────────────────────────────────────────────
    if (postType === 'image') {
      if (!post.image_url) return NextResponse.json({ error: 'No image URL' }, { status: 400 })

      const body: Record<string, any> = { image_url: post.image_url, caption, access_token: accessToken }
      if (locationId) body.location_id = locationId

      const res = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.error) return NextResponse.json({ error: data.error.message }, { status: 500 })
      containerId = data.id
      await sleep(8000)

    // ─── REEL ────────────────────────────────────────────────
    } else if (postType === 'reel') {
      if (!post.video_url) return NextResponse.json({ error: 'No video URL' }, { status: 400 })

      const body: Record<string, any> = {
        media_type: 'REELS',
        video_url: post.video_url,
        caption,
        share_to_feed: true,
        access_token: accessToken,
      }
      if (post.cover_url) body.cover_url = post.cover_url
      if (locationId) body.location_id = locationId

      const res = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.error) return NextResponse.json({ error: data.error.message }, { status: 500 })
      containerId = data.id

      // Reels take longer to process — poll status
      let ready = false
      for (let i = 0; i < 12; i++) {
        await sleep(5000)
        const statusRes = await fetch(
          `https://graph.facebook.com/v19.0/${containerId}?fields=status_code&access_token=${accessToken}`
        )
        const statusData = await statusRes.json()
        if (statusData.status_code === 'FINISHED') { ready = true; break }
        if (statusData.status_code === 'ERROR') {
          return NextResponse.json({ error: 'Video processing failed' }, { status: 500 })
        }
      }
      if (!ready) return NextResponse.json({ error: 'Video processing timed out (60s)' }, { status: 500 })

    // ─── STORY ───────────────────────────────────────────────
    } else if (postType === 'story') {
      const isVideo = !!post.video_url
      const body: Record<string, any> = {
        media_type: 'STORIES',
        caption,
        access_token: accessToken,
      }
      if (isVideo) body.video_url = post.video_url
      else {
        if (!post.image_url) return NextResponse.json({ error: 'No image URL' }, { status: 400 })
        body.image_url = post.image_url
      }

      const res = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.error) return NextResponse.json({ error: data.error.message }, { status: 500 })
      containerId = data.id
      await sleep(isVideo ? 15000 : 8000)

    // ─── CAROUSEL ────────────────────────────────────────────
    } else if (postType === 'carousel') {
      const urls: string[] = post.carousel_urls || []
      if (urls.length < 2) return NextResponse.json({ error: 'Carousel needs at least 2 images' }, { status: 400 })

      // Create child containers
      const childIds: string[] = []
      for (const url of urls.slice(0, 10)) {
        const res = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_url: url, is_carousel_item: true, access_token: accessToken }),
        })
        const data = await res.json()
        if (data.error) return NextResponse.json({ error: `Carousel item error: ${data.error.message}` }, { status: 500 })
        childIds.push(data.id)
      }

      await sleep(5000)

      // Create carousel container
      const res = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          media_type: 'CAROUSEL',
          children: childIds.join(','),
          caption,
          access_token: accessToken,
          ...(locationId ? { location_id: locationId } : {}),
        }),
      })
      const data = await res.json()
      if (data.error) return NextResponse.json({ error: data.error.message }, { status: 500 })
      containerId = data.id
      await sleep(8000)

    } else {
      return NextResponse.json({ error: 'Unknown post type' }, { status: 400 })
    }

    // ─── PUBLISH ─────────────────────────────────────────────
    const publishRes = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: containerId, access_token: accessToken }),
    })
    const publishData = await publishRes.json()

    if (publishData.error) {
      return NextResponse.json({ error: publishData.error.message }, { status: 500 })
    }

    await supabase
      .from('instagram_posts')
      .update({ status: 'posted', posted_at: new Date().toISOString(), instagram_id: publishData.id })
      .eq('id', id)

    return NextResponse.json({ success: true, instagram_id: publishData.id })

  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
