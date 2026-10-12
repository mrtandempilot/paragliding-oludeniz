// Drop-in replacement for `new Anthropic().messages.create(...)` used by the
// content agents. Anthropic credits ran out on 2026-09-30, so by default the
// call is served by Google Gemini (free tier) and the response is converted
// back to the Anthropic shape the agents already parse:
//   { content: [{ type: 'tool_use', name, input } | { type: 'text', text }], usage }
// Set LLM_PROVIDER=anthropic to go back to Claude.
import Anthropic from '@anthropic-ai/sdk'
import { toGeminiSchema } from '@/lib/neslihan/gemini'

const GEMINI_MODEL = process.env.GEMINI_CONTENT_MODEL || process.env.GEMINI_MODEL || 'gemini-2.5-flash'

type AnyParams = {
  model?: string
  max_tokens?: number
  system?: string | { type: string; text: string }[]
  tools?: { name: string; description?: string; input_schema: any }[]
  tool_choice?: { type: string; name?: string }
  messages: { role: 'user' | 'assistant'; content: any }[]
}

function textOfContent(c: any): string {
  if (typeof c === 'string') return c
  if (Array.isArray(c)) return c.map(b => (b.type === 'text' ? b.text : '')).join('\n')
  return String(c ?? '')
}

// Gemini rejects free-form objects (no properties). Turn those into JSON
// strings and remember which fields to parse back.
function prepSchema(schema: any) {
  const jsonFields: string[] = []
  const s = JSON.parse(JSON.stringify(schema || { type: 'object', properties: {} }))
  for (const [k, v] of Object.entries<any>(s.properties || {})) {
    if (v?.type === 'object' && (!v.properties || !Object.keys(v.properties).length)) {
      s.properties[k] = { type: 'string', description: (v.description ? v.description + ' ' : '') + '(Return this as a JSON object serialized to a string.)' }
      jsonFields.push(k)
    }
  }
  return { schema: toGeminiSchema(s), jsonFields }
}

async function geminiCreate(p: AnyParams) {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('GEMINI_API_KEY tanımlı değil')
  const system = typeof p.system === 'string' ? p.system : Array.isArray(p.system) ? p.system.map(s => s.text).join('\n') : undefined
  const contents = p.messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: textOfContent(m.content) }] }))
  const jsonFieldsByTool: Record<string, string[]> = {}
  const body: any = {
    contents,
    generationConfig: { temperature: 0.6, maxOutputTokens: Math.min(65000, (p.max_tokens || 2048) + 8000) },
  }
  if (system) body.systemInstruction = { parts: [{ text: system }] }
  if (p.tools?.length) {
    body.tools = [{
      functionDeclarations: p.tools.map(t => {
        const { schema, jsonFields } = prepSchema(t.input_schema)
        jsonFieldsByTool[t.name] = jsonFields
        return { name: t.name, description: t.description || t.name, parameters: schema }
      }),
    }]
    if (p.tool_choice?.type === 'tool' && p.tool_choice.name) {
      body.toolConfig = { functionCallingConfig: { mode: 'ANY', allowedFunctionNames: [p.tool_choice.name] } }
    } else if (p.tool_choice?.type === 'any') {
      body.toolConfig = { functionCallingConfig: { mode: 'ANY' } }
    }
  }

  let lastErr: any
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
      method: 'POST', cache: 'no-store',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      lastErr = new Error(`Gemini ${res.status}: ${data?.error?.message || 'error'}`)
      if (res.status === 429 || res.status >= 500) { await new Promise(r => setTimeout(r, 4000 * (attempt + 1))); continue }
      throw lastErr
    }
    const parts: any[] = data?.candidates?.[0]?.content?.parts || []
    const content: any[] = []
    for (const part of parts) {
      if (part.functionCall) {
        const input = { ...(part.functionCall.args || {}) }
        for (const f of jsonFieldsByTool[part.functionCall.name] || []) {
          if (typeof input[f] === 'string') { try { input[f] = JSON.parse(input[f]) } catch { /* keep string */ } }
        }
        content.push({ type: 'tool_use', id: 'gem_' + Math.random().toString(36).slice(2), name: part.functionCall.name, input })
      } else if (part.text && !part.thought) {
        content.push({ type: 'text', text: part.text })
      }
    }
    if (!content.length) {
      lastErr = new Error('Gemini boş cevap: ' + (data?.candidates?.[0]?.finishReason || 'unknown'))
      continue
    }
    // Free tier → report zero tokens so cost tracking shows $0.
    return { id: 'gemini', type: 'message', role: 'assistant', model: GEMINI_MODEL, content, stop_reason: 'end_turn', usage: { input_tokens: 0, output_tokens: 0 } }
  }
  throw lastErr
}

export function llmClient(): Anthropic {
  const provider = (process.env.LLM_PROVIDER || 'gemini').toLowerCase()
  if (provider === 'anthropic') return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
  return { messages: { create: (p: AnyParams) => geminiCreate(p) } } as unknown as Anthropic
}
