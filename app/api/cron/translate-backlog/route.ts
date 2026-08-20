// Catches up TR/DE/RU translation for whichever published English article
// most recently doesn't have all 3 locales yet. Exists because the main
// orchestrator run (SEO+writer+image+publish+social+github) can itself run
// close to the 300s Hobby-plan ceiling, so its own inline translation step
// (Step 7 in agents/orchestrator.ts) sometimes doesn't get to finish. This
// route has its OWN separate 300s budget, entirely decoupled from that
// run, so it reliably finishes what didn't fit. Scheduled ~1h after the
// daily publish cron (see vercel.json) — safe/idempotent to run even when
// there's nothing to do (cheap read-only queries, no API calls made).
export const dynamic = 'force-dynamic'
export const maxDuration = 300

import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import { translateArticleToAllLocales } from '@/agents/translate'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const TARGET_LOCALES = ['tr', 'de', 'ru'] as const

async function findNextUntranslatedArticle(): Promise<{ id: string; slug: string } | null> {
  const existingByLocale: Record<string, Set<string>> = {}
  for (const locale of TARGET_LOCALES) {
    const { data, error } = await supabase
      .from('articles')
      .select('topic_id')
      .like('slug', `i18n-${locale}-%`)
    if (error) throw new Error(`Failed to fetch existing ${locale} translations: ${error.message}`)
    existingByLocale[locale] = new Set((data || []).map((r: any) => r.topic_id).filter(Boolean))
  }

  // Newest first — the point of this route is to catch up TODAY's article
  // first; any older backlog gets swept up on subsequent days too.
  const { data: sources, error } = await supabase
    .from('articles')
    .select('id, slug, topic_id')
    .eq('status', 'published')
    .not('slug', 'like', 'i18n-tr-%')
    .not('slug', 'like', 'i18n-de-%')
    .not('slug', 'like', 'i18n-ru-%')
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) throw new Error(`Failed to fetch source articles: ${error.message}`)

  for (const source of sources || []) {
    const missing = TARGET_LOCALES.some(
      locale => !source.topic_id || !existingByLocale[locale].has(source.topic_id)
    )
    if (missing) return { id: source.id, slug: source.slug }
  }
  return null
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cookie = request.headers.get('cookie') || ''
  if (
    authHeader !== `Bearer ${process.env.CRON_SECRET}` &&
    !cookie.includes(`admin_session=${process.env.ADMIN_PASSWORD}`)
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const target = await findNextUntranslatedArticle()
    if (!target) {
      console.log('[TranslateBacklog] Nothing to translate — all published articles are up to date')
      return NextResponse.json({ ok: true, translated: false, reason: 'up_to_date' })
    }

    console.log(`[TranslateBacklog] Translating: ${target.slug}`)
    const translations = await translateArticleToAllLocales(target.id)
    console.log(`[TranslateBacklog] Result: ${JSON.stringify(translations)}`)

    for (const t of translations) {
      if (t.status === 'ok' && t.slug) {
        const urlSlug = t.slug.replace(`i18n-${t.locale}-`, '')
        revalidatePath(`/${t.locale}/blog`)
        revalidatePath(`/${t.locale}/blog/${urlSlug}`)
      }
    }
    revalidatePath('/sitemap.xml')

    await supabase.from('agent_logs').insert({
      agent: 'translate-backlog',
      action: 'done',
      status: 'done',
      output: { slug: target.slug, translations },
    })

    return NextResponse.json({ ok: true, translated: true, slug: target.slug, translations })
  } catch (err: any) {
    console.error('[TranslateBacklog] Fatal error:', err)
    await supabase.from('agent_logs').insert({
      agent: 'translate-backlog',
      action: 'error',
      status: 'error',
      output: { error: err.message },
    })
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
