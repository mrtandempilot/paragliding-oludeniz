// Admin WhatsApp gelen kutusu (middleware admin oturumu ister).
//   GET                 -> sohbet listesi (son mesaj, okunmamış sayısı, 24 saat penceresi)
//   GET ?wa=905xx       -> o müşteriyle tüm mesajlar (ve okundu işaretler)
//   POST {to, text}     -> müşteriye mesaj gönder
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/lib/agents/core'
import { sendAndSave } from '@/lib/whatsapp/inbox'

export async function GET(req: Request) {
  const sb = db()
  const wa = new URL(req.url).searchParams.get('wa')
  if (wa) {
    const id = wa.replace(/\D/g, '')
    const { data, error } = await sb.from('whatsapp_messages')
      .select('id,wamid,direction,msg_type,body,status,error,booking_id,sent_at,contact_name')
      .eq('wa_id', id).order('sent_at', { ascending: true }).limit(500)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    await sb.from('whatsapp_messages').update({ seen: true }).eq('wa_id', id).eq('direction', 'in').eq('seen', false)
    return NextResponse.json({ messages: data })
  }
  const { data, error } = await sb.from('whatsapp_messages')
    .select('wa_id,contact_name,direction,msg_type,body,seen,booking_id,sent_at')
    .order('sent_at', { ascending: false }).limit(2000)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const convs: Record<string, any> = {}
  for (const m of data || []) {
    const c = convs[m.wa_id] ||= { wa_id: m.wa_id, name: null, last: m, unread: 0, lastIn: null, bookingId: null }
    if (!c.name && m.contact_name) c.name = m.contact_name
    if (m.direction === 'in' && !m.seen) c.unread++
    if (m.direction === 'in' && !c.lastIn) c.lastIn = m.sent_at
    if (!c.bookingId && m.booking_id) c.bookingId = m.booking_id
  }
  const now = Date.now()
  const list = Object.values(convs).map((c: any) => ({
    wa_id: c.wa_id, name: c.name, unread: c.unread, bookingId: c.bookingId,
    lastText: c.last.body || `[${c.last.msg_type}]`, lastDir: c.last.direction, lastAt: c.last.sent_at,
    canReply: !!c.lastIn && now - new Date(c.lastIn).getTime() < 24 * 3600 * 1000,
  }))
  return NextResponse.json({ conversations: list, unread: list.reduce((s, c) => s + c.unread, 0) })
}

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}))
  const to = String(b.to || '').replace(/\D/g, ''), text = String(b.text || '').trim()
  if (!to || !text) return NextResponse.json({ error: 'to ve text gerekli' }, { status: 400 })
  try {
    return NextResponse.json({ ok: true, ...(await sendAndSave(to, text)) })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 502 })
  }
}
