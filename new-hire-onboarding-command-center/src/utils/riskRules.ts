import type { CandidateCase, KpiSnapshot, QueueCategory } from '../domain/onboarding'
import type { RiskThresholdConfig } from './riskRulesConfig'
import { defaultRiskThresholds } from './riskRulesConfig'

const ratioRemaining = (candidate: CandidateCase) =>
  (candidate.slaHoursRemaining / candidate.slaWindowHours) * 100

export function classifyCandidateCase(
  candidate: CandidateCase,
  thresholds: RiskThresholdConfig = defaultRiskThresholds,
): QueueCategory {
  const remainingPercent = ratioRemaining(candidate)
  const startDateDays = Number.parseInt(candidate.startDateLabel.split(' ')[2] ?? '99', 10)

  if (
    (startDateDays <= thresholds.criticalStartDateDays && candidate.hasBlockingPrerequisite) ||
    remainingPercent <= thresholds.criticalSlaRemainingPercent
  ) {
    return 'critical'
  }

  if (
    candidate.waitingOnHuman ||
    remainingPercent <= thresholds.actionRequiredSlaRemainingPercent
  ) {
    return 'action-required'
  }

  if (
    candidate.negativeSentiment ||
    candidate.unresolvedComms7Days >= thresholds.highCommsCount7Days ||
    candidate.staleHours >= thresholds.staleTicketHours ||
    remainingPercent <= thresholds.warningSlaRemainingPercent ||
    startDateDays <= thresholds.warningStartDateDays
  ) {
    return 'warning'
  }

  return 'on-track'
}

export function countQueueDistribution(candidates: CandidateCase[]) {
  return candidates.reduce(
    (accumulator, candidate) => {
      accumulator[candidate.queueCategory] += 1
      return accumulator
    },
    {
      critical: 0,
      'action-required': 0,
      warning: 0,
      'on-track': 0,
    } satisfies Record<QueueCategory, number>,
  )
}

export function summarizeKpiRisk(kpis: KpiSnapshot[]) {
  return kpis.reduce(
    (accumulator, kpi) => {
      accumulator.atRisk += kpi.nearSlaCount
      accumulator.projectedMiss += kpi.projectedMissCount
      return accumulator
    },
    { atRisk: 0, projectedMiss: 0 },
  )
}
