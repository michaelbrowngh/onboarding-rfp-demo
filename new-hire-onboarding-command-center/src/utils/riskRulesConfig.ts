export interface RiskThresholdConfig {
  criticalSlaRemainingPercent: number
  actionRequiredSlaRemainingPercent: number
  warningSlaRemainingPercent: number
  criticalStartDateDays: number
  warningStartDateDays: number
  staleTicketHours: number
  highCommsCount7Days: number
}

// Threshold assumptions are prototype-only and require SME validation before production use.
export const defaultRiskThresholds: RiskThresholdConfig = {
  criticalSlaRemainingPercent: 20,
  actionRequiredSlaRemainingPercent: 30,
  warningSlaRemainingPercent: 50,
  criticalStartDateDays: 2,
  warningStartDateDays: 5,
  staleTicketHours: 48,
  highCommsCount7Days: 6,
}
