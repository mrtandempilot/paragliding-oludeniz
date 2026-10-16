// Admin-only: create / check the WhatsApp "booking ticket" message template.
//   GET /api/admin/whatsapp-template            -> status of the template
//   GET /api/admin/whatsapp-template?create=1   -> submit it to Meta for approval
import { NextResponse } from 'next/server'
import { MEETING_MAP_URL, SITE_URL, WA_TEMPLATE_LANG, WA_TEMPLATE_NAME } from '@/lib/ticket'

export const dynamic = 'force-dynamic'
const G = 'https://graph.facebook.com/v21.0'

async function g(path: string, token: string, init?: RequestInit) {
  const r = await fetch(`${G}/${path}`, { ...init, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } })
  return { ok: r.ok, data: await r.json().catch(() => ({})) }
}

const diag: any[] = []
async function findWaba(token: string, phoneId: string): Promise<string | null> {
  diag.length = 0
  // skywlakers WhatsApp Business Account (Business Settings → WhatsApp accounts)
  return process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '879567751458725'
  // The token's own scopes list the WhatsApp Business Accounts it can manage
  const dbg = await g(`debug_token?input_token=${encodeURIComponent(token)}`, token)
  const scopes: any[] = dbg.data?.data?.granular_scopes || []
  diag.push({ debug_token: dbg.ok ? { valid: dbg.data?.data?.is_valid, type: dbg.data?.data?.type, expires: dbg.data?.data?.expires_at, scopes } : dbg.data?.error?.message })
  const ids = new Set<string>()
  for (const sc of scopes) if (/whatsapp/.test(sc.scope)) for (const id of sc.target_ids || []) ids.add(String(id))
  for (const id of Array.from(ids)) {
    const ph = await g(`${id}/phone_numbers?fields=id,display_phone_number`, token)
    diag.push({ waba: id, phones: ph.ok ? ph.data?.data : ph.data?.error?.message })
    if ((ph.data?.data || []).some((p: any) => p.id === phoneId)) return id
  }
  const businesses = [process.env.META_BUSINESS_ID || '1736558853707170', '728026526701126']
  const me = await g('me/businesses?fields=id', token)
  for (const b of me.data?.data || []) if (!businesses.includes(b.id)) businesses.push(b.id)
  for (const biz of businesses) {
    for (const edge of ['owned_whatsapp_business_accounts', 'client_whatsapp_business_accounts']) {
      const w = await g(`${biz}/${edge}?fields=id`, token)
      diag.push({ biz, edge, wabas: w.ok ? w.data?.data : w.data?.error?.message })
      for (const acc of w.data?.data || []) {
        const ph = await g(`${acc.id}/phone_numbers?fields=id`, token)
        if ((ph.data?.data || []).some((p: any) => p.id === phoneId)) return acc.id
      }
    }
  }
  return null
}

export async function GET(req: Request) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID
  if (!token || !phoneId) return NextResponse.json({ error: 'WHATSAPP_ACCESS_TOKEN / WHATSAPP_PHONE_NUMBER_ID missing' }, { status: 500 })

  if (new URL(req.url).searchParams.get('phone') === '1') {
    const ph = await g(`${phoneId}?fields=display_phone_number,verified_name,code_verification_status,quality_rating,status`, token)
    return NextResponse.json({ phoneId, ok: ph.ok, phone: ph.ok ? ph.data : ph.data?.error?.message })
  }
  const waba = await findWaba(token, phoneId)
  if (!waba) return NextResponse.json({ error: 'WhatsApp Business Account not found — set WHATSAPP_BUSINESS_ACCOUNT_ID in Vercel', phoneId, diag }, { status: 404 })

  const existing = await g(`${waba}/message_templates?name=${WA_TEMPLATE_NAME}&fields=name,status,language,rejected_reason`, token)
  const create = new URL(req.url).searchParams.get('create') === '1'
  if (!create || (existing.data?.data || []).length) {
    return NextResponse.json({ waba, template: WA_TEMPLATE_NAME, existing: existing.data, hint: create ? 'already exists' : 'add ?create=1 to submit' })
  }

  const body = {
    name: WA_TEMPLATE_NAME,
    language: WA_TEMPLATE_LANG,
    category: 'UTILITY',
    components: [
      {
        type: 'BODY',
        text:
          'Hi {{1}}! Your tandem paragliding flight with Atmos Paragliding is booked.\n\n' +
          'Date: {{2}}\nTime: {{3}}\nPassengers: {{4}}\nTicket: {{5}}\n\n' +
          'Meeting point: our office in Ölüdeniz. Please arrive 15 minutes before your time. Payment is on the day of the flight.',
        example: { body_text: [['Anna', 'Saturday, 18 October 2026', '10:00', '2', 'ATP-20261016-AB12']] },
      },
      {
        type: 'BUTTONS',
        buttons: [
          { type: 'URL', text: 'View ticket', url: `${SITE_URL}/ticket/{{1}}`, example: [`${SITE_URL}/ticket/0b9f6a1e-1111-4c2a-9d3e-123456789abc`] },
          { type: 'URL', text: 'Meeting point map', url: MEETING_MAP_URL },
        ],
      },
    ],
  }
  const res = await g(`${waba}/message_templates`, token, { method: 'POST', body: JSON.stringify(body) })
  return NextResponse.json({ waba, submitted: res.ok, result: res.data }, { status: res.ok ? 200 : 400 })
}
