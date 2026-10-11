// Gmail access for the Neslihan voice assistant.
// Reads over IMAP and sends over SMTP with the same account the booking
// mails already use (GMAIL_USER + GMAIL_APP_PASSWORD).

import { ImapFlow } from 'imapflow'
import { simpleParser } from 'mailparser'
import nodemailer from 'nodemailer'

export type MailFolder = 'inbox' | 'sent' | 'all'

function creds() {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) throw new Error('Gmail bağlantısı tanımlı değil (GMAIL_USER / GMAIL_APP_PASSWORD)')
  return { user, pass }
}

async function withMailbox<T>(folder: MailFolder, fn: (client: ImapFlow) => Promise<T>): Promise<T> {
  const client = new ImapFlow({ host: 'imap.gmail.com', port: 993, secure: true, auth: creds(), logger: false })
  await client.connect()
  try {
    // Gmail localizes folder names ("[Gmail]/Gönderilmiş Postalar"), so find Sent by its special-use flag.
    let path = 'INBOX'
    if (folder !== 'inbox') {
      const flag = folder === 'sent' ? '\\Sent' : '\\All'
      const boxes = await client.list()
      path = boxes.find(b => b.specialUse === flag)?.path || (folder === 'sent' ? '[Gmail]/Sent Mail' : '[Gmail]/All Mail')
    }
    const lock = await client.getMailboxLock(path)
    try {
      return await fn(client)
    } finally {
      lock.release()
    }
  } finally {
    await client.logout().catch(() => {})
  }
}

const addr = (list?: { name?: string; address?: string }[]) =>
  (list || []).map(a => (a.name ? `${a.name} <${a.address}>` : a.address || '')).join(', ')

export type MailSummary = { uid: number; from: string; to: string; subject: string; date: string; unread: boolean }

export async function listEmails(opts: { folder?: MailFolder; unreadOnly?: boolean; search?: string; days?: number; limit?: number }) {
  // a search covers every label (All Mail) unless a folder was asked for
  const folder = opts.folder || (opts.search ? 'all' : 'inbox')
  const limit = Math.min(30, Math.max(1, opts.limit || 10))
  const days = Math.min(365, Math.max(1, opts.days || 14))
  return withMailbox(folder, async client => {
    const criteria: any = { since: new Date(Date.now() - days * 86400000) }
    if (opts.unreadOnly) criteria.seen = false
    // Gmail's own search syntax (from:, subject:, "booking" ...) via X-GM-RAW
    if (opts.search) criteria.gmraw = opts.search
    const uids = ((await client.search(criteria, { uid: true })) || []) as number[]
    const pick = uids.sort((a, b) => b - a).slice(0, limit)
    if (!pick.length) return [] as MailSummary[]
    const out: MailSummary[] = []
    for await (const m of client.fetch(pick, { envelope: true, flags: true, uid: true }, { uid: true })) {
      out.push({
        uid: m.uid,
        from: addr(m.envelope?.from as any),
        to: addr(m.envelope?.to as any),
        subject: m.envelope?.subject || '(konu yok)',
        date: m.envelope?.date ? new Date(m.envelope.date).toISOString() : '',
        unread: !m.flags?.has('\\Seen'),
      })
    }
    return out.sort((a, b) => b.uid - a.uid)
  })
}

export async function readEmail(uid: number, folder: MailFolder = 'inbox') {
  return withMailbox(folder, async client => {
    const msg = await client.fetchOne(String(uid), { source: true }, { uid: true })
    if (!msg || !msg.source) throw new Error('Mail bulunamadı')
    const p = await simpleParser(msg.source)
    // Opening a mail in the assistant counts as reading it, like in Gmail.
    if (folder !== 'sent') await client.messageFlagsAdd(String(uid), ['\\Seen'], { uid: true }).catch(() => {})
    const text = (p.text || '').replace(/\n{3,}/g, '\n\n').trim()
    const fromAddr = p.from?.value?.[0]
    return {
      uid,
      from: p.from?.text || '',
      fromAddress: fromAddr?.address || '',
      fromName: fromAddr?.name || '',
      replyTo: p.replyTo?.value?.[0]?.address || fromAddr?.address || '',
      to: Array.isArray(p.to) ? p.to.map(t => t.text).join(', ') : p.to?.text || '',
      subject: p.subject || '(konu yok)',
      date: p.date ? p.date.toISOString() : '',
      messageId: p.messageId || '',
      references: Array.isArray(p.references) ? p.references : p.references ? [p.references] : [],
      text: text.length > 6000 ? text.slice(0, 6000) + '\n…(kısaltıldı)' : text,
      attachments: (p.attachments || []).map(a => a.filename || a.contentType),
    }
  })
}

export async function sendEmail(mail: { to: string; subject: string; body: string; inReplyTo?: string; references?: string[] }) {
  const { user, pass } = creds()
  const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } })
  const info = await transporter.sendMail({
    from: `"Atmos Paragliding" <${user}>`,
    to: mail.to,
    subject: mail.subject,
    text: mail.body,
    ...(mail.inReplyTo ? { inReplyTo: mail.inReplyTo, references: [...(mail.references || []), mail.inReplyTo] } : {}),
  })
  return { messageId: info.messageId, accepted: info.accepted }
}
