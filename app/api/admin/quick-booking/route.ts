// Panelden hızlı rezervasyon: WhatsApp, telefon, acenta veya yürüyerek gelen
// müşteriyi kaydeder ki tüm ciro tek yerde görünsün. Müşteriye e-posta gitmez.
// /api/admin altında: middleware admin oturumu ister.
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/lib/agents/core'
import { saveBookingSource } from '@/lib/admin/booking-source'

export async function POST(request: Request) {
  const b = await request.json().catch(() => ({}))
  const name = String(b.name || '').trim().slice(0, 80)
  const date = String(b.flight_date || '')
  const guests = Math.max(1, Math.min(30, parseInt(b.guests) || 1))
  const per = Math.max(0, Math.min(10000, Number(b.price_per_person) || 150))
  const channel = String(b.channel || 'Diğer').slice(0, 40)
  if (!name || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ error: 'İsim ve uçuş tarihi gerekli' }, { status: 400 })
  const [first, ...rest] = name.split(/\s+/)
  const { data, error } = await db().from('bookings').insert({
    flight_type: ['standard', 'high', 'sunset'].includes(b.flight_type) ? b.flight_type : 'standard',
    flight_date: date, guests,
    first_name: first, last_name: rest.join(' ') || '-',
    email: String(b.email || '').trim().slice(0, 120) || 'yok@atmosparagliding.com',
    phone: String(b.phone || '').trim().slice(0, 30) || null,
    notes: String(b.notes || '').trim().slice(0, 300) || null,
    addon_photo: true, addon_video: true, addon_bundle: true,
    base_price: per * guests, addon_price: 0, total_price: per * guests, currency: 'USD',
    status: b.status === 'pending' ? 'pending' : 'confirmed',
    admin_notes: `Panelden eklendi · ${channel}`,
  }).select('id').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  await saveBookingSource(data.id, { channel, detail: 'panelden eklendi' }).catch(() => {})
  return NextResponse.json({ ok: true, id: data.id })
}
