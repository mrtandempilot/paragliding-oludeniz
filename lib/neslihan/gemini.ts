// Google Gemini (free tier) — Neslihan's brain.
// Plain REST generateContent with function calling.

export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

export type GeminiPart = { text?: string; functionCall?: { name: string; args?: any }; functionResponse?: { name: string; response: any }; [k: string]: any }
export type GeminiContent = { role: 'user' | 'model'; parts: GeminiPart[] }

// Gemini accepts an OpenAPI subset: no additionalProperties, enums only on strings.
export function toGeminiSchema(schema: any): any {
  if (!schema || typeof schema !== 'object') return schema
  const out: any = {}
  for (const [k, v] of Object.entries(schema)) {
    if (k === 'additionalProperties') continue
    if (k === 'enum' && schema.type !== 'string') continue
    if (k === 'properties') {
      out.properties = Object.fromEntries(Object.entries(v as any).map(([pk, pv]) => [pk, toGeminiSchema(pv)]))
    } else if (k === 'items') {
      out.items = toGeminiSchema(v)
    } else {
      out[k] = v
    }
  }
  if (Array.isArray(out.required) && out.required.length === 0) delete out.required
  if (out.type === 'object' && out.properties && Object.keys(out.properties).length === 0) delete out.properties
  return out
}

export async function geminiGenerate(opts: {
  system: string
  contents: GeminiContent[]
  functions?: { name: string; description: string; parameters: any }[]
  json?: boolean
  maxOutputTokens?: number
  model?: string
}): Promise<GeminiContent> {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('GEMINI_API_KEY tanımlı değil. Vercel ortam değişkenlerine eklenmeli.')
  const model = opts.model || GEMINI_MODEL
  const body: any = {
    systemInstruction: { parts: [{ text: opts.system }] },
    contents: opts.contents,
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: opts.maxOutputTokens || 1024,
      ...(opts.json ? { responseMimeType: 'application/json' } : {}),
    },
  }
  if (opts.functions?.length) {
    body.tools = [{ functionDeclarations: opts.functions.map(f => ({ name: f.name, description: f.description, parameters: toGeminiSchema(f.parameters) })) }]
  }
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify(body),
    cache: 'no-store',
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = data?.error?.message || `Gemini HTTP ${res.status}`
    if (res.status === 429) throw new Error('Gemini ücretsiz kullanım sınırına ulaşıldı, biraz sonra tekrar deneyin.')
    throw new Error(msg)
  }
  const content = data?.candidates?.[0]?.content
  if (!content?.parts?.length) {
    const reason = data?.candidates?.[0]?.finishReason || data?.promptFeedback?.blockReason || 'boş cevap'
    return { role: 'model', parts: [{ text: `(Cevap üretilemedi: ${reason})` }] }
  }
  return { role: 'model', parts: content.parts }
}

export const textOf = (c: GeminiContent) => c.parts.map(p => p.text || '').join('').trim()
