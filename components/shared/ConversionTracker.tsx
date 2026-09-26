'use client'
import { useEffect } from 'react'

// Site-wide click tracking for WhatsApp and phone links (the main booking
// channels besides the form). Sends GA4 events that can be marked as key events
// and imported into Google Ads as conversions.
export default function ConversionTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const a = (e.target as HTMLElement | null)?.closest?.('a') as HTMLAnchorElement | null
      if (!a || !a.href) return
      const gtag = (window as any).gtag
      if (typeof gtag !== 'function') return
      const page = window.location.pathname
      if (a.href.includes('wa.me/') || a.href.includes('api.whatsapp.com')) {
        gtag('event', 'whatsapp_click', { link_url: a.href, page_path: page })
      } else if (a.href.startsWith('tel:')) {
        gtag('event', 'phone_click', { link_url: a.href, page_path: page })
      }
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true } as any)
  }, [])
  return null
}
