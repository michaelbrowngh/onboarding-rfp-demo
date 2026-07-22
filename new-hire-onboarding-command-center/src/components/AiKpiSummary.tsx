import styles from './KpiBand.module.css'

interface AiKpiSummaryProps {
  summary: string
}

export function AiKpiSummary({ summary }: AiKpiSummaryProps) {
  return (
    <section className={styles.aiSummary} aria-label="AI KPI summary">
      <p className={styles.aiLabel}>AI-generated KPI summary</p>
      <p className={styles.aiText}>{summary}</p>
    </section>
  )
}
