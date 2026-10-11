export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { istanbulDate } from '@/lib/admin/dashboard-data'
import { buildInstructions, NESLIHAN_MODEL, NESLIHAN_TOOLS, NESLIHAN_VOICE } from '@/lib/neslihan/persona'
import { memoryForPrompt } from '@/lib/neslihan/memory'

// POST /api/admin/neslihan/session
// Mints a short-lived OpenAI Realtime client secret so the browser can open a
// WebRTC voice session without ever seeing OPENAI_API_KEY.
// (Admin auth is enforced by middleware for every /api/admin route.)
export async function POST() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'OPENAI_API_KEY tanımlı değil. Vercel ortam değişkenlerine eklenmeli.' }, { status: 500 })
  }

  const weekday = new Intl.DateTimeFormat('tr-TR', { timeZone: 'Europe/Istanbul', weekday: 'long' }).format(new Date())
  const memory = await memoryForPrompt()

  try {
    const res = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        expires_after: { anchor: 'created_at', seconds: 120 },
        session: {
          type: 'realtime',
          model: NESLIHAN_MODEL,
          instructions: buildInstructions(istanbulDate(0), weekday, memory),
          tools: NESLIHAN_TOOLS,
          tool_choice: 'auto',
          audio: {
            input: {
              transcription: { model: 'gpt-4o-mini-transcribe', language: 'tr' },
              noise_reduction: { type: 'near_field' },
              turn_detection: { type: 'semantic_vad' },
            },
            output: { voice: NESLIHAN_VOICE },
          },
        },
      }),
      cache: 'no-store',
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data?.value) {
      return NextResponse.json({ error: data?.error?.message || `OpenAI HTTP ${res.status}` }, { status: 502 })
    }
    return NextResponse.json({ value: data.value, model: NESLIHAN_MODEL })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}
