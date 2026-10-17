// Atmos Admin PWA service worker.
// Scope is /admin/ only (see Service-Worker-Allowed header in next.config.js),
// so it never touches the public website or anything Google crawls.
const CACHE = 'atmos-admin-v1'
const SHELL = ['/admin-icon-192.png', '/admin-icon-512.png', '/images/hero-oludeniz-mobile.webp']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  )
})

const OFFLINE = `<!doctype html><html lang="tr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Atmos Admin</title><body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0B1220;color:#E2E8F0;font-family:system-ui,sans-serif;text-align:center;padding:24px">
<div><div style="font-size:40px">📡</div><h1 style="font-size:18px;margin:12px 0 6px">İnternet yok</h1>
<p style="color:#94A3B8;font-size:14px;margin:0 0 18px">Bağlantı gelince panel güncellenir.</p>
<button onclick="location.reload()" style="background:#f97316;color:#fff;border:0;border-radius:12px;padding:12px 20px;font-size:15px;font-weight:600">Tekrar dene</button></div></body></html>`

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return

  // App page: network first (always fresh numbers), last good copy when offline.
  if (req.mode === 'navigate' && url.pathname.startsWith('/admin/app')) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok && !res.redirected) {
            const copy = res.clone()
            caches.open(CACHE).then((c) => c.put('/admin/app', copy))
          }
          return res
        })
        .catch(() => caches.match('/admin/app').then((r) => r || new Response(OFFLINE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })))
    )
    return
  }

  // Hashed build assets never change: cache first.
  if (url.pathname.startsWith('/_next/static/') || SHELL.includes(url.pathname)) {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)) }
        return res
      }))
    )
  }
  // Everything else (API calls, other admin pages): straight to network.
})
