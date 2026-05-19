import { createClient } from '@supabase/supabase-js'
import { runSEOAgent, SEOBrief } from './seo'
import { runWriterAgent, ArticleResult } from './writer'
import { runImageAgent, ImageResult } from './image'
import { runSocialAgent, SocialResult } from './social'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface OrchestratorResult {
  success: boolean
  run_id: string
  brief?: SEOBrief
  article?: ArticleResult
  image?: ImageResult
  social?: SocialResult
  error?: string
  duration_ms: number
  total_cost_usd?: number
}

export async function runOrchestrator(): Promise<OrchestratorResult> {
  const startTime = Date.now()
  const runId = crypto.randomUUID()

  console.log(`[Orchestrator] Starting run ${runId}`)
  await logAgent('orchestrator', 'start', 'running', { run_id: runId })

  let brief: SEOBrief | undefined
  let article: ArticleResult | undefined
  let image: ImageResult | undefined
  let social: SocialResult | undefined

  try {
    // ── Step 1: SEO Research ────────────────────────────────────────────
    console.log('[Orchestrator] Step 1: SEO Research')
    brief = await runSEOAgent()
    console.log(`[Orchestrator] SEO Brief ready: "${brief.title}"`)

    // ── Step 2: Write Article ───────────────────────────────────────────
    console.log('[Orchestrator] Step 2: Writing Article')
    article = await runWriterAgent(brief)
    console.log(`[Orchestrator] Article ready: ${article.word_count} words, slug: ${article.slug}`)

    // ── Step 3: Find & Upload Image ─────────────────────────────────────
    console.log('[Orchestrator] Step 3: Image')
    image = await runImageAgent(article, brief.keywords)
    console.log(`[Orchestrator] Image ready: ${image.cloudinary_url}`)

    // ── Step 4: Social Media Post ───────────────────────────────────────
    console.log('[Orchestrator] Step 4: Social Media')
    social = await runSocialAgent(article, image, brief.keywords)

    if (social.instagram_post_id) {
      console.log(`[Orchestrator] Posted to Instagram: ${social.instagram_post_id}`)
    } else {
      console.log(`[Orchestrator] Instagram skipped: ${social.error}`)
    }

    // ── Step 5: Push article to GitHub (blog) ──────────────────────────
    if (process.env.GITHUB_TOKEN && process.env.GITHUB_OWNER && process.env.GITHUB_REPO) {
      console.log('[Orchestrator] Step 5: Publishing to GitHub')
      await pushArticleToGitHub(article, brief)
      console.log('[Orchestrator] Article published to GitHub')
    } else {
      console.log('[Orchestrator] GitHub not configured, skipping blog publish')
    }

    // ── Calculate total cost ────────────────────────────────────────────
    const { data: costs } = await supabase
      .from('usage_logs')
      .select('cost_usd')
      .gte('created_at', new Date(startTime).toISOString())

    const totalCost = costs?.reduce((sum, row) => sum + (row.cost_usd || 0), 0) || 0
    const duration = Date.now() - startTime

    console.log(`[Orchestrator] Run complete in ${(duration / 1000).toFixed(1)}s. Total cost: $${totalCost.toFixed(4)}`)

    await logAgent('orchestrator', 'done', 'done', {
      run_id: runId,
      article_id: article.article_id,
      slug: article.slug,
      instagram_post_id: social.instagram_post_id,
      total_cost_usd: totalCost,
    }, duration)

    return {
      success: true,
      run_id: runId,
      brief,
      article,
      image,
      social,
      duration_ms: duration,
      total_cost_usd: totalCost,
    }

  } catch (err: any) {
    const duration = Date.now() - startTime
    const errorMsg = err.message || 'Unknown error'
    console.error('[Orchestrator] Error:', errorMsg)

    await logAgent('orchestrator', 'error', 'error', {
      run_id: runId,
      error: errorMsg,
      step: detectFailedStep(brief, article, image),
    }, duration)

    return {
      success: false,
      run_id: runId,
      brief,
      article,
      image,
      social,
      error: errorMsg,
      duration_ms: duration,
    }
  }
}

function detectFailedStep(
  brief?: SEOBrief,
  article?: ArticleResult,
  image?: ImageResult
): string {
  if (!brief) return 'seo'
  if (!article) return 'writer'
  if (!image) return 'image'
  return 'social'
}

async function pushArticleToGitHub(article: ArticleResult, brief: SEOBrief): Promise<void> {
  const owner = process.env.GITHUB_OWNER!
  const repo = process.env.GITHUB_REPO!
  const token = process.env.GITHUB_TOKEN!
  const blogPath = process.env.GITHUB_BLOG_PATH || '/app/blog'

  const date = new Date().toISOString().split('T')[0]
  const fileName = `${date}-${article.slug}.mdx`
  const filePath = `${blogPath.replace(/^\//, '')}/${fileName}`

  const frontmatter = `---
title: "${article.title.replace(/"/g, '\\"')}"
date: "${date}"
slug: "${article.slug}"
description: "${article.meta_description.replace(/"/g, '\\"')}"
keywords: [${brief.keywords.map(k => `"${k}"`).join(', ')}]
image: "${(article as any).hero_image_url || ''}"
schema: ${JSON.stringify(article.schema_markup, null, 2)}
---

`

  const content = frontmatter + article.content
  const encoded = Buffer.from(content).toString('base64')

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `feat: add blog post "${article.title}"`,
      content: encoded,
      branch: 'main',
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`GitHub push failed: ${err}`)
  }

  // Update article github_path
  await supabase
    .from('articles')
    .update({ github_path: filePath })
    .eq('id', article.article_id)
}

async function logAgent(agent: string, action: string, status: string, output: object, duration_ms?: number) {
  await supabase.from('agent_logs').insert({ agent, action, status, output, duration_ms: duration_ms || 0 })
}
