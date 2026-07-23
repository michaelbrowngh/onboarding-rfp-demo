import type { CandidateCase, FollowUpStep } from '../domain/onboarding'
import { candidateCases } from '../data/candidateCases'
import { kpiSnapshots } from '../data/kpiSnapshots'

export interface AgentResponse {
  text: string
  delayMs: number
}

export function getMockGeneralChatResponse(prompt: string): AgentResponse {
  const normalizedPrompt = prompt.toLowerCase()

  // Prompt 1: Critical candidates
  if (normalizedPrompt.includes('critical')) {
    const criticalCandidates = candidateCases.filter(
      (c) => c.severityLabel === 'Critical'
    )
    const list = criticalCandidates
      .map((c) => `- **${c.candidateName}** — ${c.statusLabel} (${c.slaHoursRemaining}h remaining)`)
      .join('\n')
    return {
      text: `There are **${criticalCandidates.length} candidates** in critical status:\n\n${list}\n\nI recommend reviewing their next steps immediately.`,
      delayMs: 800,
    }
  }

  // Prompt 2: KPI misses
  if (normalizedPrompt.includes('kpi') || normalizedPrompt.includes('miss')) {
    const topMissKpis = [...kpiSnapshots]
      .sort((a, b) => b.projectedMissCount - a.projectedMissCount)
      .slice(0, 3)
    const tableRows = topMissKpis
      .map((k) => `${k.label} | ${k.compliancePercent}% | ${k.projectedMissCount}`)
      .join('\n')
    return {
      text:
        `Here are the KPIs with the largest projected misses:\n\n` +
        `KPI | Compliance | Projected Misses\n` +
        `---|---|---\n` +
        `${tableRows}\n\n` +
        `To minimize misses, focus on the candidates in the critical and action-required queues.`,
      delayMs: 900,
    }
  }

  // Prompt 3: Pending actions
  if (normalizedPrompt.includes('pending') || normalizedPrompt.includes('action')) {
    const actionRequiredCandidates = candidateCases.filter(
      (c) => c.queueCategory === 'action-required'
    )
    const list = actionRequiredCandidates
      .map((c) => `- **${c.candidateName}** — ${c.nextStep}`)
      .join('\n')
    return {
      text: `There are **${actionRequiredCandidates.length} candidates** in the action-required queue:\n\n${list}`,
      delayMs: 750,
    }
  }

  // Fallback
  return {
    text: `I'm here to help with your onboarding operations. Ask me about candidates in critical status, KPI projections, or pending actions.`,
    delayMs: 500,
  }
}

export function getMockCandidateResponse(
  candidate: CandidateCase,
  prompt: string
): AgentResponse {
  const normalizedPrompt = prompt.toLowerCase()

  // Summarize candidate status
  if (normalizedPrompt.includes('summarize') || normalizedPrompt.includes('status')) {
    const slaText =
      candidate.slaHoursRemaining <= 0
        ? 'expired'
        : `${candidate.slaHoursRemaining}h remaining of ${candidate.slaWindowHours}h`
    const text =
      `**${candidate.candidateName}** — ${candidate.severityLabel}\n\n` +
      `- **Step:** ${candidate.stepLabel} (${candidate.badgeLabel})\n` +
      `- **Status:** ${candidate.statusLabel}\n` +
      `- **Risk:** ${candidate.riskReason}\n` +
      `- **SLA:** ${slaText}\n\n` +
      `**Next step: ${candidate.nextStep}**\n\n` +
      `${candidate.riskReason} Taking this step now addresses that risk directly and keeps the case on track before the SLA window closes. If there's no response within ${candidate.slaHoursRemaining}h, escalate to the hiring manager.`
    return { text, delayMs: 700 }
  }

  // Explain risk / review the case
  if (
    normalizedPrompt.includes('risk') ||
    normalizedPrompt.includes('review') ||
    normalizedPrompt.includes('explain')
  ) {
    const text =
      `**${candidate.candidateName}** is flagged as **${candidate.severityLabel}** at ${candidate.stepLabel} (${candidate.badgeLabel}).\n\n` +
      `${candidate.riskReason}\n\n` +
      `**Recommended options:**\n` +
      `- ${candidate.nextStep}\n` +
      `- Escalate to the hiring manager if there's no response within ${candidate.slaHoursRemaining}h.\n` +
      `- Monitor the case until the SLA window closes (${candidate.slaWindowHours}h total).`
    return { text, delayMs: 850 }
  }

  // Take follow-up action (will trigger step UI separately)
  if (normalizedPrompt.includes('follow-up') || normalizedPrompt.includes('action')) {
    return {
      text: `I'll help you with the next steps for **${candidate.candidateName}**. Starting now…`,
      delayMs: 600,
    }
  }

  // Fallback
  return {
    text: `I can help you with **${candidate.candidateName}**'s case. Would you like me to summarize their status or take a follow-up action?`,
    delayMs: 500,
  }
}

// Step definitions for Joseph Brown: Send email (2 steps)
// For case-001 (Joseph Brown)
export function getJosephBrownEmailSteps(): FollowUpStep[] {
  return [
    {
      id: 'step-1-draft',
      label: 'Review email draft',
      status: 'pending' as const,
      draftEmail: `Subject: Contract & Start Date Confirmation - Action Needed

Hi Joseph,

I hope you're doing well. We're excited to welcome you to the team! However, we need to confirm a few items before your start date in 2 days:

1. **Employment Contract**: Your contract is still unsigned. Can you please review and sign it by EOD today?
2. **Right-to-Work Documentation**: We're missing your right-to-work attachment. Please submit this as soon as possible.

Given your start date is in 2 days, please treat this as urgent. Let me know if you have any questions.

Best regards,
Onboarding Team`,
    },
    {
      id: 'step-2-send',
      label: 'Send email',
      status: 'pending' as const,
    },
  ]
}

// Step definitions for action-required candidate: Change start date in 3 systems
// Will be assigned to one of the action-required candidates (e.g., a new one or modify existing)
export function getStartDateChangeSteps(): FollowUpStep[] {
  return [
    {
      id: 'step-1-ats',
      label: 'Update ATS system',
      status: 'pending' as const,
    },
    {
      id: 'step-2-hris',
      label: 'Update HRIS system',
      status: 'pending' as const,
    },
    {
      id: 'step-3-crm',
      label: 'Update CRM assignment',
      status: 'pending' as const,
    },
  ]
}

export function getFollowUpCompletionResponse(
  candidate: CandidateCase,
  actionType: 'email' | 'date-change'
): AgentResponse {
  if (actionType === 'email') {
    return {
      text: `**Email sent** to ${candidate.candidateName}. I've documented the communication and updated their case status. Keep an eye on their response over the next 24 hours.`,
      delayMs: 600,
    }
  } else if (actionType === 'date-change') {
    return {
      text: `**Start date updated** across all three systems for ${candidate.candidateName}. ATS, HRIS, and CRM are now synchronized. You're all set!`,
      delayMs: 700,
    }
  }
  return { text: 'Follow-up action completed.', delayMs: 500 }
}

export function getInitialFollowUpSteps(
  candidate: CandidateCase
): FollowUpStep[] {
  // Joseph Brown: email (case-001)
  if (candidate.id === 'case-001') {
    return getJosephBrownEmailSteps()
  }

  // Action-required candidate with date-change (check nextStep)
  if (
    candidate.queueCategory === 'action-required' &&
    candidate.nextStep.toLowerCase().includes('start date')
  ) {
    return getStartDateChangeSteps()
  }

  // Default fallback
  return [
    {
      id: 'step-1',
      label: 'Prepare action',
      status: 'pending',
    },
    {
      id: 'step-2',
      label: 'Execute action',
      status: 'pending',
    },
  ]
}

// Builds a pre-created prompt seeded with candidate context for the "Review with AI" action.
// The prompt is placed in the composer for the user to review and send, not submitted automatically.
export function buildCandidateReviewPrompt(candidate: CandidateCase): string {
  return `Summarize the status of candidate ${candidate.candidateName}.`
}
