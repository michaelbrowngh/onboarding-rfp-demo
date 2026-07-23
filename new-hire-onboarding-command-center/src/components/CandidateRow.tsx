import { useState } from 'react'
import type { CandidateCase } from '../domain/onboarding'
import styles from './CandidateRow.module.css'

interface CandidateRowProps {
  candidate: CandidateCase
  onCandidateAction?: (mode: 'ai-action' | 'ai-review') => void
  onAutomationComplete?: (candidate: CandidateCase) => void
}

const checkIconSvg = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="10" cy="10" r="8.5" fill="currentColor" fillOpacity="0.18" />
    <path
      d="M5.5 10.25L8.5 13.25L14.5 6.75"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const sparkleIconSvg = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M9.5 3L10.7 7.3L15 8.5L10.7 9.7L9.5 14L8.3 9.7L4 8.5L8.3 7.3L9.5 3Z"
      fill="currentColor"
    />
    <path
      d="M15.5 12L16.15 14.15L18.3 14.8L16.15 15.45L15.5 17.6L14.85 15.45L12.7 14.8L14.85 14.15L15.5 12Z"
      fill="currentColor"
    />
  </svg>
)

const magnifierIconSvg = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="8.75" cy="8.75" r="5.25" stroke="currentColor" strokeWidth="1.8" />
    <line x1="12.8" y1="12.8" x2="17" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

export function CandidateRow({ candidate, onCandidateAction, onAutomationComplete }: CandidateRowProps) {
  const [expanded, setExpanded] = useState(false)
  const [automationState, setAutomationState] = useState<'idle' | 'in-progress' | 'done'>('idle')

  const handleAutomationClick = () => {
    if (automationState !== 'idle') {
      return
    }
    setAutomationState('in-progress')
    setTimeout(() => {
      setAutomationState('done')
      onAutomationComplete?.(candidate)
    }, 700)
  }

  return (
    <article
      className={`${styles.row} ${expanded ? styles.rowExpanded : ''}`}
      data-queue={candidate.queueCategory}
      onClick={() => setExpanded((p) => !p)}
      role="button"
      aria-expanded={expanded}
    >
      {/* Header: name+badge fixed-width left, summary/next middle, button right */}
      <div className={styles.rowHeader}>
        <div className={styles.rowHeaderLeft}>
          <h3 className={styles.name}>{candidate.candidateName}</h3>
          <span className={styles.stepBadge}>{candidate.badgeLabel}</span>
        </div>

        {!expanded && (
          <div className={styles.compactDetails}>
            <div className={styles.compactSummary}>{candidate.statusLabel}</div>
            <div className={styles.compactNext}>Next: {candidate.nextStep}</div>
          </div>
        )}

        <div className={styles.actionGroup}>
          {candidate.actionMode === 'automation' && (
            <button
              type="button"
              className={`${styles.actionButton} ${styles.actionButtonAutomation} ${
                automationState === 'done' ? styles.actionButtonDone : ''
              }`}
              onClick={(e) => {
                e.stopPropagation()
                handleAutomationClick()
              }}
              disabled={automationState !== 'idle'}
              aria-label="Take Action"
            >
              <span className={styles.chatIconInline}>{checkIconSvg}</span>
              {automationState === 'idle' && 'Take Action'}
              {automationState === 'in-progress' && 'Updating…'}
              {automationState === 'done' && 'Action Completed'}
            </button>
          )}

          {candidate.actionMode === 'ai-action' && (
            <button
              type="button"
              className={`${styles.actionButton} ${styles.actionButtonAiAction}`}
              onClick={(e) => {
                e.stopPropagation()
                onCandidateAction?.('ai-action')
              }}
              aria-label="Take Action with AI"
            >
              <span className={styles.chatIconInline}>{sparkleIconSvg}</span>
              Take Action with AI
            </button>
          )}

          {candidate.actionMode === 'ai-review' && (
            <button
              type="button"
              className={`${styles.actionButton} ${styles.actionButtonAiReview}`}
              onClick={(e) => {
                e.stopPropagation()
                onCandidateAction?.('ai-review')
              }}
              aria-label="Review with AI"
            >
              <span className={styles.chatIconInline}>{magnifierIconSvg}</span>
              Review with AI
            </button>
          )}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className={styles.expandedContent}>
          <div className={styles.expandedFields}>
            <div className={styles.expandedField}>
              <span className={styles.fieldLabel}>Step</span>
              <p className={styles.fieldValue}>
                {candidate.stepLabel} · {candidate.phase}
              </p>
            </div>

            <div className={styles.expandedField}>
              <span className={styles.fieldLabel}>Timeline</span>
              <div className={styles.timelineValue}>
                <span className={styles.fieldValue}>{candidate.startDateLabel}</span>
                <span className={styles.stepBadge}>
                  SLA: {candidate.slaHoursRemaining}h / {candidate.slaWindowHours}h
                </span>
              </div>
            </div>

            <div className={styles.expandedField}>
              <span className={styles.fieldLabel}>Status</span>
              <p className={styles.fieldValue}>{candidate.riskReason}</p>
            </div>

            <div className={styles.expandedField}>
              <span className={styles.fieldLabel}>Next step</span>
              <p className={styles.fieldValue}>{candidate.nextStep}</p>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
