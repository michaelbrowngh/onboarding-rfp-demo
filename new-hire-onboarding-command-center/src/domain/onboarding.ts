export type QueueCategory = 'critical' | 'action-required' | 'warning' | 'on-track'

// 'automation' = the web app performs the action directly (no assistant involved).
// 'ai-action' = a prompt is generated and submitted to the assistant, which executes the task.
// 'ai-review' = a prompt is generated in the assistant composer for the user to review/send.
// 'none' = no action is needed.
export type ActionMode = 'automation' | 'ai-action' | 'ai-review' | 'none'

export interface FollowUpStep {
  id: string
  label: string
  status: 'pending' | 'executing' | 'completed'
  draftEmail?: string
  completedAt?: Date
}

export interface KpiSnapshot {
  id: string
  label: string
  shortLabel: string
  compliancePercent: number
  targetPercent: number
  slaWindowHours: number
  nearSlaPercentThreshold: number
  onTrackCount: number
  nearSlaCount: number
  projectedMissCount: number
  trendLabel: string
  riskLevel: 'critical' | 'warning' | 'on-track'
}

export interface SlaDefinition {
  id: string
  label: string
  windowHours: number
  targetPercent: number
}

export interface CandidateCase {
  id: string
  candidateName: string
  queueCategory: QueueCategory
  actionMode: ActionMode
  phase: string
  stepNumber: number
  stepLabel: string
  statusLabel: string
  severityLabel: 'Critical' | 'Action Required' | 'Warning' | 'On Track'
  riskReason: string
  nextStep: string
  startDateLabel: string
  slaHoursRemaining: number
  slaWindowHours: number
  unresolvedComms7Days: number
  staleHours: number
  hasBlockingPrerequisite: boolean
  waitingOnHuman: boolean
  negativeSentiment: boolean
  badgeLabel: string
  actionDetail: string
}

export interface AssistantContext {
  heading: string
  status: string
  summary: string
  suggestedActions: string[]
  guardrailNote: string
}
