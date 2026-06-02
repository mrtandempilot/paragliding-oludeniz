export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import { runOrchestrator } from '@/agents/orchestrator'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Vercel Cron — 3 slots: 06:00, 12:00, 18:00 UTC
// Admin panelden hangi slotların aktif olduğu kontrol edilir
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const slot = searchParams.get('slot') || '06:00'

  // Supabase'den ayarları oku
  const { data: settings } = await supabase
    .from('settings')
    .select('key, value')
    .in('key', ['pilot_enabled', 'pilot_active_slots'])

  const settingsMap: Record<string, string> = {}
  for (const s of settings || []) settingsMap[s.key] = s.value

  // Pilot kapalıysa çalışma
  if (settingsMap['pilot_enabled'] !== 'true') {
    console.log(`[Cron ${slot}] ContentPilot disabled — skipping`)
    return NextResponse.json({ ok: false, reason: 'disabled' })
  }

  // Bu slot aktif değilse çalışma
  const activeSlots = (settingsMap['pilot_active_slots'] || '06:00').split(',').map(s => s.trim())
  if (!activeSlots.includes(slot)) {
    console.log(`[Cron ${slot}] Slot not active — skipping. Active: ${activeSlots.join(', ')}`)
    return NextResponse.json({ ok: false, reason: `slot ${slot} not active` })
  }

  console.log(`[Cron ${slot}] Running ContentPilot at`, new Date().toISOString())

  try {
    const result = await runOrchestrator()

    if (result.success && result.article?.slug) {
      revalidatePath('/blog')
      revalidatePath(`/blog/${result.article.slug}`)
    }

    if (result.success) {
      return NextResponse.json({
        ok: true,
        slot,
        article: result.article?.title,
        instagram: result.social?.instagram_post_id,
        cost: result.total_cost_usd,
        duration_ms: result.duration_ms,
      })
    } else {
      return NextResponse.json({
        ok: false,
        slot,
        error: result.error,
        duration_ms: result.duration_ms,
      }, { status: 500 })
    }
  } catch (err: any) {
    console.error(`[Cron ${slot}] Fatal error:`, err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
