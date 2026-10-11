// Neslihan's advisor tools: "why no bookings?" diagnostics, competitor check,
// and deep analysis (Gemini, free tier).

import { geminiGenerate, textOf } from './gemini'
import { getSupabase, istanbulDate, getSearchConsole } from '@/lib/admin/dashboard-data'
import type { ToolContext, ToolOutput } from './tools'

const fmt = (n: number, d = 0) => (Number.isFinite(n) ? n.toLocaleString('tr-TR', { maximumFractionDigits: d, minimumFractionDigits: d }) : '—')
const pct = (n: number) => `%${fmt(n * 100)}`
const MY_DOMAINS = ['atmosparagliding.com', 'paragliding-oludeniz.com']
const isMine = (link: string) => MY_DOMAINS.some(d => (link || '').includes(d))

async function adminApi(ctx: ToolContext, path: string) {
  const r = await fetch(`${ctx.origin}${path}`, { headers: { cookie: ctx.cookie }, cache: 'no-store' })
  const d = await r.json().catch(() => ({}))
  if (!r.ok || d?.error) throw new Error(d?.error || `HTTP ${r.status}`)
  return d
}
const settle = async <T,>(p: Promise<T>): Promise<T | { error: string }> => p.catch((e: any) => ({ error: e?.message || String(e) }))

function adsRange(days: number) {
  return days <= 7 ? 'LAST_7_DAYS' : days <= 14 ? 'LAST_14_DAYS' : 'LAST_30_DAYS'
}

async function bookingsCreated(days: number) {
  const since = new Date(Date.now() - days * 86400000).toISOString()
  const { data, error } = await getSupabase().from('bookings')
    .select('created_at,flight_date,guests,total_price,status').gte('created_at', since).limit(1000)
  if (error) throw new Error(error.message)
  const live = (data || []).filter((b: any) => b.status !== 'cancelled')
  return { count: live.length, guests: live.reduce((s: number, b: any) => s + (b.guests || 1), 0), cancelled: (data || []).length - live.length }
}

// Raw evidence used by both the quick diagnosis and Claude's deep analysis.
async function collectFunnel(days: number, ctx: ToolContext) {
  const [adsOverview, adsDiag, ga, bookings] = await Promise.all([
    settle(adminApi(ctx, '/api/admin/google-ads?type=overview')),
    settle(adminApi(ctx, `/api/admin/google-ads?type=diagnostics&range=${adsRange(days)}`)),
    settle(adminApi(ctx, `/api/admin/seo-data?type=ga4-funnel&days=${days}`)),
    settle(bookingsCreated(days)),
  ])
  return { days, adsOverview, adsDiag, ga, bookings }
}

export async function diagnoseBookings(args: any, ctx: ToolContext): Promise<ToolOutput> {
  const days = [7, 14, 30].includes(Number(args?.days)) ? Number(args.days) : 14
  const f = await collectFunnel(days, ctx)
  const ads: any = 'error' in f.adsOverview ? null : f.adsOverview
  const diag: any = 'error' in f.adsDiag ? null : f.adsDiag
  const ga: any = 'error' in f.ga ? null : f.ga
  const bk: any = 'error' in f.bookings ? null : f.bookings

  const adDays = (ads?.days || []).slice(-days)
  const adTotals = adDays.reduce((a: any, r: any) => ({ clicks: a.clicks + r.clicks, cost: a.cost + r.cost, conversions: a.conversions + r.conversions }), { clicks: 0, cost: 0, conversions: 0 })
  const paid = (ga?.channels || []).filter((c: any) => /paid/i.test(c.channel))
  const paidSessions = paid.reduce((s: number, c: any) => s + c.sessions, 0)
  const paidEngagement = paidSessions ? paid.reduce((s: number, c: any) => s + c.engagementRate * c.sessions, 0) / paidSessions : 0
  const paidBookViews = (ga?.bookNowViewsByChannel || []).filter((c: any) => /paid/i.test(c.channel)).reduce((s: number, c: any) => s + c.views, 0)
  const allBookViews = (ga?.bookNowViewsByChannel || []).reduce((s: number, c: any) => s + c.views, 0)
  const leads = (ga?.events || []).find((e: any) => e.event === 'generate_lead')?.count || 0
  const terms: any[] = diag?.searchTerms || []

  const errors = Object.entries({ 'Google Ads': f.adsOverview, 'Google Ads detay': f.adsDiag, 'Google Analytics': f.ga, Rezervasyonlar: f.bookings })
    .filter(([, v]) => v && typeof v === 'object' && 'error' in (v as any)).map(([k, v]) => `${k}: ${(v as any).error}`)

  return {
    result: {
      period_days: days,
      google_ads: { clicks: adTotals.clicks, cost_try: adTotals.cost, conversions: adTotals.conversions, by_device: diag?.devices, clicks_by_hour: diag?.clicksByHour, top_search_terms: terms.slice(0, 20) },
      analytics: { channels: ga?.channels, paid_landing_pages: ga?.paidLandingPages, devices: ga?.devices, book_now_views_by_channel: ga?.bookNowViewsByChannel, generate_lead_events: leads, top_events: ga?.events },
      bookings_created: bk,
      data_errors: errors,
      hints: [
        'Huni: reklam tıklaması → site oturumu → rezervasyon sayfası (book-now) görüntüleme → form gönderimi (generate_lead) → bookings tablosu.',
        'Tıklama var ama paid oturum çok azsa: sayfa yavaş/hatalı yükleniyor veya takip sorunu olabilir.',
        'Paid etkileşim oranı düşükse veya süre çok kısaysa: açılış sayfası/arama terimi uyumsuz.',
        'book-now görüntüleme var ama lead yoksa: form/fiyat/ödeme adımında kayıp.',
        'Dönüşüm 0 ama bookings var: müşteri WhatsApp/telefonla yazmış olabilir (form dışı) — takip edilmiyor.',
        'Arama terimlerinde alakasız ifadeler (ör. iş ilanı, ücretsiz, video, başka şehir) bütçe yiyorsa negatif kelime öner.',
      ],
    },
    display: {
      title: `Rezervasyon teşhisi · son ${days} gün`,
      subtitle: 'Reklam tıklamasından rezervasyona kadar',
      stats: [
        { label: 'Reklam tıklaması', value: fmt(adTotals.clicks), hint: `₺${fmt(adTotals.cost)} harcama` },
        { label: 'Reklamdan oturum', value: fmt(paidSessions), hint: `etkileşim ${pct(paidEngagement)}`, tone: adTotals.clicks && paidSessions < adTotals.clicks * 0.5 ? 'warn' : undefined },
        { label: 'Rezervasyon sayfası', value: fmt(paidBookViews), hint: `tümü: ${fmt(allBookViews)}` },
        { label: 'Form / Rezervasyon', value: `${fmt(leads)} / ${fmt(bk?.count || 0)}`, hint: `Ads dönüşüm: ${fmt(adTotals.conversions, 1)}`, tone: (bk?.count || 0) === 0 ? 'bad' : 'good' },
      ],
      table: terms.length ? {
        columns: ['Aranan kelime', 'Tık', 'Harcama', 'Dönüşüm'],
        rows: terms.slice(0, 12).map(t => [t.term, t.clicks, `₺${fmt(t.cost)}`, fmt(t.conversions, 1)]),
      } : undefined,
      note: errors.length ? `Eksik veri: ${errors.join(' · ')}` : undefined,
    },
  }
}

export async function competitorCheck(args: any): Promise<ToolOutput> {
  const apiKey = process.env.SERP_API_KEY
  if (!apiKey) throw new Error('SERP_API_KEY tanımlı değil')
  const keyword = String(args?.keyword || 'paragliding oludeniz').slice(0, 100)
  const country = args?.country === 'tr' ? 'tr' : 'gb'
  const url = new URL('https://serpapi.com/search')
  url.searchParams.set('q', keyword)
  url.searchParams.set('gl', country)
  url.searchParams.set('hl', country === 'tr' ? 'tr' : 'en')
  url.searchParams.set('num', '10')
  url.searchParams.set('api_key', apiKey)
  const r = await fetch(url.toString(), { cache: 'no-store' })
  const d = await r.json()
  if (d?.error) throw new Error(d.error)

  const host = (link: string) => { try { return new URL(link).hostname.replace(/^www\./, '') } catch { return link } }
  const organic = (d.organic_results || []).slice(0, 10).map((o: any) => ({ position: o.position, domain: host(o.link), title: o.title, mine: isMine(o.link) }))
  const ads = (d.ads || []).map((a: any, i: number) => ({ position: i + 1, domain: host(a.link), title: a.title, mine: isMine(a.link) }))
  const local = (d.local_results?.places || d.local_results || []).slice?.(0, 6)?.map((p: any) => ({ name: p.title, rating: p.rating, reviews: p.reviews, mine: /atmos/i.test(p.title || '') })) || []
  const myOrganic = organic.find((o: any) => o.mine)?.position || null
  const myAd = ads.find((a: any) => a.mine)?.position || null

  return {
    result: { keyword, country, my_organic_position: myOrganic, my_ad_position: myAd, ads, organic, local_pack: local },
    display: {
      title: `Rakipler · "${keyword}"`,
      subtitle: country === 'tr' ? 'Google Türkiye' : 'Google İngiltere (İngilizce)',
      stats: [
        { label: 'Bizim sıramız', value: myOrganic ? `#${myOrganic}` : 'İlk 10\'da yok', tone: myOrganic ? (myOrganic <= 3 ? 'good' : 'warn') : 'bad' },
        { label: 'Reklam veren', value: fmt(ads.length), hint: myAd ? `biz #${myAd}` : 'bizim reklam görünmüyor' },
      ],
      table: {
        columns: ['#', 'Site', 'Tür', 'Puan / Yorum'],
        rows: [
          ...ads.map((a: any) => [`R${a.position}`, a.mine ? `★ ${a.domain}` : a.domain, 'Reklam', '']),
          ...organic.map((o: any) => [o.position, o.mine ? `★ ${o.domain}` : o.domain, 'Organik', '']),
          ...local.map((l: any, i: number) => [`H${i + 1}`, l.mine ? `★ ${l.name}` : l.name, 'Harita', l.rating ? `${l.rating} ★ · ${fmt(l.reviews || 0)}` : '']),
        ],
      },
    },
  }
}

const ANALYST_PROMPT = `Sen Atmos Paragliding'in (Ölüdeniz tandem yamaç paraşütü, kişi başı 150 USD, site atmosparagliding.com) kıdemli dijital pazarlama ve büyüme analistisin.
Sana gerçek veriler (Google Ads, GA4, Search Console, rezervasyonlar, isteğe bağlı rakip SERP) ve Ceyhun Bey'in sorusu verilecek.
Kurallar:
- Sadece verideki rakamlara dayan; veri eksikse bunu söyle. Tahminleri "muhtemelen" diye işaretle.
- Kök nedeni bul (huni: tıklama → oturum → rezervasyon sayfası → form → rezervasyon). Hangi adımda kayıp var, neden?
- Somut, uygulanabilir öneriler ver (hangi kelimeyi negatife ekle, hangi sayfayı düzelt, bütçeyi nereye kaydır). Reklam ayarlarını Ceyhun Bey kendisi değiştirecek.
- Türkçe yaz.
Cevabı SADECE şu JSON olarak ver:
{"spoken_summary": "Neslihan'ın sesli okuyacağı 2-3 cümlelik özet", "findings": ["kısa tespit", ...], "recommendations": [{"action": "ne yapılmalı", "why": "neden", "impact": "yüksek|orta|düşük"}], "data_gaps": ["eksik veri", ...]}`

export async function deepAnalysis(args: any, ctx: ToolContext): Promise<ToolOutput> {
  const question = String(args?.question || 'Neden yeterince rezervasyon gelmiyor?').slice(0, 500)
  const days = [7, 14, 30].includes(Number(args?.days)) ? Number(args.days) : 14
  const [funnel, gsc, competitors] = await Promise.all([
    collectFunnel(days, ctx),
    settle(getSearchConsole().then(g => ({ queries: g.queries, pages: g.pages, last28clicks: g.daily.slice(-28).reduce((s, r) => s + r.clicks, 0), prev28clicks: g.daily.slice(-56, -28).reduce((s, r) => s + r.clicks, 0), error: g.error }))),
    args?.include_competitors ? settle(competitorCheck({ keyword: args?.keyword }).then(c => c.result)) : Promise.resolve(null),
  ])

  const answer = await geminiGenerate({
    system: ANALYST_PROMPT,
    contents: [{ role: 'user', parts: [{ text: `Bugün: ${istanbulDate(0)}\nSoru: ${question}\n\nVERİ:\n${JSON.stringify({ funnel, search_console: gsc, competitors })}` }] }],
    json: true,
    maxOutputTokens: 4096,
    model: process.env.GEMINI_ANALYSIS_MODEL || undefined,
  })
  const text = textOf(answer)
  let report: any
  try {
    report = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1))
  } catch {
    report = { spoken_summary: text.slice(0, 400), findings: [], recommendations: [], data_gaps: [] }
  }

  const recs: any[] = Array.isArray(report.recommendations) ? report.recommendations : []
  return {
    result: report,
    display: {
      title: `Analiz · ${question}`,
      subtitle: `Son ${days} gün · Gemini analizi`,
      note: [report.spoken_summary, ...(report.findings || []).map((f: string) => `• ${f}`), ...((report.data_gaps || []).length ? [`Eksik veri: ${report.data_gaps.join(', ')}`] : [])].join('\n'),
      table: recs.length ? { columns: ['Öneri', 'Neden', 'Etki'], rows: recs.map(r => [r.action, r.why, r.impact]) } : undefined,
    },
  }
}
