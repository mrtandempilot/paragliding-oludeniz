export type ConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH'
export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type SEOCategory = 'TECHNICAL_SEO' | 'ON_PAGE_SEO' | 'CONTENT' | 'SERP_PERFORMANCE'
export type ChallengeType = 'RECHECK' | 'PROVE' | 'DISPROVE' | 'FIND_COUNTER_EVIDENCE' | 'VERIFY' | 'COMPARE' | 'RESEARCH'
export type DecisionType = 'OPTIMIZE_EXISTING_PAGE' | 'CREATE_NEW_URL' | 'NO_ACTION' | 'REDIRECT_URL' | 'CANONICAL_UPDATE'

export interface SEOEvidence {
  type: 'DOM_INSPECTION' | 'HTTP_HEADER' | 'SERP_SNIPPET' | 'METRIC_DATA' | 'COMPETITOR_COMPARISON' | 'DOCUMENTATION'
  rawValue: string
  expectedValue?: string
  source: string
}

export interface SEOFinding {
  id: string
  agentName: 'Claude' | 'ChatGPT' | 'Gemini' | 'Perplexity'
  category: SEOCategory
  finding: string
  reason: string
  evidence: SEOEvidence
  confidence: number // 0.00 - 1.00
  severity: SeverityLevel
  recommendation: string
}

export interface AIAnalystResult {
  agentName: 'Claude' | 'ChatGPT' | 'Gemini' | 'Perplexity'
  findings: SEOFinding[]
  summary: string
  executionTimeMs: number
}

export interface ChallengeRequest {
  challengeId: string
  targetAgent: 'Claude' | 'ChatGPT' | 'Gemini' | 'Perplexity'
  findingId: string
  challengeType: ChallengeType
  reasonForChallenge: string
  cycleIndex: number // 1, 2, or 3
}

export interface ChallengeResponse {
  challengeId: string
  targetAgent: 'Claude' | 'ChatGPT' | 'Gemini' | 'Perplexity'
  originalFindingId: string
  status: 'MAINTAINED_WITH_PROOF' | 'ORIGINAL_CONCLUSION_WAS_WRONG' | 'INSUFFICIENT_EVIDENCE'
  updatedFinding?: SEOFinding
  retractionReason?: string
  additionalEvidence?: SEOEvidence
}

export interface RecheckCycleLog {
  cycleNumber: number
  challenges: ChallengeRequest[]
  responses: ChallengeResponse[]
}

export interface SEODisagreement {
  topic: string
  agentPositions: Record<string, string>
  judgeDecision: 'ACCEPT' | 'REJECT'
  reason: string
}

export interface FinalSEODecision {
  keyword: string
  url: string
  currentPosition: number
  decision: DecisionType
  reasoning: string
  doList: string[]
  doNotList: string[]
  agreementsSummary: string[]
  disagreements: SEODisagreement[]
  recheckHistory: RecheckCycleLog[]
  confidenceScore: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  timestamp: string
}

export interface AnalysisInput {
  url: string
  keyword: string
  currentPosition: number
  htmlSnippet?: string
  targetLanguage?: string
}
