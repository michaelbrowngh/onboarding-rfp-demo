import { useState } from 'react'
import type { KpiSnapshot } from '../domain/onboarding'
import styles from './KpiRail.module.css'

interface KpiRailProps {
  kpis: KpiSnapshot[]
  atRiskCount: number
  projectedMissCount: number
  summary: string
}

export default function KpiRail({ kpis, atRiskCount, projectedMissCount, summary }: KpiRailProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className={styles.rail}>
      <div className={styles.queuePressure}>
        <div className={styles.pressureStat}>
          <span className={styles.pressureLabel}>Approaching SLA:</span>
          <span className={styles.pressureValue}>{atRiskCount}</span>
        </div>
        <div className={styles.pressureStat}>
          <span className={styles.pressureLabel}>Projected misses:</span>
          <span className={styles.pressureValue}>{projectedMissCount}</span>
        </div>
      </div>

      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          className={styles.kpiCard}
          onClick={() => setExpandedId(kpi.id === expandedId ? null : kpi.id)}
        >
          <div className={styles.kpiCardCompact}>
            <span className={styles.kpiLabel}>{kpi.shortLabel}</span>
            <span className={styles.kpiPill} data-risk={kpi.riskLevel}>{kpi.riskLevel}</span>
            <span className={styles.kpiValue}>{kpi.compliancePercent}%</span>
          </div>
          {expandedId === kpi.id && (
            <div className={styles.kpiExpanded}>
              <div className={styles.kpiExpandedRow}>
                <span>target: {kpi.targetPercent}%</span>
              </div>
              <div className={styles.kpiExpandedRow}>
                <span>Near SLA: {kpi.nearSlaCount}</span>
                <span>Miss: {kpi.projectedMissCount}</span>
              </div>
              <div className={styles.kpiExpandedRow}>
                <span>{kpi.trendLabel}</span>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className={styles.summaryBlock}>
        <span className={styles.summaryLabel}>AI Summary</span>
        <p>{summary}</p>
      </div>
    </div>
  )
}
