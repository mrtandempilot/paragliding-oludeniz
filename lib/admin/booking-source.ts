// Rezervasyonun geldiği kanal. Rezervasyon tablosuna kolon eklemeden settings
// tablosunda { bookingId: {...} } olarak tutulur.
import { getSetting, setSetting } from '@/lib/agents/core'

export const SOURCES_KEY = 'booking_sources'
export type BookingSource = { channel: string; detail?: string; landing?: string; at: string }

export const MANUAL_CHANNELS = ['WhatsApp', 'Telefon', 'Acenta / otel', 'Yürüyerek gelen', 'Instagram DM', 'Diğer'] as const

export function classifyChannel(s: any): { channel: string; detail?: string; landing?: string } {
  if (!s || typeof s !== 'object') return { channel: 'Bilinmiyor' }
  const src = String(s.utm_source || '').toLowerCase(), med = String(s.utm_medium || '').toLowerCase()
  const ref = String(s.referrer || '').toLowerCase()
  const landing = s.landing ? String(s.landing).slice(0, 120) : undefined
  if (s.gclid || (src === 'google' && /cpc|ppc|paid/.test(med))) return { channel: 'Google Ads', detail: s.utm_campaign || undefined, landing }
  if (s.fbclid || /facebook|instagram|meta|ig/.test(src)) return { channel: /cpc|paid|ads/.test(med) ? 'Meta reklam' : 'Instagram / Facebook', detail: src || ref || undefined, landing }
  if (/chatgpt|openai|perplexity|gemini|copilot|claude|bard/.test(ref + src)) return { channel: 'Yapay zeka (ChatGPT vb.)', detail: ref || src, landing }
  if (/(^|\.)google\.|bing\.|yandex\.|duckduckgo|ecosia|yahoo\./.test(ref)) return { channel: 'Google arama (organik)', detail: ref, landing }
  if (/instagram|facebook|fb\.|t\.co|twitter|tiktok|youtube/.test(ref)) return { channel: 'Instagram / Facebook', detail: ref, landing }
  if (/tripadvisor|getyourguide|viator|klook|booking\.com|airbnb/.test(ref)) return { channel: 'Tur siteleri', detail: ref, landing }
  if (src) return { channel: src, detail: med || undefined, landing }
  if (ref) return { channel: 'Diğer site', detail: ref, landing }
  return { channel: 'Direkt', landing }
}

export async function saveBookingSource(id: string, info: { channel: string; detail?: string; landing?: string }) {
  const all = await getSetting<Record<string, BookingSource>>(SOURCES_KEY, {})
  all[id] = { ...info, at: new Date().toISOString() }
  await setSetting(SOURCES_KEY, all)
}
