// Google Ads ajanı — her sabah çalışır:
// 1) Günlük raporu üretir (lib/ads-report/build.ts) ve kaydeder
// 2) Güvenli, geri alınabilir düzeltmeleri KENDİSİ yapar:
//    - rakip / alakasız arama terimleri için negatif kelime ekler
//    - kalite puanı ≤3, 30 günde ≥150 TL harcayıp 0 dönüşüm getiren kelimeyi durdurur
// 3) Ceyhun'a Telegram'dan özet + yaptıklarını yollar
// Asla bütçeyi, teklifi artırmaz; yeni kampanya açmaz (para harcatan adımlar yok).
import { buildAdsReport, saveAdsReport, gaql, adsToken } from '@/lib/ads-report/build'
import { runLogged, telegram, esc } from './core'

const ADS_API = 'https://googleads.googleapis.com/v23'
const CAMPAIGN_FILTER = "campaign.status = 'ENABLED' AND campaign.advertising_channel_type = 'SEARCH'"

// Words that, if found in a search term, get added as a negative keyword.
const COMPETITOR_NEG = ['united pilots', 'hanuman', 'gravity', 'touryus', 'dragon', 'sky fethiye', 'escape paragliding', 'deep blue', 'liberty paragliding', 'easy fly', 'skysports', 'focus paragliding', 'pegas']
const IRRELEVANT_NEG = ['hang gliding', 'skydiving', 'skydive', 'uçaktan', 'ucaktan', 'air games', 'airgames', 'festival', 'kaç metre', 'kac metre', 'yükseklik', 'height', 'marmaris', 'bodrum', 'kemer', 'antalya', 'alanya', 'kaza', 'accident', 'course', 'kurs', 'license', 'job', 'webcam', 'live cam']

async function mutate(at: string, service: string, operations: any[]) {
  const cid = (process.env.GOOGLE_ADS_CUSTOMER_ID || '').replace(/-/g, '')
  const r = await fetch(`${ADS_API}/customers/${cid}/${service}:mutate`, {
    method: 'POST', cache: 'no-store',
    headers: { Authorization: 'Bearer ' + at, 'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '', 'Content-Type': 'application/json' },
    body: JSON.stringify({ operations, partialFailure: true }),
  })
  const j = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(j?.error?.details?.[0]?.errors?.[0]?.message || j?.error?.message || 'mutate HTTP ' + r.status)
  return j
}

export async function runAdsAgent() {
  return runLogged('google-ads', 'günlük analiz + otomatik düzeltme', async () => {
    const report = await buildAdsReport()
    const actions: string[] = []
    const at = await adsToken(process.env.GOOGLE_ADS_REFRESH_TOKEN || '')

    // ── 1. negative keywords from the last 7 days' search terms
    try {
      const [camps, existing] = await Promise.all([
        gaql(at, `SELECT campaign.resource_name, campaign.id FROM campaign WHERE ${CAMPAIGN_FILTER}`),
        gaql(at, `SELECT campaign_criterion.keyword.text FROM campaign_criterion WHERE ${CAMPAIGN_FILTER} AND campaign_criterion.negative = TRUE AND campaign_criterion.type = 'KEYWORD'`),
      ])
      const have = new Set(existing.map((e: any) => (e.campaignCriterion?.keyword?.text || '').toLowerCase()))
      const toAdd = new Set<string>()
      for (const t of report.searchTerms || []) {
        const s = String(t.term).toLowerCase()
        for (const w of COMPETITOR_NEG.concat(IRRELEVANT_NEG)) if (s.includes(w) && !have.has(w)) toAdd.add(w)
      }
      if (toAdd.size && camps.length) {
        const ops = camps.flatMap((c: any) => Array.from(toAdd).map(w => ({ create: { campaign: c.campaign.resourceName, negative: true, keyword: { text: w, matchType: w.includes(' ') ? 'PHRASE' : 'BROAD' } } })))
        await mutate(at, 'campaignCriteria', ops)
        actions.push(`Negatif kelime eklendi: ${Array.from(toAdd).join(', ')}`)
      }
    } catch (e: any) { actions.push('⚠️ Negatif kelime eklenemedi: ' + e.message) }

    // ── 2. pause expensive, low-quality keywords
    try {
      const kws = await gaql(at, `SELECT ad_group_criterion.resource_name, ad_group_criterion.keyword.text, ad_group_criterion.quality_info.quality_score, metrics.cost_micros, metrics.conversions, metrics.impressions FROM keyword_view WHERE ${CAMPAIGN_FILTER} AND ad_group_criterion.status = 'ENABLED' AND segments.date DURING LAST_30_DAYS`)
      const agg: Record<string, any> = {}
      for (const k of kws) {
        const rn = k.adGroupCriterion.resourceName
        const o = agg[rn] ||= { rn, text: k.adGroupCriterion.keyword.text, qs: k.adGroupCriterion.qualityInfo?.qualityScore, cost: 0, conv: 0, imp: 0 }
        o.cost += Number(k.metrics.costMicros || 0) / 1e6; o.conv += Number(k.metrics.conversions || 0); o.imp += Number(k.metrics.impressions || 0)
      }
      const bad = Object.values(agg).filter((k: any) => k.qs != null && k.qs <= 3 && k.cost >= 150 && k.conv === 0 && k.imp >= 50)
      if (bad.length) {
        await mutate(at, 'adGroupCriteria', bad.map((k: any) => ({ update: { resourceName: k.rn, status: 'PAUSED' }, updateMask: 'status' })))
        actions.push(`Kelime durduruldu (kalite ≤3, para yiyor, dönüşüm yok): ${bad.map((k: any) => `"${k.text}" (${Math.round(k.cost)} ₺)`).join(', ')}`)
      }
    } catch (e: any) { actions.push('⚠️ Kelime kontrolü yapılamadı: ' + e.message) }

    report.agentActions = actions
    await saveAdsReport(report)

    // ── 3. Telegram summary
    const k = report.kpis
    const crit = report.findings.filter((f: any) => f.severity === 'critical' || f.severity === 'serious').slice(0, 4)
    const msg = [
      `📊 <b>Google Ads ajanı</b> — ${esc(report.period.from)} → ${esc(report.period.to)}`,
      `Harcama ₺${Math.round(k.spend7)} · ${k.clicks7} tık · ${k.conv7} dönüşüm · dün ${k.clicksYesterday} tık / ₺${Math.round(k.spendYesterday)}`,
      report.summary ? `\n${esc(report.summary)}` : '',
      crit.length ? `\n<b>Öne çıkanlar</b>\n${crit.map((f: any) => '• ' + esc(f.title)).join('\n')}` : '',
      actions.length ? `\n<b>Bugün kendim yaptım</b>\n${actions.map(a => '✅ ' + esc(a)).join('\n')}` : '\nBugün otomatik değişiklik gerekmedi.',
      `\nDetay: atmosparagliding.com/admin/google-ads`,
    ].filter(Boolean).join('\n')
    await telegram(msg)

    return { findings: report.findings.length, actions, errors: report.errors }
  })
}
