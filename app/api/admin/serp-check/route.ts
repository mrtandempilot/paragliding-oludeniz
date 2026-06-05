export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  // Auth check
  const cookieStore = cookies()
  const session = cookieStore.get('admin_session')
  if (!session || session.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const keyword = request.nextUrl.searchParams.get('keyword') || 'paragliding oludeniz'
  const apiKey = process.env.SERP_API_KEY

  if (!apiKey) {
    return NextResponse.json({ configured: false })
  }

  try {
    const url = new URL('https://serpapi.com/search')
    url.searchParams.set('q', keyword)
    url.searchParams.set('gl', 'gb') // UK results (English)
    url.searchParams.set('hl', 'en')
    url.searchParams.set('num', '10')
    url.searchParams.set('api_key', apiKey)

    const res = await fetch(url.toString())
    const data = await res.json()

    // Extract paid ads
    const ads = (data.ads || []).map((ad: any, i: number) => ({
      position: i + 1,
      title: ad.title,
      domain: ad.displayed_link || ad.link,
      description: ad.description,
      link: ad.link,
      isMine: (ad.link || '').includes('paragliding-oludeniz.com'),
    }))

    // Extract organic results
    const organic = (data.organic_results || []).slice(0, 10).map((r: any, i: number) => ({
      position: i + 1,
      title: r.title,
      domain: r.displayed_link || r.link,
      description: r.snippet,
      link: r.link,
      isMine: (r.link || '').includes('paragliding-oludeniz.com'),
    }))

    return NextResponse.json({ ads, organic, keyword })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
