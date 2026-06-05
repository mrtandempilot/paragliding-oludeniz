export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || 'paragliding oludeniz'

  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&orientation=squarish`,
    {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    }
  )

  const data = await res.json()

  if (data.errors) {
    return NextResponse.json({ error: data.errors[0] }, { status: 500 })
  }

  const photos = (data.results || []).map((photo: any) => ({
    id: photo.id,
    url: photo.urls.regular,        // 1080px — Instagram için ideal
    thumb: photo.urls.small,        // önizleme için küçük
    alt: photo.alt_description || query,
    author: photo.user.name,
    author_link: photo.user.links.html,
  }))

  return NextResponse.json({ photos })
}
