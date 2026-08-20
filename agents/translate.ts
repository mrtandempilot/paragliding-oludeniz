import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Non-English translations live in the SAME `articles` table as regular
// published rows, distinguished only by a slug prefix ("i18n-tr-...",
// "i18n-de-...", "i18n-ru-..."). See app/[locale]/blog/page.tsx and
// app/[locale]/blog/[slug]/page.tsx for the read side of this convention.
// We picked a slug-prefix convention instead of a new DB column/table
// because this sandbox has no way to run DDL against the production
// Supabase project (no dashboard login, no CLI auth, no direct Postgres
// connection string available) — this works with the existing anon-key
// INSERT permissions the other agents already use.

const TARGET_LOCALES = ['tr', 'de', 'ru'] as const
type Locale = typeof TARGET_LOCALES[number]

const LOCALE_NAMES: Record<Locale, string> = {
  tr: 'Turkish',
  de: 'German',
  ru: 'Russian',
}

interface SourceArticle {
  id: string
  topic_id: string | null
  title: string
  slug: string
  content: string
  meta_title: string
  meta_description: string
  keywords: string[]
  schema_markup: any
  hero_image_url: string | null
  hero_image_alt: string | null
  excerpt: string | null
  word_count: number
}

interface TranslatedArticle {
  title: string
  slug: string
  content: string
  meta_title: string
  meta_description: string
  hero_image_alt: string
  excerpt: string
  schema_markup: any
}

async function fetchSourceArticles(): Promise<SourceArticle[]> {
  let query = supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .not('slug', 'like', 'i18n-tr-%')
    .not('slug', 'like', 'i18n-de-%')
    .not('slug', 'like', 'i18n-ru-%')
    .order('published_at', { ascending: true })

  const limit = process.env.TRANSLATE_LIMIT ? parseInt(process.env.TRANSLATE_LIMIT, 10) : undefined
  if (limit) query = query.limit(limit)

  const { data, error } = await query
  if (error) throw new Error(`Failed to fetch source articles: ${error.message}`)
  return data || []
}

// Dedup by the SOURCE article's topic_id (copied onto every translated row —
// see insertTranslation), not by slug. The translator LLM is not
// deterministic: re-translating the same source can produce a slightly
// different slug each time, so a slug-based "already exists" check can miss
// a real duplicate and insert the same article twice. Checking topic_id
// BEFORE calling the API also avoids paying for a translation we're going
// to throw away.
async function fetchExistingTranslationTopicIds(locale: Locale): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('articles')
    .select('topic_id')
    .like('slug', `i18n-${locale}-%`)

  if (error) throw new Error(`Failed to fetch existing ${locale} translations: ${error.message}`)
  return new Set((data || []).map((r: any) => r.topic_id).filter(Boolean))
}

async function translateOne(source: SourceArticle, locale: Locale): Promise<TranslatedArticle> {
  const langName = LOCALE_NAMES[locale]

  const prompt = `You are a native ${langName}-speaking travel/SEO content localizer for atmosparagliding.com, a paragliding company in Ölüdeniz, Turkey.

Localize the following English blog article into natural, fluent ${langName} — this is NOT a literal word-for-word translation. Adapt it the way a native ${langName} copywriter would write it for ${langName}-speaking search engine and AI-assistant users researching paragliding in Ölüdeniz/Fethiye. Use the phrasing and keywords real ${langName} speakers actually search with for this topic (not a direct translation of the English keywords).

REAL PRICING — GROUND TRUTH (do not invent, estimate, or vary these numbers under any circumstances):
- Standard Tandem Flight (1200m launch, 25-35 min): $150 per person
- High Altitude Flight (1700m launch, 35-50 min): $150 per person
- Sunset Flight (1200m launch, 20-30 min): $150 per person
- Professional Photo & Video Package: $35 extra (not included in the base price)
- Group discount: 4+ people get 10% off, 8+ people get 15% off
If the article discusses price at all, keep these exact figures (only the currency/number formatting convention may adapt to ${langName} norms — the amounts themselves must not change).

Source article:
Title: ${source.title}
Meta title: ${source.meta_title}
Meta description: ${source.meta_description}
Content (Markdown):
${source.content}

Requirements:
- Keep the same Markdown heading structure (same number of H2/H3 headings, same FAQ-question format under each H2) — translate/localize the questions and answers, don't add or remove sections.
- Keep all factual details (Babadağ height 1,960m, Blue Lagoon, flight durations, pricing above) accurate and unchanged in meaning.
- Produce a URL-friendly slug in plain ASCII (lowercase, hyphens only, no accented/Cyrillic/Turkish-special characters — transliterate them, e.g. ö→o, ü→u, ş→s, ğ→g, İ/ı→i, Cyrillic → Latin transliteration) that reads naturally for a ${langName} search query about this topic.
- Translate meta_title (under 60 chars) and meta_description (under 155 chars) for ${langName} search users, not literal translations.
- Translate hero_image_alt (accessible alt text for the hero photo) and excerpt (1-2 sentence summary) accordingly.
- schema_markup: keep the exact same JSON structure/keys as the source, but translate all human-readable string VALUES (headline, description, FAQ question/answer text, etc.) into ${langName}. Never translate JSON keys, @type/@context values, or URLs.

Call the submit_translation tool with the result.`

  const message = await anthropic.messages.create({
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
    max_tokens: 8000,
    tools: [
      {
        name: 'submit_translation',
        description: `Submit the completed ${langName} localization of the article.`,
        input_schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            slug: { type: 'string', description: 'ASCII-only, lowercase, hyphenated' },
            content: { type: 'string', description: 'Full localized markdown article content' },
            meta_title: { type: 'string' },
            meta_description: { type: 'string' },
            hero_image_alt: { type: 'string' },
            excerpt: { type: 'string' },
            schema_markup: { type: 'object' },
          },
          required: ['title', 'slug', 'content', 'meta_title', 'meta_description', 'hero_image_alt', 'excerpt', 'schema_markup'],
        },
      },
    ],
    tool_choice: { type: 'tool', name: 'submit_translation' },
    messages: [{ role: 'user', content: prompt }],
  })

  const toolUse = message.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
  )
  if (!toolUse) throw new Error(`No tool_use block for ${source.slug} -> ${locale}`)

  const result = toolUse.input as TranslatedArticle

  // Log AI cost the same way the other agents do.
  const cost = (message.usage.input_tokens * 0.000003) + (message.usage.output_tokens * 0.000015)
  await supabase.from('usage_logs').insert({
    agent: 'translate',
    tokens_input: message.usage.input_tokens,
    tokens_output: message.usage.output_tokens,
    cost_usd: cost,
    task: `${source.slug} -> ${locale}`,
    status: 'success',
  })

  return result
}

async function insertTranslation(source: SourceArticle, locale: Locale, t: TranslatedArticle) {
  const slug = `i18n-${locale}-${t.slug}`
  const wordCount = t.content.split(/\s+/).length

  const { error } = await supabase.from('articles').insert({
    topic_id: source.topic_id,
    title: t.title,
    slug,
    content: t.content,
    meta_title: t.meta_title,
    meta_description: t.meta_description,
    keywords: source.keywords,
    schema_markup: t.schema_markup,
    status: 'published',
    word_count: wordCount,
    hero_image_url: source.hero_image_url,
    hero_image_alt: t.hero_image_alt,
    // NOTE: the `articles` table has no `excerpt` column (confirmed live via
    // PostgREST schema-cache error) — the rest of the codebase derives a
    // listing excerpt from meta_description instead (see app/[locale]/blog/
    // page.tsx), so we do the same and don't try to store t.excerpt.
  })

  if (error) throw new Error(`Insert failed for ${slug}: ${error.message}`)
  return slug
}

async function main() {
  const sources = await fetchSourceArticles()
  console.log(`[Translate] ${sources.length} source (English) articles found.`)

  const existingByLocale: Record<Locale, Set<string>> = {
    tr: await fetchExistingTranslationTopicIds('tr'),
    de: await fetchExistingTranslationTopicIds('de'),
    ru: await fetchExistingTranslationTopicIds('ru'),
  }

  let done = 0
  let skipped = 0
  let failed = 0
  const total = sources.length * TARGET_LOCALES.length

  for (const source of sources) {
    for (const locale of TARGET_LOCALES) {
      if (source.topic_id && existingByLocale[locale].has(source.topic_id)) {
        skipped++
        console.log(`[Translate] SKIP (topic already translated, no API call made): ${source.slug} -> ${locale}`)
        continue
      }
      try {
        const t = await translateOne(source, locale)
        const inserted = await insertTranslation(source, locale, t)
        if (source.topic_id) existingByLocale[locale].add(source.topic_id)
        done++
        console.log(`[Translate] OK (${done}/${total - skipped}): ${source.slug} -> ${inserted}`)
      } catch (err: any) {
        failed++
        console.error(`[Translate] FAIL: ${source.slug} -> ${locale}: ${err.message}`)
      }
    }
  }

  console.log(`[Translate] Done. ${done} succeeded, ${skipped} skipped (already translated), ${failed} failed, out of ${total}.`)
}

// NOTE: `main()` above is only exercised by the standalone CommonJS port
// (agents/translate.js, run manually via `node agents/translate.js` for
// one-off backfills). This file is also imported directly into the live
// Next.js app (see translateArticleToAllLocales below, wired into
// agents/orchestrator.ts) — so `main()` must NOT auto-run on import here,
// unlike a plain CLI script. It's kept as a reference/manual-run entry
// point only; nothing currently calls it from this .ts file.

export interface TranslationOutcome {
  locale: Locale
  status: 'ok' | 'skip' | 'fail'
  slug?: string
  error?: string
}

// Translate ONE already-published English article into all target locales.
// Used by the daily ContentPilot pipeline right after a new article is
// published, so every day's new post gets TR/DE/RU versions automatically
// (not just the one-off backlog covered by the standalone translate.js run).
// Runs the 3 locales in PARALLEL (not sequential like main()'s backfill
// loop) to keep the added time to ~1 translation call instead of 3x, since
// this runs inline in the same request as the rest of the daily pipeline.
// Safe to call even if some/all locales are already translated (topic_id
// dedup — see fetchExistingTranslationTopicIds) or if it's re-invoked after
// a partial failure: already-done locales are skipped, not re-billed.
export async function translateArticleToAllLocales(articleId: string): Promise<TranslationOutcome[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', articleId)
    .single()

  if (error || !data) {
    throw new Error(`translateArticleToAllLocales: could not load article ${articleId}: ${error?.message || 'not found'}`)
  }

  const source = data as SourceArticle

  // Defensive: never try to re-translate an already-translated row (this
  // function is meant to be called with the freshly-written English
  // article's id, but guard against a bad call site anyway).
  if (TARGET_LOCALES.some(l => source.slug.startsWith(`i18n-${l}-`))) {
    return []
  }

  const existingByLocale: Partial<Record<Locale, Set<string>>> = {}
  for (const locale of TARGET_LOCALES) {
    existingByLocale[locale] = await fetchExistingTranslationTopicIds(locale)
  }

  const settled = await Promise.allSettled(
    TARGET_LOCALES.map(async (locale): Promise<TranslationOutcome> => {
      if (source.topic_id && existingByLocale[locale]!.has(source.topic_id)) {
        return { locale, status: 'skip' }
      }
      const t = await translateOne(source, locale)
      const slug = await insertTranslation(source, locale, t)
      return { locale, status: 'ok', slug }
    })
  )

  return settled.map((r, i) => {
    if (r.status === 'fulfilled') return r.value
    return { locale: TARGET_LOCALES[i], status: 'fail', error: r.reason?.message || String(r.reason) }
  })
}
