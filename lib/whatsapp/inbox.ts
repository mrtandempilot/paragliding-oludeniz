// WhatsApp gelen kutusu: Cloud API webhook'undan gelen / panelden giden her mesaj
// Supabase `whatsapp_messages` tablosuna yazılır. Gelen mesajdan sonra yapay zekâ
// sohbete bakar; tarih + kişi sayısı netse "onay bekliyor" rezervasyon açar.
import { db, logAgent, telegram, esc } from '@/lib/agents/core'
import { geminiGenerate, textOf } from '@/lib/neslihan/gemini'
import { saveBookingSource } from '@/lib/admin/booking-source'

const G = 'https://graph.facebook.com/v21.0'

export function textOfMessage(m: any): { type: string; body: string | null; media: string | null } {
  const t = String(m.type || 'unknown')
  if (t === 'text') return { type: t, body: m.text?.body ?? null, media: null }
  if (t === 'button') return { type: t, body: m.button?.text ?? null, media: null }
  if (t === 'interactive') return { type: t, body: m.interactive?.button_reply?.title || m.interactive?.list_reply?.title || null, media: null }
  if (t === 'location') return { type: t, body: [m.location?.name, m.location?.address, m.location ? `${m.location.latitude},${m.location.longitude}` : ''].filter(Boolean).join(' · '), media: null }
  if (t === 'reaction') return { type: t, body: m.reaction?.emoji ?? null, media: null }
  const media = m[t]
  if (media && typeof media === 'object') return { type: t, body: media.caption || null, media: media.id || null }
  return { type: t, body: null, media: null }
}

export async function saveIncoming(m: any, name: string) {
  const { type, body, media } = textOfMessage(m)
  const row = {
    wamid: m.id, wa_id: String(m.from), contact_name: name || null, direction: 'in', msg_type: type,
    body, media_id: media, raw: m, sent_at: new Date(Number(m.timestamp || Date.now() / 1000) * 1000).toISOString(),
  }
  const { error } = await db().from('whatsapp_messages').upsert(row, { onConflict: 'wamid', ignoreDuplicates: true })
  if (error) throw new Error('whatsapp_messages kayıt: ' + error.message)
  return row
}

export async function updateStatus(s: any) {
  const err = s.errors?.[0] ? `${s.errors[0].code} ${s.errors[0].title || ''}`.trim() : null
  await db().from('whatsapp_messages').update({ status: s.status, ...(err ? { error: err } : {}) }).eq('wamid', s.id)
}

/** Panelden müşteriye mesaj gönder ve kaydet. */
export async function sendAndSave(to: string, text: string) {
  const id = process.env.WHATSAPP_PHONE_NUMBER_ID, token = process.env.WHATSAPP_ACCESS_TOKEN
  if (!id || !token) throw new Error('WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_ACCESS_TOKEN eksik')
  const wa = to.replace(/\D/g, '')
  const r = await fetch(`${G}/${id}/messages`, {
    method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to: wa, type: 'text', text: { body: text.slice(0, 4000) } }),
  })
  const j = await r.json().catch(() => ({}))
  if (!r.ok) {
    const e = j?.error || {}
    // 131047: 24 saat geçti, sadece onaylı şablon gönderilebilir
    throw new Error(e.code === 131047 ? 'Müşterinin son mesajından 24 saat geçti — WhatsApp serbest mesaja izin vermiyor.' : (e.message || `HTTP ${r.status}`))
  }
  const wamid = j?.messages?.[0]?.id || null
  await db().from('whatsapp_messages').insert({ wamid, wa_id: wa, direction: 'out', msg_type: 'text', body: text, status: 'sent' })
  return { wamid }
}

/* ───────────── rezervasyon yakalama ───────────── */

const EXTRACT = `You read a WhatsApp chat between a customer and Atmos Paragliding (tandem paragliding in Ölüdeniz, Turkey).
Today is {TODAY} (Europe/Istanbul). Decide whether the customer has made / agreed a booking or clearly requested one with concrete details.
Return JSON only:
{"booking": boolean, "flight_date": "YYYY-MM-DD" | null, "flight_time": "HH:MM" | null, "guests": integer | null,
 "name": string | null, "hotel": string | null, "email": string | null, "confidence": number (0-1), "summary": short Turkish summary}
Rules: booking=true only if a specific date (resolve "tomorrow", "Friday" etc. to a real date, never in the past) AND number of people are known
and the customer intends to fly (not just asking the price). If the chat only asks questions, booking=false.`

/** Sohbetten rezervasyon çıkar; yeni ise "pending" rezervasyon açar. */
export async function captureBooking(waId: string, contactName: string) {
  const sb = db()
  const { data: msgs } = await sb.from('whatsapp_messages').select('direction,body,msg_type,sent_at,booking_id')
    .eq('wa_id', waId).order('sent_at', { ascending: false }).limit(30)
  const list = (msgs || []).reverse()
  if (!list.some(m => m.direction === 'in' && m.body)) return { skipped: 'no text' }

  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul' }).format(new Date())
  const chat = list.map(m => `${m.direction === 'in' ? 'CUSTOMER' : 'ATMOS'} [${m.sent_at.slice(0, 16)}]: ${m.body || `[${m.msg_type}]`}`).join('\n')
  let j: any
  try {
    const out = await geminiGenerate({ system: EXTRACT.replace('{TODAY}', today), contents: [{ role: 'user', parts: [{ text: chat.slice(-12000) }] }], json: true, maxOutputTokens: 800 })
    j = JSON.parse(textOf(out).replace(/^```json\s*|```$/g, ''))
  } catch (e: any) {
    await logAgent('whatsapp', 'rezervasyon okunamadı', 'error', { waId }, 0, e.message)
    return { error: e.message }
  }
  if (!j?.booking || !/^\d{4}-\d{2}-\d{2}$/.test(j.flight_date || '') || !(j.guests > 0) || j.flight_date < today || (j.confidence ?? 0) < 0.6) {
    return { booking: false, summary: j?.summary }
  }

  // Aynı müşteri + aynı tarih için zaten rezervasyon varsa tekrar açma
  const phoneLike = '%' + waId.slice(-10)
  const { data: existing } = await sb.from('bookings').select('id,flight_date,guests,status')
    .like('phone', phoneLike).eq('flight_date', j.flight_date).neq('status', 'cancelled').limit(1)
  if (existing?.length) {
    await sb.from('whatsapp_messages').update({ booking_id: existing[0].id }).eq('wa_id', waId).is('booking_id', null)
    return { booking: true, existing: existing[0].id }
  }

  const guests = Math.min(30, Math.round(j.guests))
  const name = String(j.name || contactName || 'WhatsApp müşterisi').trim().slice(0, 80)
  const [first, ...rest] = name.split(/\s+/)
  const per = 150
  const { data: b, error } = await sb.from('bookings').insert({
    flight_type: 'standard', flight_date: j.flight_date, flight_time: /^\d{2}:\d{2}$/.test(j.flight_time || '') ? j.flight_time : null, guests,
    first_name: first, last_name: rest.join(' ') || '-',
    email: (String(j.email || '').includes('@') ? String(j.email).slice(0, 120) : 'yok@atmosparagliding.com'),
    phone: '+' + waId, notes: [j.hotel ? `Otel: ${j.hotel}` : '', j.summary || ''].filter(Boolean).join(' · ').slice(0, 300) || null,
    addon_photo: true, addon_video: true, addon_bundle: true,
    base_price: per * guests, addon_price: 0, total_price: per * guests, currency: 'USD',
    status: 'pending', admin_notes: 'WhatsApp sohbetinden otomatik yakalandı — kontrol edip onayla',
  }).select('id').single()
  if (error) { await logAgent('whatsapp', 'rezervasyon açılamadı', 'error', { waId }, 0, error.message); return { error: error.message } }
  await saveBookingSource(b.id, { channel: 'WhatsApp', detail: 'sohbetten otomatik' }).catch(() => {})
  await sb.from('whatsapp_messages').update({ booking_id: b.id }).eq('wa_id', waId).is('booking_id', null)
  await logAgent('whatsapp', 'sohbetten rezervasyon yakalandı', 'done', { waId, bookingId: b.id, date: j.flight_date, guests })
  await telegram(`🪂 <b>WhatsApp'tan rezervasyon yakalandı</b>\n${esc(name)} (+${esc(waId)})\n${esc(j.flight_date)}${j.flight_time ? ' ' + esc(j.flight_time) : ''} · ${guests} kişi\nPanelde "onay bekliyor".`).catch(() => false)
  return { booking: true, id: b.id }
}
