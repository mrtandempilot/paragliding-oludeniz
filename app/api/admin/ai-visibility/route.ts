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
// GSC sadece kullanicilarin GERCEKTEN Google'da yazdigi ve sitemizin en az 1 kez gosterildigi
// sorgulari doner (son 28 gun, en cok gosterim alan ilk 250 sorgu) - "kacinci sirada arama yapiyoruz"
// diye bir derinlik siniri yok, sinirlama hangi sorgularin GSC'ye dusmus olmasi.
async function fetchGscQueryData(): Promise<{
  map: Record<string, { clicks: number; impressions: number; position: number }>
  topQueries: { query: string; clicks: number; impressions: number; position: number }[]
  error: string | null
  totalRows: number
}> {
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
    if (!tokenData.access_token) {
      return { map: {}, topQueries: [], error: tokenData.error_description || 'GSC token alinamadi', totalRows: 0 }
    }

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
    if (!gscRes.ok) {
      return { map: {}, topQueries: [], error: gscData?.error?.message || 'GSC sorgusu basarisiz', totalRows: 0 }
    }

    const rows = gscData.rows || []
    const map: Record<string, { clicks: number; impressions: number; position: number }> = {}
    for (const row of rows) {
      const q = (row.keys?.[0] || '').toLowerCase().trim()
      if (!q) continue
      map[q] = {
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        position: row.position || 0,
      }
    }
    const topQueries = rows
      .slice(0, 20)
      .map((row: any) => ({
        query: row.keys?.[0] || '',
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        position: row.position || 0,
      }))
    return { map, topQueries, error: null, totalRows: rows.length }
  } catch (e: any) {
    return { map: {}, topQueries: [], error: e?.message || String(e), totalRows: 0 }
  }
}

export async function GET() {
  if (!authCheck()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = getSupabase()

  const [{ data: suggestions, error: sErr }, { data: checks, error: cErr }, { data: queries, error: qErr }, gscResult] =
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
    const gsc = gscResult.map[q.query.toLowerCase().trim()] || null
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
    gscDiagnostics: {
      error: gscResult.error,
      totalDistinctQueries: gscResult.totalRows,
      topRealQueries: gscResult.topQueries,
    },
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

    if (action === 'suggest_topic') {
      const { query, reason } = body
      if (!query || typeof query !== 'string') {
        return NextResponse.json({ error: 'query gerekli' }, { status: 400 })
      }
      const supabase = getSupabase()

      const { data: existing } = await supabase
        .from('ai_topic_suggestions')
        .select('id')
        .eq('query', query)
        .in('status', ['pending', 'approved'])
        .gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString())
        .limit(1)

      if (existing && existing.length) {
        return NextResponse.json({ error: 'Bu kelime icin zaten bekleyen/onayli bir oneri var' }, { status: 409 })
      }

      const suggestedTopic = query.charAt(0).toUpperCase() + query.slice(1)
      const { error } = await supabase.from('ai_topic_suggestions').insert({
        query,
        gap_reason: reason || 'Manuel olarak eklendi (dusuk gorunurluk)',
        suggested_topic: suggestedTopic,
        status: 'pending',
      })
      if (error) throw new Error(error.message)

      return NextResponse.json({ success: true })
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
