import { useState } from 'react'
import type { CandidateCase } from '../domain/onboarding'
import styles from './CandidateRow.module.css'

interface CandidateRowProps {
  candidate: CandidateCase
}

const modeLabel = {
  assistant: 'Review with Assistant',
  automation: 'Prepare Automation',
  none: 'Monitor Only',
} as const

export function CandidateRow({ candidate }: CandidateRowProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <article
      className={`${styles.row} ${expanded ? styles.rowExpanded : styles.rowCompact}`}
      onClick={() => setExpanded((p) => !p)}
      role="button"
      aria-expanded={expanded}
    >
      {/* Compact view: single-line bar */}
      <div className={styles.compactMain}>
        <h3 className={styles.name}>{candidate.candidateName}</h3>
        <span className={styles.stepBadge}>{candidate.badgeLabel}</span>
        <span className={styles.severityBadge} data-queue={candidate.queueCategory}>
          {candidate.severityLabel}
        </span>
      </div>
      <div className={styles.compactAside}>
        <span className={styles.slaChip}>{candidate.slaHoursRemaining}h left</span>
        <button
          type="button"
          className={styles.actionButton}
          onClick={(e) => {
            e.stopPropagation()
          }}
          aria-label={modeLabel[candidate.actionMode]}
        >
          {expanded ? modeLabel[candidate.actionMode] : '→'}
        </button>
      </div>

      {/* Expanded view: full details */}
      {expanded && (
        <div className={styles.expandedContent}>
          <div className={styles.rowMain}>
            <p className={styles.statusLine}>
              {candidate.stepLabel} | {candidate.statusLabel}
            </p>
            <p className={styles.riskReason}>{candidate.riskReason}</p>

            <dl className={styles.metaGrid}>
              <div>
                <dt>Phase</dt>
                <dd>{candidate.phase}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{candidate.startDateLabel}</dd>
              </div>
              <div>
                <dt>Next step</dt>
                <dd>{candidate.nextStep}</dd>
              </div>
            </dl>
          </div>

          <div className={styles.rowAside}>
            <div className={styles.signalList} aria-label="Case signal indicators">
              <span>Queue: {candidate.severityLabel}</span>
              <span>SLA: {candidate.slaHoursRemaining}h left</span>
              <span>Comms: {candidate.unresolvedComms7Days} open</span>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
