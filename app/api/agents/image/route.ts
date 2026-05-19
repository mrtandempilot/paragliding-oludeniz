import { NextResponse } from 'next/server'
import { runImageAgent } from '@/agents/image'

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
    const { article, keywords } = body

    if (!article || !article.article_id) {
      return NextResponse.json({ error: 'Article required' }, { status: 400 })
    }

    const image = await runImageAgent(article, keywords || [])
    return NextResponse.json({ success: true, image })
  } catch (err: any) {
    console.error('[API/agents/image]', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
