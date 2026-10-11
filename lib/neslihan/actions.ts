// Confirmed actions for the Neslihan voice assistant.
// Flow: a prepare_* tool builds the action and returns a signed, short-lived
// token (never shown to the model). The browser only runs it after Ceyhun Bey
// says "evet" (or presses Onayla), then the server verifies the signature here.

import crypto from 'crypto'
import { getSupabase } from '@/lib/admin/dashboard-data'
import { readEmail, sendEmail } from './gmail'
import type { Display, ToolContext } from './tools'

export type Action =
  | { kind: 'send_email'; to: string; subject: string; body: string; inReplyTo?: string; references?: string[] }
  | { kind: 'booking_status'; bookingId: string; status: 'confirmed' | 'completed' | 'cancelled'; label: string }
  | { kind: 'instagram_publish'; postId: string; label: string }
  | { kind: 'add_topic'; title: string; keywords?: string }

export type Proposal = { summary: string; display: Display; token: string }

const TTL_MS = 10 * 60 * 1000

function secret() {
  const s = process.env.NESLIHAN_ACTION_SECRET || process.env.CRON_SECRET || process.env.ADMIN_PASSWORD
  if (!s) throw new Error('İşlem imzası için gizli anahtar yok')
  return s
}

function sign(action: Action): string {
  const payload = Buffer.from(JSON.stringify({ action, exp: Date.now() + TTL_MS })).toString('base64url')
  const sig = crypto.createHmac('sha256', secret()).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

function verify(token: string): Action {
  const [payload, sig] = String(token || '').split('.')
  if (!payload || !sig) throw new Error('Geçersiz onay')
  const expected = crypto.createHmac('sha256', secret()).update(payload).digest('base64url')
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) throw new Error('Geçersiz onay imzası')
  const { action, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
  if (Date.now() > exp) throw new Error('Onay süresi doldu, işlemi yeniden hazırlayın')
  return action
}

const STATUS_TR: Record<string, string> = { confirmed: 'Onaylı', completed: 'Uçuldu', cancelled: 'İptal' }

const pending = (title: string, rows: [string, string][], note?: string): Display => ({
  title,
  subtitle: 'Onay bekliyor — "evet" deyin veya Onayla\'ya basın',
  table: { columns: ['', ''], rows },
  note,
})

// ── prepare_* ────────────────────────────────────────────────────────────────

export async function prepareAction(name: string, args: any): Promise<Proposal> {
  switch (name) {
    case 'prepare_email': {
      const body = String(args?.body || '').trim()
      if (!body) throw new Error('Mail metni boş')
      let to = String(args?.to || '').trim()
      let subject = String(args?.subject || '').trim()
      let inReplyTo: string | undefined
      let references: string[] | undefined
      if (args?.reply_to_uid) {
        const orig = await readEmail(Number(args.reply_to_uid), args?.reply_folder === 'all' ? 'all' : 'inbox')
        to = to || orig.replyTo
        subject = subject || (/^re:/i.test(orig.subject) ? orig.subject : `Re: ${orig.subject}`)
        inReplyTo = orig.messageId || undefined
        references = orig.references
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) throw new Error(`Geçerli bir alıcı adresi yok: "${to}"`)
      if (!subject) throw new Error('Konu boş')
      const action: Action = { kind: 'send_email', to, subject, body, inReplyTo, references }
      return {
        summary: `${to} adresine "${subject}" konulu mail${inReplyTo ? ' (cevap)' : ''}`,
        display: pending('✉️ Mail gönderilecek', [['Kime', to], ['Konu', subject], ['Metin', body]]),
        token: sign(action),
      }
    }
    case 'prepare_booking_status': {
      const status = args?.status
      if (!['confirmed', 'completed', 'cancelled'].includes(status)) throw new Error('Durum confirmed / completed / cancelled olmalı')
      const { data: b, error } = await getSupabase().from('bookings')
        .select('id,first_name,last_name,flight_date,flight_type,guests,status').eq('id', args?.booking_id).single()
      if (error || !b) throw new Error('Rezervasyon bulunamadı')
      const label = `${b.first_name || ''} ${b.last_name || ''}`.trim() + ` · ${String(b.flight_date).slice(0, 10)} · ${b.guests || 1} kişi`
      const action: Action = { kind: 'booking_status', bookingId: String(b.id), status, label }
      return {
        summary: `${label} rezervasyonu → ${STATUS_TR[status]}`,
        display: pending('📋 Rezervasyon durumu değişecek', [['Rezervasyon', label], ['Şu an', b.status], ['Yeni durum', STATUS_TR[status]]]),
        token: sign(action),
      }
    }
    case 'prepare_instagram_publish': {
      const { data: p, error } = await getSupabase().from('instagram_posts')
        .select('id,caption,post_type,status,image_url').eq('id', args?.post_id).single()
      if (error || !p) throw new Error('Instagram gönderisi bulunamadı')
      if (p.status === 'posted') throw new Error('Bu gönderi zaten paylaşılmış')
      const caption = String(p.caption || '')
      const label = caption.slice(0, 80) + (caption.length > 80 ? '…' : '')
      const action: Action = { kind: 'instagram_publish', postId: String(p.id), label }
      return {
        summary: `Instagram'da paylaşılacak: "${label}"`,
        display: pending('📸 Instagram\'da paylaşılacak', [['Tür', p.post_type || 'image'], ['Durum', p.status], ['Metin', caption]], p.image_url ? `Görsel: ${p.image_url}` : undefined),
        token: sign(action),
      }
    }
    case 'prepare_topic': {
      const title = String(args?.title || '').trim()
      if (!title) throw new Error('Konu başlığı boş')
      const action: Action = { kind: 'add_topic', title, keywords: args?.keywords ? String(args.keywords) : undefined }
      return {
        summary: `Blog konusu eklenecek: "${title}"`,
        display: pending('📝 Blog konusu eklenecek', [['Başlık', title], ['Anahtar kelimeler', action.keywords || '—']]),
        token: sign(action),
      }
    }
    default:
      throw new Error(`Bilinmeyen işlem: ${name}`)
  }
}

// ── execute ──────────────────────────────────────────────────────────────────

async function log(action: string, status: 'success' | 'error', error?: string) {
  await getSupabase().from('agent_logs').insert({ agent: 'neslihan', action, status, error: error || null }).then(() => {}, () => {})
}

export async function executeAction(token: string, ctx: ToolContext): Promise<{ ok: boolean; message: string }> {
  const action = verify(token)
  try {
    let message = ''
    switch (action.kind) {
      case 'send_email': {
        await sendEmail(action)
        message = `Mail gönderildi: ${action.to} — "${action.subject}"`
        break
      }
      case 'booking_status': {
        const { error } = await getSupabase().from('bookings').update({ status: action.status }).eq('id', action.bookingId)
        if (error) throw new Error(error.message)
        message = `Rezervasyon güncellendi: ${action.label} → ${STATUS_TR[action.status]}`
        break
      }
      case 'instagram_publish': {
        const r = await fetch(`${ctx.origin}/api/admin/instagram/publish`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', cookie: ctx.cookie },
          body: JSON.stringify({ id: action.postId }),
          cache: 'no-store',
        })
        const d = await r.json().catch(() => ({}))
        if (!r.ok || d?.error) throw new Error(d?.error || `HTTP ${r.status}`)
        message = `Instagram'da paylaşıldı: "${action.label}"`
        break
      }
      case 'add_topic': {
        const keywords = (action.keywords || '').split(',').map(k => k.trim()).filter(Boolean)
        const { error } = await getSupabase().from('topics').insert({ title: action.title, keywords, priority: 50, status: 'pending' })
        if (error) throw new Error(error.message)
        message = `Blog konusu eklendi: "${action.title}"`
        break
      }
    }
    await log(message, 'success')
    return { ok: true, message }
  } catch (e: any) {
    const err = e?.message || String(e)
    await log(`${action.kind} başarısız`, 'error', err)
    return { ok: false, message: err }
  }
}
