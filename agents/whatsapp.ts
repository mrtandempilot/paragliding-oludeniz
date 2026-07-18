import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { WHATSAPP_KNOWLEDGE_BASE } from '../lib/knowledge/whatsapp-kb'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface WhatsAppReplyResult {
  reply: string
  needsHuman: boolean
  tokensIn: number
  tokensOut: number
}

export interface ChatTurn {
  role: 'user' | 'assistant'
  content: string
}

const SYSTEM_PROMPT = `You are the WhatsApp assistant for Atmos Paragliding (Oludeniz, Turkey), replying to customer messages on behalf of head pilot Ceyhun Aksoy.

Use ONLY the knowledge base below to answer. Never invent prices, policies, availability, or facts that are not in it.

Rules:
- Reply in the SAME language the customer wrote in (Turkish or English). If they wrote in another language, reply in English.
- Keep replies short and WhatsApp-natural: roughly 2-5 sentences, plain text, no markdown headers or bullet-heavy formatting, at most 1 emoji.
- Never invent availability for a specific date or time slot. If asked "is tomorrow free", say the pilot will confirm exact availability.
- The customer is already messaging the business WhatsApp number, so don't tell them to "contact us on WhatsApp" \u2014 they're already here. Give them a direct, useful answer instead.
- For anything involving actual booking confirmation, payment, refund disputes, medical or health edge cases (beyond the standard weight/pregnancy/heart/surgery restrictions already in the KB), complaints, or anything not covered by the knowledge base, give the best short answer you can from the KB, tell them the pilot will personally follow up shortly, and set needs_human to true.
- If the message is just a greeting or not really a question, reply warmly and briefly and ask how you can help.
- If you are not confident an answer is correct based on the knowledge base, say the pilot will confirm the exact detail, and set needs_human to true. Do not guess.

--- KNOWLEDGE BASE START ---
${WHATSAPP_KNOWLEDGE_BASE}
--- KNOWLEDGE BASE END ---

Respond ONLY with valid JSON in this exact shape, no other text: {"reply": "...", "needs_human": true or false}`

export async function generateWhatsAppReply(
  customerMessage: string,
  conversationHistory: ChatTurn[] = []
): Promise<WhatsAppReplyResult> {
  const messages: ChatTurn[] = [...conversationHistory, { role: 'user', content: customerMessage }]

  const response = await anthropic.messages.create({
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
    max_tokens: 400,
    system: SYSTEM_PROMPT,
    messages,
  })

  const rawText = response.content[0].type === 'text' ? response.content[0].text : '{}'

  let parsed: { reply?: string; needs_human?: boolean }
  try {
    const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    parsed = JSON.parse(cleaned)
  } catch {
    // Model didn't return clean JSON -- fall back to using the raw text as the reply
    parsed = { reply: rawText.trim(), needs_human: false }
  }

  const result: WhatsAppReplyResult = {
    reply: parsed.reply || "Sorry, I couldn't process that right now \u2014 the pilot will get back to you shortly.",
    needsHuman: !!parsed.needs_human,
    tokensIn: response.usage.input_tokens,
    tokensOut: response.usage.output_tokens,
  }

  await logAgent('whatsapp', 'reply', result.needsHuman ? 'escalated' : 'done', {
    customer_message: customerMessage,
    reply: result.reply,
    needs_human: result.needsHuman,
  })

  return result
}

async function logAgent(agent: string, action: string, status: string, output: object) {
  try {
    await supabase.from('agent_logs').insert({ agent, action, status, output })
  } catch (e) {
    console.error('[WhatsApp] Failed to write agent_logs:', e)
  }
}
