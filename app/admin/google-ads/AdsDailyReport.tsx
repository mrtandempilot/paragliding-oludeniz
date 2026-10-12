'use client'

// Günlük Google Ads raporu — her sabah cron ile üretilir (/api/cron/ads-report),
// burada settings.ads_daily_report'tan okunup grafiklerle gösterilir.
// Renkler dataviz referans paletinden (kategorik sıra sabit, durum renkleri ayrı).

import { useEffect, useMemo, useState } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { Loader2, RefreshCw, AlertOctagon, AlertTriangle, Info, CheckCircle2, Sparkles, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const C = {
  s1: '#2a78d6', // blue
  s2: '#eb6834', // orange
  s3: '#1baf7a', // aqua
  grid: '#e1e0d9',
  axis: '#898781',
  ink: '#0b0b0b',
  ink2: '#52514e',
  surface: '#fcfcfb',
}
const SEV = {
  critical: { color: '#d03b3b', bg: 'bg-red-50', ring: 'ring-red-200', label: 'Kritik', Icon: AlertOctagon },
  serious: { color: '#ec835a', bg: 'bg-orange-50', ring: 'ring-orange-200', label: 'Ciddi', Icon: AlertTriangle },
  warning: { color: '#c98500', bg: 'bg-amber-50', ring: 'ring-amber-200', label: 'Uyarı', Icon: Info },
  good: { color: '#0ca30c', bg: 'bg-green-50', ring: 'ring-green-200', label: 'İyi', Icon: CheckCircle2 },
} as const
const FLAG: Record<string, { label: string; cls: string }> = {
  ok: { label: 'Doğru kitle', cls: 'bg-slate-100 text-slate-700' },
  turkish: { label: 'Türkçe', cls: 'bg-amber-100 text-amber-900' },
  competitor: { label: 'Rakip', cls: 'bg-red-100 text-red-800' },
  irrelevant: { label: 'Alakasız', cls: 'bg-red-100 text-red-800' },
  russian: { label: 'Rusça', cls: 'bg-sky-100 text-sky-800' },
  chinese: { label: 'Çince', cls: 'bg-sky-100 text-sky-800' },
}
const QSL: Record<string, string> = { ABOVE_AVERAGE: 'Ort. üstü', AVERAGE: 'Ortalama', BELOW_AVERAGE: 'Ort. altı' }

const tl = (v: number | null | undefined, dec = 0) => v == null ? '–' : '₺' + Number(v).toLocaleString('tr-TR', { maximumFractionDigits: dec, minimumFractionDigits: dec })
const num = (v: number | null | undefined) => v == null ? '–' : Number(v).toLocaleString('tr-TR', { maximumFractionDigits: 1 })
const pct = (v: number | null | undefined, dec = 0) => v == null ? '–' : '%' + (v * 100).toFixed(dec)
const shortDate = (d: string) => { const [, m, day] = d.split('-'); return `${Number(day)}.${Number(m)}` }

function Card({ title, sub, children, className = '' }: { title: string; sub?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`bg-white rounded-2xl ring-1 ring-black/10 p-5 ${className}`}>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

function Stat({ label, value, delta, goodWhenUp = true, hint }: { label: string; value: string; delta?: number | null; goodWhenUp?: boolean; hint?: string }) {
  const showDelta = delta != null && isFinite(delta)
  const up = (delta || 0) >= 0
  const good = up === goodWhenUp
  return (
    <div className="bg-white rounded-2xl ring-1 ring-black/10 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-slate-900 mt-1">{value}</p>
      {showDelta ? (
        <p className={`text-xs mt-1 inline-flex items-center gap-0.5 ${good ? 'text-[#006300]' : 'text-[#b42318]'}`}>
          {up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {(delta! * 100).toFixed(0)}% <span className="text-slate-500 ml-1">önceki 7 güne göre</span>
        </p>
      ) : hint ? <p className="text-xs text-slate-500 mt-1">{hint}</p> : null}
    </div>
  )
}

function Tip({ active, payload, label, fmt }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-lg shadow-lg ring-1 ring-black/10 px-3 py-2 text-xs">
      <p className="text-slate-500 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="flex items-center gap-2">
          <span className="inline-block w-3 h-[2px]" style={{ background: p.color || p.fill }} />
          <span className="font-semibold text-slate-900">{fmt ? fmt(p.value, p.dataKey) : p.value}</span>
          <span className="text-slate-500">{p.name}</span>
        </p>
      ))}
    </div>
  )
}

const axisProps = { tick: { fill: C.axis, fontSize: 11 }, axisLine: { stroke: '#c3c2b7' }, tickLine: false }

export default function AdsDailyReport() {
  const [data, setData] = useState<{ report: any; history: any[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [err, setErr] = useState('')

  async function load(method: 'GET' | 'POST' = 'GET') {
    method === 'POST' ? setRefreshing(true) : setLoading(true)
    setErr('')
    try {
      const r = await fetch('/api/admin/ads-report', { method, cache: 'no-store' })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Hata')
      setData(j)
    } catch (e: any) { setErr(e.message) } finally { setLoading(false); setRefreshing(false) }
  }
  useEffect(() => { load() }, [])

  const rep = data?.report
  const isData = useMemo(() => (rep?.daily || []).map((d: any) => ({
    date: shortDate(d.date),
    won: d.is != null ? +(d.is * 100).toFixed(1) : 0,
    rank: d.lostRank != null ? +(d.lostRank * 100).toFixed(1) : 0,
    budget: d.lostBudget != null ? +(d.lostBudget * 100).toFixed(1) : 0,
  })), [rep])
  const daily = useMemo(() => (rep?.daily || []).map((d: any) => ({ ...d, label: shortDate(d.date) })), [rep])

  if (loading) return <div className="flex items-center gap-2 text-slate-500 py-16 justify-center"><Loader2 className="w-5 h-5 animate-spin" /> Rapor yükleniyor…</div>
  if (err && !rep) return <div className="p-6 bg-red-50 text-red-800 rounded-xl text-sm">{err}</div>
  if (!rep) return (
    <div className="p-8 bg-white rounded-2xl ring-1 ring-black/10 text-center space-y-3">
      <p className="text-slate-700">Henüz rapor üretilmedi. Her sabah 07:00'de otomatik oluşur.</p>
      <button onClick={() => load('POST')} disabled={refreshing} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm">
        {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Şimdi oluştur
      </button>
    </div>
  )

  const k = rep.kpis
  const d = (a: number, b: number) => (b ? (a - b) / b : null)
  const ga = rep.ga4
  const funnelMax = ga?.funnel?.[0]?.value || 1
  const bucketRows = Object.entries(rep.termBuckets || {}).map(([f, b]: any) => ({ flag: FLAG[f]?.label || f, impressions: b.impressions, cost: b.cost, count: b.count })).sort((a: any, b: any) => b.impressions - a.impressions)
  const gen = new Date(rep.generatedAt)

  return (
    <div className={`space-y-6 transition-opacity ${refreshing ? 'opacity-50' : ''}`}>
      {/* header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500">Son 7 gün · {rep.period.from} → {rep.period.to} · rapor {gen.toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' })}</p>
          <p className="text-xs text-slate-500">{(rep.campaigns || []).map((c: any) => `${c.name} · ${tl(c.budget)}/gün · ${c.bidding === 'TARGET_SPEND' ? 'Tıklamaları artır' : c.bidding}`).join(' | ')}</p>
        </div>
        <button onClick={() => load('POST')} disabled={refreshing} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl ring-1 ring-black/10 bg-white hover:bg-slate-50 text-sm text-slate-700">
          {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Şimdi yenile
        </button>
      </div>

      {/* AI summary */}
      {rep.summary && (
        <section className="rounded-2xl p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-300 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Bugünün özeti</p>
          <p className="mt-2 text-[15px] leading-relaxed text-white/95 whitespace-pre-line">{rep.summary}</p>
        </section>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <Stat label="Harcama (7g)" value={tl(k.spend7)} delta={d(k.spend7, k.spendPrev7)} goodWhenUp={false} />
        <Stat label="Tıklama" value={num(k.clicks7)} delta={d(k.clicks7, k.clicksPrev7)} />
        <Stat label="Dönüşüm" value={num(k.conv7)} delta={d(k.conv7, k.convPrev7)} hint={k.cpa7 ? `Dönüşüm başı ${tl(k.cpa7)}` : 'WhatsApp + tel + form'} />
        <Stat label="Tıklanma oranı" value={pct(k.ctr7, 1)} hint="Hedef %6-8" />
        <Stat label="Ort. tıklama maliyeti" value={tl(k.cpc7, 1)} hint={`Dün ${tl(k.spendYesterday)} · ${k.clicksYesterday} tık`} />
        <Stat label="Gösterim payı" value={pct(k.is7)} hint={`En üstte ${pct(k.absTop7)}`} />
      </div>

      {/* findings */}
      <Card title="Bulgular ve yapılacaklar" sub="Önem sırasına göre. Her sabah yeniden hesaplanır.">
        <ul className="space-y-2">
          {rep.findings.map((f: any, i: number) => {
            const s = SEV[f.severity as keyof typeof SEV]
            return (
              <li key={i} className={`flex gap-3 rounded-xl p-3 ${s.bg} ring-1 ${s.ring}`}>
                <s.Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: s.color }} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    <span className="text-[11px] font-bold uppercase tracking-wide mr-2 text-slate-600">{s.label}</span>{f.title}
                  </p>
                  <p className="text-sm text-slate-700 mt-0.5 break-words">{f.detail}</p>
                  {f.action && <p className="text-sm text-slate-900 mt-1">→ {f.action}</p>}
                </div>
              </li>
            )
          })}
          {!rep.findings.length && <li className="text-sm text-slate-500">Bulgu yok.</li>}
        </ul>
      </Card>

      {rep.agentActions && (
        <Card title="Reklam ajanı bugün ne yaptı?" sub="Güvenli, geri alınabilir değişiklikleri kendisi yapar. Bütçe ve teklife dokunmaz.">
          <ul className="space-y-1.5 text-sm">
            {rep.agentActions.length ? rep.agentActions.map((x: string, i: number) => <li key={i} className="text-slate-800">✅ {x}</li>) : <li className="text-slate-500">Bugün otomatik değişiklik gerekmedi.</li>}
          </ul>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Günlük harcama" sub="Son 30 gün, TL">
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={daily} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
                <CartesianGrid stroke={C.grid} vertical={false} />
                <XAxis dataKey="label" {...axisProps} minTickGap={16} />
                <YAxis {...axisProps} width={44} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} content={<Tip fmt={(v: number) => tl(v)} />} />
                <Bar dataKey="cost" name="Harcama" fill={C.s1} radius={[4, 4, 0, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Günlük tıklama ve dönüşüm" sub="Son 30 gün">
          <div className="h-56">
            <ResponsiveContainer>
              <LineChart data={daily} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke={C.grid} vertical={false} />
                <XAxis dataKey="label" {...axisProps} minTickGap={16} />
                <YAxis {...axisProps} width={36} allowDecimals={false} />
                <Tooltip content={<Tip />} />
                <Legend iconType="plainline" wrapperStyle={{ fontSize: 12, color: C.ink2 }} />
                <Line type="linear" dataKey="clicks" name="Tıklama" stroke={C.s1} strokeWidth={2} dot={false} activeDot={{ r: 4, stroke: C.surface, strokeWidth: 2 }} />
                <Line type="linear" dataKey="conversions" name="Dönüşüm" stroke={C.s2} strokeWidth={2} dot={false} activeDot={{ r: 4, stroke: C.surface, strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="Gösterim payı: ne kadarını kazanıyoruz?" sub="Reklamın çıkabileceği aramaların yüzdesi. Turuncu: rakipler sıralamada önde. Yeşil: bütçe bitti.">
        <div className="h-60">
          <ResponsiveContainer>
            <BarChart data={isData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid stroke={C.grid} vertical={false} />
              <XAxis dataKey="date" {...axisProps} minTickGap={16} />
              <YAxis {...axisProps} width={52} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={(v) => `%${v}`} />
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} content={<Tip fmt={(v: number) => `%${v}`} />} />
              <Legend iconType="square" wrapperStyle={{ fontSize: 12, color: C.ink2 }} />
              <Bar dataKey="won" name="Kazanılan" stackId="a" fill={C.s1} maxBarSize={24} stroke={C.surface} strokeWidth={2} />
              <Bar dataKey="rank" name="Sıralama kaybı" stackId="a" fill={C.s2} maxBarSize={24} stroke={C.surface} strokeWidth={2} />
              <Bar dataKey="budget" name="Bütçe kaybı" stackId="a" fill={C.s3} maxBarSize={24} radius={[4, 4, 0, 0]} stroke={C.surface} strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Reklamdan gelenler sitede ne yapıyor?" sub={ga ? `Google Analytics · son 7 gün · ${ga.sessions} ziyaret · ort. ${Math.round(ga.avgDuration)} sn` : 'GA4 verisi alınamadı'}>
          {ga ? (
            <div className="space-y-2.5">
              {ga.funnel.map((f: any) => (
                <div key={f.step} className="grid grid-cols-[110px_1fr_40px] items-center gap-3 text-sm">
                  <span className="text-slate-600">{f.step}</span>
                  <div className="h-5 rounded bg-[#e8f0fb]">
                    <div className="h-5 rounded-r" style={{ width: `${Math.max(1.5, (f.value / funnelMax) * 100)}%`, background: C.s1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} />
                  </div>
                  <span className="text-right font-semibold text-slate-900 tabular-nums">{f.value}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-slate-500">–</p>}
        </Card>
        <Card title="Saatlere göre tıklama" sub="Son 30 gün, Türkiye saati">
          <div className="h-52">
            <ResponsiveContainer>
              <BarChart data={rep.hourly} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid stroke={C.grid} vertical={false} />
                <XAxis dataKey="hour" {...axisProps} interval={2} tickFormatter={(h) => `${h}:00`} />
                <YAxis {...axisProps} width={32} allowDecimals={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} content={<Tip />} labelFormatter={(h: any) => `${h}:00`} />
                <Bar dataKey="clicks" name="Tıklama" fill={C.s1} radius={[4, 4, 0, 0]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card title="Kimler tıklıyor? (ülke)" sub="Son 7 gün, kullanıcının bulunduğu yer">
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-slate-500 text-left"><th className="pb-2 font-medium">Ülke</th><th className="pb-2 font-medium text-right">Tık</th><th className="pb-2 font-medium text-right">TL</th></tr></thead>
            <tbody className="tabular-nums">
              {(rep.geo || []).map((g: any) => (
                <tr key={g.country} className="border-t border-slate-100"><td className="py-1.5 text-slate-800">{g.country}</td><td className="text-right">{g.clicks}</td><td className="text-right">{tl(g.cost)}</td></tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="Cihaz" sub="Son 30 gün">
          <div className="h-44">
            <ResponsiveContainer>
              <BarChart layout="vertical" data={(rep.devices || []).map((x: any) => ({ ...x, device: x.device === 'MOBILE' ? 'Telefon' : x.device === 'DESKTOP' ? 'Bilgisayar' : x.device === 'TABLET' ? 'Tablet' : x.device }))} margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                <CartesianGrid stroke={C.grid} horizontal={false} />
                <XAxis type="number" {...axisProps} allowDecimals={false} />
                <YAxis type="category" dataKey="device" {...axisProps} width={72} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} content={<Tip />} />
                <Bar dataKey="clicks" name="Tıklama" fill={C.s1} radius={[0, 4, 4, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Arama terimleri kime gidiyor?" sub="Son 7 gün, gösterim">
          <div className="h-44">
            <ResponsiveContainer>
              <BarChart layout="vertical" data={bucketRows} margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                <CartesianGrid stroke={C.grid} horizontal={false} />
                <XAxis type="number" {...axisProps} allowDecimals={false} />
                <YAxis type="category" dataKey="flag" {...axisProps} width={84} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} content={<Tip />} />
                <Bar dataKey="impressions" name="Gösterim" fill={C.s1} radius={[0, 4, 4, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="Anahtar kelimeler" sub="Son 30 gün. Kalite puanı 1-10; 4 ve altı pahalı ve zayıf.">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead><tr className="text-xs text-slate-500 text-left">
              <th className="pb-2 font-medium">Kelime</th><th className="pb-2 font-medium">Durum</th><th className="pb-2 font-medium">Kalite</th>
              <th className="pb-2 font-medium">Beklenen TO</th><th className="pb-2 font-medium">Açılış sayfası</th>
              <th className="pb-2 font-medium text-right">Gösterim</th><th className="pb-2 font-medium text-right">Tık</th><th className="pb-2 font-medium text-right">TL</th>
            </tr></thead>
            <tbody className="tabular-nums">
              {(rep.keywords || []).map((kw: any) => (
                <tr key={kw.text + kw.match} className={`border-t border-slate-100 ${kw.status !== 'ENABLED' ? 'text-slate-400' : 'text-slate-800'}`}>
                  <td className="py-1.5">{kw.text} <span className="text-[10px] text-slate-400">{kw.match === 'EXACT' ? '[tam]' : kw.match === 'PHRASE' ? '"öbek"' : kw.match}</span></td>
                  <td>{kw.status === 'ENABLED' ? 'Açık' : 'Durdu'}</td>
                  <td>
                    {kw.qs == null ? '–' : (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-14 h-1.5 rounded-full bg-slate-100 overflow-hidden"><span className="block h-full rounded-full" style={{ width: `${kw.qs * 10}%`, background: kw.qs <= 4 ? '#d03b3b' : kw.qs <= 6 ? '#fab219' : '#0ca30c' }} /></span>
                        {kw.qs}
                      </span>
                    )}
                  </td>
                  <td className="text-xs">{QSL[kw.ctrPred] || '–'}</td>
                  <td className="text-xs">{QSL[kw.lp] || '–'}</td>
                  <td className="text-right">{kw.impressions}</td><td className="text-right">{kw.clicks}</td><td className="text-right">{tl(kw.cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Arama terimleri" sub="İnsanların gerçekte yazdığı, son 7 gün">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white"><tr className="text-xs text-slate-500 text-left"><th className="pb-2 font-medium">Terim</th><th className="pb-2 font-medium">Tür</th><th className="pb-2 font-medium text-right">Gös.</th><th className="pb-2 font-medium text-right">Tık</th><th className="pb-2 font-medium text-right">TL</th></tr></thead>
              <tbody className="tabular-nums">
                {(rep.searchTerms || []).map((t: any) => (
                  <tr key={t.term} className="border-t border-slate-100">
                    <td className="py-1.5 text-slate-800 break-words">{t.term}</td>
                    <td><span className={`text-[11px] px-1.5 py-0.5 rounded ${FLAG[t.flag]?.cls}`}>{FLAG[t.flag]?.label}</span></td>
                    <td className="text-right">{t.impressions}</td><td className="text-right">{t.clicks}</td><td className="text-right">{tl(t.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <div className="space-y-6">
          <Card title="Reklam başlıkları" sub="Google'ın en çok gösterdikleri, son 30 gün">
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart layout="vertical" data={(rep.headlines || []).filter((h: any) => h.type === 'HEADLINE').slice(0, 10)} margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                  <CartesianGrid stroke={C.grid} horizontal={false} />
                  <XAxis type="number" {...axisProps} allowDecimals={false} />
                  <YAxis type="category" dataKey="text" {...axisProps} width={170} tick={{ fill: C.ink2, fontSize: 11 }} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} content={<Tip />} />
                  <Bar dataKey="impressions" name="Gösterim" fill={C.s1} radius={[0, 4, 4, 0]} maxBarSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 mt-2">Reklam gücü: <b className="text-slate-800">{rep.ad?.strength === 'AVERAGE' ? 'Ortalama' : rep.ad?.strength === 'POOR' ? 'Zayıf' : rep.ad?.strength === 'GOOD' ? 'İyi' : rep.ad?.strength === 'EXCELLENT' ? 'Mükemmel' : rep.ad?.strength || '–'}</b> · Eklentiler: {Object.entries(rep.assetCounts || {}).map(([k, v]) => `${k.toLowerCase()} ${v}`).join(', ')}</p>
          </Card>
          {ga?.sources && (
            <Card title="Site trafiği nereden geliyor?" sub="Tüm kaynaklar, son 7 gün">
              <table className="w-full text-sm">
                <thead><tr className="text-xs text-slate-500 text-left"><th className="pb-2 font-medium">Kaynak</th><th className="pb-2 font-medium text-right">Ziyaret</th><th className="pb-2 font-medium text-right">Ort. sn</th><th className="pb-2 font-medium text-right">Dönüşüm</th></tr></thead>
                <tbody className="tabular-nums">
                  {ga.sources.map((s: any) => (
                    <tr key={s.source} className="border-t border-slate-100"><td className="py-1.5 text-slate-800">{s.source}</td><td className="text-right">{s.sessions}</td><td className="text-right">{s.avgDuration}</td><td className="text-right">{s.keyEvents}</td></tr>
                  ))}
                </tbody>
              </table>
              {rep.bookings7 != null && <p className="text-xs text-slate-500 mt-2">Sitedeki toplam form rezervasyonu (7g): <b className="text-slate-800">{rep.bookings7}</b></p>}
            </Card>
          )}
        </div>
      </div>

      {rep.errors?.length > 0 && (
        <div className="text-xs text-amber-900 bg-amber-50 ring-1 ring-amber-200 rounded-xl p-3">
          <b>Bazı veriler alınamadı:</b> {rep.errors.join(' · ')}
        </div>
      )}
    </div>
  )
}
