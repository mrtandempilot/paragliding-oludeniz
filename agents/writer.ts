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

  const prompt = `You are an expert travel and adventure content writer for paragliding-oludeniz.com, a paragliding company in Ölüdeniz, Turkey.

Write a complete, SEO-optimized blog article based on this brief:

Title: ${brief.title}
Primary Keywords: ${brief.keywords.join(', ')}
Long-tail Keywords: ${brief.long_tail_keywords.join(', ')}
Meta Title: ${brief.meta_title}
Meta Description: ${brief.meta_description}
Article Structure: ${brief.article_structure.join(' | ')}
AI Overview Angle: ${brief.ai_overview_angle}
Content Gaps to Fill: ${brief.content_gaps.join(', ')}

Writing Requirements:
- 1100-1300 words total
- Use the exact article structure provided (H2 headings)
- Include the primary keyword naturally in first paragraph, H2 headings, and conclusion
- Include long-tail keywords naturally throughout
- Write in an engaging, informative tone for tourists/adventure seekers
- Include specific details about Ölüdeniz: Blue Lagoon, Babadağ Mountain (1960m), Mediterranean climate
- Add a FAQ section at the end (3-5 questions) if schema_type is FAQPage
- Use "we" and "our team" to build trust
- End with a clear call-to-action to book at paragliding-oludeniz.com
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

For FAQPage schema, include mainEntity array with Question/Answer pairs.
For Article schema, include author, datePublished fields.
Return ONLY valid JSON, no other text.`

  const message = await anthropic.messages.create({
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
    max_tokens: 4000,
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
