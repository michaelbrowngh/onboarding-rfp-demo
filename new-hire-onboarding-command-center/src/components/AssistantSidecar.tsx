import type { AssistantContext } from '../domain/onboarding'
import styles from './AssistantSidecar.module.css'

interface AssistantSidecarProps {
  context: AssistantContext
}

export function AssistantSidecar({ context }: AssistantSidecarProps) {
  return (
    <aside className={styles.sidecar} aria-label="Assistant sidecar">
      <div className={styles.shellHeader}>
        <p className={styles.eyebrow}>Docked assistant shell</p>
        <h2 className={styles.title}>{context.heading}</h2>
        <span className={styles.statusPill}>{context.status}</span>
      </div>

      <section className={styles.panel}>
        <h3 className={styles.panelTitle}>Current summary</h3>
        <p className={styles.summary}>{context.summary}</p>
      </section>

      <section className={styles.panel}>
        <h3 className={styles.panelTitle}>Prepared options</h3>
        <ul className={styles.actionList}>
          {context.suggestedActions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>
      </section>

      <section className={styles.panelMuted}>
        <h3 className={styles.panelTitle}>Prototype guardrail</h3>
        <p className={styles.summary}>{context.guardrailNote}</p>
      </section>
    </aside>
  )
}
