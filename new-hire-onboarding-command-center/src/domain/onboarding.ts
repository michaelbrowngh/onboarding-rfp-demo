export type QueueCategory = 'critical' | 'action-required' | 'warning' | 'on-track'

export type ActionMode = 'automation' | 'assistant' | 'none'

export interface KpiSnapshot {
  id: string
  label: string
  shortLabel: string
  compliancePercent: number
  targetPercent: number
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
}

export interface AssistantContext {
  heading: string
  status: string
  summary: string
  suggestedActions: string[]
  guardrailNote: string
}
