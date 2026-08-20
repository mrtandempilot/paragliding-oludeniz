// Plain CommonJS runner (no ts-node/tsx dependency needed) — translates
// published English blog articles into Turkish/German/Russian and inserts
// them into the SAME `articles` table using a slug-prefix convention
// ("i18n-tr-...", "i18n-de-...", "i18n-ru-...").
//
// Run from the project root:
//   node agents/translate.js            (translate everything not yet done)
//   set TRANSLATE_LIMIT=1 && node agents/translate.js   (Windows, test 1 article)

const fs = require('fs')
const path = require('path')

// --- minimal .env.local loader (no extra dependency) ---
function loadEnvLocal() {
  const envPath = path.join(__dirname, '..', '.env.local')
  if (!fs.existsSync(envPath)) return
  const content = fs.readFileSync(envPath, 'utf8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = value
  }
}
loadEnvLocal()

const Anthropic = require('@anthropic-ai/sdk')
const { createClient } = require('@supabase/supabase-js')

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const TARGET_LOCALES = ['tr', 'de', 'ru']
const LOCALE_NAMES = { tr: 'Turkish', de: 'German', ru: 'Russian' }

async function fetchSourceArticles() {
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
async function fetchExistingTranslationTopicIds(locale) {
  const { data, error } = await supabase
    .from('articles')
    .select('topic_id')
    .like('slug', `i18n-${locale}-%`)
  if (error) throw new Error(`Failed to fetch existing ${locale} translations: ${error.message}`)
  return new Set((data || []).map(r => r.topic_id).filter(Boolean))
}

async function translateOne(source, locale) {
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

  const toolUse = message.content.find(block => block.type === 'tool_use')
  if (!toolUse) throw new Error(`No tool_use block for ${source.slug} -> ${locale}`)
  const result = toolUse.input

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

async function insertTranslation(source, locale, t) {
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

  const existingByLocale = {
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
      } catch (err) {
        failed++
        console.error(`[Translate] FAIL: ${source.slug} -> ${locale}: ${err.message}`)
      }
    }
  }

  console.log(`[Translate] Done. ${done} succeeded, ${skipped} skipped (already translated), ${failed} failed, out of ${total}.`)
}

main().catch(err => {
  console.error('[Translate] Fatal error:', err)
  process.exit(1)
})
