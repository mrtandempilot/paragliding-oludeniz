export const dynamic = 'force-dynamic'
// 300 is the HARD CEILING on this account's Vercel plan (confirmed by a
// failed deploy 2026-08-20: "maxDuration between 1 and 300 for plan
// hobby" — this project is on Hobby, not Pro, despite tolerating 166s+
// runs). A live test the same day showed the full pipeline (SEO+writer+
// image+publish+social+github+translate-3-locales) can take ~300-350s,
// i.e. translation alone can blow this budget. Two mitigations:
// 1) orchestrator.ts runs translation LAST (Step 7, after publish/social/
//    github) so a timeout only ever costs the translation step.
// 2) A separate cron (api/cron/translate-backlog, its own 300s budget)
//    catches any article translation didn't finish in time for — see
//    that route and vercel.json.
export const maxDuration = 300

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

      // Translated slugs differ per locale (not a literal translation of the
      // English URL), so revalidate each locale's own listing + detail path.
      for (const t of result.translations || []) {
        if (t.status === 'ok' && t.slug) {
          const urlSlug = t.slug.replace(`i18n-${t.locale}-`, '')
          revalidatePath(`/${t.locale}/blog`)
          revalidatePath(`/${t.locale}/blog/${urlSlug}`)
        }
      }

      // sitemap.xml has its own 1h ISR cache (app/sitemap.ts) — without this
      // it would lag up to an hour behind a fresh publish/translation.
      // Force it fresh on every successful run instead.
      revalidatePath('/sitemap.xml')
    }

    if (result.success) {
      return NextResponse.json({
        ok: true,
        slot,
        article: result.article?.title,
        instagram: result.social?.instagram_post_id,
        translations: result.translations,
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
