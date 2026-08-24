import { runClaudeAnalyst, runChatGPTAnalyst, runGeminiAnalyst, runPerplexityResearcher } from './analysts'
import { runChallengeAndRecheckLoop } from './challenge-engine'
import { evaluateClaudeJudge } from './judge'
import { AIAnalystResult, AnalysisInput, FinalSEODecision } from './types'

export interface FullMultiAgentSEOResult {
  input: AnalysisInput
  agentResults: AIAnalystResult[]
  recheckHistory: any[]
  rejectedFindings: any[]
  finalDecision: FinalSEODecision
  totalExecutionTimeMs: number
}

export async function runMultiAgentSEOOrchestrator(input: AnalysisInput): Promise<FullMultiAgentSEOResult> {
  const startTime = Date.now()
  console.log(`[Multi-Agent SEO Orchestrator] Starting analysis for URL: ${input.url} | Keyword: ${input.keyword} | Position: ${input.currentPosition}`)

  // 1. Run 4 AI Analysts concurrently
  const [claudeRes, chatGptRes, geminiRes, perplexityRes] = await Promise.all([
    runClaudeAnalyst(input),
    runChatGPTAnalyst(input),
    runGeminiAnalyst(input),
    runPerplexityResearcher(input)
  ])

  const agentResults: AIAnalystResult[] = [claudeRes, chatGptRes, geminiRes, perplexityRes]

  // 2. Run Cross-Examination & Challenge Loop (Max 3 cycles)
  const { recheckHistory, verifiedFindings, rejectedFindings } = await runChallengeAndRecheckLoop(
    agentResults,
    input.url,
    input.currentPosition
  )

  // 3. Claude Final Judge Arbiter
  const finalDecision = evaluateClaudeJudge(
    input.url,
    input.keyword,
    input.currentPosition,
    verifiedFindings,
    rejectedFindings,
    recheckHistory
  )

  const totalExecutionTimeMs = Date.now() - startTime
  console.log(`[Multi-Agent SEO Orchestrator] Analysis complete in ${totalExecutionTimeMs}ms. Decision: ${finalDecision.decision}`)

  return {
    input,
    agentResults,
    recheckHistory,
    rejectedFindings,
    finalDecision,
    totalExecutionTimeMs
  }
}
