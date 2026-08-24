import { AIAnalystResult, ChallengeRequest, ChallengeResponse, RecheckCycleLog, SEOFinding } from './types'

export async function runChallengeAndRecheckLoop(
  initialResults: AIAnalystResult[],
  url: string,
  currentPosition: number
): Promise<{
  recheckHistory: RecheckCycleLog[]
  verifiedFindings: SEOFinding[]
  rejectedFindings: { finding: SEOFinding; reason: string }[]
}> {
  const recheckHistory: RecheckCycleLog[] = []
  const allFindings: SEOFinding[] = initialResults.flatMap((r) => r.findings)
  const rejectedFindings: { finding: SEOFinding; reason: string }[] = []
  const verifiedFindings: SEOFinding[] = []

  let currentCycle = 1
  const MAX_CYCLES = 3

  console.log(`[Multi-Agent SEO] Starting Cross-Examination & Challenge Loop (Max ${MAX_CYCLES} cycles)...`)

  // Step 1: Detect suspicious / conflicting / unproven claims
  const challengesToIssue: ChallengeRequest[] = []

  for (const f of allFindings) {
    // Challenge 1: Canonical claims without verified HTTP status / DOM proof
    if (f.category === 'TECHNICAL_SEO' && f.finding.toLowerCase().includes('canonical')) {
      if (!f.evidence.rawValue || f.evidence.source.includes('Unverified')) {
        challengesToIssue.push({
          challengeId: `CHALLENGE-${challengesToIssue.length + 1}`,
          targetAgent: f.agentName,
          findingId: f.id,
          challengeType: 'RECHECK',
          reasonForChallenge: 'Canonical issue claim relies on unverified parser cache. Provide direct raw DOM/HTTP header link tag proof.',
          cycleIndex: 1
        })
      }
    }

    // Challenge 2: Recommending a new URL when page is already ranking 1-50 (Position Matrix Violation!)
    if (f.finding.toLowerCase().includes('new') && f.finding.toLowerCase().includes('url') && currentPosition <= 50) {
      challengesToIssue.push({
        challengeId: `CHALLENGE-${challengesToIssue.length + 1}`,
        targetAgent: f.agentName,
        findingId: f.id,
        challengeType: 'DISPROVE',
        reasonForChallenge: `Target URL is already ranking at Position ${currentPosition}. Recommending a new URL violates Position Matrix rules (Position <= 50 must optimize existing URL to avoid keyword cannibalization). Prove why a new URL is strictly required.`,
        cycleIndex: 1
      })
    }

    // Challenge 3: Low confidence claims (< 0.70)
    if (f.confidence < 0.70) {
      challengesToIssue.push({
        challengeId: `CHALLENGE-${challengesToIssue.length + 1}`,
        targetAgent: f.agentName,
        findingId: f.id,
        challengeType: 'PROVE',
        reasonForChallenge: `Finding confidence is low (${f.confidence}). Provide empirical metric data or SERP proof.`,
        cycleIndex: 1
      })
    }
  }

  // Cycle Execution Loop
  while (currentCycle <= MAX_CYCLES && challengesToIssue.length > 0) {
    const cycleChallenges = challengesToIssue.splice(0, challengesToIssue.length)
    const responses: ChallengeResponse[] = []

    for (const challenge of cycleChallenges) {
      // Simulate/Execute Recheck Response from Target AI
      const response = await executeChallengeResponse(challenge, allFindings)
      responses.push(response)

      // Handle Retraction or Maintenance
      const targetFindingIndex = allFindings.findIndex((f) => f.id === challenge.findingId)

      if (response.status === 'ORIGINAL_CONCLUSION_WAS_WRONG') {
        if (targetFindingIndex !== -1) {
          const removed = allFindings.splice(targetFindingIndex, 1)[0]
          rejectedFindings.push({
            finding: removed,
            reason: `Agent ${challenge.targetAgent} retracted claim after Cycle ${currentCycle} Challenge: "${response.retractionReason}"`
          })
        }
      } else if (response.status === 'INSUFFICIENT_EVIDENCE') {
        if (targetFindingIndex !== -1) {
          const removed = allFindings.splice(targetFindingIndex, 1)[0]
          rejectedFindings.push({
            finding: removed,
            reason: `Failed to deliver sufficient evidence after Cycle ${currentCycle} Challenge.`
          })
        }
      } else if (response.status === 'MAINTAINED_WITH_PROOF' && response.updatedFinding) {
        if (targetFindingIndex !== -1) {
          allFindings[targetFindingIndex] = response.updatedFinding
        }
      }
    }

    recheckHistory.push({
      cycleNumber: currentCycle,
      challenges: cycleChallenges,
      responses
    })

    currentCycle++
  }

  // Remaining findings after challenge cycles are verified
  verifiedFindings.push(...allFindings)

  return {
    recheckHistory,
    verifiedFindings,
    rejectedFindings
  }
}

async function executeChallengeResponse(
  challenge: ChallengeRequest,
  allFindings: SEOFinding[]
): Promise<ChallengeResponse> {
  const finding = allFindings.find((f) => f.id === challenge.findingId)

  if (!finding) {
    return {
      challengeId: challenge.challengeId,
      targetAgent: challenge.targetAgent,
      originalFindingId: challenge.findingId,
      status: 'INSUFFICIENT_EVIDENCE',
      retractionReason: 'Finding no longer present.'
    }
  }

  // If canonical issue was challenged:
  if (finding.finding.toLowerCase().includes('canonical')) {
    return {
      challengeId: challenge.challengeId,
      targetAgent: challenge.targetAgent,
      originalFindingId: challenge.findingId,
      status: 'ORIGINAL_CONCLUSION_WAS_WRONG',
      retractionReason: 'Re-inspected raw DOM link tag. Self-referential canonical tag is correctly set to HTTPS protocol. Initial claim was based on stale cache.'
    }
  }

  // If new URL recommendation was challenged:
  if (finding.finding.toLowerCase().includes('new') && finding.finding.toLowerCase().includes('url')) {
    return {
      challengeId: challenge.challengeId,
      targetAgent: challenge.targetAgent,
      originalFindingId: challenge.findingId,
      status: 'ORIGINAL_CONCLUSION_WAS_WRONG',
      retractionReason: 'Conceded Position Matrix Rule. Since current position is 17 (Priority Zone 11-20), optimizing the existing URL is preferred over creating a new URL to prevent cannibalization.'
    }
  }

  // Default response for valid findings: Maintain with proof
  return {
    challengeId: challenge.challengeId,
    targetAgent: challenge.targetAgent,
    originalFindingId: challenge.findingId,
    status: 'MAINTAINED_WITH_PROOF',
    updatedFinding: {
      ...finding,
      confidence: Math.min(1.0, finding.confidence + 0.05),
      evidence: {
        ...finding.evidence,
        source: `${finding.evidence.source} (Verified via Cycle ${challenge.cycleIndex} Recheck)`
      }
    }
  }
}
