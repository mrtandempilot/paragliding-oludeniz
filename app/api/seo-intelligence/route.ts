import { NextResponse } from 'next/server'
import { runMultiAgentSEOOrchestrator } from '@/agents/multi-agent-seo/orchestrator'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { url, keyword, position, htmlSnippet } = body

    if (!url || !keyword) {
      return NextResponse.json(
        { error: 'Missing required parameters: url and keyword are required.' },
        { status: 400 }
      )
    }

    const currentPosition = Number(position) || 15

    const result = await runMultiAgentSEOOrchestrator({
      url,
      keyword,
      currentPosition,
      htmlSnippet
    })

    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    console.error('[API /api/seo-intelligence] Execution Error:', error)
    return NextResponse.json(
      { error: 'Failed to run Multi-Agent SEO Analysis', details: error?.message || String(error) },
      { status: 500 }
    )
  }
}
