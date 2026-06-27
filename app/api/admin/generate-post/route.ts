import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  const { topic, keyword, category } = await request.json()

  if (!topic) return NextResponse.json({ error: 'Topic required' }, { status: 400 })

  const message = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `You are an SEO content writer for a paragliding company in Ölüdeniz, Turkey (atmosparagliding.com). Write a high-quality, SEO-optimized blog post.

Topic: ${topic}
Target keyword: ${keyword || topic}
Category: ${category || 'Guide'}

Requirements:
- Write in English
- 1000-1800 words
- Use ## for H2 headings, ### for H3 headings
- Use **bold** for key terms
- Include a practical FAQ section at the end with 3-4 questions
- Naturally mention Ölüdeniz, Babadağ Mountain, tandem paragliding
- End with a clear call to action to book a flight
- Tone: friendly, expert, reassuring
- Include internal link suggestions as: [link text](/page-slug)

Return a JSON object with exactly these fields:
{
  "title": "SEO title (under 60 chars)",
  "description": "Meta description (under 155 chars)",
  "slug": "url-friendly-slug",
  "content": "full markdown content",
  "read_time": "X min read",
  "category": "${category || 'Guide'}"
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
