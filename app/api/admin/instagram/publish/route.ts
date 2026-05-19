import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// POST /api/admin/instagram/publish
// Body: { id: string } — publishes the instagram_post to Instagram via Graph API
export async function POST(request: Request) {
  const { id } = await request.json()

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
  const igAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID

  if (!accessToken || !igAccountId) {
    return NextResponse.json(
      { error: 'Instagram not configured. Add INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID to .env.local' },
      { status: 503 }
    )
  }

  // Fetch post from DB
  const { data: post, error: fetchErr } = await supabase
    .from('instagram_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchErr || !post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  if (!post.image_url) {
    return NextResponse.json({ error: 'Post has no image URL' }, { status: 400 })
  }

  try {
    // Step 1: Create media container
    const caption = [post.caption, post.hashtags].filter(Boolean).join('\n\n')

    const containerRes = await fetch(
      `https://graph.facebook.com/v19.0/${igAccountId}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: post.image_url,
          caption,
          access_token: accessToken,
        }),
      }
    )
    const containerData = await containerRes.json()

    if (containerData.error) {
      return NextResponse.json({ error: containerData.error.message }, { status: 500 })
    }

    const containerId = containerData.id

    // Wait for Instagram to process the image
    await new Promise(resolve => setTimeout(resolve, 10000))

    // Step 2: Publish the container
    const publishRes = await fetch(
      `https://graph.facebook.com/v19.0/${igAccountId}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: containerId,
          access_token: accessToken,
        }),
      }
    )
    const publishData = await publishRes.json()

    if (publishData.error) {
      return NextResponse.json({ error: publishData.error.message }, { status: 500 })
    }

    // Step 3: Update post in DB
    const { error: updateErr } = await supabase
      .from('instagram_posts')
      .update({
        status: 'posted',
        posted_at: new Date().toISOString(),
        instagram_id: publishData.id,
      })
      .eq('id', id)

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, instagram_id: publishData.id })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
