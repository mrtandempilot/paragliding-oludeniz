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
function optimizeCloudinaryUrl(url: string): string {
  if (!url.includes("res.cloudinary.com")) return url
  return url.replace("/image/upload/", "/image/upload/q_auto,f_auto,w_1200,c_limit/")
}

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

  if (process.env.FAL_KEY) {
    // fal.ai (FLUX) ile blog yazısına özel, Ölüdeniz/Türkiye temalı görsel üret
    const prompt = buildFalPrompt(keywords, article.title)
    const generated = await generateWithFalAI(prompt)
    const cloudinaryResult = await uploadToCloudinary(generated.url, article.slug)
    imageUrl = cloudinaryResult.secure_url
    publicId = cloudinaryResult.public_id
    altText = `${article.title} - Paragliding Ölüdeniz`
  } else if (ownPhoto) {
    // fal.ai yok → kendi fotoğraflarına bak
    imageUrl = ownPhoto.secure_url
    publicId = ownPhoto.public_id
    altText = ownPhoto.context?.alt || `${article.title} - Paragliding Ölüdeniz`
    await logAgent('image', 'own_photo', 'running', { public_id: publicId })
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

// Makale başlığı ve anahtar kelimelere göre en uygun fal.ai prompt'unu üret
function buildFalPrompt(keywords: string[], title: string): string {
  const t = (title + ' ' + keywords.join(' ')).toLowerCase()

  // Konu tespiti
  const isGoPro      = /gopro|camera|video|footage|film/i.test(t)
  const isSunset     = /sunset|golden hour|dusk|evening/i.test(t)
  const isWeight     = /weight|limit|kg|heavy|overweight/i.test(t)
  const isBeginner   = /beginner|first time|first-time|never|afraid|fear/i.test(t)
  const isWear       = /wear|clothing|clothes|outfit|dress|shoes|what to/i.test(t)
  const isWeather    = /weather|wind|thermal|cloud|rain|season/i.test(t)
  const isSafety     = /safe|safety|accident|risk|danger/i.test(t)
  const isGroup      = /group|corporate|family|hen|stag|team/i.test(t)
  const isPrice      = /price|cost|cheap|discount|book|booking/i.test(t)
  const isBabadag    = /babadag|babadağ|mountain|altitude|summit/i.test(t)
  const isAcro       = /acro|freestyle|trick|spiral|stall/i.test(t)
  const isLanding    = /landing|beach|blue lagoon|ölüdeniz beach/i.test(t)
  const isAction     = /tandem|flight|flying|launch|takeoff|pilot|soar/i.test(t)
  const isScenery    = /view|aerial|landscape|coastline|mediterranean|panorama/i.test(t)

  let scene: string

  if (isGoPro) {
    scene = 'a tandem paraglider pilot wearing a GoPro camera on helmet, soaring high above the turquoise Blue Lagoon of Ölüdeniz Turkey, first-person perspective from the cockpit, crystal clear water and white sandy beach far below, vibrant colors'
  } else if (isSunset) {
    scene = 'a paraglider silhouetted against a dramatic golden-orange sunset sky above Ölüdeniz Turkey, the Blue Lagoon glowing amber below, warm cinematic light, breathtaking atmosphere'
  } else if (isBeginner) {
    scene = 'a happy first-time tandem paragliding passenger with wide smile and arms stretched out, soaring above the turquoise Blue Lagoon of Ölüdeniz Turkey, sense of pure joy and freedom, Babadağ mountain in background'
  } else if (isWear) {
    scene = 'a tandem paragliding pilot and passenger in proper paragliding gear — helmets, harnesses, comfortable sportswear — ready for takeoff on Babadağ mountain above Ölüdeniz Turkey, professional equipment clearly visible'
  } else if (isGoPro || isWeather) {
    scene = 'dramatic paragliding conditions above Ölüdeniz Turkey — puffy white clouds, thermals rising from Babadağ mountain, a paraglider navigating the blue sky, Mediterranean coastline stretching to the horizon'
  } else if (isSafety) {
    scene = 'a certified tandem paragliding instructor checking equipment before flight at Babadağ takeoff site above Ölüdeniz Turkey, safety harness and helmet clearly visible, professional and reassuring atmosphere'
  } else if (isAcro) {
    scene = 'an acro paraglider performing a dramatic spiral dive above the Blue Lagoon of Ölüdeniz Turkey, wing fully banked, turquoise water far below, action-packed and dynamic composition'
  } else if (isGroup) {
    scene = 'multiple colorful paragliders flying in formation above the Blue Lagoon of Ölüdeniz Turkey, group flying experience, Mediterranean coastline and pine forests below, festive adventure atmosphere'
  } else if (isBabadag) {
    scene = 'the majestic Babadağ mountain above Ölüdeniz Turkey at 1969 meters, pine forests clinging to steep slopes, paragliding takeoff platforms visible, turquoise Blue Lagoon and Mediterranean Sea stretching below'
  } else if (isLanding) {
    scene = 'a tandem paraglider coming in to land on the famous Ölüdeniz beach next to the Blue Lagoon, white sand, turquoise water, crowds watching, perfect Mediterranean setting'
  } else if (isScenery) {
    scene = 'breathtaking aerial view of the turquoise Blue Lagoon and Ölüdeniz beach Turkey from a paraglider perspective, pine-covered mountains meeting the Mediterranean Sea, crystal clear water, postcard-perfect landscape'
  } else if (isAction) {
    scene = 'a tandem paraglider in full flight high above Ölüdeniz Turkey, Blue Lagoon and Babadağ mountain visible below, golden sunlight, dynamic sense of speed and freedom'
  } else {
    scene = `paragliding over Ölüdeniz Turkey — turquoise Blue Lagoon, Babadağ mountain, Mediterranean coastline, adventure and freedom in the sky`
  }

  return `Professional travel photography, ${scene}. Vibrant natural colors, sharp focus, wide landscape composition, photorealistic, ultra high detail, no text, no watermarks, no logos.`
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
    secure_url: optimizeCloudinaryUrl(data.secure_url),
    public_id: data.public_id,
  }
}

async function logAgent(agent: string, action: string, status: string, output: object, duration_ms?: number) {
  await supabase.from('agent_logs').insert({ agent, action, status, output, duration_ms: duration_ms || 0 })
}
