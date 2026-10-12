'use client'

// Ziyaretçinin siteye nereden geldiğini (Google Ads, Instagram, ChatGPT, Google arama…)
// tarayıcıda saklar; rezervasyon formu bunu rezervasyonla birlikte gönderir.
// Böylece admin panelde "hangi kanal para getiriyor" görülebilir.
// Kural: ücretli tıklama (gclid/fbclid/utm) her zaman öncekinin üstüne yazar;
// diğer durumlarda ilk geliş 30 gün saklanır.
import { useEffect } from 'react'

export const SOURCE_KEY = 'atmos_src'

export function readSource(): Record<string, string> | null {
  try { return JSON.parse(localStorage.getItem(SOURCE_KEY) || 'null') } catch { return null }
}

export default function SourceCapture() {
  useEffect(() => {
    try {
      const u = new URL(window.location.href)
      const q = (k: string) => u.searchParams.get(k) || ''
      const ref = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, '') : ''
      const external = ref && !ref.endsWith('atmosparagliding.com')
      const paid = !!(q('gclid') || q('gbraid') || q('wbraid') || q('fbclid') || q('utm_source'))
      const prev = readSource()
      const fresh = !prev || Date.now() - Number(prev.ts || 0) > 30 * 86400000
      if (paid || (fresh && (external || !prev))) {
        localStorage.setItem(SOURCE_KEY, JSON.stringify({
          utm_source: q('utm_source'), utm_medium: q('utm_medium'), utm_campaign: q('utm_campaign'),
          gclid: q('gclid') || q('gbraid') || q('wbraid') ? '1' : '', fbclid: q('fbclid') ? '1' : '',
          referrer: external ? ref : '', landing: u.pathname.slice(0, 120), ts: String(Date.now()),
        }))
      }
    } catch { /* storage blocked — tracking is best effort */ }
  }, [])
  return null
}
