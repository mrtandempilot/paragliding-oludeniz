import { NextResponse } from 'next/server'
import { runWriterAgent } from '@/agents/writer'
import { SEOBrief } from '@/agents/seo'

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
    const brief: SEOBrief = body.brief

    if (!brief || !brief.topic_id) {
      return NextResponse.json({ error: 'SEO brief required' }, { status: 400 })
    }

    const article = await runWriterAgent(brief)
    return NextResponse.json({ success: true, article })
  } catch (err: any) {
    console.error('[API/agents/writer]', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
