// Customer ticket: shared helpers for the public ticket page (/ticket/<id>)
// and the automatic WhatsApp / email send after a booking.

export const SITE_URL = 'https://www.atmosparagliding.com'
export const MEETING_POINT = 'Atmos Paragliding office, Ölüdeniz'
// Plain dropped pin (no business name/card) at the meeting point
export const MEETING_MAP_URL = 'https://www.google.com/maps/search/?api=1&query=36.5466658%2C29.1227577'
export const WA_TEMPLATE_NAME = process.env.WHATSAPP_TICKET_TEMPLATE || 'atmos_booking_ticket'
export const WA_TEMPLATE_LANG = 'en'

export type TicketBooking = {
  id: string
  created_at?: string
  first_name: string
  last_name?: string
  email?: string | null
  phone?: string | null
  flight_date: string
  flight_time?: string | null
  guests: number
  total_price: number
  notes?: string | null
}

export function ticketUrl(id: string) {
  return `${SITE_URL}/ticket/${id}`
}

export function ticketRef(b: { id: string; created_at?: string }) {
  const d = b.created_at ? new Date(b.created_at) : new Date()
  const ymd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`
  return `ATP-${ymd}-${b.id.replace(/-/g, '').slice(-4).toUpperCase()}`
}

export function timeOf(b: TicketBooking): string | null {
  return b.flight_time || b.notes?.match(/^\[Saat (\d{2}:\d{2})\]/)?.[1] || null
}

export function fmtTicketDate(iso: string) {
  const d = new Date(iso.slice(0, 10) + 'T12:00:00Z')
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}

// "+44 7700 900123" -> "447700900123", "0532 123 45 67" -> "905321234567"
export function normalizePhone(raw?: string | null): string | null {
  if (!raw) return null
  let p = String(raw).replace(/[^\d+]/g, '')
  if (p.startsWith('+')) p = p.slice(1)
  else if (p.startsWith('00')) p = p.slice(2)
  else if (/^0\d{10}$/.test(p)) p = '90' + p.slice(1) // Turkish local format
  p = p.replace(/\D/g, '')
  return p.length >= 8 && p.length <= 15 ? p : null
}

function waText(b: TicketBooking) {
  const t = timeOf(b)
  return (
    `Hi ${b.first_name}! 🪂 Your tandem paragliding flight with Atmos Paragliding is booked.\n\n` +
    `🎫 Ticket: ${ticketRef(b)}\n` +
    `📅 ${fmtTicketDate(b.flight_date)}\n` +
    `🕐 ${t || 'time to be confirmed'}\n` +
    `👥 ${b.guests} ${b.guests === 1 ? 'person' : 'people'}\n` +
    `💵 $${b.total_price} total — pay on the day\n\n` +
    `📍 Meeting point: our office in Ölüdeniz\n${MEETING_MAP_URL}\n` +
    `Please be there 15 minutes before your time.\n\n` +
    `Your ticket: ${ticketUrl(b.id)}`
  )
}

/**
 * Send the ticket to the customer on WhatsApp.
 * 1) Approved template (works any time).
 * 2) Fallback: plain text (Meta only delivers this if the customer messaged us in the last 24h).
 */
export async function sendTicketWhatsApp(b: TicketBooking): Promise<{ ok: boolean; via?: string; error?: string }> {
  const PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
  const TOKEN = process.env.WHATSAPP_ACCESS_TOKEN
  const to = normalizePhone(b.phone)
  if (!PHONE_ID || !TOKEN) return { ok: false, error: 'whatsapp env missing' }
  if (!to) return { ok: false, error: 'no valid phone' }

  const send = (payload: any) =>
    fetch(`https://graph.facebook.com/v21.0/${PHONE_ID}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ messaging_product: 'whatsapp', to, ...payload }),
    })

  const t = timeOf(b) || 'to be confirmed'
  const tpl = await send({
    type: 'template',
    template: {
      name: WA_TEMPLATE_NAME,
      language: { code: WA_TEMPLATE_LANG },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: b.first_name || 'there' },
            { type: 'text', text: fmtTicketDate(b.flight_date) },
            { type: 'text', text: t },
            { type: 'text', text: String(b.guests) },
            { type: 'text', text: ticketRef(b) },
          ],
        },
        { type: 'button', sub_type: 'url', index: '0', parameters: [{ type: 'text', text: b.id }] },
      ],
    },
  })
  if (tpl.ok) return { ok: true, via: 'template' }
  const tplErr = await tpl.text()

  const txt = await send({ type: 'text', text: { body: waText(b), preview_url: true } })
  if (txt.ok) return { ok: true, via: 'text (24h window)' }
  return { ok: false, error: `template: ${tplErr.slice(0, 300)} | text: ${(await txt.text()).slice(0, 200)}` }
}

export function ticketEmailHtml(b: TicketBooking) {
  const t = timeOf(b)
  const row = (k: string, v: string) =>
    `<tr><td style="padding:8px 0;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:.05em">${k}</td><td style="padding:8px 0;font-weight:600;color:#0f172a;text-align:right">${v}</td></tr>`
  return `
<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
  <div style="background:#0f172a;color:#fff;padding:20px 24px">
    <div style="font-size:18px;font-weight:800;letter-spacing:.05em">ATMOS PARAGLIDING</div>
    <div style="font-size:12px;color:#f97316;font-weight:700;margin-top:4px">BOOKING TICKET · ${ticketRef(b)}</div>
  </div>
  <div style="padding:20px 24px">
    <p style="margin:0 0 12px">Hi ${b.first_name}! 🪂 Your tandem paragliding flight is booked.</p>
    <table style="width:100%;border-collapse:collapse">
      ${row('Date', fmtTicketDate(b.flight_date))}
      ${row('Time', t || 'To be confirmed')}
      ${row('Passengers', String(b.guests))}
      ${row('Total', `$${b.total_price} — pay on the day`)}
      ${row('Meeting point', 'Our office in Ölüdeniz')}
    </table>
    <p style="margin:16px 0 8px;font-size:13px;color:#475569">Please be at the meeting point 15 minutes before your time. The transfer up the mountain, photos &amp; video and the mountain fee are included.</p>
    <a href="${MEETING_MAP_URL}" style="display:inline-block;background:#0369a1;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:700;margin:8px 8px 0 0">📍 Open meeting point in Maps</a>
    <a href="${ticketUrl(b.id)}" style="display:inline-block;background:#f97316;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:8px">🎫 View your ticket</a>
  </div>
  <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:14px 24px;font-size:12px;color:#64748b">
    WhatsApp / phone: +90 536 461 6674 · atmosparagliding@gmail.com
  </div>
</div>`
}
