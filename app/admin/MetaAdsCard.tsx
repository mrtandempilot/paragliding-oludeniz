'use client'

// Meta (Facebook/Instagram) reklam özeti — ana panel ve mobil uygulama için.
// Kendi verisini çeker: hesap durumu, borç, son 30 gün harcama/sonuç, aktif kampanyalar.
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Megaphone, AlertTriangle } from 'lucide-react'

const nf = (n: number, d = 0) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: d, minimumFractionDigits: d }).format(n)
const get = async (u: string) => { try { const r = await fetch(u, { credentials: 'include', cache: 'no-store' }); return r.ok ? await r.json() : null } catch { return null } }
const act = (actions: any[] | undefined, type: string) => Number((actions || []).find(a => a.action_type === type)?.value || 0)

const STATUS: Record<number, { label: string; ok: boolean }> = {
  1: { label: 'yayında', ok: true }, 2: { label: 'hesap kapalı', ok: false }, 3: { label: 'durdu — ödenmemiş borç', ok: false },
  7: { label: 'inceleniyor', ok: false }, 9: { label: 'ödeme süresi içinde', ok: false }, 100: { label: 'kapanıyor', ok: false }, 101: { label: 'kapalı', ok: false },
}

type Data = { status: number | null; debt: number; spend: number; impressions: number; clicks: number; messages: number; campaigns: { name: string; budget: number | null }[]; error?: boolean }

export default function MetaAdsCard({ dark = false, usdTry = null }: { dark?: boolean; usdTry?: number | null }) {
  const [d, setD] = useState<Data | null>(null)
  useEffect(() => {
    let live = true
    Promise.all([
      get('/api/admin/meta-ads?type=account'),
      get('/api/admin/meta-ads?type=insights&date_preset=last_30d'),
      get('/api/admin/meta-ads?type=campaigns'),
    ]).then(([acc, ins, camp]) => {
      if (!live) return
      if (!acc || acc.error) { setD({ status: null, debt: 0, spend: 0, impressions: 0, clicks: 0, messages: 0, campaigns: [], error: true }); return }
      const i = ins?.data?.[0] || {}
      const status = Number(acc.account_status)
      setD({
        status,
        debt: status === 3 || status === 9 ? Number(acc.balance || 0) / 100 : 0, // Meta tutarı kuruş gönderir
        spend: Number(i.spend || 0), impressions: Number(i.impressions || 0), clicks: Number(i.clicks || 0),
        messages: act(i.actions, 'onsite_conversion.messaging_conversation_started_7d'),
        campaigns: (camp?.data || []).filter((c: any) => c.status === 'ACTIVE')
          .map((c: any) => ({ name: String(c.name), budget: c.daily_budget ? Number(c.daily_budget) / 100 : null })),
      })
    })
    return () => { live = false }
  }, [])

  const t = dark
    ? { card: 'rounded-2xl border p-4', bg: { background: '#111A2E', borderColor: '#1E2A44' }, text: '#E8EEF7', muted: '#8A9BB8', dim: '#5E6F8C', green: '#22C55E', red: '#EF4444', redBg: 'rgba(239,68,68,.12)', line: '#1E2A44' }
    : { card: 'bg-white p-4 sm:p-5', bg: {}, text: '#0F172A', muted: '#475569', dim: '#64748B', green: '#0F766E', red: '#DC2626', redBg: '#FEF2F2', line: '#E2E8F0' }
  const st = d?.status != null ? STATUS[d.status] || { label: `durum ${d.status}`, ok: false } : null

  return (
    <div className={t.card} style={t.bg}>
      <div className="flex items-center justify-between gap-2 text-[12px]" style={{ color: t.muted }}>
        <span className="flex items-center gap-2"><Megaphone className="h-4 w-4" />Meta reklam, 30 gün</span>
        {st && <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ color: st.ok ? t.green : t.red, background: st.ok ? 'transparent' : t.redBg }}>{st.label}</span>}
      </div>
      {!d ? <div className="mt-3 text-[13px]" style={{ color: t.dim }}>yükleniyor…</div>
        : d.error ? <div className="mt-3 text-[13px]" style={{ color: t.red }}>Meta verisi alınamadı (token?)</div>
        : <>
          <div className="mt-2 text-[26px] font-light leading-none tabular-nums" style={{ color: t.text }}>
            ₺{nf(d.spend)}{usdTry ? <span className="text-[15px]" style={{ color: t.muted }}> ≈ ${nf(d.spend / usdTry)}</span> : null}
          </div>
          <div className="mt-2 text-[12px] tabular-nums" style={{ color: t.muted }}>{nf(d.impressions)} gösterim · {nf(d.clicks)} tıklama · {d.messages} mesaj</div>
          {d.debt > 0 && (
            <div className="mt-2 flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px] font-semibold" style={{ color: t.red, background: t.redBg }}>
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />Borç ₺{nf(d.debt, 2)} — ödenince reklam tekrar yayına girer
            </div>
          )}
          <div className="mt-2 text-[11px]" style={{ color: t.dim }}>
            {d.campaigns.length
              ? d.campaigns.map(c => `${c.name}${c.budget ? ` (₺${nf(c.budget)}/gün)` : ''}`).join(' · ')
              : 'aktif kampanya yok'}
            {' · '}<Link href="/admin/meta-ads" className="underline">Meta paneli</Link>
          </div>
        </>}
    </div>
  )
}
