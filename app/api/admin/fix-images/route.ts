import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const UNSPLASH_BASE = 'https://api.unsplash.com'

// Fallback Unsplash paragliding görselleri (hardcoded, her zaman çalışır)
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=1200&q=80',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',
  'https://images.unsplash.com/photo-1601024445121-e5b82f020549?w=1200&q=80',
  'https://images.unsplash.com/photo-1527672809634-97fd17313c44?w=1200&q=80',
  'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=1200&q=80',
]

async function isImageAccessible(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) })
    return response.ok
  } catch {
    return false
  }
}

async function fetchUnsplashImage(query: string): Promise<string> {
  try {
    const url = `${UNSPLASH_BASE}/search/photos?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`
    const response = await fetch(url, {
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
    })
    if (!response.ok) throw new Error('Unsplash failed')
    const data = await response.json()
    if (data.results?.length > 0) {
      return data.results[0].urls.regular
    }
  } catch { /* fallback */ }
  // Unsplash da başarısız → hardcoded fallback
  return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)]
}

export async function POST() {
  // Auth kontrolü
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  if (session?.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Tüm published makaleleri çek
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, slug, hero_image_url, keywords')
    .eq('status', 'published')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const results = []

  for (const article of articles || []) {
    const isOk = article.hero_image_url ? await isImageAccessible(article.hero_image_url) : false

    if (!isOk) {
      // Resim bozuk → yenisini çek
      const query = article.keywords?.join(' ') || `paragliding oludeniz turkey`
      const newUrl = await fetchUnsplashImage(query)

      await supabase
        .from('articles')
        .update({ hero_image_url: newUrl })
        .eq('id', article.id)

      results.push({ title: article.title, status: 'fixed', newUrl })
    } else {
      results.push({ title: article.title, status: 'ok' })
    }
  }

  const fixedCount = results.filter(r => r.status === 'fixed').length
  return NextResponse.json({ success: true, total: results.length, fixed: fixedCount, results })
}
