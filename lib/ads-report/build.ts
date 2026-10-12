// Daily Google Ads deep report. Pulls Google Ads (GAQL), GA4 (paid traffic
// behaviour) and Supabase bookings, runs a rule engine for findings, and asks
// Gemini (free tier) for a short Turkish summary. Result is stored in
// settings.ads_daily_report and rendered on /admin/google-ads.
import { createClient } from '@supabase/supabase-js'
import { geminiGenerate, textOf } from '@/lib/neslihan/gemini'

const ADS_API = 'https://googleads.googleapis.com/v23'
export const REPORT_KEY = 'ads_daily_report'
export const HISTORY_KEY = 'ads_daily_report_history'

export type Severity = 'critical' | 'serious' | 'warning' | 'good'
export interface Finding { severity: Severity; title: string; detail: string; action?: string }

const COUNTRY: Record<string, string> = {
  '2792': 'Türkiye', '2826': 'İngiltere', '2276': 'Almanya', '2643': 'Rusya', '2804': 'Ukrayna', '2616': 'Polonya',
  '2528': 'Hollanda', '2056': 'Belçika', '2840': 'ABD', '2380': 'İtalya', '2724': 'İspanya', '2250': 'Fransa',
  '2156': 'Çin', '2703': 'Slovakya', '2705': 'Slovenya', '2586': 'Pakistan', '2203': 'Çekya', '2040': 'Avusturya',
  '2756': 'İsviçre', '2752': 'İsveç', '2578': 'Norveç', '2208': 'Danimarka', '2246': 'Finlandiya', '2372': 'İrlanda',
  '2196': 'Kıbrıs', '2356': 'Hindistan', '2682': 'S. Arabistan', '2784': 'BAE', '2348': 'Macaristan', '2642': 'Romanya',
  '2100': 'Bulgaristan', '2688': 'Sırbistan', '2410': 'G. Kore', '2392': 'Japonya', '2036': 'Avustralya', '2124': 'Kanada',
  '2376': 'İsrail', '2398': 'Kazakistan', '2112': 'Belarus', '2440': 'Litvanya', '2428': 'Letonya', '2233': 'Estonya',
}
const COMPETITORS = ['united pilots', 'hanuman', 'gravity', 'touryus', 'dragon', 'sky fethiye', 'escape', 'deep blue', 'liberty', 'easy fly', 'skysports', 'focus paragliding', 'pegas', 'oludenizparagliding', 'oludeniz-paragliding']
const IRRELEVANT = ['hang gliding', 'skydiv', 'uçaktan', 'ucaktan', 'air games', 'airgames', 'festival', 'kaç metre', 'kac metre', 'yükseklik', 'yukseklik', 'height', 'marmaris', 'bodrum', 'kaş', 'kemer', 'antalya', 'alanya', 'kaza', 'ölüm', 'course', 'kurs', 'license', 'lisans', 'job', 'iş ilan']
const TURKISH = /[çğıöşü]|fiyat|paraşüt|parasut|yamaç|yamac|ne kadar|kaç|kac /i

const n = (v: any) => Number(v || 0)
const micros = (v: any) => n(v) / 1e6

function supa() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) },
  })
}

async function token(refresh: string) {
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, cache: 'no-store',
    body: new URLSearchParams({ client_id: process.env.GOOGLE_ADS_CLIENT_ID || '', client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET || '', refresh_token: refresh, grant_type: 'refresh_token' }),
  })
  const j = await r.json().catch(() => ({}))
  if (!j.access_token) throw new Error('OAuth: ' + (j.error_description || j.error || r.status))
  return j.access_token as string
}

async function gaql(at: string, query: string): Promise<any[]> {
  const cid = (process.env.GOOGLE_ADS_CUSTOMER_ID || '').replace(/-/g, '')
  const r = await fetch(`${ADS_API}/customers/${cid}/googleAds:search`, {
    method: 'POST', cache: 'no-store',
    headers: { Authorization: 'Bearer ' + at, 'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '', 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })
  const j = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(j?.error?.details?.[0]?.errors?.[0]?.message || j?.error?.message || 'Ads HTTP ' + r.status)
  return j.results || []
}

async function ga4(at: string, body: any) {
  const r = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${process.env.GA4_PROPERTY_ID}:runReport`, {
    method: 'POST', cache: 'no-store', headers: { Authorization: 'Bearer ' + at, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  })
  const j = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(j?.error?.message || 'GA4 HTTP ' + r.status)
  return (j.rows || []).map((row: any) => ({ d: (row.dimensionValues || []).map((x: any) => x.value), m: row.metricValues.map((x: any) => Number(x.value)) }))
}

// Dates in the account time zone (Europe/Istanbul, UTC+3)
const isoDay = (d: Date) => new Date(d.getTime() + 3 * 3600000).toISOString().slice(0, 10)

export async function buildAdsReport() {
  const errors: string[] = []
  const safe = async <T,>(label: string, fn: () => Promise<T>, fallback: T): Promise<T> => {
    try { return await fn() } catch (e: any) { errors.push(`${label}: ${e.message}`); return fallback }
  }

  const now = new Date()
  const day = 86400000
  const y = new Date(now.getTime() - day)
  const d7 = new Date(now.getTime() - 7 * day)
  const d8 = new Date(now.getTime() - 8 * day)
  const d14 = new Date(now.getTime() - 14 * day)
  const d30 = new Date(now.getTime() - 30 * day)
  const R7 = `segments.date BETWEEN '${isoDay(d7)}' AND '${isoDay(y)}'`
  const RP7 = `segments.date BETWEEN '${isoDay(d14)}' AND '${isoDay(d8)}'`
  const R30 = `segments.date BETWEEN '${isoDay(d30)}' AND '${isoDay(y)}'`

  const at = await token(process.env.GOOGLE_ADS_REFRESH_TOKEN || '')
  const [campaigns, daily, prev, hourly, devices, keywords, terms, geo, ads, assets, assetPerf, convByAction, yesterday] = await Promise.all([
    safe('kampanyalar', () => gaql(at, `SELECT campaign.id, campaign.name, campaign.status, campaign.primary_status, campaign.primary_status_reasons, campaign.bidding_strategy_type, campaign.geo_target_type_setting.positive_geo_target_type, campaign_budget.amount_micros FROM campaign WHERE campaign.status = 'ENABLED'`), [] as any[]),
    safe('günlük', () => gaql(at, `SELECT segments.date, metrics.cost_micros, metrics.clicks, metrics.impressions, metrics.conversions, metrics.all_conversions, metrics.search_impression_share, metrics.search_budget_lost_impression_share, metrics.search_rank_lost_impression_share, metrics.search_absolute_top_impression_share FROM campaign WHERE campaign.status = 'ENABLED' AND ${R30}`), [] as any[]),
    safe('önceki hafta', () => gaql(at, `SELECT metrics.cost_micros, metrics.clicks, metrics.impressions, metrics.conversions FROM customer WHERE ${RP7}`), [] as any[]),
    safe('saatlik', () => gaql(at, `SELECT segments.hour, metrics.clicks, metrics.cost_micros, metrics.impressions FROM customer WHERE ${R30}`), [] as any[]),
    safe('cihaz', () => gaql(at, `SELECT segments.device, metrics.clicks, metrics.cost_micros, metrics.impressions FROM customer WHERE ${R30}`), [] as any[]),
    safe('anahtar kelimeler', () => gaql(at, `SELECT ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type, ad_group_criterion.status, ad_group_criterion.quality_info.quality_score, ad_group_criterion.quality_info.post_click_quality_score, ad_group_criterion.quality_info.search_predicted_ctr, ad_group_criterion.quality_info.creative_quality_score, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions, metrics.search_impression_share FROM keyword_view WHERE campaign.status = 'ENABLED' AND ${R30}`), [] as any[]),
    safe('arama terimleri', () => gaql(at, `SELECT search_term_view.search_term, search_term_view.status, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM search_term_view WHERE ${R7} AND metrics.impressions > 0 ORDER BY metrics.impressions DESC LIMIT 150`), [] as any[]),
    safe('konum', () => gaql(at, `SELECT user_location_view.country_criterion_id, user_location_view.targeting_location, metrics.clicks, metrics.cost_micros, metrics.impressions FROM user_location_view WHERE ${R7}`), [] as any[]),
    safe('reklamlar', () => gaql(at, `SELECT ad_group_ad.ad_strength, ad_group_ad.action_items, ad_group_ad.policy_summary.approval_status, ad_group_ad.ad.final_urls FROM ad_group_ad WHERE ad_group_ad.status = 'ENABLED' AND campaign.status = 'ENABLED'`), [] as any[]),
    safe('eklentiler', () => gaql(at, `SELECT campaign.id, campaign.status, campaign_asset.field_type, campaign_asset.status FROM campaign_asset WHERE campaign.status = 'ENABLED' AND campaign_asset.status = 'ENABLED'`), [] as any[]),
    safe('başlık performansı', () => gaql(at, `SELECT ad_group_ad_asset_view.field_type, asset.text_asset.text, metrics.impressions FROM ad_group_ad_asset_view WHERE campaign.status = 'ENABLED' AND ${R30}`), [] as any[]),
    safe('dönüşüm eylemleri', () => gaql(at, `SELECT segments.conversion_action_name, metrics.all_conversions, metrics.conversions FROM customer WHERE ${R30}`), [] as any[]),
    safe('dün', () => gaql(at, `SELECT metrics.cost_micros, metrics.clicks, metrics.impressions FROM customer WHERE segments.date = '${isoDay(y)}'`), [] as any[]),
  ])

  // ── daily series (30d), aggregated across enabled campaigns
  const byDate: Record<string, any> = {}
  for (const r of daily) {
    const d = r.segments.date, m = r.metrics
    const o = byDate[d] ||= { date: d, cost: 0, clicks: 0, impressions: 0, conversions: 0, isW: 0, lbW: 0, lrW: 0, atW: 0 }
    const imp = n(m.impressions)
    o.cost += micros(m.costMicros); o.clicks += n(m.clicks); o.impressions += imp; o.conversions += n(m.conversions)
    o.isW += n(m.searchImpressionShare) * imp; o.lbW += n(m.searchBudgetLostImpressionShare) * imp; o.lrW += n(m.searchRankLostImpressionShare) * imp; o.atW += n(m.searchAbsoluteTopImpressionShare) * imp
  }
  const dailySeries = Object.values(byDate).sort((a: any, b: any) => a.date.localeCompare(b.date)).map((o: any) => ({
    date: o.date, cost: +o.cost.toFixed(2), clicks: o.clicks, impressions: o.impressions, conversions: +o.conversions.toFixed(2),
    is: o.impressions ? +(o.isW / o.impressions).toFixed(3) : null,
    lostBudget: o.impressions ? +(o.lbW / o.impressions).toFixed(3) : null,
    lostRank: o.impressions ? +(o.lrW / o.impressions).toFixed(3) : null,
    absTop: o.impressions ? +(o.atW / o.impressions).toFixed(3) : null,
  }))
  const last7 = dailySeries.filter(d => d.date >= isoDay(d7))
  const sum = (arr: any[], k: string) => arr.reduce((a, b) => a + (b[k] || 0), 0)
  const wavg = (arr: any[], k: string) => { const w = sum(arr, 'impressions'); return w ? arr.reduce((a, b) => a + (b[k] || 0) * b.impressions, 0) / w : null }
  const spend7 = sum(last7, 'cost'), clicks7 = sum(last7, 'clicks'), impr7 = sum(last7, 'impressions'), conv7 = sum(last7, 'conversions')
  const p = prev[0]?.metrics || {}
  const kpis = {
    spend7: +spend7.toFixed(2), spendPrev7: +micros(p.costMicros).toFixed(2),
    clicks7, clicksPrev7: n(p.clicks), impr7, imprPrev7: n(p.impressions),
    conv7: +conv7.toFixed(2), convPrev7: +n(p.conversions).toFixed(2),
    ctr7: impr7 ? clicks7 / impr7 : 0, cpc7: clicks7 ? spend7 / clicks7 : 0, cpa7: conv7 ? spend7 / conv7 : null,
    is7: wavg(last7, 'is'), lostBudget7: wavg(last7, 'lostBudget'), lostRank7: wavg(last7, 'lostRank'), absTop7: wavg(last7, 'absTop'),
    spendYesterday: +micros(yesterday[0]?.metrics?.costMicros).toFixed(2), clicksYesterday: n(yesterday[0]?.metrics?.clicks), imprYesterday: n(yesterday[0]?.metrics?.impressions),
    budgetDaily: campaigns.reduce((a, c) => a + micros(c.campaignBudget?.amountMicros), 0),
  }

  const hourMap: Record<number, any> = {}
  for (const r of hourly) { const h = n(r.segments.hour); const o = hourMap[h] ||= { clicks: 0, cost: 0, impressions: 0 }; o.clicks += n(r.metrics.clicks); o.cost += micros(r.metrics.costMicros); o.impressions += n(r.metrics.impressions) }
  const hourSeries = Array.from({ length: 24 }, (_, h) => ({ hour: h, clicks: hourMap[h]?.clicks || 0, cost: +(hourMap[h]?.cost || 0).toFixed(2), impressions: hourMap[h]?.impressions || 0 }))

  const devMap: Record<string, any> = {}
  for (const r of devices) { const k = r.segments.device; const o = devMap[k] ||= { device: k, clicks: 0, cost: 0, impressions: 0 }; o.clicks += n(r.metrics.clicks); o.cost += micros(r.metrics.costMicros); o.impressions += n(r.metrics.impressions) }
  const deviceSeries = Object.values(devMap).filter((d: any) => d.impressions > 0).map((d: any) => ({ ...d, cost: +d.cost.toFixed(2) }))

  const kwMap: Record<string, any> = {}
  for (const r of keywords) {
    const c = r.adGroupCriterion, m = r.metrics, key = c.keyword.text + '|' + c.keyword.matchType
    const o = kwMap[key] ||= { text: c.keyword.text, match: c.keyword.matchType, status: c.status, qs: c.qualityInfo?.qualityScore ?? null, lp: c.qualityInfo?.postClickQualityScore || null, ctrPred: c.qualityInfo?.searchPredictedCtr || null, adRel: c.qualityInfo?.creativeQualityScore || null, impressions: 0, clicks: 0, cost: 0, conversions: 0, isW: 0 }
    o.impressions += n(m.impressions); o.clicks += n(m.clicks); o.cost += micros(m.costMicros); o.conversions += n(m.conversions); o.isW += n(m.searchImpressionShare) * n(m.impressions)
  }
  const keywordRows = Object.values(kwMap).map((o: any) => { const { isW, ...rest } = o; return { ...rest, cost: +o.cost.toFixed(2), is: o.impressions ? +(isW / o.impressions).toFixed(3) : null } }).sort((a: any, b: any) => b.cost - a.cost || b.impressions - a.impressions)

  const classify = (t: string) => {
    const s = t.toLowerCase()
    if (COMPETITORS.some(c => s.includes(c))) return 'competitor'
    if (IRRELEVANT.some(c => s.includes(c))) return 'irrelevant'
    if (/[Ѐ-ӿ]/.test(s)) return 'russian'
    if (/[一-鿿]/.test(s)) return 'chinese'
    if (TURKISH.test(s)) return 'turkish'
    return 'ok'
  }
  const termRows = terms.map(r => ({ term: r.searchTermView.searchTerm as string, status: r.searchTermView.status, impressions: n(r.metrics.impressions), clicks: n(r.metrics.clicks), cost: +micros(r.metrics.costMicros).toFixed(2), conversions: n(r.metrics.conversions), flag: classify(r.searchTermView.searchTerm) }))
  const termBuckets: Record<string, { impressions: number; clicks: number; cost: number; count: number }> = {}
  for (const t of termRows) { const b = termBuckets[t.flag] ||= { impressions: 0, clicks: 0, cost: 0, count: 0 }; b.impressions += t.impressions; b.clicks += t.clicks; b.cost = +(b.cost + t.cost).toFixed(2); b.count++ }

  const geoMap: Record<string, any> = {}
  for (const r of geo) { const id = String(r.userLocationView.countryCriterionId); const inside = !!r.userLocationView.targetingLocation; const k = id + (inside ? '-in' : ''); const o = geoMap[k] ||= { country: (COUNTRY[id] || id) + (inside ? ' (hedef bölge)' : ''), clicks: 0, cost: 0, impressions: 0 }; o.clicks += n(r.metrics.clicks); o.cost += micros(r.metrics.costMicros); o.impressions += n(r.metrics.impressions) }
  const geoRows = Object.values(geoMap).map((g: any) => ({ ...g, cost: +g.cost.toFixed(2) })).sort((a: any, b: any) => b.cost - a.cost || b.impressions - a.impressions).slice(0, 12)

  const assetCounts: Record<string, number> = {}
  for (const a of assets) { const f = a.campaignAsset.fieldType; assetCounts[f] = (assetCounts[f] || 0) + 1 }
  const headlineMap: Record<string, any> = {}
  for (const a of assetPerf) { if (!a.asset?.textAsset?.text) continue; const k = a.adGroupAdAssetView.fieldType + '|' + a.asset.textAsset.text; const o = headlineMap[k] ||= { type: a.adGroupAdAssetView.fieldType, text: a.asset.textAsset.text, impressions: 0 }; o.impressions += n(a.metrics.impressions) }
  const headlines = Object.values(headlineMap).sort((a: any, b: any) => b.impressions - a.impressions)
  const ad = ads[0]?.adGroupAd
  const conversionActions = convByAction.map(r => ({ name: r.segments.conversionActionName, all: n(r.metrics.allConversions), primary: n(r.metrics.conversions) })).filter(r => r.all > 0)

  // ── GA4: what paid visitors do on the site (last 7 days)
  const ga = await safe('GA4', async () => {
    const gat = await token(process.env.GOOGLE_SEO_REFRESH_TOKEN || '')
    const dr = [{ startDate: '7daysAgo', endDate: 'yesterday' }]
    const cpc = { filter: { fieldName: 'sessionMedium', stringFilter: { value: 'cpc' } } }
    const [tot, ev, lang, land, src] = await Promise.all([
      ga4(gat, { dateRanges: dr, metrics: [{ name: 'sessions' }, { name: 'engagementRate' }, { name: 'averageSessionDuration' }], dimensionFilter: cpc }),
      ga4(gat, { dateRanges: dr, dimensions: [{ name: 'eventName' }], metrics: [{ name: 'eventCount' }], dimensionFilter: cpc }),
      ga4(gat, { dateRanges: dr, dimensions: [{ name: 'language' }], metrics: [{ name: 'sessions' }, { name: 'averageSessionDuration' }], dimensionFilter: cpc, limit: 8 }),
      ga4(gat, { dateRanges: dr, dimensions: [{ name: 'landingPage' }], metrics: [{ name: 'sessions' }, { name: 'averageSessionDuration' }, { name: 'engagementRate' }], dimensionFilter: cpc, limit: 8 }),
      ga4(gat, { dateRanges: dr, dimensions: [{ name: 'sessionSourceMedium' }], metrics: [{ name: 'sessions' }, { name: 'keyEvents' }, { name: 'averageSessionDuration' }], limit: 8, orderBys: [{ metric: { metricName: 'sessions' }, desc: true }] }),
    ])
    const evc = (name: string) => ev.find((e: any) => e.d[0] === name)?.m[0] || 0
    const sessions = tot[0]?.m[0] || 0
    return {
      sessions, engagementRate: tot[0]?.m[1] || 0, avgDuration: tot[0]?.m[2] || 0,
      funnel: [
        { step: 'Ziyaret', value: sessions },
        { step: 'İlgilendi', value: Math.round(sessions * (tot[0]?.m[1] || 0)) },
        { step: 'Sayfa sonu', value: evc('scroll') },
        { step: 'Form başladı', value: evc('form_start') },
        { step: 'WhatsApp / Tel', value: evc('whatsapp_click') + evc('phone_click') },
        { step: 'Rezervasyon', value: evc('generate_lead') },
      ],
      languages: lang.map((l: any) => ({ language: l.d[0], sessions: l.m[0], avgDuration: Math.round(l.m[1]) })),
      landing: land.map((l: any) => ({ page: l.d[0], sessions: l.m[0], avgDuration: Math.round(l.m[1]), engagementRate: l.m[2] })),
      sources: src.map((s: any) => ({ source: s.d[0], sessions: s.m[0], keyEvents: s.m[1], avgDuration: Math.round(s.m[2]) })),
    }
  }, null as any)

  const bookings7 = await safe('rezervasyonlar', async () => {
    const { count, error } = await supa().from('bookings').select('id', { count: 'exact', head: true }).gte('created_at', d7.toISOString())
    if (error) throw new Error(error.message)
    return count || 0
  }, null as any)

  // ── rule engine
  const F: Finding[] = []
  const tl = (v: number) => '₺' + Math.round(v).toLocaleString('tr-TR')
  const pct = (v: number | null) => v == null ? '–' : '%' + Math.round(v * 100)
  if (kpis.imprYesterday === 0 && campaigns.length) F.push({ severity: 'critical', title: 'Dün reklam hiç gösterilmedi', detail: 'Kampanya açık ama 0 gösterim. Bakiye bitmiş veya kampanya kısıtlanmış olabilir.', action: 'Google Ads > Faturalandırma bakiyesini kontrol et.' })
  if (kpis.conv7 === 0 && kpis.spend7 > 300) F.push({ severity: 'critical', title: `Son 7 günde ${tl(kpis.spend7)} harcandı, dönüşüm 0`, detail: `${kpis.clicks7} tıklama geldi ama form, WhatsApp veya telefon dönüşümü kaydedilmedi.`, action: 'Arama terimlerini ve sitedeki davranışı aşağıda kontrol et.' })
  if (kpis.conv7 > 0) F.push({ severity: 'good', title: `${kpis.conv7} dönüşüm geldi`, detail: `Dönüşüm başı maliyet ${tl(kpis.cpa7 || 0)}.` })
  if ((kpis.lostRank7 || 0) > 0.3) F.push({ severity: 'serious', title: `Gösterimlerin ${pct(kpis.lostRank7)}'i sıralama yüzünden kaçıyor`, detail: 'Kalite puanı veya teklif düşük, rakipler önde.', action: 'Düşük kalite puanlı kelimeleri düzelt; başlıklara anahtar kelime ekle.' })
  if ((kpis.lostBudget7 || 0) > 0.2) F.push({ severity: 'warning', title: `Gösterimlerin ${pct(kpis.lostBudget7)}'i bütçe yüzünden kaçıyor`, detail: `Günlük bütçe ${tl(kpis.budgetDaily)} gün bitmeden tükeniyor.`, action: 'Önce boşa giden aramaları kes; trafik kaliteliyse bütçeyi artır.' })
  if (kpis.absTop7 != null && kpis.absTop7 < 0.2 && impr7 > 50) F.push({ severity: 'warning', title: `Reklam sadece ${pct(kpis.absTop7)} oranında en üstte`, detail: 'Çoğu zaman rakiplerin altında görünüyoruz.' })
  if (impr7 > 100 && kpis.ctr7 < 0.05) F.push({ severity: 'warning', title: `Tıklanma oranı düşük: %${(kpis.ctr7 * 100).toFixed(1)}`, detail: 'Turizm reklamlarında genelde %6-8 beklenir.', action: 'Başlıkları güçlendir (FREE Video & Photo, fiyat, yorumlar).' })
  for (const k of keywordRows.filter((k: any) => k.status === 'ENABLED' && k.qs != null && k.qs <= 4 && k.impressions > 0).slice(0, 3)) F.push({ severity: 'serious', title: `"${k.text}" kalite puanı ${k.qs}/10`, detail: `Açılış sayfası: ${k.lp || '–'} · beklenen TO: ${k.ctrPred || '–'} · 30 günde ${tl(k.cost)}`, action: 'Kelimeyi durdur veya reklam metnine/sayfaya ekle.' })
  for (const f of ['competitor', 'irrelevant', 'turkish']) {
    const b = termBuckets[f]; if (!b?.impressions) continue
    const lbl = f === 'competitor' ? 'Rakip marka aramaları' : f === 'irrelevant' ? 'Alakasız aramalar' : 'Türkçe aramalar (reklam İngilizce)'
    const ex = termRows.filter(t => t.flag === f).slice(0, 4).map(t => `"${t.term}"`).join(', ')
    F.push({ severity: b.cost > 50 ? 'serious' : 'warning', title: `${lbl}: ${b.count} terim, ${tl(b.cost)}`, detail: `Örnek: ${ex}`, action: 'Negatif kelime olarak ekle.' })
  }
  for (const f of ['russian', 'chinese']) { const b = termBuckets[f]; if (b?.impressions) F.push({ severity: 'warning', title: `${f === 'russian' ? 'Rusça' : 'Çince'} aramalar geliyor (${b.impressions} gösterim)`, detail: 'Reklam İngilizce; kendi dilinde reklam grubu fırsat.', action: `${f === 'russian' ? 'Rusça' : 'Çince'} reklam grubu + /${f === 'russian' ? 'ru' : 'zh'} açılış sayfası.` }) }
  if (ad?.adStrength && ['POOR', 'AVERAGE'].includes(ad.adStrength)) F.push({ severity: 'warning', title: `Reklam gücü: ${ad.adStrength === 'POOR' ? 'Zayıf' : 'Ortalama'}`, detail: (ad.actionItems || []).join(' · ') || '–' })
  if ((assetCounts.SITELINK || 0) < 6) F.push({ severity: 'warning', title: `Site bağlantısı ${assetCounts.SITELINK || 0} adet`, detail: 'Google en az 6 öneriyor.' })
  if (!assetCounts.AD_IMAGE && !assetCounts.MARKETING_IMAGE) F.push({ severity: 'warning', title: 'Reklamda görsel yok', detail: 'Paraşüt fotoğrafı tıklanmayı artırır.', action: '3-4 uçuş fotoğrafı ekle.' })
  if (ga) {
    if (ga.sessions >= 10 && ga.avgDuration < 40) F.push({ severity: 'serious', title: `Reklamdan gelenler sitede ortalama ${Math.round(ga.avgDuration)} sn kalıyor`, detail: 'Gelen kişi aradığını bulamadan çıkıyor.' })
    const tr = ga.languages.find((l: any) => /turk/i.test(l.language))
    if (tr && ga.sessions && tr.sessions / ga.sessions > 0.2) F.push({ severity: 'serious', title: `Reklam ziyaretlerinin ${pct(tr.sessions / ga.sessions)}'i Türkçe telefonlardan`, detail: `Ortalama ${tr.avgDuration} sn kalıyorlar.`, action: 'Dil/bölge hedeflemesini kontrol et.' })
  }
  const order: Record<Severity, number> = { critical: 0, serious: 1, warning: 2, good: 3 }
  F.sort((a, b) => order[a.severity] - order[b.severity])

  const report: any = {
    generatedAt: now.toISOString(), currency: 'TRY',
    period: { from: isoDay(d7), to: isoDay(y) },
    campaigns: campaigns.map(c => ({ name: c.campaign.name, status: c.campaign.primaryStatus, reasons: c.campaign.primaryStatusReasons, bidding: c.campaign.biddingStrategyType, geoType: c.campaign.geoTargetTypeSetting?.positiveGeoTargetType, budget: micros(c.campaignBudget?.amountMicros) })),
    kpis, daily: dailySeries, hourly: hourSeries, devices: deviceSeries, keywords: keywordRows, searchTerms: termRows.slice(0, 60), termBuckets,
    geo: geoRows, ad: { strength: ad?.adStrength || null, actionItems: ad?.actionItems || [], finalUrl: ad?.ad?.finalUrls?.[0] || null }, assetCounts, headlines,
    conversionActions, ga4: ga, bookings7, findings: F, errors,
  }

  report.summary = await safe('Gemini özet', async () => {
    const out = await geminiGenerate({
      system: 'Sen Atmos Paragliding (Ölüdeniz tandem yamaç paraşütü, $150 her şey dahil) için Google Ads danışmanısın. Sahibi Ceyhun; samimi, kısa, net Türkçe yaz. Sadece verilen rakamları kullan, uydurma. Para birimi TL. 4-6 cümle: durum, en büyük sorun, bugün yapılacak 1-2 iş. Madde işareti kullanma.',
      contents: [{ role: 'user', parts: [{ text: JSON.stringify({ kpis, findings: F.map(f => f.title + ' — ' + f.detail), ga4: ga && { sessions: ga.sessions, avgDuration: ga.avgDuration, funnel: ga.funnel }, siteBookings7: bookings7 }) }] }],
      maxOutputTokens: 700,
    })
    return textOf(out)
  }, null as any)

  return report
}

export async function saveAdsReport(report: any) {
  const s = supa()
  const { error } = await s.from('settings').upsert({ key: REPORT_KEY, value: JSON.stringify(report) }, { onConflict: 'key' })
  if (error) throw new Error('Supabase kayıt: ' + error.message)
  const { data } = await s.from('settings').select('value').eq('key', HISTORY_KEY).maybeSingle()
  let hist: any[] = []
  try { hist = JSON.parse(data?.value || '[]') } catch {}
  hist = hist.filter(h => h.date !== report.period.to)
  hist.push({ date: report.period.to, spend7: report.kpis.spend7, clicks7: report.kpis.clicks7, conv7: report.kpis.conv7, is7: report.kpis.is7, critical: report.findings.filter((f: Finding) => f.severity === 'critical').length })
  hist = hist.slice(-60)
  await s.from('settings').upsert({ key: HISTORY_KEY, value: JSON.stringify(hist) }, { onConflict: 'key' })
}

export async function loadAdsReport() {
  const s = supa()
  const { data } = await s.from('settings').select('key,value').in('key', [REPORT_KEY, HISTORY_KEY])
  const get = (k: string) => { try { return JSON.parse(data?.find((d: any) => d.key === k)?.value || 'null') } catch { return null } }
  return { report: get(REPORT_KEY), history: get(HISTORY_KEY) || [] }
}
