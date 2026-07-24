import type { CandidateCase } from './onboarding'

export type ChecklistStatus = 'missing' | 'in-progress' | 'completed'
export type TaskStatus = 'overdue' | 'due-soon' | 'upcoming'

export interface CustomerChecklistItem {
  id: string
  label: string
  status: ChecklistStatus
}

export interface CustomerSupportContact {
  name: string
  role: string
  avatarPath?: string
  avatarAlt?: string
  email: string
  teamsLabel: string
  availability: string
}

export interface CustomerUpcomingTask {
  id: string
  title: string
  dueLabel: string
  status: TaskStatus
}

export interface ChatSeedMessage {
  author: 'assistant' | 'user'
  text: string
  timeLabel: string
}

export interface ChatIntentRule {
  id: string
  keywords: string[]
  response: string
}

export interface CustomerPortalSeed {
  id: string
  heading: string
  welcome: string
  lastUpdated: string
  completionPercent: number
  progressLabel: string
  currentStage: string
  currentStageStep: string
  tentativeStartDate: string
  daysUntilStart: string
  quickLinks: string[]
  checklist: CustomerChecklistItem[]
  supportContact: CustomerSupportContact
  upcomingTasks: CustomerUpcomingTask[]
  chatSeedMessages: ChatSeedMessage[]
  chatIntentRules: ChatIntentRule[]
}

export interface CandidateOperationsContext {
  severityLabel: CandidateCase['severityLabel']
  statusLabel: string
  riskReason: string
  nextStep: string
  startDateLabel: string
}

export interface CustomerPortalModel extends CustomerPortalSeed {
  operationsContext: CandidateOperationsContext
  missingItemsCount: number
}
