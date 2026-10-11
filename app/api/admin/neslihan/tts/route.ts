export const dynamic = 'force-dynamic'
export const maxDuration = 60

import { NextResponse } from 'next/server'

// POST /api/admin/neslihan/tts  { text }  →  audio/wav
// Natural voice for Neslihan via Gemini TTS (free tier, same GEMINI_API_KEY).
// On any failure (e.g. the free daily limit) it returns JSON with status 503
// and the browser falls back to its own built-in voice.

const MODEL = process.env.GEMINI_TTS_MODEL || 'gemini-2.5-flash-preview-tts'
const VOICE = process.env.NESLIHAN_TTS_VOICE || 'Sulafat' // warm female voice
const STYLE = 'Sıcak, samimi ve profesyonel bir kadın asistan gibi, doğal hızda Türkçe oku:'

// Gemini returns raw 16-bit mono PCM; wrap it in a WAV header so <audio> can play it.
function pcmToWav(pcm: Buffer, sampleRate = 24000) {
  const header = Buffer.alloc(44)
  header.write('RIFF', 0)
  header.writeUInt32LE(36 + pcm.length, 4)
  header.write('WAVE', 8)
  header.write('fmt ', 12)
  header.writeUInt32LE(16, 16)
  header.writeUInt16LE(1, 20) // PCM
  header.writeUInt16LE(1, 22) // mono
  header.writeUInt32LE(sampleRate, 24)
  header.writeUInt32LE(sampleRate * 2, 28)
  header.writeUInt16LE(2, 32)
  header.writeUInt16LE(16, 34)
  header.write('data', 36)
  header.writeUInt32LE(pcm.length, 40)
  return Buffer.concat([header, pcm])
}

export async function POST(request: Request) {
  const key = process.env.GEMINI_API_KEY
  if (!key) return NextResponse.json({ error: 'GEMINI_API_KEY yok' }, { status: 503 })
  try {
    const { text } = await request.json()
    const clean = String(text || '').replace(/[*_#`>|]/g, '').trim().slice(0, 1200)
    if (!clean) return NextResponse.json({ error: 'Metin boş' }, { status: 400 })

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${STYLE} ${clean}` }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } } },
        },
      }),
      cache: 'no-store',
    })
    const data = await res.json().catch(() => ({}))
    const part = data?.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData?.data)
    if (!res.ok || !part) {
      return NextResponse.json({ error: data?.error?.message || `TTS HTTP ${res.status}`, limit: res.status === 429 }, { status: 503 })
    }
    const rate = Number(/rate=(\d+)/.exec(part.inlineData.mimeType || '')?.[1]) || 24000
    const wav = pcmToWav(Buffer.from(part.inlineData.data, 'base64'), rate)
    return new NextResponse(new Uint8Array(wav), { headers: { 'Content-Type': 'audio/wav', 'Cache-Control': 'no-store' } })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 503 })
  }
}
