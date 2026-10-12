'use client'

// Ajan Ofisi — sitenin otomatik ajanlarını piksel bir ofiste gösterir.
// Durum agent_logs'tan gelir: çalışıyor (masada yazıyor), boşta (ofiste geziyor),
// hata (kırmızı !), uyuyor (son 36 saatte iş yok, Zzz). Bir karaktere tıkla → detay.
// Tüm çizimler bu dosyada, kod ile üretilir (harici sprite yok).

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Loader2, Play, RefreshCw, X } from 'lucide-react'

type Agent = {
  id: string; name: string; role: string; team: string; color: string
  state: 'working' | 'idle' | 'error' | 'sleeping'
  last: { action: string; status: string; at: string; error?: string } | null
  runs14d: number; errors14d: number
  recent: { action: string; status: string; at: string; error?: string; ms?: number }[]
}

const W = 320, H = 180
const RUNNABLE = new Set(['google-ads', 'rezervasyon', 'orchestrator', 'seo', 'writer', 'image', 'social'])
const STATE_TR: Record<Agent['state'], { label: string; dot: string }> = {
  working: { label: 'Çalışıyor', dot: '#22c55e' },
  idle: { label: 'Boşta', dot: '#94a3b8' },
  error: { label: 'Hata', dot: '#ef4444' },
  sleeping: { label: 'Uyuyor', dot: '#a78bfa' },
}

// desk slots (logical px): top-left of desk
const SLOTS: Record<string, { x: number; y: number }> = {
  'orchestrator': { x: 22, y: 70 }, 'seo': { x: 70, y: 70 }, 'writer': { x: 118, y: 70 },
  'image': { x: 22, y: 122 }, 'social': { x: 70, y: 122 }, 'translate-backlog': { x: 118, y: 122 },
  'google-ads': { x: 196, y: 70 }, 'rezervasyon': { x: 244, y: 70 }, 'whatsapp': { x: 220, y: 122 },
}
const HAIR = ['#3b2a20', '#1f2937', '#a16207', '#7c2d12', '#111827', '#d6b98c', '#4b5563', '#78350f', '#0f172a']
const SKIN = ['#f1c7a3', '#e0ac85', '#c68a62', '#f5d0b0', '#a86f4c', '#efc2a0', '#d9a07a', '#f3cdb0', '#b67c58']

// 10x14 sprite rows. h hair, s skin, e eye, c shirt, p pants, k shoes
const STAND = [
  '..hhhhhh..', '.hhhhhhhh.', '.hssssssh.', '.sesssses.', '.ssssssss.', '..ssssss..',
  '..cccccc..', '.cccccccc.', 'sccccccccs', 'sccccccccs', '.cccccccc.', '..pppppp..', '..pp..pp..', '..kk..kk..',
]
const WALK = [
  '..hhhhhh..', '.hhhhhhhh.', '.hssssssh.', '.sesssses.', '.ssssssss.', '..ssssss..',
  '..cccccc..', '.cccccccc.', 'sccccccccs', '.ccccccccs', '.cccccccc.', '..pppppp..', '.pp....pp.', '.kk....kk.',
]
const SIT_A = ['..hhhhhh..', '.hhhhhhhh.', '.hssssssh.', '.sesssses.', '.ssssssss.', '..ssssss..', '..cccccc..', 'scccccccc.', 's.cccccc.s', '.ccccccccs']
const SIT_B = ['..hhhhhh..', '.hhhhhhhh.', '.hssssssh.', '.sesssses.', '.ssssssss.', '..ssssss..', '..cccccc..', '.ccccccccs', 's.cccccc.s', 'scccccccc.']
const SLEEP = ['..........', '..........', '..hhhhhh..', '.hhhhhhhh.', '.hhhhhhhh.', '.ssssssss.', '..cccccc..', '.cccccccc.', 'sccccccccs', 'sccccccccs']

function drawSprite(ctx: CanvasRenderingContext2D, rows: string[], x: number, y: number, pal: Record<string, string>, flip = false) {
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r]
    for (let c = 0; c < row.length; c++) {
      const ch = row[flip ? row.length - 1 - c : c]
      if (ch === '.') continue
      ctx.fillStyle = pal[ch] || '#000'
      ctx.fillRect(Math.round(x + c), Math.round(y + r), 1, 1)
    }
  }
}

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, Math.min(255, (n >> 16) + amt)), g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt)), b = Math.max(0, Math.min(255, (n & 255) + amt))
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')
}

function drawRoom(ctx: CanvasRenderingContext2D, t: number) {
  // wall
  ctx.fillStyle = '#e9e2d4'; ctx.fillRect(0, 0, W, 46)
  ctx.fillStyle = '#d8cfbd'; ctx.fillRect(0, 44, W, 2)
  // windows with Babadağ + lagoon view
  for (const wx of [14, 118, 222]) {
    ctx.fillStyle = '#8fd3f4'; ctx.fillRect(wx, 6, 84, 32)
    ctx.fillStyle = '#bfe8fb'; ctx.fillRect(wx, 6, 84, 10)
    // mountain
    ctx.fillStyle = '#5b7a5a'
    for (let i = 0; i < 84; i++) { const h = Math.max(0, 22 - Math.abs(i - 40) * 0.55 + Math.sin(i * 0.7) * 1.5); ctx.fillRect(wx + i, 38 - h, 1, h) }
    // lagoon
    ctx.fillStyle = '#1aa6b7'; ctx.fillRect(wx, 33, 84, 5)
    ctx.fillStyle = '#f2e3b3'; ctx.fillRect(wx + 30, 33, 22, 2)
    // frame
    ctx.fillStyle = '#ffffff'; ctx.fillRect(wx - 2, 4, 88, 2); ctx.fillRect(wx - 2, 38, 88, 2); ctx.fillRect(wx - 2, 4, 2, 36); ctx.fillRect(wx + 84, 4, 2, 36); ctx.fillRect(wx + 41, 4, 2, 36)
  }
  // flying paraglider crossing the windows
  const px = ((t / 60) % (W + 40)) - 20, py = 12 + Math.sin(t / 700) * 3
  const inWindow = [14, 118, 222].some(wx => px > wx && px < wx + 84)
  if (inWindow) {
    ctx.fillStyle = '#f97316'; ctx.fillRect(px - 5, py, 11, 2); ctx.fillRect(px - 6, py + 1, 1, 1); ctx.fillRect(px + 6, py + 1, 1, 1)
    ctx.fillStyle = '#334155'; ctx.fillRect(px - 3, py + 2, 1, 4); ctx.fillRect(px + 3, py + 2, 1, 4); ctx.fillRect(px - 1, py + 6, 3, 2)
  }
  // floor (wood planks)
  for (let y = 46; y < H; y += 6) {
    ctx.fillStyle = (y / 6) % 2 ? '#c89f6e' : '#c29767'; ctx.fillRect(0, y, W, 6)
    ctx.fillStyle = '#b48857'; ctx.fillRect(0, y + 5, W, 1)
    for (let x = ((y / 6) % 3) * 20; x < W; x += 60) ctx.fillRect(x, y, 1, 5)
  }
  // team rugs
  ctx.fillStyle = '#d9c4f3'; ctx.fillRect(12, 60, 150, 112)
  ctx.fillStyle = '#c4a9ec'; ctx.fillRect(14, 62, 146, 108)
  ctx.fillStyle = '#bde8d4'; ctx.fillRect(186, 60, 120, 112)
  ctx.fillStyle = '#a3dcc2'; ctx.fillRect(188, 62, 116, 108)
  // plant + water cooler + coffee
  ctx.fillStyle = '#7c4a24'; ctx.fillRect(170, 150, 8, 8); ctx.fillStyle = '#2f855a'; ctx.fillRect(167, 140, 14, 11); ctx.fillStyle = '#38a169'; ctx.fillRect(170, 136, 8, 6)
  ctx.fillStyle = '#e2e8f0'; ctx.fillRect(290, 48, 10, 18); ctx.fillStyle = '#93c5fd'; ctx.fillRect(291, 44, 8, 8)
  ctx.fillStyle = '#334155'; ctx.fillRect(170, 50, 12, 12); ctx.fillStyle = '#ef4444'; ctx.fillRect(172, 52, 2, 2)
}

function drawChair(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#1f2937'; ctx.fillRect(x + 12, y - 6, 12, 12)
  ctx.fillStyle = '#374151'; ctx.fillRect(x + 13, y - 5, 10, 2)
}

function drawDesk(ctx: CanvasRenderingContext2D, x: number, y: number, working: boolean, error: boolean, t: number) {
  // monitor
  ctx.fillStyle = '#111827'; ctx.fillRect(x + 10, y + 2, 16, 11)
  ctx.fillStyle = error ? '#7f1d1d' : working ? '#0b3b2e' : '#1e293b'; ctx.fillRect(x + 11, y + 3, 14, 8)
  if (working) {
    ctx.fillStyle = '#34d399'
    for (let i = 0; i < 3; i++) { const w = 3 + ((Math.floor(t / 180) + i * 3) % 9); ctx.fillRect(x + 12, y + 4 + i * 2, w, 1) }
  } else if (error) {
    ctx.fillStyle = '#fca5a5'; ctx.fillRect(x + 17, y + 4, 2, 4); ctx.fillRect(x + 17, y + 9, 2, 1)
  }
  ctx.fillStyle = '#374151'; ctx.fillRect(x + 17, y + 13, 2, 2)
  // desk
  ctx.fillStyle = '#8b5a2b'; ctx.fillRect(x, y + 15, 36, 6)
  ctx.fillStyle = '#a0693a'; ctx.fillRect(x, y + 15, 36, 2)
  ctx.fillStyle = '#6b4423'; ctx.fillRect(x + 1, y + 21, 2, 7); ctx.fillRect(x + 33, y + 21, 2, 7)
  // mug + paper
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(x + 28, y + 12, 3, 3); ctx.fillStyle = '#fde68a'; ctx.fillRect(x + 3, y + 13, 5, 2)
}

export default function AgentOffice() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [agents, setAgents] = useState<Agent[] | null>(null)
  const [err, setErr] = useState('')
  const [sel, setSel] = useState<string | null>(null)
  const [running, setRunning] = useState<string | null>(null)
  const [runMsg, setRunMsg] = useState('')
  const agentsRef = useRef<Agent[]>([])
  const walkers = useRef<Record<string, { x: number; y: number; tx: number; ty: number; wait: number }>>({})

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/admin/agent-office', { cache: 'no-store' })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Hata')
      setAgents(j.agents); agentsRef.current = j.agents; setErr('')
    } catch (e: any) { setErr(e.message) }
  }, [])
  useEffect(() => { load(); const i = setInterval(load, 15000); return () => clearInterval(i) }, [load])

  // animation loop
  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return
    const ctx = cv.getContext('2d')!; ctx.imageSmoothingEnabled = false
    let raf = 0
    const frame = (t: number) => {
      drawRoom(ctx, t)
      const list = agentsRef.current
      list.forEach((a, i) => {
        const s = SLOTS[a.id]; if (!s) return
        const pal = { h: HAIR[i % HAIR.length], s: SKIN[i % SKIN.length], e: '#111827', c: a.color, p: shade(a.color, -90), k: '#1f2937' }
        const atDesk = a.state === 'working' || a.state === 'error' || a.state === 'sleeping'
        drawChair(ctx, s.x, s.y)
        if (atDesk) {
          const rows = a.state === 'sleeping' ? SLEEP : a.state === 'working' ? (Math.floor(t / 220 + i) % 2 ? SIT_A : SIT_B) : SIT_A
          const bob = a.state === 'working' && Math.floor(t / 220 + i) % 2 ? 1 : 0
          if (a.state === 'sleeping') {
            drawDesk(ctx, s.x, s.y, false, false, t)
            drawSprite(ctx, rows, s.x + 2, s.y + 6, pal) // head down on the desk
          } else {
            drawSprite(ctx, rows, s.x + 13, s.y - 8 + bob, pal)
            drawDesk(ctx, s.x, s.y, a.state === 'working', a.state === 'error', t)
          }
        } else {
          drawDesk(ctx, s.x, s.y, false, false, t)
          // idle: wander around own desk area
          const w = walkers.current[a.id] ||= { x: s.x + 13, y: s.y + 34, tx: s.x + 13, ty: s.y + 34, wait: 0 }
          if (w.wait > 0) w.wait--
          else {
            const dx = w.tx - w.x, dy = w.ty - w.y, d = Math.hypot(dx, dy)
            if (d < 0.6) { w.wait = 60 + Math.floor(Math.random() * 180); w.tx = s.x + 2 + Math.random() * 28; w.ty = s.y + 33 + Math.random() * 4 }
            else { w.x += (dx / d) * 0.25; w.y += (dy / d) * 0.25 }
          }
          const moving = w.wait === 0
          drawSprite(ctx, moving && Math.floor(t / 180) % 2 ? WALK : STAND, w.x, w.y, pal, w.tx < w.x)
        }
        // selection marker
        if (sel === a.id) { ctx.fillStyle = '#facc15'; ctx.fillRect(s.x - 2, s.y + 30, 40, 1) }
      })
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [sel])

  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * W, y = ((e.clientY - r.top) / r.height) * H
    const hit = Object.entries(SLOTS).find(([, s]) => x >= s.x - 4 && x <= s.x + 40 && y >= s.y - 4 && y <= s.y + 40)
    setSel(hit ? hit[0] : null); setRunMsg('')
  }

  const selected = useMemo(() => agents?.find(a => a.id === sel) || null, [agents, sel])
  const counts = useMemo(() => {
    const c = { working: 0, idle: 0, error: 0, sleeping: 0 } as Record<string, number>
    for (const a of agents || []) c[a.state]++
    return c
  }, [agents])

  async function runNow(id: string) {
    setRunning(id); setRunMsg('')
    try {
      const r = await fetch('/api/admin/agent-office', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ agent: id }) })
      const j = await r.json()
      setRunMsg(r.ok && j.ok !== false ? 'Tamamlandı ✓' : 'Hata: ' + (j.error || r.status))
    } catch (e: any) { setRunMsg('Hata: ' + e.message) } finally { setRunning(null); load() }
  }

  const ago = (iso: string) => {
    const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
    if (m < 60) return `${m} dk önce`
    const h = Math.round(m / 60); if (h < 48) return `${h} sa önce`
    return `${Math.round(h / 24)} gün önce`
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {(['working', 'idle', 'error', 'sleeping'] as const).map(s => (
          <span key={s} className="inline-flex items-center gap-1.5 bg-white ring-1 ring-black/10 rounded-full px-3 py-1">
            <span className="w-2 h-2 rounded-full" style={{ background: STATE_TR[s].dot }} />
            {STATE_TR[s].label} <b className="tabular-nums">{counts[s] || 0}</b>
          </span>
        ))}
        <button onClick={load} className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl ring-1 ring-black/10 bg-white hover:bg-slate-50 text-slate-700"><RefreshCw className="w-4 h-4" /> Yenile</button>
      </div>
      {err && <div className="text-sm bg-red-50 text-red-800 rounded-xl p-3">{err}</div>}

      <div className="grid xl:grid-cols-[1fr_340px] gap-4">
        <div className="relative rounded-2xl overflow-hidden ring-1 ring-black/10 bg-[#c89f6e]">
          {!agents && <div className="absolute inset-0 flex items-center justify-center text-white/80"><Loader2 className="w-6 h-6 animate-spin" /></div>}
          <canvas ref={canvasRef} width={W} height={H} onClick={onCanvasClick} className="w-full h-auto block cursor-pointer" style={{ imageRendering: 'pixelated', aspectRatio: `${W}/${H}` }} />
          {/* labels & bubbles (HTML so the text stays crisp) */}
          {(agents || []).map(a => {
            const s = SLOTS[a.id]; if (!s) return null
            return (
              <div key={a.id} className="absolute pointer-events-none" style={{ left: `${((s.x + 18) / W) * 100}%`, top: `${((s.y + 30) / H) * 100}%`, transform: 'translateX(-50%)' }}>
                <span className="block whitespace-nowrap text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded bg-black/55 text-white">{a.name}</span>
              </div>
            )
          })}
          {(agents || []).filter(a => a.state !== 'idle').map(a => {
            const s = SLOTS[a.id]; if (!s) return null
            const txt = a.state === 'working' ? '⌨️ ' + (a.last?.action || 'çalışıyor') : a.state === 'error' ? '❗ hata' : 'Zzz'
            return (
              <div key={a.id + 'b'} className="absolute pointer-events-none" style={{ left: `${((s.x + 18) / W) * 100}%`, top: `${((s.y - 6) / H) * 100}%`, transform: 'translate(-50%,-100%)' }}>
                <span className={`block max-w-[140px] truncate text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-md shadow ${a.state === 'error' ? 'bg-red-600 text-white' : a.state === 'working' ? 'bg-white text-slate-900' : 'bg-violet-100 text-violet-800'}`}>{txt}</span>
              </div>
            )
          })}
          <div className="absolute left-[4%] top-[29%] text-[10px] sm:text-xs font-bold text-violet-900/70">İÇERİK EKİBİ</div>
          <div className="absolute left-[59%] top-[29%] text-[10px] sm:text-xs font-bold text-emerald-900/70">SATIŞ EKİBİ</div>
        </div>

        <aside className="bg-white rounded-2xl ring-1 ring-black/10 p-4">
          {!selected ? (
            <div className="text-sm text-slate-600 space-y-3">
              <p className="font-semibold text-slate-900">Ofise hoş geldin 👋</p>
              <p>Bir ajana tıkla: ne yaptığını, son işlerini ve hatalarını gör, istersen hemen çalıştır.</p>
              <ul className="space-y-1.5">
                {(agents || []).map(a => (
                  <li key={a.id}>
                    <button onClick={() => setSel(a.id)} className="w-full flex items-center gap-2 text-left hover:bg-slate-50 rounded-lg px-2 py-1">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ background: a.color }} />
                      <span className="font-medium text-slate-800">{a.name}</span>
                      <span className="ml-auto inline-flex items-center gap-1 text-xs text-slate-500"><span className="w-1.5 h-1.5 rounded-full" style={{ background: STATE_TR[a.state].dot }} />{STATE_TR[a.state].label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="mt-1 w-3 h-3 rounded-sm" style={{ background: selected.color }} />
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{selected.name} <span className="text-xs font-normal text-slate-500">· {selected.team}</span></p>
                  <p className="text-xs text-slate-500">{selected.role}</p>
                </div>
                <button onClick={() => setSel(null)} className="ml-auto p-1 rounded hover:bg-slate-100"><X className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-slate-50 p-2"><p className="text-[11px] text-slate-500">Durum</p><p className="text-sm font-semibold">{STATE_TR[selected.state].label}</p></div>
                <div className="rounded-lg bg-slate-50 p-2"><p className="text-[11px] text-slate-500">İş (14g)</p><p className="text-sm font-semibold tabular-nums">{selected.runs14d}</p></div>
                <div className="rounded-lg bg-slate-50 p-2"><p className="text-[11px] text-slate-500">Hata</p><p className="text-sm font-semibold tabular-nums">{selected.errors14d}</p></div>
              </div>
              {RUNNABLE.has(selected.id) && (
                <button onClick={() => runNow(selected.id)} disabled={!!running} className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 text-white text-sm disabled:opacity-60">
                  {running === selected.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} Şimdi çalıştır
                </button>
              )}
              {runMsg && <p className="text-xs text-slate-700">{runMsg}</p>}
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1.5">Son işler</p>
                <ul className="space-y-1.5 max-h-80 overflow-y-auto">
                  {selected.recent.map((r, i) => (
                    <li key={i} className="text-xs border-l-2 pl-2" style={{ borderColor: r.status === 'error' ? '#ef4444' : r.status === 'running' ? '#f59e0b' : '#22c55e' }}>
                      <p className="text-slate-800">{r.action}</p>
                      <p className="text-slate-500">{ago(r.at)}{r.ms ? ` · ${Math.round(r.ms / 1000)} sn` : ''}</p>
                      {r.error && <p className="text-red-700 break-words">{r.error.slice(0, 200)}</p>}
                    </li>
                  ))}
                  {!selected.recent.length && <li className="text-xs text-slate-500">Son 14 günde kayıt yok.</li>}
                </ul>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
