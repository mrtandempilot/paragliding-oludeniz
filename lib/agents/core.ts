// Shared helpers for the autonomous agents (Ads, Rezervasyon, WhatsApp, İçerik).
// Every run is written to agent_logs so Mission Control and the Agent Office
// can show what each agent is doing.
import { createClient } from '@supabase/supabase-js'

export function db() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) },
  })
}

export async function logAgent(agent: string, action: string, status: 'running' | 'done' | 'error', output?: any, durationMs?: number, error?: string) {
  try {
    await db().from('agent_logs').insert({ agent, action, status, output: output ?? null, duration_ms: durationMs || 0, error: error || null })
  } catch { /* logging must never break an agent */ }
}

/** Run an agent task with start/done/error logging. */
export async function runLogged<T>(agent: string, action: string, fn: () => Promise<T>): Promise<T> {
  const t0 = Date.now()
  await logAgent(agent, action, 'running')
  try {
    const out = await fn()
    await logAgent(agent, action, 'done', out as any, Date.now() - t0)
    return out
  } catch (e: any) {
    await logAgent(agent, action, 'error', { message: e.message }, Date.now() - t0, e.message)
    throw e
  }
}

export async function telegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHAT_ID
  if (!token || !chat) return false
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store',
      body: JSON.stringify({ chat_id: chat, text: text.slice(0, 4000), parse_mode: 'HTML', disable_web_page_preview: true }),
    })
    return r.ok
  } catch { return false }
}

export const esc = (s: any) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export async function getSetting<T = any>(key: string, fallback: T): Promise<T> {
  const { data } = await db().from('settings').select('value').eq('key', key).maybeSingle()
  if (!data?.value) return fallback
  try { return JSON.parse(data.value) } catch { return data.value as any }
}
export async function setSetting(key: string, value: any) {
  await db().from('settings').upsert({ key, value: typeof value === 'string' ? value : JSON.stringify(value) }, { onConflict: 'key' })
}

export function cronAuthorized(request: Request) {
  const auth = request.headers.get('authorization')
  if (process.env.CRON_SECRET && auth === `Bearer ${process.env.CRON_SECRET}`) return true
  const cookie = request.headers.get('cookie') || ''
  const m = cookie.match(/(?:^|;\s*)admin_session=([^;]+)/)
  return !!m && decodeURIComponent(m[1]) === process.env.ADMIN_PASSWORD
}

/** Istanbul-local YYYY-MM-DD, offset in days */
export function trDay(offsetDays = 0) {
  return new Date(Date.now() + 3 * 3600000 + offsetDays * 86400000).toISOString().slice(0, 10)
}
