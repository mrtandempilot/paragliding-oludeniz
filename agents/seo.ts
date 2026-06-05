import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface SEOBrief {
  topic_id: string
  title: string
  keywords: string[]
  long_tail_keywords: string[]
  meta_title: string
  meta_description: string
  article_structure: string[]
  competitor_insights: string
  content_gaps: string[]
  ai_overview_angle: string
  schema_type: string
}

export async function runSEOAgent(): Promise<SEOBrief> {
  const startTime = Date.now()

  // 1. Fetch highest priority pending topic
  const { data: topics } = await supabase
    .from('topics')
    .select('*')
    .eq('status', 'pending')
    .order('priority', { ascending: false })
    .limit(1)

  if (!topics || topics.length === 0) {
    throw new Error('No pending topics found')
  }

  const topic = topics[0]

  await logAgent('seo', 'start', 'running', { topic_id: topic.id, title: topic.title })

  // 2. Research with Claude
  const currentYear = new Date().getFullYear()

  const prompt = `You are an expert SEO researcher for paragliding-oludeniz.com, a paragliding company in Ölüdeniz, Turkey.

IMPORTANT: The current year is ${currentYear}. If the article title or meta title includes a year, always use ${currentYear}.

Research this topic and create a detailed SEO brief:
Topic: "${topic.title}"
Primary keywords: ${topic.keywords?.join(', ') || topic.title}

Analyze the topic like a professional SEO strategist. Consider:
- What questions do tourists ask before booking paragliding in Ölüdeniz?
- What content gaps exist vs GetYourGuide, Viator, TripAdvisor?
- How to optimize for Google AI Overviews (direct answers, FAQ format)?
- What long-tail keywords have lower competition?

Return a JSON object with exactly these fields:
{
  "title": "final SEO-optimized article title (under 60 chars)",
  "keywords": ["primary keyword", "secondary keyword", "tertiary keyword"],
  "long_tail_keywords": ["long tail 1", "long tail 2", "long tail 3"],
  "meta_title": "meta title under 60 chars with keyword",
  "meta_description": "compelling meta description under 155 chars",
  "article_structure": ["H2: Introduction angle", "H2: Main section 1", "H2: Main section 2", "H2: FAQ"],
  "competitor_insights": "brief summary of what competitors cover and what they miss",
  "content_gaps": ["gap 1 to exploit", "gap 2 to exploit"],
  "ai_overview_angle": "the direct answer angle to target Google AI Overviews",
  "schema_type": "Article or FAQPage or HowTo"
}

Return ONLY valid JSON, no other text.`

  const message = await anthropic.messages.create({
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const brief = JSON.parse(text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())

  // 3. Mark topic as used
  await supabase
    .from('topics')
    .update({ status: 'used', used_at: new Date().toISOString() })
    .eq('id', topic.id)

  // 4. Log usage
  const cost = calcCost(message.usage.input_tokens, message.usage.output_tokens)
  await logUsage('seo', message.usage.input_tokens, message.usage.output_tokens, cost, topic.title)
  await logAgent('seo', 'done', 'done', { brief }, Date.now() - startTime)

  return { ...brief, topic_id: topic.id }
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
