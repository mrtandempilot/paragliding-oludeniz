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

  // 1. Önce Cloudinary'deki kendi fotoğraflarına bak (oludeniz-photos klasörü)
  const ownPhoto = await getOwnPhotoFromCloudinary(keywords)

  let imageUrl: string
  let altText: string
  let unsplashId = ''
  let unsplashAuthor = ''
  let unsplashAuthorUrl = ''
  let publicId: string

  if (ownPhoto) {
    // Kendi fotoğrafı bulundu — direkt kullan, Unsplash'a gitme
    imageUrl = ownPhoto.secure_url
    publicId = ownPhoto.public_id
    altText = ownPhoto.context?.alt || `${article.title} - Paragliding Ölüdeniz`
    await logAgent('image', 'own_photo', 'running', { public_id: publicId })
  } else if (process.env.FAL_KEY) {
    // Kendi fotoğraf yok → fal.ai (FLUX) ile özel, Ölüdeniz/Türkiye temalı görsel üret, Cloudinary'e yükle
    const prompt = buildFalPrompt(keywords, article.title)
    const generated = await generateWithFalAI(prompt)
    const cloudinaryResult = await uploadToCloudinary(generated.url, article.slug)
    imageUrl = cloudinaryResult.secure_url
    publicId = cloudinaryResult.public_id
    altText = `${article.title} - Paragliding Ölüdeniz`
  } else {
    // Son çare → Unsplash'tan çek ve Cloudinary'e yükle
    const query = buildSearchQuery(keywords)
    const unsplashPhoto = await searchUnsplash(query)
    const cloudinaryResult = await uploadToCloudinary(unsplashPhoto.urls.regular, article.slug)
    imageUrl = cloudinaryResult.secure_url
    publicId = cloudinaryResult.public_id
    altText = unsplashPhoto.alt_description || `${article.title} - Paragliding Ölüdeniz`
    unsplashId = unsplashPhoto.id
    unsplashAuthor = unsplashPhoto.user.name
    unsplashAuthorUrl = unsplashPhoto.user.links.html
  }

  // 2. Makaleyi güncelle
  await supabase
    .from('articles')
    .update({
      hero_image_url: imageUrl,
      hero_image_alt: altText,
    })
    .eq('id', article.article_id)

  const imageResult: ImageResult = {
    cloudinary_url: imageUrl,
    cloudinary_public_id: publicId,
    unsplash_id: unsplashId,
    unsplash_author: unsplashAuthor,
    unsplash_author_url: unsplashAuthorUrl,
    alt_text: altText,
  }

  await logAgent('image', 'done', 'done', imageResult, Date.now() - startTime)

  return imageResult
}

// Cloudinary'deki "oludeniz-photos" klasöründen sırayla fotoğraf seç
async function getOwnPhotoFromCloudinary(keywords: string[]): Promise<{ secure_url: string; public_id: string; context?: { alt?: string } } | null> {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return null
  }

  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')

    // Cloudinary Admin API: klasördeki tüm fotoğrafları listele (max 500)
    const folder = 'oludeniz-photos'
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?folder=${folder}&max_results=500`

    const response = await fetch(url, {
      headers: { Authorization: `Basic ${auth}` },
    })

    if (!response.ok) return null

    const data = await response.json()
    const resources: Array<{ secure_url: string; public_id: string; context?: { alt?: string } }> = data.resources || []

    if (resources.length === 0) return null

    // Supabase'den son kullanılan index'i al
    const { data: setting } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'photo_index')
      .single()

    const lastIndex = parseInt(setting?.value || '-1', 10)
    const nextIndex = (lastIndex + 1) % resources.length  // 100 foto varsa 99'dan sonra 0'a döner

    // Index'i güncelle
    await supabase
      .from('settings')
      .upsert({ key: 'photo_index', value: String(nextIndex) }, { onConflict: 'key' })

    return resources[nextIndex]
  } catch {
    return null
  }
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

// Makale konusuna göre Ölüdeniz/Türkiye/yamaç paraşütü temalı fal.ai prompt'u oluştur
function buildFalPrompt(keywords: string[], title: string): string {
  const topKeyword = (keywords[0] || title || 'paragliding').toLowerCase()
  const scenery = keywords.some(k => /view|sunset|beach|sea|lagoon|landscape/i.test(k))
  const action = keywords.some(k => /tandem|flight|flying|launch|takeoff|landing|pilot/i.test(k))

  let scene: string
  if (scenery) {
    scene = 'a breathtaking aerial view of the turquoise Blue Lagoon and Ölüdeniz beach in Turkey, pine-covered mountains meeting the Mediterranean Sea, paragliders floating in the sky'
  } else if (action) {
    scene = `a tandem paraglider in flight high above Ölüdeniz, Turkey, with the turquoise Blue Lagoon and Babadağ mountain visible below, golden sunlight, sense of adventure`
  } else {
    scene = `paragliding over Ölüdeniz, Turkey — Babadağ mountain, turquoise Blue Lagoon, Mediterranean coastline, related to "${topKeyword}"`
  }

  return `Professional travel photography, ${scene}. Vibrant natural colors, sharp focus, golden-hour lighting, wide landscape composition, photorealistic, high detail, no text or watermarks.`
}

// fal.ai FLUX (schnell) ile görsel üret — döner: { url }
async function generateWithFalAI(prompt: string): Promise<{ url: string }> {
  const response = await fetch('https://fal.run/fal-ai/flux/schnell', {
    method: 'POST',
    headers: {
      Authorization: `Key ${process.env.FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      image_size: 'landscape_16_9',
      num_images: 1,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`fal.ai generation failed: ${err}`)
  }

  const data = await response.json()
  const image = data?.images?.[0]
  if (!image?.url) throw new Error('fal.ai returned no image')

  return { url: image.url }
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
