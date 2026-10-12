// Uçuş Masası: rezervasyon başına operasyon bilgisi (alış saati, otel, pilot, ödeme)
// ve "WhatsApp konuşmasıyla ilgilendim" işaretleri. Veritabanı şemasına dokunmadan
// settings tablosunda JSON olarak tutulur. /api/admin altında olduğu için
// middleware admin oturumu ister.
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getSetting, setSetting } from '@/lib/agents/core'
import { OPS_KEY, WA_HANDLED_KEY, type FlightOps } from '@/lib/admin/flight-ops'

const clean = (v: unknown, max = 80) => (typeof v === 'string' ? v.trim().slice(0, max) : undefined)

export async function GET() {
  const [ops, handled] = await Promise.all([getSetting<Record<string, FlightOps>>(OPS_KEY, {}), getSetting<string[]>(WA_HANDLED_KEY, [])])
  return NextResponse.json({ ops, handled })
}

// { id, patch: { pickup?, hotel?, pilot?, paid?, note? } }  veya  { waHandled: "<agent_logs id>" }
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  if (body.waHandled) {
    const list = await getSetting<string[]>(WA_HANDLED_KEY, [])
    if (!list.includes(String(body.waHandled))) list.push(String(body.waHandled))
    await setSetting(WA_HANDLED_KEY, list.slice(-300))
    return NextResponse.json({ ok: true })
  }
  const id = clean(body.id, 64)
  if (!id || typeof body.patch !== 'object' || !body.patch) return NextResponse.json({ error: 'id ve patch gerekli' }, { status: 400 })
  const p = body.patch
  const next: FlightOps = {}
  if ('pickup' in p) next.pickup = /^\d{2}:\d{2}$/.test(String(p.pickup)) ? String(p.pickup) : ''
  if ('hotel' in p) next.hotel = clean(p.hotel) ?? ''
  if ('pilot' in p) next.pilot = clean(p.pilot, 40) ?? ''
  if ('note' in p) next.note = clean(p.note, 200) ?? ''
  if ('paid' in p) next.paid = !!p.paid
  const all = await getSetting<Record<string, FlightOps>>(OPS_KEY, {})
  all[id] = { ...(all[id] || {}), ...next, updatedAt: new Date().toISOString() }
  await setSetting(OPS_KEY, all)
  return NextResponse.json({ ok: true, ops: all[id] })
}
