import { NextResponse } from 'next/server'
import { runSEOAgent } from '@/agents/seo'

export async function POST(request: Request) {
  try {
    // Verify request is from admin or cron
    const authHeader = request.headers.get('authorization')
    const cronSecret = request.headers.get('x-cron-secret')

    if (cronSecret !== process.env.CRON_SECRET) {
      const cookie = request.headers.get('cookie') || ''
      if (!cookie.includes(`admin_session=${process.env.ADMIN_PASSWORD}`)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const brief = await runSEOAgent()
    return NextResponse.json({ success: true, brief })
  } catch (err: any) {
    console.error('[API/agents/seo]', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
