import { NextResponse } from 'next/server'
import { runSocialAgent } from '@/agents/social'

export async function POST(request: Request) {
  try {
    const cronSecret = request.headers.get('x-cron-secret')
    const cookie = request.headers.get('cookie') || ''

    if (
      cronSecret !== process.env.CRON_SECRET &&
      !cookie.includes(`admin_session=${process.env.ADMIN_PASSWORD}`)
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { article, image, keywords } = body

    if (!article || !image) {
      return NextResponse.json({ error: 'Article and image required' }, { status: 400 })
    }

    const social = await runSocialAgent(article, image, keywords || [])
    return NextResponse.json({ success: true, social })
  } catch (err: any) {
    console.error('[API/agents/social]', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
