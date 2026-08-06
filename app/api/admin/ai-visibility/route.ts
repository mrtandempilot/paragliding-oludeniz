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

export async function GET() {
  if (!authCheck()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = getSupabase()

  const [{ data: suggestions, error: sErr }, { data: checks, error: cErr }, { data: queries, error: qErr }] =
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
        .limit(100),
      supabase
        .from('ai_visibility_queries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50),
    ])

  if (sErr || cErr || qErr) {
    return NextResponse.json({ error: sErr?.message || cErr?.message || qErr?.message }, { status: 500 })
  }

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
    queries: queries || [],
    summary,
    latestCheckedAt,
  })
}

export async function POST(request: Request) {
  if (!authCheck()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { id, action } = body

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
