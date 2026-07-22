import styles from './HeaderBar.module.css'

interface HeaderBarProps {
  lastRefreshLabel: string
  reportingPeriod: string
}

export function HeaderBar({ lastRefreshLabel, reportingPeriod }: HeaderBarProps) {
  return (
    <header className={styles.header}>
      <div>
        <p className={styles.eyebrow}>Onboarding Operations Workspace</p>
        <h1 className={styles.title}>New Hire Onboarding Operations Command Center</h1>
        <div className={styles.metaRow}>
          <span className={styles.prototypeBadge}>Prototype - Synthetic data</span>
          <span className={styles.periodChip}>{reportingPeriod}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <p className={styles.refreshLabel}>Last refreshed: {lastRefreshLabel}</p>
        <button type="button" className={styles.refreshButton}>
          Refresh Snapshot
        </button>
      </div>
    </header>
  )
}
