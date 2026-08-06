export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SITE_DOMAIN = 'atmosparagliding.com'
const BRAND_NAME = 'atmos paragliding'
const MAX_QUERIES_PER_RUN = 18
const MAX_ACTIVE_QUERIES = 25
const SITE_URL = (process.env.GSC_SITE_URL || 'https://www.paragliding-oludeniz.com/').trim()

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function extractDomain(url: string): string | null {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    return host
  } catch {
    return null
  }
}

// ─── Perplexity ────────────────────────────────────────────────────────────
async function checkPerplexity(query: string) {
  try {
    const apiKey = (process.env.PERPLEXITY_API_KEY || '').trim()
    const res = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [{ role: 'user', content: query }],
      }),
    })
    const text = await res.text()
    let data: any
    try { data = JSON.parse(text) } catch {
      return { error: `Perplexity JSON degil (HTTP ${res.status}): ${text.slice(0, 200)}` }
    }
    if (!res.ok) {
      return { error: data?.error?.message || JSON.stringify(data) }
    }

    const content: string = data?.choices?.[0]?.message?.content || ''
    const citations: string[] = data?.citations || []

    let mentioned = false
    let position: number | null = null
    const competitors: string[] = []

    citations.forEach((url: string, idx: number) => {
      const domain = extractDomain(url)
      if (!domain) return
      if (domain.includes(SITE_DOMAIN)) {
        mentioned = true
        if (position === null) position = idx + 1
      } else if (!competitors.includes(domain)) {
        competitors.push(domain)
      }
    })

    if (!mentioned && content.toLowerCase().includes(BRAND_NAME)) {
      mentioned = true
    }

    return { mentioned, position, competitors, raw: content.slice(0, 2000) }
  } catch (e: any) {
    return { error: `Perplexity istegi basarisiz: ${e?.message || String(e)}` }
  }
}

// ─── OpenAI (arama ozellikli model) ─────────────────────────────────────────
async function checkOpenAI(query: string) {
  try {
    const apiKey = (process.env.OPENAI_API_KEY || '').trim()
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-search-preview',
        web_search_options: {},
        messages: [{ role: 'user', content: query }],
      }),
    })
    const text = await res.text()
    let data: any
    try { data = JSON.parse(text) } catch {
      return { error: `OpenAI JSON degil (HTTP ${res.status}): ${text.slice(0, 200)}` }
    }
    if (!res.ok) {
      return { error: data?.error?.message || JSON.stringify(data) }
    }

    const message = data?.choices?.[0]?.message
    const content: string = message?.content || ''
    const annotations: any[] = message?.annotations || []

    let mentioned = false
    let position: number | null = null
    const competitors: string[] = []

    annotations.forEach((a: any, idx: number) => {
      const url = a?.url_citation?.url
      if (!url) return
      const domain = extractDomain(url)
      if (!domain) return
      if (domain.includes(SITE_DOMAIN)) {
        mentioned = true
        if (position === null) position = idx + 1
      } else if (!competitors.includes(domain)) {
        competitors.push(domain)
      }
    })

    if (!mentioned && content.toLowerCase().includes(BRAND_NAME)) {
      mentioned = true
    }

    return { mentioned, position, competitors, raw: content.slice(0, 2000) }
  } catch (e: any) {
    return { error: `OpenAI istegi basarisiz: ${e?.message || String(e)}` }
  }
}

// ─── GSC'den yeni sorgu adaylari cek (havuzu zamanla gercek aramaya gore guncelle) ──
async function refreshQueriesFromGSC(supabase: ReturnType<typeof getSupabase>) {
  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_ADS_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET || '',
        refresh_token: process.env.GOOGLE_SEO_REFRESH_TOKEN || '',
        grant_type: 'refresh_token',
      }),
    })
    const tokenData = await tokenRes.json()
    if (!tokenData.access_token) return { added: 0, error: 'GSC token alinamadi' }

    const end = new Date()
    const start = new Date(end.getTime() - 28 * 86400000)
    const fmt = (d: Date) => d.toISOString().slice(0, 10)

    const gscRes = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: fmt(start),
          endDate: fmt(end),
          dimensions: ['query'],
          rowLimit: 15,
        }),
      }
    )
    const gscData = await gscRes.json()
    if (!gscRes.ok) return { added: 0, error: gscData?.error?.message || 'GSC sorgusu basarisiz' }

    const rows: any[] = gscData.rows || []
    const candidates = rows
      .map((r: any) => r.keys?.[0])
      .filter((q: string) => q && q.length >= 8 && q.length <= 120)

    let added = 0
    for (const q of candidates) {
      const { error, count } = await supabase
        .from('ai_visibility_queries')
        .insert({ query: q, source: 'gsc' }, { count: 'exact' })
        .select()
      if (!error && count) added += count
    }

    // Aktif havuzu limitli tut: sinir asilirsa en eski 'gsc' kaynaklilari pasife al (seed'ler hep aktif kalir)
    const { count: activeCount } = await supabase
      .from('ai_visibility_queries')
      .select('id', { count: 'exact', head: true })
      .eq('active', true)

    if ((activeCount || 0) > MAX_ACTIVE_QUERIES) {
      const overBy = (activeCount || 0) - MAX_ACTIVE_QUERIES
      const { data: oldest } = await supabase
        .from('ai_visibility_queries')
        .select('id')
        .eq('active', true)
        .eq('source', 'gsc')
        .order('created_at', { ascending: true })
        .limit(overBy)
      if (oldest && oldest.length) {
        await supabase
          .from('ai_visibility_queries')
          .update({ active: false })
          .in('id', oldest.map((r: any) => r.id))
      }
    }

    return { added }
  } catch (e: any) {
    return { added: 0, error: e?.message || String(e) }
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecretHeader = request.headers.get('x-cron-secret')
  const cookie = request.headers.get('cookie') || ''

  const isCron =
    authHeader === `Bearer ${process.env.CRON_SECRET}` ||
    cronSecretHeader === process.env.CRON_SECRET
  const isAdmin = cookie.includes(`admin_session=${process.env.ADMIN_PASSWORD}`)

  if (!isCron && !isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.PERPLEXITY_API_KEY || !process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'PERPLEXITY_API_KEY veya OPENAI_API_KEY tanimli degil' }, { status: 500 })
  }

  const supabase = getSupabase()

  const gscResult = await refreshQueriesFromGSC(supabase)

  const { data: queries, error: qErr } = await supabase
    .from('ai_visibility_queries')
    .select('id, query')
    .eq('active', true)
    .order('last_checked_at', { ascending: true, nullsFirst: true })
    .limit(MAX_QUERIES_PER_RUN)

  if (qErr) return NextResponse.json({ error: qErr.message }, { status: 500 })

  const results: any[] = []
  const gapCandidates: { query: string; reason: string }[] = []

  for (const row of queries || []) {
    const query = row.query
    const [pplx, oai] = await Promise.all([checkPerplexity(query), checkOpenAI(query)])

    await supabase
      .from('ai_visibility_queries')
      .update({ last_checked_at: new Date().toISOString() })
      .eq('id', row.id)

    for (const [source, res] of [['perplexity', pplx], ['chatgpt', oai]] as const) {
      if ('error' in res) {
        results.push({ query, source, error: res.error })
        continue
      }
      await supabase.from('ai_visibility_checks').insert({
        query,
        source,
        mentioned: res.mentioned,
        position: res.position,
        competitors: res.competitors,
        raw_response: res.raw,
      })
      results.push({ query, source, mentioned: res.mentioned, position: res.position })
    }

    const pplxMissed = !('error' in pplx) && !pplx.mentioned
    const oaiMissed = !('error' in oai) && !oai.mentioned
    if (pplxMissed && oaiMissed) {
      const topCompetitors = [
        ...(('error' in pplx) ? [] : pplx.competitors),
        ...(('error' in oai) ? [] : oai.competitors),
      ].slice(0, 3)
      gapCandidates.push({
        query,
        reason: topCompetitors.length
          ? `Ne Perplexity ne ChatGPT bizi gostermedi. Bunun yerine: ${topCompetitors.join(', ')}`
          : 'Ne Perplexity ne ChatGPT bizi gostermedi.',
      })
    }
  }

  // Gap'leri oneri olarak kaydet (son 30 gunde ayni sorgu icin bekleyen/onayli oneri varsa tekrar ekleme)
  let suggestionsAdded = 0
  for (const gap of gapCandidates) {
    const { data: existing } = await supabase
      .from('ai_topic_suggestions')
      .select('id')
      .eq('query', gap.query)
      .in('status', ['pending', 'approved'])
      .gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString())
      .limit(1)

    if (existing && existing.length) continue

    const suggestedTopic = gap.query.charAt(0).toUpperCase() + gap.query.slice(1)
    await supabase.from('ai_topic_suggestions').insert({
      query: gap.query,
      gap_reason: gap.reason,
      suggested_topic: suggestedTopic,
      status: 'pending',
    })
    suggestionsAdded++
  }

  return NextResponse.json({
    checkedQueries: (queries || []).length,
    gscQueriesAdded: gscResult.added,
    gscError: gscResult.error,
    gapsFound: gapCandidates.length,
    suggestionsAdded,
    results,
  })
}
