import type { KpiSnapshot } from '../domain/onboarding'
import styles from './KpiBand.module.css'

interface KpiBandProps {
  kpis: KpiSnapshot[]
  atRiskCount: number
  projectedMissCount: number
}

const riskLabels = {
  critical: 'Critical risk',
  warning: 'Watch closely',
  'on-track': 'On track',
} as const

export function KpiBand({ kpis, atRiskCount, projectedMissCount }: KpiBandProps) {
  return (
    <section className={styles.band} aria-label="Monthly onboarding KPIs">
      <aside className={styles.aggregatePanel} aria-label="Aggregate risk counts">
        <p className={styles.aggregateLabel}>Current queue pressure</p>
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
      </aside>

      <div className={styles.summaryCards}>
        {kpis.map((kpi) => (
          <article key={kpi.id} className={styles.card}>
            <div className={styles.cardTop}>
              <p className={styles.cardLabel}>{kpi.shortLabel}</p>
              <span className={styles.riskPill} data-risk={kpi.riskLevel}>
                {riskLabels[kpi.riskLevel]}
              </span>
            </div>
            <p className={styles.valueRow}>
              <strong>{kpi.compliancePercent}%</strong>
              <span>target {kpi.targetPercent}%</span>
            </p>
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
          </article>
        ))}
      </div>
    </section>
  )
}
