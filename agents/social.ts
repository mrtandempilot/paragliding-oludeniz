import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { ArticleResult } from './writer'
import { ImageResult } from './image'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const INSTAGRAM_API = 'https://graph.facebook.com/v18.0'

export interface SocialResult {
  instagram_post_id?: string
  instagram_caption: string
  hashtags: string[]
  posted_at?: string
  error?: string
}

export async function runSocialAgent(
  article: ArticleResult,
  image: ImageResult,
  keywords: string[]
): Promise<SocialResult> {
  const startTime = Date.now()

  await logAgent('social', 'start', 'running', { article_id: article.article_id })

  // 1. Generate Instagram caption with Claude
  const caption = await generateCaption(article, keywords)

  // 2. Save social post draft to Supabase
  const { data: socialPost, error: insertError } = await supabase
    .from('social_posts')
    .insert({
      article_id: article.article_id,
      platform: 'instagram',
      caption: caption.text,
      hashtags: caption.hashtags,
      image_url: image.cloudinary_url,
      status: 'pending',
    })
    .select()
    .single()

  if (insertError) {
    console.error('[Social] Failed to save social post to Supabase:', insertError.message)
  }

  // 3. Post to Instagram (if Cloudinary is configured — Instagram requires HTTPS public URLs)
  let instagramPostId: string | undefined
  let postedAt: string | undefined
  let postError: string | undefined

  if (
    process.env.INSTAGRAM_ACCESS_TOKEN &&
    process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID &&
    image.cloudinary_url.startsWith('https://res.cloudinary.com')
  ) {
    try {
      const fullCaption = `${caption.text}\n\n${caption.hashtags.map(h => `#${h}`).join(' ')}`
      instagramPostId = await postToInstagram(image.cloudinary_url, fullCaption)
      postedAt = new Date().toISOString()

      // Update social post status
      if (socialPost) {
        await supabase
          .from('social_posts')
          .update({ status: 'posted', instagram_post_id: instagramPostId, posted_at: postedAt })
          .eq('id', socialPost.id)
      }

      // Update article status
      await supabase
        .from('articles')
        .update({ status: 'published', published_at: postedAt })
        .eq('id', article.article_id)

    } catch (err: any) {
      postError = err.message
      console.error('Instagram post failed:', err)

      if (socialPost) {
        await supabase
          .from('social_posts')
          .update({ status: 'failed', error_message: postError })
          .eq('id', socialPost.id)
      }
    }
  } else {
    console.log('Instagram posting skipped: Cloudinary not configured or not a Cloudinary URL')
    postError = 'Cloudinary not configured — Instagram post skipped'
  }

  const result: SocialResult = {
    instagram_post_id: instagramPostId,
    instagram_caption: caption.text,
    hashtags: caption.hashtags,
    posted_at: postedAt,
    error: postError,
  }

  await logAgent('social', 'done', postError ? 'error' : 'done', result, Date.now() - startTime)

  return result
}

async function generateCaption(
  article: ArticleResult,
  keywords: string[]
): Promise<{ text: string; hashtags: string[] }> {
  const prompt = `You are a social media expert for paragliding-oludeniz.com, a paragliding company in Ölüdeniz, Turkey.

Write an engaging Instagram caption for this blog article:
Title: ${article.title}
Keywords: ${keywords.join(', ')}
Article excerpt: ${article.content.slice(0, 500)}...

Caption Requirements:
- 150-200 characters for the main text (before hashtags)
- Exciting, adventurous tone
- Include 1 relevant emoji at start and 1 at end
- End with a call to action (link in bio, book now, etc.)
- Do NOT include hashtags in the main text

Also generate 20 relevant hashtags mixing:
- High volume: #paragliding #travel #turkey #adventure
- Medium: #oludeniz #fethiye #parapente #tandem
- Niche: #oludenizparagliding #babadagmountain #bluelagoon #paraglider

Return JSON:
{
  "text": "caption text here",
  "hashtags": ["paragliding", "travel", "turkey", ...]
}

Return ONLY valid JSON.`

  const message = await anthropic.messages.create({
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}'
  const result = JSON.parse(text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())

  const cost = calcCost(message.usage.input_tokens, message.usage.output_tokens)
  await logUsage('social', message.usage.input_tokens, message.usage.output_tokens, cost, article.title)

  return result
}

async function getLocationId(accessToken: string): Promise<string | null> {
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
      console.log('[Social] Location found:', match.name, match.id)
      return match.id
    }
  } catch (e) {
    console.error('[Social] Location search failed:', e)
  }
  return null
}

async function postToInstagram(imageUrl: string, caption: string): Promise<string> {
  const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN!

  // Get Ölüdeniz location ID
  const locationId = await getLocationId(accessToken)

  // Step 1: Create media container
  const createUrl = `${INSTAGRAM_API}/${accountId}/media`
  const containerBody: Record<string, any> = {
    image_url: imageUrl,
    caption: caption,
    access_token: accessToken,
  }
  if (locationId) containerBody.location_id = locationId

  const createResponse = await fetch(createUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(containerBody),
  })

  const createData = await createResponse.json()
  if (!createData.id) {
    throw new Error(`Failed to create Instagram media container: ${JSON.stringify(createData)}`)
  }

  // Step 2: Wait for Instagram to process the image
  await new Promise(resolve => setTimeout(resolve, 10000))

  // Step 3: Publish the container
  const publishUrl = `${INSTAGRAM_API}/${accountId}/media_publish`
  const publishResponse = await fetch(publishUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: createData.id,
      access_token: accessToken,
    }),
  })

  const publishData = await publishResponse.json()
  if (!publishData.id) {
    throw new Error(`Failed to publish Instagram post: ${JSON.stringify(publishData)}`)
  }

  return publishData.id
}

async function logUsage(agent: string, input: number, output: number, cost: number, task: string) {
  await supabase.from('usage_logs').insert({ agent, tokens_input: input, tokens_output: output, cost_usd: cost, task, status: 'success' })
}

async function logAgent(agent: string, action: string, status: string, output: object, duration_ms?: number) {
  await supabase.from('agent_logs').insert({ agent, action, status, output, duration_ms: duration_ms || 0 })
}

function calcCost(inputTokens: number, outputTokens: number): number {
  return (inputTokens * 0.000003) + (outputTokens * 0.000015)
}
