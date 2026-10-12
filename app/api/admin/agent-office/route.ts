// Agent Office data: every agent with its live state derived from agent_logs.
export const dynamic = 'force-dynamic'
export const maxDuration = 300

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/agents/core'
import { AGENTS } from '@/lib/agents/registry'
import { runAdsAgent } from '@/lib/agents/ads-agent'
import { runReservationAgent } from '@/lib/agents/reservation-agent'
import { runOrchestrator } from '@/agents/orchestrator'


export async function GET() {
  if (cookies().get('admin_session')?.value !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const since = new Date(Date.now() - 14 * 86400000).toISOString()
  const { data, error } = await db().from('agent_logs').select('agent,action,status,error,output,duration_ms,created_at').gte('created_at', since).order('created_at', { ascending: false }).limit(800)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const now = Date.now()
  const agents = AGENTS.map(a => {
    const logs = (data || []).filter(l => l.agent === a.id)
    const last = logs[0]
    let state: 'working' | 'idle' | 'error' | 'sleeping' = 'sleeping'
    if (last) {
      const age = now - new Date(last.created_at).getTime()
      if (last.status === 'running' && age < 10 * 60000) state = 'working'
      else if (last.status === 'error') state = 'error'
      else if (age < 36 * 3600000) state = 'idle'
    }
    return {
      ...a, state,
      last: last ? { action: last.action, status: last.status, at: last.created_at, error: last.error } : null,
      runs14d: logs.filter(l => l.status !== 'running').length,
      errors14d: logs.filter(l => l.status === 'error').length,
      recent: logs.slice(0, 12).map(l => ({ action: l.action, status: l.status, at: l.created_at, error: l.error, ms: l.duration_ms })),
    }
  })
  return NextResponse.json({ agents, at: new Date().toISOString() })
}

// POST {agent}: run an agent now from the office
export async function POST(request: Request) {
  if (cookies().get('admin_session')?.value !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { agent } = await request.json().catch(() => ({}))
  try {
    if (agent === 'google-ads') return NextResponse.json({ ok: true, result: await runAdsAgent() })
    if (agent === 'rezervasyon') return NextResponse.json({ ok: true, result: await runReservationAgent() })
    if (['orchestrator', 'seo', 'writer', 'image', 'social'].includes(agent)) return NextResponse.json({ ok: true, result: await runOrchestrator() })
    return NextResponse.json({ error: 'Bu ajan elle çalıştırılamaz' }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
