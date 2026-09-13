export const dynamic = 'force-dynamic'
export const revalidate = 0

import {
  Search, TrendingUp, TrendingDown, FileText, AlertTriangle,
  MapPin, Link2, Users, Clock,
} from 'lucide-react'
import TrendChart from './TrendChart'

const GSC_SITE_URL = 'sc-domain:atmosparagliding.com'

async function getAccessToken(): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID || '',
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET || '',
      refresh_token: process.env.GOOGLE_SEO_REFRESH_TOKEN || '',
      grant_type: 'refresh_token',
    }),
    cache: 'no-store',
  })
  const text = await res.text()
  let data: any
  try { data = JSON.parse(text) } catch {
    throw new Error(`OAuth yanıtı JSON değil (HTTP ${res.status})`)
  }
  if (!data.access_token) {
    throw new Error(data.error_description || data.error || 'Token alınamadı')
  }
  return data.access_token
}

function isoDaysAgo(days: number) {
  return new Date(Date.now() - days * 86400000).toISOString().slice(0, 10)
}

async function queryGSC(
  accessToken: string,
  startDate: string,
  endDate: string,
  dimensions: string[] = [],
  rowLimit = 10
) {
  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE_URL)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate, endDate, dimensions, rowLimit }),
      cache: 'no-store',
    }
  )
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message || `HTTP ${res.status}`)
  return (data.rows || []) as any[]
}

function fmt(n: number) {
  return n.toLocaleString('tr-TR', { maximumFractionDigits: 0 })
}

function Delta({ current, previous }: { current: number; previous: number }) {
  if (previous === 0) return null
  const pct = ((current - previous) / previous) * 100
  const up = pct >= 0
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${up ? 'text-green-600' : 'text-red-600'}`}>
      {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {Math.abs(pct).toFixed(0)}%
    </span>
  )
}

export default async function AnalyzePage() {
  let totals7d = { clicks: 0, impressions: 0, ctr: 0, position: 0 }
  let totalsPrev7d = { clicks: 0, impressions: 0, ctr: 0, position: 0 }
  let totals28d = { clicks: 0, impressions: 0, ctr: 0, position: 0 }
  let topQueries: any[] = []
  let topPages: any[] = []
  let dailyRows: { date: string; impressions: number }[] = []
  let gscError: string | null = null

  try {
    const accessToken = await getAccessToken()

    const sumRow = (rows: any[]) => rows[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 }

    const [r7, rPrev7, r28, qRows, pRows, dateRows] = await Promise.all([
      queryGSC(accessToken, isoDaysAgo(10), isoDaysAgo(3), []),
      queryGSC(accessToken, isoDaysAgo(17), isoDaysAgo(10), []),
      queryGSC(accessToken, isoDaysAgo(31), isoDaysAgo(3), []),
      queryGSC(accessToken, isoDaysAgo(31), isoDaysAgo(3), ['query'], 10),
      queryGSC(accessToken, isoDaysAgo(31), isoDaysAgo(3), ['page'], 10),
      queryGSC(accessToken, isoDaysAgo(180), isoDaysAgo(3), ['date'], 1000),
    ])

    totals7d = sumRow(r7)
    totalsPrev7d = sumRow(rPrev7)
    totals28d = sumRow(r28)
    topQueries = qRows
    topPages = pRows

    dailyRows = dateRows
      .map((row: any) => ({ date: row.keys[0], impressions: row.impressions || 0 }))
      .sort((a: any, b: any) => a.date.localeCompare(b.date))
  } catch (err: any) {
    gscError = err.message || 'Search Console verisi alınamadı'
  }


  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Analiz</h1>
        <p className="text-slate-500 mt-1">Google arama performansı, rakipler ve fırsatlar</p>
      </div>

      {gscError && (
        <div className="flex items-start gap-2 bg-red-50 text-red-700 text-sm rounded-xl p-4 mb-5">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>Search Console verisi alınamadı: {gscError}</span>
        </div>
      )}

      {/* Summary row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wide mb-3">
            <Search className="w-3.5 h-3.5" /> Son 7 Gün (önceki 7 güne göre)
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-slate-900">{fmt(totals7d.impressions)}</span>
                <Delta current={totals7d.impressions} previous={totalsPrev7d.impressions} />
              </div>
              <div className="text-xs text-slate-500">Gösterim</div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-slate-900">{fmt(totals7d.clicks)}</span>
                <Delta current={totals7d.clicks} previous={totalsPrev7d.clicks} />
              </div>
              <div className="text-xs text-slate-500">Tıklama</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wide mb-3">
            <TrendingUp className="w-3.5 h-3.5" /> Son 28 Gün
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-2xl font-bold text-slate-900">{fmt(totals28d.impressions)}</div>
              <div className="text-xs text-slate-500">Gösterim</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{fmt(totals28d.clicks)}</div>
              <div className="text-xs text-slate-500">Tıklama</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wide mb-3">
            <Clock className="w-3.5 h-3.5" /> Ortalama Sıra & CTR (7g)
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-2xl font-bold text-slate-900">{totals7d.position.toFixed(1)}</div>
              <div className="text-xs text-slate-500">Ort. sıra</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{(totals7d.ctr * 100).toFixed(1)}%</div>
              <div className="text-xs text-slate-500">CTR</div>
            </div>
          </div>
        </div>
      </div>

      {/* Migration recovery trend */}
      <TrendChart rows={dailyRows} />

      {/* Top queries / pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wide mb-4">
            <Search className="w-3.5 h-3.5" /> En Çok Tıklanan Aramalar (28g)
          </div>
          {topQueries.length > 0 ? (
            <div className="space-y-2">
              {topQueries.map((row, i) => (
                <div key={i} className="flex items-center justify-between text-sm gap-3">
                  <span className="text-slate-700 truncate">{row.keys[0]}</span>
                  <div className="flex items-center gap-3 flex-shrink-0 text-xs">
                    <span className="text-slate-900 font-semibold">{row.clicks} tık</span>
                    <span className="text-slate-400">{fmt(row.impressions)} göst.</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-400 text-sm py-6 text-center">Veri yok</div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wide mb-4">
            <FileText className="w-3.5 h-3.5" /> En Çok Tıklanan Sayfalar (28g)
          </div>
          {topPages.length > 0 ? (
            <div className="space-y-2">
              {topPages.map((row, i) => (
                <div key={i} className="flex items-center justify-between text-sm gap-3">
                  <span className="text-slate-700 truncate">{row.keys[0].replace('https://www.atmosparagliding.com', '') || '/'}</span>
                  <div className="flex items-center gap-3 flex-shrink-0 text-xs">
                    <span className="text-slate-900 font-semibold">{row.clicks} tık</span>
                    <span className="text-slate-400">{fmt(row.impressions)} göst.</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-400 text-sm py-6 text-center">Veri yok</div>
          )}
        </div>
      </div>

      {/* Static / research-based cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 text-amber-600 text-xs font-semibold uppercase tracking-wide mb-3">
            <MapPin className="w-3.5 h-3.5" /> Google Business Profile
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            Aktif/doğrulanmış bir GBP bulunamadı — Haritalar'da isim, telefon veya yakın aramalarda
            hiç çıkmıyorsun. Video doğrulaması bekleniyor. Doğrulanana kadar Haritalar ve
            &quot;yakınımda paragliding&quot; aramalarında görünürlük sıfır.
          </p>
          <p className="text-[11px] text-slate-400 mt-3">Kontrol: 13 Eyl 2026</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wide mb-3">
            <Users className="w-3.5 h-3.5" /> Rakip Durumu
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            Bölgede United Pilots (3.745 yorum) baskın oyuncu. Ama en güçlü rakibin bile backlink
            profili zayıf (20 referring domain) — bu nicede geri bağlantı değil, GBP/yorum hacmi ve
            bulunabilirlik asıl belirleyici sinyal.
          </p>
          <p className="text-[11px] text-slate-400 mt-3">OpenSEO araştırması: 3 Eyl 2026</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wide mb-3">
            <Link2 className="w-3.5 h-3.5" /> Backlink Profili
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            Sadece 11 backlink / 11 referring domain — çok zayıf. Rakiplere göre bile düşük, ama bu
            nişte belirleyici faktör değil. Öncelik sırası: önce GBP ve yorumlar, backlink sonra.
          </p>
          <p className="text-[11px] text-slate-400 mt-3">Ahrefs verisi: 3 Eyl 2026</p>
        </div>
      </div>
    </div>
  )
}
