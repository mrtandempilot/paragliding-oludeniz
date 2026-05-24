import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Ölüdeniz Facebook Place ID'sini API'den çek
async function getOludenizLocationId(accessToken: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/pages/search?q=Oludeniz&fields=id,name,location&type=place&access_token=${accessToken}`
    )
    const data = await res.json()
    if (data.data && data.data.length > 0) {
      const match = data.data.find((p: any) =>
        p.name?.toLowerCase().includes('ludeniz') ||
        p.location?.city?.toLowerCase().includes('ludeniz')
      ) || data.data[0]
      console.log('[Daily IG] Location found:', match.name, match.id)
      return match.id
    }
  } catch (e) {
    console.error('[Daily IG] Location search failed:', e)
  }
  return null
}

// Vercel Cron — her gün 06:00 UTC (= 09:00 İstanbul)
// 1) Scheduled post varsa yayınlar
// 2) Yoksa → son makaleden otomatik caption üretip Instagram'a atar
// Draft ile hiç uğraşılmaz.
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabase()
  const igAccountId = (process.env.INSTAGRAM_ACCOUNT_ID || process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID)!
  const igToken = process.env.INSTAGRAM_ACCESS_TOKEN!

  if (!igAccountId || !igToken) {
    return NextResponse.json({ error: 'Instagram credentials not configured' }, { status: 500 })
  }

  // ── 1. Scheduled post varsa önce onu yayınla ──────────────────────────
  const { data: scheduledPost } = await supabase
    .from('instagram_posts')
    .select('*')
    .eq('status', 'scheduled')
    .lte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(1)
    .single()

  if (scheduledPost) {
    console.log(`[Daily IG] Found scheduled post: ${scheduledPost.id}`)
    return await publishPost(scheduledPost, igAccountId, igToken, supabase)
  }

  // ── 2. Scheduled yoksa → AI otomatik üretsin ─────────────────────────
  console.log('[Daily IG] No scheduled posts — generating AI content automatically')

  // Son 30 makaleden rastgele birini seç (çeşitlilik için)
  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, content, meta_description, keywords, hero_image_url')
    .eq('status', 'published')
    .not('hero_image_url', 'is', null)
    .order('created_at', { ascending: false })
    .limit(30)

  if (!articles || articles.length === 0) {
    console.log('[Daily IG] No published articles found, skipping')
    return NextResponse.json({ published: 0, message: 'No articles available' })
  }

  // Son 7 gün içinde hangi makaleler kullanıldı? Tekrar etmesin
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data: recentPosts } = await supabase
    .from('instagram_posts')
    .select('notes')
    .gte('created_at', sevenDaysAgo)
    .eq('status', 'posted')

  const recentlyUsedIds = new Set(
    (recentPosts || [])
      .map(p => {
        const match = p.notes?.match(/article_id:([a-f0-9-]+)/)
        return match?.[1]
      })
      .filter(Boolean)
  )

  // Önce hiç kullanılmayanları tercih et
  const unused = articles.filter(a => !recentlyUsedIds.has(a.id))
  const pool = unused.length > 0 ? unused : articles
  const article = pool[Math.floor(Math.random() * pool.length)]

  console.log(`[Daily IG] Using article: "${article.title}"`)

  // ── 3. Claude ile caption + hashtag üret ─────────────────────────────
  let caption = ''
  let hashtags = ''

  try {
    const prompt = `You are a social media expert for a paragliding company in Ölüdeniz, Turkey.

Write an engaging Instagram caption for this content:
Title: ${article.title}
Description: ${article.meta_description || ''}
Keywords: ${(article.keywords || []).join(', ')}
Content snippet: ${(article.content || '').slice(0, 400)}

Requirements:
- 150–200 characters main text (exciting, adventurous tone)
- 1 emoji at start, 1 at end
- End with a call to action (link in bio, book now, DM us)
- Generate 20 relevant hashtags: mix high-volume (#paragliding #turkey #travel) + niche (#oludeniz #babadagmountain #paraglide #oludenizparagliding)
- Return ONLY valid JSON: {"text":"...","hashtags":["paragliding","turkey",...]}
`

    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = msg.content[0].type === 'text' ? msg.content[0].text : '{}'
    const parsed = JSON.parse(raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
    caption = parsed.text || article.title
    hashtags = (parsed.hashtags || []).map((h: string) => `#${h}`).join(' ')

    // Usage log
    await supabase.from('usage_logs').insert({
      agent: 'daily-instagram',
      tokens_input: msg.usage.input_tokens,
      tokens_output: msg.usage.output_tokens,
      cost_usd: (msg.usage.input_tokens * 0.00000025) + (msg.usage.output_tokens * 0.00000125),
      task: article.title,
      status: 'success',
    })
  } catch (e: any) {
    console.error('[Daily IG] Caption generation failed:', e.message)
    caption = `🪂 ${article.title} ✨ Book your flight — link in bio!`
    hashtags = '#paragliding #oludeniz #turkey #adventure #travel #tandem #babadagmountain #fethiye'
  }

  const fullCaption = `${caption}\n\n${hashtags}`.trim()
  const imageUrl = article.hero_image_url!

  // ── 4. Instagram'a gönder ─────────────────────────────────────────────
  const locationId = await getOludenizLocationId(igToken)

  try {
    // Container oluştur
    const containerBody: Record<string, any> = { image_url: imageUrl, caption: fullCaption, access_token: igToken }
    if (locationId) containerBody.location_id = locationId

    const containerRes = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(containerBody),
    })
    const containerData = await containerRes.json()
    if (containerData.error) throw new Error(containerData.error.message)

    await sleep(10000)

    // Yayınla
    const publishRes = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: containerData.id, access_token: igToken }),
    })
    const publishData = await publishRes.json()
    if (publishData.error) throw new Error(publishData.error.message)

    // Kayıt (draft olmadan direkt posted)
    await supabase.from('instagram_posts').insert({
      image_url: imageUrl,
      caption,
      hashtags,
      status: 'posted',
      posted_at: new Date().toISOString(),
      instagram_id: publishData.id,
      notes: `auto|article_id:${article.id}`,
      post_type: 'image',
    })

    console.log(`[Daily IG] ✅ Auto-posted → Instagram ID: ${publishData.id}`)
    return NextResponse.json({ published: 1, instagram_id: publishData.id, article: article.title })

  } catch (err: any) {
    console.error('[Daily IG] ❌ Post failed:', err.message)

    await supabase.from('instagram_posts').insert({
      image_url: imageUrl,
      caption,
      hashtags,
      status: 'failed',
      notes: `auto|article_id:${article.id}|error:${err.message}`,
      post_type: 'image',
    })

    return NextResponse.json({ published: 0, error: err.message }, { status: 500 })
  }
}

// ── Scheduled postu yayınlayan yardımcı fonksiyon ────────────────────────
async function publishPost(post: any, igAccountId: string, igToken: string, supabase: any) {
  try {
    let mediaId: string | null = null
    const fullCaption = `${post.caption || ''}\n\n${post.hashtags || ''}`.trim()

    if (post.post_type === 'reel') {
      const res = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          media_type: 'REELS',
          video_url: post.video_url,
          caption: fullCaption,
          cover_url: post.cover_url || undefined,
          access_token: igToken,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error.message)
      const containerId = data.id
      for (let i = 0; i < 18; i++) {
        await sleep(5000)
        const s = await (await fetch(`https://graph.facebook.com/v19.0/${containerId}?fields=status_code&access_token=${igToken}`)).json()
        if (s.status_code === 'FINISHED') { mediaId = containerId; break }
        if (s.status_code === 'ERROR') throw new Error('Reel processing failed')
      }
      if (!mediaId) throw new Error('Reel timeout')

    } else if (post.post_type === 'carousel') {
      const childIds: string[] = []
      for (const url of (post.carousel_urls || []).slice(0, 10)) {
        const c = await (await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_url: url, is_carousel_item: true, access_token: igToken }),
        })).json()
        if (c.error) throw new Error(c.error.message)
        childIds.push(c.id)
      }
      const c = await (await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ media_type: 'CAROUSEL', children: childIds.join(','), caption: fullCaption, access_token: igToken }),
      })).json()
      if (c.error) throw new Error(c.error.message)
      mediaId = c.id

    } else {
      // image or story
      const res = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(post.post_type === 'story' ? { media_type: 'STORIES' } : {}),
          image_url: post.image_url,
          caption: post.post_type === 'story' ? undefined : fullCaption,
          access_token: igToken,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error.message)
      mediaId = data.id
    }

    if (!mediaId) throw new Error('No media container')

    const pub = await (await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media_publish`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: mediaId, access_token: igToken }),
    })).json()
    if (pub.error) throw new Error(pub.error.message)

    await supabase.from('instagram_posts').update({
      status: 'posted', posted_at: new Date().toISOString(), instagram_id: pub.id,
    }).eq('id', post.id)

    return NextResponse.json({ published: 1, instagram_id: pub.id, post_id: post.id })

  } catch (err: any) {
    await supabase.from('instagram_posts').update({
      status: 'failed',
      notes: (post.notes || '') + `\n[error: ${err.message}]`,
    }).eq('id', post.id)
    return NextResponse.json({ published: 0, error: err.message }, { status: 500 })
  }
}
