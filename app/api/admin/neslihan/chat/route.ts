export const dynamic = 'force-dynamic'
export const maxDuration = 120

import { NextResponse } from 'next/server'
import { istanbulDate } from '@/lib/admin/dashboard-data'
import { buildInstructions, NESLIHAN_TOOLS } from '@/lib/neslihan/persona'
import { memoryForPrompt } from '@/lib/neslihan/memory'
import { geminiGenerate, textOf, type GeminiContent, type GeminiPart } from '@/lib/neslihan/gemini'
import { runNeslihanTool, type Display } from '@/lib/neslihan/tools'
import { prepareAction, executeAction } from '@/lib/neslihan/actions'
import { isYes } from '@/lib/neslihan/confirm'

// POST /api/admin/neslihan/chat  { contents, pending? }
// One conversational turn: Gemini thinks, calls Neslihan's tools (server-side
// loop), and returns the reply text plus anything to show on the live screen.
// `pending` is the action awaiting confirmation (signed token kept by the
// browser); it only runs when the user's own last message is a clear yes.

const MAX_STEPS = 6
const MAX_HISTORY = 40

function lastUserText(contents: GeminiContent[]) {
  for (let i = contents.length - 1; i >= 0; i--) {
    const c = contents[i]
    if (c.role !== 'user') continue
    const t = c.parts.map(p => p.text || '').join(' ').trim()
    if (t) return t
  }
  return ''
}

// Keep history small: start at a user text turn, and shrink big tool payloads.
function trimHistory(contents: GeminiContent[]) {
  let start = Math.max(0, contents.length - MAX_HISTORY)
  while (start < contents.length && !(contents[start].role === 'user' && contents[start].parts.some(p => p.text))) start++
  return contents.slice(start).map(c => ({
    ...c,
    parts: c.parts.map(p => {
      if (!p.functionResponse) return p
      const s = JSON.stringify(p.functionResponse.response)
      return s.length > 6000 ? { functionResponse: { name: p.functionResponse.name, response: { truncated: s.slice(0, 6000) } } } : p
    }),
  }))
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const contents: GeminiContent[] = Array.isArray(body?.contents) ? body.contents : []
    if (!contents.length) return NextResponse.json({ error: 'Mesaj yok' }, { status: 400 })
    // Only an action prepared in an EARLIER turn can be confirmed — never one
    // prepared in this turn (else "Ahmet'e mail gönder" would self-confirm).
    let pending: { token: string; summary: string } | null = body?.pending?.token ? body.pending : null

    const ctx = { origin: new URL(request.url).origin, cookie: request.headers.get('cookie') || '' }
    const weekday = new Intl.DateTimeFormat('tr-TR', { timeZone: 'Europe/Istanbul', weekday: 'long' }).format(new Date())
    const system = buildInstructions(istanbulDate(0), weekday, await memoryForPrompt())
    const userSaid = lastUserText(contents)

    const displays: { id: string; display: Display }[] = []
    let proposal: { token: string; summary: string } | null = null
    let clearPending = false
    let reply = ''

    for (let step = 0; step < MAX_STEPS; step++) {
      const answer = await geminiGenerate({ system, contents, functions: NESLIHAN_TOOLS })
      contents.push(answer)
      const calls = answer.parts.filter(p => p.functionCall)
      if (!calls.length) { reply = textOf(answer); break }

      const responses: GeminiPart[] = []
      for (const part of calls) {
        const { name, args = {} } = part.functionCall!
        const id = `${Date.now()}-${displays.length}`
        let result: any
        try {
          if (name === 'confirm_action') {
            if (!pending) result = { error: 'Onay bekleyen işlem yok.' }
            else if (!isYes(userSaid)) result = { error: 'Ceyhun Bey\'in açık bir "evet" onayı yok; işlem yapılmadı. Tekrar "Onaylıyor musunuz?" diye sor.' }
            else {
              const out = await executeAction(pending.token, ctx)
              result = out
              displays.push({ id, display: { title: out.ok ? '✅ Tamamlandı' : '❌ Yapılamadı', note: out.message } })
              pending = null
              clearPending = true
            }
          } else if (name.startsWith('prepare_')) {
            const p = await prepareAction(name, args)
            proposal = { token: p.token, summary: p.summary }
            pending = null // the earlier pending action is replaced and this one waits for the next turn
            clearPending = false
            displays.push({ id, display: p.display })
            result = { status: 'awaiting_confirmation', summary: p.summary, next: 'Özeti söyle ve "Onaylıyor musunuz?" diye sor. Cevabı bekle.' }
          } else {
            const out = await runNeslihanTool(name, args, ctx)
            if (out.display) displays.push({ id, display: out.display })
            result = out.result
          }
        } catch (e: any) {
          const message = e?.message || String(e)
          result = { error: message }
          displays.push({ id, display: { title: 'İşlem yapılamadı', subtitle: name, note: message } })
        }
        responses.push({ functionResponse: { name, response: result && typeof result === 'object' && !Array.isArray(result) ? result : { result } } })
      }
      contents.push({ role: 'user', parts: responses })
    }

    if (!reply) reply = 'Biraz karıştı Ceyhun Bey, tekrar sorar mısınız?'
    return NextResponse.json({ reply, contents: trimHistory(contents), displays, proposal, clearPending })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}
