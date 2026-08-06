export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function authCheck() {
  const session = cookies().get('admin_session')?.value
  return session === process.env.ADMIN_PASSWORD
}

const SITE_URL = (process.env.GSC_SITE_URL || 'https://www.paragliding-oludeniz.com/').trim()

// GSC'de bu sorgular icin gercek pozisyon/tiklama verisi varsa cek (ucretsiz, mevcut GSC baglantisini kullanir)
async function fetchGscQueryData(): Promise<Record<string, { clicks: number; impressions: number; position: number }>> {
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
    if (!tokenData.access_token) return {}

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
          rowLimit: 250,
        }),
      }
    )
    const gscData = await gscRes.json()
    if (!gscRes.ok) return {}

    const map: Record<string, { clicks: number; impressions: number; position: number }> = {}
    for (const row of gscData.rows || []) {
      const q = (row.keys?.[0] || '').toLowerCase().trim()
      if (!q) continue
      map[q] = {
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        position: row.position || 0,
      }
    }
    return map
  } catch {
    return {}
  }
}

export async function GET() {
  if (!authCheck()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = getSupabase()

  const [{ data: suggestions, error: sErr }, { data: checks, error: cErr }, { data: queries, error: qErr }, gscMap] =
    await Promise.all([
      supabase
        .from('ai_topic_suggestions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('ai_visibility_checks')
        .select('*')
        .order('checked_at', { ascending: false })
        .limit(200),
      supabase
        .from('ai_visibility_queries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50),
      fetchGscQueryData(),
    ])

  if (sErr || cErr || qErr) {
    return NextResponse.json({ error: sErr?.message || cErr?.message || qErr?.message }, { status: 500 })
  }

  // Her tracked sorgu icin: en son perplexity/chatgpt sonucu + varsa GSC pozisyonu
  const queryDetails = (queries || []).map((q: any) => {
    const relatedChecks = (checks || []).filter((c: any) => c.query === q.query)
    const latestBySource: Record<string, any> = {}
    for (const c of relatedChecks) {
      if (!latestBySource[c.source]) latestBySource[c.source] = c
    }
    const gsc = gscMap[q.query.toLowerCase().trim()] || null
    return { ...q, latestChecks: latestBySource, gsc }
  })

  // Basit ozet: son check batch'inde kac sorguda gorunduk / gorunmedik
  const latestCheckedAt = checks?.[0]?.checked_at
  const summary = { mentioned: 0, missed: 0, bySource: {} as Record<string, { mentioned: number; missed: number }> }
  for (const c of checks || []) {
    if (!c.source) continue
    if (!summary.bySource[c.source]) summary.bySource[c.source] = { mentioned: 0, missed: 0 }
    if (c.mentioned) {
      summary.mentioned++
      summary.bySource[c.source].mentioned++
    } else {
      summary.missed++
      summary.bySource[c.source].missed++
    }
  }

  return NextResponse.json({
    suggestions: suggestions || [],
    checks: checks || [],
    queries: queryDetails,
    summary,
    latestCheckedAt,
  })
}

export async function POST(request: Request) {
  if (!authCheck()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { id, action, queries: newQueries } = body

    if (action === 'add_queries') {
      if (!Array.isArray(newQueries) || newQueries.length === 0) {
        return NextResponse.json({ error: 'queries dizisi (en az 1 eleman) gerekli' }, { status: 400 })
      }
      const supabase = getSupabase()
      const clean = newQueries
        .map((q: any) => String(q || '').trim())
        .filter((q: string) => q.length >= 3 && q.length <= 150)
      if (clean.length === 0) {
        return NextResponse.json({ error: 'Gecerli sorgu bulunamadi' }, { status: 400 })
      }
      let added = 0
      const errors: string[] = []
      for (const q of clean) {
        const { error } = await supabase
          .from('ai_visibility_queries')
          .insert({ query: q, source: 'manual' })
        if (error) {
          if (!error.message.includes('duplicate')) errors.push(`${q}: ${error.message}`)
        } else {
          added++
        }
      }
      return NextResponse.json({ success: true, added, skipped: clean.length - added, errors })
    }

    if (!id || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'id ve gecerli action (approve/reject) gerekli' }, { status: 400 })
    }

    const supabase = getSupabase()

    const { data: suggestion, error: getErr } = await supabase
      .from('ai_topic_suggestions')
      .select('*')
      .eq('id', id)
      .single()

    if (getErr || !suggestion) {
      return NextResponse.json({ error: getErr?.message || 'Oneri bulunamadi' }, { status: 404 })
    }

    if (action === 'reject') {
      const { error } = await supabase
        .from('ai_topic_suggestions')
        .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw new Error(error.message)
      return NextResponse.json({ success: true, status: 'rejected' })
    }

    // approve: topics tablosuna ekle
    const { error: topicErr } = await supabase.from('topics').insert({
      title: suggestion.suggested_topic,
      keywords: [suggestion.query],
      priority: 60,
      status: 'pending',
    })
    if (topicErr) throw new Error(topicErr.message)

    const { error: updErr } = await supabase
      .from('ai_topic_suggestions')
      .update({ status: 'approved', reviewed_at: new Date().toISOString() })
      .eq('id', id)
    if (updErr) throw new Error(updErr.message)

    return NextResponse.json({ success: true, status: 'approved' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
