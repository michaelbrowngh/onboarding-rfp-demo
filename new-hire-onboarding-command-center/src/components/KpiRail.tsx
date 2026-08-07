import { useState } from 'react'
import type { CandidateCase, KpiSnapshot } from '../domain/onboarding'
import styles from './KpiRail.module.css'

interface KpiRailProps {
  kpis: KpiSnapshot[]
  summary: string
  candidates: CandidateCase[]
  onCandidateAction?: (candidate: CandidateCase, mode: 'ai-action' | 'ai-review') => void
}

type DrilldownBucket = 'near' | 'missed'

interface DrilldownState {
  kpiId: string
  bucket: DrilldownBucket
}

const kpiCandidateMatchers: Record<string, (candidate: CandidateCase) => boolean> = {
  'pipeline-total': () => true,
  'background-initiation': (candidate) => candidate.stepLabel.toLowerCase().includes('background check initiation'),
  'contract-given': (candidate) => candidate.stepLabel.toLowerCase().includes('contract'),
  'visa-initiation': (candidate) =>
    candidate.stepLabel.toLowerCase().includes('immigration') || candidate.stepLabel.toLowerCase().includes('visa'),
  'background-clearance': (candidate) => candidate.stepLabel.toLowerCase().includes('background check clearance'),
  'start-date-confirmed': (candidate) =>
    candidate.stepLabel.toLowerCase().includes('start date') || candidate.stepLabel.toLowerCase().includes('realignment'),
  'mph-entry': (candidate) =>
    candidate.stepLabel.toLowerCase().includes('mph') ||
    candidate.phase.toLowerCase().includes('pre-start') ||
    candidate.stepNumber >= 17,
  'backdated-starts': (candidate) => candidate.stepLabel.toLowerCase().includes('backdated'),
}

const remainingPercent = (candidate: CandidateCase) =>
  (candidate.slaHoursRemaining / candidate.slaWindowHours) * 100

function isProjectedMissCandidate(candidate: CandidateCase, kpi: KpiSnapshot) {
  return (
    candidate.slaHoursRemaining <= 0 ||
    remainingPercent(candidate) <= Math.min(20, kpi.nearSlaPercentThreshold) ||
    candidate.queueCategory === 'critical' ||
    candidate.hasBlockingPrerequisite
  )
}

function selectKpiCandidates(kpi: KpiSnapshot, candidates: CandidateCase[]) {
  const matcher = kpiCandidateMatchers[kpi.id] ?? (() => true)
  const scoped = candidates
    .filter(matcher)
    .sort((a, b) => remainingPercent(a) - remainingPercent(b))

  const projected: CandidateCase[] = []
  for (const candidate of scoped) {
    if (isProjectedMissCandidate(candidate, kpi)) {
      projected.push(candidate)
    }
  }
  for (const candidate of scoped) {
    if (projected.length >= Math.max(1, kpi.projectedMissCount)) {
      break
    }
    if (!projected.some((item) => item.id === candidate.id)) {
      projected.push(candidate)
    }
  }

  const near: CandidateCase[] = []
  for (const candidate of scoped) {
    if (projected.some((item) => item.id === candidate.id)) {
      continue
    }
    const candidateRemaining = remainingPercent(candidate)
    if (candidate.slaHoursRemaining > 0 && candidateRemaining <= kpi.nearSlaPercentThreshold) {
      near.push(candidate)
    }
  }
  for (const candidate of scoped) {
    if (near.length >= Math.max(1, kpi.nearSlaCount)) {
      break
    }
    if (!projected.some((item) => item.id === candidate.id) && !near.some((item) => item.id === candidate.id)) {
      near.push(candidate)
    }
  }

  return {
    near: near.slice(0, Math.max(1, kpi.nearSlaCount)),
    missed: projected.slice(0, Math.max(1, kpi.projectedMissCount)),
  }
}

export default function KpiRail({ kpis, summary, candidates, onCandidateAction }: KpiRailProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [drilldown, setDrilldown] = useState<DrilldownState | undefined>(undefined)

  const getRiskValueClass = (riskLevel: KpiSnapshot['riskLevel']) => {
    if (riskLevel === 'critical') {
      return styles.kpiValueCritical
    }

    if (riskLevel === 'warning') {
      return styles.kpiValueWarning
    }

    return styles.kpiValueOnTrack
  }

  return (
    <div className={styles.rail}>
      <div className={styles.headingBlock}>
        <span className={styles.headingLabel}>KPI Overview</span>
      </div>

      <div className={styles.summaryBlock}>
        <span className={styles.summaryLabel}>AI Summary</span>
        <p className={styles.summaryText}>{summary}</p>
      </div>

      {kpis.map((kpi) => {
        const totalCandidates = kpi.onTrackCount + kpi.nearSlaCount + kpi.projectedMissCount
        const kpiCandidates = selectKpiCandidates(kpi, candidates)
        const activeBucket = drilldown?.kpiId === kpi.id ? drilldown.bucket : undefined
        const drilldownCandidates = activeBucket ? kpiCandidates[activeBucket] : []

        return (
          <div
            key={kpi.id}
            className={styles.kpiCard}
            onClick={() => {
              setExpandedId(kpi.id === expandedId ? null : kpi.id)
              setDrilldown(undefined)
            }}
          >
            <div className={styles.kpiCardCompact}>
              <span className={styles.kpiLabel}>{kpi.shortLabel}</span>
              <span className={`${styles.kpiValue} ${getRiskValueClass(kpi.riskLevel)}`}>
                {kpi.compliancePercent}%
              </span>
            </div>
            <div className={styles.kpiBottomRow}>
              <div className={styles.kpiCompactNote}>
                <span className={styles.nearSlaHighlight}>{kpi.nearSlaCount}/{totalCandidates}</span> within {kpi.nearSlaPercentThreshold}% of SLA
              </div>
              <span className={styles.targetDisplay}>Target: {kpi.targetPercent}%</span>
            </div>
            {expandedId === kpi.id && (
              <div className={styles.kpiExpanded}>
                <div className={styles.equationBlock}>
                  <div className={styles.equationRow}>
                    <span className={styles.equationLabel}>On-track</span>
                    <span className={`${styles.equationValue} ${styles.kpiValueOnTrack}`}>{kpi.onTrackCount}</span>
                  </div>
                  <div className={styles.equationRow}>
                    <span className={styles.equationLabel}>Near SLA</span>
                    <button
                      type="button"
                      className={`${styles.equationCountButton} ${styles.kpiValueWarning}`}
                      onClick={(event) => {
                        event.stopPropagation()
                        setDrilldown({ kpiId: kpi.id, bucket: 'near' })
                      }}
                    >
                      {kpi.nearSlaCount}
                    </button>
                  </div>
                  <div className={styles.equationRow}>
                    <span className={styles.equationLabel}>Missed SLA</span>
                    <button
                      type="button"
                      className={`${styles.equationCountButton} ${styles.kpiValueCritical}`}
                      onClick={(event) => {
                        event.stopPropagation()
                        setDrilldown({ kpiId: kpi.id, bucket: 'missed' })
                      }}
                    >
                      {kpi.projectedMissCount}
                    </button>
                  </div>
                  <div className={styles.equationDivider} />
                  <div className={styles.equationRow}>
                    <span className={styles.equationLabel}>Total</span>
                    <span className={styles.equationTotal}>{totalCandidates}</span>
                  </div>
                </div>

                {activeBucket && (
                  <section
                    className={styles.kpiDrilldown}
                    aria-label={`${kpi.shortLabel} ${activeBucket === 'near' ? 'near SLA' : 'missed SLA'} candidates`}
                  >
                    <p className={styles.kpiDrilldownTitle}>
                      {activeBucket === 'near' ? 'Near SLA candidates' : 'Projected/missed SLA candidates'}
                    </p>
                    {drilldownCandidates.length === 0 ? (
                      <p className={styles.kpiDrilldownEmpty}>No candidates currently mapped to this KPI bucket.</p>
                    ) : (
                      <div className={styles.kpiDrilldownList}>
                        {drilldownCandidates.map((candidate) => (
                          <article key={candidate.id} className={styles.kpiCandidateCard}>
                            <div className={styles.kpiCandidateTop}>
                              <span className={styles.kpiCandidateName}>{candidate.candidateName}</span>
                              <span className={styles.kpiCandidateBadge}>{candidate.badgeLabel}</span>
                            </div>
                            <p className={styles.kpiCandidateRisk}>{candidate.riskReason}</p>
                            <div className={styles.kpiCandidateActions}>
                              {candidate.actionMode === 'none' ? (
                                <span className={styles.kpiNoAction}>No action required</span>
                              ) : (
                                <button
                                  type="button"
                                  className={styles.kpiReviewButton}
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    onCandidateAction?.(candidate, 'ai-review')
                                  }}
                                >
                                  Review with AI
                                </button>
                              )}
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </section>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

