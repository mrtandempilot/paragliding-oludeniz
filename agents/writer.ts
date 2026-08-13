import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { SEOBrief } from './seo'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface ArticleResult {
  article_id: string
  title: string
  slug: string
  content: string
  meta_title: string
  meta_description: string
  schema_markup: object
  word_count: number
}

export async function runWriterAgent(brief: SEOBrief): Promise<ArticleResult> {
  const startTime = Date.now()

  await logAgent('writer', 'start', 'running', { topic_id: brief.topic_id, title: brief.title })

  const currentYear = new Date().getFullYear()

  const prompt = `You are an expert travel and adventure content writer for atmosparagliding.com, a paragliding company in Ölüdeniz, Turkey.

IMPORTANT: The current year is ${currentYear}. Use ${currentYear} in titles and content where a year is referenced — never use past years.

Write a complete, SEO-optimized blog article based on this brief:

Title: ${brief.title}
Primary Keywords: ${brief.keywords.join(', ')}
Long-tail Keywords: ${brief.long_tail_keywords.join(', ')}
Meta Title: ${brief.meta_title}
Meta Description: ${brief.meta_description}
Article Structure: ${brief.article_structure.join(' | ')}
AI Overview Angle: ${brief.ai_overview_angle}
Content Gaps to Fill: ${brief.content_gaps.join(', ')}

REAL PRICING — GROUND TRUTH (do not invent, estimate, or vary these numbers under any circumstances):
- Standard Tandem Flight (1200m launch, 25-35 min): $150 per person
- High Altitude Flight (1700m launch, 35-50 min): $150 per person
- Sunset Flight (1200m launch, 20-30 min): $150 per person
- Professional Photo & Video Package: $35 extra (not included in the base price)
- Group discount: 4+ people get 10% off, 8+ people get 15% off
If the article discusses price at all, it MUST match these exact figures — never write ranges like "$100-200" or claim photo/video is included free. These numbers are the single source of truth from the live /prices page.

Writing Requirements (FAQ-STYLE FORMAT — MANDATORY):
- 1500-2000 words total
- The ENTIRE article must be written as a comprehensive FAQ-style guide
- Start with a short intro paragraph (3-4 sentences) that sets the scene and includes the primary keyword
- EVERY H2 heading must be a QUESTION that real customers ask (e.g. "How long does the tandem flight last?", "What should I wear for paragliding in Ölüdeniz?")
- Answer each question DIRECTLY in the first 1-2 sentences under its heading (Google AI Overview friendly), then expand with practical details
- HEADING HIERARCHY: NEVER include an H1 in the content — the page template already renders the article title as H1. Content starts with the intro paragraph, then H2 question headings, with H3 subheadings for details inside answers. Never skip levels (no H4 directly under H2)
- Use H3 subheadings, short paragraphs and bullet lists inside answers for scannability
- Include the primary keyword naturally in the intro, in at least 2 question headings, and in the conclusion
- Include long-tail keywords naturally — long-tail keywords often ARE the questions
- Write in an engaging, informative tone for tourists/adventure seekers
- Include specific details about Ölüdeniz: Blue Lagoon, Babadağ Mountain (1960m), Mediterranean climate
- Use "we" and "our team" to build trust
- End with a short conclusion + clear call-to-action to book at atmosparagliding.com
- Do NOT use placeholder text or generic filler

Return a JSON object with exactly these fields:
{
  "title": "exact article title",
  "slug": "url-friendly-slug-with-hyphens",
  "content": "full markdown article content",
  "schema_markup": {
    "@context": "https://schema.org",
    "@type": "${brief.schema_type}",
    "headline": "...",
    "description": "..."
  }
}

Schema: articles are FAQ-style, so schema_markup should be FAQPage with a mainEntity array of Question/Answer pairs built from the article's H2 questions (concise 40-60 word answers).
For Article schema, include author, datePublished fields.
Return ONLY valid JSON, no other text.`

  const message = await anthropic.messages.create({
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
    max_tokens: 6000,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const result = JSON.parse(text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())

  const wordCount = result.content.split(/\s+/).length

  // Save article draft to Supabase
  const { data: article, error } = await supabase
    .from('articles')
    .insert({
      topic_id: brief.topic_id,
      title: result.title,
      slug: result.slug,
      content: result.content,
      meta_title: brief.meta_title,
      meta_description: brief.meta_description,
      keywords: brief.keywords,
      schema_markup: result.schema_markup,
      status: 'draft',
      word_count: wordCount,
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to save article: ${error.message}`)

  const cost = calcCost(message.usage.input_tokens, message.usage.output_tokens)
  await logUsage('writer', message.usage.input_tokens, message.usage.output_tokens, cost, brief.title)
  await logAgent('writer', 'done', 'done', { article_id: article.id, word_count: wordCount }, Date.now() - startTime)

  return {
    article_id: article.id,
    title: result.title,
    slug: result.slug,
    content: result.content,
    meta_title: brief.meta_title,
    meta_description: brief.meta_description,
    schema_markup: result.schema_markup,
    word_count: wordCount,
  }
}

async function logUsage(agent: string, input: number, output: number, cost: number, task: string) {
  await supabase.from('usage_logs').insert({ agent, tokens_input: input, tokens_output: output, cost_usd: cost, task, status: 'success' })
}

async function logAgent(agent: string, action: string, status: string, output: object, duration_ms?: number) {
  await supabase.from('agent_logs').insert({ agent, action, status, output, duration_ms: duration_ms || 0 })
}

function calcCost(inputTokens: number, outputTokens: number): number {
  // claude-sonnet-4: $3/1M input, $15/1M output
  return (inputTokens * 0.000003) + (outputTokens * 0.000015)
}
