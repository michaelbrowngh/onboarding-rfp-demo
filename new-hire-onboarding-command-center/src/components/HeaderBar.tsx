import styles from './HeaderBar.module.css'

interface HeaderBarProps {
  lastRefreshLabel: string
}

export function HeaderBar({ lastRefreshLabel }: HeaderBarProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.title}>New Hire Onboarding Command Center</h1>
        <div className={styles.actions}>
          <p className={styles.refreshLabel}>Last refreshed: {lastRefreshLabel}</p>
          <button type="button" className={styles.refreshButton}>
            Refresh
          </button>
        </div>
      </div>
    </header>
  )
}
