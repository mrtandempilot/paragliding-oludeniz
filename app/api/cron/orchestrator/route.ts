import { NextResponse } from 'next/server'
import { runOrchestrator } from '@/agents/orchestrator'

// Vercel Cron — runs daily at 06:00 UTC (09:00 Turkey time)
// Configured in vercel.json: { "crons": [{ "path": "/api/cron/orchestrator", "schedule": "0 6 * * *" }] }
export async function GET(request: Request) {
  // Verify Vercel cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('[Cron] Daily orchestrator triggered at', new Date().toISOString())

  try {
    const result = await runOrchestrator()

    if (result.success) {
      return NextResponse.json({
        ok: true,
        article: result.article?.title,
        instagram: result.social?.instagram_post_id,
        cost: result.total_cost_usd,
        duration_ms: result.duration_ms,
      })
    } else {
      return NextResponse.json({
        ok: false,
        error: result.error,
        duration_ms: result.duration_ms,
      }, { status: 500 })
    }
  } catch (err: any) {
    console.error('[Cron] Fatal error:', err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
