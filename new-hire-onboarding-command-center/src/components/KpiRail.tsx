import { useState } from 'react'
import type { KpiSnapshot } from '../domain/onboarding'
import styles from './KpiRail.module.css'

interface KpiRailProps {
  kpis: KpiSnapshot[]
  summary: string
}

export default function KpiRail({ kpis, summary }: KpiRailProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

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

        return (
          <div
            key={kpi.id}
            className={styles.kpiCard}
            onClick={() => setExpandedId(kpi.id === expandedId ? null : kpi.id)}
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
                    <span className={`${styles.equationValue} ${styles.kpiValueWarning}`}>{kpi.nearSlaCount}</span>
                  </div>
                  <div className={styles.equationRow}>
                    <span className={styles.equationLabel}>Missed SLA</span>
                    <span className={`${styles.equationValue} ${styles.kpiValueCritical}`}>{kpi.projectedMissCount}</span>
                  </div>
                  <div className={styles.equationDivider} />
                  <div className={styles.equationRow}>
                    <span className={styles.equationLabel}>Total</span>
                    <span className={styles.equationTotal}>{totalCandidates}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

