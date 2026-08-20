export const maxDuration = 300

import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { runOrchestrator } from '@/agents/orchestrator'

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

    const result = await runOrchestrator()

    // Makale başarıyla yayınlandıysa blog cache'ini anında temizle
    if (result.success && result.article?.slug) {
      revalidatePath('/blog')
      revalidatePath(`/blog/${result.article.slug}`)

      for (const t of result.translations || []) {
        if (t.status === 'ok' && t.slug) {
          const urlSlug = t.slug.replace(`i18n-${t.locale}-`, '')
          revalidatePath(`/${t.locale}/blog`)
          revalidatePath(`/${t.locale}/blog/${urlSlug}`)
        }
      }

      // sitemap.xml has its own 1h ISR cache (app/sitemap.ts) — force fresh.
      revalidatePath('/sitemap.xml')
    }

    const status = result.success ? 200 : 500
    return NextResponse.json(result, { status })
  } catch (err: any) {
    console.error('[API/agents/orchestrator]', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
