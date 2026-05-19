import { createClient } from '@supabase/supabase-js'
import { ArticleResult } from './writer'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface ImageResult {
  cloudinary_url: string
  cloudinary_public_id: string
  unsplash_id: string
  unsplash_author: string
  unsplash_author_url: string
  alt_text: string
}

const UNSPLASH_BASE = 'https://api.unsplash.com'
const CLOUDINARY_BASE = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}`

export async function runImageAgent(article: ArticleResult, keywords: string[]): Promise<ImageResult> {
  const startTime = Date.now()

  await logAgent('image', 'start', 'running', { article_id: article.article_id })

  // 1. Search Unsplash for relevant photo
  const query = buildSearchQuery(keywords)
  const unsplashPhoto = await searchUnsplash(query)

  // 2. Upload to Cloudinary (makes it publicly accessible for Instagram)
  const cloudinaryResult = await uploadToCloudinary(unsplashPhoto.urls.regular, article.slug)

  // 3. Update article with image info
  await supabase
    .from('articles')
    .update({
      hero_image_url: cloudinaryResult.secure_url,
      hero_image_alt: unsplashPhoto.alt_description || `${article.title} - Paragliding Ölüdeniz`,
    })
    .eq('id', article.article_id)

  const imageResult: ImageResult = {
    cloudinary_url: cloudinaryResult.secure_url,
    cloudinary_public_id: cloudinaryResult.public_id,
    unsplash_id: unsplashPhoto.id,
    unsplash_author: unsplashPhoto.user.name,
    unsplash_author_url: unsplashPhoto.user.links.html,
    alt_text: unsplashPhoto.alt_description || `${article.title} - Paragliding Ölüdeniz`,
  }

  await logAgent('image', 'done', 'done', imageResult, Date.now() - startTime)

  return imageResult
}

function buildSearchQuery(keywords: string[]): string {
  // Extract most relevant terms for photo search
  const paragliding = ['paragliding', 'oludeniz', 'turkey', 'blue lagoon', 'babadağ']
  const topKeyword = keywords[0] || 'paragliding oludeniz'

  // Check if any keyword is specifically about scenery
  const hasScenery = keywords.some(k =>
    k.toLowerCase().includes('view') ||
    k.toLowerCase().includes('sunset') ||
    k.toLowerCase().includes('beach') ||
    k.toLowerCase().includes('sea')
  )

  if (hasScenery) {
    return 'oludeniz turkey blue lagoon aerial view'
  }

  return `paragliding turkey mediterranean ${topKeyword.split(' ')[0]}`
}

async function searchUnsplash(query: string) {
  const url = `${UNSPLASH_BASE}/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`

  const response = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Unsplash search failed: ${response.statusText}`)
  }

  const data = await response.json()

  if (!data.results || data.results.length === 0) {
    // Fallback: search for generic paragliding photo
    const fallbackUrl = `${UNSPLASH_BASE}/search/photos?query=paragliding+adventure&per_page=5&orientation=landscape`
    const fallbackResponse = await fetch(fallbackUrl, {
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
    })
    const fallbackData = await fallbackResponse.json()
    if (!fallbackData.results || fallbackData.results.length === 0) {
      throw new Error('No Unsplash photos found')
    }
    return fallbackData.results[0]
  }

  return data.results[0]
}

async function uploadToCloudinary(imageUrl: string, publicId: string): Promise<{ secure_url: string; public_id: string }> {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    // Cloudinary not configured — return the Unsplash URL directly
    // Note: Instagram won't work without Cloudinary, but blog images will still work
    console.warn('Cloudinary not configured, using Unsplash URL directly')
    return {
      secure_url: imageUrl,
      public_id: `oludeniz/${publicId}`,
    }
  }

  const timestamp = Math.round(Date.now() / 1000)
  const folder = 'paragliding-oludeniz'
  const cleanPublicId = `${folder}/${publicId}-${timestamp}`

  // Build signature
  const crypto = await import('crypto')
  const signatureString = `folder=${folder}&public_id=${cleanPublicId}&timestamp=${timestamp}&upload_preset=ml_default${process.env.CLOUDINARY_API_SECRET}`
  const signature = crypto.createHash('sha1').update(signatureString).digest('hex')

  const formData = new FormData()
  formData.append('file', imageUrl)
  formData.append('upload_preset', 'ml_default')
  formData.append('public_id', cleanPublicId)
  formData.append('folder', folder)
  formData.append('timestamp', timestamp.toString())
  formData.append('api_key', process.env.CLOUDINARY_API_KEY!)
  formData.append('signature', signature)

  const response = await fetch(`${CLOUDINARY_BASE}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Cloudinary upload failed: ${err}`)
  }

  const data = await response.json()
  return {
    secure_url: data.secure_url,
    public_id: data.public_id,
  }
}

async function logAgent(agent: string, action: string, status: string, output: object, duration_ms?: number) {
  await supabase.from('agent_logs').insert({ agent, action, status, output, duration_ms: duration_ms || 0 })
}
