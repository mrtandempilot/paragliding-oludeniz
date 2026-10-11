// Server-side tool runner for the Neslihan voice assistant.
// Each tool returns a compact `result` (what the model reads) and a
// `display` (what the live screen renders next to the conversation).

import { getSupabase, istanbulDate, getSearchConsole, getBabadagWindLadder, getBabadagForecast } from '@/lib/admin/dashboard-data'
import { listEmails, readEmail, type MailFolder } from './gmail'
import { addMemory, completeMemory, loadMemory, type MemoryKind } from './memory'
import { diagnoseBookings, competitorCheck, deepAnalysis } from './advisor'

export type DisplayStat = { label: string; value: string; hint?: string; tone?: 'good' | 'bad' | 'warn' }
export type DisplayChart = { kind: 'bar' | 'line'; label: string; points: { x: string; y: number }[] }
export type DisplayTable = { columns: string[]; rows: (string | number)[][] }
export type Display = {
  title: string
  subtitle?: string
  stats?: DisplayStat[]
  chart?: DisplayChart
  table?: DisplayTable
  note?: string
}
export type ToolOutput = { result: unknown; display: Display | null }

// Lets tools reuse the existing admin API routes (same auth cookie).
export type ToolContext = { origin: string; cookie: string }

const fmt = (n: number, d = 0) => (Number.isFinite(n) ? n.toLocaleString('tr-TR', { maximumFractionDigits: d, minimumFractionDigits: d }) : '—')
const dayLabel = (iso: string) => {
  const [, m, d] = iso.slice(0, 10).split('-')
  return `${d}.${m}`
}
const STATUS_TR: Record<string, string> = { pending: 'Onay bekliyor', confirmed: 'Onaylı', completed: 'Uçuldu', cancelled: 'İptal' }
const TYPE_TR: Record<string, string> = { standard: 'Standard', high: 'High Altitude', sunset: 'Sunset' }
const isDate = (s: unknown): s is string => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s)

async function adminApi(ctx: ToolContext, path: string) {
  const r = await fetch(`${ctx.origin}${path}`, { headers: { cookie: ctx.cookie }, cache: 'no-store' })
  const d = await r.json().catch(() => ({}))
  if (!r.ok || d?.error) throw new Error(d?.error || `HTTP ${r.status}`)
  return d
}

async function getBookings(args: any): Promise<ToolOutput> {
  const from = isDate(args?.from) ? args.from : istanbulDate(0)
  const to = isDate(args?.to) ? args.to : new Date(Date.parse(from) + 7 * 86400000).toISOString().slice(0, 10)
  const status = typeof args?.status === 'string' ? args.status : 'all'
  let q = getSupabase()
    .from('bookings')
    .select('id,first_name,last_name,flight_date,flight_type,guests,total_price,status,phone,notes')
    .gte('flight_date', from)
    .lte('flight_date', to)
    .order('flight_date', { ascending: true })
    .limit(60)
  q = status === 'all' ? q.neq('status', 'cancelled') : q.eq('status', status)
  const { data, error } = await q
  if (error) throw new Error(error.message)
  const rows = data || []
  const guests = rows.reduce((s, b: any) => s + (b.guests || 1), 0)
  const pending = rows.filter((b: any) => b.status === 'pending').length
  const revenue = rows.reduce((s, b: any) => s + (Number(b.total_price) || 0), 0)
  return {
    result: {
      from, to, status, count: rows.length, guests, pending, revenue_usd: revenue,
      bookings: rows.map((b: any) => ({
        id: b.id, name: `${b.first_name || ''} ${b.last_name || ''}`.trim(), date: String(b.flight_date).slice(0, 10),
        type: b.flight_type, guests: b.guests || 1, price_usd: Number(b.total_price) || 0, status: b.status,
        phone: b.phone || null, notes: b.notes || null,
      })),
    },
    display: {
      title: from === to ? `Rezervasyonlar · ${dayLabel(from)}` : `Rezervasyonlar · ${dayLabel(from)} – ${dayLabel(to)}`,
      subtitle: status === 'all' ? 'İptaller hariç' : STATUS_TR[status] || status,
      stats: [
        { label: 'Rezervasyon', value: fmt(rows.length) },
        { label: 'Kişi', value: fmt(guests) },
        { label: 'Onay bekleyen', value: fmt(pending), tone: pending ? 'warn' : 'good' },
        { label: 'Tutar', value: `$${fmt(revenue)}` },
      ],
      table: {
        columns: ['Tarih', 'İsim', 'Uçuş', 'Kişi', 'Durum', 'Telefon'],
        rows: rows.map((b: any) => [
          dayLabel(String(b.flight_date)), `${b.first_name || ''} ${b.last_name || ''}`.trim(),
          TYPE_TR[b.flight_type] || b.flight_type || '—', b.guests || 1, STATUS_TR[b.status] || b.status, b.phone || '—',
        ]),
      },
    },
  }
}

async function getBookingStats(args: any): Promise<ToolOutput> {
  const days = Math.min(365, Math.max(1, Number(args?.days) || 30))
  const since = new Date(Date.now() - days * 86400000).toISOString()
  const { data, error } = await getSupabase()
    .from('bookings')
    .select('flight_type,guests,total_price,status,created_at')
    .gte('created_at', since)
    .limit(2000)
  if (error) throw new Error(error.message)
  const all = data || []
  const live = all.filter((b: any) => b.status !== 'cancelled')
  const byStatus: Record<string, number> = {}
  for (const b of all) byStatus[b.status] = (byStatus[b.status] || 0) + 1
  const byType: Record<string, number> = {}
  for (const b of live) byType[b.flight_type || 'standard'] = (byType[b.flight_type || 'standard'] || 0) + (b.guests || 1)
  const perDay: Record<string, number> = {}
  for (let i = days - 1; i >= 0; i--) perDay[istanbulDate(-i)] = 0
  for (const b of live) {
    const d = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul' }).format(new Date(b.created_at))
    if (d in perDay) perDay[d]++
  }
  const guests = live.reduce((s, b: any) => s + (b.guests || 1), 0)
  const revenue = live.reduce((s, b: any) => s + (Number(b.total_price) || 0), 0)
  return {
    result: { days, bookings: live.length, cancelled: byStatus.cancelled || 0, guests, revenue_usd: revenue, by_status: byStatus, guests_by_type: byType, per_day: perDay },
    display: {
      title: `Rezervasyon özeti · son ${days} gün`,
      stats: [
        { label: 'Yeni rezervasyon', value: fmt(live.length) },
        { label: 'Kişi', value: fmt(guests) },
        { label: 'Ciro', value: `$${fmt(revenue)}` },
        { label: 'İptal', value: fmt(byStatus.cancelled || 0), tone: byStatus.cancelled ? 'bad' : undefined },
      ],
      chart: { kind: 'bar', label: 'Günlük yeni rezervasyon', points: Object.entries(perDay).map(([x, y]) => ({ x: dayLabel(x), y })) },
      table: { columns: ['Uçuş tipi', 'Kişi'], rows: Object.entries(byType).map(([t, n]) => [TYPE_TR[t] || t, n]) },
    },
  }
}

const compass = (deg: number | null) => {
  if (deg == null || !Number.isFinite(deg)) return '—'
  return ['K', 'KD', 'D', 'GD', 'G', 'GB', 'B', 'KB'][Math.round(deg / 45) % 8]
}

// Rough flyability for a tandem hour; Ceyhun Bey makes the real call.
function flyable(h: any) {
  const t = h.takeoff.speed, g = h.beach.gust ?? h.beach.speed ?? 0, rain = h.rainChance ?? 0
  if (t > 25 || g > 30 || rain >= 60) return 'bad'
  if (t > 18 || g > 22 || rain >= 30) return 'warn'
  return 'good'
}
const FLY_TR: Record<string, string> = { good: 'Uygun', warn: 'Dikkat', bad: 'Uygun değil' }

async function getWeatherForecast(date: string): Promise<ToolOutput> {
  const f = await getBabadagForecast(date)
  if (!f.hours.length) throw new Error(`${date} için tahmin yok (en fazla 7 gün ileri)`)
  const r = (n: number | null) => (n == null ? null : Math.round(n))
  const hours = f.hours.map(h => ({
    hour: `${String(h.hour).padStart(2, '0')}:00`,
    summit_kmh: r(h.summit.speed), summit_dir: compass(h.summit.dir),
    takeoff_1200_kmh: r(h.takeoff.speed), takeoff_dir: compass(h.takeoff.dir), takeoff_temp_c: r(h.takeoff.temp),
    beach_kmh: r(h.beach.speed), beach_gust_kmh: r(h.beach.gust), beach_dir: compass(h.beach.dir), beach_temp_c: r(h.beach.temp),
    rain_chance_pct: h.rainChance, cloud_pct: h.cloudCover,
    estimate: FLY_TR[flyable(h)],
  }))
  const good = f.hours.filter(h => flyable(h) === 'good').map(h => h.hour)
  const window = good.length ? `${String(good[0]).padStart(2, '0')}:00–${String(good[good.length - 1] + 1).padStart(2, '0')}:00` : null
  return {
    result: {
      date, hours, best_window: window,
      note: 'Model tahmini (Open-Meteo). "estimate" kaba bir ölçüt: 1200 m rüzgâr ≤18 km/s, plaj hamlesi ≤22 km/s, yağmur <%30 = uygun. Son karar pilotun. Yönler: K=kuzey, G=güney, B=batı, D=doğu.',
    },
    display: {
      title: `Hava tahmini · ${date.slice(8, 10)}.${date.slice(5, 7)}`,
      subtitle: window ? `En uygun saatler (tahmini): ${window}` : 'Uygun saat görünmüyor (tahmini)',
      chart: { kind: 'line', label: '1200 m kalkış rüzgârı (km/s)', points: hours.map(h => ({ x: h.hour, y: h.takeoff_1200_kmh ?? 0 })) },
      table: {
        columns: ['Saat', 'Zirve', '1200 m', 'Plaj (hamle)', 'Yağmur', 'Durum'],
        rows: hours.map(h => [h.hour, `${h.summit_kmh} ${h.summit_dir}`, `${h.takeoff_1200_kmh} ${h.takeoff_dir}`, `${h.beach_kmh ?? '—'} (${h.beach_gust_kmh ?? '—'}) ${h.beach_dir}`, h.rain_chance_pct != null ? `%${h.rain_chance_pct}` : '—', h.estimate]),
      },
    },
  }
}

async function getWeather(args: any = {}): Promise<ToolOutput> {
  if (isDate(args?.date) && args.date !== istanbulDate(0)) return getWeatherForecast(args.date)
  if (args?.date === istanbulDate(0) && args?.forecast) return getWeatherForecast(args.date)
  const w: any = await getBabadagWindLadder()
  const stations = (w?.stations || []).map((s: any) => ({
    label: s.label, elevation: s.elevation,
    wind_kmh: s.windSpeedKmh != null ? Math.round(s.windSpeedKmh) : null,
    gust_kmh: s.windGustKmh != null ? Math.round(s.windGustKmh) : null,
    direction: compass(s.windDirectionDeg), direction_deg: s.windDirectionDeg != null ? Math.round(s.windDirectionDeg) : null,
    temp_c: s.temperatureC != null ? Math.round(s.temperatureC) : null,
  }))
  return {
    result: { fetched_at: w?.fetchedAt, stations, note: 'Yönler: K=kuzey, G=güney, B=batı, D=doğu. Model verisi (Open-Meteo), saha gözlemi değil.' },
    display: {
      title: 'Rüzgâr · Babadağ & Ölüdeniz',
      subtitle: 'Şu anki saat · Open-Meteo modeli',
      stats: stations.map((s: any) => ({
        label: s.label,
        value: s.wind_kmh != null ? `${s.wind_kmh} km/s ${s.direction}` : '—',
        hint: [s.gust_kmh != null ? `hamle ${s.gust_kmh}` : null, s.temp_c != null ? `${s.temp_c}°C` : null].filter(Boolean).join(' · '),
        tone: s.wind_kmh == null ? undefined : s.wind_kmh > 30 ? 'bad' : s.wind_kmh > 20 ? 'warn' : 'good',
      })),
    },
  }
}

async function getGoogleAds(ctx: ToolContext): Promise<ToolOutput> {
  const d = await adminApi(ctx, '/api/admin/google-ads?type=overview')
  const days: any[] = d.days || []
  const tot = days.reduce((a, r) => ({ clicks: a.clicks + r.clicks, impressions: a.impressions + r.impressions, cost: a.cost + r.cost, conversions: a.conversions + r.conversions }), { clicks: 0, impressions: 0, cost: 0, conversions: 0 })
  const campaigns: any[] = d.campaigns || []
  return {
    result: { currency: 'TRY', last_14_days_total: tot, daily: days, active_campaigns_last_7_days: campaigns },
    display: {
      title: 'Google Ads · son 14 gün',
      stats: [
        { label: 'Tıklama', value: fmt(tot.clicks) },
        { label: 'Gösterim', value: fmt(tot.impressions) },
        { label: 'Harcama', value: `₺${fmt(tot.cost)}` },
        { label: 'Dönüşüm', value: fmt(tot.conversions, 1), tone: tot.conversions ? 'good' : tot.clicks ? 'warn' : undefined },
      ],
      chart: { kind: 'bar', label: 'Günlük tıklama', points: days.map(r => ({ x: dayLabel(r.date), y: r.clicks })) },
      table: {
        columns: ['Kampanya (7 gün)', 'Tık', 'Harcama', 'Dönüşüm'],
        rows: campaigns.map(c => [c.name, c.clicks, `₺${fmt(c.cost)}`, fmt(c.conversions, 1)]),
      },
    },
  }
}

const META_PERIOD_TR: Record<string, string> = { today: 'bugün', yesterday: 'dün', last_7d: 'son 7 gün', last_30d: 'son 30 gün' }

async function getMetaAds(args: any, ctx: ToolContext): Promise<ToolOutput> {
  const period = META_PERIOD_TR[args?.period] ? args.period : 'last_7d'
  const [ins, byCamp] = await Promise.all([
    adminApi(ctx, `/api/admin/meta-ads?type=insights&date_preset=${period}`),
    adminApi(ctx, `/api/admin/meta-ads?type=insights_by_campaign&date_preset=${period}`).catch(() => ({ data: [] })),
  ])
  const t = ins?.data?.[0] || {}
  const camps: any[] = byCamp?.data || []
  const n = (v: any) => Number(v || 0)
  return {
    result: {
      period, spend: n(t.spend), impressions: n(t.impressions), clicks: n(t.clicks), reach: n(t.reach), ctr_percent: n(t.ctr), cpc: n(t.cpc),
      actions: t.actions || [],
      campaigns: camps.map(c => ({ name: c.campaign_name, spend: n(c.spend), clicks: n(c.clicks), impressions: n(c.impressions) })),
    },
    display: {
      title: `Meta reklamları · ${META_PERIOD_TR[period]}`,
      stats: [
        { label: 'Harcama', value: fmt(n(t.spend), 2) },
        { label: 'Erişim', value: fmt(n(t.reach)) },
        { label: 'Tıklama', value: fmt(n(t.clicks)) },
        { label: 'TO', value: `%${fmt(n(t.ctr), 2)}` },
      ],
      table: camps.length ? { columns: ['Kampanya', 'Harcama', 'Tık', 'Gösterim'], rows: camps.map(c => [c.campaign_name, fmt(n(c.spend), 2), n(c.clicks), n(c.impressions)]) } : undefined,
      note: camps.length ? undefined : 'Bu dönemde kampanya verisi yok.',
    },
  }
}

async function getSiteTraffic(ctx: ToolContext): Promise<ToolOutput> {
  const d = await adminApi(ctx, '/api/admin/seo-data?type=ga4-overview')
  const o = d.overview || {}
  const channels: any[] = d.channels || []
  return {
    result: { last_7_days: o, channels_last_28_days: channels },
    display: {
      title: 'Site trafiği · Google Analytics',
      subtitle: 'Son 7 gün · kaynaklar son 28 gün',
      stats: [
        { label: 'Ziyaretçi', value: fmt(o.activeUsers || 0) },
        { label: 'Yeni', value: fmt(o.newUsers || 0) },
        { label: 'Oturum', value: fmt(o.sessions || 0) },
        { label: 'Etkileşim', value: `%${fmt((o.engagementRate || 0) * 100)}` },
      ],
      chart: { kind: 'bar', label: 'Kaynağa göre oturum (28 gün)', points: channels.map(c => ({ x: c.channel, y: c.sessions })) },
    },
  }
}

async function getSearchConsoleTool(): Promise<ToolOutput> {
  const g = await getSearchConsole()
  if (g.error) throw new Error(g.error)
  const last28 = g.daily.slice(-28), prev28 = g.daily.slice(-56, -28)
  const sum = (a: any[], k: 'clicks' | 'impressions') => a.reduce((s, r) => s + r[k], 0)
  const clicks28 = sum(last28, 'clicks'), clicksPrev = sum(prev28, 'clicks')
  const change = clicksPrev ? ((clicks28 - clicksPrev) / clicksPrev) * 100 : null
  return {
    result: { clicks_last_28d: clicks28, clicks_prev_28d: clicksPrev, change_percent: change, impressions_last_28d: sum(last28, 'impressions'), top_queries_30d: g.queries, top_pages_30d: g.pages },
    display: {
      title: 'Google arama · Search Console',
      subtitle: 'Veriler ~2 gün gecikmeli',
      stats: [
        { label: 'Tıklama (28 gün)', value: fmt(clicks28), hint: change != null ? `${change >= 0 ? '+' : ''}${fmt(change)}% önceki 28 güne göre` : undefined, tone: change == null ? undefined : change >= 0 ? 'good' : 'bad' },
        { label: 'Gösterim (28 gün)', value: fmt(sum(last28, 'impressions')) },
      ],
      chart: { kind: 'line', label: 'Günlük tıklama (90 gün)', points: g.daily.map(r => ({ x: dayLabel(r.date), y: r.clicks })) },
      table: { columns: ['Arama (30 gün)', 'Tık', 'Gösterim', 'Sıra'], rows: g.queries.map(r => [r.key, r.clicks, r.impressions, fmt(r.position, 1)]) },
    },
  }
}

async function getContentStatus(): Promise<ToolOutput> {
  const sb = getSupabase()
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()
  const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString()
  const count = async (q: any) => (await q).count || 0
  const [articlesWeek, drafts, scheduled, failed, postedWeek, latest, logs, usage] = await Promise.all([
    count(sb.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'published').gte('created_at', weekAgo)),
    count(sb.from('instagram_posts').select('id', { count: 'exact', head: true }).eq('status', 'draft')),
    count(sb.from('instagram_posts').select('id', { count: 'exact', head: true }).eq('status', 'scheduled')),
    count(sb.from('instagram_posts').select('id', { count: 'exact', head: true }).eq('status', 'failed')),
    count(sb.from('instagram_posts').select('id', { count: 'exact', head: true }).eq('status', 'posted').gte('posted_at', weekAgo)),
    sb.from('articles').select('title,created_at').eq('status', 'published').order('created_at', { ascending: false }).limit(5),
    sb.from('agent_logs').select('agent,action,status,error,created_at').order('created_at', { ascending: false }).limit(40),
    sb.from('usage_logs').select('cost_usd').gte('created_at', monthAgo),
  ])
  const agents: Record<string, any> = {}
  for (const l of logs.data || []) if (!agents[l.agent]) agents[l.agent] = l
  const cost30 = (usage.data || []).reduce((s: number, u: any) => s + (u.cost_usd || 0), 0)
  const latestArticles = (latest.data || []).map((a: any) => ({ title: a.title, date: String(a.created_at).slice(0, 10) }))
  return {
    result: { articles_published_7d: articlesWeek, instagram: { posted_7d: postedWeek, drafts, scheduled, failed }, ai_cost_usd_30d: cost30, latest_articles: latestArticles, agents_last_run: Object.values(agents) },
    display: {
      title: 'İçerik & AI durumu',
      stats: [
        { label: 'Blog (7 gün)', value: fmt(articlesWeek) },
        { label: 'Instagram (7 gün)', value: fmt(postedWeek) },
        { label: 'Başarısız post', value: fmt(failed), tone: failed ? 'bad' : 'good' },
        { label: 'AI maliyeti (30 gün)', value: `$${fmt(cost30, 2)}` },
      ],
      table: {
        columns: ['Ajan', 'Son işlem', 'Durum', 'Zaman'],
        rows: Object.values(agents).map((a: any) => [a.agent, a.action || '—', a.status || '—', new Date(a.created_at).toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })]),
      },
    },
  }
}

const shortDate = (iso: string) =>
  iso ? new Date(iso).toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'

async function getEmails(args: any): Promise<ToolOutput> {
  const folder: MailFolder | undefined = ['inbox', 'sent', 'all'].includes(args?.folder) ? args.folder : undefined
  const mails = await listEmails({
    folder,
    unreadOnly: !!args?.unread_only,
    search: typeof args?.search === 'string' && args.search.trim() ? args.search.trim() : undefined,
    days: Number(args?.days) || undefined,
    limit: Number(args?.limit) || undefined,
  })
  const unread = mails.filter(m => m.unread).length
  return {
    result: { folder: folder || (args?.search ? 'all' : 'inbox'), count: mails.length, unread, emails: mails },
    display: {
      title: folder === 'sent' ? 'Gönderilen mailler' : args?.unread_only ? 'Okunmamış mailler' : 'Gelen kutusu',
      subtitle: args?.search ? `Arama: ${args.search}` : undefined,
      stats: [{ label: 'Mail', value: fmt(mails.length) }, { label: 'Okunmamış', value: fmt(unread), tone: unread ? 'warn' : 'good' }],
      table: {
        columns: ['', folder === 'sent' ? 'Kime' : 'Kimden', 'Konu', 'Tarih'],
        rows: mails.map(m => [m.unread ? '●' : '', (folder === 'sent' ? m.to : m.from).replace(/<.*>/, '').trim() || m.from, m.subject, shortDate(m.date)]),
      },
      note: mails.length ? undefined : 'Bu kriterlere uyan mail yok.',
    },
  }
}

async function getEmail(args: any): Promise<ToolOutput> {
  const uid = Number(args?.uid)
  if (!uid) throw new Error('Mail numarası (uid) gerekli')
  const folder: MailFolder = ['sent', 'all'].includes(args?.folder) ? args.folder : 'inbox'
  const m = await readEmail(uid, folder)
  return {
    result: { uid: m.uid, folder, from: m.from, reply_to: m.replyTo, to: m.to, subject: m.subject, date: m.date, attachments: m.attachments, text: m.text },
    display: {
      title: m.subject,
      subtitle: `${m.from} · ${shortDate(m.date)}`,
      note: m.text + (m.attachments.length ? `

📎 ${m.attachments.join(', ')}` : ''),
    },
  }
}

async function getInstagramPosts(args: any): Promise<ToolOutput> {
  const status = ['draft', 'scheduled', 'posted', 'failed'].includes(args?.status) ? args.status : 'draft'
  const { data, error } = await getSupabase().from('instagram_posts')
    .select('id,caption,post_type,status,image_url,created_at,posted_at')
    .eq('status', status).order('created_at', { ascending: false }).limit(10)
  if (error) throw new Error(error.message)
  const posts = (data || []).map((p: any) => ({ id: p.id, type: p.post_type, caption: String(p.caption || '').slice(0, 300), image_url: p.image_url, created: p.created_at }))
  const STATUS: Record<string, string> = { draft: 'Taslak', scheduled: 'Planlı', posted: 'Paylaşılan', failed: 'Başarısız' }
  return {
    result: { status, posts },
    display: {
      title: `Instagram · ${STATUS[status]} gönderiler`,
      table: { columns: ['#', 'Tür', 'Metin', 'Tarih'], rows: posts.map((p, i) => [i + 1, p.type || '—', p.caption.slice(0, 90) + (p.caption.length > 90 ? '…' : ''), shortDate(p.created)]) },
      note: posts.length ? undefined : 'Bu durumda gönderi yok.',
    },
  }
}

const KIND_TR: Record<string, string> = { note: 'Not', reminder: 'Hatırlatma', insight: 'Tespit' }

async function remember(args: any): Promise<ToolOutput> {
  const kind: MemoryKind = ['note', 'reminder', 'insight'].includes(args?.kind) ? args.kind : 'note'
  const item = await addMemory(kind, String(args?.content || ''), typeof args?.due === 'string' ? args.due : undefined)
  return {
    result: { saved: true, id: item.id, kind, due: item.due || null },
    display: { title: `🧠 ${KIND_TR[kind]} kaydedildi`, subtitle: item.due ? `Tarih: ${item.due}` : undefined, note: item.content },
  }
}

async function listMemory(args: any): Promise<ToolOutput> {
  const all = await loadMemory()
  const items = all.filter(i => (args?.include_done ? true : !i.done) && (!args?.kind || i.kind === args.kind)).slice(0, 40)
  return {
    result: { count: items.length, items },
    display: {
      title: 'Hafıza · notlar ve hatırlatmalar',
      table: { columns: ['Tür', 'Tarih', 'İçerik', 'Durum'], rows: items.map(i => [KIND_TR[i.kind], i.due || i.created.slice(0, 10), i.content, i.done ? 'Tamam' : 'Açık']) },
      note: items.length ? undefined : 'Kayıt yok.',
    },
  }
}

async function completeMemoryTool(args: any): Promise<ToolOutput> {
  const item = await completeMemory(String(args?.id || ''))
  return { result: { done: true, id: item.id }, display: { title: '✅ Tamamlandı olarak işaretlendi', note: item.content } }
}

export async function runNeslihanTool(name: string, args: any, ctx: ToolContext): Promise<ToolOutput> {
  switch (name) {
    case 'get_bookings': return getBookings(args)
    case 'get_booking_stats': return getBookingStats(args)
    case 'get_weather': return getWeather(args)
    case 'get_google_ads': return getGoogleAds(ctx)
    case 'get_meta_ads': return getMetaAds(args, ctx)
    case 'get_site_traffic': return getSiteTraffic(ctx)
    case 'get_search_console': return getSearchConsoleTool()
    case 'get_content_status': return getContentStatus()
    case 'list_emails': return getEmails(args)
    case 'read_email': return getEmail(args)
    case 'list_instagram_posts': return getInstagramPosts(args)
    case 'remember': return remember(args)
    case 'list_memory': return listMemory(args)
    case 'complete_memory': return completeMemoryTool(args)
    case 'diagnose_bookings': return diagnoseBookings(args, ctx)
    case 'competitor_check': return competitorCheck(args)
    case 'deep_analysis': return deepAnalysis(args, ctx)
    default: throw new Error(`Bilinmeyen araç: ${name}`)
  }
}
