import { useState } from 'react'
import type { KpiSnapshot } from '../domain/onboarding'
import styles from './KpiBand.module.css'

interface KpiBandProps {
  kpis: KpiSnapshot[]
  atRiskCount: number
  projectedMissCount: number
  summary: string
}

const riskLabels = {
  critical: 'Critical risk',
  warning: 'Watch closely',
  'on-track': 'On track',
} as const

export function KpiBand({
  kpis,
  atRiskCount,
  projectedMissCount,
  summary,
}: KpiBandProps) {
  const [expandedKpiIds, setExpandedKpiIds] = useState<string[]>([])

  const toggleKpi = (kpiId: string) => {
    setExpandedKpiIds((currentIds) =>
      currentIds.includes(kpiId)
        ? currentIds.filter((id) => id !== kpiId)
        : [...currentIds, kpiId],
    )
  }

  return (
    <section className={styles.band} aria-label="Monthly onboarding KPIs">
      <aside className={styles.aggregatePanel} aria-label="Aggregate risk counts">
        <div className={styles.aggregateTopRow}>
          <p className={styles.aggregateLabel}>Current queue pressure + AI signal</p>
          <div className={styles.aggregateGrid}>
            <div>
              <span className={styles.aggregateValue}>{atRiskCount}</span>
              <span className={styles.aggregateCaption}>Approaching SLA</span>
            </div>
            <div>
              <span className={styles.aggregateValue}>{projectedMissCount}</span>
              <span className={styles.aggregateCaption}>Projected misses</span>
            </div>
          </div>
        </div>
        <p className={styles.aggregateSummary}>{summary}</p>
      </aside>

      <div className={styles.summaryCards}>
        {kpis.map((kpi) => {
          const isExpanded = expandedKpiIds.includes(kpi.id)
          const detailsId = `kpi-details-${kpi.id}`

          return (
            <article
              key={kpi.id}
              className={styles.card}
              data-expanded={isExpanded}
            >
              <button
                type="button"
                className={styles.compactRow}
                aria-expanded={isExpanded}
                aria-controls={detailsId}
                onClick={() => toggleKpi(kpi.id)}
              >
                <span className={styles.compactLabel}>{kpi.shortLabel}</span>
                <span className={styles.compactMeta}>
                  <strong className={styles.compactValue}>{kpi.compliancePercent}%</strong>
                  <span className={styles.riskPill} data-risk={kpi.riskLevel}>
                    {riskLabels[kpi.riskLevel]}
                  </span>
                  <span className={styles.expandIndicator}>
                    {isExpanded ? 'Hide' : 'Details'}
                    <span className={styles.expandChevron} aria-hidden="true" />
                  </span>
                </span>
              </button>

              {isExpanded ? (
                <div id={detailsId} className={styles.detailsPanel}>
                  <p className={styles.targetLabel}>target {kpi.targetPercent}%</p>
                  <dl className={styles.stats}>
                    <div>
                      <dt>Near SLA</dt>
                      <dd>{kpi.nearSlaCount}</dd>
                    </div>
                    <div>
                      <dt>Projected miss</dt>
                      <dd>{kpi.projectedMissCount}</dd>
                    </div>
                  </dl>
                  <p className={styles.trend}>{kpi.trendLabel}</p>
                </div>
              ) : null}
            </article>
          )
        })}
      </div>
    </section>
  )
}
