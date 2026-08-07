import { useRef, useState } from 'react'
import { candidateCases } from '../data/candidateCases'
import {
  DEMO_LAST_REFRESH_LABEL,
} from '../data/demoDate'
import { kpiSnapshots } from '../data/kpiSnapshots'
import type { AssistantContext, CandidateCase } from '../domain/onboarding'
import { AssistantSidecar } from '../components/AssistantSidecar'
import { CandidateSection } from '../components/CandidateSection'
import { HeaderBar } from '../components/HeaderBar'
import KpiRail from '../components/KpiRail'
import styles from './CommandCenterPage.module.css'

const AI_KPI_SUMMARY =
  '10 candidates are approaching an SLA threshold. The largest current risks are pre-check data accuracy, medical readiness before Day 1, and start-date realignment within 72 hours.'

const queueDescriptions = {
  critical:
    'Blocking prerequisites or expiring SLA windows that need intervention before the next handoff.',
  'action-required':
    'Cases waiting on operations judgment, manager approval, or curated outbound communication.',
  warning:
    'Signals that deserve monitoring before they escalate into a blocked start-date commitment.',
} as const

const assistantContext: AssistantContext = {
  heading: 'Assistant readiness snapshot',
  status: '',
  summary:
    'Avery Collins, Nadia Ortiz, Jordan Patel, and Sofia Martinez represent the four new high-impact scenarios: pre-check accuracy, candidate experience sentiment decline, Day 1 realignment, and pre-Day 1 readiness.',
  suggestedActions: [
    'Explain root-cause drivers for the pre-check accuracy and medical-readiness alerts.',
    'Review sentiment drivers and propose the next outreach path for Jordan Patel.',
    'Generate a stakeholder realignment sequence for Sofia Martinez.',
  ],
  guardrailNote: '',
}

function filterCandidates(queue: CandidateCase['queueCategory']) {
  return candidateCases.filter((candidate) => candidate.queueCategory === queue)
}

export function CommandCenterPage() {
  const [sidecarOpen, setSidecarOpen] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateCase | undefined>(undefined)
  const [promotedToActionCandidates, setPromotedToActionCandidates] = useState<Record<string, true>>({})
  const [pendingAction, setPendingAction] = useState<
    { candidateId: string; mode: 'ai-action' | 'ai-review'; requestId: number } | undefined
  >(undefined)
  const [completionBanner, setCompletionBanner] = useState<string | undefined>(undefined)
  const requestIdRef = useRef(0)

  const withPromotedAction = (candidates: CandidateCase[]) =>
    candidates.map((candidate) =>
      promotedToActionCandidates[candidate.id]
        ? { ...candidate, actionMode: 'ai-action' as const }
        : candidate
    )

  const criticalCases = withPromotedAction(filterCandidates('critical'))
  const actionRequiredCases = withPromotedAction(filterCandidates('action-required'))
  const warningCases = withPromotedAction(filterCandidates('warning'))
  const allCases = [...criticalCases, ...actionRequiredCases, ...warningCases]

  const handleCandidateAction = (candidate: CandidateCase, mode: 'ai-action' | 'ai-review') => {
    requestIdRef.current += 1
    setSelectedCandidate(candidate)
    setSidecarOpen(true)
    setPendingAction({ candidateId: candidate.id, mode, requestId: requestIdRef.current })
  }

  const handleAutomationComplete = (candidate: CandidateCase) => {
    setCompletionBanner(`${candidate.candidateName}: ${candidate.actionDetail}`)
  }

  const handleBackToGeneral = () => {
    setSelectedCandidate(undefined)
  }

  const handleReviewPlanConfirmed = (candidateId: string) => {
    setPromotedToActionCandidates((current) => ({ ...current, [candidateId]: true }))
    setCompletionBanner('Plan confirmed. Queue action is now set to Action with AI for downstream execution.')
  }

  return (
    <main className={styles.pageShell}>
      {completionBanner && (
        <div className={styles.completionBanner} role="status">
          <span className={styles.completionBannerIcon} aria-hidden="true">
            ✓
          </span>
          <span className={styles.completionBannerText}>{completionBanner}</span>
          <button
            type="button"
            className={styles.completionBannerClose}
            onClick={() => setCompletionBanner(undefined)}
            aria-label="Dismiss confirmation"
          >
            ×
          </button>
        </div>
      )}
      <div className={styles.backdrop}>
        <div className={`${styles.layout} ${sidecarOpen ? styles.layoutSidecarOpen : ''}`}>
          {/* Column 1: KPI Rail */}
          <KpiRail
            kpis={kpiSnapshots}
            summary={AI_KPI_SUMMARY}
            candidates={allCases}
            onCandidateAction={handleCandidateAction}
          />

          {/* Column 2: Main content */}
          <div className={styles.mainColumn}>
            <HeaderBar
              lastRefreshLabel={DEMO_LAST_REFRESH_LABEL}
            />
            <div className={styles.sectionsScroll}>
              <CandidateSection
                title="Candidates - Critical"
                description={queueDescriptions.critical}
                candidates={criticalCases}
                onCandidateAction={handleCandidateAction}
                onAutomationComplete={handleAutomationComplete}
              />
              <CandidateSection
                title="Candidates - Action Required"
                description={queueDescriptions['action-required']}
                candidates={actionRequiredCases}
                onCandidateAction={handleCandidateAction}
                onAutomationComplete={handleAutomationComplete}
              />
              <CandidateSection
                title="Candidates - Warning / Flags"
                description={queueDescriptions.warning}
                candidates={warningCases}
                onCandidateAction={handleCandidateAction}
                onAutomationComplete={handleAutomationComplete}
              />
            </div>
          </div>

          {/* Column 3: Assistant Sidecar */}
          <div className={styles.sidecarColumn}>
            <AssistantSidecar
              context={assistantContext}
              isOpen={sidecarOpen}
              onToggle={() => setSidecarOpen((p) => !p)}
              selectedCandidate={selectedCandidate}
              onBackToGeneral={handleBackToGeneral}
              pendingAction={pendingAction}
              onReviewPlanConfirmed={handleReviewPlanConfirmed}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
