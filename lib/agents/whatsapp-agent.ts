// WhatsApp cevap ajanı — müşteri işletme numarasına yazınca otomatik cevap verir.
// Gemini (ücretsiz) + bilgi tabanı. Rezervasyon onayı, ödeme anlaşmazlığı veya
// bilinmeyen konularda kısa cevap verir ve Ceyhun'a Telegram'dan haber verir.
import { geminiGenerate, textOf } from '@/lib/neslihan/gemini'
import { WHATSAPP_KB } from './whatsapp-kb'
import { logAgent, telegram, esc, getSetting, setSetting } from './core'

const SYSTEM = `You are the WhatsApp assistant of Atmos Paragliding (Ölüdeniz, Turkey). Reply in the SAME language the customer writes in.
Be warm, short (max ~5 sentences), and concrete. Use ONLY the facts below; never invent prices, times or policies.
If the customer wants to book, collect: date, number of people, hotel, full name — and/or share https://www.atmosparagliding.com/book-now. Say a team member will confirm within 2 hours.
Set needs_human=true when: the customer gives booking details or asks to confirm/change/cancel a booking, payment/refund disputes, complaints, group of 9+, anything not covered by the facts, or they ask for a human.
Return JSON: {"reply": string, "needs_human": boolean, "summary": short English summary of what the customer wants}.

FACTS:
${WHATSAPP_KB}`

export async function sendWhatsApp(to: string, text: string) {
  const id = process.env.WHATSAPP_PHONE_NUMBER_ID, token = process.env.WHATSAPP_ACCESS_TOKEN
  if (!id || !token) throw new Error('WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_ACCESS_TOKEN eksik')
  const r = await fetch(`https://graph.facebook.com/v21.0/${id}/messages`, {
    method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body: text.slice(0, 4000) } }),
  })
  if (!r.ok) throw new Error('WhatsApp gönderim hatası ' + r.status + ': ' + (await r.text()).slice(0, 200))
}

export async function handleIncomingWhatsApp(from: string, name: string, text: string) {
  const t0 = Date.now()
  if (process.env.WHATSAPP_BOT_ENABLED === 'false') return { skipped: true }
  const key = 'wa_conv_' + from.replace(/\D/g, '')
  const history: { role: 'user' | 'model'; text: string }[] = await getSetting(key, [])
  history.push({ role: 'user', text })
  let reply = '', needsHuman = true, summary = text.slice(0, 120)
  try {
    const out = await geminiGenerate({
      system: SYSTEM,
      contents: history.slice(-10).map(h => ({ role: h.role, parts: [{ text: h.text }] })),
      json: true, maxOutputTokens: 2000,
    })
    const j = JSON.parse(textOf(out).replace(/^```json\s*|```$/g, ''))
    reply = String(j.reply || '').trim(); needsHuman = !!j.needs_human; summary = j.summary || summary
  } catch (e: any) {
    reply = "Thanks for your message! 🙏 A team member will get back to you very shortly. You can also book online: https://www.atmosparagliding.com/book-now"
    needsHuman = true; summary = 'AI error: ' + e.message
  }
  try {
    if (reply) await sendWhatsApp(from, reply)
    history.push({ role: 'model', text: reply })
    await setSetting(key, history.slice(-20))
    if (needsHuman) await telegram(`💬 <b>WhatsApp — insan gerekli</b>\n${esc(name || '')} (+${esc(from)})\n"${esc(text.slice(0, 400))}"\n\nBot cevabı: ${esc(reply.slice(0, 400))}\n\n→ wa.me/${esc(from)}`)
    await logAgent('whatsapp', needsHuman ? 'cevap + Ceyhun\'a bildirim' : 'otomatik cevap', 'done', { from, summary, needsHuman }, Date.now() - t0)
  } catch (e: any) {
    await logAgent('whatsapp', 'cevap gönderilemedi', 'error', { from, summary }, Date.now() - t0, e.message)
    await telegram(`⚠️ WhatsApp ajanı cevap gönderemedi: ${esc(e.message)}\nMüşteri: +${esc(from)} "${esc(text.slice(0, 200))}"`)
  }
  return { replied: !!reply, needsHuman }
}
