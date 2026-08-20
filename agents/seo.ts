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

// ── Auto-generate new topics when none are pending ──────────────────────────
async function generateNewTopics(): Promise<void> {
  console.log('[SEO] No pending topics — auto-generating new ones...')

  // Fetch existing topic titles to avoid duplicates
  const { data: existingTopics } = await supabase
    .from('topics')
    .select('title')
    .limit(100)

  const existingTitles = (existingTopics || []).map((t: any) => t.title).join('\n')

  const currentYear = new Date().getFullYear()

  const prompt = `You are an SEO content strategist for atmosparagliding.com, a tandem paragliding company in Ölüdeniz, Turkey.

Generate 10 NEW blog topic ideas that:
- Target tourists searching for paragliding in Ölüdeniz / Turkey
- Are NOT already in this list of existing topics:
${existingTitles}
- Mix of: beginner questions, experience descriptions, comparison articles, local tips, safety, pricing, booking, seasonal content
- High search intent (people about to book or researching)
- Current year if year is needed: ${currentYear}

Call the submit_topics tool with exactly 10 topic ideas.`

  const message = await anthropic.messages.create({
    model: process.env.CLAUDE_MODEL || 'claude-haiku-4-5-20251001',
    max_tokens: 1000,
    tools: [
      {
        name: 'submit_topics',
        description: 'Submit the 10 generated blog topic ideas.',
        input_schema: {
          type: 'object',
          properties: {
            topics: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  keywords: { type: 'array', items: { type: 'string' } },
                },
                required: ['title', 'keywords'],
              },
            },
          },
          required: ['topics'],
        },
      },
    ],
    tool_choice: { type: 'tool', name: 'submit_topics' },
    messages: [{ role: 'user', content: prompt }],
  })

  const toolUse = message.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
  )
  const newTopics = toolUse ? (toolUse.input as { topics: any[] }).topics : []

  // Insert into DB
  const rows = newTopics.map((t: any) => ({
    title: t.title,
    keywords: t.keywords || [],
    status: 'pending',
  }))

  await supabase.from('topics').insert(rows)
  console.log(`[SEO] Auto-generated ${rows.length} new topics`)

  // Log cost (haiku is cheap)
  const cost = (message.usage.input_tokens * 0.0000008) + (message.usage.output_tokens * 0.000004)
  await logUsage('seo', message.usage.input_tokens, message.usage.output_tokens, cost, 'auto-generate topics')
}

export async function runSEOAgent(): Promise<SEOBrief> {
  const startTime = Date.now()

  // 1. Fetch highest priority pending topic
  let { data: topics } = await supabase
    .from('topics')
    .select('*')
    .eq('status', 'pending')
    .order('priority', { ascending: false })
    .limit(1)

  // Auto-generate topics if none pending
  if (!topics || topics.length === 0) {
    await generateNewTopics()

    const { data: freshTopics } = await supabase
      .from('topics')
      .select('*')
      .eq('status', 'pending')
      .order('priority', { ascending: false })
      .limit(1)

    topics = freshTopics
  }

  if (!topics || topics.length === 0) {
    throw new Error('Failed to generate topics')
  }

  const topic = topics[0]

  await logAgent('seo', 'start', 'running', { topic_id: topic.id, title: topic.title })

  // 2. Research with Claude
  const currentYear = new Date().getFullYear()

  const prompt = `You are an expert SEO researcher for atmosparagliding.com, a paragliding company in Ölüdeniz, Turkey.

IMPORTANT: The current year is ${currentYear}. If the article title or meta title includes a year, always use ${currentYear}.

Research this topic and create a detailed SEO brief:
Topic: "${topic.title}"
Primary keywords: ${topic.keywords?.join(', ') || topic.title}

Analyze the topic like a professional SEO strategist. Consider:
- What questions do tourists ask before booking paragliding in Ölüdeniz?
- What content gaps exist vs GetYourGuide, Viator, TripAdvisor?
- How to optimize for Google AI Overviews (direct answers, FAQ format)?
- What long-tail keywords have lower competition?

Call the submit_brief tool with the finished SEO brief. article_structure needs 6-9 items — EVERY item must be a real question customers ask, phrased as a question. schema_type should be "FAQPage" (default — all articles are written in FAQ format).`

  const message = await anthropic.messages.create({
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
    max_tokens: 1500,
    tools: [
      {
        name: 'submit_brief',
        description: 'Submit the completed SEO brief for the article.',
        input_schema: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Final SEO-optimized article title (under 60 chars)' },
            keywords: { type: 'array', items: { type: 'string' }, description: 'primary, secondary, tertiary keyword' },
            long_tail_keywords: { type: 'array', items: { type: 'string' } },
            meta_title: { type: 'string', description: 'meta title under 60 chars with keyword' },
            meta_description: { type: 'string', description: 'compelling meta description under 155 chars' },
            article_structure: { type: 'array', items: { type: 'string' }, description: '6-9 H2 customer questions' },
            competitor_insights: { type: 'string' },
            content_gaps: { type: 'array', items: { type: 'string' } },
            ai_overview_angle: { type: 'string' },
            schema_type: { type: 'string' },
          },
          required: [
            'title', 'keywords', 'long_tail_keywords', 'meta_title', 'meta_description',
            'article_structure', 'competitor_insights', 'content_gaps', 'ai_overview_angle', 'schema_type',
          ],
        },
      },
    ],
    tool_choice: { type: 'tool', name: 'submit_brief' },
    messages: [{ role: 'user', content: prompt }],
  })

  const toolUse = message.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
  )
  if (!toolUse) throw new Error('SEO agent did not return a tool_use block')
  const brief = toolUse.input as Omit<SEOBrief, 'topic_id'>

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
