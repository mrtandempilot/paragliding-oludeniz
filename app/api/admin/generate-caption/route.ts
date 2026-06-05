import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  const { imageDescription, tone, linkedPost } = await request.json()

  if (!imageDescription) return NextResponse.json({ error: 'Image description required' }, { status: 400 })

  const message = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `You are a social media manager for a paragliding company in Ölüdeniz, Turkey (paragliding-oludeniz.com). Create an engaging Instagram caption.

Image description: ${imageDescription}
Tone: ${tone || 'exciting and inspiring'}
${linkedPost ? `Related blog post: ${linkedPost}` : ''}

Requirements:
- 150-300 characters for the main caption
- Engaging, emotional, makes people want to fly
- Include a call to action (book now, link in bio, etc.)
- Mention Ölüdeniz or Babadağ naturally
- Use emojis naturally (2-4 emojis max)
- 15-20 relevant hashtags (mix of popular and niche)

Return a JSON object with exactly these fields:
{
  "caption": "the main caption text with emojis",
  "hashtags": "#paragliding #oludeniz #babadagmountain ..."
}

Return ONLY the JSON, no other text.`,
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const json = JSON.parse(text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
    return NextResponse.json(json)
  } catch {
    return NextResponse.json({ error: 'Failed to parse AI response', raw: text }, { status: 500 })
  }
}
